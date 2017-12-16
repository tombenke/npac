'use strict';

var _config = require('./config/');

var _core = require('./core');

var _core2 = _interopRequireDefault(_core);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

module.exports = {
    startup: _core2.default.startup,

    makeConfig: _config.makeConfig,
    mergeConfig: _config.mergeConfig
};