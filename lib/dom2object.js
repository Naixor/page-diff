module.exports = function (settings) {
    'use strict';

    /**
     * utils function
     */
    var utils = {};

    utils.is = function (obj, type) {
        return utils.typeOf(obj) === '[object '+ type +']';
    };

    utils.typeOf = function (obj) {
        return Object.prototype.toString.call(obj);
    };

    utils.map = function (obj, callback) {
        if (!utils.is(callback, 'Function')) {
            return [];
        }
        if (utils.is(obj, 'NodeList')) {
            obj = [].slice.call(obj);
        }
        if (utils.is(obj, 'Array') || utils.is(obj, 'Object')) {
            var keys = Object.keys(obj);
            for (var i = 0, l = keys.length; i < l; i++) {
                var key = keys[i];
                keys[i] = callback(obj[key], key, i);
            }
            return keys;
        }
        return [];
    };
    
    utils.exclude = function (arr, filters) {
        var len = filters.length;
        if (filters && !len) {
            return arr;
        }
        var nArr = [], idx;
        arr.forEach(function (val) {
            idx = filters.indexOf(val);
            if (len) {
                if (~idx) {
                    filters.splice(idx, 1);
                    len--;
                    return;   
                }
                nArr.push(val);
            } else {
                nArr.push(val);
            }
        });
        return nArr;
    };

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
    
    /* jshint ignore:start */
    var md5 = function () { "use strict"; function n(n, r) { var t = (65535 & n) + (65535 & r), u = (n >> 16) + (r >> 16) + (t >> 16); return u << 16 | 65535 & t } function r(n, r) { return n << r | n >>> 32 - r } function t(t, u, e, o, c, f) { return n(r(n(n(u, t), n(o, f)), c), e) } function u(n, r, u, e, o, c, f) { return t(r & u | ~r & e, n, r, o, c, f) } function e(n, r, u, e, o, c, f) { return t(r & e | u & ~e, n, r, o, c, f) } function o(n, r, u, e, o, c, f) { return t(r ^ u ^ e, n, r, o, c, f) } function c(n, r, u, e, o, c, f) { return t(u ^ (r | ~e), n, r, o, c, f) } function f(r, t) { r[t >> 5] |= 128 << t % 32, r[(t + 64 >>> 9 << 4) + 14] = t; var f, i, a, h, g, l = 1732584193, v = -271733879, d = -1732584194, C = 271733878; for (f = 0; f < r.length; f += 16)i = l, a = v, h = d, g = C, l = u(l, v, d, C, r[f], 7, -680876936), C = u(C, l, v, d, r[f + 1], 12, -389564586), d = u(d, C, l, v, r[f + 2], 17, 606105819), v = u(v, d, C, l, r[f + 3], 22, -1044525330), l = u(l, v, d, C, r[f + 4], 7, -176418897), C = u(C, l, v, d, r[f + 5], 12, 1200080426), d = u(d, C, l, v, r[f + 6], 17, -1473231341), v = u(v, d, C, l, r[f + 7], 22, -45705983), l = u(l, v, d, C, r[f + 8], 7, 1770035416), C = u(C, l, v, d, r[f + 9], 12, -1958414417), d = u(d, C, l, v, r[f + 10], 17, -42063), v = u(v, d, C, l, r[f + 11], 22, -1990404162), l = u(l, v, d, C, r[f + 12], 7, 1804603682), C = u(C, l, v, d, r[f + 13], 12, -40341101), d = u(d, C, l, v, r[f + 14], 17, -1502002290), v = u(v, d, C, l, r[f + 15], 22, 1236535329), l = e(l, v, d, C, r[f + 1], 5, -165796510), C = e(C, l, v, d, r[f + 6], 9, -1069501632), d = e(d, C, l, v, r[f + 11], 14, 643717713), v = e(v, d, C, l, r[f], 20, -373897302), l = e(l, v, d, C, r[f + 5], 5, -701558691), C = e(C, l, v, d, r[f + 10], 9, 38016083), d = e(d, C, l, v, r[f + 15], 14, -660478335), v = e(v, d, C, l, r[f + 4], 20, -405537848), l = e(l, v, d, C, r[f + 9], 5, 568446438), C = e(C, l, v, d, r[f + 14], 9, -1019803690), d = e(d, C, l, v, r[f + 3], 14, -187363961), v = e(v, d, C, l, r[f + 8], 20, 1163531501), l = e(l, v, d, C, r[f + 13], 5, -1444681467), C = e(C, l, v, d, r[f + 2], 9, -51403784), d = e(d, C, l, v, r[f + 7], 14, 1735328473), v = e(v, d, C, l, r[f + 12], 20, -1926607734), l = o(l, v, d, C, r[f + 5], 4, -378558), C = o(C, l, v, d, r[f + 8], 11, -2022574463), d = o(d, C, l, v, r[f + 11], 16, 1839030562), v = o(v, d, C, l, r[f + 14], 23, -35309556), l = o(l, v, d, C, r[f + 1], 4, -1530992060), C = o(C, l, v, d, r[f + 4], 11, 1272893353), d = o(d, C, l, v, r[f + 7], 16, -155497632), v = o(v, d, C, l, r[f + 10], 23, -1094730640), l = o(l, v, d, C, r[f + 13], 4, 681279174), C = o(C, l, v, d, r[f], 11, -358537222), d = o(d, C, l, v, r[f + 3], 16, -722521979), v = o(v, d, C, l, r[f + 6], 23, 76029189), l = o(l, v, d, C, r[f + 9], 4, -640364487), C = o(C, l, v, d, r[f + 12], 11, -421815835), d = o(d, C, l, v, r[f + 15], 16, 530742520), v = o(v, d, C, l, r[f + 2], 23, -995338651), l = c(l, v, d, C, r[f], 6, -198630844), C = c(C, l, v, d, r[f + 7], 10, 1126891415), d = c(d, C, l, v, r[f + 14], 15, -1416354905), v = c(v, d, C, l, r[f + 5], 21, -57434055), l = c(l, v, d, C, r[f + 12], 6, 1700485571), C = c(C, l, v, d, r[f + 3], 10, -1894986606), d = c(d, C, l, v, r[f + 10], 15, -1051523), v = c(v, d, C, l, r[f + 1], 21, -2054922799), l = c(l, v, d, C, r[f + 8], 6, 1873313359), C = c(C, l, v, d, r[f + 15], 10, -30611744), d = c(d, C, l, v, r[f + 6], 15, -1560198380), v = c(v, d, C, l, r[f + 13], 21, 1309151649), l = c(l, v, d, C, r[f + 4], 6, -145523070), C = c(C, l, v, d, r[f + 11], 10, -1120210379), d = c(d, C, l, v, r[f + 2], 15, 718787259), v = c(v, d, C, l, r[f + 9], 21, -343485551), l = n(l, i), v = n(v, a), d = n(d, h), C = n(C, g); return [l, v, d, C] } function i(n) { var r, t = ""; for (r = 0; r < 32 * n.length; r += 8)t += String.fromCharCode(n[r >> 5] >>> r % 32 & 255); return t } function a(n) { var r, t = []; for (t[(n.length >> 2) - 1] = void 0, r = 0; r < t.length; r += 1)t[r] = 0; for (r = 0; r < 8 * n.length; r += 8)t[r >> 5] |= (255 & n.charCodeAt(r / 8)) << r % 32; return t } function h(n) { return i(f(a(n), 8 * n.length)) } function g(n, r) { var t, u, e = a(n), o = [], c = []; for (o[15] = c[15] = void 0, e.length > 16 && (e = f(e, 8 * n.length)), t = 0; 16 > t; t += 1)o[t] = 909522486 ^ e[t], c[t] = 1549556828 ^ e[t]; return u = f(o.concat(a(r)), 512 + 8 * r.length), i(f(c.concat(u), 640)) } function l(n) { var r, t, u = "0123456789abcdef", e = ""; for (t = 0; t < n.length; t += 1)r = n.charCodeAt(t), e += u.charAt(r >>> 4 & 15) + u.charAt(15 & r); return e } function v(n) { return unescape(encodeURIComponent(n)) } function d(n) { return h(v(n)) } function C(n) { return l(d(n)) } function A(n, r) { return g(v(n), v(r)) } function m(n, r) { return l(A(n, r)) } function s(n, r, t) { return r ? t ? A(r, n) : m(r, n) : t ? d(n) : C(n) } return s } ();
    /* jshint ignore:end */

    /**
     * convert dom object to js object.
     * js object seems like below:
     * {
     * 	name: element tagName
     * 	type: element type in js, get by `Object.prototype.toString.call`.
     * 	position:
     * 	display:
     * 	rect: {
     * 			x:
     * 			y:
     * 			width:
     * 			height:
     * 			margin:
     * 			padding:
     * 		  }
     * 	style: element's styles except `position` `margin` `padding` `display` `width` `height`.
     * 	attribute: element attributes like `href`, `src`...
     * 	content: text context.
     * }
     * If `#text` in an element, we use `<domdiff-text__></domdiff-text__>` to replace `#text` itselft.
     * Because of `getComputedStyle` cannot deal with `#text`.
     */
    
    var _ = utils;
    settings = settings || {};

    var IGNORE_STYLES = ignoreCheck(settings.ignoreStyles);
    var IGNORE_SELECTORS = ignoreCheck(settings.ignoreSelectors);
    var IGNORE_ATTRBUTES = ignoreCheck(settings.ignoreAttributes);
    
    // phantom内部执行的js使用delete删除对象属性容易造成问题
    var STYLES = _.exclude([
        "animation",
        "background",
        "border-bottom",
        "border-collapse",
        "border-image",
        "border-left",
        "border-right",
        "border-top",
        "box-shadow",
        "box-sizing",
        "caption-side",
        "clear",
        "clip",
        "color",
        "content",
        "cursor",
        "direction",
        "empty-cells",
        "float",
        "font",
        "image-rendering",
        "isolation",
        "letter-spacing",
        "line-height",
        "list-style",
        "max-height",
        "max-width",
        "min-height",
        "min-width",
        "mix-blend-mode",
        "motion",
        "object-fit",
        "object-position",
        "opacity",
        "orphans",
        "outline",
        "overflow-x",
        "overflow-y",
        "page-break-after",
        "page-break-before",
        "page-break-inside",
        "pointer-events",
        "position",
        "resize",
        "speak",
        "table-layout",
        "tab-size",
        "text-align",
        "text-align-last",
        "text-decoration",
        "text-indent",
        "text-rendering",
        "text-shadow",
        "text-overflow",
        "text-transform",
        "touch-action",
        "transition",
        "unicode-bidi",
        "vertical-align",
        "visibility",
        "white-space",
        "widows",
        "will-change",
        "word-break",
        "word-spacing",
        "word-wrap",
        "z-index",
        "zoom",
        "-webkit-appearance",
        "backface-visibility",
        "-webkit-background-clip",
        "-webkit-background-composite",
        "-webkit-background-origin",
        "-webkit-border-horizontal-spacing",
        "-webkit-border-image",
        "-webkit-border-vertical-spacing",
        "-webkit-box-align",
        "-webkit-box-decoration-break",
        "-webkit-box-direction",
        "-webkit-box-flex",
        "-webkit-box-flex-group",
        "-webkit-box-lines",
        "-webkit-box-ordinal-group",
        "-webkit-box-orient",
        "-webkit-box-pack",
        "-webkit-box-reflect",
        "-webkit-clip-path",
        "-webkit-column-break-after",
        "-webkit-column-break-before",
        "-webkit-column-break-inside",
        "-webkit-column-count",
        "-webkit-column-gap",
        "-webkit-column-rule",
        "-webkit-column-span",
        "-webkit-column-width",
        "-webkit-filter",
        "align-content",
        "align-items",
        "align-self",
        "flex",
        "flex-direction",
        "flex-wrap",
        "justify-content",
        "-webkit-font-smoothing",
        "-webkit-highlight",
        "-webkit-hyphenate-character",
        "-webkit-line-break",
        "-webkit-line-clamp",
        "-webkit-locale",
        "-webkit-margin-before-collapse",
        "-webkit-margin-after-collapse",
        "-webkit-mask-box-image",
        "-webkit-mask-clip",
        "-webkit-mask-composite",
        "-webkit-mask-image",
        "-webkit-mask-origin",
        "-webkit-mask-position",
        "-webkit-mask-repeat",
        "-webkit-mask-size",
        "order",
        "perspective",
        "perspective-origin",
        "-webkit-print-color-adjust",
        "-webkit-rtl-ordering",
        "shape-outside",
        "shape-image-threshold",
        "shape-margin",
        "-webkit-tap-highlight-color",
        "-webkit-text-combine",
        "-webkit-text-decorations-in-effect",
        "-webkit-text-emphasis-color",
        "-webkit-text-emphasis-position",
        "-webkit-text-emphasis-style",
        "-webkit-text-fill-color",
        "-webkit-text-orientation",
        "-webkit-text-security",
        "-webkit-text-stroke-color",
        "-webkit-text-stroke-width",
        "transform",
        "transform-origin",
        "transform-style",
        "-webkit-user-drag",
        "-webkit-user-modify",
        "-webkit-user-select",
        "-webkit-writing-mode",
        "-webkit-app-region",
        "buffered-rendering",
        "clip-path",
        "clip-rule",
        "mask",
        "filter",
        "flood-color",
        "flood-opacity",
        "lighting-color",
        "stop-color",
        "stop-opacity",
        "color-interpolation",
        "color-interpolation-filters",
        "color-rendering",
        "fill",
        "fill-opacity",
        "fill-rule",
        "marker",
        "mask-type",
        "shape-rendering",
        "stroke",
        "stroke-dasharray",
        "stroke-dashoffset",
        "stroke-linecap",
        "stroke-linejoin",
        "stroke-miterlimit",
        "stroke-opacity",
        "stroke-width",
        "alignment-baseline",
        "baseline-shift",
        "dominant-baseline",
        "text-anchor",
        "writing-mode",
        "glyph-orientation-horizontal",
        "glyph-orientation-vertical",
        "vector-effect",
        "paint-order",
        "cx",
        "cy",
        "r",
        "rx",
        "ry",
        "width",
        "height",
        "margin",
        "padding"
    ], IGNORE_STYLES);
    
    function ignoreCheck(ignores) {
        if (_.is(ignores, 'Array')) {
            return ignores.map(function (ignore) {
                return  ignore.replace(/\s+/g, '');
            }).filter(function (ignore) {
                return ignore !== '';
            });
        }
        if (_.is(ignores, 'String')) {
            return ignoreCheck(ignores.split(','));
        }
        return [];
    }
    
    function replaceTextNode(parent, child) {
        var domdiff_text = parent.ownerDocument.defaultView.document.createElement('domdiff-text__');
        domdiff_text.textContent = child.data;
        parent.replaceChild(domdiff_text, child);
        return domdiff_text;
    }

    /**
     * 返回styls对象和styleHash
     * @method getStyles
     * @param  {[type]}  computeStyles [description]
     * @param  {[type]}  filters       [description]
     * @return {[type]}                [description]
     */
    function getStyles(computeStyles) {
        var styles = {};
        var hash = _.map(STYLES, function (v) {
            return (styles[v] = computeStyles.getPropertyValue(v) || "");
        });
        return {
            styles: styles,
            hash: md5(hash.join(''))
        };
    }

    function getAttributes(dom, filters) {
        var attrs = {},
            hash = [];
        for (var i = 0, len = dom.attributes.length, attr; i < len; i++) {
            attr = dom.attributes[i];
            if (!~filters.indexOf(attr.name)) {
                attrs[attr.name] = attr.value.replace(/\n|\s/g, ',');
                hash.push(attr.name +'='+ attrs[attr.name]);
            }
        }
        return {
            attributes: attrs,
            hash: md5(hash.join(','))
        };
    }

    function getRect(ele) {
        var rect = ele.getBoundingClientRect();
        var doc = ele.ownerDocument;
        var win = doc.defaultView;
        var html = doc.documentElement;

        var _rect = {
            x: Math.floor(rect.left + win.pageXOffset - html.clientLeft),
            y: Math.floor(rect.top + win.pageYOffset - html.clientTop),
            width: Math.floor(rect.width),
            height: Math.floor(rect.height)
        };
        return {
            rect: _rect
        };
    }

    function isNoEffectOnLayout(tagName, computeStyles, attributes) {
        if (computeStyles.display === 'none') {
            return true;
        }
        if (name === 'INPUT' && attributes.type === 'hidden') {
            return true;
        }
        if (!~computeStyles.display.indexOf('inline') && ~computeStyles.display.indexOf('table') && computeStyles['line-height'] === '0px') {
            return true;
        }
        return false;
    }
    
    function isMatchSelector(selector, filters) {
        if (selector) {
            var querySelectorAll = selector.ownerDocument;
            for (var i = 0, filter; (filter = filters[i]); i++) {
                for (var j = 0, selectors = querySelectorAll(filter), _selector; (_selector = selectors[j]); j++) {
                    if (selector === _selector) return true;
                }
            }
        }
        return false;
    }

    function getObject(dom, path) {
        if (!dom) {
            return false;
        }
        
        var computeStyles = window.getComputedStyle(dom, null);
        var name = dom.tagName,
            position = computeStyles.position,
            display = computeStyles.display,
            rect = getRect(dom),
            attribute = getAttributes(dom, IGNORE_ATTRBUTES),
            styles,
            content = '',
            children = [];

        if (isNoEffectOnLayout(name, computeStyles, attribute)) {
            return false;
        }
        
        styles = getStyles(computeStyles);

        switch (name) {
            case 'HTMLCanvasElement':
                return {
                    name: name,
                    path: path,
                    position: position,
                    display: display,
                    rect: rect,
                    attribute: attribute.attributes,
                    attributeHash: attribute.hash,
                    style: styles.styles,
                    styleHash: styles.hash,
                    content: md5(dom.toDataURL()),
                    children: [],
                    childrenHash: ''
                };
            // case 'SVGSVGElement': {
            //     return {
            //         name: name,
            //         path: path,
            //         position: position,
            //         display: display,
            //         rect: rect.rect,
            //         attribute: {},
            //         attributeHash: '',
            //         style: {},
            //         styleHash: '',
            //         content: '',
            //         children: [],
            //         childrenHash: ''
            //     };
            // }
        }

        if (name === 'DOMDIFF-TEXT__') {
            return {
                name: name,
                path: path,
                position: position,
                display: display,
                rect: rect.rect,
                attribute: {},
                attributeHash: '',
                style: styles.styles,
                styleHash: styles.hash,
                content: dom.textContent,
                children: children,
                childrenHash: children.map(function (node) { return node.tagName; }).join(',')
            };
        }

        // if dom has both texts and elements.
        if (dom.children && dom.children.length) {
            _.map(dom.childNodes, function (node) {
                if (isMatchSelector(node, IGNORE_SELECTORS)) {
                    return false;
                }
                if (_.is(node, 'Text')) {
                    if (node.data.replace(/^[\n\s]+/, '').replace(/[\n\s]+$/, '') !== '') {
                        node = replaceTextNode(dom, node);
                        children.push(node);
                        content += node.textContent;
                        return node;
                    }
                    return false;
                }
                if (_.is(node, 'HTMLScriptElement') || _.is(node, 'HTMLLinkElement') || _.is(node, 'HTMLStyleElement') || _.is(node, 'Comment')) {
                    return false;
                }
                children.push(node);
            });
        } else {
            content = dom.textContent;
        }

        return {
            name: name,
            path: path,
            position: position,
            display: display,
            rect: rect.rect,
            attribute: attribute.attributes,
            attributeHash: attribute.hash,
            style: styles.styles,
            styleHash: styles.hash,
            content: content,
            children: children,
            childrenHash: children.map(function (node) { return node.tagName; }).join(',')
        };
    }

    function dom2object (root, path) {
        root = root || document.body;
        path = path || 0;

        var domObject = getObject(root, path);
        if (domObject) {
            domObject.children = _.map(domObject.children, function (v, k, i) {
                return dom2object(v, [path, i].join('/')) || null;
            });
        }
        return domObject;
    }

    return dom2object();
};
