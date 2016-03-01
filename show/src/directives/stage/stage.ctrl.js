angular.module('ShowDiff', [])
    .directive('stage', [function () {
        return {
            restrict: 'E',
            transclude: false,
            scope: false,
            replace: true,
            templateUrl: 'src/directives/stage/stage.tmpl.html',
            link: function (scope, element, attrs) {
                
            },
            controller: ['$scope', function ($scope) {
                console.log($scope);
            }]
        };
    }]);