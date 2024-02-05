const httpClient = require('../utils/http-client');
const logger = require('../utils/logger');

const LOGGING_NAME = 'CategoriesService';

const { EMPORIX_TENANT } = process.env;

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

const findCategoryWithIdRecursive = (categoryTree, id) => {
    for (const category of categoryTree) {
        if (category.id === id) {
            return category;
        }

        const matchingSubCategory = findCategoryWithIdRecursive(category.subcategories, id);
        if (matchingSubCategory) {
            return matchingSubCategory;
        }
    }

    return null;
}

const fetchCategoryTree = async (lang, parentId) => {
    let categories

    const { data } = await httpClient.get(
        `/category/${EMPORIX_TENANT}/category-trees?lang=${lang}`
    );
    categories = data;

    if (parentId) {
        const parentCategory = findCategoryWithIdRecursive(categories, parentId)
        console.log(JSON.stringify(parentCategory))
        categories = parentCategory?.subcategories ?? []
    }

    categories = categories
    .filter((category) => !category.errors)
    .filter((category) => !!category.name)
    .map((category) => {
        return { id: category.id, name: category.name, subcategories: category.subcategories };
    });

    return {
        status: 200,
        categories: buildCategoryTree(categories),
    };
};

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
                `/category/${EMPORIX_TENANT}/categories/${parentId}/subcategories?lang=${lang}`
            );
            categories = data;
        } catch (error) {
            return { errors: true};
        }
    } else {
        try {
            const { data } = await httpClient.get(
                `/category/${EMPORIX_TENANT}/categories?showRoots=false&lang=${lang}`
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
    const data = await fetchCategories(lang, parentId);

    const total = data.length;
    const pageSize = 60;
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
    const { categories } = await fetchCategoryTree(lang, parentId);

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
