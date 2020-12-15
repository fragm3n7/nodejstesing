import http from 'http';
import https from 'https';
import fs from 'fs';
import Log from '../Log/Log.js';
;
;
/**
 * HttpServer v0.44
 *
 * The WebInstance class creates both HTTP and HTTPS servers to be used with express.
 * If in production mode, the WebInstance will create both HTTP and HTTPS on specifed ports.
 * The HTTP server in production mode is used as a fallback and simply redirects to HTTPS.
 * If not in production modem the WebInstance will create a HTTP server only.
 * Requires configured ports to be available as well as elevated privileges.
 *
 * @param {Configuration} configuration - The main configuration object.
 * @param {express.Express} configuration.express - The express object.
 * @param {Boolean} configuration.productionFlag - The mode to launch the WebInstance.
 * @param {Boolean} [configuration.redirectFlag] - If using HTTPS, whether to create a fallback server.
 * @param {string} [configuration.sslCertifcatePath] - Path to SSL certificate.
 * @param {string} [configuration.sslPrivateKeyPath] - Path to SSL private key.
 * @param {string} [configuration.sslCertificateAuthorityPath] - Path to SSL certificate authority.
 * @param {number} configuration.portHttp - Port number for HTTP server.
 * @param {number} [configuration.portHttps] - Port number for HTTPS server.
 * @param {string} configuration.ipAddress - IP address to bind to.
 * @param {string} configuration.hostname - Hostname to bind to.
 * @returns {WebInstance} - The instantiated WebInstance.
 *
 */
export default class HttpServer {
    constructor(configuration) {
        this._express = configuration.express;
        this._productionFlag = configuration.productionFlag || false;
        this._redirectFlag = configuration.redirectFlag || true;
        this._sslCertificatePath = configuration.sslCertifcatePath;
        this._sslPrivateKeyPath = configuration.sslPrivateKeyPath;
        this._sslCertificateAuthorityPath = configuration.sslCertificateAuthorityPath;
        this._portHttp = configuration.portHttp;
        this._portHttps = configuration.portHttps;
        this._ipAddress = configuration.ipAddress;
        this._hostname = configuration.hostname;
        this._initialise();
    }
    ;
    /**
     * The initialise function creates either a HTTPS and HTTP server or a sole HTTP server
     * depending on the provided production flag. If in production mode, the WebInstance will
     * attempt to read the SSL files to create a httpsOptions object. A HTTP server is created
     * whether or not the server is in production mode. If in production mode, the HTTP server
     * is used as a fallback server and performs redirection to the HTTPS server to ensure
     * communication over SSL.
     */
    _initialise() {
        if (this._productionFlag) {
            this._express.set('port', this._portHttps);
            try {
                this._httpsOptions = {
                    'cert': fs.readFileSync(this._sslCertificatePath),
                    'key': fs.readFileSync(this._sslPrivateKeyPath),
                    'ca': fs.readFileSync(this._sslCertificateAuthorityPath),
                };
            }
            catch (error) {
                Log.fatal(`Unable to load SSL certificate files.`);
            }
            this._server = https.createServer(this._httpsOptions, this._express);
            this._server.listen(this._portHttps, this._ipAddress);
            this._server.on('listening', () => Log.info(`HTTPS web server started listening on ${this._ipAddress}:${this._portHttps}.`));
            if (this._redirectFlag) {
                this._serverRedirect = http.createServer((request, response) => {
                    response.writeHead(301, { 'Location': `https://${this._hostname}${request.url}` });
                    response.end();
                });
                this._serverRedirect.listen(this._portHttp);
                this._serverRedirect.on('listening', () => Log.info(`Fallback redirect HTTP server started listening on ${this._ipAddress}:${this._portHttp}.`));
            }
        }
        else {
            this._express.set('port', this._portHttp);
            this._server = http.createServer(this._express);
            this._server.listen(this._portHttp);
            this._server.on('listening', () => Log.info(`HTTP web server started listening on port ${this._ipAddress}:${this._portHttp}.`));
        }
        this._server.on('error', (error) => this._errorCallback(error));
        Log.info('HTTPServer initialised.');
    }
    ;
    /**
     * Simply accepts an error provided by the HTTPS server.
     * Currently handles verbose logging when the error is caused by either lack of privileges or
     * a port in use.
     *
     * @param {ErrnoException} error - Server invocation error.
     *
     * @todo - Is this a case for switch statements? I hate them, but this is a perfect situation.
     */
    _errorCallback(error) {
        if (error.code === 'EACCES') {
            Log.fatal(`Ports ${this._portHttp} and ${this._portHttps} require elevated privileges.`);
        }
        else if (error.code === 'EADDRINUSE') {
            Log.fatal(`Ports ${this._portHttp} and/or ${this._portHttps} are already in use.`);
        }
        else
            Log.fatal(error.toString());
        process.exit(1);
    }
    ;
}
;