/**  description 登录模块
 *   author tangyue
 *   date 2015/10/12
 */
//var _auth = require('data/authVerifyJs');
angular.module('app').controller('loginContrl', ['$scope', '$rootScope', '$http', '$cookieStore', '$window', '$timeout','$document',
    function ($scope, $rootScope, $http, $cookieStore, $window, $timeout,$document) {
        /*登录系统*/
        $scope.queryUser = function (user) {
            console.log(user);
            //_auth.login(user);
            $http.get("./login.json")
                .success(function (data) {
                    $cookieStore.put('isAdLogin', true);
                    $cookieStore.put('userAdData', data['data']);
                    $rootScope.$state.go('informAndNotice');
                });
        }
        /*设置登录大背景高*/
        $scope.setloginDivSize=function(){
            $scope.windowHeight=$window.innerHeight;
        }
        $rootScope.$on('$viewContentLoaded', function () {//页面加载时执行
            $scope.setloginDivSize();
        });
        angular.element($window).bind('resize', function () {
            $timeout(function () {
                $scope.setloginDivSize();
            }, 100);
        });
        /*回车事件*/
        $scope.enterLogin=function(event){
            if(event.keyCode==13){//enter
                $scope.queryUser($scope.user);
            }
        }
    }]);

module.exports = {
    url: '/login',
    views: {
        'loginMain': {
            template: __inline('./login.html')
        }
    }
};