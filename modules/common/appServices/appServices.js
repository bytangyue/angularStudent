/**  description
 *   author tangyue
 *   date 2015/10/23
 */
/**
 * 启动初始化
 */
angular.module('app').run(function ($rootScope, $state, $stateParams,$cookieStore) {
    $rootScope.$state = $state;
    $rootScope.$stateParams = $stateParams;
    $cookieStore.put('isAdLogin', false);
    $rootScope.$state.go('login');
    $cookieStore.put('authData', {});
});
/**
 * 绑定筛选参数
 */
angular.module('app').service("sharing", [function () {
    this.ptdata = [];
    this.agentdata = [];
    this.serverdata = [];
}]);


