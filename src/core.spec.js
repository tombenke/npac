import _ from 'lodash'
import expect from 'expect'
import app from './core'
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

    it('#start - check default config', () => {
        const expectedConfig = npacDefaultConfig
        app.start([checkConfig(expectedConfig)])
    })

    it('#start - check default config with endCallback', () => {
        const expectedConfig = npacDefaultConfig
        app.start([checkConfig(expectedConfig)],
            (err, ctx) => expect(ctx.config).toEqual(expectedConfig))
    })

    it('#start - use config object', () => {
        const expectedConfig = _.merge(npacDefaultConfig, testAdapter.config)
        app.start([
            testAdapter,
            checkConfig(expectedConfig)
        ])
    })

    it('#start - use adapter function that returns NO ctxExtension', () => {
        const expectedConfig = _.merge(npacDefaultConfig)
        app.start([
            (ctx, next) => next(null),
            checkConfig(expectedConfig)
        ])
    })

    it('#start - use adapter function that returns `null` as ctxExtension', () => {
        const expectedConfig = _.merge(npacDefaultConfig)
        app.start([
            (ctx, next) => next(null, null),
            checkConfig(expectedConfig)
        ])
    })

    it('#start - use adapter function that returns ctxExtension', () => {
        const expectedConfig = _.merge(npacDefaultConfig, testAdapter.config)
        app.start([
            (ctx, next) => next(null, testAdapter),
            checkConfig(expectedConfig)
        ])
    })

    it('#start - use adapter function with exception on error', () => {
        const expectedConfig = _.merge(npacDefaultConfig, testAdapter.config)
        try {
            app.start([
                (ctx, next) => next(new Error("Wrong adapter init")),
                checkConfig(expectedConfig)
            ])
        } catch (err) {
            expect(err).toEqual('Error: Wrong adapter init')
        }
    })

    it('#start - use adapter function with error on callback', () => {
        app.start([(ctx, next) => next(new Error("Wrong adapter init"), null)],
            (err, ctx) => expect(err).toEqual('Error: Wrong adapter init'))
    })
})
