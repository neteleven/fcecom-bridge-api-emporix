const chalk = require('chalk');
const util = require('util');

let _logger;

const getLogger = () => _logger ?? createLogger(LogLevel.INFO);

const LogLevel = {
    DEBUG: 0 /* all http status codes will be printed */,
    INFO: 100 /* all info messages and success messages will be printed */,
    WARNING: 300 /* all redirects will be printed */,
    ERROR: 400 /* all error codes will be printed */,
    NONE: 900 /* none http status codes will be printed */
};

const PACKAGE_NAME = 'Bridge Commons';

const formatOutput = (...data) => {
    data = data.map((entry) => {
        if (entry instanceof Error) return `${entry.name} | ${entry.message}`;
        if (typeof entry === 'object') return JSON.stringify(entry);
        return entry;
    });
    return util
        .inspect(data.join(' | '), {
            showHidden: false,
            depth: null,
            colors: false,
            compact: true,
            breakLength: Infinity
        })
        .replace(/'/g, '');
};

const createLogger = (logLevel) => {
    let loggerLevel = LogLevel[logLevel];
    if (loggerLevel === undefined) {
        loggerLevel = LogLevel.INFO;
    }

    const logDebug = (...data) => {
        if (loggerLevel <= LogLevel.DEBUG) {
            console.debug(chalk.gray(`${getDateTime()} | ${chalk.bgWhite.black(' DEBUG ')} | ${formatOutput(...data)}`));
        }
    };

    const log = (...data) => {
        logInfo(...data);
    };

    const logInfo = (...data) => {
        if (loggerLevel <= LogLevel.INFO) {
            console.info(chalk.blue(`${getDateTime()} | ${chalk.bgBlue.white(' INFO  ')} | ${formatOutput(...data)}`));
        }
    };
    const logWarning = (...data) => {
        if (loggerLevel <= LogLevel.WARNING) {
            console.warn(chalk.yellow(`${getDateTime()} | ${chalk.bgYellow.black(' WARN  ')} | ${formatOutput(...data)}`));
        }
    };
    const logError = (...data) => {
        if (loggerLevel <= LogLevel.ERROR) {
            console.error(chalk.red(`${getDateTime()} | ${chalk.bgRed.black(' ERROR ')} | ${formatOutput(...data)}`));
        }
    };

    const logger = {
        logDebug,
        log,
        logInfo,
        logWarning,
        logError
    };
    _logger = logger;
    return logger;
};

const getDateTime = () => {
    const currentDate = new Date();
    const twoDigitNumberFormat = new Intl.NumberFormat('en-US', {
        minimumIntegerDigits: 2
    });

    const dateString = `${currentDate.getFullYear()}-${twoDigitNumberFormat.format(
        currentDate.getMonth() + 1
    )}-${twoDigitNumberFormat.format(currentDate.getDate())}`;

    const timeString = `${twoDigitNumberFormat.format(currentDate.getHours())}:${twoDigitNumberFormat.format(
        currentDate.getMinutes()
    )}:${twoDigitNumberFormat.format(currentDate.getSeconds())}`;

    return `${dateString} ${timeString}`;
};

module.exports = {
    LogLevel,
    PACKAGE_NAME,
    getDateTime,
    createLogger,
    getLogger
};
