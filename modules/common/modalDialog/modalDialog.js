/**  description
 *   author tangyue
 *   date 2015/11/30
 */
angular.module('app').directive('modalDialog', function () {
    /**
     * 只有删除时就只引用指令modalDialog一层就可以了
     * 如果还有其他内容嵌套内容要引用起子指令modalPane
     */
    return {
        restrict: 'E',
        transclude: true,
        scope: {
            modalparams: "=",//controller控制参数配置
            modalconfirm:"&"//controller控制确认操作
        },
        controller: function ($scope) {
            /*确认操作*/
            $scope.modalEnsure=function(){
                $scope.modalconfirm();
            }
        },
        template: __inline('./modalDialog.html')
    };
}).directive('modalPane', function () {
    /**
     * 包含其他嵌套内容块
     */
    return {
        require: '^modalDialog',
        restrict: 'E',
        transclude: true,
        template: '<div ng-transclude="nodele"></div>'
    };
});