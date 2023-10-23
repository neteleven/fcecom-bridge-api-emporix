'use strict';

const utils = require('../../src/utils/writer.js');
const { handleError } = require('../utils/errorUtils');
const { getString, extractParameters } = require('../utils/parameterExtractor.js');
const { getLogger } = require('../index');
const { PACKAGE_NAME } = require('../utils/logger');

module.exports = function (service) {
    const logger = getLogger();
    const LOGGING_NAME = 'Mapping';

    const lookupUrlGet = async function lookupUrlGet(req, res) {
        logger.logDebug(
            PACKAGE_NAME,
            LOGGING_NAME,
            `Received ${req.method} request on /lookup-url with parameters ${JSON.stringify({ ...req.query })}`
        );
        try {
            const { url } = extractParameters(req.query);
            const response = await service.lookupUrlGet(getString(url, 'url'));
            utils.writeJson(res, response);
        } catch (err) {
            handleError(res, err);
        }
    };

    const storefrontUrlGet = async function storefrontUrlGet(req, res) {
        logger.logDebug(
            PACKAGE_NAME,
            LOGGING_NAME,
            `Received ${req.method} request on /storefront-url with parameters ${JSON.stringify({ ...req.query })}`
        );
        try {
            const { type, id, lang } = extractParameters(req.query);
            const response = await service.storefrontUrlGet(getString(type, 'type'), getString(id, 'id'), lang);
            utils.writeJson(res, response);
        } catch (err) {
            handleError(res, err);
        }
    };

    return {
        lookupUrlGet,
        storefrontUrlGet
    };
};
