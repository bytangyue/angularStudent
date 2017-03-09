/**   description
 *   author luxiaoling
 *   date 2015/11/19
 */
var _format = require('data/dataFormat');
angular.module("app").factory('activityTableInstance', function () {//精彩活动列表
	return {};
}).factory('levelSetTableInstance', function () {//档次列表
	return {};
}).factory('awardTableInstance', function () {//奖励列表
	return {};
}).controller("activityCtrl",
	function ($rootScope, $scope, $timeout, $cookieStore, $window, activityTableInstance, levelSetTableInstance, awardTableInstance, $http) {
		$rootScope.breadCNavigation = "活动";
		$scope.setOverallTitle = "提示：此处操作，服务器、渠道和平台均为全局使用。";
		/*清空服务器、渠道、平台数据*/
		$scope.emptypopdata();
		/*时间组件配置*/
		$scope.adddate = {"dateclass": "addate", "isvalid": true};
		$timeout(function () {
			utils.initTip();//等tip标签生成了再去初始化hover提示框
		}, 1000);
		$scope.checkactivityTableAll = function (ischeck) {// 全选/取消
			_format.setCheckboxAll(ischeck, activityTableInstance.vm.dtInstance.DataTable);
		}
		angular.element($window).bind('resize', function () {
			activityTableInstance.vm.dtInstance.reloadData();
		});
		$scope.$on('toggleSidebar', function () {//广播导航收缩事件重新加载table
			activityTableInstance.vm.dtInstance.reloadData();
		});
		$scope.deleteSelected = function () {//批量删除
			var selecteData = _format.checkSelectedData(activityTableInstance.vm.dtInstance, $scope);
			_format.deleteOption($scope, selecteData.length, "dele");
			$scope.deleDeleData = selecteData;//选中数据
		}
		$scope.$on('activityDeleteOne', function (d, eventData) {//table删除操作
			_format.deleteOption($scope, "one", "dele");
			_format.deleteActiveClass(eventData.thisobj);
			$scope.deleDeleData = eventData.operateDatas;//选中数据
		});

		$scope.$on('delelevelsetdeleOne', function (d, eventData) {//档次列表table删除操作
			_format.deleteOption($scope, "one", "dele");
			_format.deleteActiveClass(eventData.thisobj);
			$scope.deleDeleData = eventData.operateDatas;//选中数据
		});
		$scope.$on('deleAwarddeleOne', function (d, eventData) {//奖励列表table删除操作
			_format.deleteOption($scope, "one", "dele");
			_format.deleteActiveClass(eventData.thisobj);
			$scope.deleDeleData = eventData.operateDatas;//选中数据
		});
		$scope.$on('addAwardOne', function (d, eventData) {//档次设置table添加奖励操作
			$scope.isaddraward = true;
			$scope.isQuery = false;
			$scope.isLevelSet = false;
			$scope.modalparams = {
				"title": "添加奖励设置",
				"btnText1": "取消",
				"btnText2": "添加奖励",
				"showEle": "other"
			};
			_format.deleteActiveClass(eventData.thisobj);
			console.log(eventData.operateDatas);//档次行数据数据
		});
		$scope.$on("queryRowAwardList", function (d, eventData) {//档次列表table奖励列表操作
			$(".awardclass").each(function () {
				$(this).removeClass('one-copy-active');
			});
			$("#" + eventData.thisobj).addClass("one-copy-active");
			console.log("选中档次行的数据:", eventData.operateDatas);
			//ajax查询奖励列表...请求成功后显示奖励列表表格
			$scope.isshowawardtable = true;//是否显示奖励列表
		});
		$scope.$on('activityQueryOne', function (d, eventData) {//table查看操作
			$scope.isQuery = true;
			$scope.isLevelSet = false;
			$scope.isaddraward = false;
			$scope.modalparams = {
				"title": "查看设置",
				"btnText1": "关闭",
				"btnText2": "",
				"showEle": "other"
			};
			_format.deleteActiveClass(eventData.thisobj);
			console.log(eventData.operateDatas);//查看数据
		});
		$scope.addActivity = {};
		/*档次设置*/
		$scope.levelSet = function () {
			$scope.isLevelSet = true;
			$scope.isQuery = false;
			$scope.isaddraward = false;
			if ($scope.addActivity.type == "1") {//激活码类
				$scope.levelsetdata = [];
			} else {
				$http.get("./levelsetrule.json").success(function (data) {
					$scope.levelsetdata = data;
					$scope.ruleModal = data[0].id;
				});
			}
			$scope.modalparams = {
				"title": "新增精彩活动规则",
				"btnText1": "关闭",
				"btnText2": "保存规则",
				"showEle": "other"
			};
			utils.showModal();
		}
		$scope.modalConfirm = function () {//模态窗口确认按钮操作
			if ($scope.modalparams.showEle == "dele") {//删除接口
				console.log('该对接delete接口了', "选中的数据：", $scope.deleDeleData);
			} else if ($scope.modalparams.showEle == "other") {
				if ($scope.isLevelSet) {
					console.log('该对接档次设置接口了');
				}
				if ($scope.isaddraward) {
					console.log('该对接添加奖励接口了');
				}
			}
			//activityTableInstance.vm.dtInstance.reloadData();//重新加载数据
		}
		/*查询确定操作*/
		$scope.queryactivity = function () {
			var serverLen = $scope.serverfil.conData.length;
			if (serverLen <= 0) {//没有选择服务器值，默认全部服务器【传:server】
				$scope.serverfil.conData = "server";
			}
			console.log($scope.serverfil.conData);
			//ajax......
		}
		/*新增确定操作*/
		$scope.addactivity = function () {
			var isaddServer = _format.checkServerData($scope.showServerData, $scope);
			if (isaddServer) {//选择了服务器值
				$scope.addpop.ispopshow = false;
			} else {
				$scope.addpop.ispopshow = true;
			}
		}


	});
