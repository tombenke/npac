'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.expectedOutputLog = exports.ctxConsoleAndFileTransportDefaultLevel = exports.ctxConsoleAndFileTransportDebugLevel = exports.ctxConsoleTransportDebugLevel = exports.ctxConsoleTransportDefaultLevel = exports.ctxDefault = undefined;

var _datafile = require('datafile');

var ctxDefault = exports.ctxDefault = (0, _datafile.loadJsonFileSync)(__dirname + '/ctxDefault.yml');
var ctxConsoleTransportDefaultLevel = exports.ctxConsoleTransportDefaultLevel = (0, _datafile.mergeJsonFilesSync)([__dirname + '/ctxDefault.yml', __dirname + '/consoleTransportDefaultLevel.yml']);
var ctxConsoleTransportDebugLevel = exports.ctxConsoleTransportDebugLevel = (0, _datafile.mergeJsonFilesSync)([__dirname + '/ctxDefault.yml', __dirname + '/consoleTransportDebugLevel.yml']);
var ctxConsoleAndFileTransportDebugLevel = exports.ctxConsoleAndFileTransportDebugLevel = (0, _datafile.mergeJsonFilesSync)([__dirname + '/ctxDefault.yml', __dirname + '/consoleAndFileTransportDebugLevel.yml']);
var ctxConsoleAndFileTransportDefaultLevel = exports.ctxConsoleAndFileTransportDefaultLevel = (0, _datafile.mergeJsonFilesSync)([__dirname + '/ctxDefault.yml', __dirname + '/consoleAndFileTransportDefaultLevel.yml']);
var expectedOutputLog = exports.expectedOutputLog = (0, _datafile.loadJsonFileSync)(__dirname + '/output.log.yml');