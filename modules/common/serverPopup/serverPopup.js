/**  description 服务器【可单选可多选】，渠道【多选】，平台组件【多选】
 *   author tangyue
 *   date 2015/12/8
 */
var _ = require('tools/underscore/underscore');
angular.module('app').directive('serverPopup', function () {
    return {
        restrict: 'E',
        transclude: true,
        replace: true,
        scope: {
            popuparg: "="
        },
        controller: function ($scope, $http) {
            var objArr=[];
            $scope.allChecked = [];//全部专区
            $scope.hasSerChecked = [];//专区
            $scope.hasConChecked = [];//专区下的内容
            $scope.hasagentChecked = [];//平台下的专区下的渠道
            $scope.haspltConChecked = [];//平台下的渠道下的平台
            $http.get('./' + $scope.popuparg.firstDataUrl).success(function (data) {
                $scope.areadata = data;
                _.each(data, function () {
                    $scope.hasSerChecked.push(false);
                });
            });
            $http.get('./' + $scope.popuparg.secondDataUrl).success(function (data) {
                $scope.areacondata = data;
                if ($scope.popuparg.inputId == 'server' && $scope.popuparg.servertype == 'radio') {
                    _.each(data, function () {
                        $scope.hasConChecked.push(false);
                    });
                }
            });
            /*专区单个选*/
            $scope.alldata = [];
            $scope.getAreaCon = function (areaId, eleIndex) {
                $scope.allChecked[$scope.popuparg.allCheckRank] = false;
                if ($scope.popuparg.inputtype == "radio") {
                    for (var b in $scope.areadata) {
                        if (b == eleIndex) {
                            $scope.hasSerChecked[b] = true;
                        } else {
                            $scope.hasSerChecked[b] = false;
                        }
                    }
                    $scope.alldata = [];
                }
                if ($scope.hasSerChecked[eleIndex]) {//选中时
                    _.each($scope.areacondata, function (value, key, list) {
                        if (areaId == value.area) {
                            $scope.alldata.push(value);
                        }
                    });
                } else {//不选中时
                    var evens = _.filter($scope.alldata, function (val, key) {
                        return val.area != areaId;
                    });
                    $scope.alldata = evens;
                }
                if ($scope.popuparg.inputId != 'platform' && $scope.popuparg.servertype != 'radio') {//服务器和渠道默认全选
                    $scope.hasConChecked = [];
                    _.each($scope.alldata, function () {
                        $scope.hasConChecked.push(true);
                    });
                    $scope.popuparg.btnPopParam.conData = $scope.alldata;//父controller可获得该数据
                } else if ($scope.popuparg.inputId == 'server' && $scope.popuparg.servertype == 'radio') {//服务器单选时
                    $scope.singleServerChecked(0);
                } else if ($scope.popuparg.inputId == 'platform') {
                    $scope.platformdata = $scope.alldata[0].ptList;//第一个渠道下的所有平台
                    $scope.haspltConChecked = [];
                    $scope.hasagentChecked = [];
                    _.each($scope.alldata, function (data, key) {//默认选中第一个渠道
                        if (key == 0) {
                            $scope.hasagentChecked.push(true);
                        } else {
                            $scope.hasagentChecked.push(false);
                        }
                    });
                    _.each($scope.platformdata, function () {//默认选中第一个渠道下的所有平台
                        $scope.haspltConChecked.push(true);
                    });
                    $scope.popuparg.btnPopParam.conData = $scope.platformdata;//父controller可获得该数据
                }
            }
            /*服务器第二层单选*/
            $scope.singleServerChecked = function (serverIndex) {
                for (var r in $scope.alldata) {
                    if (r == serverIndex) {
                        $scope.hasConChecked[r] = true;
                        objArr[0]=$scope.alldata[r];
                        $scope.popuparg.btnPopParam.conData = objArr;//父controller可获得该数据
                    } else {
                        $scope.hasConChecked[r] = false;
                    }
                }
            }
            /*平台控件中渠道单个点击*/
            $scope.platformChecked = function (pldata, agentIndex) {
                for (var b in $scope.alldata) {
                    if (b == agentIndex) {
                        $scope.hasagentChecked[b] = true;
                    } else {
                        $scope.hasagentChecked[b] = false;
                    }
                }
                if ($scope.hasagentChecked[agentIndex]) {//平台默认全选
                    $scope.platformdata = pldata;
                    $scope.haspltConChecked = [];
                    _.each($scope.platformdata, function () {
                        $scope.haspltConChecked.push(true);
                    });
                    $scope.popuparg.btnPopParam.conData = $scope.platformdata;//父controller可获得该数据
                }
            }
            $scope.allfun = function (allCheIndex) {//全部专区
                if ($scope.allChecked[allCheIndex]) {
                    $scope.hasSerChecked = [];
                    $scope.hasConChecked = [];
                    $scope.alldata = [];
                    if ($scope.popuparg.inputId == 'platform') {
                        $scope.platformdata = [];
                        $scope.hasagentChecked = [];
                        $scope.haspltConChecked = [];
                    }
                    $scope.popuparg.btnPopParam.conData = $scope.popuparg.inputId;//公布出选中的数据
                } else {
                    $scope.popuparg.btnPopParam.conData = [];
                }
            }
            /*全选/清空*/
            $scope.popCheckAll = function (ispopAll, chdata) {
                if (ispopAll) {
                    for (var j in chdata) {//默认当前区全选
                        if ($scope.popuparg.inputId != 'platform') {
                            $scope.hasConChecked[j] = true;
                        } else if ($scope.popuparg.inputId == 'platform') {
                            $scope.haspltConChecked[j] = true;
                        }
                    }
                } else {
                    if ($scope.popuparg.inputId != 'platform') {
                        $scope.hasConChecked = [];
                    } else if ($scope.popuparg.inputId == 'platform') {
                        $scope.haspltConChecked = [];
                    }
                }
                getpopChecked();
            }
            /*反选*/
            $scope.invertPopSelection = function (chdata) {
                for (var i in chdata) {
                    if ($scope.popuparg.inputId != 'platform') {
                        if ($scope.hasConChecked[i]) {
                            $scope.hasConChecked[i] = false;
                        } else {//选中的
                            $scope.hasConChecked[i] = true;
                        }
                    } else if ($scope.popuparg.inputId == 'platform') {
                        if ($scope.haspltConChecked[i]) {
                            $scope.haspltConChecked[i] = false;
                        } else {//选中的
                            $scope.haspltConChecked[i] = true;
                        }
                    }
                }
                getpopChecked();
            }
            /*服务单个点击获得选中个数*/
            $scope.singleChecked = function () {
                getpopChecked();
            }
            /*得到选中个数和对应的数据*/
            var getpopChecked = function () {
                //选择的结果数据集合
                var checkedArray = [];
                if ($scope.popuparg.inputId != 'platform') {
                    for (var a in $scope.hasConChecked) {
                        var num = parseInt(a);
                        if ($scope.hasConChecked[num]) {
                            checkedArray.push($scope.alldata[num]);//添加选中数据到数组中
                        }
                    }
                } else if ($scope.popuparg.inputId == 'platform') {
                    for (var a in $scope.haspltConChecked) {
                        var num = parseInt(a);
                        if ($scope.haspltConChecked[num]) {
                            checkedArray.push($scope.platformdata[num]);//添加选中数据到数组中
                        }
                    }
                }
                $scope.popuparg.btnPopParam.conData = checkedArray; //公布出选中的数据
            }
        },
        template: __inline('./serverPopup.html')
    };
});
