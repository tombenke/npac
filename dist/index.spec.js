'use strict';

var _expect = require('expect');

var _expect2 = _interopRequireDefault(_expect);

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _rimraf = require('rimraf');

var _rimraf2 = _interopRequireDefault(_rimraf);

var _index = require('./index');

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
});

describe('{{package_name}}', function () {

    it('#testMe', function () {
        (0, _expect2.default)((0, _index.testMe)('Hello')).toBeA('string').toEqual('Hello testMe!');
    });
});