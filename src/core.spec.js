import _ from 'lodash'
import expect from 'expect'
import { start } from './core'
import npacDefaultConfig from './defaultConfig'

describe('core', () => {

    const checkConfig = (expectedConfig) => (ctx, next) => {
        expect(ctx.config).toBeA('object').toEqual(expectedConfig)
        next(null, ctx)
    }

    const testAdapter = {
        testAdapter: { /* testAdapter API */ },
        config: { testAdapter: { name: "testAdapter", port: 4444 } }
    }

    it('#start - with no args', () => {
        start()
    })

    it('#start - check default config', () => {
        const expectedConfig = npacDefaultConfig
        start([checkConfig(expectedConfig)])
    })

    it('#start - check default config with endCallback', () => {
        const expectedConfig = npacDefaultConfig
        start([checkConfig(expectedConfig)], [],
            (err, results) => expect(err).toEqual(null))
    })

    it('#start - use config object', () => {
        const expectedConfig = _.merge(npacDefaultConfig, testAdapter.config)
        start([
            testAdapter,
            checkConfig(expectedConfig)
        ])
    })

    it('#start - use adapter function that returns NO ctxExtension', () => {
        const expectedConfig = _.merge(npacDefaultConfig)
        start([
            (ctx, next) => next(null),
            checkConfig(expectedConfig)
        ])
    })

    it('#start - use adapter function that returns `null` as ctxExtension', () => {
        const expectedConfig = _.merge(npacDefaultConfig)
        start([
            (ctx, next) => next(null, null),
            checkConfig(expectedConfig)
        ])
    })

    it('#start - use adapter function that returns ctxExtension', () => {
        const expectedConfig = _.merge(npacDefaultConfig, testAdapter.config)
        start([
            (ctx, next) => next(null, testAdapter),
            checkConfig(expectedConfig)
        ])
    })

    it('#start - use adapter function with exception on error', () => {
        const expectedConfig = _.merge(npacDefaultConfig, testAdapter.config)
        try {
            start([
                (ctx, next) => next(new Error("Wrong adapter init")),
                checkConfig(expectedConfig)
            ])
        } catch (err) {
            expect(err).toEqual('Error: Wrong adapter init')
        }
    })

    it('#start - use adapter function with error on callback', () => {
        start([(ctx, next) => next(new Error("Wrong adapter init"))], [],
            (err, ctx) => expect(err).toEqual('Error: Wrong adapter init'))
    })

    it('#start - with job returns error', (done) => {
        start([], [(ctx, cb) => cb(new Error('Job returned error'), {})], (err, results) => {
            expect(err).toEqual('Error: Job returned error')
            done()
        })
    })

    it('#start - with job as a non function object', (done) => {
        start([], [{ /* It should be a function */ }], (err, results) => {
            expect(err).toEqual('Error: Job must be a function')
            done()
        })
    })
})
