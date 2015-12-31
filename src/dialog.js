/* global require */

'use strict';

require('./css/ui-dialog.css');
var angular = require('angular');
var directives = require('./directives');


var dialogTpl =
    '<div class="ui-dialog">' +
    '<div class="ui-dialog-header"></div>' +
    '<div class="ui-dialog-body"></div>' +
    '<div class="ui-dialog-footer"></div>' +
    '</div>';

var titleTpl = '<div class="ui-dialog-title" id="{{$dialogId}}-title" ng-transclude></div>';
var closeTpl = '<button type="button" class="ui-dialog-close"><span aria-hidden="true">&times;</span></button>';
var contentTpl = '<div class="ui-dialog-content" id="{{$dialogId}}-content" ng-transclude></div>';
var statusbarTpl = '<span class="ui-dialog-statusbar" ng-transclude></span>';
var buttonsTpl = '<span class="ui-dialog-buttons" ng-transclude></span>';

directives.popup('dialog', {
    template: '<div class="ui-popup" aria-labelledby="{{$dialogId}}-title" aria-describedby="{{$dialogId}}-content" ng-transclude></div>',
    link: function(scope, elem, attrs, superheroCtrl) {

        var node = elem[0];
        var dialog = createElement(dialogTpl);

        scope.$dialogId = 'ui-dialog' + scope.$id;

        function createElement(html) {
            var temp = document.createElement('div');
            temp.innerHTML = html;
            return temp.firstChild;
        }

        var childDirective = function(name) {
            var prefix = 'dialog';
            var e = prefix + '-' + name;
            var e2 = prefix + '\\:' + name;
            var a = '[' + e + ']';
            var a2 = '[' + e2 + ']';
            var c = '.ui-' + prefix + '-' + name;

            return node.querySelector([e, e2, a, a2, c].join(','));
        };

        var childElem = function(name) {
            return dialog.querySelector('.ui-dialog-' + name);
        };

        var closeNode = attrs.close ? createElement(closeTpl) : null;
        var titleNode = childDirective('title');
        var contentNode = childDirective('content');
        var statusbarNode = childDirective('statusbar');
        var buttonsNode = childDirective('buttons');


        var headerNode = childElem('header');
        var bodyNode = childElem('body');
        var footerNode = childElem('footer');

        appendChild(headerNode, closeNode);
        appendChild(headerNode, titleNode);
        appendChild(bodyNode, contentNode);
        appendChild(footerNode, statusbarNode);
        appendChild(footerNode, buttonsNode);


        if (!titleNode) {
            headerNode.remove();
        }

        if (!statusbarNode && !buttonsNode) {
            footerNode.remove();
        }


        if (closeNode) {
            closeNode.addEventListener('click', function() {
                superheroCtrl.$close();
            }, false);
        }


        appendChild(node, dialog);


        function appendChild(parent, child) {
            if (child) {
                parent.appendChild(child);
            }
        }

    }
});


childDirective('dialogTitle', {
    template: titleTpl
});

childDirective('dialogContent', {
    template: contentTpl
});

childDirective('dialogStatusbar', {
    template: statusbarTpl
});

childDirective('dialogButtons', {
    template: buttonsTpl
});


function childDirective(subName, subOptions) {
    directives.directive(subName, function() {
        return angular.extend({
            require: '^dialog',
            restrict: 'AE',
            transclude: true,
            controller: ['$scope', function($scope) {
                $scope.$dialogId = 'ui-dialog' + $scope.$parent.$id;
                $scope.$close = function() {
                    $scope.$parent.close();
                };
            }],
            replace: true
        }, subOptions);
    });
}