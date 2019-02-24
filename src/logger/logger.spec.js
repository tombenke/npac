import _ from 'lodash'
import expect from 'expect'
import { loadTextFileSync, findFilesSync } from 'datafile'
import { addLogger, makeTransport } from './index'
import {
    ctxDefault,
    ctxConsoleTransportDefaultLevel,
    ctxConsoleTransportDebugLevel,
    ctxConsoleAndFileTransportDebugLevel,
    ctxConsoleAndFileTransportDefaultLevel,
    expectedOutputLog
} from './fixtures/'

import fs from 'fs'
import path from 'path'
import rimraf from 'rimraf'

const destCleanup = cb => {
    const dest = path.resolve('./tmp/')
    rimraf(dest, cb)
}

before(done => {
    destCleanup(() => {
        fs.mkdirSync(path.resolve('./tmp'))
        done()
    })
})

after(done => {
    destCleanup(done)
})

describe('config', () => {
    const writeLog = ctx => {
        ctx.logger.info('Hello logger!')
        ctx.logger.debug('This is a JSON object', { id: '121324231412', payload: { message: 'Some debug info...' } })
        ctx.logger.warn('And another JSON object', { id: '724543275671', payload: { message: 'Some warning!' } })
        ctx.logger.info('Good Bye logger!')
    }

    it('#addLogger - with defaults config', done => {
        addLogger(ctxDefault, (err, ctxExtension) => {
            expect(err).toEqual(null)
            writeLog(ctxExtension)
            done()
        })
    })

    it('#addLogger - with console transport', done => {
        console.log('ctxConsoleTransportDebugLevel: ', JSON.stringify(ctxConsoleTransportDebugLevel, null, '  '))
        addLogger(ctxConsoleTransportDebugLevel, (err, ctxExtension) => {
            expect(err).toEqual(null)
            writeLog(ctxExtension)
            done()
        })
    })

    it('#addLogger - with console and file transports', done => {
        addLogger(ctxConsoleAndFileTransportDebugLevel, (err, ctxExtension) => {
            expect(err).toEqual(null)
            writeLog(ctxExtension)
            setTimeout(() => {
                expect(findFilesSync('./tmp', /.*/)).toEqual(['tmp/output.log'])
                const outputLog = loadTextFileSync('tmp/output.log')
                    .split('\n')
                    .map(log => {
                        if (log !== '') {
                            return { ...JSON.parse(log), ...{ timestamp: '2019-02-24T15:38:50.778Z' } }
                        }
                    })
                    .filter(log => !_.isUndefined(log))
                expect(outputLog).toEqual(expectedOutputLog)
                done()
            }, 100)
        })
    })

    it('#makeTransport - console default level', done => {
        const config = ctxDefault.config
        const transConfig = ctxConsoleTransportDefaultLevel.config.logger.transports.console
        const transport = makeTransport(config)(transConfig)
        expect(transport.name).toEqual('console')
        expect(transport.level).toEqual('info')
        done()
    })

    it('#makeTransport - console warn level inherited from logger', done => {
        const config = { ...ctxDefault.config, ...{ logger: { level: 'warn' } } }
        const transConfig = ctxConsoleTransportDefaultLevel.config.logger.transports.console
        const transport = makeTransport(config)(transConfig)
        expect(transport.name).toEqual('console')
        expect(transport.level).toEqual('warn')
        done()
    })

    it('#makeTransport - console debug level', done => {
        const config = ctxDefault.config
        const transConfig = ctxConsoleTransportDebugLevel.config.logger.transports.console
        const transport = makeTransport(config)(transConfig)
        expect(transport.name).toEqual('console')
        expect(transport.level).toEqual('debug')
        done()
    })

    it('#makeTransport - console and file debug level', done => {
        const config = ctxDefault.config
        const consoleTransConfig = ctxConsoleAndFileTransportDebugLevel.config.logger.transports.console
        const consoleTransport = makeTransport(config)(consoleTransConfig)
        expect(consoleTransport.name).toEqual('console')
        expect(consoleTransport.level).toEqual('debug')
        const fileTransConfig = ctxConsoleAndFileTransportDebugLevel.config.logger.transports.file
        const fileTransport = makeTransport(config)(fileTransConfig)
        expect(fileTransport.name).toEqual('file')
        expect(fileTransport.level).toEqual('debug')
        done()
    })

    it('#makeTransport - console and file default level', done => {
        const config = ctxDefault.config
        const consoleTransConfig = ctxConsoleAndFileTransportDefaultLevel.config.logger.transports.console
        const consoleTransport = makeTransport(config)(consoleTransConfig)
        expect(consoleTransport.name).toEqual('console')
        expect(consoleTransport.level).toEqual('info')
        const fileTransConfig = ctxConsoleAndFileTransportDefaultLevel.config.logger.transports.file
        const fileTransport = makeTransport(config)(fileTransConfig)
        expect(fileTransport.name).toEqual('file')
        expect(fileTransport.level).toEqual('info')
        done()
    })

    it('#makeTransport - console and file warn level inherited from logger', done => {
        const config = { ...ctxDefault.config, ...{ logger: { level: 'warn' } } }
        const consoleTransConfig = ctxConsoleAndFileTransportDefaultLevel.config.logger.transports.console
        const consoleTransport = makeTransport(config)(consoleTransConfig)
        expect(consoleTransport.name).toEqual('console')
        expect(consoleTransport.level).toEqual('warn')
        const fileTransConfig = ctxConsoleAndFileTransportDefaultLevel.config.logger.transports.file
        const fileTransport = makeTransport(config)(fileTransConfig)
        expect(fileTransport.name).toEqual('file')
        expect(fileTransport.level).toEqual('warn')
        done()
    })

    it('#makeTransport - console warn level inherited from logger, file silly level', done => {
        const config = { ...ctxDefault.config, ...{ logger: { level: 'warn' } } }
        const consoleTransConfig = ctxConsoleAndFileTransportDefaultLevel.config.logger.transports.console
        const consoleTransport = makeTransport(config)(consoleTransConfig)
        expect(consoleTransport.name).toEqual('console')
        expect(consoleTransport.level).toEqual('warn')
        const fileTransConfig = {
            ...ctxConsoleAndFileTransportDefaultLevel.config.logger.transports.file,
            ...{ level: 'silly' }
        }
        const fileTransport = makeTransport(config)(fileTransConfig)
        expect(fileTransport.name).toEqual('file')
        expect(fileTransport.level).toEqual('silly')
        done()
    })
})
