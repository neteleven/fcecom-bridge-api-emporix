const { handleError } = require('./errorUtils');
const { generateResponseMock } = require('./testUtils');
const { writeJson } = require('../utils/writer');
const { ParameterValidationError, BodyValidationError } = require('./errors');
const { getLogger } = require('./logger');

jest.mock('../utils/writer', () => ({
    respondWithCode: (code, payload) => ({ code, payload }),
    writeJson: jest.fn()
}));


const mockLogger = {
    logDebug: jest.fn(),
    log: jest.fn(),
    logInfo: jest.fn(),
    logWarning: jest.fn(),
    logError: jest.fn()
};
jest.mock('./logger', () => ({
    getLogger: () => mockLogger,
    PACKAGE_NAME: 'PACKAGE_NAME'
}));

describe('errorUtils', () => {
    describe('handleError', () => {
        it('handles parameter validation errors', () => {
            const message = 'MESSAGE';
            const resMock = generateResponseMock();
            const error = new ParameterValidationError(message);

            handleError(resMock, error);

            expect(writeJson).toHaveBeenCalledWith(
                resMock,
                expect.objectContaining({
                    code: 400,
                    payload: { error: message }
                })
            );
            expect(mockLogger.logError).toBeCalledWith('PACKAGE_NAME', 'errorUtils', 'An error occured', error);
        });

        it('handles body validation errors with cause', () => {
            const message = 'MESSAGE';
            const cause = 'CAUSE';
            const options = { cause: cause };
            const resMock = generateResponseMock();
            const error = new BodyValidationError(message, options);

            handleError(resMock, error);

            expect(writeJson).toHaveBeenCalledWith(
                resMock,
                expect.objectContaining({
                    code: 400,
                    payload: { error: cause }
                })
            );
            expect(mockLogger.logError).toBeCalledWith('PACKAGE_NAME', 'errorUtils', 'An error occured', error);
        });

        it('handles body validation errors with message if no cause is passed', () => {
            const message = 'MESSAGE';
            const resMock = generateResponseMock();
            const error = new BodyValidationError(message);

            handleError(resMock, error);

            expect(writeJson).toHaveBeenCalledWith(
                resMock,
                expect.objectContaining({
                    code: 400,
                    payload: { error: message }
                })
            );
            expect(mockLogger.logError).toBeCalledWith('PACKAGE_NAME', 'errorUtils', 'An error occured', error);
        });

        it('handles unknown errors', () => {
            const message = 'MESSAGE';
            const resMock = generateResponseMock();
            const error = new Error(message);

            handleError(resMock, error);

            expect(writeJson).toHaveBeenCalledWith(
                resMock,
                expect.objectContaining({
                    code: 500,
                    payload: { error: 'Unknown error occured' }
                })
            );
            expect(mockLogger.logError).toBeCalledWith('PACKAGE_NAME', 'errorUtils', 'An error occured', error);
        });
    });
});
