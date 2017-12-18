'use strict';

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _expect = require('expect');

var _expect2 = _interopRequireDefault(_expect);

var _core = require('./core');

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
        (0, _core.start)();
    });

    it('#start - check default config', function () {
        var expectedConfig = _defaultConfig2.default;
        (0, _core.start)([checkConfig(expectedConfig)]);
    });

    it('#start - check default config with endCallback', function () {
        var expectedConfig = _defaultConfig2.default;
        (0, _core.start)([checkConfig(expectedConfig)], [], function (err, results) {
            return (0, _expect2.default)(err).toEqual(null);
        });
    });

    it('#start - use config object', function () {
        var expectedConfig = _lodash2.default.merge(_defaultConfig2.default, testAdapter.config);
        (0, _core.start)([testAdapter, checkConfig(expectedConfig)]);
    });

    it('#start - use adapter function that returns NO ctxExtension', function () {
        var expectedConfig = _lodash2.default.merge(_defaultConfig2.default);
        (0, _core.start)([function (ctx, next) {
            return next(null);
        }, checkConfig(expectedConfig)]);
    });

    it('#start - use adapter function that returns `null` as ctxExtension', function () {
        var expectedConfig = _lodash2.default.merge(_defaultConfig2.default);
        (0, _core.start)([function (ctx, next) {
            return next(null, null);
        }, checkConfig(expectedConfig)]);
    });

    it('#start - use adapter function that returns ctxExtension', function () {
        var expectedConfig = _lodash2.default.merge(_defaultConfig2.default, testAdapter.config);
        (0, _core.start)([function (ctx, next) {
            return next(null, testAdapter);
        }, checkConfig(expectedConfig)]);
    });

    it('#start - use adapter function with exception on error', function () {
        var expectedConfig = _lodash2.default.merge(_defaultConfig2.default, testAdapter.config);
        try {
            (0, _core.start)([function (ctx, next) {
                return next(new Error("Wrong adapter init"));
            }, checkConfig(expectedConfig)]);
        } catch (err) {
            (0, _expect2.default)(err).toEqual('Error: Wrong adapter init');
        }
    });

    it('#start - use adapter function with error on callback', function () {
        (0, _core.start)([function (ctx, next) {
            return next(new Error("Wrong adapter init"));
        }], [], function (err, ctx) {
            return (0, _expect2.default)(err).toEqual('Error: Wrong adapter init');
        });
    });

    it('#start - with job returns error', function (done) {
        (0, _core.start)([], [function (ctx, cb) {
            return cb(new Error('Job returned error'), {});
        }], function (err, results) {
            (0, _expect2.default)(err).toEqual('Error: Job returned error');
            done();
        });
    });

    it('#start - with job as a non function object', function (done) {
        (0, _core.start)([], [{/* It should be a function */}], function (err, results) {
            (0, _expect2.default)(err).toEqual('Error: Job must be a function');
            done();
        });
    });
});