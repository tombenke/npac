import thisPackage from '../package.json'

const npacDefaultConfig = {
    app: {
        name: thisPackage.name,
        version: thisPackage.version
    },
    NODE_ENV: process.env.NODE_ENV || 'development'
}

module.exports = npacDefaultConfig
