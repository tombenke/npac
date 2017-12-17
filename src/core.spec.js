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

    it('#startup - check default config', () => {
        const expectedConfig = npacDefaultConfig
        app.startup([checkConfig(expectedConfig)])
    })

    it('#startup - check default config with endCallback', () => {
        const expectedConfig = npacDefaultConfig
        app.startup([checkConfig(expectedConfig)],
            (err, ctx) => expect(ctx.config).toEqual(expectedConfig))
    })

    it('#startup - use config object', () => {
        const expectedConfig = _.merge(npacDefaultConfig, testAdapter.config)
        app.startup([
            testAdapter,
            checkConfig(expectedConfig)
        ])
    })

    it('#startup - use adapter function that returns NO ctxExtension', () => {
        const expectedConfig = _.merge(npacDefaultConfig)
        app.startup([
            (ctx, next) => next(null),
            checkConfig(expectedConfig)
        ])
    })

    it('#startup - use adapter function that returns `null` as ctxExtension', () => {
        const expectedConfig = _.merge(npacDefaultConfig)
        app.startup([
            (ctx, next) => next(null, null),
            checkConfig(expectedConfig)
        ])
    })

    it('#startup - use adapter function that returns ctxExtension', () => {
        const expectedConfig = _.merge(npacDefaultConfig, testAdapter.config)
        app.startup([
            (ctx, next) => next(null, testAdapter),
            checkConfig(expectedConfig)
        ])
    })

    it('#startup - use adapter function with exception on error', () => {
        const expectedConfig = _.merge(npacDefaultConfig, testAdapter.config)
        try {
            app.startup([
                (ctx, next) => next(new Error("Wrong adapter init")),
                checkConfig(expectedConfig)
            ])
        } catch (err) {
            expect(err).toEqual('Error: Wrong adapter init')
        }
    })

    it('#startup - use adapter function with error on callback', () => {
        app.startup([(ctx, next) => next(new Error("Wrong adapter init"), null)],
            (err, ctx) => expect(err).toEqual('Error: Wrong adapter init'))
    })
})
