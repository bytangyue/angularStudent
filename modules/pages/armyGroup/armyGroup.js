/**   description 角色
 *   author tangyue
 *   date 2015/11/25
 */
var _format = require('data/dataFormat');
angular.module("app").factory('armyTableInstance', function () {
    return {};
}).factory('membersOTATableInstance', function () {//社团成员列表
    return {};
}).factory('armyLogTableInstance', function () {//日志
    return {};
}).factory('armyGraduateTableInstance', function () {//研究所
    return {};
}).controller("armyCtrl",
    function ($rootScope, $scope, $timeout, armyTableInstance, membersOTATableInstance, armyLogTableInstance,armyGraduateTableInstance,$http) {
        $rootScope.breadCNavigation = "军团";
        $scope.setOverallTitle="提示：1、此处操作，服务器为全局使用；2、点击社团列表的表格行显示社团相关信息。";
        /*清空服务器、渠道、平台数据*/
        $scope.emptypopdata();
        $timeout(utils.initTip, 50);//等tip标签生成了再去初始化
        /*社团列表查询*/
        $scope.queryarmyGroup=function(){
            console.log('query');
        }

        //$timeout(function(){
        //    $scope.isshowBottomTable=true;
        //},10);
        $timeout(function(){
            var armyTable= armyTableInstance.vm.dtInstance.DataTable;
            //var membTable=membersOTATableInstance.vm.dtInstance.DataTable;
            //var logTable=armyLogTableInstance.vm.dtInstance.DataTable;
            //var graTable=armyGraduateTableInstance.vm.dtInstance.DataTable;
            $scope.isshowBottomTable=false;
            armyTable.on('select', function ( e, dt, type, indexes ) {
                var armyData = armyTable.rows( indexes ).data().toArray();
                console.log(type,armyData);//对选中社团一行的接口
                $scope.memberName=armyData[0].td2;
                 $scope.isshowBottomTable=true;
                $scope.resettablehead();
                $scope.$apply();
            }).on( 'deselect', function ( e, dt, type, indexes ) {
                $scope.isshowBottomTable=false;
                $scope.$apply();
            });
        },50);
        $scope.resettable=function(){
            $timeout(function(){
                membersOTATableInstance.vm.dtInstance.dataTable.fnAdjustColumnSizing();
            },10);
            $timeout(function(){
                armyLogTableInstance.vm.dtInstance.dataTable.fnAdjustColumnSizing();
            },10);
            $timeout(function(){
                armyGraduateTableInstance.vm.dtInstance.dataTable.fnAdjustColumnSizing();
            },10);
        }
    });

