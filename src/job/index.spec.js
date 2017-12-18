import _ from 'lodash'
import expect from 'expect'
import { loadJsonFileSync } from 'datafile'
import execute from './index'

const executives = {
    add: (ctx, args, cb) =>
        _.has(args, ['a', 'b']) ? cb(null, a + b) : cb(new Error('Wrong or missing arguments')),
    mul: (ctx, args, cb) =>
        _.has(args, ['a', 'b']) ? cb(null, a * b) : cb(new Error('Wrong or missing arguments'))
}

describe('config', () => {
    const ctxOrig = loadJsonFileSync('src/config/fixtures/ctxOrig.yml')
/*
    it('#execute - executives found', (done) => {
        const context = _.merge({}, ctxOrig, executives)
        const taskToExecute = execute({ name: 'add', args: { a: 1, b: 1 } })

        const nextAdapterFun = (err, next) => {
            expect(err).toEqual(null)
            done()
        }

        const resultHandler = (err, ctx, result, next) => {
            expect(err).toEqual(null)
            expect(result).toEqual(2)
            next(null)
        })

        taskToExecute(context, (err, (err, result, nextAdapterFun) => ) => 
    })
*/
})
