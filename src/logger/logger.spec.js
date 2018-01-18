import _ from 'lodash'
import expect from 'expect'
import { addLogger } from './index'
import { loadJsonFileSync, loadTextFileSync, findFilesSync, mergeJsonFilesSync } from 'datafile'

import fs from 'fs'
import path from 'path'
import rimraf from 'rimraf'

const destCleanup = function(cb) {
    const dest = path.resolve('./tmp/')
    console.log('Remove: ', dest)
    rimraf(dest, cb)
}

before(function(done) {
    destCleanup(function() {
        fs.mkdirSync(path.resolve('./tmp'))
        done()
    })
})

after(function(done) {
    destCleanup(done)
//    done()
})


describe('config', () => {

    const writeLog = ctx => {
        ctx.logger.info('Hello logger!')
        ctx.logger.debug('This is a JSON object', { id: '121324231412', payload: { message: 'Some debug info...' }})
        ctx.logger.warn('And another JSON object', { id: '724543275671', payload: { message: 'Some warning!' }})
        ctx.logger.info('Good Bye logger!')
    }

    it('#addLogger - with defaults config', (done) => {
        const ctxDefault = loadJsonFileSync('src/logger/fixtures/ctxDefault.yml')
        addLogger(ctxDefault, (err, ctxExtension) => {
            expect(err).toEqual(null)
            writeLog(ctxExtension)
            done()
        })
    })

    it('#addLogger - with console transport', (done) => {
        const ctx = mergeJsonFilesSync([
            'src/logger/fixtures/ctxDefault.yml',
            'src/logger/fixtures/consoleTransport.yml'
        ])
        console.log('ctx: ', JSON.stringify(ctx, null, '  '))
        addLogger(ctx, (err, ctxExtension) => {
            expect(err).toEqual(null)
            writeLog(ctxExtension)
            done()
        })
    })

    it('#addLogger - with console and file transports', (done) => {
        const ctx = mergeJsonFilesSync([
            'src/logger/fixtures/ctxDefault.yml',
            'src/logger/fixtures/consoleAndFileTransport.yml'
        ])
//        console.log('ctx: ', JSON.stringify(ctx, null, '  '))
        addLogger(ctx, (err, ctxExtension) => {
            expect(err).toEqual(null)
            writeLog(ctxExtension)
            setTimeout(() => {
                expect(findFilesSync('./tmp', /.*/)).toEqual(['tmp/output.log'])
                const logs = loadTextFileSync('tmp/output.log')
                // TODO: parse and check
//                console.log('logs', logs)
                done()
            }, 100)
        })
    })

})
