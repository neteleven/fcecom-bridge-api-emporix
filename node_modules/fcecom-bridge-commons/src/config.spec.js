const { getConfig } = require('./config');

describe('Config', () => {
    describe('getConfig', () => {
        it('uses the given config', async () => {
            const config = {
                username: 'johndoe',
                password: 'password123',
                servicesDir: 'SERVICES',
                port: 1337,
                logLevel: 'INFO',
                features: {
                    contentPages: true,
                    categoryTree: true
                },
                useSsl: true,
                sslCert: 'CERT',
                sslKey: 'KEY'
            };

            const result = getConfig(config);

            expect(result).toEqual(config);
        });
        it('throws an error if no username is given', async () => {
            const config = {
                password: 'password123',
                servicesDir: 'SERVICES',
                port: 3000,
                logLevel: 'INFO',
                features: {
                    contentPages: true,
                    categoryTree: true
                }
            };

            expect(() => getConfig(config)).toThrow('No username set');
        });
        it('throws an error if no password is given', async () => {
            const config = {
                username: 'johndoe',
                servicesDir: 'SERVICES',
                port: 3000,
                logLevel: 'INFO',
                features: {
                    contentPages: true,
                    categoryTree: true
                }
            };

            expect(() => getConfig(config)).toThrow('No password set');
        });
        it('throws an error if no password is given', async () => {
            const config = {
                username: 'johndoe',
                password: 'password',
                port: 3000,
                logLevel: 'INFO',
                features: {
                    contentPages: true,
                    categoryTree: true
                }
            };

            expect(() => getConfig(config)).toThrow('No services directory set');
        });
        it('uses default port', async () => {
            const config = {
                username: 'johndoe',
                password: 'password123',
                servicesDir: 'SERVICES',
                logLevel: 'INFO',
                features: {
                    contentPages: true,
                    categoryTree: true
                }
            };

            const result = getConfig(config);

            expect(result.port).toEqual(3000);
        });
        it('sets features to false by default', async () => {
            const config = {
                username: 'johndoe',
                password: 'password123',
                servicesDir: 'SERVICES',
                port: 3000,
                logLevel: 'INFO'
            };

            const result = getConfig(config);

            expect(result.features.contentPages).toEqual(false);
            expect(result.features.categoryTree).toEqual(false);
        });
        it('throws an error if SSL should be used but no cert is defined', async () => {
            const config = {
                username: 'johndoe',
                password: 'password123',
                servicesDir: 'SERVICES',
                port: 3000,
                logLevel: 'INFO',
                useSsl: true,
                sslCert: undefined,
                sslKey: 'KEY'
            };

            expect(() => getConfig(config)).toThrow('No SSL certificate set');
        });
        it('throws an error if SSL should be used but no key is defined', async () => {
            const config = {
                username: 'johndoe',
                password: 'password123',
                servicesDir: 'SERVICES',
                port: 3000,
                logLevel: 'INFO',
                useSsl: true,
                sslCert: 'CERT',
                sslKey: undefined
            };

            expect(() => getConfig(config)).toThrow('No SSL key set');
        });
        it('falls back to a default value for logLevel', async () => {
            const config = {
                username: 'johndoe',
                password: 'password123',
                servicesDir: 'SERVICES',
                port: 1337,
                features: {
                    contentPages: true,
                    categoryTree: true
                },
                useSsl: true,
                sslCert: 'CERT',
                sslKey: 'KEY'
            };

            const result = getConfig(config);

            expect(result.logLevel).toEqual('INFO');
        });
    });
});