angular.module('app').controller('activityTableCtrl', function ($scope, $compile, $rootScope, DTOptionsBuilder,
																DTColumnBuilder, activityTableInstance) {
		/**
		 * 表格设定，精彩活动列表
		 */
		var vm = this;
		vm.query = queryRow;
		vm.delete = deleteRow;
		vm.dtInstance = {};
		vm.operateDatas = {};
		vm.dtOptions = DTOptionsBuilder.fromSource('datajson/activity.json')
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
				.renderWith(function (data, type, full, meta) {
					return '';
				}).withOption('width', '10px'),
			DTColumnBuilder.newColumn('id').withTitle('id').withOption('width', '20px'),,
			DTColumnBuilder.newColumn('td1').withTitle('服务器'),
			DTColumnBuilder.newColumn('td2').withTitle('渠道'),
			DTColumnBuilder.newColumn('td3').withTitle('活动名称').renderWith(function (data, type, full, meta) {
				return _format.cutString(data, 16);
			}),
			DTColumnBuilder.newColumn('td4').withTitle('活动内容').renderWith(function (data, type, full, meta) {
				return _format.cutString(data, 16);
			}),
			DTColumnBuilder.newColumn('td5').withTitle('小标题'),
			//DTColumnBuilder.newColumn('td6').withTitle('图标ID'),
			//DTColumnBuilder.newColumn('td7').withTitle('背景ID'),
			//DTColumnBuilder.newColumn('td8').withTitle('排序ID'),
			DTColumnBuilder.newColumn('td9').withTitle('开始时间').withOption('width', '160px'),
			DTColumnBuilder.newColumn('td10').withTitle('结束时间').withOption('width', '160px'),
			//DTColumnBuilder.newColumn('td11').withTitle('是否特殊链接'),
			//DTColumnBuilder.newColumn('td12').withTitle('链接'),
			//DTColumnBuilder.newColumn('td13').withTitle('是否重复开启'),
			//DTColumnBuilder.newColumn('td14').withTitle('重复开启次数'),
			//DTColumnBuilder.newColumn('td15').withTitle('重复开启间隔天数'),
			DTColumnBuilder.newColumn(null).withTitle('操作').notSortable()
				.renderWith(actionsHtml).withOption('width', '180px'),
		];
		/*最后一列操作 start*/
		function deleteRow(operateDatas, thisobj) {//删除
			$("#" + thisobj).addClass("one-dele-active");
			$scope.$emit('activityDeleteOne', {"operateDatas": operateDatas, "thisobj": thisobj});
		}

		function queryRow(operateDatas, thisobj) {//查看
			$("#" + thisobj).addClass("one-copy-active");
			$scope.$emit('activityQueryOne', {"operateDatas": operateDatas, "thisobj": thisobj});
		}

		function createdRow(row, data, dataIndex) {
			$compile(angular.element(row).contents())($scope);
		}

		function actionsHtml(data, type, full, meta) {
			return _format.apenddeAQuHtml(vm.operateDatas, data);
		}

		/*最后一列操作 end*/
		activityTableInstance.vm = vm;
	}
);
angular.module('app').controller('levelSetTableCtrl', function ($scope, $rootScope, $compile, $timeout, DTOptionsBuilder,
																DTColumnBuilder, levelSetTableInstance, $window) {
		/**
		 * 表格设定,档案列表
		 */
		var vm = this;
		vm.addAward = addAwardRow;
		vm.delete = deleteRow;
		vm.queryAwardList = queryThisAwardList;
		vm.dtInstance = {};
		vm.operateDatas = {};
		vm.dtOptions = DTOptionsBuilder.fromSource('datajson/levelset.json')
			.withDOM("<'row' t>")
			.withBootstrap()
			.withLanguage({
				"sEmptyTable": "暂无数据",
				"sLoadingRecords": "加载中...",
				"sProcessing": "正在玩命处理...",
				"sZeroRecords": "暂无记录！"
			}).withOption('autoWidth', false).withOption('createdRow', createdRow);
		vm.dtColumns = [
			DTColumnBuilder.newColumn('td0').withTitle('按钮'),
			DTColumnBuilder.newColumn('td1').withTitle('规则'),
			DTColumnBuilder.newColumn('td2').withTitle('档次说明').
			renderWith(function (data, type, full, meta) {
				return _format.cutString(data, 8);
			}),
			DTColumnBuilder.newColumn(null).withTitle('操作').notSortable()
				.renderWith(actionsHtml)
		];
		/*最后一列操作 start*/
		function deleteRow(operateDatas, thisobj) {//删除
			$("#" + thisobj).addClass("one-dele-active");
			$scope.$emit('delelevelsetdeleOne', {"operateDatas": operateDatas, "thisobj": thisobj});
		}

		function addAwardRow(operateDatas, thisobj) {//添加奖励
			$("#" + thisobj).addClass("one-copy-active");
			$scope.$emit('addAwardOne', {"operateDatas": operateDatas, "thisobj": thisobj});
		}

		function queryThisAwardList(operateDatas, thisobj) {//查看当前档次设置的奖励列表
			$scope.$emit('queryRowAwardList', {"operateDatas": operateDatas, "thisobj": thisobj});
		}

		function createdRow(row, data, dataIndex) {
			$compile(angular.element(row).contents())($scope);
		}

		function actionsHtml(data, type, full, meta) {
			vm.operateDatas[data.id] = data;
			return '<button type="button" class="btn btn-yellow padding-2-12" id="levelsetdele' + data.id + '" ng-click="showCase.delete(showCase.operateDatas[' + data.id + '],\'levelsetdele' + data.id + '\')">' +
				'<i class="fa fa-trash-o"></i> 删除' +
				'</button>&nbsp;' + '<button type="button" class="btn purple-btn-table padding-2-12" id="addaward' + data.id + '" ng-click="showCase.addAward(showCase.operateDatas[' + data.id + '],\'addaward' + data.id + '\')">' +
				'<i class="fa fa-plus-square"></i> 加奖励' +
				'</button>&nbsp;' + '<button type="button" class="btn purple-btn-table padding-2-12 awardclass" id="awardlist' + data.id + '" ng-click="showCase.queryAwardList(showCase.operateDatas[' + data.id + '],\'awardlist' + data.id + '\')">' +
				'<i class="fa fa-gift"></i> 奖励列表' +
				'</button>';
		}

		/*最后一列操作 end*/
		levelSetTableInstance.vm = vm;
		angular.element($window).bind('resize', function () {
			levelSetTableInstance.vm.dtInstance.dataTable.fnAdjustColumnSizing();
		});
	}
);
angular.module('app').controller('awardTableCtrl', function ($scope, $rootScope, $compile, $timeout, DTOptionsBuilder,
															 DTColumnBuilder, awardTableInstance, $window) {
		/**
		 * 表格设定,奖励列表
		 */
		var vm = this;
		vm.delete = deleteRow;
		vm.dtInstance = {};
		vm.operateDatas = {};
		vm.dtOptions = DTOptionsBuilder.fromSource('datajson/awardlist.json')
			.withDOM("<'row' t>")
			.withBootstrap()
			.withLanguage({
				"sEmptyTable": "暂无数据",
				"sLoadingRecords": "加载中...",
				"sProcessing": "正在玩命处理...",
				"sZeroRecords": "暂无记录！"
			}).withSelect({
				style: 'single',
				selector: 'tr'
			}).withOption('autoWidth', false).withOption('createdRow', createdRow);
		vm.dtColumns = [
			DTColumnBuilder.newColumn('td0').withTitle('奖励类型'),
			DTColumnBuilder.newColumn('td1').withTitle('SID'),
			DTColumnBuilder.newColumn('td2').withTitle('数量'),
			DTColumnBuilder.newColumn(null).withTitle('操作').notSortable()
				.renderWith(actionsHtml)

		];
		/*最后一列操作 start*/
		function deleteRow(operateDatas, thisobj) {//删除
			$("#" + thisobj).addClass("one-dele-active");
			$scope.$emit('deleAwarddeleOne', {"operateDatas": operateDatas, "thisobj": thisobj});
		}

		function createdRow(row, data, dataIndex) {
			$compile(angular.element(row).contents())($scope);
		}

		function actionsHtml(data, type, full, meta) {
			return _format.apendDeleteHtml(vm.operateDatas, data, "award");
		}

		/*最后一列操作 end*/
		awardTableInstance.vm = vm;
		angular.element($window).bind('resize', function () {
			awardTableInstance.vm.dtInstance.dataTable.fnAdjustColumnSizing();
		});
	}
);
module.exports = {
	url: '/activity',
	views: {
		'content': {
			template: __inline('./activity.html')
		}
	}
};

