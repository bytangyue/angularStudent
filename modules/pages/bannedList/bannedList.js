/**   description
 *   author luxiaoling
 *   date 2015/11/19
 */
var _format = require('data/dataFormat');
angular.module("app").factory('singleServerTableInstance', function () {
    return {};
}).factory('allServerTableInstance', function () {
    return {};
}).controller("bannedCtrl",
    function ($rootScope, $scope, $timeout,$window,$cookieStore, singleServerTableInstance, allServerTableInstance, $http) {
        $rootScope.breadCNavigation = "禁言名单";
        $scope.setOverallTitle="提示：此处操作，服务器为全局使用。";
        /*清空服务器、渠道、平台数据*/
        $scope.emptypopdata();
        /*时间组件配置*/
        $scope.adddate={"dateclass":"addate","isvalid":true};
        $timeout(function () {
            utils.initTip();//等tip标签生成了再去初始化hover提示框
        }, 1000);
        $scope.checksingleseTableAll=function(ischeck){//单服全选/取消
            _format.setCheckboxAll(ischeck,singleServerTableInstance.vm.dtInstance.DataTable);
        }
        $scope.checkallseTableAll=function(ischeck){//全服全选/取消
            _format.setCheckboxAll(ischeck,allServerTableInstance.vm.dtInstance.DataTable);
        }
        $scope.banTalk=function(){//全服禁聊天
            $scope.isBanTalk=true;
            _format.deleteOption($scope,"禁","talk");
            utils.showModal();
        }
        $scope.noBanTalk=function(){//全服解禁聊天
            $scope.isBanTalk=false;
            _format.deleteOption($scope,"解除禁","talk");
            utils.showModal();
        }
        $scope.modalConfirm = function () {//模态窗口确认按钮操作
            if (!$scope.modalparams.isDelete&&!$scope.modalparams.isauction) {//禁言名单
                if($scope.isBanTalk){
                    console.log('该对接全服禁聊天接口了');
                }else{
                    console.log('该对接全服解禁聊天接口了');
                }
                //auctionStateTableInstance.vm.dtInstance.reloadData();//重新加载数据
            }
        }
        $scope.singleServerSelected = function () {//单服禁言批量删除
            $scope.singleServerDele = true;
            var selecteData = _format.checkSelectedData(singleServerTableInstance.vm.dtInstance, $scope);
            _format.deleteOption($scope, selecteData.length,"dele");
            $scope.deleDeleData = selecteData;//选中数据
        }
        $scope.$on('singleServerDeleteOne', function (d, eventData) {//单服禁言table删除操作
            $scope.singleServerDele = true;
            _format.deleteOption($scope, "one","dele");
            _format.deleteActiveClass(eventData.thisobj);
            $scope.deleDeleData = eventData.operateDatas;//选中数据
        });
        $scope.allServerSelected = function () {//全服服禁言批量删除
            $scope.singleServerDele = false;
            var selecteData = _format.checkSelectedData(allServerTableInstance.vm.dtInstance, $scope);
            _format.deleteOption($scope, selecteData.length,"dele");
            $scope.deleDeleData = selecteData;//选中数据
        }

        $scope.$on('allServerDeleteOne', function (d, eventData) {//全服服禁言table删除操作
            $scope.singleServerDele = false;
            _format.deleteOption($scope, "one","dele");
            _format.deleteActiveClass(eventData.thisobj);
            $scope.deleDeleData = eventData.operateDatas;//选中数据
        });

        $scope.modalConfirm = function () {//模态窗口确认按钮操作
            if ($scope.modalparams.showEle=="dele") {//删除接口
                if ($scope.singleServerDele) {
                    console.log('该对接单服禁言delete接口了', "选中的数据：", $scope.deleDeleData);
                    //singleServerTableInstance.vm.dtInstance.reloadData();//重新加载数据
                } else {
                    console.log('该对接全服禁言delete接口了', "选中的数据：", $scope.deleDeleData);
                    //allServerTableInstance.vm.dtInstance.reloadData();//重新加载数据
                }
            }
        }
        /*全服禁言的时候隐藏服务器选择*/
        $scope.$on('paneTitleId', function (d, eventData) {
            if(eventData == "allNoTalk"){
                $scope.ishideServer=false;
            }else{
                $scope.ishideServer=true;
            }
        });
        /*单服查询确定操作*/
        $scope.querysingleserver = function () {
            var isqueryServer = _format.checkServerData($scope.showServerData, $scope);
            if (isqueryServer) {//选择了服务器值
                $scope.querypop.ispopshow = false;
                console.log('query');
            } else {
                $scope.querypop.ispopshow = true;
            }
        }
        /*全服查询确定操作*/
        $scope.queryallserver = function () {
            var isqueryServer = _format.checkServerData($scope.showServerData, $scope);
            if (isqueryServer) {//选择了服务器值
                $scope.querypop.ispopshow = false;
                console.log('query');
            } else {
                $scope.querypop.ispopshow = true;
            }
        }
        /*单服新增确定操作*/
        $scope.singleserveradd = function () {
            var isaddServer = _format.checkServerData($scope.showServerData, $scope);
            if (isaddServer) {//选择了服务器值
                $scope.addpop.ispopshow = false;
                console.log('query');
            } else {
                $scope.addpop.ispopshow = true;
            }
        }
        /*全服新增确定操作*/
        $scope.allserveradd = function () {
            var isaddServer = _format.checkServerData($scope.showServerData, $scope);
            if (isaddServer) {//选择了服务器值
                $scope.addpop.ispopshow = false;
                console.log('query');
            } else {
                $scope.addpop.ispopshow = true;
            }
        }
        $scope.resettable=function(){
            $timeout(function(){
                singleServerTableInstance.vm.dtInstance.dataTable.fnAdjustColumnSizing();
            },10);
            $timeout(function(){
                allServerTableInstance.vm.dtInstance.dataTable.fnAdjustColumnSizing();
            },10);
        }
    });
