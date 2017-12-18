'use strict';

var _core = require('./core');

var _core2 = _interopRequireDefault(_core);

var _config = require('./config/');

var _logger = require('./logger/');

var _job = require('./job/');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

module.exports = {
    start: _core2.default.start,

    // adapters
    makeConfig: _config.makeConfig,
    mergeConfig: _config.mergeConfig,
    addLogger: _logger.addLogger,

    // jobs
    makeCall: _job.makeCall,
    makeCallSync: _job.makeCallSync
};