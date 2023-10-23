const getConfig = (config) => {
    const result = {
        username: null,
        password: null,
        servicesDir: null,
        port: 3000,
        logLevel: 'INFO',
        features: {
            contentPages: false,
            categoryTree: false
        },
        useSsl: false,
        sslKey: null,
        sslCert: null
    };
    Object.assign(result, config);

    if (!result.username) {
        throw new Error('No username set');
    }
    if (!result.password) {
        throw new Error('No password set');
    }
    if (!result.servicesDir) {
        throw new Error('No services directory set');
    }

    if (config.useSsl) {
        // Check if certificate and key are set when using SSL
        if (!config.sslCert) {
            throw new Error('No SSL certificate set');
        }
        if (!config.sslKey) {
            throw new Error('No SSL key set');
        }
    }

    return result;
};

module.exports = {
    getConfig
};
