'use strict';


/**
 * @param   {HTMLElement}   浮层元素（可选）
 */
function Popup(options) {

    // 合并默认配置
    this.options = Object.create(Popup.defaults);
    Object.keys(options || {}).forEach(function (key) {
        var value = options[key];
        if (typeof value !== 'undefined') {
            this.options[key] = value;
        }
    }, this);


    var node = this.options.node || document.createElement('div');
    node.style.position = 'absolute';
    node.setAttribute('tabindex', '-1');
    document.body.appendChild(node);

    this.options.hideElement(node);
    this.node = node;
    this.destroyed = false;
}


Popup.defaults = {
    /** 浮层 DOM 素节点 */
    node: null,

    /** 是否开启固定定位 */
    fixed: false,

    /** 是否自动聚焦 */
    autofocus: true,

    /** 对齐方式 */
    align: 'bottom left',

    /** CSS 类名 */
    className: 'ui-popup',

    showElement: showElement,
    hideElement: hideElement,
    removeElement: removeElement
};


Popup.prototype = {

    constructor: Popup,

    /** 判断是否删除[只读] */
    destroyed: true,

    /** 判断是否显示[只读] */
    open: false,

    /** close 返回值 */
    returnValue: '',

    /**
     * 显示浮层
     * @param   {HTMLElement, Event}  指定位置（可选）
     */
    show: function(anchor) {

        if (this.destroyed) {
            return this;
        }

        var node = this.node;

        this.__activeElement = getActiveElement();

        this.open = true;
        this.anchor = anchor;


        addClass(node, this.options.className);
        addClass(node, this.__name('show'));
        node.setAttribute('role', this.modal ? 'alertdialog' : 'dialog');


        if (!this.__show) {
            this.focus = this.focus.bind(this);
            this.reset = this.reset.bind(this);
            this.__show = true;
        }


        // 模态浮层的遮罩
        if (this.modal) {

            addClass(node, this.__name('modal'));

            // 让焦点限制在浮层内
            addEvent(document, 'focusin', this.focus);
        }


        this.options.showElement(node);


        addEvent(window, 'resize', this.reset);

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

            removeClass(node, this.__name('show'));
            removeClass(node, this.__name('modal'));

            this.options.hideElement(node);

            this.open = false;
            this.blur(); // 恢复焦点，照顾键盘操作的用户

            removeEvent(document, 'focusin', this.focus);
            removeEvent(window, 'resize', this.reset);
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


        this.options.removeElement(this.node);


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

        this.node.style.position = this.options.fixed ? 'fixed' : 'absolute';

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
        if (!node.contains(getActiveElement())) {
            var autofocus = node.querySelector('[autofocus]');

            if (!this.__autofocus && autofocus) {
                this.__autofocus = true;
            } else {
                autofocus = node;
            }

            this.__focus(autofocus);
        }

        // 设置叠加高度
        node.style.zIndex = index;


        Popup.current = this;
        addClass(node, this.__name('focus'));

        return this;
    },


    /** 让浮层失去焦点。将焦点退还给之前的元素，照顾视力障碍用户 */
    blur: function() {

        var activeElement = this.__activeElement;
        var now = getActiveElement();
        var isBlur = arguments[0];
        var node = this.node;

        if (isBlur !== false && node.contains(now)) {
            this.__focus(activeElement);
        }

        this.__autofocus = false;
        removeClass(node, this.__name('focus'));

        return this;
    },


    __name: function(name) {
        return this.options.className + '-' + name;
    },


    // 对元素安全聚焦
    __focus: function(elem) {
        // 防止 iframe 跨域无权限报错
        // 防止 IE 不可见元素报错
        try {
            // ie11 bug: iframe 页面点击会跳到顶部
            if (this.options.autofocus && !/^iframe$/i.test(elem.nodeName)) {
                elem.focus();
            }
        } catch (e) {}
    },


    // 居中浮层
    __center: function() {

        var node = this.node;
        var fixed = this.options.fixed;
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

        var isElem = anchor.parentNode && anchor;
        var node = this.node;


        if (this.__anchorClass) {
            removeClass(node, this.__anchorClass);
            removeClass(node, this.__name('anchor'));
        }


        // 隐藏元素不可用
        if (isElem && anchor.offsetLeft * anchor.offsetTop < 0) {
            return this.__center();
        }

        var that = this;
        var options = this.options;
        var fixed = options.fixed;

        var winWidth = getWindowSize('Width');
        var winHeight = getWindowSize('Height');
        var docLeft = getDocumentScroll('Left');
        var docTop = getDocumentScroll('Top');


        var popupWidth = node.offsetWidth;
        var popupHeight = node.offsetHeight;
        var width = anchor.offsetWidth || 0;
        var height = anchor.offsetHeight || 0;
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
        var align = options.align.split(' ');
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


        if (isElem) {
            // 添加 anchor 的 css
            className += align.join('-');
            that.__anchorClass = className;
            addClass(node, className);
            addClass(node, this.__name('anchor'));
        }


        css[name[align[0]]] = parseInt(temp[0][align[0]]);
        css[name[align[1]]] = parseInt(temp[1][align[1]]);

        node.style.left = css.left + 'px';
        node.style.top = css.top + 'px';


        // 获取元素或 Event 对象相对于页面的位置（不支持 iframe 内的元素）
        function getOffset() {
            if (isElem) {

                var win = window;
                var docElem = document.documentElement;
                var box = anchor.getBoundingClientRect();

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


// 删除节点
function removeElement(elem) {
    // elem.remove()
    elem.parentNode.removeChild(elem);
}


// 显示节点
function showElement(elem) {
    elem.style.display = 'block';
}


// 隐藏节点
function hideElement(elem) {
    elem.style.display = 'none';
}


// 判断是否包含制定类名
function hasClass(elem, className) {
    // elem.contains(className)
    return elem.className.match(new RegExp('(\\s|^)' + className + '(\\s|$)'));
}


// 添加类
function addClass(elem, className) {
    // elem.classList.add(className)
    if (!hasClass(elem, className)) {
        elem.className += ' ' + className;
    }
}


// 删除类
function removeClass(elem, className) {
    // elem.classList.remove(className)
    if (hasClass(elem, className)) {
        var reg = new RegExp('(\\s|^)' + className + '(\\s|$)');
        elem.className = elem.className.replace(reg, ' ');
    }
}


// 添加事件
function addEvent(elem, type, callback) {
    elem.addEventListener(type, callback, false);
}


// 删除事件
function removeEvent(elem, type, callback) {
    elem.removeEventListener(type, callback);
}


// 获取当前焦点的元素
function getActiveElement() {
    try { // try: ie8~9, iframe #26
        var activeElement = document.activeElement;
        var contentDocument = activeElement.contentDocument;
        var elem = contentDocument && contentDocument.activeElement || activeElement;
        return elem;
    } catch (e) {}
}


module.exports = Popup;


// 更新记录：
// 取消对 iframe 支持
// follow > anchor
// fixed 支持多次设置
// 删除遮罩层
// 支持传入 elem
// 修复 resize 可能被重复监听的 BUG
// 移除 jQuery，只支持 IE9+
// 移除事件系统
// 使用配置项代替属性

// TODO showModal focus 优化
// TODO zIndex 优化
// __anchor 函数优化