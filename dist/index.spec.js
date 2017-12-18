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

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/*
import fs from 'fs'
import path from 'path'
import rimraf from 'rimraf'

const destCleanup = function(cb) {
    const dest = path.resolve('./tmp/')
    console.log('Remove: ', dest)
    rimraf(dest, cb)
}

before(function(done) {
    destCleanup(function() {
        fs.mkdirSync(path.resolve('./tmp'))
        done()
    })
})

after(function(done) {
    destCleanup(done)
})
*/
//    const { cliConfig, command } = cli.parse(defaults)
//    const config = makeConfig(defaults, cliConfig)

//const cliMock = (cmdName, cmdArgs, cliConfig) => ({
//    parse: (defaults, argv) => ({ command: {name: cmdName, args: cmdArgs}, cliConfig: cliConfig })
//})

describe('npac', function () {

    var checkCtx = function checkCtx(checkFun) {
        return function (ctx, next) {
            //        console.log('checkCtx: ', ctx)
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
            } }], [_index2.default.runJobSync({ name: 'addSync', args: { a: 1, b: 1 } })], function (err, result) {
            (0, _expect2.default)(result).toEqual([2]);
            done();
        });
    });

    it('#start - call async job', function (done) {

        _index2.default.start([{ add: function add(ctx, args, cb) {
                return cb(null, args.a + args.b);
            } }], [_index2.default.runJob({ name: 'add', args: { a: 1, b: 1 } })], function (err, result) {
            (0, _expect2.default)(result).toEqual([2]);
            done();
        });
    });
});