/* global require */

'use strict';

require('../css/ui-bubble.css');

var directives = require('./directives');

directives.createPopup('bubble', {
    template: '<div class="ui-popup">' +
        '<div class="ui-bubble">' +
        '<div ng-transclude class="ui-bubble-content"></div>' +
        '</div>' +
        '</div>',
    link: function(scope, elem, attrs, controller) {

        function click(event) {
            if (!elem[0].contains(event.target)) {
                controller.close(event);
            }
        }

        controller.onopen = function () {
            document.addEventListener('click', click, false);
            elem[0].addEventListener('focusout', controller.close, false);
        };

        controller.onclose = function () {
            document.removeEventListener('click', click);
            elem[0].removeEventListener('focusout', controller.close);
        };

    }
});