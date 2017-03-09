/**   description 敏感词过滤
 *   author tangyue
 *   date 2015/11/12
 */
var _format = require('data/dataFormat');
angular.module("app").factory('sensTableInstance', function () {
    return {};
}).controller("sensitiveCtrl",
    function ($rootScope, $scope, $timeout, $cookieStore, sensTableInstance, $http) {
        $rootScope.breadCNavigation = "敏感词过滤";
        $scope.setOverallTitle="提示：此处操作，服务器为全局使用；2、*号为必填项，其余为非必填项。";
        /*清空服务器、渠道、平台数据*/
        $scope.emptypopdata();
        $timeout(function () {
            utils.initTip();//等tip标签生成了再去初始化hover提示框
        },50);
        $scope.checksensitiveTableAll=function(ischeck){// 全选/取消
            _format.setCheckboxAll(ischeck,sensTableInstance.vm.dtInstance.DataTable);
        }
        $scope.deleteSelected = function () {//批量删除
            var selecteData = _format.checkSelectedData(sensTableInstance.vm.dtInstance, $scope);
            _format.deleteOption($scope, selecteData.length,"dele");
            $scope.deleDeleData = selecteData;//选中数据
        }
        $scope.$on('sensitiveFiltrationDeleteOne', function (d, eventData) {//table删除操作
            _format.deleteOption($scope, "one","dele");
            _format.deleteActiveClass(eventData.thisobj);
            $scope.deleDeleData = eventData.operateDatas;//选中数据
        });
        $scope.modalConfirm = function () {//模态窗口确认按钮操作
            if ($scope.modalparams.showEle=="dele") {//删除接口
                console.log('该对接delete接口了', "选中的数据：", $scope.deleDeleData);
            }
            //sensTableInstance.vm.dtInstance.reloadData();//重新加载数据
        }
        /*新增确定操作*/
        $scope.addsensitivef = function () {
            var isqueryServer = _format.checkServerData($scope.showServerData, $scope);
            if (isqueryServer) {//选择了服务器值
                $scope.querypop.ispopshow = false;
                console.log('query');
            } else {
                $scope.querypop.ispopshow = true;
            }
        }

    });
angular.module('app').controller('sensitivetableCtrl', function ($scope, $window, $compile, DTOptionsBuilder,
                                                           DTColumnBuilder, sensTableInstance) {
        /**
         * 表格设定
         */
        var vm = this;
        vm.delete = deleteRow;
        vm.dtInstance = {};
        vm.operateDatas = {};
        vm.dtOptions = DTOptionsBuilder.fromSource('datajson/sensitiveFiltration.json')
            .withDOM("<'row'<'pull-right de-m m-r-sen'f>r><'row' t><'row'<'col-xs-3'l><'col-xs-2'><'col-xs-7'p>>")
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
            DTColumnBuilder.newColumn('td1').withTitle('敏感词'),
            DTColumnBuilder.newColumn('td2').withTitle('状态').withOption('width', '60px'),
            DTColumnBuilder.newColumn(null).withTitle('操作').notSortable()
                .renderWith(actionsHtml).withOption('width', '80px')
        ];
        /*最后一列操作 start*/
        function deleteRow(operateDatas, thisobj) {//删除
            $("#" + thisobj).addClass("one-dele-active");
            $scope.$emit('sensitiveFiltrationDeleteOne', {"operateDatas": operateDatas, "thisobj": thisobj});
        }

        function createdRow(row, data, dataIndex) {
            $compile(angular.element(row).contents())($scope);
        }

        function actionsHtml(data, type, full, meta) {
            return _format.apendDeleteHtml(vm.operateDatas, data);
        }

        /*最后一列操作 end*/
        sensTableInstance.vm = vm;
    }
);
module.exports = {
    url: '/sensitiveFiltration',
    views: {
        'content': {
            template: __inline('./sensitiveFiltration.html')
        }
    }
};

