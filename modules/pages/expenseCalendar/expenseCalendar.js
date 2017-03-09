/**   description 等级分布
 *   author tangyue
 *   date 2015/11/12
 */
var _format = require('data/dataFormat');
angular.module("app").factory('expTableInstance', function () {
    return {};
}).controller("expenseCtrl",
    function ($rootScope, $scope, $timeout, $cookieStore, expTableInstance, $http) {
        $rootScope.breadCNavigation = "玩家消费记录";
        $scope.setOverallTitle="提示：此处操作，服务器为全局使用；2、*号为必填项，其余为非必填项。";
        /*清空服务器、渠道、平台数据*/
        $scope.emptypopdata();
        /*时间组件配置*/
        $scope.querydate={"dateclass":"qudate","isvalid":true};
        $timeout(function () {
            utils.initTip();//等tip标签生成了再去初始化hover提示框
        }, 50);
        /*查询确定操作*/
        $scope.queryexpense = function () {
            var isqueryServer = _format.checkServerData($scope.showServerData, $scope);
            if (isqueryServer) {//选择了服务器值
                $scope.querypop.ispopshow = false;
                console.log('query');
            } else {
                $scope.querypop.ispopshow = true;
            }
        }


    });
angular.module('app').controller('expensetableCtrl', function ($scope, $window, $compile, DTOptionsBuilder,
                                                            DTColumnBuilder, expTableInstance) {
        /**
         * 表格设定
         */
        var vm = this;
        vm.dtInstance={};
        vm.dtOptions = DTOptionsBuilder.fromSource('datajson/expenseCalendar.json')
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
            DTColumnBuilder.newColumn('td1').withTitle('消费时间').withOption('width', '160px'),
            DTColumnBuilder.newColumn('td2').withTitle('消费金额'),
            DTColumnBuilder.newColumn('td3').withTitle('消费模块'),
            DTColumnBuilder.newColumn('td4').withTitle('操作日志'),
        ];
        expTableInstance.vm = vm;
        angular.element($window).bind('resize', function () {
            expTableInstance.vm.dtInstance.dataTable.fnAdjustColumnSizing();
        });
    }
);
module.exports = {
    url: '/expenseCalendar',
    views: {
        'content': {
            template: __inline('./expenseCalendar.html')
        }
    }
};

