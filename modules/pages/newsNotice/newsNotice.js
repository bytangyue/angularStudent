/**   description
 *   author luxiaoling
 *   date 2015/11/19
 */
var _format = require('data/dataFormat');
angular.module("app").factory('newsNoticeTableInstance', function () {
	return {};
}).controller("newsNoticeCtrl",
	function ($rootScope, $scope, $timeout, $window, $cookieStore, newsNoticeTableInstance, $http) {
		$rootScope.breadCNavigation = "新闻公告";
		$scope.setOverallTitle = "提示：1、此处操作，服务器、渠道和平台均为全局使用；2、*号为必填项，其余为非必填项。";
		/*清空服务器、渠道、平台数据*/
		$scope.emptypopdata();
		/*时间组件配置*/
		$scope.adddate = {"dateclass": "addate", "isvalid": true};
		$scope.copydate = {"dateclass": "codate", "isvalid": true};
		$timeout(function () {
			utils.initTip();//等tip标签生成了再去初始化hover提示框
		}, 50);
		$scope.checknewTableAll = function (ischeck) {// 全选/取消
			_format.setCheckboxAll(ischeck, newsNoticeTableInstance.vm.dtInstance.DataTable);
		}
		$scope.deleteSelected = function () {//批量删除
			var selecteData = _format.checkSelectedData(newsNoticeTableInstance.vm.dtInstance, $scope);
			_format.deleteOption($scope, selecteData.length, "dele");
			$scope.deleDeleData = selecteData;//选中数据
		}
		$rootScope.$on('newsDeleteOne', function (d, eventData) {//table删除操作
			_format.deleteOption($scope, "one", "dele");
			_format.deleteActiveClass(eventData.thisobj);
			$scope.deleDeleData = eventData.operateDatas;//选中数据
		});
		$scope.$on('newsCopyOne', function (d, eventData) {//table复制操作
			$scope.isCopy = true;
			$scope.modalparams = {
				"title": "复制设置",
				"btnText1": "取消",
				"btnText2": "添加",
				"showEle": "other"
			};
			_format.deleteActiveClass(eventData.thisobj);
			console.log(eventData.operateDatas);//复制数据
		});
		$scope.$on('newsNoQueryOne', function (d, eventData) {//table查看操作
			$scope.isCopy = false;
			$scope.modalparams = {
				"title": "查看设置",
				"btnText1": "关闭",
				"btnText2": "",
				"showEle": "other"
			};
			_format.deleteActiveClass(eventData.thisobj);
			console.log(eventData.operateDatas);//查看数据
		});
		$scope.modalConfirm = function () {//模态窗口确认按钮操作
			if ($scope.modalparams.showEle == "dele") {//删除接口
				console.log('该对接delete接口了', "选中的数据：", $scope.deleDeleData);
			} else {//复制接口
				var dateValue = _format.checkdate($scope, $scope.copydate);
				if (dateValue.length > 0) {
					console.log('该对接复制接口了');
				}
			}
			//newsNoticeTableInstance.vm.dtInstance.reloadData();//重新加载数据
		}
		/*新增确定操作*/
		$scope.addnotice = function () {
			var isaddServer = _format.checkServerData($scope.serverfil.conData, $scope);
			if (isaddServer) {//选择了服务器值
				var dateValue = _format.checkdate($scope, $scope.adddate);
				if (dateValue.length > 0) {
					$scope.addpop.ispopshow = false;
					console.log('query');
				}
			} else {
				$scope.addpop.ispopshow = true;
			}
		}

	});
angular.module('app').controller('newsNoticeTableCtrl', function ($scope, $rootScope, $compile, $timeout, DTOptionsBuilder,
																  DTColumnBuilder, newsNoticeTableInstance,$window) {
		/**
		 * 表格设定
		 */
		var vm = this;
		vm.copy = copyRow;
		vm.delete = deleteRow;
		vm.query = queryRow;
		vm.dtInstance = {};
		vm.operateDatas = {};
		vm.dtOptions = DTOptionsBuilder.fromSource('datajson/newsNotice.json')
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
			DTColumnBuilder.newColumn('td1').withTitle('服务器').withOption('width', '80px'),
			DTColumnBuilder.newColumn('td2').withTitle('渠道').withOption('width', '80px'),
			DTColumnBuilder.newColumn('td3').withTitle('公告名称'),
			DTColumnBuilder.newColumn('td4').withTitle('内容').renderWith(function (data, type, full, meta) {
				return _format.cutString(data, 16);
			}),
			DTColumnBuilder.newColumn('td5').withTitle('开始时间').withOption('width', '160px'),
			DTColumnBuilder.newColumn('td6').withTitle('结束时间').withOption('width', '160px'),
			DTColumnBuilder.newColumn('td7').withTitle('新闻链接'),
			DTColumnBuilder.newColumn('td8').withTitle('特殊链接').withOption('width', '60px'),
			DTColumnBuilder.newColumn(null).withTitle('操作').notSortable()
				.renderWith(actionsHtml).withOption('width', '240px')
		];

		/*最后一列操作 start*/
		function deleteRow(operateDatas, thisobj) {//删除
			$("#" + thisobj).addClass("one-dele-active");
			$scope.$emit('newsDeleteOne', {"operateDatas": operateDatas, "thisobj": thisobj});
		}

		function copyRow(operateDatas, thisobj) {//复制
			$("#" + thisobj).addClass("one-copy-active");
			$scope.$emit('newsCopyOne', {"operateDatas": operateDatas, "thisobj": thisobj});
		}

		function queryRow(operateDatas, thisobj) {//查看
			$("#" + thisobj).addClass("one-copy-active");
			$scope.$emit('newsNoQueryOne', {"operateDatas": operateDatas, "thisobj": thisobj});
		}

		function createdRow(row, data, dataIndex) {
			$compile(angular.element(row).contents())($scope);
		}

		function actionsHtml(data, type, full, meta) {
			return _format.apendHtml(vm.operateDatas, data);
		}

		/*最后一列操作 end*/
		newsNoticeTableInstance.vm = vm;

		angular.element($window).bind('resize', function () {
			newsNoticeTableInstance.vm.dtInstance.dataTable.fnAdjustColumnSizing();
		});
	}
);
module.exports = {
	url: '/newsNotice',
	views: {
		'content': {
			template: __inline('./newsNotice.html')
		}
	}
};

