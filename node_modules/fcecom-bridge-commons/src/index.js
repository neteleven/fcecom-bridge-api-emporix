const path = require('path');
const { connector } = require('swagger-routes-express');
const https = require('https');
const fs = require('fs');
const express = require('express');
const swaggerUi = require('swagger-ui-express');
const { createApi } = require('./routerUtils');
const { getConfig } = require('./config');
const { PACKAGE_NAME, createLogger, getLogger } = require('./utils/logger');
const { getNumber, getString, getObject } = require('./utils/parameterExtractor');
const yaml = require('js-yaml');
const { BodyValidationError, ParameterValidationError, ShopError } = require('./utils/errors');
const { ErrorCode } = require('./utils/errorUtils');

const LOGGING_NAME = 'BridgeCore';

const BridgeCore = async (config) => {
    config = getConfig(config);

    const logger = createLogger(config.logLevel);

    const onCreateRoute = (method, descriptor) => {
        const [routePath] = descriptor;
        logger.logDebug(PACKAGE_NAME, LOGGING_NAME, `Created route ${method.toUpperCase()} ${routePath}`);
    };

    // Configure swagger-routes-express
    const options = {
        security: {
            basicAuth: (request, response, next) => {
                const auth = `${config.username}:${config.password}`;
                if (request.headers.authorization === `Basic ${Buffer.from(auth).toString('base64')}`) {
                    return next();
                }

                response.set('WWW-Authenticate', 'Basic realm="401"');
                response.status(401).send('Authentication required.');
            }
        },
        onCreateRoute
    };

    const api = createApi(path.join(__dirname, './controllers/'), config.servicesDir, config.features);

    const app = express();
    const apiDefinition = yaml.load(fs.readFileSync(path.join(__dirname, './api/openapi.yaml')));

    app.use(express.json());
    app.use('/docs', swaggerUi.serve, swaggerUi.setup(apiDefinition));

    const connect = connector(api, apiDefinition, options); // make the connector
    connect(app);

    if (config.useSsl) {
        https
            .createServer(
                {
                    key: fs.readFileSync(path.resolve(config.sslKey)),
                    cert: fs.readFileSync(path.resolve(config.sslCert))
                },
                app
            )
            .listen(config.port, () => {
                logger.logInfo(
                    PACKAGE_NAME,
                    LOGGING_NAME,
                    `Your server is listening on port ${config.port} (https://localhost:${config.port})`
                );
                logger.logInfo(PACKAGE_NAME, LOGGING_NAME, `Swagger-ui is available on https://localhost:${config.port}/docs`);
            });
    } else {
        app.listen(config.port, () => {
            logger.logInfo(
                PACKAGE_NAME,
                LOGGING_NAME,
                `Your server is listening on port ${config.port} (https://localhost:${config.port})`
            );
            logger.logInfo(PACKAGE_NAME, LOGGING_NAME, `Swagger-ui is available on https://localhost:${config.port}/docs`);
        });
    }

    const getAppInstance = () => {
        return app;
    };

    return {
        getAppInstance
    };
};

module.exports = {
    BridgeCore,
    createLogger,
    getLogger,
    getNumber,
    getString,
    getObject,
    BodyValidationError,
    ParameterValidationError,
    ShopError,
    ErrorCode
};
