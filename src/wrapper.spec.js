//import _ from 'lodash'
import expect from 'expect'
import npacDefaultConfig from './defaultConfig'
import { runJob, runJobSync } from './wrappers'

describe('wrappers', () => {
    it('#runJobSync - run a sync job in a plain container with logger', (done) => {
        const executives = {
            addSync: (ctx, args) => {
                const result = args.a + args.b
                ctx.logger.info(`addSync(${args.a}, ${args.b}) => ${result}`)
                return result
            }
        }
        const jobDesc = { name: 'addSync', args: { a: 1, b: 1 } }

        runJobSync(npacDefaultConfig, executives, jobDesc, (err, result) => {
            expect(result).toEqual([2])
            done()
        })
    })

    it('#runJob - run an asynchronous job in a plain container with logger', (done) => {
        const executives = {
            add: (ctx, args, cb) => {
                const result = args.a + args.b
                ctx.logger.info(`add(${args.a}, ${args.b}) => ${result}`)
                cb(null, result)
            }
        }
        const jobDesc = { name: 'add', args: { a: 1, b: 1 } }

        runJob(npacDefaultConfig, executives, jobDesc, (err, result) => {
            expect(result).toEqual([2])
            done()
        })
    })
})
