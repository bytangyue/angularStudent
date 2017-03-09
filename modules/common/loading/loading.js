/**
 * Created by zhongxingxing on 2015/11/5.
 */
angular.module("app").directive('loading', ['$http', function ($http) {
    return {
        restrict: 'A',
        link: function (scope, elm, attrs) {
            scope.isLoading = function () {
                return $http.pendingRequests.length > 0;
            };

            scope.$watch(scope.isLoading, function (v) {
                if (v) {
                    NProgress.start();
                } else {
                    NProgress.done();
                }
            });
        }
    };

}]);