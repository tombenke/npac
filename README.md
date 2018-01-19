# npac

[![experimental](http://badges.github.io/stability-badges/dist/experimental.svg)](http://github.com/badges/stability-badges)
[![npm version][npm-badge]][npm-url]
[![Build Status][travis-badge]][travis-url]
[![Coveralls][BadgeCoveralls]][Coveralls]

`npac` is a lightweight Ports and Adapters Container for applications running on Node.js platform.

This module provides a framework for applications to:
- clearly separate the infrastructure code from business domain code,
- centrally manage configuration (defaults, environment, config file, cli),
- make application life-cycle management (startup, shutdown, signal handling),
- provide built-in, configurable logging and monitoring capabilities.

Read first the [documentation](docs/intro.md) to understand how it works.

Study the [npac-example-cli](https://github.com/tombenke/npac-example-cli) example project,
which demonstrates how to use npac to implement a simple command line utility.

See the [API documentation](https://tombenke.github.io/npac/api/index.html) and the unit tests
for further details on how to use this library.

## Installation

Run the install command:

    npm install --save npac


## Development

During the development to create the dist package, run either:

```bash
    npm run build
```

or use

```bash
    npm run test:watch
```

Update the documentation:

```bash
    npm run docs
```

Check the source code:

```bash
    npm run test
    npm run lint
```

Gain test coverage report:

```bash
    npm run coverage
```

## References and further readings

- [Hexagonal Architecture (a.k.a. Ports and Adapters) by Alistair Cockburn](http://alistair.cockburn.us/Hexagonal+architecture)
- [The Clean Architecture](https://8thlight.com/blog/uncle-bob/2012/08/13/the-clean-architecture.html)
- [Clean Architecture design in NodeJS](https://solidgeargroup.com/clean-architecture-in-nodejs)
- [Ports-And-Adapters / Hexagonal Architecture by Garfixia software Architectures](http://www.dossier-andreas.net/software_architecture/ports_and_adapters.html)
- [Node.js Best Practices](https://github.com/i0natan/nodebestpractices)
- [Checklist: Node.JS production best practices](http://goldbergyoni.com/checklist-best-practice-of-node-js-in-production/)

---

This project was generated from the [es6-module-archetype](https://github.com/tombenke/es6-module-archetype)
by the [kickoff](https://github.com/tombenke/kickoff) utility.

[npm-badge]: https://badge.fury.io/js/npac.svg
[npm-url]: https://badge.fury.io/js/npac
[travis-badge]: https://api.travis-ci.org/tombenke/npac.svg
[travis-url]: https://travis-ci.org/tombenke/npac
[Coveralls]: https://coveralls.io/github/tombenke/npac?branch=master
[BadgeCoveralls]: https://coveralls.io/repos/github/tombenke/npac/badge.svg?branch=master

