'use strict';

var _sinon = require('sinon');

var _sinon2 = _interopRequireDefault(_sinon);

var _config = require('./config/');

var _logger = require('./logger/');

var _testHelpers = require('./testHelpers');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

describe('adapters/server', function () {
    var sandbox = void 0;

    var config = {}; //_.merge({})

    beforeEach(function (done) {
        (0, _testHelpers.removeSignalHandlers)();
        sandbox = _sinon2.default.createSandbox({});
        done();
    });

    afterEach(function (done) {
        (0, _testHelpers.removeSignalHandlers)();
        sandbox.restore();
        done();
    });

    var adapters = [(0, _config.mergeConfig)(config), _logger.addLogger];

    var terminators = [];

    it('#startup, #shutdown', function (done) {
        (0, _testHelpers.catchExitSignals)(sandbox, done);

        var testServer = function testServer(container, next) {
            container.logger.info('Run job to test server');
            next(null, null);
        };

        (0, _testHelpers.npacStart)(adapters, [testServer], terminators);
    });
});