/**
 * Error being thrown by failed parameter validation.
 *
 * @param message
 */
const ParameterValidationError = function (message) {
    this.name = 'ParameterValidationError';
    this.message = message;
    this.stack = new Error(message).stack;
};
ParameterValidationError.prototype = new Error();

/**
 * Error to be thrown when creational requests failed due to invalid request body.
 *
 * @param message
 * @param options { cause: mappedErrors }
 */
const BodyValidationError = function (message, options) {
    this.name = 'BodyValidationError';
    this.message = message;
    this.cause = options?.cause;
    this.stack = new Error(message).stack;
};
BodyValidationError.prototype = new Error();

/**
 * Error to be thrown when the shop returned an error.
 *
 * @param message
 * @param options { cause: mappedErrors }
 */
const ShopError = function (message) {
    this.name = 'ShopError';
    this.message = message;
    this.stack = new Error(message).stack;
};
ShopError.prototype = new Error();

module.exports = {
    ParameterValidationError,
    BodyValidationError,
    ShopError
};
