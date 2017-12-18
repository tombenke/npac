'use strict';

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _expect = require('expect');

var _expect2 = _interopRequireDefault(_expect);

var _datafile = require('datafile');

var _index = require('./index');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var executives = {
    add: function add(ctx, args, cb) {
        return _lodash2.default.has(args, ['a', 'b']) ? cb(null, a + b) : cb(new Error('Wrong or missing arguments'));
    },
    mul: function mul(ctx, args, cb) {
        return _lodash2.default.has(args, ['a', 'b']) ? cb(null, a * b) : cb(new Error('Wrong or missing arguments'));
    }
};

describe('config', function () {
    var ctxOrig = (0, _datafile.loadJsonFileSync)('src/config/fixtures/ctxOrig.yml');

    it('#runJob - call sync job', function (done) {
        var syncJobExecutive = { addSync: function addSync(ctx, args) {
                return args.a + args.b;
            } };
        var ctx = _lodash2.default.merge({}, ctxOrig, { logger: console }, syncJobExecutive);
        var syncJob = (0, _index.runJobSync)({ name: 'addSync', args: { a: 1, b: 1 } });
        syncJob(ctx, function (err, result) {
            (0, _expect2.default)(result).toEqual([2]);
            done();
        });
    });

    /*
    
        it('#start - call async job', (done) => {
    
            app.start([
                { add: (ctx, args, cb) => cb(null, args.a + args.b) },
            ], [
                app.runJob({ name: 'add', args: { a: 1, b: 1 } })
            ], (err, result) => {
                    expect(result).toEqual([2])
                    done()
                })
        })
    
    */
});