const { generateRequestMock, generateResponseMock } = require('../../src/utils/testUtils');
const Mapping = require('../../src/controllers/Mapping');
const writer = require('../../src/utils/writer');

jest.mock('../../src/utils/writer.js', () => ({
    respondWithCode: (code, payload) => ({ code, payload }),
    writeJson: jest.fn()
}));

describe('Mapping', () => {
    const service = {
        lookupUrlGet: jest.fn(),
        storefrontUrlGet: jest.fn()
    };
    const controller = Mapping(service);

    const testUrl = 'https://mycommerce.com/catalog/p/pretty-vast-highway?lang=en';
    const testId = 'pretty-vast-highway';
    const testLang = 'en';
    const testType = 'product';
    describe('lookupUrlGet', () => {
        it('calls lookupUrlGet method from service', async () => {
            const resMock = generateResponseMock();
            const reqMock = generateRequestMock();

            service.lookupUrlGet.mockResolvedValue({ type: testType, id: testId, lang: testLang });
            reqMock.query = {
                url: testUrl
            };

            await controller.lookupUrlGet(reqMock, resMock);

            expect(service.lookupUrlGet.mock.calls.length).toBe(1);
            expect(service.lookupUrlGet.mock.calls[0][0]).toEqual(testUrl);
            expect(writer.writeJson).toHaveBeenCalledTimes(1);
        });
        it('throws on missing URL', async () => {
            const resMock = generateResponseMock();
            const reqMock = generateRequestMock();

            reqMock.query = {
                url: undefined
            };

            await controller.lookupUrlGet(reqMock, resMock);

            expect(service.lookupUrlGet.mock.calls.length).toBe(0);
            expect(writer.writeJson).toBeCalledWith(resMock, expect.objectContaining({ code: 400, payload: {error: '"url" is not a string'}}));
        });
    });
    describe('storefrontUrlGet', () => {
        it('calls storefrontUrlGet method from service', async () => {
            const resMock = generateResponseMock();
            const reqMock = generateRequestMock();

            service.storefrontUrlGet.mockResolvedValue({ url: testUrl });
            reqMock.query = {
                type: testType,
                id: testId,
                lang: testLang
            };

            await controller.storefrontUrlGet(reqMock, resMock);

            expect(service.storefrontUrlGet.mock.calls.length).toBe(1);
            expect(service.storefrontUrlGet.mock.calls[0][0]).toBe(testType);
            expect(service.storefrontUrlGet.mock.calls[0][1]).toBe(testId);
            expect(service.storefrontUrlGet.mock.calls[0][2]).toBe('en');
            expect(writer.writeJson).toHaveBeenCalledTimes(1);
        });
        it('throws on missing type', async () => {
            const resMock = generateResponseMock();
            const reqMock = generateRequestMock();

            reqMock.query = {
                type: undefined,
                id: testId,
                lang: testLang
            };

            await controller.storefrontUrlGet(reqMock, resMock);

            expect(service.storefrontUrlGet.mock.calls.length).toBe(0);
            expect(writer.writeJson).toBeCalledWith(resMock, expect.objectContaining({ code: 400, payload: {error: '"type" is not a string'}}));
        });
        it('throws on missing id', async () => {
            const resMock = generateResponseMock();
            const reqMock = generateRequestMock();

            reqMock.query = {
                type: testType,
                id: undefined,
                lang: testLang
            };

            await controller.storefrontUrlGet(reqMock, resMock);

            expect(service.storefrontUrlGet.mock.calls.length).toBe(0);
            expect(writer.writeJson).toBeCalledWith(resMock, expect.objectContaining({ code: 400, payload: {error: '"id" is not a string'}}));
        });
    });
});
