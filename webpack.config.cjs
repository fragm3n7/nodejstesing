const path = require('path');

module.exports = {
    'mode': 'development',
    'entry': './src/js/Main.js',
    'devtool': 'source-map',
    'output': {
        'path': path.resolve(__dirname, './public/js'),
        'filename': 'main.js'
    },
}