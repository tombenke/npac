import { start } from './core'

export const removeSignalHandlers = () => {
    const signals = ['SIGTERM', 'SIGINT', 'SIGHUP', 'SIGUSR1', 'SIGUSR2']
    for(const signal in signals) {
        process.removeAllListeners(signals[signal])
    }
}

export const catchExitSignals = (sandbox, done) =>
    sandbox.stub(process, 'exit').callsFake((signal) => {
        console.log("process.exit", signal)
        done()
    })

export const npacStart = (adapters, jobs, terminators) => start(adapters, jobs, terminators, (err, res) => {
        console.log('npac startup process and run jobs successfully finished')

        console.log('Send SIGTERM signal')
        process.kill(process.pid, 'SIGTERM')
    })
