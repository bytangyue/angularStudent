/**   description 角色冻结
 *   author tangyue
 *   date 2015/11/12
 */
var _format = require('data/dataFormat');
angular.module("app").factory('roleFreezeTableInstance', function () {
	return {};
}).controller("roleFreezeCtrl",
	function ($rootScope, $scope, $timeout, $cookieStore, roleFreezeTableInstance, $http) {
		$rootScope.breadCNavigation = "角色冻结";
		$scope.setOverallTitle = "提示：此处操作，服务器为全局使用。";
        /*清空服务器、渠道、平台数据*/
        $scope.emptypopdata();
        /*时间组件配置*/
        $scope.adddate={"dateclass":"addate","isvalid":true};
        $timeout(function () {
            utils.initTip();//等tip标签生成了再去初始化hover提示框
        }, 50);
        $scope.checkrofreeTableAll=function(ischeck){// 全选/取消
            _format.setCheckboxAll(ischeck,roleFreezeTableInstance.vm.dtInstance.DataTable);
        }
        $scope.deleteSelected = function () {//批量删除
            var selecteData = _format.checkSelectedData(roleFreezeTableInstance.vm.dtInstance, $scope);
            _format.deleteOption($scope, selecteData.length,"dele");
            $scope.deleDeleData = selecteData;//选中数据
        }
        $scope.$on('roleFreezeDeleteOne', function (d, eventData) {//table删除操作
            _format.deleteOption($scope, "one","dele");
            _format.deleteActiveClass(eventData.thisobj);
            $scope.deleDeleData = eventData.operateDatas;//选中数据
        });
        $scope.modalConfirm = function () {//模态窗口确认按钮操作
            if ($scope.modalparams.showEle=="dele") {//删除接口
                console.log('该对接delete接口了', "选中的数据：", $scope.deleDeleData);
            }
            //roleFreezeTableInstance.vm.dtInstance.reloadData();//重新加载数据
        }
        /*新增确定操作*/
        $scope.addrolefreeze=function () {
            var isaddServer = _format.checkServerData($scope.showServerData, $scope);
            if (isaddServer) {//选择了服务器值
                $scope.addpop.ispopshow = false;
            } else {
                $scope.addpop.ispopshow = true;
            }
        }

	});

angular.module('app').controller('roleFreezeTableCtrl', function ($scope,$compile, DTOptionsBuilder,
																  DTColumnBuilder, roleFreezeTableInstance, $window) {
		/**
		 * 表格设定
		 */
		var vm = this;
		vm.delete = deleteRow;
		vm.dtInstance = {};
		vm.operateDatas = {};
		vm.dtOptions = DTOptionsBuilder.fromSource('datajson/roleFreeze.json')
			.withDOM("<'row'<'pull-right de-m'f>r><'row' t><'row'<'col-xs-3'l><'col-xs-2'><'col-xs-7'p>>")
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
			DTColumnBuilder.newColumn('id').withTitle('id').withOption('width', '20px'),
			DTColumnBuilder.newColumn('td1').withTitle('服务器'),
			DTColumnBuilder.newColumn('td2').withTitle('角色名称'),
			DTColumnBuilder.newColumn('td3').withTitle('冻结结束时间').withOption('width', '180px'),
			DTColumnBuilder.newColumn(null).withTitle('操作').notSortable()
				.renderWith(actionsHtml).withOption('width', '80px')
		];
		/*最后一列操作 start*/
		function deleteRow(operateDatas, thisobj) {//删除
			$("#" + thisobj).addClass("one-dele-active");
			$scope.$emit('roleFreezeDeleteOne', {"operateDatas": operateDatas, "thisobj": thisobj});
		}

		function createdRow(row, data, dataIndex) {
			$compile(angular.element(row).contents())($scope);
		}

		function actionsHtml(data, type, full, meta) {
			return _format.apendDeleteHtml(vm.operateDatas, data);
		}

		/*最后一列操作 end*/
		roleFreezeTableInstance.vm = vm;

		angular.element($window).bind('resize', function () {
			roleFreezeTableInstance.vm.dtInstance.dataTable.fnAdjustColumnSizing();
		});
	}
);
module.exports = {
	url: '/roleFreeze',
	views: {
		'content': {
			template: __inline('./roleFreeze.html')
		}
	}
};

