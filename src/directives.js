/* global require,module */

'use strict';

var angular = require('angular');
var $ = angular.element;
var Popup = require('./lib/popup');
var directives = angular.module('angular-popups', []);



directives.popup = function(name, options) {
    return directives.directive(name, function() {

        var directive = {
            template: options.template,
            restrict: 'AE',
            transclude: true,
            replace: true,
            scope: {

                'ngIf': '=',
                'ngShow': '=',
                'ngHide': '=',

                'close': '&',

                // 吸附到指定 ID 元素
                'for': '@',

                // 对齐方式，配合 `for` 才能使用
                'align': '@',

                // 是否固定定位（跟随滚动条）
                'fixed': '@',

                // 是否是模态浮层
                'modal': '@',

                // 显示持续时间
                'duration': '@'

            },
            link: function(scope, elem, attrs) {

                var timer;

                scope.$close = function() {
                    clearTimeout(timer);
                    scope.close();
                    scope.$apply();
                };

                scope.$onopen = scope.$onclose = function (){};


                var popup = new Popup(elem[0], true);
                var temp = fix(elem);

                // 要映射的字段
                var map = {
                    'for': 'anchor'
                };

                // 要转换的数据类型
                var type = {
                    'for': 'String@id',
                    'fixed': 'Boolean',
                    'modal': 'Boolean',
                    'align': 'String'
                };



                var parse = {

                    'String@id': function(value) {
                        return value ? document.getElementById(value) : null;
                    },

                    'Boolean': function(value) {
                        return typeof value === 'string';
                    }
                };


                // 设置属性

                Object.keys(type).forEach(function(key) {
                    var item = type[key];
                    var value = attrs[key];
                    var name = key;

                    if (typeof value === 'undefined') {
                        return;
                    }

                    if (parse[item]) {
                        value = parse[item](value);
                    }

                    if (map[key]) {
                        name = map[key];
                    }

                    popup[name] = value;
                });


                // 通过模型控制对话框显示与隐藏

                if (attrs.ngIf) scope.$watch('ngIf', toggle);
                if (attrs.ngShow) scope.$watch('ngShow', toggle);
                if (attrs.ngHide) scope.$watch('ngHide', function(value) {
                    toggle(!value);
                });


                function toggle(show) {

                    if (typeof show === 'undefined') {
                        return;
                    }

                    if (show) {
                        // 使用 setTimeout 等待 ng-show 在 UI 上生效
                        elem.css('visibility', 'hidden');
                        setTimeout(function() {
                            elem.css('visibility', 'visible');
                            popup.show(popup.anchor);
                            scope.$onopen();
                            if (attrs.duration) {
                                clearTimeout(timer);
                                timer = setTimeout(scope.$close, Number(attrs.duration));
                            }
                        }, 0);
                    } else {
                        popup.close();
                        scope.$onclose();
                    }

                }



                // ESC 快捷键关闭浮层
                function esc(event) {

                    var target = event.target;
                    var nodeName = target.nodeName;
                    var rinput = /^input|textarea$/i;
                    var isBlur = Popup.current === popup;
                    var isInput = rinput.test(nodeName) && target.type !== 'button';
                    var keyCode = event.keyCode;

                    // 避免输入状态中 ESC 误操作关闭
                    if (!isBlur || isInput) {
                        return;
                    }

                    if (keyCode === 27) {
                        scope.$close();
                    }
                }


                $(document).on('keydown', esc);


                (options.link || function() {}).apply(this, arguments);


                // ng 销毁事件控制对话框关闭
                // 控制器销毁或者 ng-if="false" 都可能触发此
                // scope.$on('$destroy', callback) >> 这种方式对 ngAnimate 支持不好
                elem.one('$destroy', function() {
                    toggle(false);
                    popup.remove();
                    temp.remove();
                    $(document).off('keydown', esc);
                });

            }
        };


        angular.extend(directive.scope, options.scope);


        return directive;
    });
};


// AngularJS(v1.4.8) BUG：
// 如果指令内部把 DOM 节点迁移到 document.body 下，
// 则指令元素的 ng-if 为 false 的时候可能导致其他 popups 节点被 AngularJS 删除
function fix(elem) {
    var temp = document.createElement('popup');
    document.body.appendChild(temp);
    temp.appendChild(elem[0]);
    return $(temp);
}

module.exports = directives;