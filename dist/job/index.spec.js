'use strict';

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _expect = require('expect');

var _expect2 = _interopRequireDefault(_expect);

var _datafile = require('datafile');

var _index = require('./index');

var _index2 = _interopRequireDefault(_index);

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
    /*
        it('#execute - executives found', (done) => {
            const context = _.merge({}, ctxOrig, executives)
            const taskToExecute = execute({ name: 'add', args: { a: 1, b: 1 } })
    
            const nextAdapterFun = (err, next) => {
                expect(err).toEqual(null)
                done()
            }
    
            const resultHandler = (err, ctx, result, next) => {
                expect(err).toEqual(null)
                expect(result).toEqual(2)
                next(null)
            })
    
            taskToExecute(context, (err, (err, result, nextAdapterFun) => ) => 
        })
    */
});