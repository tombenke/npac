'use strict';

var _package = require('../package.json');

var _package2 = _interopRequireDefault(_package);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var npacDefaultConfig = {
    app: {
        name: _package2.default.name,
        version: _package2.default.version
    },
    NODE_ENV: process.env.NODE_ENV || 'development'
};

module.exports = npacDefaultConfig;