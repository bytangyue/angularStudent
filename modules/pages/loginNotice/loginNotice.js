/**   description
 *   author luxiaoling
 *   date 2015/11/19
 */
var _format = require('data/dataFormat');
angular.module("app").factory('serverNoticeTableInstance', function () {
	return {};
}).factory('timeLoginTableInstance', function () {
	return {};
}).controller("loginNoticeCtrl",
	function ($rootScope, $scope, $timeout, $cookieStore, $window, serverNoticeTableInstance, timeLoginTableInstance, $http) {
		$rootScope.breadCNavigation = "登录通知";
		$scope.setOverallTitle = "提示：此处操作，服务器为全局使用。";
		/*清空服务器、渠道、平台数据*/
		$scope.emptypopdata();
		/*时间组件配置*/
		$scope.querytidate = {"dateclass": "qutimedate", "isvalid": true};
		$scope.queryserdate = {"dateclass": "quserdate", "isvalid": true};
		$scope.adddate = {"dateclass": "addate", "isvalid": true};
		$scope.copydate = {"dateclass": "codate", "isvalid": true};
		$timeout(function () {
			utils.initTip();//等tip标签生成了再去初始化hover提示框
		}, 50);
		$scope.checktimeTableAll = function (ischeck) {//定时登录公告全选/取消
			_format.setCheckboxAll(ischeck, timeLoginTableInstance.vm.dtInstance.DataTable);
		}
		$scope.checkserverTableAll = function (ischeck) {//服务器公告全选/取消
			_format.setCheckboxAll(ischeck, serverNoticeTableInstance.vm.dtInstance.DataTable);
		}
		$scope.serverdeteSelected = function () {//服务器公告批量删除
			$scope.serverDele = true;
			var selecteData = _format.checkSelectedData(serverNoticeTableInstance.vm.dtInstance, $scope);
			_format.deleteOption($scope, selecteData.length, "dele");
			$scope.deleDeleData = selecteData;//选中数据
		}
		$scope.$on('serverDeleteOne', function (d, eventData) {//服务器公告table删除操作
			$scope.serverDele = true;
			_format.deleteOption($scope, "one", "dele");
			_format.deleteActiveClass(eventData.thisobj);
			$scope.deleDeleData = eventData.operateDatas;//选中数据
		});
		$scope.timeLogindeteSelected = function () {//定时登录公告批量删除
			$scope.serverDele = false;
			var selecteData = _format.checkSelectedData(timeLoginTableInstance.vm.dtInstance, $scope);
			_format.deleteOption($scope, selecteData.length, "dele");
			$scope.deleDeleData = selecteData;//选中数据
		}

		$scope.$on('timeLoginDeleteOne', function (d, eventData) {//定时登录公告table删除操作
			$scope.serverDele = false;
			_format.deleteOption($scope, "one", "dele");
			_format.deleteActiveClass(eventData.thisobj);
			$scope.deleDeleData = eventData.operateDatas;//选中数据
		});
		$scope.$on('timeLoginCopyOne', function (d, eventData) {//定时登录公告table复制操作
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
		$scope.$on('loginNoQueryOne', function (d, eventData) {//table查看操作
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
				if ($scope.serverDele) {
					console.log('该对接服务器delete接口了', "选中的数据：", $scope.deleDeleData);
					//serverNoticeTableInstance.vm.dtInstance.reloadData();//重新加载数据
				} else {
					console.log('该对接定时公告delete接口了', "选中的数据：", $scope.deleDeleData);
					//timeLoginTableInstance.vm.dtInstance.reloadData();//重新加载数据
				}
			} else {//复制接口
				var dateValue = _format.checkdate($scope, $scope.copydate);
				if (dateValue.length > 0) {
					console.log('该对接定时公告复制接口了');
				}
				//timeLoginTableInstance.vm.dtInstance.reloadData();//重新加载数据
			}
		}
		/*定时登录公告列表查询确定操作*/
		$scope.querytime = function () {
			var dateValue = _format.checkdate($scope, $scope.querytidate);
			if (dateValue.length > 0) {
				$scope.querypop.ispopshow = false;
				console.log('query');
			}
		}
		/*服务器公告列表查询确定操作*/
		$scope.queryserver = function () {
			var dateValue = _format.checkdate($scope, $scope.queryserdate);
			if (dateValue.length > 0) {
				$scope.querypoptwo.ispopshow = false;
				console.log('query');
			}
		}
		/*定时登录公告列表新增确定操作*/
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
		$scope.resettable = function () {
			$timeout(function () {
				timeLoginTableInstance.vm.dtInstance.dataTable.fnAdjustColumnSizing();
			}, 10);
			$timeout(function () {
				serverNoticeTableInstance.vm.dtInstance.dataTable.fnAdjustColumnSizing();
			}, 10);
		}
	});
angular.module('app').controller('timeLoginTableCtrl', function ($scope, $rootScope, $compile, $timeout, DTOptionsBuilder,
																	DTColumnBuilder, timeLoginTableInstance,$window) {
		/**
		 * 表格设定,定时登录公告列表
		 */
		var vm = this;
		vm.delete = deleteRow;
		vm.dtInstance = {};
		vm.operateDatas = {};
		vm.dtOptions = DTOptionsBuilder.fromSource('datajson/loginNoticeOntime.json')
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
			DTColumnBuilder.newColumn('td2').withTitle('公告名称'),
			DTColumnBuilder.newColumn('td3').withTitle('生效时间').withOption('width', '160px'),
			DTColumnBuilder.newColumn('td4').withTitle('失效时间').withOption('width', '160px'),
			DTColumnBuilder.newColumn('td5').withTitle('内容').renderWith(function (data, type, full, meta) {
				return _format.cutString(data, 16);
			}),
			DTColumnBuilder.newColumn(null).withTitle('操作').notSortable()
				.renderWith(actionsHtml).withOption('width', '80px')
		];
		/*最后一列操作 start*/
		function deleteRow(operateDatas, thisobj) {//删除
			$("#" + thisobj).addClass("one-dele-active");
			$scope.$emit('serverDeleteOne', {"operateDatas": operateDatas, "thisobj": thisobj});
		}

		function createdRow(row, data, dataIndex) {
			$compile(angular.element(row).contents())($scope);
		}

		function actionsHtml(data, type, full, meta) {
			return _format.apendDeleteHtml(vm.operateDatas, data);
		}

		/*最后一列操作 end*/
		timeLoginTableInstance.vm = vm;
		angular.element($window).bind('resize', function () {
			timeLoginTableInstance.vm.dtInstance.dataTable.fnAdjustColumnSizing();
		});
	}
);
angular.module('app').controller('serverNoticeTableCtrl', function ($scope, $rootScope, $compile, $timeout, DTOptionsBuilder,
																 DTColumnBuilder,serverNoticeTableInstance,$window) {
		/**
		 * 表格设定，服务器公告列表
		 */
		var vm = this;
		vm.delete = deleteRow;
		vm.copy = copyRow;
		vm.query = queryRow;
		vm.dtInstance = {};
		vm.operateDatas = {};
		vm.dtOptions = DTOptionsBuilder.fromSource('datajson/loginNoticeServer.json')
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
			DTColumnBuilder.newColumn('id').withTitle('id').withOption('width', '20px'),
			DTColumnBuilder.newColumn('td1').withTitle('服务器'),
			DTColumnBuilder.newColumn('td2').withOption('width', '160px').withTitle('结束时间'),
			DTColumnBuilder.newColumn('td3').withTitle('内容').renderWith(function (data, type, full, meta) {
				return _format.cutString(data, 16);
			}),
			DTColumnBuilder.newColumn(null).withTitle('操作').notSortable()
				.renderWith(actionsHtml).withOption('width', '240px')
		];

		/*最后一列操作 start*/
		function deleteRow(operateDatas, thisobj) {//删除
			$("#" + thisobj).addClass("one-dele-active");
			$scope.$emit('timeLoginDeleteOne', {"operateDatas": operateDatas, "thisobj": thisobj});
		}

		function copyRow(operateDatas, thisobj) {//复制
			$("#" + thisobj).addClass("one-copy-active");
			$scope.$emit('timeLoginCopyOne', {"operateDatas": operateDatas, "thisobj": thisobj});
		}

		function queryRow(operateDatas, thisobj) {//查看
			$("#" + thisobj).addClass("one-copy-active");
			$scope.$emit('loginNoQueryOne', {"operateDatas": operateDatas, "thisobj": thisobj});
		}

		function createdRow(row, data, dataIndex) {
			$compile(angular.element(row).contents())($scope);
		}

		function actionsHtml(data, type, full, meta) {
			return _format.apendHtml(vm.operateDatas, data);
		}

		/*最后一列操作 end*/
		serverNoticeTableInstance.vm = vm;

		angular.element($window).bind('resize', function () {
			serverNoticeTableInstance.vm.dtInstance.dataTable.fnAdjustColumnSizing();
		});
	}
);
module.exports = {
	url: '/loginNotice',
	views: {
		'content': {
			template: __inline('./loginNotice.html')
		}
	}
};

