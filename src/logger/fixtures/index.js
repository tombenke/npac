import { loadJsonFileSync, mergeJsonFilesSync } from 'datafile'

export const ctxDefault = loadJsonFileSync(__dirname + '/ctxDefault.yml')
export const ctxConsoleTransportDefaultLevel = mergeJsonFilesSync([
    __dirname + '/ctxDefault.yml',
    __dirname + '/consoleTransportDefaultLevel.yml'
])
export const ctxConsoleTransportDebugLevel = mergeJsonFilesSync([
    __dirname + '/ctxDefault.yml',
    __dirname + '/consoleTransportDebugLevel.yml'
])
export const ctxConsoleAndFileTransportDebugLevel = mergeJsonFilesSync([
    __dirname + '/ctxDefault.yml',
    __dirname + '/consoleAndFileTransportDebugLevel.yml'
])
export const ctxConsoleAndFileTransportDefaultLevel = mergeJsonFilesSync([
    __dirname + '/ctxDefault.yml',
    __dirname + '/consoleAndFileTransportDefaultLevel.yml'
])
export const expectedOutputLog = loadJsonFileSync(__dirname + '/output.log.yml')
