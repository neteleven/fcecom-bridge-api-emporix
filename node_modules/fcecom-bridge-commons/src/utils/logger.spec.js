const logger = require('./logger');
const chalk = require('chalk');

const testDateTime = '1977-05-04 12:00:00';

describe('logger', () => {
    beforeAll(() => {
        // set system time to a fixed one for testing
        jest.useFakeTimers('modern');
        jest.setSystemTime(new Date(1977, 4, 4, 12, 0, 0));
    });


    describe('getLogger', () => {
        it('creates a logger if not existent', () => {
            // Act
            const testLogger = logger.getLogger();
            // Assert
            expect(testLogger).toHaveProperty('logDebug');
        });
        it('returns existing logger', () => {
            // Act
            const testLogger = logger.getLogger();
            const testLogger2 = logger.getLogger();
            // Assert
            expect(testLogger).toHaveProperty('logDebug');
            expect(testLogger).toBe(testLogger2);
        });
    });

    describe('getDateTime', () => {
        it('returns Date and Time as String', () => {
            const dateTimeString = logger.getDateTime();
            expect(dateTimeString).toEqual(testDateTime);
        });
    });

    describe('createLogger', () => {
        describe('logDebug', () => {
            it('should print the message and separate string args with pipes in console.debug', () => {
                // arrange
                const stringArg1 = 'test1';
                const stringArg2 = 'test2';
                const expectedLog = `${chalk.gray(`${testDateTime} | ${chalk.bgWhite.black(' DEBUG ')} | ${stringArg1} | ${stringArg2}`)}`;
                const consoleSpy = jest.spyOn(console, 'debug');

                const testLogger = logger.createLogger('DEBUG');

                // act
                testLogger.logDebug(stringArg1, stringArg2);

                // assert
                expect(consoleSpy).toHaveBeenCalledWith(expectedLog);
            });

            it('should print print an object as json string in console.debug', () => {
                // arrange
                const testObject = {
                    prop1: 'prop1',
                    prop2: 'prop2'
                };
                const testObjectJsonString = JSON.stringify(testObject);
                const expectedLog = `${chalk.gray(`${testDateTime} | ${chalk.bgWhite.black(' DEBUG ')} | ${testObjectJsonString}`)}`;
                const consoleSpy = jest.spyOn(console, 'debug');

                const testLogger = logger.createLogger('DEBUG');

                // act
                testLogger.logDebug(testObject);

                // assert
                expect(consoleSpy).toHaveBeenCalledWith(expectedLog);
            });

            it('should not print the message in console.debug on higher logLevels', () => {
                // arrange
                const consoleSpy = jest.spyOn(console, 'debug');

                const testLogger = logger.createLogger('INFO');

                // act
                testLogger.logDebug('test');

                // assert
                expect(consoleSpy).not.toHaveBeenCalled();
            });
        });

        describe('logInfo', () => {
            it('should print the message and separate string args with pipes in console.info', () => {
                // arrange
                const stringArg1 = 'test1';
                const stringArg2 = 'test2';
                const expectedLog = `${chalk.blue(`${testDateTime} | ${chalk.bgBlue.white(' INFO  ')} | ${stringArg1} | ${stringArg2}`)}`;
                const consoleSpy = jest.spyOn(console, 'info');

                const testLogger = logger.createLogger('INFO');
                // act

                testLogger.logInfo(stringArg1, stringArg2);

                // assert
                expect(consoleSpy).toHaveBeenCalledWith(expectedLog);
            });

            // special case create logger without defined log level
            it('should print the message and separate string args with pipes in console.info if no loglevel is defined', () => {
                // arrange
                const stringArg1 = 'test1';
                const stringArg2 = 'test2';
                const expectedLog = `${chalk.blue(`${testDateTime} | ${chalk.bgBlue.white(' INFO  ')} | ${stringArg1} | ${stringArg2}`)}`;
                const consoleSpy = jest.spyOn(console, 'info');

                // no log level defined
                const testLogger = logger.createLogger();
                // act

                testLogger.logInfo(stringArg1, stringArg2);

                // assert
                expect(consoleSpy).toHaveBeenCalledWith(expectedLog);
            });

            it('should not print the message in console.info on higher logLevels', () => {
                // arrange
                const consoleSpy = jest.spyOn(console, 'info');

                const testLogger = logger.createLogger('WARNING');

                // act
                testLogger.logInfo('test');

                // assert
                expect(consoleSpy).not.toHaveBeenCalled();
            });
        });

        describe('log', () => {
            it('should print the message and separate string args with pipes in console.info', () => {
                // arrange
                const stringArg1 = 'test1';
                const stringArg2 = 'test2';
                const expectedLog = `${chalk.blue(`${testDateTime} | ${chalk.bgBlue.white(' INFO  ')} | ${stringArg1} | ${stringArg2}`)}`;
                const consoleSpy = jest.spyOn(console, 'info');

                const testLogger = logger.createLogger('INFO');
                // act

                testLogger.log(stringArg1, stringArg2);

                // assert
                expect(consoleSpy).toHaveBeenCalledWith(expectedLog);
            });

            it('should not print the message in console.info on higher logLevels', () => {
                // arrange
                const consoleSpy = jest.spyOn(console, 'info');

                const testLogger = logger.createLogger('WARNING');

                // act
                testLogger.logInfo('test');

                // assert
                expect(consoleSpy).not.toHaveBeenCalled();
            });
        });

        describe('logWarning', () => {
            it('should print the message and separate string args with pipes in console.warn', () => {
                // arrange
                const stringArg1 = 'test1';
                const stringArg2 = 'test2';
                const expectedLog = `${chalk.yellow(
                    `${testDateTime} | ${chalk.bgYellow.black(' WARN  ')} | ${stringArg1} | ${stringArg2}`
                )}`;
                const consoleSpy = jest.spyOn(console, 'warn');

                const testLogger = logger.createLogger('WARNING');

                // act
                testLogger.logWarning(stringArg1, stringArg2);

                // assert
                expect(consoleSpy).toHaveBeenCalledWith(expectedLog);
            });

            it('should not print the message in console.warn on higher logLevels', () => {
                // arrange
                const consoleSpy = jest.spyOn(console, 'info');
                const testLogger = logger.createLogger('ERROR');

                // act
                testLogger.logWarning('test');

                // assert
                expect(consoleSpy).not.toHaveBeenCalled();
            });
        });

        describe('logError', () => {
            it('should print the message and separate string args with pipes in console.error', () => {
                // arrange
                const stringArg1 = 'test1';
                const stringArg2 = 'test2';
                const expectedLog = `${chalk.red(`${testDateTime} | ${chalk.bgRed.black(' ERROR ')} | ${stringArg1} | ${stringArg2}`)}`;
                const consoleSpy = jest.spyOn(console, 'error');

                const testLogger = logger.createLogger('ERROR');

                // act
                testLogger.logError(stringArg1, stringArg2);

                // assert
                expect(consoleSpy).toHaveBeenCalledWith(expectedLog);
            });

            it('should print an error in console.error', () => {
                // arrange
                const testError = new Error('test error message');
                const expectedLog = `${chalk.red(
                    `${testDateTime} | ${chalk.bgRed.black(' ERROR ')} | ${testError.name} | ${testError.message}`
                )}`;
                const consoleSpy = jest.spyOn(console, 'error');

                const testLogger = logger.createLogger('ERROR');

                // act
                testLogger.logError(testError);

                // assert
                expect(consoleSpy).toHaveBeenCalledWith(expectedLog);
            });

            it('should not print the message in console.error  on higher logLevels', () => {
                // arrange
                const consoleSpy = jest.spyOn(console, 'error');

                const testLogger = logger.createLogger('NONE');

                // act
                testLogger.logError('test');

                // asssert
                expect(consoleSpy).not.toHaveBeenCalled();
            });
        });
    });

    afterAll(() => {
        // clear fixed time
        jest.useRealTimers();
    });
});
