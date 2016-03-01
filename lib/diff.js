var _ = require('./util');

var result = [];

/**
 * addElement
 * removeElement
 * modifyElement
 * moveElement
 */
var DiffEnum = {
    addElement: 'addElement',
    removeElement: 'removeElement',
    modifyElement: 'modifyElement',
    moveElement: 'moveElement'
};

var rectTemplate = ['margin', 'padding'];

var styleTemplate = [
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
];

function DiffInfo(options) {
    this.action = options.action;
    this.left = options.left;
    this.right = options.right;
    if (options.diff) {
        this.diff = options.diff;
    }
}

function isMatch(source, target, mode) {
    var tagNameOk = false,
        attrOk = false,
        styleOk = false,
        childrenOk = false,
        textOk = true;

    if (target.childrenHash !== "" && source.childrenHash !== "") {
        if (~source.childrenHash.indexOf(target.childrenHash) || ~target.childrenHash.indexOf(source.childrenHash)) {
            childrenOk = true;
        }
        if (mode === 'strict' && source.content !== target.content) {
            textOk = false;
        }
    } else {
        if (target.childrenHash === source.childrenHash) {
            childrenOk = true;
        }
    }
    if (source.styleHash === target.styleHash) {
        styleOk = true;
    }
    if (source.attributeHash === target.attributeHash) {
        attrOk = true;
    }
    if (source.name === target.name) {
        tagNameOk = true;
    }
    
    switch (mode) {
        case 'strict':
            if (tagNameOk && childrenOk && textOk && attrOk) {
                return true;
            }
            break;
        case 'attr':
            if (tagNameOk && childrenOk && attrOk) {
                return true;
            }
            break;
        case 'noattr':
            if (tagNameOk && childrenOk) {
                return true;
            }
            break;
    }

    return false;
}

function diff(source, target, opt) {
    var mode = opt.MODE || 'attr';
    var tchildren = [].concat(target.children),
        tlen,
        diffResult = [];
    source.children.forEach(function (snode) {
        if (snode) {
            if (mode !== 'strict') mode = 'attr';
            var tnode;
            tlen = tchildren.length;
            for (var i = 0; i < tlen; i++) {
                tnode = tchildren[i];
                if (!tnode) {
                    continue;
                } else {
                    if (isMatch(snode, tnode, mode)) {
                        var detail = diffDetail(snode, tnode, mode);
                        if (detail) {
                            diffResult.push(detail);
                        } else {
                            diff(snode, tnode, opt);
                        }
                        tchildren.splice(i, 1);
                        return;
                    } else {
                        if (i === tlen-1) {
                            if (mode === 'attr') {
                                mode = 'noattr';
                                i = -1;
                                continue;
                            }
                            diffResult.push(diffDetail(snode, null, mode));
                        }
                    }
                }
            }
        }
    });
    if (tchildren.length) {
        tchildren.forEach(function (tnode) {
            if (tnode) {
                diffResult.push(diffDetail(null, tnode, mode));
            }
        });
    }

    result = result.concat(diffResult);

    diffResult.forEach(function (detail) {
        switch (detail.action) {
            case 'modifyElement':
            case 'moveElement':
                var childSource = source.children[getChildIdxFromPath(detail.left.path)],
                    childTarget = target.children[getChildIdxFromPath(detail.right.path)];
                diff(childSource, childTarget, opt);
                break;
        }
    });
}

function getChildIdxFromPath(path) {
    return +/\/(\d+)$/.exec(path)[1];
}

function diffDetail(source, target, mode) {
    var createDiffInfo = function  (source, target) {
        return function (type, extra) {
            return new DiffInfo(_.merge({
                action: type,
                left: source && {
                    path: source.path,
                    name: source.name,
                    rect: source.rect,
                    // class: source.attribute.class,
                    // content: source.content,
                    // childrenHash: source.childrenHash
                },
                right: target && {
                    path: target.path,
                    name: target.name,
                    rect: target.rect,
                    // class: target.attribute.class,
                    // content: target.content,
                    // childrenHash: target.childrenHash
                }
            }, extra));
        };
    }(source, target);

    if (source === null) {
        return createDiffInfo(DiffEnum.addElement);
    }
    if (target === null) {
        return createDiffInfo(DiffEnum.removeElement);
    }

    var diffInfo = {};

    if (source.styleHash !== target.styleHash) {
        diffInfo.style = diffObject(source.style, target.style, styleTemplate);
    }
    if (source.attributeHash !== target.attributeHash) {
        diffInfo.attribute = diffObject(source.attribute, target.attribute);
    }
    if (source.rectHash !== target.rectHash) {
        diffInfo.rect = diffObject(source.rect, target.rect, rectTemplate);
    }
    if (mode === 'strict') {
        ['content'].map(function (key) {
            if (source[key] !== target[key]) {
                diffInfo[key] = diffObject(source, target, [key]);
            }
        });   
    }

    if (Object.keys(diffInfo).length !== 0) {
        return createDiffInfo(DiffEnum.modifyElement, {diff: diffInfo});
    } else {
        if (source.path === target.path) {
            return null;
        }
        return createDiffInfo(DiffEnum.moveElement);
    }
}

function diffObject(source, target, template) {
    var DiffObj = function (key, sourceValue, targetValue) {
        this.key = key;
        this.detail = [sourceValue, '->', targetValue].join(' ');
    };

    var targetKeys = template;
    if (!template || !template.length) {
        template = Object.keys(source);
        targetKeys = Object.keys(target);
    }
    var diffObjs = [];
    template.forEach(function (sk) {
        if (source[sk] !== target[sk]) {
            diffObjs.push(new DiffObj(sk, source[sk], target[sk]));
        }
    });
    return diffObjs;
}

module.exports = function (source, target, opt) {
    diff(source, target, opt);
    return result;
};
