'use strict';

var _core = require('./core');

var _config = require('./config/');

var _logger = require('./logger/');

var _job = require('./job/');

var _wrappers = require('./wrappers');

var _testHelpers = require('./testHelpers');

module.exports = {
    start: _core.start,

    // adapters
    makeConfig: _config.makeConfig,
    mergeConfig: _config.mergeConfig,
    addLogger: _logger.addLogger,

    // jobs
    makeCall: _job.makeCall,
    makeCallSync: _job.makeCallSync,

    // wrappers
    runJob: _wrappers.runJob,
    runJobSync: _wrappers.runJobSync,

    // test helpers
    removeSignalHandlers: _testHelpers.removeSignalHandlers,
    catchExitSignals: _testHelpers.catchExitSignals,
    npacStart: _testHelpers.npacStart
};