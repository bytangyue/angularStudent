/**  description 单个
 *   author tangyue
 *   date 2015/10/27
 */
angular.module("app").directive('singleFiltrate', function () {
    return {
        restrict: "E",
        replace: true,
        scope: {//在dom上使用这些属性要将驼峰规则的写法换成-的
            filUrl: "@",//数据url
            filTitle: "@",//指令名字
            inputId: "@",//开关按钮input中id值
            inputType:"@",//不设置默认为单选，设置inputType="checkbox"为多选
            alternative: "@",//alternative="true"为二选一，alternative="false"为一个选择
            selection: '='//父controller的scope值
        },
        require: '^filtratePane',
        transclude: true,
        controller: function ($scope, $http, $rootScope, $cookieStore, $element, sharing) {
            $scope.singleOpen = true;
            $http.get('./' + $scope.filUrl).success(function (data) {
                $scope.filDatas = data['children'];
            });
            /**
             * 开关
             **/
            $scope.toggleBtn = function () {
                if ($scope.alternative == 'true') {//二选一
                    if ($scope.selection.id == $scope.inputId) {//反复点击已开启按钮时不取消选中数据。
                        return;
                    }
                    $scope.selection.id = $scope.inputId;
                    $scope.hasChecked = [];
                    $scope.checkedNum = 0;
                    if ($scope.inputId == 'platform') {
                        sharing.agentdata = [];
                        sharing.serverdata = [];
                    } else if ($scope.inputId == 'agent') {
                        sharing.ptdata = [];
                        sharing.serverdata = [];
                    } else if ($scope.inputId == 'server') {
                        sharing.ptdata = [];
                        sharing.agentdata = [];
                    }
                    $rootScope.$broadcast('filterCheckEvent', {"filName": '',"filId":'', "data": []});
                } else {//一个选择
                    $scope.singleOpen = !$scope.singleOpen;
                    $scope.selection.id = $scope.inputId;
                    if (!$scope.singleOpen) {//off
                        $scope.hasChecked = [];
                        sharing.ptdata = [];
                        sharing.agentdata = [];
                        sharing.serverdata = [];
                        $scope.checkedNum = 0;
                        $rootScope.$broadcast('filterCheckEvent', {"filName": '',"filId":'', "data": []});
                    }
                }
            }
            /*展示平台数据*/
            var agentInfo = null;
            $scope.showPlatform = function (platfData) {
                agentInfo = platfData;
                angular.element("#platform-div").css({"display": "block"});
                $scope.platformDatas = platfData.children;
                $scope.checkAll(true, platfData.children);//默认选中值
            }
            /*关闭展示平台数据的框*/
            $scope.closePlatform = function () {
               angular.element("#platform-div").css({"display": "none"});
            }
            //选择的结果状态集合
            $scope.hasChecked = [];
            //选中个数
            $scope.checkedNum = 0;
            /*单个点击获得选中个数*/
            $scope.addCheckedNum = function (chooseData, index) {
                if (($scope.inputId == 'platform'&&typeof($scope.inputType)=="undefined")||($scope.inputId == 'agent'&&typeof($scope.inputType)=="undefined")) {
                    $scope.hasChecked = [];
                    for (var i in chooseData) {
                        if (parseInt(i) == index) {
                            $scope.hasChecked.push(true);
                        } else {
                            $scope.hasChecked.push(false);
                        }
                    }
                }
                var data = getChecked(chooseData);
                $scope.checkedNum = data.num;
            }
            /*全选/清空*/
            $scope.checkAll = function (isAll, chooseData) {
                if (isAll) {
                    $scope.hasChecked = [];
                    for (var i in chooseData) {
                        if (($scope.inputId == 'platform'&&typeof($scope.inputType)=="undefined")) {//平台默认选中第一个【单选】
                            if (parseInt(i) == 0) {
                                $scope.hasChecked.push(true);
                            } else {
                                $scope.hasChecked.push(false);
                            }
                        } else {//平台默认选中全部【多选】
                            $scope.hasChecked.push(true);
                        }

                    }
                } else {
                    $scope.hasChecked = [];
                    $scope.closePlatform();
                }
                var data = getChecked(chooseData);
                $scope.checkedNum = data.num;
            }
            /*反选*/
            $scope.invertSelection = function (chooseData) {
                for (var i in chooseData) {
                    if ($scope.hasChecked[i]) {
                        $scope.hasChecked[i] = false;
                    } else {//选中的
                        $scope.hasChecked[i] = true;
                    }
                }
                var data = getChecked(chooseData);
                $scope.checkedNum = data.num;
            }
            /*得到选中个数和对应的数据*/
            var getChecked = function (chooseData) {
                //选择的结果数据集合
                var checkedArray = [];

                for (var i in $scope.hasChecked) {
                    var num = parseInt(i);
                    if ($scope.hasChecked[num]) {
                        if ($scope.inputId == 'platform') {
                            var agc = agentInfo.children[num];
                            var agChildren = {
                                "agId": agentInfo.val,
                                "agText": agentInfo.text,
                                "ptId": agc.val,
                                "text": agc.text//平台文本
                                };
                            checkedArray.push(agChildren);//添加选中数据到数组中
                        } else {
                            checkedArray.push(chooseData[num]);//添加选中数据到数组中
                        }
                    }
                }
                if (agentInfo == null) {//服务和渠道广播的数据
                    $rootScope.$broadcast('filterCheckEvent', {"filName": $scope.filTitle,"filId":$scope.inputId, "data": checkedArray});//广播一个控制器
                } else {//平台广播的数据
                    $rootScope.$broadcast('filterCheckEvent', {
                        "agentName": agentInfo.text,
                        "filName": $scope.filTitle,
                        "filId":$scope.inputId,
                        "data": checkedArray
                    });//广播一个控制器
                }
                /**
                 * clear cache
                 * @type {Array}
                 */
                sharing.ptdata = [];
                sharing.agentdata = [];
                sharing.serverdata = [];
                if ($scope.inputId == 'platform') {
                    sharing.ptdata = checkedArray;
                } else if ($scope.inputId == 'agent') {
                    sharing.agentdata = checkedArray;
                } else if ($scope.inputId == 'server') {
                    sharing.serverdata = checkedArray;
                }
                return {"num": checkedArray.length};
            }

        },
        template: __inline("./singleFiltrate.html"),
        link: function ($scope, element, attrs, ctrls) {
            ctrls.addFilter($scope);
        }
    }
});