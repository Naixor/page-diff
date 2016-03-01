angular.module('ShowDiff', [])
.directive('diffs', [function () {
    return {
        restrict: 'E',
        scope: {
            json: '=json',
        },
        transclude: false,
        replace: true,
        templateUrl: 'src/directives/diffs/diffs.tmpl.html',
        link: function (scope, element, attrs) {
            
        },
        controller: ['$scope', function ($scope) {
            
        }]
    };
}]);