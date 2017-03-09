/**  description
 *   author tangyue
 *   date 2015/10/21
 */
angular.module('app').directive('myTabsBottom', function () {
    return {
        restrict: 'E',
        transclude: true,
        scope: {
            bottomresize: "&"//由具体controller制定查询逻辑。
        },
        controller: function ($scope) {
            var panesBom = $scope.panesBom = [];
            $scope.selectBottom = function (pane) {
                angular.forEach(panesBom, function (pane) {
                    pane.selected = false;
                });
                pane.selected = true;
                $scope.bottomresize();
            };
            this.addPaneBom = function (pane) {
                if (panesBom.length == 0) {
                    $scope.selectBottom(pane);
                }
                panesBom.push(pane);
            };
        },
        template: __inline('./my-tabs-bottom.html')
    };
}).directive('myPaneBottom', function () {
    return {
        require: '^myTabsBottom',
        restrict: 'E',
        transclude: true,
        scope: {
            titleName: '@',//切换标签的提示语
            icon: '@'//切换标签的字体图标class
        },
        link: function (scope, element, attrs, tabsCtrl) {
            tabsCtrl.addPaneBom(scope);
        },
        template: '<div class="tab-pane-bom" ng-show="selected" ng-transclude></div>'
    };
});