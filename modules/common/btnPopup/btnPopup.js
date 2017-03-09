/**  description 弹框组件
 *   author tangyue
 *   date 2015/11/18
 */

angular.module("app").directive('btnPopup', function () {
    return {
        restrict: "E",
        replace: true,
        transclude: true,
        scope: {
            btnquery: '&',//由具体controller制定查询逻辑。
            popparms:'='//弹框显示位置
        },
        controller: function ($rootScope, $scope) {
            $scope.popparms.ispopshow=false;
            $scope.popnum=0;
            //同一个按钮点击显示或者消失
            $scope.popShowOrHide=function(){
                $scope.popnum++;//在鼠标移开归0
                if($scope.popnum==1){//点击1次
                        $scope.popparms.ispopshow=true;
                        angular.element(".moverdiv").addClass('open');
                        angular.element(".mleavediv").removeClass('open');
                }else{//点击多次显示隐藏
                    $scope.popparms.ispopshow = !$scope.popparms.ispopshow;
                }
            }
            /**
             * 查询按钮触发的事件
             **/
            $scope.popConfirmBtn = function () {
                $scope.btnquery();
            }
        },
        template: __inline("./btnPopup.html")
    }
}).directive('popupPane', function () {
    return {
        require: ["^btnPopup"],
        replace: true,
        transclude: true,
        template: '<ul ng-transclude="popup"></ul>'
    }
});