var utils = module.exports = {};

utils.is = function (obj, type) {
    return Object.prototype.toString.call(obj) === '[object '+ type +']';
}

utils.unique = function(){
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = Math.random()*16 | 0;
        return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
    });
};

utils.pathjoin = function (url, join_url) {
    // Split the inputs into a list of path commands.
    var parts = [];
    for (var i = 0, l = arguments.length; i < l; i++) {
        parts = parts.concat(arguments[i].split("/"));
    }
    // Interpret the path commands to get the new resolved path.
    var newParts = [];
    for (i = 0, l = parts.length; i < l; i++) {
        var part = parts[i];
        // Remove leading and trailing slashes
        // Also remove "." segments
        if (!part || part === ".") continue;
        // Interpret ".." to pop the last segment
        if (part === "..") newParts.pop();
        // Push new path segments.
        else newParts.push(part);
    }
    if (parts[0] === "") newParts.unshift("");
    return newParts.join("/") || (newParts.length ? "/" : ".");
}

utils.merge = function (source, target) {
    if (!target) {
        return source;
    }
    if(utils.is(source, 'Object') && utils.is(target, 'Object')){
        utils.map(target, function(value, key){
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

/*
 * JavaScript MD5 1.0.1
 * https://github.com/blueimp/JavaScript-MD5
 *
 * Copyright 2011, Sebastian Tschan
 * https://blueimp.net
 *
 * Licensed under the MIT license:
 * http://www.opensource.org/licenses/MIT
 *
 * Based on
 * A JavaScript implementation of the RSA Data Security, Inc. MD5 Message
 * Digest Algorithm, as defined in RFC 1321.
 * Version 2.2 Copyright (C) Paul Johnston 1999 - 2009
 * Other contributors: Greg Holt, Andrew Kepert, Ydnar, Lostinet
 * Distributed under the BSD License
 * See http://pajhome.org.uk/crypt/md5 for more info.
 */

utils.md5 = function(){"use strict";function n(n,r){var t=(65535&n)+(65535&r),u=(n>>16)+(r>>16)+(t>>16);return u<<16|65535&t}function r(n,r){return n<<r|n>>>32-r}function t(t,u,e,o,c,f){return n(r(n(n(u,t),n(o,f)),c),e)}function u(n,r,u,e,o,c,f){return t(r&u|~r&e,n,r,o,c,f)}function e(n,r,u,e,o,c,f){return t(r&e|u&~e,n,r,o,c,f)}function o(n,r,u,e,o,c,f){return t(r^u^e,n,r,o,c,f)}function c(n,r,u,e,o,c,f){return t(u^(r|~e),n,r,o,c,f)}function f(r,t){r[t>>5]|=128<<t%32,r[(t+64>>>9<<4)+14]=t;var f,i,a,h,g,l=1732584193,v=-271733879,d=-1732584194,C=271733878;for(f=0;f<r.length;f+=16)i=l,a=v,h=d,g=C,l=u(l,v,d,C,r[f],7,-680876936),C=u(C,l,v,d,r[f+1],12,-389564586),d=u(d,C,l,v,r[f+2],17,606105819),v=u(v,d,C,l,r[f+3],22,-1044525330),l=u(l,v,d,C,r[f+4],7,-176418897),C=u(C,l,v,d,r[f+5],12,1200080426),d=u(d,C,l,v,r[f+6],17,-1473231341),v=u(v,d,C,l,r[f+7],22,-45705983),l=u(l,v,d,C,r[f+8],7,1770035416),C=u(C,l,v,d,r[f+9],12,-1958414417),d=u(d,C,l,v,r[f+10],17,-42063),v=u(v,d,C,l,r[f+11],22,-1990404162),l=u(l,v,d,C,r[f+12],7,1804603682),C=u(C,l,v,d,r[f+13],12,-40341101),d=u(d,C,l,v,r[f+14],17,-1502002290),v=u(v,d,C,l,r[f+15],22,1236535329),l=e(l,v,d,C,r[f+1],5,-165796510),C=e(C,l,v,d,r[f+6],9,-1069501632),d=e(d,C,l,v,r[f+11],14,643717713),v=e(v,d,C,l,r[f],20,-373897302),l=e(l,v,d,C,r[f+5],5,-701558691),C=e(C,l,v,d,r[f+10],9,38016083),d=e(d,C,l,v,r[f+15],14,-660478335),v=e(v,d,C,l,r[f+4],20,-405537848),l=e(l,v,d,C,r[f+9],5,568446438),C=e(C,l,v,d,r[f+14],9,-1019803690),d=e(d,C,l,v,r[f+3],14,-187363961),v=e(v,d,C,l,r[f+8],20,1163531501),l=e(l,v,d,C,r[f+13],5,-1444681467),C=e(C,l,v,d,r[f+2],9,-51403784),d=e(d,C,l,v,r[f+7],14,1735328473),v=e(v,d,C,l,r[f+12],20,-1926607734),l=o(l,v,d,C,r[f+5],4,-378558),C=o(C,l,v,d,r[f+8],11,-2022574463),d=o(d,C,l,v,r[f+11],16,1839030562),v=o(v,d,C,l,r[f+14],23,-35309556),l=o(l,v,d,C,r[f+1],4,-1530992060),C=o(C,l,v,d,r[f+4],11,1272893353),d=o(d,C,l,v,r[f+7],16,-155497632),v=o(v,d,C,l,r[f+10],23,-1094730640),l=o(l,v,d,C,r[f+13],4,681279174),C=o(C,l,v,d,r[f],11,-358537222),d=o(d,C,l,v,r[f+3],16,-722521979),v=o(v,d,C,l,r[f+6],23,76029189),l=o(l,v,d,C,r[f+9],4,-640364487),C=o(C,l,v,d,r[f+12],11,-421815835),d=o(d,C,l,v,r[f+15],16,530742520),v=o(v,d,C,l,r[f+2],23,-995338651),l=c(l,v,d,C,r[f],6,-198630844),C=c(C,l,v,d,r[f+7],10,1126891415),d=c(d,C,l,v,r[f+14],15,-1416354905),v=c(v,d,C,l,r[f+5],21,-57434055),l=c(l,v,d,C,r[f+12],6,1700485571),C=c(C,l,v,d,r[f+3],10,-1894986606),d=c(d,C,l,v,r[f+10],15,-1051523),v=c(v,d,C,l,r[f+1],21,-2054922799),l=c(l,v,d,C,r[f+8],6,1873313359),C=c(C,l,v,d,r[f+15],10,-30611744),d=c(d,C,l,v,r[f+6],15,-1560198380),v=c(v,d,C,l,r[f+13],21,1309151649),l=c(l,v,d,C,r[f+4],6,-145523070),C=c(C,l,v,d,r[f+11],10,-1120210379),d=c(d,C,l,v,r[f+2],15,718787259),v=c(v,d,C,l,r[f+9],21,-343485551),l=n(l,i),v=n(v,a),d=n(d,h),C=n(C,g);return[l,v,d,C]}function i(n){var r,t="";for(r=0;r<32*n.length;r+=8)t+=String.fromCharCode(n[r>>5]>>>r%32&255);return t}function a(n){var r,t=[];for(t[(n.length>>2)-1]=void 0,r=0;r<t.length;r+=1)t[r]=0;for(r=0;r<8*n.length;r+=8)t[r>>5]|=(255&n.charCodeAt(r/8))<<r%32;return t}function h(n){return i(f(a(n),8*n.length))}function g(n,r){var t,u,e=a(n),o=[],c=[];for(o[15]=c[15]=void 0,e.length>16&&(e=f(e,8*n.length)),t=0;16>t;t+=1)o[t]=909522486^e[t],c[t]=1549556828^e[t];return u=f(o.concat(a(r)),512+8*r.length),i(f(c.concat(u),640))}function l(n){var r,t,u="0123456789abcdef",e="";for(t=0;t<n.length;t+=1)r=n.charCodeAt(t),e+=u.charAt(r>>>4&15)+u.charAt(15&r);return e}function v(n){return unescape(encodeURIComponent(n))}function d(n){return h(v(n))}function C(n){return l(d(n))}function A(n,r){return g(v(n),v(r))}function m(n,r){return l(A(n,r))}function s(n,r,t){return r?t?A(r,n):m(r,n):t?d(n):C(n)}return s}();
