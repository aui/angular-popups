/* global module */

'use strict';


/**
 * @param   {HTMLElement}   浮层元素（可选）
 * @param   {Boolean}       如果为 true，则 show 与 hide 方法不会操作元素的隐藏与显示
 */
function Popup(node, _ng) {

    this.destroyed = false;
    this.__ng = _ng;

    node = node || document.createElement('div');
    node.style.position = 'absolute';
    node.setAttribute('tabindex', '-1');
    document.body.appendChild(node);


    if (!this.__ng) {
        node.style.display = 'none';
    }

    this.node = node;
}



Popup.prototype = {

    constructor: Popup,

    /** 浮层 DOM 素节点[*] */
    node: null,

    /** 是否开启固定定位[*] */
    fixed: false,

    /** 判断是否删除[*] */
    destroyed: true,

    /** 判断是否显示 */
    open: false,

    /** close 返回值 */
    returnValue: '',

    /** 是否自动聚焦 */
    autofocus: true,

    /** 对齐方式[*] */
    align: 'bottom left',

    /** CSS 类名 */
    className: 'ui-popup',

    /**
     * 显示浮层
     * @param   {HTMLElement, Event}  指定位置（可选）
     */
    show: function(anchor) {

        if (this.destroyed) {
            return this;
        }

        var node = this.node;

        this.__activeElement = this.__getActive();

        this.open = true;
        this.anchor = anchor;


        node.classList.add(this.className);
        node.classList.add(this.__name('show'));
        node.setAttribute('role', this.modal ? 'alertdialog' : 'dialog');


        if (!this.__show) {
            this.focus = this.focus.bind(this);
            this.reset = this.reset.bind(this);
            this.__show = true;
        }


        // 模态浮层的遮罩
        if (this.modal) {

            node.classList.add(this.__name('modal'));

            // 让焦点限制在浮层内
            document.addEventListener('focusin', this.focus, false);
        }


        if (!this.__ng) {
            node.style.display = 'block';
        }


        window.addEventListener('resize', this.reset, false);

        this.reset().focus();

        return this;
    },


    /** 显示模态浮层。参数参见 show() */
    showModal: function() {
        this.modal = true;
        return this.show.apply(this, arguments);
    },


    /** 关闭浮层 */
    close: function(result) {

        if (!this.destroyed && this.open) {

            var node = this.node;

            if (result !== undefined) {
                this.returnValue = result;
            }

            node.classList.remove(this.__name('show'));
            node.classList.remove(this.__name('modal'));

            if (!this.__ng) {
                node.style.display = 'none';
            }

            this.open = false;
            this.blur(); // 恢复焦点，照顾键盘操作的用户

            document.removeEventListener('focusin', this.focus);
            window.removeEventListener('resize', this.reset);
        }

        return this;
    },


    /** 销毁浮层 */
    remove: function() {

        if (this.destroyed) {
            return this;
        }


        if (this.open) {
            this.close();
        }


        if (Popup.current === this) {
            Popup.current = null;
        }


        this.node.remove();


        for (var i in this) {
            delete this[i];
        }

        return this;
    },


    /** 重置位置 */
    reset: function() {

        if (!this.open) {
            return;
        }

        var anchor = this.anchor;

        if (typeof anchor === 'string') {
            anchor = this.anchor = document.querySelector(anchor);
        }

        this.node.style.position = this.fixed ? 'fixed' : 'absolute';

        if (anchor) {
            this.__anchor(anchor);
        } else {
            this.__center();
        }

        return this;
    },


    /** 让浮层获取焦点 */
    focus: function() {

        var node = this.node;
        var current = Popup.current;
        var index = this.zIndex = Popup.zIndex++;

        if (current && current !== this) {
            current.blur(false);
        }

        // 检查焦点是否在浮层里面
        if (!node.contains(this.__getActive())) {
            var autofocus = node.querySelector('[autofocus]');

            if (!this._autofocus && autofocus) {
                this._autofocus = true;
            } else {
                autofocus = node;
            }

            this.__focus(autofocus);
        }

        // 设置叠加高度
        node.style.zIndex = index;


        Popup.current = this;
        node.classList.add(this.__name('focus'));

        return this;
    },


    /** 让浮层失去焦点。将焦点退还给之前的元素，照顾视力障碍用户 */
    blur: function() {

        var activeElement = this.__activeElement;
        var now = this.__getActive();
        var isBlur = arguments[0];

        if (isBlur !== false && this.node.contains(now)) {
            this.__focus(activeElement);
        }

        this._autofocus = false;
        this.node.classList.remove(this.__name('focus'));

        return this;
    },


    __name: function(name) {
        return this.className + '-' + name;
    },


    // 对元素安全聚焦
    __focus: function(elem) {
        // 防止 iframe 跨域无权限报错
        // 防止 IE 不可见元素报错
        try {
            // ie11 bug: iframe 页面点击会跳到顶部
            if (this.autofocus && !/^iframe$/i.test(elem.nodeName)) {
                elem.focus();
            }
        } catch (e) {}
    },


    // 获取当前焦点的元素
    __getActive: function() {
        try { // try: ie8~9, iframe #26
            var activeElement = document.activeElement;
            var contentDocument = activeElement.contentDocument;
            var elem = contentDocument && contentDocument.activeElement || activeElement;
            return elem;
        } catch (e) {}
    },


    // 居中浮层
    __center: function() {

        var node = this.node;
        var fixed = this.fixed;
        var dl = fixed ? 0 : getDocumentScroll('Left');
        var dt = fixed ? 0 : getDocumentScroll('Top');
        var ww = getWindowSize('Width');
        var wh = getWindowSize('Height');
        var ow = node.offsetWidth;
        var oh = node.offsetHeight;
        var left = (ww - ow) / 2 + dl;
        var top = (wh - oh) * 382 / 1000 + dt; // 黄金比例
        var style = node.style;


        style.left = Math.max(parseInt(left), dl) + 'px';
        style.top = Math.max(parseInt(top), dt) + 'px';
    },


    // 指定位置 @param    {HTMLElement, Event}  anchor
    __anchor: function(anchor) {

        var elem = anchor.parentNode && anchor;
        var node = this.node;


        if (this.__anchorClass) {
            node.classList.remove(this.__anchorClass);
            node.classList.remove(this.__name('anchor'));
        }


        // 隐藏元素不可用
        if (elem && elem.offsetLeft * elem.offsetTop < 0) {
            return this.__center();
        }

        var that = this;
        var fixed = this.fixed;

        var winWidth = getWindowSize('Width');
        var winHeight = getWindowSize('Height');
        var docLeft = getDocumentScroll('Left');
        var docTop = getDocumentScroll('Top');


        var popupWidth = node.offsetWidth;
        var popupHeight = node.offsetHeight;
        var width = elem.offsetWidth || 0;
        var height = elem.offsetHeight || 0;
        var offset = getOffset();
        var x = offset.left;
        var y = offset.top;
        var left = fixed ? x - docLeft : x;
        var top = fixed ? y - docTop : y;


        var minLeft = fixed ? 0 : docLeft;
        var minTop = fixed ? 0 : docTop;
        var maxLeft = minLeft + winWidth - popupWidth;
        var maxTop = minTop + winHeight - popupHeight;


        var css = {};
        var align = this.align.split(' ');
        var className = this.__name('');
        var reverse = {
            top: 'bottom',
            bottom: 'top',
            left: 'right',
            right: 'left'
        };
        var name = {
            top: 'top',
            bottom: 'top',
            left: 'left',
            right: 'left'
        };


        var temp = [{
            top: top - popupHeight,
            bottom: top + height,
            left: left - popupWidth,
            right: left + width
        }, {
            top: top,
            bottom: top - popupHeight + height,
            left: left,
            right: left - popupWidth + width
        }];


        var center = {
            left: left + width / 2 - popupWidth / 2,
            top: top + height / 2 - popupHeight / 2
        };


        var range = {
            left: [minLeft, maxLeft],
            top: [minTop, maxTop]
        };


        // 超出可视区域重新适应位置
        align.forEach(function(val, i) {

            // 超出右或下边界：使用左或者上边对齐
            if (temp[i][val] > range[name[val]][1]) {
                val = align[i] = reverse[val];
            }

            // 超出左或右边界：使用右或者下边对齐
            if (temp[i][val] < range[name[val]][0]) {
                align[i] = reverse[val];
            }

        });


        // 一个参数的情况
        if (!align[1]) {
            name[align[1]] = name[align[0]] === 'left' ? 'top' : 'left';
            temp[1][align[1]] = center[name[align[1]]];
        }


        if (elem) {
            // 添加 anchor 的 css
            className += align.join('-');
            that.__anchorClass = className;
            node.classList.add(className);
            node.classList.add(this.__name('anchor'));
        }


        css[name[align[0]]] = parseInt(temp[0][align[0]]);
        css[name[align[1]]] = parseInt(temp[1][align[1]]);


        Object.keys(css).forEach(function(key) {
            var value = css[key];
            node.style[key] = value + 'px';
        });


        // 获取元素或 Event 对象相对于页面的位置（不支持 iframe 内的元素）
        function getOffset() {
            if (elem) {

                var win = window;
                var docElem = document.documentElement;
                var box = elem.getBoundingClientRect();

                return {
                    top: box.top + win.pageYOffset - docElem.clientTop,
                    left: box.left + win.pageXOffset - docElem.clientLeft
                };
            } else {
                return {
                    left: anchor.pageX,
                    top: anchor.pageY
                };
            }
        }

    }

};


/** 当前叠加高度 */
Popup.zIndex = 1024;


/** 顶层浮层的实例 */
Popup.current = null;



// 获取窗口大小
function getWindowSize(name) {
    return document.documentElement['client' + name];
}

// 获取页面滚动条位置
function getDocumentScroll(name) {
    var type = {
        Left: 'pageXOffset',
        Top: 'pageYOffset'
    };
    return window[type[name]];
}



module.exports = Popup;


// 更新记录
// 取消对 iframe 支持
// follow > anchor
// fixed 支持多次设置
// 删除遮罩层
// 支持传入 elem
// 修复 resize 可能被重复监听的 BUG
// 移除 jQuery，只支持 IE9+
// 移除事件系统

// TODO showModal focus 优化
// TODO zIndex 优化