angular.module('app', ['ui.router', 'ui.bootstrap', 'ui.select2', 'ngCookies', 'datatables','datatables.buttons',
    'datatables.fixedcolumns', 'datatables.bootstrap', 'ngResource', 'datatables.select']);
//加载js文件
require('common/appServices/appServices');
require('common/dateDirective/dateDirective');
require('common/tablePanel/tablePanel');
require('common/modalDialog/modalDialog');
require('common/filtrateBtn/filtrateBtn');
require('common/btnPopup/btnPopup');
require('common/singleFiltrate/singleFiltrate');
require('common/serverPopup/serverPopup');
require('common/loading/loading');
require('router');
/**
 * 获取导航条数据
 */
angular.module('app').controller('CtrlNavData', ['$scope', '$http', '$cookieStore', '$rootScope', '$timeout', '$window',
    function ($scope, $http, $cookieStore, $rootScope, $timeout, $window) {

        $http.get('./navigator.json').success(function (data) {
            /*清除dom加载前的样式*/
            angular.element("#load-gif").hide();
            angular.element(".refreshing-color").removeClass('refreshing-color');
            $scope.dataList = data['data'];
            $timeout(utils.initTip, 50);//等tip标签生成了再去初始化
        });
        /*退出系统*/
        $rootScope.signOut = function () {
            $cookieStore.put('isAdLogin', false);
            $rootScope.$state.go('login');
        }
        /*年月日时分校验*/
        var REG_EXP_DATE = "^((([0-9]{3}[1-9]|[0-9]{2}[1-9][0-9]{1}|[0-9]{1}[1-9][0-9]{2}|[1-9][0-9]{3})-(((0[13578]|1[02])-(0[1-9]|[12][0-9]|3[01]))|((0[469]|11)-(0[1-9]|[12][0-9]|30))|(02-(0[1-9]|[1][0-9]|2[0-8]))))|((([0-9]{2})(0[48]|[2468][048]|[13579][26])|((0[48]|[2468][048]|[3579][26])00))-02-29))\\s+([0-1]?[0-9]|2[0-3]):([0-5][0-9])$";
        $scope.checkDadeTime = function (bantime, $scope) {
            if (!bantime.match(REG_EXP_DATE)) {
                $scope.dateWarn = '时间格式不正确，正确格式例子：1000-01-01 01:01，24小时要写成00:00';
                return false;
            } else {
                $scope.dateWarn = '';
                return true;
            }
        }
        /*查询按钮配置*/
        $scope.querypop = {
            "popname": "查询",
            "popposition": "right",
            "iconclass": "fa fa-search",
            "headtitle": "查询设置",
            "ispopshow": false
        };
        /*查询按钮第二个配置*/
        $scope.querypoptwo = {
            "popname": "查询",
            "popposition": "right",
            "iconclass": "fa fa-search",
            "headtitle": "查询设置",
            "ispopshow": false
        };
        /*新增按钮配置*/
        $scope.addpop = {
            "popname": "新增",
            "popposition": "left",
            "iconclass": "fa fa-plus-circle",
            "headtitle": "新增设置",
            "ispopshow": false
        };
        /*新增按钮第二个配置*/
        $scope.addpoptwo = {
            "popname": "新增",
            "popposition": "left",
            "iconclass": "fa fa-plus-circle",
            "headtitle": "新增设置",
            "ispopshow": false
        };
        /*将表格头的宽设置为100%*/
        $scope.resettablehead = function () {
            angular.element(".dataTables_scrollHeadInner").css({"width":"100%"});
            angular.element(".dataTables_scrollHeadInner table").css({"width":"100%"});
        }
        /*控制导航收缩*/
        $scope.toggleSidebar = function () {
            $scope.toggle = !$scope.toggle;
            $scope.$broadcast('toggleSidebar');//向下广播导航收缩事件
            $scope.resettablehead();
        };
        $scope.nametip = {"tip": ""};
        /*服务器按钮配置*/
        $scope.serverfil = {
            "classname": "pop-server",
            "popname": "请选择服务器",
            "ispopshow": false,
            "conData": []
        };
        $scope.serverarg = {
            "allCheckRank": 0,
            "inputId": "server",
            "inputtype": "checkbox",//第一层专区选择为多选
            "firstDataUrl": "area.json",
            "secondDataUrl": "serverContent.json",
            "btnPopParam": $scope.serverfil
        };
        /*单选服务器按钮配置*/
        $scope.singleserverarg = {
            "allCheckRank": 0,
            "inputId": "server",
            "inputtype": "radio",//第一层专区选择为单选，不设置默认为多选
            "servertype": "radio",//第二层服务器选择为单选，不设置默认为多选
            "firstDataUrl": "area.json",
            "secondDataUrl": "serverContent.json",
            "btnPopParam": $scope.serverfil
        };
        /*渠道按钮配置*/
        $scope.agentfil = {
            "classname": "pop-agent",
            "popname": " 请选择渠道 ",
            "ispopshow": false,
            "conData": []
        };
        $scope.agentarg = {
            "allCheckRank": 1,
            "inputId": "agent",
            "inputtype": "radio",//第一层专区选择为单选
            "firstDataUrl": "area.json",
            "secondDataUrl": "agentContent.json",
            "btnPopParam": $scope.agentfil
        };
        /*平台按钮配置*/
        $scope.platformfil = {
            "classname": "pop-platform",
            "popname": " 请选择平台 ",
            "ispopshow": false,
            "conData": []
        };
        $scope.platformarg = {
            "allCheckRank": 2,
            "inputId": "platform",
            "inputtype": "radio",//第一层专区选择为单选
            "firstDataUrl": "area.json",
            "secondDataUrl": "agentContent.json",
            "btnPopParam": $scope.platformfil
        };
        /**
         * 每个页面在初始化的时候清空组件的数据
         */
        $scope.emptypopdata = function () {
            $scope.nametip.tip = "";
            $scope.serverfil.conData = [];
            $scope.agentfil.conData = [];
            $scope.platformfil.conData = [];
        }
        /**
         * 保存附件按钮是否显示
         */
        $scope.saveacce = {"showacce": false};//保存附件按钮是否显示
        $scope.accessory={};
        $scope.mainShowAccefun = function ($scope) {
            if ($scope.accessory.equip || $scope.accessory.currency) {
                $scope.saveacce.showacce = true;
            } else {
                $scope.saveacce.showacce = false;
            }
        }
        /*添加附件*/
        $scope.mainAddAcce = function ($scope) {
            $scope.webaddresschecked = false;
            $scope.accechecked = !$scope.accechecked;
        }
        /*添加网址*/
        $scope.mainAddwebAddress = function ($scope) {
            $scope.accechecked = false;
            $scope.webaddresschecked = !$scope.webaddresschecked;
        }
        $rootScope.$on('$viewContentLoaded',
            function (event, toState, toParams, fromState, fromParams) {
                utils.setDivSize();
            });
        angular.element($window).bind('resize', function () {
            $timeout(function () {
                utils.setDivSize();
            }, 100);
        });
        ///**
        // * 全屏时收起导航栏
        // */
        //document.addEventListener('webkitfullscreenchange', function () {
        //    if (!$scope.toggle)
        //        $scope.toggleSidebar()
        //});
        //document.addEventListener('mozfullscreenchange', function () {
        //    if (!$scope.toggle)
        //        $scope.toggleSidebar()
        //});
        //document.addEventListener('fullscreenchange', function () {
        //    if (!$scope.toggle)
        //        $scope.toggleSidebar()
        //});
    }]);
