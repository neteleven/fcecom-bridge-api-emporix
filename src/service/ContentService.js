/**
 * Fetches a Content Page based on its Id and returns its URL
 * @param {string} contentId the Id of the Content Page whose URL is requested
 * @param {string} lang the language used for the API Call
 * @return {{url: string}} The URL of the given product, null if given ID is invalid.
 */
const getContentUrl = async (_contentId, _lang) => {
    return '';
};

/**
 * Fetches a Content Page based on its URL and returns its type and Id
 * @param {string} url the URL of the Content Page whose Id is requested
 * @param {string} lang the language used for the API Call
 * @return {Promise<string>} The identifier of the given page.
 */
const getContentIdByUrl = async (_url, _lang = 'en') => {
    return { error: "not supported" };
};

/**
 * This method returns all content pages.
 * Will also update the cache with the latest values.
 *
 * @param {string} query Query string to search pages for.
 * @param {string} [lang] Language of the request.
 * @param {number} [page=1] Number of the page to retrieve.
 * @return An array containing all content pages.
 */
const contentGet = async (_query, _lang, _page) => {
    return {
        content: [],
        total: 0,
        hasNext: false
    };
};

/**
 * This method returns the content pages with the given IDs.
 * Will ignore invalid IDs.
 *
 * @param {number[]} contentIds Array of IDs of content pages to get.
 * @param {string} [lang] Language of the request.
 * @return {[*]} The content pages for the given IDs.
 */
const contentContentIdsGet = async (_contentIds, _lang) => {
    return {
        content: [],
        total: 0,
        hasNext: false
    };
};

/**
 * This method creates a page.
 *
 * @param {object} payload Payload created using `createPagePayload`.
 * @return {*} The response data received from the API.
 */
const contentPost = async (_payload) => {
    return { error: "not supported" };
};

/**
 * This method moves or renames a page.
 *
 * @param {number} contentId ID of the page to move or rename.
 * @param {object} payload Payload created using `createPagePayload` containing the new values.
 */
const contentContentIdPut = async (_payload, _contentId) => {
    return { error: "not supported" };
};

/**
 * This method deletes the page with the given ID.
 *
 * @param {number} contentId ID of the page to delete.
 */
const contentContentIdDelete = async (_contentId) => {
};

module.exports = {
    contentContentIdsGet,
    getContentUrl,
    getContentIdByUrl,
    contentGet,
    contentPost,
    contentContentIdPut,
    contentContentIdDelete
};
