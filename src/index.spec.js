import expect from 'expect'
import fs from 'fs'
import path from 'path'
import rimraf from 'rimraf'
import npac from './index'

const destCleanup = function(cb) {
    const dest = path.resolve('./tmp/')
    console.log('Remove: ', dest)
    rimraf(dest, cb)
}

before(function(done) {
    destCleanup(function() {
        fs.mkdirSync(path.resolve('./tmp'))
        done()
    })
})

after(function(done) {
    destCleanup(done)
})

const cliMock = (cmdName, cmdArgs, cliConfig) => ({
    parse: (defaults, argv) => ({ command: {name: cmdName, args: cmdArgs}, cliConfig: cliConfig })
})

describe('npac', () => {

    it('#start', () => {
        const defaults = {}
        const commands = {}
        const cli = cliMock('unknown', {}, {})
        const app = npac(defaults, cli, commands)
        app.start()
        //expect(testMe('Hello')).toBeA('string').toEqual('Hello testMe!')
    })
})
