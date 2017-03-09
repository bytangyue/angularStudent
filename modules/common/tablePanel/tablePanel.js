/**  description
 *   author tangyue
 *   date 2015/10/21
 */

var _ = require('tools/underscore/underscore');
angular.module('app').directive('myTabs', function () {
        return {
            restrict: 'E',
            transclude: true,
            scope: {
                tabdivresize: "&",
                tabdivparam:"="
            },
            controller: function ($scope,$rootScope) {
                var panes = $scope.panes = [];
                $scope.select = function (pane) {
                    angular.forEach(panes, function (pane) {
                        pane.selected = false;
                    });
                    pane.selected = true;
                    $scope.$emit('paneTitleId',pane.titleid);//向上广播一个控制器
                    $scope.tabdivresize();
                };
                this.addPane = function (pane) {
                    if (panes.length == 0) {
                        $scope.select(pane);
                    }
                    panes.push(pane);
                };
                /*聊天监控-->点击x出现提示的模态窗口*/
                $scope.removeTabPanel=function (index,paneId,paneName) {
                    $scope.thisIndex=index;
                    $scope.panetitleId=paneId;
                    $scope.selectedData=paneName;
                    $('#tabModal').modal({
                        show:true
                    });
                }
                /*聊天监控-->点击确定关闭选中面板*/
                $scope.confirmRemove=function(){
                    angular.element(".tabdele"+$scope.panetitleId).remove();
                    panes.splice($scope.thisIndex,1);//删除被移除的pane
                    angular.forEach(panes, function (pane,key) {
                        if(key==0){
                            panes[key].selected = true;
                        }else{
                            panes[key].selected = false;
                        }
                    });
                }
            },
            template: __inline('./my-tabs.html')
        };
    })
    .directive('myPane', function () {
        return {
            require: '^myTabs',
            restrict: 'E',
            transclude: true,
            scope: {
                closetabpanel: "&",
                titleName: '@',//切换标签的名称
                titleid: '@'//切换标签的名称Id
            },
            link: function (scope, element, attrs, tabsCtrl) {
                tabsCtrl.addPane(scope);
            },
            template: '<div class="tab-pane tabdele{{titleid}}" ng-show="selected" ng-transclude></div>'
        };
    });