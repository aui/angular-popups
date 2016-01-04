/* global require */

'use strict';

require('../css/ui-popup.css');

var directives = require('./directives');

directives.createPopup('popup', {
    template: '<div class="ui-popup"><div ng-transclude></div></div>'
});