;
/**
 * Log v0.34
 *
 * The Log class provides a means for logging to console.
 *
 * @todo Export all logs to an output directory.
 * trace logs should go one file, >= info should go to one and >= error to another.
 *
 */
export default class Log {
    /**
     * The primary function to be called before any methods can be used.
     * Sets the project name, colour and minimum verbosity level.
     * Initialises the Log class.
     *
     * @param {Configuration} [configuration] - The main configuration object.
     * @param {string} [configuration.projectName] - The name of the project, to be prefixed to all messages.
     * @param {number} [configuration.projectColour] - The escape sequence colour value to display the project name.
     * @param {string} [configuration.verbosity] - The minimum level of message to output.
     */
    static initialise(configuration) {
        Log.projectName = configuration.projectName || '<Project Name>';
        Log.projectColour = `\x1b[38;5;${configuration.projectColour}m` || `\x1b[38;5;27m`;
        Log.verbosity = configuration.verbosity || 'trace';
        Log._initialised = true;
        Log.info('Log initialised.');
    }
    ;
    /**
     * The 'trace' logging method. Used for basic networking related messages. Outputs in grey.
     *
     * @param {string} message - The message to be logged.
     * @param {string} [context] - The context to prefix the message.
     */
    static trace(message, context) {
        if (!(Log._initialised))
            return;
        if (Log._LEVEL_LOOKUP.indexOf(Log.verbosity) <= 0)
            console.log(`[${Log._FG_GREY}${new Date().toUTCString()}${Log._RESET}] `
                + `[${Log._FG_NEBULA}clearfin${Log._RESET}] `
                + `[${Log.projectColour}${Log.projectName}${Log._RESET}]`
                + `${(context) ? ` [${Log._FG_WHITE}${context}${Log._RESET}]` : ''} `
                + `${Log._FG_GREY}${message}${Log._RESET}`);
    }
    ;
    /**
     * The 'info' logging method. Basic debugging and information. Outputs in white.
     *
     * @param {string} message - The message to be logged.
     * @param {string} [context] - The context to prefix the message.
     */
    static info(message, context) {
        if (!(Log._initialised))
            return;
        if (Log._LEVEL_LOOKUP.indexOf(Log.verbosity) <= 1)
            console.log(`[${Log._FG_GREY}${new Date().toUTCString()}${Log._RESET}] `
                + `[${Log._FG_NEBULA}clearfin${Log._RESET}] `
                + `[${Log.projectColour}${Log.projectName}`
                + `${Log._RESET}]${(context) ? ` [${Log._FG_WHITE}${context}${Log._RESET}]` : ''} `
                + `${Log._FG_WHITE}${message}${Log._RESET}`);
    }
    ;
    /**
     * The 'warn' logging method. Warns the user that there may be an issue. Outputs in orange.
     *
     * @param {string} message - The message to be logged.
     * @param {string} [context] - The context to prefix the message.
     */
    static warn(message, context) {
        if (!(Log._initialised))
            return;
        if (Log._LEVEL_LOOKUP.indexOf(Log.verbosity) <= 2)
            console.log(`[${Log._FG_GREY}${new Date().toUTCString()}${Log._RESET}] `
                + `[${Log._FG_NEBULA}clearfin${Log._RESET}] `
                + `[${Log.projectColour}${Log.projectName}`
                + `${Log._RESET}]${(context) ? ` [${Log._FG_WHITE}${context}${Log._RESET}]` : ''} `
                + `${Log._FG_ORANGE}${message}${Log._RESET}`);
    }
    ;
    /**
     * The 'error' logging method. Lets the user know an error has occured. Outputs in red.
     *
     * @param {string} message - The message to be logged.
     * @param {string} [context] - The context to prefix the message.
     */
    static error(message, context) {
        if (!(Log._initialised))
            return;
        if (Log._LEVEL_LOOKUP.indexOf(Log.verbosity) <= 3)
            console.log(`[${Log._FG_GREY}${new Date().toUTCString()}${Log._RESET}] `
                + `[${Log._FG_NEBULA}clearfin${Log._RESET}] `
                + `[${Log.projectColour}${Log.projectName}`
                + `${Log._RESET}]${(context) ? ` [${Log._FG_WHITE}${context}${Log._RESET}]` : ''} `
                + `${Log._FG_RED}${message}${Log._RESET}`);
    }
    ;
    /**
     * The 'fatal' logging method. Highest error, stops the application. Outputs in red.
     *
     * @param {string} message - The message to be logged.
     * @param {string} [context] - The context to prefix the message.
     */
    static fatal(message, context) {
        if (!(Log._initialised))
            return;
        console.log(`[${Log._FG_GREY}${new Date().toUTCString()}${Log._RESET}] `
            + `[${Log._FG_NEBULA}clearfin${Log._RESET}] `
            + `[${Log.projectColour}${Log.projectName}`
            + `${Log._RESET}]${(context) ? ` [${Log._FG_WHITE}${context}${Log._RESET}]` : ''} `
            + `${Log._BG_RED}${Log._FG_BLACK}${message}${Log._RESET}`);
        process.exit(1);
    }
    ;
    /**
     * The 'httpRequest' logging method. States the HTTP request information. Uses the trace method.
     *
     * @param {express.Request} request - The incomming express request object.
     */
    static httpRequest(request) {
        if (!(Log._initialised))
            return;
        Log.trace(`(${request.method}) `
            + `${request.connection.remoteAddress}  ->  `
            + `${request.protocol}://${request.get('host')}${request.originalUrl}`);
    }
    ;
    /**
     * The 'database' logging method. States the information processed by the database. Uses the trace method.
     *
     * @param {string} url - The database URL.
     * @param {string} dataId - An identifier for the data being processed.
     * @param {string} method - The processing method.
     */
    static database(url, dataId, method) {
        if (!(Log._initialised))
            return;
        Log.trace(`(DATABASE) ${method} ${dataId} -> ${url}`);
    }
    ;
}
Log._RESET = '\x1b[0m';
Log._FG_GREY = '\x1b[38;5;240m';
Log._FG_WHITE = '\x1b[38;5;254m';
Log._FG_ORANGE = '\x1b[38;5;11m';
Log._FG_RED = '\x1b[38;5;160m';
Log._FG_NEBULA = '\x1b[38;5;27m';
Log._FG_BLACK = '\x1b[38;5;0m';
Log._BG_RED = '\x1b[48;5;160m';
Log._LEVEL_LOOKUP = ['trace', 'info', 'warn', 'error'];
Log._initialised = false;
;