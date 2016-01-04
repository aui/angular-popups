/* global require,module */

'use strict';

var angular = require('angular');
var $ = angular.element;
var Popup = require('../lib/popup');
var ngModule = require('../ng-module');
var noop = function(){};


ngModule.createPopup = function(name, options) {
    return ngModule.directive(name, function() {

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
            controller: ['$scope', function($scope) {
                var timer;
                var that = this;
                var close = $scope.close;

                this.id = $scope.$id;

                $scope.close = function() {
                    clearTimeout(timer);
                    close();
                };

                this.close = function(isUiEvent) {
                    $scope.close();
                    if (isUiEvent) {
                        $scope.$apply();
                    }
                };

                this.setDuration = function(duration) {
                    clearTimeout(timer);
                    timer = setTimeout(function() {
                        that.close(true);
                    }, duration);
                };

                this.onopen = this.onclose = function() {};

            }],
            link: function(scope, elem, attrs, controller) {

                var popup = new Popup({
                    node: elem[0],
                    fixed: attrToBoolean(attrs.fixed),
                    align: attrs.align,
                    showElement: noop,
                    hideElement: noop,
                    removeElement: noop
                });

                var temp = fix(elem);

                // 模型同步UI显示、隐藏事件
                if (attrs.ngIf) scope.$watch('ngIf', change);
                if (attrs.ngShow) scope.$watch('ngShow', change);
                if (attrs.ngHide) scope.$watch('ngHide', function(value) {
                    change(!value);
                });

                // UI 的显示与隐藏、删除事件
                function change(show) {

                    var anchor = getAnchor(attrs['for']);

                    if (angular.isUndefined(show)) {
                        return;
                    }

                    if (angular.isObject(show)) {
                        // HTMLElement, Event
                        anchor = show;
                    }

                    if (show) {
                        // 使用 setTimeout 等待 ng-show 在 UI 上生效
                        elem.css('visibility', 'hidden');
                        setTimeout(function() {
                            elem.css('visibility', 'visible');
                            popup[attrToBoolean(attrs.modal) ? 'showModal' : 'show'](anchor);
                            controller.onopen();
                            if (attrs.duration) {
                                controller.setDuration(Number(attrs.duration));
                            }
                        }, 0);
                    } else {
                        popup.close();
                        controller.onclose();
                    }

                }


                function getAnchor(id) {
                    return document.getElementById(id);
                }


                function attrToBoolean(value) {
                    return typeof value === 'string';
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
                        controller.close(event);
                    }
                }


                $(document).on('keydown', esc);


                (options.link || function() {}).apply(this, arguments);


                // ng 销毁事件控制对话框关闭
                // 控制器销毁或者 ng-if="false" 都可能触发此
                // scope.$on('$destroy', callback) >> 这种方式对 ngAnimate 支持不好
                elem.one('$destroy', function() {
                    change(false);
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

module.exports = ngModule;