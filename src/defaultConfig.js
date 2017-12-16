import thisPackage from '../package.json'

const npacDefaultConfig = {
    app: {
        name: thisPackage.name,
        version: thisPackage.version
    }
}

module.exports = npacDefaultConfig
