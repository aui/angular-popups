/* global require */
// TODO Popup.prompt

'use strict';

var angular = require('angular');
var ngModule = require('../ng-module');

ngModule.provider('Popup', function() {

    var that = this;
    var compiled = false;
    var noop = function() {};
    var defaults = {
        title: 'Message',
        okValue: 'Ok',
        cancelValue: 'Cancel'
    };

    var model = {
        open: true,
        title: null,
        content: null,
        duration: null,
        okValue: null,
        cancelValue: null,
        ok: null,
        cancel: null,
        notice: false,
        $destroy: noop,
        $ok: function() {
            if (this.ok && this.ok() !== false) {
                this.open = false;
                this.$destroy();
            }
        },
        $cancel: function() {
            if (this.cancel && this.cancel() !== false) {
                this.open = false;
                this.$destroy();
            }
        },
        $close: function() {
            if (this.cancel) {
                this.$cancel();
            } else {
                this.$ok();
            }
        }
    };

    var sub = {
        close: function() {
            model.$close();
        }
    };

    var baseDialogTpl =
        '<dialog ng-if="$$Popup.open && !$$Popup.notice" modal fixed close="$$Popup.$close()">' +
        '<div dialog-title ng-bind="$$Popup.title"></div>' +
        '<div dialog-content ng-bind="$$Popup.content"></div>' +
        '<div dialog-buttons>' +
        '<button ng-if="$$Popup.ok" autofocus ng-click="$$Popup.$ok()">{{$$Popup.okValue}}</button>' +
        '<button ng-if="$$Popup.cancel" ng-click="$$Popup.$cancel()">{{$$Popup.cancelValue}}</button>' +
        '</dialog>';

    var noticeDialogTpl =
        '<notice ng-if="$$Popup.open && $$Popup.notice" fixed duration="{{$$Popup.duration}}" close="$$Popup.$close()">' +
        '{{$$Popup.content}}' +
        '</notice>';



    angular.extend(this, defaults);


    this.$get = ['$compile', '$rootScope', function ($compile, $rootScope) {

        function createPopup(options) {

            if (!compiled) {
                var baseDialog = createElement(baseDialogTpl);
                document.body.appendChild(baseDialog);
                $compile(baseDialog)($rootScope);

                var noticeDialog = createElement(noticeDialogTpl);
                document.body.appendChild(noticeDialog);
                $compile(noticeDialog)($rootScope);

                compiled = true;
            }

            var dialogModel = Object.create(model);

            dialogModel = angular.extend(dialogModel, that, options);
            dialogModel.$destroy = function () {
                delete $rootScope.$$Popup;
            };

            $rootScope.$$Popup = dialogModel;

            return sub;
        }

        return {
            alert: function(content, ok) {
                return createPopup({
                    content: content,
                    ok: ok || noop
                });
            },
            confirm: function(content, ok, cancel) {
                return createPopup({
                    content: content,
                    ok: ok || noop,
                    cancel: cancel || noop
                });
            },
            notice: function(content, duration, ok) {
                return createPopup({
                    content: content,
                    duration: duration || 2000,
                    ok: ok || noop,
                    notice: true
                });
            }
        };
    }];
});



function createElement(html) {
    var temp = document.createElement('div');
    temp.innerHTML = html;
    return temp.firstChild;
}