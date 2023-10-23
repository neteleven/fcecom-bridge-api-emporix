const { ParameterValidationError } = require('./errors');
/**
 * Returns whether the given value is considered empty.
 *
 * @param value
 * @return {*}
 */
const isEmpty = function (value) {
    return typeof value === 'undefined' || value === null || (typeof value === 'string' && value.trim().length === 0);
};

/**
 * Returns a copy of the given object with all empty parameters removed.
 * Only works for shallow objects.
 *
 * @param obj Object to remove empty parameters from.
 * @return {*} A cleaned copy of the given object.
 */
const extractParameters = function (obj) {
    const result = {};
    Object.keys(obj).forEach((key) => {
        if (obj.hasOwnProperty(key) && !isEmpty(obj[key])) {
            result[key] = obj[key];
        }
    });
    return result;
};

/**
 * Parses the given value to an integer.
 * Throws a ParameterValidationError if it cannot be parsed.
 *
 * @param value Value to parse.
 * @param [label='value'] Label to assign to the error being thrown.
 * @return {*} The parsed value.
 */
const getNumber = function (value, label = 'value') {
    if (typeof value === 'number') {
        return value;
    }
    if (typeof value !== 'string') {
        // If it is not a string it will not be parse-able
        throw new ParameterValidationError(`"${label}" is not a number`);
    }
    const result = parseInt(value, 10);
    if (isNaN(result)) {
        throw new ParameterValidationError(`"${label}" is not a number`);
    }
    return result;
};

/**
 * Returns the given value as a string.
 * Throws a ParameterValidationError if it is empty or not a string at all.
 *
 * @param value Value to parse.
 * @param [label='value'] Label to assign to the error being thrown.
 * @return {*} The parsed value.
 */
const getString = function (value, label = 'value') {
    if (typeof value !== 'string') {
        throw new ParameterValidationError(`"${label}" is not a string`);
    }
    if (value.trim().length === 0) {
        throw new ParameterValidationError(`"${label}" is an empty string`);
    }
    return value;
};

/**
 * Returns the given value as an object.
 * Throws a ParameterValidationError if it is not an object.
 *
 * @param value Value to parse.
 * @param [label='value'] Label to assign to the error being thrown.
 * @return {*} The parsed value.
 */
const getObject = function (value, label = 'value') {
    if (typeof value !== 'object') {
        throw new ParameterValidationError(`"${label}" is not an object`);
    }
    if (Object.keys(value).length === 0) {
        throw new ParameterValidationError(`"${label}" is an empty object`);
    }
    return value;
};

module.exports = {
    extractParameters,
    getNumber,
    getString,
    getObject
};
