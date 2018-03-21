import _ from 'lodash'
import sinon from 'sinon'
import expect from 'expect'
import { start } from './core'
import npacDefaultConfig from './defaultConfig'

describe('core', () => {
    let sandbox

    beforeEach(() => {
        sandbox = sinon.sandbox.create({ useFakeTimers: true })
    })

    afterEach(() => {
        const signals = ['SIGTERM', 'SIGINT', 'SIGHUP', 'SIGUSR1', 'SIGUSR2']
        for(const signal in signals) {
            process.removeAllListeners(signals[signal])
        }
        sandbox.restore();
    })

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
        start([checkConfig(expectedConfig)], [], [],
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
        start([(ctx, next) => next(new Error("Wrong adapter init"))], [], [],
            (err, ctx) => expect(err).toEqual('Error: Wrong adapter init'))
    })

    it('#start - with job returns error', (done) => {
        start([], [(ctx, cb) => cb(new Error('Job returned error'), {})], [], (err, results) => {
            expect(err).toEqual('Error: Job returned error')
            done()
        })
    })

    it('#start - with job as a non function object', (done) => {
        start([], [{ /* It should be a function */ }], [], (err, results) => {
            expect(err).toEqual('Error: Job must be a function')
            done()
        })
    })

    it('#start - with terminators and shuts down by SIGTERM', done => {
        let terminatorCalls = []
        sandbox.stub(process, 'exit').callsFake((signal) => {
            console.log("process.exit:", signal, terminatorCalls)
            expect(terminatorCalls).toEqual([ 'firstCall', 'secondCall' ])
            done()
        })
        const terminatorFun = order => (ctx, cb) => {
            terminatorCalls.push(order)
            cb(null, null)
        }

        start([], [], [terminatorFun('firstCall'), terminatorFun('secondCall')], (err, results) => {
            expect(err).toEqual(null)
            process.kill(process.pid, 'SIGTERM')
        })
    })

    it('#start - with terminator function that returns with error', done => {
        const termStub = sinon.stub()
        sandbox.stub(process, 'exit').callsFake((signal) => {
            sinon.assert.called(termStub)
            done()
        })
        const terminatorFunWithErr = (ctx, cb) => {
            termStub()
            cb(new Error('Terminator returned error'), null)
        }

        start([], [], [terminatorFunWithErr], (err, results) => {
            expect(err).toEqual(null)
            process.kill(process.pid, 'SIGTERM')
        })
    })

    it('#start - with job as a non function object', (done) => {
        sandbox.stub(process, 'exit').callsFake((signal) => {
            done()
        })

        start([], [], [{ /* It should be a function */ }], (err, results) => {
            expect(err).toEqual(null)
            process.kill(process.pid, 'SIGTERM')
        })
    })

})
