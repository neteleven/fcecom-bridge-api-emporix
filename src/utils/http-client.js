const axios = require('axios');
const oauth = require('axios-oauth-client');
const tokenInterceptor = require('axios-token-interceptor');
const logger = require('./logger');

const LOGGING_NAME = 'http-client';

const {
    OAUTH_TOKEN_URL: url,
    EMPORIX_CLIENT_ID: client_id,
    EMPORIX_CLIENT_SECRET: client_secret,
} = process.env;
const getOwnerCredentials = oauth.client(axios.create(), { url, grant_type: 'client_credentials', client_id, client_secret });

const { BASE_URL } = process.env;
const client = axios.create({ baseURL: BASE_URL });
client.interceptors.request.use(oauth.interceptor(tokenInterceptor, getOwnerCredentials));
client.interceptors.request.use((config) => {
    config.headers['X-Version'] = 'v2';
    return config;
});

let lastError;

client.interceptors.response.use(
    (response) => {
        logger.logInfo(
            LOGGING_NAME,
            `↳ Received response ${response.config.method.toUpperCase()} ${response.config.url} - ${response.status} ${response.statusText}`
        );
        return response;
    },
    (error) => {
        const { message, response } = (lastError = error);
        const data = response?.data || message;
        const status = response?.status || 500;
        if (response) {
            logger.logError(
                LOGGING_NAME,
                `↳ Received response ${response.config.method.toUpperCase()} ${response.config.url} - ${response.status} ${
                    response.statusText
                } ${message} ${JSON.stringify(data, null, 2)}`
            );
        } else {
            logger.logError(LOGGING_NAME, `↳ ${message}`);
        }

        return Promise.reject({ error: true, data, status });
    }
);

module.exports = client;
module.exports.getLastError = () => lastError;
