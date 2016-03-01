angular.module('ShowDiff', [])
.directive('imgStage', [function () {
    return {
        restrict: 'E',
        scope: {
            json: '=json',
            img: '=img',
            title: '=title'
        },
        transclude: false,
        replace: true,
        templateUrl: 'src/directives/imgStage/imgStage.tmpl.html',
        link: function (scope, element, attrs) {
            console.log(element);
        }
    };
}])
.directive('panel', [function () {
    return {
        restrict: 'E',
        scope: false,
        transclude: false,
        replace: true,
        template: '<div></div>',
        link: function (scope, element, attrs) {
            if (scope.json) {
                return;
            }
            // var panel = ;
            console.log(element);
            // scope.json.forEach(function (highlight) {
                
            // });
        }
    };
}]);