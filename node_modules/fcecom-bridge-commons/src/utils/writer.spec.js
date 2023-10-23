const writer = require('../../src/utils/writer');

describe('writer', () => {
    describe('respondWithCode', () => {
        it('responds with status code without empty payload', () => {
            const result = writer.respondWithCode(200, {});

            expect(result.code).toEqual(200);
            expect(result.payload).toEqual({});
        });
        it('responds with status code and payload', () => {
            const payload = {
                template: 'content',
                visible: true,
                label: 'Homepage',
                parentId: null,
                nextSiblingId: null
            };

            const result = writer.respondWithCode(200, payload);

            expect(result.code).toEqual(200);
            expect(result.payload).toEqual(payload);
        });
    });
});
