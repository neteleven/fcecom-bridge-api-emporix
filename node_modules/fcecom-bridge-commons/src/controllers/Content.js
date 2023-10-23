'use strict';

const { handleError } = require('../utils/errorUtils');
const { extractParameters, getString, getObject, getNumber } = require('../utils/parameterExtractor');
const { writeJson } = require('../utils/writer');
const { getLogger } = require('../index');
const { PACKAGE_NAME } = require('../utils/logger');

module.exports = function (service, features) {
    const logger = getLogger();
    const LOGGING_NAME = 'Content';

    const contentContentIdDelete = async function contentContentIdDelete(req, res) {
        logger.logDebug(
            PACKAGE_NAME,
            LOGGING_NAME,
            `Received ${req.method} request on /content with parameters ${JSON.stringify({ ...req.params })}`
        );
        try {
            const { contentId } = extractParameters(req.params);
            const response = await service.contentContentIdDelete(getString(contentId, 'contentId'));
            writeJson(res, response);
        } catch (err) {
            handleError(res, err);
        }
    };

    const contentContentIdPut = async function contentContentIdPut(req, res) {
        logger.logDebug(
            PACKAGE_NAME,
            LOGGING_NAME,
            `Received ${req.method} request on /content with parameters ${JSON.stringify({ ...req.params })} and body ${JSON.stringify(
                req.body
            )}`
        );
        try {
            const { contentId } = extractParameters(req.params);
            const { body } = req;
            const response = await service.contentContentIdPut(getObject(body, 'body'), getString(contentId, 'contentId'));
            writeJson(res, response);
        } catch (err) {
            handleError(res, err);
        }
    };

    const contentContentIdsGet = async function contentContentIdsGet(req, res) {
        logger.logDebug(
            PACKAGE_NAME,
            LOGGING_NAME,
            `Received ${req.method} request on /content/ids with parameters ${JSON.stringify({ ...req.query, ...req.params })}`
        );
        try {
            const contentIds = getString(req.params['contentIds'], 'contentIds').split(',');
            const { lang } = extractParameters(req.query);
            const response = await service.contentContentIdsGet(contentIds, lang);
            writeJson(res, response.content);
        } catch (err) {
            handleError(res, err);
        }
    };

    const contentGet = async function contentGet(req, res) {
        if (req.method === 'HEAD') {
            contentHead(req, res);
        } else {
            logger.logDebug(
                PACKAGE_NAME,
                LOGGING_NAME,
                `Received ${req.method} request on /content with parameters ${JSON.stringify({ ...req.query })}`
            );
            try {
                let { q, lang, page } = extractParameters(req.query);
                page = page && getNumber(page, 'page');
                const response = await service.contentGet(q, lang, page);
                res.set({ 'X-Total': response.total, 'X-HasNext': response.hasNext });
                writeJson(res, response.content);
            } catch (err) {
                handleError(res, err);
            }
        }
    };

    const contentHead = function contentHead(req, res) {
        logger.logDebug(PACKAGE_NAME, LOGGING_NAME, `Received ${req.method} request on /content`);
        if (features.contentPages) {
            res.sendStatus(200);
        } else {
            res.sendStatus(404);
        }
    };

    const contentPost = async function contentPost(req, res) {
        logger.logDebug(PACKAGE_NAME, LOGGING_NAME, `Received ${req.method} request on /content with body ${JSON.stringify(req.body)}`);
        try {
            const { body } = req;
            const response = await service.contentPost(getObject(body, 'body'));
            writeJson(res, response);
        } catch (err) {
            handleError(res, err);
        }
    };

    return {
        contentContentIdDelete,
        contentContentIdPut,
        contentContentIdsGet,
        contentGet,
        contentHead,
        contentPost
    };
};
