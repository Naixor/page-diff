(function(window) {
    'use strict';

    var utils = window.utils = {};

    utils.is = function (obj, type) {
        return utils.typeOf(obj) === '[object '+ type +']';
    }

    utils.typeOf = function (obj) {
        return Object.prototype.toString.call(obj);
    }

    utils.unique = function(){
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
            var r = Math.random()*16 | 0;
            return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
        });
    };

    utils.merge = function (source, target) {
        if(utils.is(source, 'Object') && utils.is(target, 'Object')){
            utils.map(target, function(key, value){
                source[key] = utils.merge(source[key], value);
            });
        } else {
            source = target;
        }
        return source;
    }

    utils.map = function (obj, callback) {
        if (!utils.is(callback, 'Function')) {
            return [];
        }
        if (utils.is(obj, 'Array') || utils.is(obj, 'Object') || utils.is(obj, 'NodeList')) {
            var keys = Object.keys(obj);
            for (var i = 0, l = keys.length; i < l; i++) {
                var key = keys[i];
                keys[i] = callback(obj[key], key, i);
            }
            return keys;
        }
        return [];
    }
})(window);
