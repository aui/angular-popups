/* global require */

'use strict';

require('../css/ui-bubble.css');

var directives = require('./directives');

directives.popup('bubble', {
    template: '<div class="ui-popup">' +
        '<div class="ui-bubble">' +
        '<div ng-transclude class="ui-bubble-content"></div>' +
        '</div>' +
        '</div>',
    link: function(scope, elem) {

        scope.$onopen = function () {
            elem[0].addEventListener('focusout', scope.$close, false);
        };

        scope.$onclose = function () {
            elem[0].removeEventListener('focusout', scope.$close);
        };

    }
});