/**  description 筛选组件
 *   author tangyue
 *   date 2015/10/27
 */

angular.module("app").directive('filtrateBtn', function () {
    return {
        restrict: "E",
        replace: true,
        transclude: true,
        scope: {
            dosearch: '&',//由具体controller制定查询逻辑。
            filparms:"="//弹框参数配置
        },
        controller: function ($rootScope, $scope) {
            $scope.clicknum=0;
            //同一个按钮点击显示或者消失
            $scope.filtrateShowOrHide=function(){
                $scope.clicknum++;//在鼠标移开归0
                if($scope.clicknum==1){//点击1次
                        $scope.isShowFiltrate=true;
                        angular.element(".moverdiv").addClass('open');
                        angular.element(".mleavediv").removeClass('open');
                }else{//点击多次显示隐藏
                    $scope.isShowFiltrate = !$scope.isShowFiltrate;
                }
            }
            /**
             * 筛选里面的确定按钮触发的事件
             **/
            $scope.closeConfirmBtn = function () {
                $scope.isShowFiltrate = false;
                $scope.dosearch();
            }
        },
        template: __inline("./filtrateBtn.html")
    }
}).directive('filtratePane', function () {
    return {
        require: ["^filtrateBtn"],
        replace: true,
        scope: {},
        transclude: true,
        template: '<ul ng-transclude></ul>'
    }
});