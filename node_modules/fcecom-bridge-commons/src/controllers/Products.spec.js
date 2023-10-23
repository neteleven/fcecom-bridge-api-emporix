const { generateRequestMock, generateResponseMock } = require('../../src/utils/testUtils');
const Products = require('../../src/controllers/Products');
const writer = require('../../src/utils/writer');

jest.mock('../../src/utils/writer.js', () => ({
    respondWithCode: (code, payload) => ({ code, payload }),
    writeJson: jest.fn()
}));

describe('Products', () => {
    const service = {
        productsGet: jest.fn(),
        productsProductIdsGet: jest.fn()
    };
    const controller = Products(service);

    const testProductsParameter = 'develop,recall-walk-great';
    const testProducts = testProductsParameter.split(',');
    const testLang = 'en';
    describe('productsGet', () => {
        it('calls productsGet method from service', async () => {
            const resMock = generateResponseMock();
            const reqMock = generateRequestMock();

            service.productsGet.mockResolvedValue({
                products: ['pretty-vast-highway', ...testProducts, 'particular', 'paid'],
                total: 5,
                hasNext: false
            });
            const testCategoryId = 'slide-stems-touch';
            const testQuery = 'touch';
            const testPage = 1;
            reqMock.query = {
                categoryId: testCategoryId,
                q: testQuery,
                lang: testLang,
                page: testPage
            };

            await controller.productsGet(reqMock, resMock);

            expect(service.productsGet.mock.calls.length).toBe(1);
            expect(service.productsGet.mock.calls[0][0]).toEqual(testCategoryId);
            expect(service.productsGet.mock.calls[0][1]).toEqual(testQuery);
            expect(service.productsGet.mock.calls[0][2]).toEqual(testLang);
            expect(service.productsGet.mock.calls[0][3]).toEqual(testPage);
            expect(writer.writeJson).toHaveBeenCalledTimes(1);
        });
        it('returns error on invalid page', async () => {
            const resMock = generateResponseMock();
            const reqMock = generateRequestMock();

            const testCategoryId = 'slide-stems-touch';
            const testQuery = 'touch';
            const testPage = 'INVALIDPAGE';
            reqMock.query = {
                categoryId: testCategoryId,
                q: testQuery,
                lang: testLang,
                page: testPage
            };
            await controller.productsGet(reqMock, resMock);

            expect(service.productsGet.mock.calls.length).toBe(0);
            expect(writer.writeJson).toBeCalledWith(resMock, expect.objectContaining({ code: 400, payload: {error: '"page" is not a number'}}));
        });
    });
    describe('productsProductIdsGet', () => {
        it('calls productsProductIdsGet method from service', async () => {
            const resMock = generateResponseMock();
            const reqMock = generateRequestMock();

            service.productsProductIdsGet.mockResolvedValue({
                products: testProducts,
                total: 2,
                hasNext: false
            });
            reqMock.query = {
                lang: testLang
            };
            reqMock.params = {
                productIds: testProductsParameter
            };

            await controller.productsProductIdsGet(reqMock, resMock);

            expect(service.productsProductIdsGet.mock.calls.length).toBe(1);
            expect(service.productsProductIdsGet.mock.calls[0][0]).toEqual(testProducts);
            expect(service.productsProductIdsGet.mock.calls[0][1]).toEqual(testLang);
            expect(writer.writeJson).toHaveBeenCalledTimes(1);
        });
        it('writes an error for missing product ids', async () => {
            const resMock = generateResponseMock();
            const reqMock = generateRequestMock();

            const testLang = 'en';
            reqMock.query = {
                lang: testLang
            };
            reqMock.params = {
                productIds: ''
            };

            await controller.productsProductIdsGet(reqMock, resMock);

            expect(service.productsProductIdsGet.mock.calls.length).toBe(0);
            expect(writer.writeJson).toBeCalledWith(resMock, expect.objectContaining({
                code: 400,
                payload: { error: '\"productIds\" is an empty string' }
            }));
        });
        it('handles HEAD requests', async () => {
            const resMock = generateResponseMock();
            const reqMock = generateRequestMock();
            reqMock.method = 'HEAD';

            await controller.productsProductIdsGet(reqMock, resMock);

            expect(service.productsProductIdsGet.mock.calls.length).toBe(0);
            expect(resMock.sendStatus).toBeCalledWith(200);
        });
    });
    describe('productsProductIdsGetOld (deprecated)', () => {
        it('calls productsProductIdsGet method from service', async () => {
            const resMock = generateResponseMock();
            const reqMock = generateRequestMock();

            service.productsProductIdsGet.mockResolvedValue({
                products: testProducts,
                total: 2,
                hasNext: false
            });
            reqMock.query = {
                lang: testLang
            };
            reqMock.params = {
                productIds: testProductsParameter
            };

            await controller.productsProductIdsGet(reqMock, resMock);

            expect(service.productsProductIdsGet.mock.calls.length).toBe(1);
            expect(service.productsProductIdsGet.mock.calls[0][0]).toEqual(testProducts);
            expect(service.productsProductIdsGet.mock.calls[0][1]).toEqual(testLang);
            expect(writer.writeJson).toHaveBeenCalledTimes(1);
        });
    });
    describe('productsProductIdsHead', () => {
        it('fills the res with a 200 code', async () => {
            const resMock = generateResponseMock();
            const reqMock = generateRequestMock();

            await controller.productsProductIdsHead(reqMock, resMock, undefined);

            expect(resMock.sendStatus.mock.calls.length).toBe(1);
            expect(resMock.sendStatus.mock.calls[0][0]).toBe(200);
        });
    });
});
