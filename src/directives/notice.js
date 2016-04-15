/* global require */

'use strict';

var directives = require('./directives');

directives.createPopup('notice', {
    template: '<div class="ui-popup">' +
        '<div class="ui-notice" ng-transclude>' +
        '</div>' +
        '</div>'
});