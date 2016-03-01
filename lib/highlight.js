module.exports = function (highlights) {
    'use strict';

    var highlightStyle = {
        modifyElement: {
            border: '2px dashed #FF0',
            backgroundColor: 'rgba(221, 221, 0, 0.1)'
        },
        moveElement: {
            border: '2px dashed #00F',
            backgroundColor: 'rgba(0, 0, 255, 0.1)'
        },
        addElement: {
            border: '2px dashed #0F0',
            backgroundColor: 'rgba(0, 255, 0, 0.1)'
        },
        removeElement: {
            border: '2px dashed #F00',
            backgroundColor: 'rgba(255, 0, 0, 0.1)'
        }
    };

    function getElementByPath(path) {
        var ele = document.body;
        var paths = path.split('/');
        paths.shift();
        var length = paths.length;
        var idx = 0,
            tagName;
        while (length--) {
            idx = +paths.shift();
            for (var i = 0; i < idx; i++) {
                tagName = ele.children[i].tagName;
                if (tagName === 'SCRIPT' || tagName === 'LINK' || tagName === 'STYLE') {
                    idx++;
                };
            }
            ele = ele.children[idx];
        }
        return ele;
    }

    function px(val){
        return val + 'px';
    }

    /**
     * [highlight description]
     * @method highlight
     * @param  {Object}  info {action, path, rect, text}
     * @return {[type]}       [description]
     */
    function highlightEle(info, styles) {
        // var container = getElementByPath(info.path);
        // var rect = container.getBoundingClientRect();
        // var doc = container.ownerDocument;
        // var win = doc.defaultView;
        // var html = doc.documentElement;

        var div = document.createElement('diff-div');
        div.style.position = 'absolute';
        div.style.display = 'inline-block';
        // div.style.backgroundColor = 'rgba(0, 0, 0, 0.1)';
        div.style.border = '1px dashed #333';
        div.style.fontSize = '20px';
        div.style.fontWeight = 'normal';
        div.style.overflow = 'hidden';
        div.style.color = '#000';
        div.style.zIndex = '99999';
        // div.style.boxShadow = '0 2px 5px rgba(0, 0, 0, 0.4)';
        div.style.left = px(info.rect.x);
        div.style.top = px(info.rect.y);
        div.style.width = px(info.rect.width);
        div.style.height = px(info.rect.height);
        // container.style.boxSizing = 'border-box';
        ['border', 'backgroundColor'].forEach(function (key) {
            div.style[key] = styles[info.action][key];
        });

        div.innerHTML = info.text;

        document.body.appendChild(div);
    }

    try {
        highlights.forEach(function (info) {
            highlightEle(info, highlightStyle);
        });
    } catch(e) {
        return JSON.stringify(e);
    }

    return highlights.length;
};
