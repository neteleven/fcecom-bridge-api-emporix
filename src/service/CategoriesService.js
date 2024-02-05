const httpClient = require('../utils/http-client');
const logger = require('../utils/logger');

const LOGGING_NAME = 'CategoriesService';

const { EMPORIX_TENANT } = process.env;
// Map to cache category IDs in order to resolve their URLs later
const idCache = new Map();

const LIMIT = 20;

/**
 * This method recursively creates a nested tree structure for the given categories.
 *
 * @param {any[]} categories The arrays of categories to work with.
 */
const buildCategoryTree = (categories) =>
    categories.map(({ id, name: label, subcategories = [] }) => {
        const children = buildCategoryTree(subcategories);
        return { ...(children.length && { children }), id, label };
    });

const fetchCategoryTree = async (lang) => {
    let categories = []

    const { data } = await httpClient.get(
        `/category/${EMPORIX_TENANT}/categories?showRoots=true&lang=${lang}`
    );
    for (const rootCategory of data) {
        const { data } = await httpClient.get(
            `/category/${EMPORIX_TENANT}/category-trees/${rootCategory.id}?lang=${lang}&depth=0`
        );
        categories.push(data);
    }

    categories = categories
    .filter((category) => !category.errors)
    .filter((category) => !!category.name)
    .map((category) => {
        return { id: category.id, name: category.name, subcategories: category.subcategories };
    });     
    buildCache(categories);

    return {
        status: 200,
        categories: buildCategoryTree(categories),
    };
};

/**
 * This Method traverses through the Category tree and builds fills the idCache with data
 *
 * @param {any[]} categories: the categories
 */
const buildCache = (categories) => {
    if(categories)
    categories.forEach(({ id, name: label, subcategories }) => {
        idCache.set(id, label);
        idCache.set(label, id);
        buildCache(subcategories);
    });
}

/**
 * This method fetches all categories and returns them as a nested structure.
 * @see SwaggerUI {@link http://localhost:8080/api/#/categories/get_categories}
 *
 * @param {string} lang the language used for the request
 * @param {boolean} getTree flag to decide if a Category List or the Category Tree is retrieved
 * @param {string} parentId a filter attribute to filter the Category tree
 * @return Promise<*> The category tree.
 */
const fetchCategories = async (lang, parentId) => {
    let categories
    if (parentId) {
        try {
            const { data } = await httpClient.get(
                `/category/${EMPORIX_TENANT}/categories/${parentId}/subcategories?lang=${lang}&depth=1`
            );
            categories = data;
        } catch (error) {
            return { errors: true};
        }
    } else {
        try {
            const { data } = await httpClient.get(
                `/category/${EMPORIX_TENANT}/categories?showRoots=true&lang=${lang}`
            );
            categories = data;
        } catch (error) {
            return { errors: true }
        }
    }

    categories = categories
    .filter((category) => !category.errors)
    .filter((category) => !!category.name)
    .map((category) => {
        return { id: category.id, label: category.name };
    });
    return {
        status: categories.status,
        categories: categories,
        total: categories.length
    };
};

/**
 * This method fetches all categories provided via the categoryIds comma seperated string.
 * @see SwaggerUI {@link http://localhost:8080/api/#/categories/get_categories}
 *
 * @param {string[]} categoryIds a comma seperated string to represent the categoryIds (e.G. id1,id2)
 * @param {string} lang the language used for the request
 */
const fetchCategoriesByIds = async ({ categoryIds, lang }) => {
    let categories = await Promise.all(
        categoryIds.map(async (categoryId) => {
            logger.logDebug(
                LOGGING_NAME,
                `Performing GET request to /category/${EMPORIX_TENANT}/categories/${categoryId}?lang=${lang}`
            );

            try {
                const { data } = await httpClient.get(
                    `/category/${EMPORIX_TENANT}/categories/${categoryId}?${new URLSearchParams({ lang })}`
                );
                return data;
            } catch (error) {
                return { errors: true };
            }
        })
    );
    categories = categories
    .filter((category) => !category.errors)
    .filter((category) => !!category.name)
    .map((category) => {
        return { id: category.id, label: category.name };
    });
    const responseStatus = 200;
    return { categories, responseStatus };
};

/**
 * This method fetches all categories and returns them as a flat list structure.
 * @see SwaggerUI {@link http://localhost:8080/api/#/categories/get_categories}
 *
 * @param {number} [parentId] ID of the parent category to filter categories by.
 * @param {string} [lang] Language of the request.
 * @param {number} [page=1] Number of the page to retrieve.
 * @return Promise<{ hasNext: boolean, total: number, categories: any[]}> The category tree.
 */
const categoriesGet = async (parentId, lang, page = 1) => {
    const data = await fetchCategories(lang, parentId, false);

    const total = data.length;
    const pageSize = LIMIT;
    const hasNext = page * pageSize <= total;
    const categories = data.categories;

    return { categories, total, hasNext };
};

/**
 * This method fetches all categories and returns them as a nested structure.
 * @see SwaggerUI {@link http://localhost:8080/api/#/categories/get_categories}
 *
 * @param {number | string} [parentId] ID of the parent category to filter categories by.
 * @param {string} [lang] Language of the request.
 * @return Promise<{ hasNext: boolean, total: number, categories: any[]}> The category tree.
 */
const categoryTreeGet = async (parentId, lang) => {
    const { categories } = await fetchCategoryTree(lang, parentId, true);

    return { categorytree: categories, total: categories.length, hasNext: false };
};

/**
 * This method fetches the data for the categories with the given IDs.
 * @see SwaggerUI {@link http://localhost:8080/api/#/Categories/categoriesCategoryIdsGet}
 *
 * @param {string[]} [categoryIds] IDs of the categories to get.
 * @param {string} [lang] Language of the request.
 * @return Promise<{ hasNext: boolean, total: number, categories: any[]}> The category data.
 */
const categoriesCategoryIdsGet = async (categoryIds, lang) => {
    const { categories } = await fetchCategoriesByIds({ categoryIds, lang });

    return { categories, total: categories.length, hasNext: false };
};

module.exports = {
    categoriesGet,
    categoryTreeGet,
    categoriesCategoryIdsGet
};
