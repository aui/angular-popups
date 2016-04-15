/* global require */

'use strict';

var directives = require('./directives');

directives.createPopup('popup', {
    template: '<div class="ui-popup"><div ng-transclude></div></div>'
});