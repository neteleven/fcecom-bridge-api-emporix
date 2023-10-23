const { extractParameters, getNumber, getString, getObject } = require('./parameterExtractor');
const { ParameterValidationError } = require('./errors');

describe('parameterExtractor', () => {
    describe('extractParameter()', () => {
        it('removes empty parameters', () => {
            const obj = {
                ValidString: 'STRING',
                EmptyString: '',
                SpacesString: '     ',
                UndefinedEntry: undefined,
                NullEntry: null,
                FalseEntry: false,
                TrueEntry: true,
                NumericEntry: 123,
                ZeroEntry: 0
            };

            const result = extractParameters(obj);

            expect(result).not.toBe(obj); // Cloned
            expect(result.ValidString).toEqual('STRING');
            expect(result.hasOwnProperty('EmptyString')).toEqual(false);
            expect(result.hasOwnProperty('SpacesString')).toEqual(false);
            expect(result.hasOwnProperty('UndefinedEntry')).toEqual(false);
            expect(result.hasOwnProperty('NullEntry')).toEqual(false);
            expect(result.FalseEntry).toEqual(false);
            expect(result.TrueEntry).toEqual(true);
            expect(result.NumericEntry).toEqual(123);
            expect(result.ZeroEntry).toEqual(0);
        });
    });
    describe('getNumber()', () => {
        it('returns a number if given value is a numeric string', () => {
            const result = getNumber('123');

            expect(result).toEqual(123);
        });
        it('returns a number if given value is a number', () => {
            const result = getNumber(123);

            expect(result).toEqual(123);
        });
        it('throws if given value is not a numeric string', () => {
            expect(() => {
                getNumber('abc');
            }).toThrow(ParameterValidationError);
        });
        it('throws if given value is not a string', () => {
            expect(() => {
                getNumber(['123']);
            }).toThrow(ParameterValidationError);
        });
        it('throws if given value is undefined', () => {
            expect(() => {
                getNumber(undefined);
            }).toThrow(ParameterValidationError);
        });
        it('throws specific error message', () => {
            expect(() => {
                getNumber('abc', 'LABEL');
            }).toThrow('"LABEL" is not a number');
        });
    });
    describe('getString()', () => {
        it('returns a string if given value is a string', () => {
            const result = getString('abc');

            expect(result).toEqual('abc');
        });
        it('throws if given value is undefined', () => {
            expect(() => {
                getString(undefined);
            }).toThrow(ParameterValidationError);
        });
        it('throws if given value is an empty string', () => {
            expect(() => {
                getString('');
            }).toThrow(ParameterValidationError);
        });
        it('throws specific error message for undefined', () => {
            expect(() => {
                getString(undefined, 'LABEL');
            }).toThrow('"LABEL" is not a string');
        });
        it('throws specific error message for empty strings', () => {
            expect(() => {
                getString('', 'LABEL');
            }).toThrow('"LABEL" is an empty string');
        });
    });
    describe('getObject()', () => {
        it('returns an object if given value is a non-empty object', () => {
            const result = getObject({ a: 'VALUE ' });

            expect(result).toEqual({ a: 'VALUE ' });
        });
        it('throws if given value is undefined', () => {
            expect(() => {
                getObject(undefined);
            }).toThrow(ParameterValidationError);
        });
        it('throws if given value is an empty object', () => {
            expect(() => {
                getObject({});
            }).toThrow(ParameterValidationError);
        });
        it('throws specific error message for undefined', () => {
            expect(() => {
                getObject(undefined, 'LABEL');
            }).toThrow('"LABEL" is not an object');
        });
        it('throws specific error message for empty objects', () => {
            expect(() => {
                getObject({}, 'LABEL');
            }).toThrow('"LABEL" is an empty object');
        });
    });
});
