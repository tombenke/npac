'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.npacStart = exports.catchExitSignals = exports.removeSignalHandlers = undefined;

var _core = require('./core');

var removeSignalHandlers = exports.removeSignalHandlers = function removeSignalHandlers() {
    var signals = ['SIGTERM', 'SIGINT', 'SIGHUP', 'SIGUSR1', 'SIGUSR2'];
    for (var signal in signals) {
        process.removeAllListeners(signals[signal]);
    }
};

var catchExitSignals = exports.catchExitSignals = function catchExitSignals(sandbox, done) {
    return sandbox.stub(process, 'exit').callsFake(function (signal) {
        console.log("process.exit", signal);
        done();
    });
};

var npacStart = exports.npacStart = function npacStart(adapters, jobs, terminators) {
    return (0, _core.start)(adapters, jobs, terminators, function (err, res) {
        console.log('npac startup process and run jobs successfully finished');

        console.log('Send SIGTERM signal');
        process.kill(process.pid, 'SIGTERM');
    });
};