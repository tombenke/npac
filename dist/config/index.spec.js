'use strict';

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _expect = require('expect');

var _expect2 = _interopRequireDefault(_expect);

var _index = require('./index');

var _datafile = require('datafile');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

describe('config', function () {
    var defaults = (0, _datafile.loadJsonFileSync)('src/config/fixtures/defaults.yml');
    var defaultsWithConfigFileName = (0, _datafile.loadJsonFileSync)('src/config/fixtures/defaultsWithConfigFileName.yml');
    var configFile = (0, _datafile.loadJsonFileSync)('src/config/fixtures/configFile.yml');
    var cliConfig = (0, _datafile.loadJsonFileSync)('src/config/fixtures/cliConfig.yml');
    var cliConfigWithConfigFileName = (0, _datafile.loadJsonFileSync)('src/config/fixtures/cliConfigWithConfigFileName.yml');
    var ctxOrig = (0, _datafile.loadJsonFileSync)('src/config/fixtures/ctxOrig.yml');
    var ctxPlusDefaults = (0, _datafile.loadJsonFileSync)('src/config/fixtures/ctxPlusDefaults.yml');

    it('#makeConfig - with no parameters', function () {
        var expectedConfig = {};
        (0, _expect2.default)((0, _index.makeConfig)()).toEqual(expectedConfig);
    });

    it('#makeConfig - with defaults only', function () {
        var expectedConfig = defaults;
        (0, _expect2.default)((0, _index.makeConfig)(defaults)).toEqual(expectedConfig);
    });

    it('#makeConfig - with defaults and cliConfig', function () {
        var expectedConfig = (0, _datafile.loadJsonFileSync)('src/config/fixtures/defaultsPlusCliConfig.yml');
        (0, _expect2.default)((0, _index.makeConfig)(defaults, cliConfig)).toEqual(expectedConfig);
    });

    it('#makeConfig - with defaults, missing config file and cliConfig', function () {
        var expectedConfig = (0, _datafile.loadJsonFileSync)('src/config/fixtures/defaultsPlusCliConfig.yml');
        (0, _expect2.default)((0, _index.makeConfig)(defaults, cliConfig, 'configFileName')).toEqual(expectedConfig);
    });

    it('#makeConfig - with defaults, config file defined in defaults and cliConfig', function () {
        var expectedConfig = (0, _datafile.loadJsonFileSync)('src/config/fixtures/allInOne.yml');
        (0, _expect2.default)((0, _index.makeConfig)(defaultsWithConfigFileName, cliConfig, 'configFileName')).toEqual(expectedConfig);
    });

    it('#makeConfig - with defaults, config file defined in cliConfig and cliConfig', function () {
        var expectedConfig = (0, _datafile.loadJsonFileSync)('src/config/fixtures/allInOne.yml');
        (0, _expect2.default)((0, _index.makeConfig)(defaults, cliConfigWithConfigFileName, 'configFileName')).toEqual(expectedConfig);
    });

    it('#mergeConfig - with no args', function (done) {
        var expectedConfig = ctxOrig;
        var adapterFun = (0, _index.mergeConfig)();
        adapterFun(ctxOrig, function (err, result) {
            (0, _expect2.default)(result).toEqual(expectedConfig);
            done();
        });
    });

    it('#mergeConfig - with defaults', function (done) {
        var expectedConfig = ctxPlusDefaults;
        var adapterFun = (0, _index.mergeConfig)(defaults);
        adapterFun(ctxOrig, function (err, result) {
            (0, _expect2.default)(result).toEqual(expectedConfig);
            done();
        });
    });
});