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
        return _lodash2.default.has(args, 'a') && _lodash2.default.has(args, 'b') ? cb(null, args.a + args.b) : cb(new Error('Wrong or missing arguments'));
    },

    addSync: function addSync(ctx, args) {
        console.log('addSync.args: ', args, _lodash2.default.has(args, 'a') && _lodash2.default.has(args, 'b'));
        if (_lodash2.default.has(args, 'a') && _lodash2.default.has(args, 'b')) {
            return args.a + args.b;
        } else {
            throw new Error('Wrong or missing arguments');
        }
    }
};

describe('job', function () {
    var ctxOrig = (0, _datafile.loadJsonFileSync)('src/config/fixtures/ctxOrig.yml');
    var ctx = _lodash2.default.merge({}, ctxOrig, { logger: console }, executives);

    it('#makeCallSync - call sync job', function (done) {
        var syncJob = (0, _index.makeCallSync)({ name: 'addSync', args: { a: 1, b: 1 } });
        syncJob(ctx, function (err, result) {
            (0, _expect2.default)(result).toEqual(2);
            done();
        });
    });

    it('#makeCall - call async job', function (done) {
        var asyncJob = (0, _index.makeCall)({ name: 'add', args: { a: 1, b: 1 } });
        asyncJob(ctx, function (err, result) {
            (0, _expect2.default)(result).toEqual(2);
            done();
        });
    });
});