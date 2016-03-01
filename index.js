var __dirname = __dirname;

var spawn = require('child_process').spawn;
var path = require('path');
var _ = require('./lib/util');
var DEFAULT_USER_DIR = process.cwd();
var MAIN_SCRIPT = path.join(__dirname, 'main.js');
var diff = require('./lib/diff');
var Promise = require('promise');
var fs = require('fs');

var defaultSettings = {
    phantom: {
        '--max-disk-cache-size' : '0',
        '--disk-cache' : 'false',
        '--ignore-ssl-errors' : 'yes',
        '--web-security': 'false'
    },
    highlight: {
        addElement: {
            boder: '',
            background: ''
        }
    },
    diff: {
        ignoreStyles: ['width', 'height'],
        ignoreAttributes: ['href', 'src', 'style', 'data-field', 'class'],
        ignoreSelectors: []
    }
};

var phantomCli = _.map(defaultSettings.phantom, function (v, k) {
    return [k, v].join('=');
});

var getDomTree = function (url) {
    return new Promise(function (resolve) {
        var settings = JSON.stringify(defaultSettings.diff);
        var getDomTreeCli = [MAIN_SCRIPT, url, 'DOMTREE', settings].concat(phantomCli);
        var spawnDomTree = spawn('phantomjs', getDomTreeCli);
        var bufArr = [];
        var bufTotalLength = 0;
        spawnDomTree.stdout.on('data', function (buf) {
            bufArr.push(buf);
            bufTotalLength += buf.length;
        });
        spawnDomTree.on('exit', function () {
            resolve(Buffer.concat(bufArr, bufTotalLength).toString('utf8'));
        });
        spawnDomTree.stderr.on('data', function (err) {
            console.log(err.toString());
        });
    });
};

var capture = function (url, diffInfo) {
    return new Promise(function (resolve) {
        var settings = JSON.stringify(defaultSettings.highlight);
        var captureCli = [MAIN_SCRIPT, url, 'CAPTURE', settings, JSON.stringify(diffInfo)].concat(phantomCli);
        var spawnCapture = spawn('phantomjs', captureCli);
        var bufArr = [];
        var bufTotalLength = 0;
        spawnCapture.stdout.on('data', function (buf) {
            bufArr.push(buf);
            bufTotalLength += buf.length;
        });
        spawnCapture.on('exit', function () {
            resolve(Buffer.concat(bufArr, bufTotalLength).toString('utf8'));
        });
        spawnCapture.stderr.on('data', function (err) {
            console.log(err.toString());
        });
    });
};

// var doms = JSON.parse('['+ fs.readFileSync("doms.json") +']');
// var result = diff(doms[0], doms[1], {MODE: ''});
// fs.writeFile('r.json', JSON.stringify(result));
// return;

// var lUrl = "http://tieba.baidu.com/f?ie=utf-8&kw=%E7%8B%97",
//     rUrl = "http://tieba.baidu.com/f?ie=utf-8&kw=%E7%8C%AB";
var lUrl = "http://h5.baidu.com",
    rUrl = "http://legend.baidu.com";

Promise.all([
    getDomTree(lUrl),
    getDomTree(rUrl)
]).then(function (doms) {
    console.log('domTree done!');
    fs.writeFile('doms.json', doms.concat(','));
    var results = diff(JSON.parse(doms[0]), JSON.parse(doms[1]), {MODE: 'strict'});
    fs.writeFile('r.json', JSON.stringify(results));

    var lDiffArr = [], rDiffArr = [];
    var moveIdx = 0, modifyIdx = 0;

    function highlightInfoFactory(result, obj, text) {
        return {
            action: result.action,
            path: obj.path,
            rect: obj.rect,
            text: text || ''
        };
    }

    results.forEach(function (result) {
        switch (result.action) {
            case 'moveElement':
                moveIdx++;
                lDiffArr.push(highlightInfoFactory(result, result.left, moveIdx));
                rDiffArr.push(highlightInfoFactory(result, result.right, moveIdx));
                break;
            case 'modifyElement':
                modifyIdx++;
                lDiffArr.push(highlightInfoFactory(result, result.left, modifyIdx));
                rDiffArr.push(highlightInfoFactory(result, result.right, modifyIdx));
                break;
            case 'addElement':
                rDiffArr.push(highlightInfoFactory(result, result.right));
                break;
            case 'removeElement':
                lDiffArr.push(highlightInfoFactory(result, result.left));
                break;
            default: return;
        }
    });
    results = null;
console.log('diff done: ', lDiffArr.length, rDiffArr.length);
    return Promise.all([
        capture(lUrl, lDiffArr),
        capture(rUrl, rDiffArr)
    ]);
}, function (errs) {
    console.log(errs);
}).then(function (captures) {
    console.log(captures.join('-----------\n'));
}, function (errs) {
    console.log(errs);
});
