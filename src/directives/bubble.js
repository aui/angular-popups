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

        function click(event) {
            if (!elem[0].contains(event.target)) {
                scope.$close();
            }
        }

        scope.$onopen = function () {
            document.addEventListener('click', click, false);
        };

        scope.$onclose = function () {
            document.removeEventListener('click', click);
        };

    }
});