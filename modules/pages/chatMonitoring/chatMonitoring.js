/**   description 等级分布
 *   author tangyue
 *   date 2015/11/12
 */
var _format = require('data/dataFormat');
var _ = require('tools/underscore/underscore');
angular.module("app").controller("chatCtrl",
    function ($rootScope, $scope, $timeout, $http) {
        $rootScope.breadCNavigation = "聊天监控";
        $scope.setOverallTitle = "提示：点击监控的聊天内容，会弹出具体操作界面！被监控服务器的数据会每分钟自动更新!";
        /*面板切换是否显示关闭按钮*/
        $scope.tabdivparam = {"isShowclose": true, "chatDataLeng": [], "clickNum": 0};
        /*清空服务器、渠道、平台数据*/
        $scope.emptypopdata();
        $timeout(function () {
            utils.initTip();//等tip标签生成了再去初始化hover提示框
        }, 50);
        /*开始监控*/
        $scope.ischat = false;//可编辑
        $scope.ChatData = [];
        $scope.startMonitoring = function () {
            var isaddServer = _format.checkServerData($scope.serverfil.conData, $scope);
            if (isaddServer) {//选择了服务器值
                if ($scope.serverfil.conData.length > 6) {
                    $scope.warn = '服务器最多可选择6个';
                    $scope.tipShow = true;
                } else {
                    $scope.warn = '';
                    $scope.tipShow = false;
                    angular.element(".mleavediv").removeClass('open');//关闭服务器弹框
                    $scope.isGoQuery = true;//旋转
                    $scope.ischat = true;//不可编辑
                    //ajax ........success after
                    var AllArray = [];
                    var num = 0;
                    $scope.tabdivparam.clickNum = 0;
                    _.each($scope.serverfil.conData, function (value, key, list) {
                        if (value.id == 2002 || value.id == 2001) {
                            $http.get("./datajson/chatMonitoring" + value.id + '.json').success(function (data) {
                                AllArray.push({"serName": value.name, "contentData": data});
                            });
                        } else {
                            AllArray.push({"serName": value.name, "contentData": []});
                        }
                        num++;
                    });
                    $scope.ChatData = AllArray;
                    $scope.tabdivparam.chatDataLeng = $scope.serverfil.conData;
                    $timeout(function () {
                        if (num == $scope.serverfil.conData.length) {//请求完成后恢复按钮状态
                            $scope.isGoQuery = false;//不旋转
                            $scope.ischat = false;//可编辑
                        }
                    }, 150);
                }
            } else {
                $scope.isGoQuery = false;
                $scope.ischat = false;
            }
        }
        /*每行点击操作*/
        $scope.showOparate = function (conData) {
            $scope.modalparams = {
                "title": "玩家封禁时间设置",
                "btnText1": "取消",
                "btnText2": "应用",
                "showEle": "other"
            };
            utils.showModal();
            $scope.playerName = conData.td0;
            console.log(conData);
        }
        /*玩家封禁时间---应用操作*/
        $scope.modalConfirm = function () {
            if ($scope.modalparams.showEle == "other") {
                var arrparam=[];
                arrparam.push("banState="+$scope.BanData.forbidden);
                if ($scope.BanData.forbidden == 'Ban') {//冻结
                    var bantime = $scope.BanData.year + "-" + $scope.BanData.month + "-" + $scope.BanData.day + " " + $scope.BanData.hour + ":" + $scope.BanData.minute;
                    var isvalidate=$scope.checkDadeTime(bantime,$scope);
                    if (isvalidate) {//验证通过
                        arrparam.push("stateData="+bantime);
                    }
                }else{//不冻结
                    arrparam.push("stateData="+$scope.BanData.notalktime);
                }
                console.log('该对接玩家封禁时间---应用接口了', '获得的数据：', arrparam.join("&"));
            }
        }
        $scope.BanData = {};
        /*玩家封禁时间设置---单选框操作*/
        $scope.emptydata = function () {
            if ($scope.BanData.forbidden == 'Ban') {//冻结
                $scope.BanData.notalktime = '1';
            } else {//不冻结
                $scope.dateWarn='';
                $scope.BanData.year = '';
                $scope.BanData.month = '';
                $scope.BanData.day = '';
                $scope.BanData.hour = '';
                $scope.BanData.minute = '';
            }
        }
    });
module.exports = {
    url: '/chatMonitoring',
    views: {
        'content': {
            template: __inline('./chatMonitoring.html')
        }
    }
};

