import _ from 'lodash'
import expect from 'expect'
import { loadTextFileSync, findFilesSync } from 'datafile'
import { addLogger, makeTransport } from './index'
import { ctxDefault, ctxConsoleTransport, ctxConsoleAndFileTransport, expectedOutputLog } from './fixtures/'

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
        console.log('ctxConsoleTransport: ', JSON.stringify(ctxConsoleTransport, null, '  '))
        addLogger(ctxConsoleTransport, (err, ctxExtension) => {
            expect(err).toEqual(null)
            writeLog(ctxExtension)
            done()
        })
    })

    it('#addLogger - with console and file transports', done => {
        //        console.log('ctxConsoleAndFileTransport: ', JSON.stringify(ctxConsoleAndFileTransport, null, '  '))
        addLogger(ctxConsoleAndFileTransport, (err, ctxExtension) => {
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
})
