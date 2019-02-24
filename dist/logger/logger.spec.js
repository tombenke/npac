'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _expect = require('expect');

var _expect2 = _interopRequireDefault(_expect);

var _datafile = require('datafile');

var _index = require('./index');

var _fixtures = require('./fixtures/');

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _rimraf = require('rimraf');

var _rimraf2 = _interopRequireDefault(_rimraf);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var destCleanup = function destCleanup(cb) {
    var dest = _path2.default.resolve('./tmp/');
    (0, _rimraf2.default)(dest, cb);
};

before(function (done) {
    destCleanup(function () {
        _fs2.default.mkdirSync(_path2.default.resolve('./tmp'));
        done();
    });
});

after(function (done) {
    destCleanup(done);
});

describe('config', function () {
    var writeLog = function writeLog(ctx) {
        ctx.logger.info('Hello logger!');
        ctx.logger.debug('This is a JSON object', { id: '121324231412', payload: { message: 'Some debug info...' } });
        ctx.logger.warn('And another JSON object', { id: '724543275671', payload: { message: 'Some warning!' } });
        ctx.logger.info('Good Bye logger!');
    };

    it('#addLogger - with defaults config', function (done) {
        (0, _index.addLogger)(_fixtures.ctxDefault, function (err, ctxExtension) {
            (0, _expect2.default)(err).toEqual(null);
            writeLog(ctxExtension);
            done();
        });
    });

    it('#addLogger - with console transport', function (done) {
        console.log('ctxConsoleTransport: ', JSON.stringify(_fixtures.ctxConsoleTransport, null, '  '));
        (0, _index.addLogger)(_fixtures.ctxConsoleTransport, function (err, ctxExtension) {
            (0, _expect2.default)(err).toEqual(null);
            writeLog(ctxExtension);
            done();
        });
    });

    it('#addLogger - with console and file transports', function (done) {
        //        console.log('ctxConsoleAndFileTransport: ', JSON.stringify(ctxConsoleAndFileTransport, null, '  '))
        (0, _index.addLogger)(_fixtures.ctxConsoleAndFileTransport, function (err, ctxExtension) {
            (0, _expect2.default)(err).toEqual(null);
            writeLog(ctxExtension);
            setTimeout(function () {
                (0, _expect2.default)((0, _datafile.findFilesSync)('./tmp', /.*/)).toEqual(['tmp/output.log']);
                var outputLog = (0, _datafile.loadTextFileSync)('tmp/output.log').split('\n').map(function (log) {
                    if (log !== '') {
                        return _extends({}, JSON.parse(log), { timestamp: '2019-02-24T15:38:50.778Z' });
                    }
                }).filter(function (log) {
                    return !_lodash2.default.isUndefined(log);
                });
                (0, _expect2.default)(outputLog).toEqual(_fixtures.expectedOutputLog);
                done();
            }, 100);
        });
    });
});