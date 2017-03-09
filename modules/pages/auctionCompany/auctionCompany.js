/**   description 等级分布
 *   author tangyue
 *   date 2015/11/12
 */
var _format = require('data/dataFormat');
angular.module("app").factory('productTableInstance', function () {
    return {};
}).factory('tradeRecodeTableInstance', function () {
    return {};
}).factory('auctionStateTableInstance', function () {
    return {};
}).controller("auctioneCtrl",
    function ($rootScope, $scope, $timeout, $cookieStore, $window, productTableInstance,tradeRecodeTableInstance,auctionStateTableInstance, $http) {
        $rootScope.breadCNavigation = "拍卖行";
        $scope.setOverallTitle="提示：此处操作，服务器、渠道和平台均为全局使用。";
        /*清空服务器、渠道、平台数据*/
        $scope.emptypopdata();
        $timeout(function () {
            utils.initTip();//等tip标签生成了再去初始化hover提示框
        }, 50);
        $scope.checkauctionTableAll=function(ischeck){// 全选/取消
            _format.setCheckboxAll(ischeck,auctionStateTableInstance.vm.dtInstance.DataTable);
        }
        /*拍卖行状态列表的时候显示查询按钮*/
        $scope.$on('paneTitleId', function (d, eventData) {
            if(eventData == "state"){
                $scope.ishideSer=false;
            }else{
                $scope.ishideSer=true;
            }
        });
        $scope.offauction = function () {//关闭拍卖行
            $scope.offau='mulitClose';
            var selecteData = _format.checkSelectedData(auctionStateTableInstance.vm.dtInstance, $scope);
            _format.deleteOption($scope,selecteData.length,$scope.offau);
            $scope.operateData = selecteData;//选中数据
        }
        $scope.onauction = function () {//打开拍卖行
            $scope.offau='mulitOpen';
            var selecteData = _format.checkSelectedData(auctionStateTableInstance.vm.dtInstance, $scope);
            _format.deleteOption($scope,selecteData.length,$scope.offau);
            $scope.operateData = selecteData;//选中数据
        }
        $scope.$on('closeAucOne',function(d, eventData){//table 关闭拍卖行
            $scope.offau='singleClose';
            _format.deleteOption($scope,"关闭","auction");
            _format.deleteActiveClass(eventData.thisobj);
            $scope.operateData = eventData.operateDatas;//选中数据
        });
        $scope.$on('openAucOne',function(d, eventData){//table 打开拍卖行
            $scope.offau='singleOpen';
            _format.deleteOption($scope,"开启","auction");
            _format.deleteActiveClass(eventData.thisobj);
            $scope.operateData = eventData.operateDatas;//选中数据
        });
        $scope.modalConfirm = function () {//模态窗口确认按钮操作
                if($scope.offau=='mulitClose'||$scope.offau=='singleClose'){
                    console.log('该对接关闭拍卖行接口了', "选中的数据：", $scope.operateData);
                }else if($scope.offau=='mulitOpen'||$scope.offau=='singleOpen'){
                    console.log('该对接打开拍卖行接口了', "选中的数据：", $scope.operateData);
                }
                //auctionStateTableInstance.vm.dtInstance.reloadData();//重新加载数据
        }
        $scope.resettable=function(){
            $timeout(function(){
                productTableInstance.vm.dtInstance.dataTable.fnAdjustColumnSizing();
            },10);
            $timeout(function(){
                tradeRecodeTableInstance.vm.dtInstance.dataTable.fnAdjustColumnSizing();
            },10);
        }
    });
