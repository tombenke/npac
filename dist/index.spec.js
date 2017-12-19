'use strict';

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _expect = require('expect');

var _expect2 = _interopRequireDefault(_expect);

var _index = require('./index');

var _index2 = _interopRequireDefault(_index);

var _defaultConfig = require('./defaultConfig');

var _defaultConfig2 = _interopRequireDefault(_defaultConfig);

var _config = require('./config/');

var _logger = require('./logger/');

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _rimraf = require('rimraf');

var _rimraf2 = _interopRequireDefault(_rimraf);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var testDirectory = _path2.default.resolve('./tmp');
var destCleanup = function destCleanup(cb) {
    var dest = testDirectory;
    console.log('Remove: ', dest);
    (0, _rimraf2.default)(dest, cb);
};

//    const { cliConfig, command } = cli.parse(defaults)
//    const config = makeConfig(defaults, cliConfig)

//const cliMock = (cmdName, cmdArgs, cliConfig) => ({
//    parse: (defaults, argv) => ({ command: {name: cmdName, args: cmdArgs}, cliConfig: cliConfig })
//})

describe('npac', function () {

    before(function (done) {
        destCleanup(function () {
            console.log('Create: ', testDirectory);
            _fs2.default.mkdirSync(testDirectory);
            done();
        });
    });

    after(function (done) {
        //        destCleanup(done)
        done();
    });

    var checkCtx = function checkCtx(checkFun) {
        return function (ctx, next) {
            checkFun(ctx);
            next(null, ctx);
        };
    };

    it('#start - check default config', function () {
        var expectedConfig = _defaultConfig2.default;
        _index2.default.start([checkCtx(function (ctx) {
            return (0, _expect2.default)(ctx.config).toEqual(expectedConfig);
        })]);
    });

    it('#start - #makeConfig, #mergeConfig', function () {
        var configToMerge = (0, _config.makeConfig)({ logger: { level: "debug" }, projectPath: "/home/testuser/testproject" });
        var expectedCtx = { config: _lodash2.default.merge({}, _defaultConfig2.default, configToMerge) };

        _index2.default.start([(0, _config.mergeConfig)(configToMerge), checkCtx(function (ctx) {
            return (0, _expect2.default)(ctx.config).toEqual(expectedCtx.config);
        })]);
    });

    it('#start - #makeConfig, #mergeConfig, #addLogger', function () {
        var configToMerge = (0, _config.makeConfig)({ logger: { level: "debug" }, projectPath: testDirectory });
        //        const expectedCtx = { config: _.merge({}, npacDefaultConfig, configToMerge ) }

        _index2.default.start([(0, _config.mergeConfig)(configToMerge), _logger.addLogger
        //            checkCtx(ctx => expect(ctx.config).toEqual(expectedCtx.config))
        ], [function (ctx, next) {
            ctx.logger.info('This is a DEBUG message');
            console.log('This is a DEBUG message');
            next(null, {});
        }], function (err, results) {
            console.log('Final results:', err, results);
        });
    });

    it('#start - call sync executive function', function (done) {

        _index2.default.start([{ addSync: function addSync(ctx, a, b) {
                return a + b;
            } }], [function (ctx, cb) {
            var result = ctx.addSync(ctx, 1, 1);
            (0, _expect2.default)(result).toEqual(2);
            cb(null, result);
        }], done);
    });

    it('#start - call async executive function', function (done) {

        _index2.default.start([{ add: function add(ctx, a, b, cb) {
                return cb(null, a + b);
            } }], [function (ctx, cb) {
            ctx.add(ctx, 1, 1, function (err, result) {
                (0, _expect2.default)(result).toEqual(2);
                cb(null, result);
            });
        }], done);
    });

    it('#start - call sync job', function (done) {

        _index2.default.start([{ addSync: function addSync(ctx, args) {
                return args.a + args.b;
            } }], [_index2.default.makeCallSync({ name: 'addSync', args: { a: 1, b: 1 } })], function (err, result) {
            (0, _expect2.default)(result).toEqual([2]);
            done();
        });
    });

    it('#start - call async job', function (done) {

        _index2.default.start([{ add: function add(ctx, args, cb) {
                return cb(null, args.a + args.b);
            } }], [_index2.default.makeCall({ name: 'add', args: { a: 1, b: 1 } })], function (err, result) {
            (0, _expect2.default)(result).toEqual([2]);
            done();
        });
    });

    it('#start - call sync job that uses logger', function (done) {

        _index2.default.start([_logger.addLogger, {
            addSync: function addSync(ctx, args) {
                var result = args.a + args.b;
                ctx.logger.info('addSync(' + args.a + ', ' + args.b + ') => ' + result);
                return result;
            }
        }], [_index2.default.makeCallSync({ name: 'addSync', args: { a: 1, b: 1 } })], function (err, result) {
            (0, _expect2.default)(result).toEqual([2]);
            done();
        });
    });

    it('#start - call async job that uses logger', function (done) {

        _index2.default.start([_logger.addLogger, {
            add: function add(ctx, args, cb) {
                var result = args.a + args.b;
                ctx.logger.info('add(' + args.a + ', ' + args.b + ') => ' + result);
                cb(null, result);
            }
        }], [_index2.default.makeCall({ name: 'add', args: { a: 1, b: 1 } })], function (err, result) {
            (0, _expect2.default)(result).toEqual([2]);
            done();
        });
    });
});