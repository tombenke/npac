import _ from 'lodash'
import expect from 'expect'
import { loadJsonFileSync } from 'datafile'
import { runJob, runJobSync } from './index'

const executives = {
    add: (ctx, args, cb) =>
        _.has(args, ['a', 'b']) ? cb(null, a + b) : cb(new Error('Wrong or missing arguments')),
    mul: (ctx, args, cb) =>
        _.has(args, ['a', 'b']) ? cb(null, a * b) : cb(new Error('Wrong or missing arguments'))
}

describe('config', () => {
    const ctxOrig = loadJsonFileSync('src/config/fixtures/ctxOrig.yml')

    it('#runJob - call sync job', (done) => {
        const syncJobExecutive = { addSync: (ctx, args) => args.a + args.b }
        const ctx = _.merge({}, ctxOrig, { logger: console }, syncJobExecutive)
        const syncJob = runJobSync({ name: 'addSync', args: { a: 1, b: 1 } })
        syncJob(ctx, (err, result) => {
            expect(result).toEqual([2])
            done()
        })
    })

/*

    it('#start - call async job', (done) => {

        app.start([
            { add: (ctx, args, cb) => cb(null, args.a + args.b) },
        ], [
            app.runJob({ name: 'add', args: { a: 1, b: 1 } })
        ], (err, result) => {
                expect(result).toEqual([2])
                done()
            })
    })

*/
})
