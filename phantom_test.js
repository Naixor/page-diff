var webPage = require('webpage');
var page = webPage.create();
var system = require('system');
var phantom = phantom;

function waitFor(testFx, onReady, timeOutMillis) {
    var maxtimeOutMillis = timeOutMillis ? timeOutMillis : 3000, //< Default Max Timout is 3s
        start = new Date().getTime(),
        condition = false,
        interval = setInterval(function() {
            if ( (new Date().getTime() - start < maxtimeOutMillis) && !condition ) {
                // If not time-out yet and condition not yet fulfilled
                condition = (typeof(testFx) === "string" ? eval(testFx) : testFx()); //< defensive code
            } else {
                if(!condition) {
                    // If condition still not fulfilled (timeout but condition is 'false')
                    console.log("'waitFor()' timeout");
                    phantom.exit(1);
                } else {
                    // Condition fulfilled (timeout and/or condition is 'true')
                    console.log("'waitFor()' finished in " + (new Date().getTime() - start) + "ms.");
                    typeof(onReady) === "string" ? eval(onReady) : onReady(); //< Do what it's supposed to do once the condition is fulfilled
                    clearInterval(interval); //< Stop this interval
                }
            }
        }, 250); //< repeat check every 250ms
};

page.onResourceReceived = function (response) {
    // console.log('Response (#' + response.id + ', stage "' + response.stage + '"): '+ response.url);
    if (response.id === 61 && response.stage === 'end') {

    }
};

page.open('http://h5.baidu.com', function (status) {
    if (status === 'success') {
        page.injectJs('./inject/scroll.js');
        // var dom2object = require('./lib/dom2object.js');
        // var dom = page.evaluate(dom2object, {});
        // console.log(JSON.stringify(dom));
        page.evaluate(function () {
            function px(params) {
                return params + 'px';
            }
            var div = document.createElement('diff-div');
            div.style.position = 'absolute';
            div.style.display = 'inline-block';
            div.style.backgroundColor = 'rgba(0, 0, 0, 1)';
            div.style.border = '1px dashed #333';
            div.style.fontSize = '20px';
            div.style.fontWeight = 'normal';
            div.style.overflow = 'hidden';
            div.style.color = '#000';
            div.style.zIndex = '99999';
            div.style.boxShadow = '0 2px 5px rgba(0, 0, 0, 0.4)';
            div.style.left = px(100);
            div.style.top = px(100);
            div.style.width = px(200);
            div.style.height = px(200);
            document.body.appendChild(div);
        });
        // setTimeout(function () {
            page.render('ph_test1.png', 100);
            phantom.exit(0);
        // }, 0);
    }
});
