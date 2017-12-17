'use strict';

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _expect = require('expect');

var _expect2 = _interopRequireDefault(_expect);

var _index = require('./index');

var _datafile = require('datafile');

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _rimraf = require('rimraf');

var _rimraf2 = _interopRequireDefault(_rimraf);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var destCleanup = function destCleanup(cb) {
    var dest = _path2.default.resolve('./tmp/');
    console.log('Remove: ', dest);
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
    //    done()
});

describe('config', function () {

    var writeLog = function writeLog(ctx) {
        ctx.logger.info('Hello logger!');
        ctx.logger.debug('This is a JSON object', { id: '121324231412', payload: { message: 'Some debug info...' } });
        ctx.logger.warn('And another JSON object', { id: '724543275671', payload: { message: 'Some warning!' } });
        ctx.logger.info('Good Bye logger!');
    };

    it('#addLogger - with defaults config', function (done) {
        var ctxDefault = (0, _datafile.loadJsonFileSync)('src/logger/fixtures/ctxDefault.yml');
        (0, _index.addLogger)(ctxDefault, function (err, ctxExtension) {
            (0, _expect2.default)(err).toEqual(null);
            writeLog(ctxExtension);
            done();
        });
    });

    it('#addLogger - with console and file transports', function (done) {
        var ctx = (0, _datafile.mergeJsonFilesSync)(['src/logger/fixtures/ctxDefault.yml', 'src/logger/fixtures/consoleAndFileTransport.yml']);
        //console.log('ctx: ', JSON.stringify(ctx, null, '  '))
        (0, _index.addLogger)(ctx, function (err, ctxExtension) {
            (0, _expect2.default)(err).toEqual(null);
            writeLog(ctxExtension);
            setTimeout(function () {
                (0, _expect2.default)((0, _datafile.findFilesSync)('./tmp', /.*/)).toEqual(['tmp/output.log']);
                var logs = (0, _datafile.loadTextFileSync)('tmp/output.log');
                // TODO: parse and check
                //                console.log('logs', logs)
                done();
            }, 100);
        });
    });
});