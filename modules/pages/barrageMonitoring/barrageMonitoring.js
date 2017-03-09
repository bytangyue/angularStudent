/**   description 等级分布
 *   author tangyue
 *   date 2015/11/12
 */
var _format = require('data/dataFormat');
angular.module("app").factory('barrTableInstance', function () {
    return {};
}).controller("barrageCtrl",
    function ($rootScope, $scope, $timeout, $cookieStore, barrTableInstance, $http) {
        $rootScope.breadCNavigation = "弹幕监控";
        $scope.setOverallTitle="提示：此处操作，服务器为全局使用。";
        /*清空服务器、渠道、平台数据*/
        $scope.emptypopdata();
        $timeout(function () {
            utils.initTip();//等tip标签生成了再去初始化hover提示框
        }, 50);
        $scope.checkmonTableAll=function(ischeck){// 全选/取消
            _format.setCheckboxAll(ischeck,barrTableInstance.vm.dtInstance.DataTable);
        }
        $scope.deleteSelected = function () {//批量删除
            var selecteData = _format.checkSelectedData(barrTableInstance.vm.dtInstance, $scope);
            _format.deleteOption($scope, selecteData.length,"dele");
            $scope.deleDeleData = selecteData;//选中数据
        }
        $scope.$on('barrageMonitoringDeleteOne', function (d, eventData) {//table删除操作
            _format.deleteOption($scope,"one","dele");
            _format.deleteActiveClass(eventData.thisobj);
            $scope.deleDeleData = eventData.operateDatas;//选中数据
        });
        $scope.$on('barrageMonitoringStopOne', function (d, eventData) {//table禁言玩家操作
            $scope.modalparams = {
                "title": "请选择封禁时间",
                "btnText1": "取消",
                "btnText2": "应用",
                "showEle": "other"
            };
            _format.deleteActiveClass(eventData.thisobj);
            $scope.stopData=eventData.operateDatas;
        });
        $scope.modalConfirm = function () {//模态窗口确认按钮操作
            if ($scope.modalparams.showEle=="dele") {//删除接口
                console.log('该对接delete接口了', "选中的数据：", $scope.deleDeleData);
            }else{
                console.log('该对接禁言玩家接口了', "选中的数据：", $scope.stopData);
            }
            //barrTableInstance.vm.dtInstance.reloadData();//重新加载数据
        }

    });
angular.module('app').controller('barragetableCtrl', function ($scope, $window, $compile, DTOptionsBuilder,
                                                            DTColumnBuilder, barrTableInstance) {
        /**
         * 表格设定
         */
        var vm = this;
        vm.stopPlayer = stopPlayerRow;
        vm.delete = deleteRow;
        vm.dtInstance = {};
        vm.operateDatas = {};
        vm.dtOptions = DTOptionsBuilder.fromSource('datajson/barrageMonitoring.json')
            .withDOM("<'row'<'pull-right de-m m-r-160'f>r><'row' t><'row'<'col-xs-3'l><'col-xs-2'><'col-xs-7'p>>")
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
            DTColumnBuilder.newColumn('td2').withTitle('剧情ID'),
            DTColumnBuilder.newColumn('td3').withTitle('角色名'),
            DTColumnBuilder.newColumn('td4').withTitle('唯一键').withOption('width', '80px'),
            DTColumnBuilder.newColumn('td5').withTitle('内容').renderWith(function (data, type, full, meta) {
                return _format.cutString(data,16);
            }),
            DTColumnBuilder.newColumn('td6').withTitle('是否提审').withOption('width', '80px'),
            DTColumnBuilder.newColumn(null).withTitle('操作').notSortable()
                .renderWith(actionsHtml).withOption('width', '200px')
        ];
        /*最后一列操作 start*/
        function deleteRow(operateDatas, thisobj) {//删除
            $("#" + thisobj).addClass("one-dele-active");
            $scope.$emit('barrageMonitoringDeleteOne', {"operateDatas": operateDatas, "thisobj": thisobj});
        }
        function stopPlayerRow(operateDatas, thisobj) {//禁言玩家
            $("#" + thisobj).addClass("one-copy-active");
            $scope.$emit('barrageMonitoringStopOne', {"operateDatas": operateDatas, "thisobj": thisobj});
        }
        function createdRow(row, data, dataIndex) {
            $compile(angular.element(row).contents())($scope);
        }

        function actionsHtml(data, type, full, meta) {
            vm.operateDatas[data.id] = data;
            return '<button type="button" class="btn btn-yellow padding-2-12" id="dele' + data.id + '" ng-click="showCase.delete(showCase.operateDatas[' + data.id + '],\'dele' + data.id + '\')">' +
                '<i class="fa fa-trash-o"></i> 删除' +
                '</button>&nbsp;' +
                '<button type="button" class="btn purple-btn-table padding-2-12" id="stop' + data.id + '" ng-click="showCase.stopPlayer(showCase.operateDatas[' + data.id + '],\'stop' + data.id + '\')">' +
                '<i class="fa fa-ban"></i> 禁言玩家' +
                '</button>';
        }

        /*最后一列操作 end*/
        barrTableInstance.vm = vm;
        angular.element($window).bind('resize', function () {
            barrTableInstance.vm.dtInstance.dataTable.fnAdjustColumnSizing();
        });
    }
);
module.exports = {
    url: '/barrageMonitoring',
    views: {
        'content': {
            template: __inline('./barrageMonitoring.html')
        }
    }
};