angular.module('app').controller('productTableCtrl', function ($scope, $window, $compile, DTOptionsBuilder,
                                                            DTColumnBuilder, productTableInstance) {
        /**
         * 表格设定
         */
        var vm = this;
        vm.dtInstance = {};
        vm.dtOptions = DTOptionsBuilder.fromSource('datajson/auctionCompanyGoods.json')
            .withDOM("<'row'<'pull-right de-m margin-right-20'f>r><'row' t><'row'<'col-xs-3'l><'col-xs-2'><'col-xs-7'p>>")
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
            }).withOption('autoWidth', false).withOption('scrollX', true);
        vm.dtColumns = [
            DTColumnBuilder.newColumn('id').withTitle('id').withOption('width', '30px'),
            DTColumnBuilder.newColumn('td1').withTitle('服务器'),
            DTColumnBuilder.newColumn('td2').withTitle('物品名称'),
            DTColumnBuilder.newColumn('td3').withTitle('所属角色'),
            DTColumnBuilder.newColumn('td4').withTitle('拍卖行价格（金钻）'),
            DTColumnBuilder.newColumn('td5').withTitle('上架时间').withOption('width', '160px'),
            DTColumnBuilder.newColumn('td6').withTitle('下架时间').withOption('width', '160px')
        ];
        productTableInstance.vm = vm;
        angular.element($window).bind('resize', function () {
            productTableInstance.vm.dtInstance.dataTable.fnAdjustColumnSizing();
        });
    }
);
angular.module('app').controller('tradeRecodeTableCtrl', function ($scope, $window, $compile, DTOptionsBuilder,
                                                           DTColumnBuilder, tradeRecodeTableInstance) {
        /**
         * 表格设定
         */
        var vm = this;
        vm.dtInstance = {};
        vm.dtOptions = DTOptionsBuilder.fromSource('datajson/auctionCompanyTrade.json')
            .withDOM("<'row'<'pull-right de-m margin-right-20'f>r><'row' t><'row'<'col-xs-3'l><'col-xs-2'><'col-xs-7'p>>")
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
            }).withOption('autoWidth', false).withOption('scrollX', true);
        vm.dtColumns = [
            DTColumnBuilder.newColumn('id').withTitle('id').withOption('width', '30px'),
            DTColumnBuilder.newColumn('td1').withTitle('服务器'),
            DTColumnBuilder.newColumn('td2').withTitle('物品名称'),
            DTColumnBuilder.newColumn('td3').withTitle('所属角色'),
            DTColumnBuilder.newColumn('td4').withTitle('成交价格（金钻）'),
            DTColumnBuilder.newColumn('td5').withTitle('卖出时间').withOption('width', '160px'),
            DTColumnBuilder.newColumn('td7').withTitle('购买角色')
        ];
        tradeRecodeTableInstance.vm = vm;
        angular.element($window).bind('resize', function () {
            tradeRecodeTableInstance.vm.dtInstance.dataTable.fnAdjustColumnSizing();
        });
    }
);
angular.module('app').controller('auctionStateTableCtrl', function ($scope, $compile, DTOptionsBuilder,
                                                          DTColumnBuilder, auctionStateTableInstance) {
        /**
         * 表格设定
         */
        var vm = this;
        vm.dtInstance = {};
        vm.closeAuc = closeAucRow;
        vm.openAuc = openAucRow;
        vm.operateDatas = {};
        vm.dtOptions = DTOptionsBuilder.fromSource('datajson/auctionCompanyState.json')
            .withDOM("<'row'<'pull-right m-t-r'f>r><'row' t><'row'<'col-xs-3'l><'col-xs-2'><'col-xs-7'p>>")
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
            }).withOption('autoWidth', false).withOption('createdRow', createdRow);
        vm.dtColumns = [
            DTColumnBuilder.newColumn(null).withTitle('')
                .notSortable()
                .withClass('select-checkbox backimgnone')
                .renderWith(function () {
                    return '';
                }).withOption('width', '10px'),
            DTColumnBuilder.newColumn('id').withTitle('id').withOption('width', '30px'),
            DTColumnBuilder.newColumn('td1').withTitle('服务器'),
            DTColumnBuilder.newColumn('td2').withTitle('拍卖行是否开启'),
            DTColumnBuilder.newColumn(null).withTitle('操作').notSortable().
                renderWith(actionsHtml).withOption('width', '235px')
        ];
        /*最后一列操作 start*/
        function closeAucRow(operateDatas, thisobj) {//关闭拍卖行
            $("#" + thisobj).addClass("one-dele-active");
            $scope.$emit('closeAucOne', {"operateDatas": operateDatas, "thisobj": thisobj});
        }
        function openAucRow(operateDatas, thisobj) {//打开拍卖行
            $("#" + thisobj).addClass("one-copy-active");
            $scope.$emit('openAucOne', {"operateDatas": operateDatas, "thisobj": thisobj});
        }
        function createdRow(row, data, dataIndex) {
            $compile(angular.element(row).contents())($scope);
        }

        function actionsHtml(data, type, full, meta) {
            vm.operateDatas[data.id] = data;
            return '<button type="button" class="btn btn-yellow padding-2-12" id="cloauction' + data.id + '" ng-click="showCase.closeAuc(showCase.operateDatas[' + data.id + '],\'cloauction' + data.id + '\')">' +
                '<i class="fa fa-toggle-off"></i> 关闭拍卖行' +
                '</button>&nbsp;' +
                '<button type="button" class="btn purple-btn-table padding-2-12" id="openauction' + data.id + '" ng-click="showCase.openAuc(showCase.operateDatas[' + data.id + '],\'openauction' + data.id + '\')">' +
                '<i class="fa fa-toggle-on"></i> 开启拍卖行' +
                '</button>';
        }

        /*最后一列操作 end*/
        auctionStateTableInstance.vm = vm;
    }
);
module.exports = {
    url: '/auctionCompany',
    views: {
        'content': {
            template: __inline('./auctionCompany.html')
        }
    }
};

