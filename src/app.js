import express from 'express';
import { DIRECTORY, ROUTE, ENVIRONMENT, SERVER } from './config.js';

import HttpServer from './class/HttpServer/HttpServer.js';
import HttpHeader from './class/HttpHeader/HttpHeader.js';
import Log from './class/Log/Log.js';

import indexRouter from './route/index.js';
// import aboutRouter from './route/about.js';

const server = express();

Log.initialise({
    'projectName': SERVER.PROJECT_NAME,
    'projectColour': SERVER.PROJECT_COLOUR,
    'verbosity': ENVIRONMENT.VERBOSITY
});

new HttpServer({
    'express': server,
    'productionFlag': ENVIRONMENT.PRODUCTION,
    'portHttp': SERVER.PORT_HTTP,
    'ipAddress': SERVER.IP_ADDRESS,
    'hostname': SERVER.HOSTNAME
});

server.set('views', DIRECTORY.VIEW);
server.set('view engine', 'ejs');

server.use(express.json());
server.use(express.urlencoded({ 'extended': false }));
server.use(express.static(DIRECTORY.PUBLIC));
server.use(HttpHeader.configure);

server.use(ROUTE.INDEX, indexRouter);
// server.use('/about', aboutRouter);





/*

    HttpServer -> Listens on 0.0.0.0:80.
    Client -> GET 127.0.0.1/about

    HttpServer -> Catches the raw request, pass it to express.

    Express, split it into two objects -> request, response.

    Request object contains all the info regarding the request. method, ip, headers, content, queries, path...
    Response object contains all the infor for responding, such as methods for responding with JSON or HTML (render.)

    Request and Response object, get passed to every function that uses the "use" method. This is middleware.

*/

