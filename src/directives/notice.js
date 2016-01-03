/* global require */

'use strict';

require('../css/ui-notice.css');

var directives = require('./directives');

directives.popup('notice', {
    template: '<div class="ui-popup">' +
        '<div class="ui-notice">' +
        '<div ng-transclude class="ui-notice-content"></div>' +
        '</div>' +
        '</div>'
});