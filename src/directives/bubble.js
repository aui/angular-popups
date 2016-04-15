/* global require */

'use strict';

var directives = require('./directives');

directives.createPopup('bubble', {
    template: '<div class="ui-popup">' +
        '<div class="ui-bubble">' +
        '<div ng-transclude class="ui-bubble-content"></div>' +
        '</div>' +
        '</div>',
    link: function(scope, elem, attrs, controller) {
        if (!attrs.closeAction) {
            controller.closeAction = ['esc', 'timeout', 'outerchick'];
        }
    }
});