angular.module('app').controller('armyTableCtrl', function (DTOptionsBuilder,
                                                            DTColumnBuilder,$window, armyTableInstance) {
        /**
         * 表格设定,社团列表
         */
        var vm = this;
        vm.dtInstance = {};
        vm.dtOptions = DTOptionsBuilder.fromSource('datajson/armyGroup.json')
            .withDOM("<'row'<'pull-right m-t-28 margin-right-20'f>r><'row' t><'row'<'col-xs-3'l><'col-xs-2'><'col-xs-7'p>>")
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
                style: 'single',
                selector: 'tr'
            }).withOption('autoWidth', false).withOption('scrollX', true);
        vm.dtColumns = [
            DTColumnBuilder.newColumn('id').withTitle('id').withOption('width', '30px'),
            DTColumnBuilder.newColumn('td2').withTitle('社团名称'),
            DTColumnBuilder.newColumn('td3').withTitle('团长'),
            DTColumnBuilder.newColumn('td4').withTitle('排名'),
            DTColumnBuilder.newColumn('td5').withTitle('社团贡献'),
            DTColumnBuilder.newColumn('td6').withTitle('社团钻石'),
            DTColumnBuilder.newColumn('td7').withTitle('星级'),
            DTColumnBuilder.newColumn('td8').withTitle('社团等级'),
            DTColumnBuilder.newColumn('td9').withTitle('成员数'),
            DTColumnBuilder.newColumn('td10').withTitle('战力'),
            DTColumnBuilder.newColumn('td11').withTitle('阵营'),
            DTColumnBuilder.newColumn('td12').withTitle('社团公告'),
            DTColumnBuilder.newColumn('td13').withTitle('研究点数'),
            DTColumnBuilder.newColumn('td14').withTitle('研究所等级')
        ];
        armyTableInstance.vm = vm;
        angular.element($window).bind('resize', function () {
            armyTableInstance.vm.dtInstance.dataTable.fnAdjustColumnSizing();
        });
    }
);
angular.module('app').controller('membersOTATableCtrl', function (DTOptionsBuilder,
                                                            DTColumnBuilder, membersOTATableInstance,$window) {
        /**
         * 表格设定,社团成员列表
         */
        var vm = this;
        vm.dtInstance = {};
        vm.dtOptions = DTOptionsBuilder.fromSource('datajson/membersOTA.json')
            .withDOM("<'row'<'pull-right m-t-28 margin-right-20'f>r><'row' t><'row'<'col-xs-3'l><'col-xs-2'><'col-xs-7'p>>")
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
            DTColumnBuilder.newColumn('name').withTitle('成员名称'),
            DTColumnBuilder.newColumn('club_zhiwei').withTitle('成员职位'),
            DTColumnBuilder.newColumn('club_pgongxian').withTitle('成员总贡献')
        ];
        membersOTATableInstance.vm = vm;
        angular.element($window).bind('resize', function () {
            membersOTATableInstance.vm.dtInstance.dataTable.fnAdjustColumnSizing();
        });
    }
);
angular.module('app').controller('armyLogTableCtrl', function (DTOptionsBuilder,
                                                            DTColumnBuilder, armyLogTableInstance,$window) {
        /**
         * 表格设定,日志列表
         */
        var vm = this;
        vm.dtInstance = {};
        vm.dtOptions = DTOptionsBuilder.fromSource('datajson/armyLog.json')
            .withDOM("<'row'<'pull-right m-t-28 margin-right-20'f>r><'row' t><'row'<'col-xs-3'l><'col-xs-2'><'col-xs-7'p>>")
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
            DTColumnBuilder.newColumn('td0').withTitle('id').withOption('width', '30px'),
            DTColumnBuilder.newColumn('td1').withTitle('事件'),
            DTColumnBuilder.newColumn('td2').withTitle('时间').withOption('width', '160px')
        ];
        armyLogTableInstance.vm = vm;
        angular.element($window).bind('resize', function () {
            armyLogTableInstance.vm.dtInstance.dataTable.fnAdjustColumnSizing();
        });
    }
);
angular.module('app').controller('armyGraduateTableCtrl', function (DTOptionsBuilder,
                                                            DTColumnBuilder, armyGraduateTableInstance,$window) {
        /**
         * 表格设定,研究所列表
         */
        var vm = this;
        vm.dtInstance = {};
        vm.dtOptions = DTOptionsBuilder.fromSource('datajson/armyGraduate.json')
            .withDOM("<'row'<'pull-right m-t-28 margin-right-20'f>r><'row' t><'row'<'col-xs-3'l><'col-xs-2'><'col-xs-7'p>>")
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
            DTColumnBuilder.newColumn('id').withTitle('id'),
            DTColumnBuilder.newColumn('club_res_scroll_name').withTitle('卷轴'),
            DTColumnBuilder.newColumn('club_res_scroll_lvl').withTitle('卷轴等级'),
            DTColumnBuilder.newColumn('club_res_scroll_next_exp').withTitle('下一级卷轴升级所需点数')
        ];
        armyGraduateTableInstance.vm = vm;
        angular.element($window).bind('resize', function () {
            armyGraduateTableInstance.vm.dtInstance.dataTable.fnAdjustColumnSizing();
        });
    }
);
module.exports = {
    url: '/armyGroup',
    views: {
        'content': {
            template: __inline('./armyGroup.html')
        }
    }
};

