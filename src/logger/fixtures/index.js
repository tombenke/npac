import { loadJsonFileSync, mergeJsonFilesSync } from 'datafile'

export const ctxDefault = loadJsonFileSync(__dirname + '/ctxDefault.yml')
export const ctxConsoleTransport = mergeJsonFilesSync([
    __dirname + '/ctxDefault.yml',
    __dirname + '/consoleTransport.yml'
])
export const ctxConsoleAndFileTransport = mergeJsonFilesSync([
    __dirname + '/ctxDefault.yml',
    __dirname + '/consoleAndFileTransport.yml'
])
export const expectedOutputLog = loadJsonFileSync(__dirname + '/output.log.yml')
