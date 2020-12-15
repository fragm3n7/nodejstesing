import path from 'path';
import dotenv from 'dotenv'; dotenv.config();

export const ENVIRONMENT = {
    'PRODUCTION': (process.env.PRODUCTION === 'true'),
    'VERBOSITY': process.env.VERBOSITY
};

export const SERVER = {
    'PROJECT_NAME': 'lessons',
    'PROJECT_COLOUR': 27,
    'PORT_HTTP': 80,
    'PORT_HTTPS': 443,
    'HOSTNAME': (ENVIRONMENT.PRODUCTION) ? '<Domain Name>' : '127.0.0.1',
    'IP_ADDRESS': '0.0.0.0'
};

export const DIRECTORY = {
    'VIEW': path.join(path.resolve(), 'view'),
    'PUBLIC': path.join(path.resolve(), 'public'),
    'ROUTE': path.join(path.resolve(), 'route'),
};

export const ROUTE = {
    'INDEX': '/',
    'ABOUT': '/about'
};