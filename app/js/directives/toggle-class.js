angular.module('issueTrackingSystem.directives.toggleClass', [])
    .directive('toggleClass', function () {
    var directiveDefinitionObject = {
        restrict: 'A',
        template: '<span ng-click="localFunction()" ng-class="selected"  ng-transclude>a</span>',
        replace: true,
        scope: {
            model: '='
        },
        transclude: true,
        link: function (scope, element, attrs) {
            scope.localFunction = function () {
                scope.model.value = scope.$id;
                console.log(scope.$id)
            };
            scope.$watch('model.value', function () {
                if (scope.model.value === scope.$id) {
                    scope.selected = "active-page";
                } else {
                    scope.selected = '';
                }
            });
        }
    };
    return directiveDefinitionObject;
});