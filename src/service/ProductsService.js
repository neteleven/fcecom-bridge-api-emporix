const httpClient = require('../utils/http-client');
const logger = require('../utils/logger');

const LOGGING_NAME = 'ProductsService';

const { EMPORIX_TENANT } = process.env;

/**
 * This method fetches all products and transforms them into the internal model.
 *
 * @param { page = 1, productIds, categoryId, q: keyword } The parameters to use.
 * @return The fetched products.
 */
const fetchProducts = async ({ page = 1, productIds, categoryId, q: keyword }) => {
    const fields = 'id,yrn,code,name,description,media,mixins,published,metadata';
    let { products = [], total = 0, hasNext = false, responseStatus = 200 } = {};

    if (productIds) {
        products = await Promise.all(
            productIds.map(async (productId) => {
                const params = `${productId}?${new URLSearchParams({ fields })}`;
                logger.logDebug(LOGGING_NAME, `Performing GET request to /products/ with parameters ${params}`);
                try {
                    //const { data } = await httpClient.get(`/product/${EMPORIX_TENANT}/products/${params}`);
                    const { data } = await httpClient.get(`/product/${EMPORIX_TENANT}/products/${productIds}`);
                    return data;
                } catch (error) {
                    return { errors: true };
                }
            })
        );
        products = products.filter((product) => !product.errors);
        total = products?.length;
    } else {
        const q = `name.localizedMap.de:~(${keyword || ''})`;
        const params = `${new URLSearchParams({ q, /*fields: `products(${fields})`, currentPage: page - 1*/ })}`;

        logger.logDebug(LOGGING_NAME, `Performing GET request to /products/search with parameters ${params}`);
        logger.logInfo(LOGGING_NAME, `Performing GET request to /products/search with parameters ${params}`);

        const { data, status } = await httpClient.get(`/product/${EMPORIX_TENANT}/products?${params}`);
        products = data || [];
        responseStatus = status;
        total = data.pagination?.totalResults || products?.length;
        hasNext = page < data.pagination?.totalPages || false;
    }

    products = products.map(({ code: extract, id, media, name}) => {
        const image = media[0].url;
        const label = name.de;
        const thumbnail = media[0].url;
        return { extract, id, image, label, thumbnail };
    });

    return { products, total, hasNext, responseStatus };
};

/**
 * This method fetches all products and transforms them into the internal model.
 *
 * @param {number} [categoryId] ID of the category to get products from.
 * @param {string} [keyword] Keyword to filter the products by.
 * @param {string} [lang] Language of the request.
 * @param {number} [page=1] Number of the page to retrieve.
 * @return The fetched products.
 */
const productsGet = async (categoryId, keyword, _lang, page = 1) => {
    const { products, total, hasNext } = await fetchProducts({ page, categoryId, q: keyword });

    return { products, total, hasNext };
};

/**
 * This method fetches the data for the products with the given IDs.
 * @see SwaggerUI {@link http://localhost:8080/api/#/Products/productsProductIdsGet}
 *
 * @param {string[]} [productIds] IDs of the categories to get.
 * @return Promise<{ hasNext: boolean, total: number, products: any[]}> The category data.
 */
const productsProductIdsGet = async (productIds) => {
    const { products } = await fetchProducts({ productIds });

    return { products, total: products.length, hasNext: false };
};

module.exports = {
    productsProductIdsGet,
    productsGet,
};
