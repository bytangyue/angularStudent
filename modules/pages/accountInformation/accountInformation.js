/**   description 等级分布
 *   author tangyue
 *   date 2015/11/12
 */
var _format = require('data/dataFormat');
angular.module("app").factory('accTableInstance', function () {
    return {};
}).controller("accountCtrl",
    function ($rootScope, $scope, $timeout, $cookieStore, accTableInstance, $http) {
        $rootScope.breadCNavigation = "账号信息";
        $scope.setOverallTitle="提示：1、此处操作，服务器为全局使用；2、*号为必填项，其余为非必填项。";
        /*清空服务器、渠道、平台数据*/
        $scope.emptypopdata();
        /*时间组件配置*/
        $scope.querydate={"dateclass":"qudate","isvalid":true};
        $timeout(function () {
            utils.initTip();//等tip标签生成了再去初始化hover提示框
        }, 50);
        /*查询确定操作*/
        $scope.queryaccount = function () {
            var isqueryServer = _format.checkServerData($scope.showServerData, $scope);
            if (isqueryServer) {//选择了服务器值
                $scope.querypop.ispopshow = false;
                console.log('query');
            } else {
                $scope.querypop.ispopshow = true;
            }
        }

    });
angular.module('app').controller('accounttableCtrl', function ($scope, $compile, DTOptionsBuilder,
                                                          DTColumnBuilder, accTableInstance,$window) {
        /**
         * 表格设定
         */
        var vm = this;
        vm.dtInstance={};
        vm.dtOptions = DTOptionsBuilder.fromSource('datajson/accountInformation.json')
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
            DTColumnBuilder.newColumn('td1').withTitle('所属区服'),
            DTColumnBuilder.newColumn('td2').withTitle('渠道信息'),
            DTColumnBuilder.newColumn('td3').withTitle('游戏账号主键'),
            DTColumnBuilder.newColumn('td4').withTitle('账号ID'),
            DTColumnBuilder.newColumn('td5').withTitle('角色名称'),
            DTColumnBuilder.newColumn('td6').withTitle('等级'),
            DTColumnBuilder.newColumn('td7').withTitle('创建时间').withOption('width', '160px'),
            DTColumnBuilder.newColumn('td8').withTitle('成长基金进度'),
            DTColumnBuilder.newColumn('td9').withTitle('最后一次登录时间').withOption('width', '160px'),
            DTColumnBuilder.newColumn('td10').withTitle('最后一次下线时间').withOption('width', '160px')
        ];
        accTableInstance.vm = vm;
        angular.element($window).bind('resize', function () {
            accTableInstance.vm.dtInstance.dataTable.fnAdjustColumnSizing();
        });
    }
);
module.exports = {
    url: '/accountInformation',
    views: {
        'content': {
            template: __inline('./accountInformation.html')
        }
    }
};

