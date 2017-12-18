import _ from 'lodash'
import expect from 'expect'
import { loadJsonFileSync } from 'datafile'
import { makeCall, makeCallSync } from './index'

const executives = {
    add: (ctx, args, cb) =>
        _.has(args, 'a') && _.has(args, 'b') ?
            cb(null, args.a + args.b) :
            cb(new Error('Wrong or missing arguments')),

    addSync: (ctx, args) => {
        console.log('addSync.args: ', args, _.has(args, 'a') && _.has(args, 'b'))
        if (_.has(args, 'a') && _.has(args, 'b')) {
            return args.a + args.b
        } else {
            throw(new Error('Wrong or missing arguments'))
        }
    }
}

describe('config', () => {
    const ctxOrig = loadJsonFileSync('src/config/fixtures/ctxOrig.yml')
        const ctx = _.merge({}, ctxOrig, { logger: console }, executives)

    it('#makeCallSync - call sync job', (done) => {
        const syncJob = makeCallSync({ name: 'addSync', args: { a: 1, b: 1 } })
        syncJob(ctx, (err, result) => {
            expect(result).toEqual([2])
            done()
        })
    })

    it('#makeCall - call async job', (done) => {
        const asyncJob = makeCall({ name: 'add', args: { a: 1, b: 1 } })
        asyncJob(ctx, (err, result) => {
            expect(result).toEqual([2])
            done()
        })
    })
})
