'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.expectedOutputLog = exports.ctxConsoleAndFileTransport = exports.ctxConsoleTransport = exports.ctxDefault = undefined;

var _datafile = require('datafile');

var ctxDefault = exports.ctxDefault = (0, _datafile.loadJsonFileSync)(__dirname + '/ctxDefault.yml');
var ctxConsoleTransport = exports.ctxConsoleTransport = (0, _datafile.mergeJsonFilesSync)([__dirname + '/ctxDefault.yml', __dirname + '/consoleTransport.yml']);
var ctxConsoleAndFileTransport = exports.ctxConsoleAndFileTransport = (0, _datafile.mergeJsonFilesSync)([__dirname + '/ctxDefault.yml', __dirname + '/consoleAndFileTransport.yml']);
var expectedOutputLog = exports.expectedOutputLog = (0, _datafile.loadJsonFileSync)(__dirname + '/output.log.yml');