/* global require */

'use strict';

require('./css/ui-bubble.css');

var directives = require('./directives');

directives.popup('bubble', {
    template: '<div class="ui-popup">' +
        '<div class="ui-bubble">' +
        '<div ng-transclude class="ui-bubble-content"></div>' +
        '</div>' +
        '</div>',
    link: function(scope, elem, attrs, superheroCtrl) {

        function click(event) {
            if (!elem[0].contains(event.target)) {
                superheroCtrl.$close();
            }
        }

        document.addEventListener('mousedown', click, false);
        document.addEventListener('touchstart', click, false);

        elem.on('$destroy', function() {
            document.removeEventListener('mousedown', click);
            document.removeEventListener('touchstart', click);
        });

    }
});