;(function (window) {
    'use strict';

    var pre_pageYOffset = 0;
    function do_while(condition, action, time) {
        var timer = 0;
        var handler = function () {
            action();
            if (condition()) {
                window.clearTimeout(timer);
            } else {
                timer = window.setTimeout(handler, time);
            }
        }
        timer = window.setTimeout(handler, time);
    }
    do_while(function () {
        if (window.pageYOffset === pre_pageYOffset) {
            window.scrollTo(0, 0);
            return true;
        };
        return false;
    }, function () {
        pre_pageYOffset = window.pageYOffset;
        window.scrollBy(0, window.innerHeight);
    }, 100);
})(window);
