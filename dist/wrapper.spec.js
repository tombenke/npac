'use strict';

var _expect = require('expect');

var _expect2 = _interopRequireDefault(_expect);

var _defaultConfig = require('./defaultConfig');

var _defaultConfig2 = _interopRequireDefault(_defaultConfig);

var _wrappers = require('./wrappers');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

describe('wrappers', function () {

    it('#runJobSync - run a sync job in a plain container with logger', function (done) {

        var executives = {
            addSync: function addSync(ctx, args) {
                var result = args.a + args.b;
                ctx.logger.info('addSync(' + args.a + ', ' + args.b + ') => ' + result);
                return result;
            }
        };
        var jobDesc = { name: 'addSync', args: { a: 1, b: 1 } };

        (0, _wrappers.runJobSync)(_defaultConfig2.default, executives, jobDesc, function (err, result) {
            (0, _expect2.default)(result).toEqual([2]);
            done();
        });
    });

    it('#runJob - run an asynchronous job in a plain container with logger', function (done) {

        var executives = {
            add: function add(ctx, args, cb) {
                var result = args.a + args.b;
                ctx.logger.info('add(' + args.a + ', ' + args.b + ') => ' + result);
                cb(null, result);
            }
        };
        var jobDesc = { name: 'add', args: { a: 1, b: 1 } };

        (0, _wrappers.runJob)(_defaultConfig2.default, executives, jobDesc, function (err, result) {
            (0, _expect2.default)(result).toEqual([2]);
            done();
        });
    });
}); //import _ from 'lodash'