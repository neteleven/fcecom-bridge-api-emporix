const { generateRequestMock, generateResponseMock } = require('../../src/utils/testUtils');
const Content = require('../../src/controllers/Content');
const writer = require('../../src/utils/writer');

jest.mock('../../src/utils/writer.js', () => ({
    respondWithCode: (code, payload) => ({ code, payload }),
    writeJson: jest.fn()
}));

describe('Content', () => {
    const service = {
        contentGet: jest.fn(),
        contentContentIdsGet: jest.fn(),
        contentPost: jest.fn(),
        contentContentIdPut: jest.fn(),
        contentContentIdDelete: jest.fn()
    };
    const controller = Content(service);

    describe('contentGet', () => {
        it('calls contentGet method from service', async () => {
            const resMock = generateResponseMock();
            const reqMock = generateRequestMock();

            service.contentGet.mockResolvedValue({
                contentPages: ['hello-world', 'hello-world-2', 'hello-world-3', 'hello-world-4', 'hello-world-5'],
                total: 5,
                hasNext: false
            });
            const testQuery = 'world';
            const testLang = 'en';
            const testPage = 1;
            reqMock.query = {
                q: testQuery,
                lang: testLang,
                page: testPage
            };

            await controller.contentGet(reqMock, resMock);

            expect(service.contentGet.mock.calls.length).toBe(1);
            expect(service.contentGet.mock.calls[0][0]).toEqual(testQuery);
            expect(service.contentGet.mock.calls[0][1]).toEqual(testLang);
            expect(service.contentGet.mock.calls[0][2]).toEqual(testPage);
            expect(writer.writeJson).toHaveBeenCalledTimes(1);
        });
        it('handles HEAD requests', async () => {
            const resMock = generateResponseMock();
            const reqMock = generateRequestMock();
            reqMock.method = 'HEAD';
            const controller = Content(service, { contentPages: true });

            await controller.contentGet(reqMock, resMock);

            expect(service.contentGet.mock.calls.length).toBe(0);
            expect(resMock.sendStatus).toBeCalledWith(200);
        });
        it('returns error on invalid page', async () => {
            const resMock = generateResponseMock();
            const reqMock = generateRequestMock();

            const testQuery = 'world';
            const testLang = 'en';
            const testPage = 'INVALIDPAGE';

            reqMock.query = {
                q: testQuery,
                lang: testLang,
                page: testPage
            };

            await controller.contentGet(reqMock, resMock);

            expect(service.contentGet.mock.calls.length).toBe(0);
            expect(writer.writeJson).toBeCalledWith(resMock, expect.objectContaining({ code: 400, payload: {error: '"page" is not a number'}}));
        });
    });
    describe('contentContentIdsGet', () => {
        it('calls contentContentIdsGet method from service', async () => {
            const resMock = generateResponseMock();
            const reqMock = generateRequestMock();

            const testContentIdsParameter = 'hello-world-2,hello-world-3';
            const testContentIds = testContentIdsParameter.split(',');
            service.contentContentIdsGet.mockResolvedValue({
                content: testContentIds,
                total: 2,
                hasNext: false
            });
            const testLang = 'en';
            reqMock.query = {
                lang: testLang
            };
            reqMock.params = {
                contentIds: testContentIdsParameter
            };

            await controller.contentContentIdsGet(reqMock, resMock);

            expect(service.contentContentIdsGet.mock.calls.length).toBe(1);
            expect(service.contentContentIdsGet.mock.calls[0][0]).toEqual(testContentIds);
            expect(service.contentContentIdsGet.mock.calls[0][1]).toEqual(testLang);
            expect(writer.writeJson).toHaveBeenCalledTimes(1);
        });
        it('writes an error for missing content ids', async () => {
            const resMock = generateResponseMock();
            const reqMock = generateRequestMock();

            const testLang = 'en';
            reqMock.query = {
                lang: testLang
            };
            reqMock.params = {
                contentIds: ''
            };

            await controller.contentContentIdsGet(reqMock, resMock);

            expect(service.contentContentIdsGet.mock.calls.length).toBe(0);
            expect(writer.writeJson).toBeCalledWith(resMock, expect.objectContaining({
                code: 400,
                payload: { error: '\"contentIds\" is an empty string' }
            }));
        });
    });

    describe('contentHead', () => {
        it('returns success if content feature is enabled', async () => {
            const resMock = generateResponseMock();
            const reqMock = generateRequestMock();

            const controller = Content(service, { contentPages: true });

            await controller.contentHead(reqMock, resMock);

            expect(resMock.sendStatus.mock.calls[0][0]).toEqual(200);
        });
        it('returns an error if content feature is disabled', async () => {
            const resMock = generateResponseMock();
            const reqMock = generateRequestMock();

            const controller = Content(service, { contentPages: false });

            await controller.contentHead(reqMock, resMock);

            expect(resMock.sendStatus.mock.calls[0][0]).toEqual(404);
        });
    });

    describe('contentPost', () => {
        it('writes an error for empty body', async () => {
            const resMock = generateResponseMock();
            const reqMock = generateRequestMock();

            reqMock.body = {};

            await controller.contentPost(reqMock, resMock);

            expect(service.contentPost.mock.calls.length).toBe(0);
            expect(writer.writeJson).toBeCalledWith(resMock, expect.objectContaining({
                code: 400,
                payload: { error: '\"body\" is an empty object' }
            }));
        });
    });

    describe('contentContentIdPut', () => {
        it('writes an error for missing content id', async () => {
            const resMock = generateResponseMock();
            const reqMock = generateRequestMock();

            reqMock.params = {
                contentId: undefined
            };
            reqMock.body = { content: 'ANY' };

            await controller.contentContentIdPut(reqMock, resMock);

            expect(service.contentContentIdPut.mock.calls.length).toBe(0);
            expect(writer.writeJson).toBeCalledWith(resMock, expect.objectContaining({
                code: 400,
                payload: { error: '\"contentId\" is not a string' }
            }));
        });
        it('writes an error for empty body', async () => {
            const resMock = generateResponseMock();
            const reqMock = generateRequestMock();

            reqMock.params = {
                contentId: 'ID'
            };
            reqMock.body = {};

            await controller.contentContentIdPut(reqMock, resMock);

            expect(service.contentContentIdPut.mock.calls.length).toBe(0);
            expect(writer.writeJson).toBeCalledWith(resMock, expect.objectContaining({
                code: 400,
                payload: { error: '\"body\" is an empty object' }
            }));
        });
    });

    describe('contentContentIdDelete', () => {
        it('writes an error for missing content id', async () => {
            const resMock = generateResponseMock();
            const reqMock = generateRequestMock();

            reqMock.params = {
                contentId: undefined
            };
            reqMock.body = { content: 'ANY' };

            await controller.contentContentIdDelete(reqMock, resMock);

            expect(service.contentContentIdDelete.mock.calls.length).toBe(0);
            expect(writer.writeJson).toBeCalledWith(resMock, expect.objectContaining({
                code: 400,
                payload: { error: '\"contentId\" is not a string' }
            }));
        });
    });
});
