'use strict';

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _expect = require('expect');

var _expect2 = _interopRequireDefault(_expect);

var _core = require('./core');

var _core2 = _interopRequireDefault(_core);

var _defaultConfig = require('./defaultConfig');

var _defaultConfig2 = _interopRequireDefault(_defaultConfig);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

describe('core', function () {

    var checkConfig = function checkConfig(expectedConfig) {
        return function (ctx, next) {
            (0, _expect2.default)(ctx.config).toBeA('object').toEqual(expectedConfig);
            next(null, ctx);
        };
    };

    var testAdapter = {
        testAdapter: {/* testAdapter API */},
        config: { testAdapter: { name: "testAdapter", port: 4444 } }
    };

    it('#startup - check default config', function () {
        var expectedConfig = _defaultConfig2.default;
        _core2.default.startup([checkConfig(expectedConfig)]);
    });

    it('#startup - check default config with endCallback', function () {
        var expectedConfig = _defaultConfig2.default;
        _core2.default.startup([checkConfig(expectedConfig)], function (err, ctx) {
            return (0, _expect2.default)(ctx.config).toEqual(expectedConfig);
        });
    });

    it('#startup - use config object', function () {
        var expectedConfig = _lodash2.default.merge(_defaultConfig2.default, testAdapter.config);
        _core2.default.startup([testAdapter, checkConfig(expectedConfig)]);
    });

    it('#startup - use adapter function', function () {
        var expectedConfig = _lodash2.default.merge(_defaultConfig2.default, testAdapter.config);
        _core2.default.startup([function (ctx, next) {
            return next(null, testAdapter);
        }, checkConfig(expectedConfig)]);
    });

    it('#startup - use adapter function with exception on error', function () {
        var expectedConfig = _lodash2.default.merge(_defaultConfig2.default, testAdapter.config);
        try {
            _core2.default.startup([function (ctx, next) {
                return next(new Error("Wrong adapter init"));
            }, checkConfig(expectedConfig)]);
        } catch (err) {
            (0, _expect2.default)(err).toEqual('Error: Wrong adapter init');
        }
    });

    it('#startup - use adapter function with error on callback', function () {
        _core2.default.startup([function (ctx, next) {
            return next(new Error("Wrong adapter init"), null);
        }], function (err, ctx) {
            return (0, _expect2.default)(err).toEqual('Error: Wrong adapter init');
        });
    });
});