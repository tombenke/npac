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

    it('#start - with no args', function () {
        _core2.default.start();
    });

    it('#start - check default config', function () {
        var expectedConfig = _defaultConfig2.default;
        _core2.default.start([checkConfig(expectedConfig)]);
    });

    it('#start - check default config with endCallback', function () {
        var expectedConfig = _defaultConfig2.default;
        _core2.default.start([checkConfig(expectedConfig)], [], function (err, results) {
            return (0, _expect2.default)(err).toEqual(null);
        });
    });

    it('#start - use config object', function () {
        var expectedConfig = _lodash2.default.merge(_defaultConfig2.default, testAdapter.config);
        _core2.default.start([testAdapter, checkConfig(expectedConfig)]);
    });

    it('#start - use adapter function that returns NO ctxExtension', function () {
        var expectedConfig = _lodash2.default.merge(_defaultConfig2.default);
        _core2.default.start([function (ctx, next) {
            return next(null);
        }, checkConfig(expectedConfig)]);
    });

    it('#start - use adapter function that returns `null` as ctxExtension', function () {
        var expectedConfig = _lodash2.default.merge(_defaultConfig2.default);
        _core2.default.start([function (ctx, next) {
            return next(null, null);
        }, checkConfig(expectedConfig)]);
    });

    it('#start - use adapter function that returns ctxExtension', function () {
        var expectedConfig = _lodash2.default.merge(_defaultConfig2.default, testAdapter.config);
        _core2.default.start([function (ctx, next) {
            return next(null, testAdapter);
        }, checkConfig(expectedConfig)]);
    });

    it('#start - use adapter function with exception on error', function () {
        var expectedConfig = _lodash2.default.merge(_defaultConfig2.default, testAdapter.config);
        try {
            _core2.default.start([function (ctx, next) {
                return next(new Error("Wrong adapter init"));
            }, checkConfig(expectedConfig)]);
        } catch (err) {
            (0, _expect2.default)(err).toEqual('Error: Wrong adapter init');
        }
    });

    it('#start - use adapter function with error on callback', function () {
        _core2.default.start([function (ctx, next) {
            return next(new Error("Wrong adapter init"));
        }], [], function (err, ctx) {
            return (0, _expect2.default)(err).toEqual('Error: Wrong adapter init');
        });
    });
});