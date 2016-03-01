global.MODE = 'release';

var Log = {
    debug: function () {
        if (global.MODE === 'debug') {
            console.log.apply(console, arguments);
        }
    },
    trace: function () {
        console.trace.apply(console, arguments);
    },
    error: function () {
        console.error.apply(console, arguments);
    }
};

module.exports = Log;
