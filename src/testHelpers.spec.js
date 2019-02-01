import expect from 'expect'
import sinon from 'sinon'
import { mergeConfig } from './config/'
import { addLogger } from './logger/'
import { removeSignalHandlers, catchExitSignals, npacStart } from './testHelpers'


describe('adapters/server', () => {
    let sandbox

    const config = {} //_.merge({})

    beforeEach(done => {
        removeSignalHandlers()
        sandbox = sinon.sandbox.create({ useFakeTimers: false })
        done()
    })

    afterEach(done => {
        removeSignalHandlers()
        sandbox.restore()
        done()
    })

    const adapters = [
        mergeConfig(config),
        addLogger,
    ]

    const terminators = [
    ]

    it('#startup, #shutdown', done => {

        catchExitSignals(sandbox, done)

        const testServer = (container, next) => {
            container.logger.info(`Run job to test server`)
            next(null, null)
        }

        npacStart(adapters, [testServer], terminators)
    })
})