angular.module('app').controller('singleServerTableCtrl', function ($scope, $window, $compile, $timeout, DTOptionsBuilder,
                                                                    DTColumnBuilder, singleServerTableInstance) {
        /**
         * 表格设定
         */
        var vm = this;
        vm.delete = deleteRow;
        vm.dtInstance = {};
        vm.operateDatas = {};
        vm.dtOptions = DTOptionsBuilder.fromSource('datajson/bannedListSingle.json')
            .withDOM("<'row'<'pull-right de-m m-t-32'f>r><'row' t><'row'<'col-xs-3'l><'col-xs-2'><'col-xs-7'p>>")
            .withBootstrap()
            .withLanguage({
                "sEmptyTable": "暂无数据",
                "sInfo": "已显示_TOTAL_ 条记录中: _START_ 到 _END_ ",
                "sInfoEmpty": "已显示 0 to 0 of 0 条记录",
                "sInfoFiltered": "(_MAX_条记录筛选)",
                "sInfoPostFix": "",
                "sInfoThousands": ",",
                "sLengthMenu": "显示 _MENU_ 条记录",
                "sLoadingRecords": "加载中...",
                "sProcessing": "正在玩命处理...",
                "sSearch": "搜索:",
                "sZeroRecords": "暂无记录！",
                "oPaginate": {
                    "sFirst": "首页",
                    "sLast": "尾页",
                    "sNext": "下一页",
                    "sPrevious": "上一页"
                },
                "oAria": {
                    "sSortAscending": ": activate to sort column ascending",
                    "sSortDescending": ": activate to sort column descending"
                }
            }).
            withBootstrapOptions({
                pagination: {
                    classes: {
                        ul: 'pagination pagination-sm'
                    }
                }
            }).withSelect({
                style: 'multi',
                selector: 'td:first-child'
            }).withOption('autoWidth', false).withOption('scrollX', true).withOption('createdRow', createdRow);
        vm.dtColumns = [
            DTColumnBuilder.newColumn(null).withTitle('')
                .notSortable()
                .withClass('select-checkbox backimgnone')
                .renderWith(function () {
                    return '';
                }).withOption('width', '10px'),
            DTColumnBuilder.newColumn('id').withTitle('id').withOption('width', '30px'),
            DTColumnBuilder.newColumn('td1').withTitle('服务器'),
            DTColumnBuilder.newColumn('td2').withTitle('角色名称'),
            DTColumnBuilder.newColumn('td3').withTitle('结束时间').withOption('width', '160px'),
            DTColumnBuilder.newColumn(null).withTitle('操作').notSortable()
                .renderWith(actionsHtml).withOption('width', '80px')
        ];
        /*最后一列操作 start*/
        function deleteRow(operateDatas, thisobj) {//删除
            $("#" + thisobj).addClass("one-dele-active");
            $scope.$emit('singleServerDeleteOne', {"operateDatas": operateDatas, "thisobj": thisobj});
        }
        function createdRow(row, data, dataIndex) {
            $compile(angular.element(row).contents())($scope);
        }
        function actionsHtml(data, type, full, meta) {
            return _format.apendDeleteHtml(vm.operateDatas, data);
        }
        /*最后一列操作 end*/
        singleServerTableInstance.vm = vm;
        angular.element($window).bind('resize', function () {
            singleServerTableInstance.vm.dtInstance.dataTable.fnAdjustColumnSizing();
        });
    }
);
angular.module('app').controller('allServerTableCtrl', function ($scope, $window, $compile, $timeout, DTOptionsBuilder,
                                                                 DTColumnBuilder, allServerTableInstance) {
        /**
         * 表格设定
         */
        var vm = this;
        vm.delete = deleteRow;
        vm.dtInstance = {};
        vm.operateDatas = {};
        vm.dtOptions = DTOptionsBuilder.fromSource('datajson/bannedListAll.json')
            .withDOM("<'row'<'pull-right all-server m-t-32'f>r><'row' t><'row'<'col-xs-3'l><'col-xs-2'><'col-xs-7'p>>")
            .withBootstrap()
            .withLanguage({
                "sEmptyTable": "暂无数据",
                "sInfo": "已显示_TOTAL_ 条记录中: _START_ 到 _END_ ",
                "sInfoEmpty": "已显示 0 to 0 of 0 条记录",
                "sInfoFiltered": "(_MAX_条记录筛选)",
                "sInfoPostFix": "",
                "sInfoThousands": ",",
                "sLengthMenu": "显示 _MENU_ 条记录",
                "sLoadingRecords": "加载中...",
                "sProcessing": "正在玩命处理...",
                "sSearch": "搜索:",
                "sZeroRecords": "暂无记录！",
                "oPaginate": {
                    "sFirst": "首页",
                    "sLast": "尾页",
                    "sNext": "下一页",
                    "sPrevious": "上一页"
                },
                "oAria": {
                    "sSortAscending": ": activate to sort column ascending",
                    "sSortDescending": ": activate to sort column descending"
                }
            }).
            withBootstrapOptions({
                pagination: {
                    classes: {
                        ul: 'pagination pagination-sm'
                    }
                }
            }).withSelect({
                style: 'multi',
                selector: 'td:first-child'
            }).withOption('autoWidth', false).withOption('scrollX', true).withOption('createdRow', createdRow);
        vm.dtColumns = [
            DTColumnBuilder.newColumn(null).withTitle('')
                .notSortable()
                .withClass('select-checkbox backimgnone')
                .renderWith(function () {
                    return '';
                }).withOption('width', '10px'),
            DTColumnBuilder.newColumn('id').withTitle('id').withOption('width', '30px'),
            DTColumnBuilder.newColumn('td1').withTitle('角色名称'),
            DTColumnBuilder.newColumn('td2').withTitle('结束时间').withOption('width', '160px'),
            DTColumnBuilder.newColumn(null).withTitle('操作').notSortable()
                .renderWith(actionsHtml).withOption('width', '80px')
        ];
        /*最后一列操作 start*/
        function deleteRow(operateDatas, thisobj) {//删除
            $("#" + thisobj).addClass("one-dele-active");
            $scope.$emit('allServerDeleteOne', {"operateDatas": operateDatas, "thisobj": thisobj});
        }
        function createdRow(row, data, dataIndex) {
            $compile(angular.element(row).contents())($scope);
        }
        function actionsHtml(data, type, full, meta) {
            return _format.apendDeleteHtml(vm.operateDatas, data,"as");
        }
        /*最后一列操作 end*/
        allServerTableInstance.vm = vm;
        //angular.element($window).bind('resize', function () {
        //    allServerTableInstance.vm.dtInstance.dataTable.fnAdjustColumnSizing();
        //});
    }
);
module.exports = {
    url: '/bannedList',
    views: {
        'content': {
            template: __inline('./bannedList.html')
        }
    }
};

