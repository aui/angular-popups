/* global require */

'use strict';

require('../css/ui-notice.css');

var directives = require('./directives');

directives.createPopup('notice', {
    template: '<div class="ui-popup">' +
        '<div class="ui-notice" ng-transclude>' +
        '</div>' +
        '</div>'
});