var phantom = phantom;
var global = global;
var webPage = require('webpage');
var system = require('system');
var fs = require('fs');
var _ = require('./lib/util');

global.MODE = 'release';

var Log = {
    debug: function () {
        switch (global.MODE) {
            case 'debug':
                console.log.apply(console, arguments);
                break;
            case 'release':
                // var content = [];
                // for (var i = 0; arguments[i]; i++) {
                //     content.push(arguments[i]);
                // }
                // fs.write('error.txt', content.join(' ') + '\n', 'a');
                break;
        }
    },
    trace: function () {
        console.trace.apply(console, arguments);
    },
    error: function () {
        console.error.apply(console, arguments);
    }
};

phantom.onError = function(msg, trace) {
    var msgStack = ['PHANTOM ERROR: ' + msg];
    if (trace && trace.length) {
        msgStack.push('TRACE:');
        trace.forEach(function(t) {
            msgStack.push(' -> ' + (t.file || t.sourceURL) + ': ' + t.line + (t.function ? ' (in function ' + t.function +')' : ''));
        });
    }
    Log.error(msgStack.join('\n'));
    phantom.exit(1);
};

if (system.args.length === 1) {
    Log.error('未传入url');
    phantom.exit(1);
} else {
    var Main = function(system) {
        this.url = system.args[1];
        this.mode = system.args[2];
        this.settings = system.args[3];
        if (this.mode === 'CAPTURE') {
            this.UUID = _.md5(this.url);
            this.captureInfo = JSON.parse(system.args[4]);
        }
        this.settings.screenCaptureDir = this.settings.screenCaptureDir || '';

        this.page = webPage.create();
        // page setting start
        this.page.viewportSize = {
            width: 1200,
            height: 800
        };
        this.page.settings.webSecurityEnabled = false;

        if (this.settings) {
            try {
                this.settings = JSON.parse(this.settings);
            } catch (e) {
                this.settings = {};
            }
        } else {
            this.settings = {};
        }

        if (this.settings.userAgent) {
            this.page.settings.userAgent = this.settings.page.userAgent;
        }

        if (this.settings.cookie) {
            if (!this.settings.cookie.domain) {
                this.settings.cookie.domain = this.url.match(/^(?:https?:\/\/)?(?:[^@\n]+@)?(?:www\.)?([^:\/\n]+)/im)[1];
            }
            phantom.addCookie(this.settings.cookie);
        }

        if (this.settings.viewportSize) {
            _.merge(this.settings.viewportSize, this.page.viewportSize);
        }

        this.page.settings.resourceTimeout = this.settings.resourceTimeout || 30 * 1000;
    };

    Main.prototype.exit = function (code) {
        // https://github.com/ariya/phantomjs/issues/12697
        setTimeout(function(){
            if (this.page) this.page.close();
            phantom.exit(code);
        }.bind(this), 0);
        // phantom.onError = function(){};
        // throw new Error('');
    };

    Main.prototype.createPage = function (process) {
        var self = this;
        var page = this.page;

        var resourceLoadNum = 0;
        var timerId = 0;

        page.onLoadStarted = function () {
            if (page.url && page.url !== 'about:blank') {
                clearTimeout(timerId);
            }
        };

        // page.onLoadFinished = function () {
        //
        // }

        page.onResourceRequested = function(req) {
            resourceLoadNum++;
            clearTimeout(timerId);
            Log.debug('start:', resourceLoadNum, req.url);
        };

        page.onResourceReceived = function (res) {
            if (res.stage === 'end') {
                resourceLoadNum--;
                Log.debug('end: ', resourceLoadNum, res.url);
                onPageReady();
            }
        };

        page.onError = function(msg, trace) {
            // var msgStack = ['ERROR: ' + msg];
            // if (trace && trace.length) {
            //     msgStack.push('TRACE:');
            //     trace.forEach(function(t) {
            //         msgStack.push(' -> ' + t.file + ': ' + t.line + (t.function ? ' (in function "' + t.function + '")' : ''));
            //     });
            // }
            // // Log.debug(msgStack.join('\n'));
            // fs.write('error.txt', msgStack.join('\n'));
        };

        page.onResourceTimeout = function resourceLoadFail(req) {
            resourceLoadNum--;
            Log.debug('timeout:', resourceLoadNum, req.url);
            onPageReady();
        };

        page.onResourceError = function(req) {
            Log.debug('resError:', resourceLoadNum, req.url);
            onPageReady();
        };

        page.onConsoleMessage = function(msg) {
            Log.debug('log:', msg);
        };

        page.open(this.url, function (status) {
            if (status === 'success') {
                page.injectJs('./inject/scroll.js');
            } else {
                Log.error('连接失败');
                self.exit(0);
            }
        });

        function onPageReady() {
            // Log.trace(resourceLoadNum);
            if (resourceLoadNum === 0) {
                clearTimeout(timerId);
                timerId = setTimeout(function () {
                    Log.debug(resourceLoadNum);
                    if (resourceLoadNum !== 0) {
                        return;
                    }
                    process.call(this, page);
                }.bind(self), 2000);
            }
        }
    };

    Main.prototype.getDomTree = function () {
        this.createPage(function (page) {
            setTimeout(function () {
                var dom2object = require('./lib/dom2object.js');
                var domObject = page.evaluate(dom2object, this.settings);
                Log.trace(JSON.stringify(domObject));
                this.exit(0); 
            }.bind(this), 500);
        });
    };

    Main.prototype.capture = function () {
        if (this.captureInfo) {
            this.createPage(function (page) {
                var highlight = require('./lib/highlight.js');
                var screenshotPath = this.UUID + '.png';
                page.evaluate(highlight, this.captureInfo);
                page.render(screenshotPath, 100);
                Log.trace(screenshotPath);
                this.exit(0);
            });
        }
    };

    Main.prototype.exec = function () {
        switch (this.mode) {
            case 'CAPTURE':
                this.capture();
                break;
            case 'DOMTREE':
                this.getDomTree();
                break;
        }
    };

    new Main(system).exec();
}
