/**   description 角色
 *   author tangyue
 *   date 2015/11/25
 */
var _format = require('data/dataFormat');
angular.module("app").factory('roleTableInstance', function () {
	return {};
}).factory('roleParterTableInstance', function () {
	return {};
}).factory('gemTableInstance', function () {
	return {};
}).factory('sceneTableInstance', function () {
	return {};
}).factory('equipTableInstance', function () {
	return {};
}).factory('treasureTableInstance', function () {
	return {};
}).factory('ornamentTableInstance', function () {
	return {};
}).factory('OrbTableInstance', function () {
	return {};
}).factory('cassetteTableInstance', function () {
	return {};
}).factory('petInstance', function () {
	return {};
}).factory('mailTableInstance', function () {
	return {};
}).factory('welfareTableInstance', function () {
	return {};
}).factory('getWelfareTableInstance', function () {
	return {};
}).controller("roleCtrl",
	function ($rootScope, $scope, $timeout, $window, $cookieStore, roleTableInstance,
			  roleParterTableInstance, gemTableInstance, sceneTableInstance,
			  equipTableInstance, treasureTableInstance, ornamentTableInstance, OrbTableInstance,
			  cassetteTableInstance, petInstance, mailTableInstance, welfareTableInstance,
			  getWelfareTableInstance, $http) {
		$rootScope.breadCNavigation = "角色";
		/*清空服务器、渠道、平台数据*/
		$scope.emptypopdata();
		angular.element($window).bind('resize', function () {
			roleTableInstance.vm.dtInstance.reloadData();
			roleParterTableInstance.vm.dtInstance.reloadData();
		});
		$scope.setOverallTitle = "提示：此处操作，服务器和角色名称均为全局使用。";
		$scope.$on('toggleSidebar', function () {//广播导航收缩事件重新加载table
			roleTableInstance.vm.dtInstance.reloadData();
			roleParterTableInstance.vm.dtInstance.reloadData();
		});
		var vm = this;
		$timeout(utils.initTip, 50);//等tip标签生成了再去初始化
		$scope.$on('roleMailQueryOne', function (d, eventData) {//邮件查看->详情查看操作
			$scope.modalparams = {
				"title": "邮件详情",
				"btnText1": "关闭",
				"btnText2": "",
				"showEle": "other"
			};
			_format.deleteActiveClass(eventData.thisobj);
			console.log(eventData.operateDatas);//查看数据
		});
		/*设置按钮弹框的参数配置*/
		$scope.querynotice = function () {
			console.log('query');
		}
		$scope.queryLevelDis = function (level) {
			var array = [];
			//日期双选时查询取值
			var dateText = angular.element("#date-text").text().split("~");
			if (moment(dateText[0]).isAfter(dateText[1])) {
				alert('开始时间不能大于结束时间');
				return;
			}
			//根据接口需求，结束时间为ui上获得的时间基础上加上1天@王海权
			var paEData = moment(dateText[1].trim()).add(1, 'days').format("YYYY-MM-DD") + '_00:00:00';
			array.push("start_time_stamp=" + dateText[1].trim() + '_00:00:00');//根据业务需求这里取结束时间@王海权
			array.push("end_time_stamp=" + paEData);
			array.push("device_act_start_time_stamp=" + dateText[0].trim() + '_00:00:00');
			array.push("device_act_end_time_stamp=" + paEData);
			for (var key in level) {
				array.push(key + "=" + level[key].trim());
			}
			var param = array.join("&");
			/*将查询按钮在点击之后切换样式*/
			$scope.isGoQuery = true;
			$scope.levelForm.$invalid = true;
		}
		$scope.$on('filterCheckEvent', function (d, eventData) {
			if (eventData.filId == 'server') {
				$scope.showServerData = eventData.data;
				$scope.sName = eventData.filName + "：";
			} else if (eventData.filId == 'agent') {
				$scope.showAgentdData = eventData.data;
				$scope.aName = eventData.filName + "：";
			}
		});
		//$scope.resettable = function () {
		//	$timeout(function () {
		//		roleTableInstance.vm.dtInstance.reloadData();//重新加载数据
		//	}, 10);
		//}
	});
angular.module('app').controller('roleTableCtrl', function (DTOptionsBuilder,
															DTColumnBuilder, roleTableInstance, $window) {
		/**
		 * 表格设定,角色基本信息
		 */
		var vm = this;
		vm.dtInstance = {};
		vm.dtOptions = DTOptionsBuilder.fromSource('datajson/roleBasicinformation.json')
			.withDOM("<'row' t>")
			.withBootstrap()
			.withLanguage({
				"sEmptyTable": "暂无数据",
				"sLoadingRecords": "加载中...",
				"sProcessing": "正在玩命处理...",
				"sZeroRecords": "暂无记录！"
			}).withOption('autoWidth', false).withOption('scrollX', true);
		vm.dtColumns = [
			DTColumnBuilder.newColumn('td1').withTitle('角色名称'),
			DTColumnBuilder.newColumn('td2').withTitle('高级经验卡'),
			DTColumnBuilder.newColumn('td3').withTitle('顶级经验卡'),
			DTColumnBuilder.newColumn('td4').withTitle('阵营'),
			DTColumnBuilder.newColumn('td5').withTitle('队伍经验百分比'),
			DTColumnBuilder.newColumn('td6').withTitle('队伍等级'),
			DTColumnBuilder.newColumn('td7').withTitle('钻石'),
			DTColumnBuilder.newColumn('td8').withTitle('金钻'),
			DTColumnBuilder.newColumn('td9').withTitle('金币'),
			DTColumnBuilder.newColumn('td10').withTitle('神级经验卡'),
			DTColumnBuilder.newColumn('td11').withTitle('渠道'),
			DTColumnBuilder.newColumn('td12').withTitle('普通经验卡'),
			DTColumnBuilder.newColumn('td13').withTitle('当前体力'),
			DTColumnBuilder.newColumn('td14').withTitle('vip')
		];
		roleTableInstance.vm = vm;
		angular.element($window).bind('resize', function () {
			roleTableInstance.vm.dtInstance.dataTable.fnAdjustColumnSizing();
		});
	}
);
angular.module('app').controller('roleParterTableCtrl', function ($timeout, DTOptionsBuilder,
																  DTColumnBuilder, roleParterTableInstance, $window) {
		/**
		 * 表格设定,角色伙伴信息
		 */
		var vm = this;
		vm.dtInstance = {};
		vm.dtOptions = DTOptionsBuilder.fromSource('datajson/rolePartnerinformation.json')
			.withDOM("<'row'<'pull-right margin-right-20 'f>r><'row' t><'row'<'col-xs-3'l><'col-xs-2'><'col-xs-7'p>>")
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
			}).withOption('autoWidth', false).withOption('responsive', true);
		vm.dtColumns = [
			DTColumnBuilder.newColumn('td1').withTitle('伙伴名称'),
			DTColumnBuilder.newColumn('td2').withTitle('队伍等级').withOption('width','60px'),
			DTColumnBuilder.newColumn('td3').withTitle('阵营'),
			DTColumnBuilder.newColumn('td4').withTitle('职业').withOption('width','30px'),
			DTColumnBuilder.newColumn('td5').withTitle('类型'),
			DTColumnBuilder.newColumn('td6').withTitle('等级').withOption('width','30px'),
			DTColumnBuilder.newColumn('td7').withTitle('经验'),
			DTColumnBuilder.newColumn('td8').withTitle('品阶').withOption('width','30px'),
			DTColumnBuilder.newColumn('td9').withTitle('战力'),
			DTColumnBuilder.newColumn('td10').withTitle('是否上阵').withClass('none'),
			DTColumnBuilder.newColumn('td11').withTitle('生命值').withClass('none'),
			DTColumnBuilder.newColumn('td12').withTitle('物理攻击').withClass('none'),
			DTColumnBuilder.newColumn('td13').withTitle('物理防御').withClass('none'),
			DTColumnBuilder.newColumn('td14').withTitle('魔法攻击').withClass('none'),
			DTColumnBuilder.newColumn('td15').withTitle('魔法防御').withClass('none'),
			DTColumnBuilder.newColumn('td16').withTitle('速度').withClass('none'),
			DTColumnBuilder.newColumn('td17').withTitle('力量').withClass('none'),
			DTColumnBuilder.newColumn('td18').withTitle('智力').withClass('none'),
			DTColumnBuilder.newColumn('td19').withTitle('敏捷').withClass('none'),
			DTColumnBuilder.newColumn('td20').withTitle('体质').withClass('none'),
			DTColumnBuilder.newColumn('td21').withTitle('暴击率').withClass('none'),
			DTColumnBuilder.newColumn('td22').withTitle('抗暴率').withClass('none'),
			DTColumnBuilder.newColumn('td23').withTitle('反击率').withClass('none'),
			DTColumnBuilder.newColumn('td24').withTitle('防反率').withClass('none'),
			DTColumnBuilder.newColumn('td25').withTitle('免伤率').withClass('none'),
			DTColumnBuilder.newColumn('td26').withTitle('初始士气').withClass('none'),
			DTColumnBuilder.newColumn('td27').withTitle('霸气伤害').withClass('none'),
			DTColumnBuilder.newColumn('td28').withTitle('物理穿透').withClass('none'),
			DTColumnBuilder.newColumn('td29').withTitle('物理抗性').withClass('none'),
			DTColumnBuilder.newColumn('td30').withTitle('魔法穿透').withClass('none'),
			DTColumnBuilder.newColumn('td31').withTitle('魔法抗性').withClass('none'),
			DTColumnBuilder.newColumn('td32').withTitle('力量成长').withClass('none'),
			DTColumnBuilder.newColumn('td33').withTitle('智力成长').withClass('none'),
			DTColumnBuilder.newColumn('td34').withTitle('敏捷成长').withClass('none'),
			DTColumnBuilder.newColumn('td35').withTitle('体质成长').withClass('none'),
			DTColumnBuilder.newColumn('td36').withTitle('风属性攻击').withClass('none'),
			DTColumnBuilder.newColumn('td37').withTitle('火属性攻击').withClass('none'),
			DTColumnBuilder.newColumn('td38').withTitle('冰属性攻击').withClass('none'),
			DTColumnBuilder.newColumn('td39').withTitle('雷属性攻击').withClass('none'),
			DTColumnBuilder.newColumn('td40').withTitle('元素抗性').withClass('none')
		];
		roleParterTableInstance.vm = vm;
	}
);
angular.module('app').controller('gemTableTableCtrl', function (DTOptionsBuilder,
																DTColumnBuilder, gemTableInstance) {
		/**
		 * 表格设定，宝石信息
		 */
		var vm = this;
		vm.dtInstance = {};
		vm.dtOptions = DTOptionsBuilder.fromSource('datajson/rolePackGeminformation.json')
			.withDOM("<'row'<'pull-right margin-right-20 white-div'f>r><'row' t><'row'<'col-xs-3'l><'col-xs-2'><'col-xs-7'p>>")
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
			}).withOption('autoWidth', false);
		vm.dtColumns = [
			DTColumnBuilder.newColumn('td1').withTitle('名称'),
			DTColumnBuilder.newColumn('td2').withTitle('数量'),
			DTColumnBuilder.newColumn('td3').withTitle('SID'),
			DTColumnBuilder.newColumn('td4').withTitle('品质').withOption('width', '30px'),
			DTColumnBuilder.newColumn('td5').withTitle('宝石使用者'),
			DTColumnBuilder.newColumn('td6').withTitle('是否唯一').withOption('width', '60px')
		];
		gemTableInstance.vm = vm;
	}
);
angular.module('app').controller('sceneTableCtrl', function (DTOptionsBuilder,
															 DTColumnBuilder, sceneTableInstance) {
		/**
		 * 表格设定，道具信息
		 */
		var vm = this;
		vm.dtInstance = {};
		vm.dtOptions = DTOptionsBuilder.fromSource('datajson/rolePackPropinformation.json')
			.withDOM("<'row'<'pull-right margin-right-20 white-div'f>r><'row' t><'row'<'col-xs-3'l><'col-xs-2'><'col-xs-7'p>>")
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
			}).withOption('autoWidth', false);
		vm.dtColumns = [
			DTColumnBuilder.newColumn('td1').withTitle('名称'),
			DTColumnBuilder.newColumn('td2').withTitle('数量'),
			DTColumnBuilder.newColumn('td3').withTitle('SID'),
			DTColumnBuilder.newColumn('td4').withTitle('品质').withOption('width', '30px'),
			DTColumnBuilder.newColumn('td5').withTitle('是否唯一').withOption('width', '60px')
		];
		sceneTableInstance.vm = vm;
	}
);
angular.module('app').controller('equipTableCtrl', function (DTOptionsBuilder,
															 DTColumnBuilder, equipTableInstance) {
		/**
		 * 表格设定,装备信息
		 */
		var vm = this;
		vm.dtInstance = {};
		vm.dtOptions = DTOptionsBuilder.fromSource('datajson/rolePackEquipinformation.json')
			.withDOM("<'row'<'pull-right margin-right-20 white-div'f>r><'row' t><'row'<'col-xs-3'l><'col-xs-2'><'col-xs-7'p>>")
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
			}).withOption('autoWidth', false);
		vm.dtColumns = [
			DTColumnBuilder.newColumn('td1').withTitle('名称'),
			DTColumnBuilder.newColumn('td2').withTitle('UID'),
			DTColumnBuilder.newColumn('td3').withTitle('SID'),
			DTColumnBuilder.newColumn('td4').withTitle('是否唯一').withOption('width', '60px'),
			DTColumnBuilder.newColumn('td5').withTitle('宝物基本属性名'),
			DTColumnBuilder.newColumn('td6').withTitle('宝物基本属性值'),
			DTColumnBuilder.newColumn('td7').withTitle('宝物附加属性值'),
			DTColumnBuilder.newColumn('td8').withTitle('品质').withOption('width', '30px'),
			DTColumnBuilder.newColumn('td9').withTitle('装备使用')

		];
		equipTableInstance.vm = vm;
	}
);
angular.module('app').controller('treasureTableCtrl', function (DTOptionsBuilder,
																DTColumnBuilder, treasureTableInstance) {
		/**
		 * 表格设定，宝物信息
		 */
		var vm = this;
		vm.dtInstance = {};
		vm.dtOptions = DTOptionsBuilder.fromSource('datajson/rolePackTreasureinformation.json')
			.withDOM("<'row'<'pull-right margin-right-20 white-div'f>r><'row' t><'row'<'col-xs-3'l><'col-xs-2'><'col-xs-7'p>>")
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
			}).withOption('autoWidth', false);
		vm.dtColumns = [
			DTColumnBuilder.newColumn('td1').withTitle('名称'),
			DTColumnBuilder.newColumn('td2').withTitle('UID'),
			DTColumnBuilder.newColumn('td3').withTitle('SID'),
			DTColumnBuilder.newColumn('td4').withTitle('品质'),
			DTColumnBuilder.newColumn('td5').withTitle('宝物使用者'),
			DTColumnBuilder.newColumn('td6').withTitle('宝物基本属性名'),
			DTColumnBuilder.newColumn('td7').withTitle('宝物基本属性值'),
			DTColumnBuilder.newColumn('td8').withTitle('宝物附加属性值'),
			DTColumnBuilder.newColumn('td9').withTitle('宝物星级'),
			DTColumnBuilder.newColumn('td10').withTitle('是否唯一').withOption('width', '60px')

		];
		treasureTableInstance.vm = vm;
	}
);
angular.module('app').controller('ornamentTableCtrl', function (DTOptionsBuilder,
																DTColumnBuilder, ornamentTableInstance) {
		/**
		 * 表格设定,饰品信息
		 */
		var vm = this;
		vm.dtInstance = {};
		vm.dtOptions = DTOptionsBuilder.fromSource('datajson/rolePackOrnamentinformation.json')
			.withDOM("<'row'<'pull-right margin-right-20 white-div'f>r><'row' t><'row'<'col-xs-3'l><'col-xs-2'><'col-xs-7'p>>")
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
			}).withOption('autoWidth', false);
		vm.dtColumns = [
			DTColumnBuilder.newColumn('td1').withTitle('名称'),
			DTColumnBuilder.newColumn('td2').withTitle('UID'),
			DTColumnBuilder.newColumn('td3').withTitle('SID'),
			DTColumnBuilder.newColumn('td4').withTitle('品质').withOption('width', '30px'),
			DTColumnBuilder.newColumn('td5').withTitle('饰品使用者'),
			DTColumnBuilder.newColumn('td6').withTitle('是否唯一').withOption('width', '60px'),
			DTColumnBuilder.newColumn('td7').withTitle('宝物基本属性名'),
			DTColumnBuilder.newColumn('td8').withTitle('宝物基本属性值'),
			DTColumnBuilder.newColumn('td9').withTitle('宝物附加属性值')
		];
		ornamentTableInstance.vm = vm;
	}
);
angular.module('app').controller('cassetteTableCtrl', function (DTOptionsBuilder,
																DTColumnBuilder, cassetteTableInstance) {
		/**
		 * 表格设定，卡带信息
		 */
		var vm = this;
		vm.dtInstance = {};
		vm.dtOptions = DTOptionsBuilder.fromSource('datajson/rolePackCassetteinformation.json')
			.withDOM("<'row'<'pull-right margin-right-20 white-div'f>r><'row' t><'row'<'col-xs-3'l><'col-xs-2'><'col-xs-7'p>>")
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
			}).withOption('autoWidth', false);
		vm.dtColumns = [
			DTColumnBuilder.newColumn('td1').withTitle('名称'),
			DTColumnBuilder.newColumn('td2').withTitle('UID'),
			DTColumnBuilder.newColumn('td3').withTitle('SID'),
			DTColumnBuilder.newColumn('td4').withTitle('品质').withOption('width', '30px'),
			DTColumnBuilder.newColumn('td5').withTitle('卡带等级'),
			DTColumnBuilder.newColumn('td6').withTitle('卡带使用者'),
			DTColumnBuilder.newColumn('td7').withTitle('是否唯一').withOption('width', '60px'),
			DTColumnBuilder.newColumn('td8').withTitle('主属性名'),
			DTColumnBuilder.newColumn('td9').withTitle('主属性值'),
			DTColumnBuilder.newColumn('td10').withTitle('附加属性值'),
			DTColumnBuilder.newColumn('td11').withTitle('卡带基础经验')
		];
		cassetteTableInstance.vm = vm;
	}
);
angular.module('app').controller('petTableCtrl', function (DTOptionsBuilder,
														   DTColumnBuilder, petInstance) {
		/**
		 * 表格设定，宠物信息
		 */
		var vm = this;
		vm.dtInstance = {};
		vm.dtOptions = DTOptionsBuilder.fromSource('datajson/rolePackPetinformation.json')
			.withDOM("<'row'<'pull-right margin-right-20 white-div'f>r><'row' t><'row'<'col-xs-3'l><'col-xs-2'><'col-xs-7'p>>")
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
			}).withOption('autoWidth', false);
		vm.dtColumns = [
			DTColumnBuilder.newColumn('td1').withTitle('名称'),
			DTColumnBuilder.newColumn('td2').withTitle('UID'),
			DTColumnBuilder.newColumn('td3').withTitle('SID'),
			DTColumnBuilder.newColumn('td4').withTitle('品质').withOption('width', '30px'),
			DTColumnBuilder.newColumn('td5').withTitle('是否唯一').withOption('width', '60px'),
			DTColumnBuilder.newColumn('td6').withTitle('宠物等级')
		];
		petInstance.vm = vm;
	}
);
angular.module('app').controller('mailTableCtrl', function ($scope, $rootScope, $compile, DTOptionsBuilder,
															DTColumnBuilder, mailTableInstance) {
		/**
		 * 表格设定，邮件查看
		 */
		var vm = this;
		vm.query = queryRow;
		vm.operateDatas = {};
		vm.dtInstance = {};
		vm.dtOptions = DTOptionsBuilder.fromSource('datajson/roleMailcheck.json')
			.withDOM("<'row'<'pull-right margin-right-20 'f>r><'row' t><'row'<'col-xs-3'l><'col-xs-2'><'col-xs-7'p>>")
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
			}).withOption('autoWidth', false).withOption('createdRow', createdRow);
		vm.dtColumns = [
			DTColumnBuilder.newColumn('td1').withTitle('发送者').renderWith(function (data, type, full, meta) {
				return _format.cutString(data, 6);
			}),
			DTColumnBuilder.newColumn('td2').withTitle('邮件标题').renderWith(function (data, type, full, meta) {
				return _format.cutString(data, 10);
			}),
			DTColumnBuilder.newColumn('td3').withTitle('是否领取奖励').withOption('width', '100px'),
			DTColumnBuilder.newColumn('td4').withTitle('状态').withOption('width', '60px'),
			DTColumnBuilder.newColumn('td5').withTitle('时间').withOption('width', '160px'),
			DTColumnBuilder.newColumn(null).withTitle('操作').notSortable()
				.renderWith(actionsHtml).withOption('width', '80px')
		];
		/*最后一列操作 start*/
		function queryRow(operateDatas, thisobj) {//查看
			$("#" + thisobj).addClass("one-copy-active");
			$scope.$emit('roleMailQueryOne', {"operateDatas": operateDatas, "thisobj": thisobj});
		}

		function createdRow(row, data, dataIndex) {
			$compile(angular.element(row).contents())($scope);
		}

		function actionsHtml(data, type, full, meta) {
			return _format.apendQueryHtml(vm.operateDatas, data);
		}

		/*最后一列操作 end*/
		mailTableInstance.vm = vm;
	}
);
angular.module('app').controller('welfareTableCtrl', function (DTOptionsBuilder,
															   DTColumnBuilder, welfareTableInstance) {
		/**
		 * 表格设定，福利信息
		 */
		var vm = this;
		vm.dtInstance = {};
		vm.dtOptions = DTOptionsBuilder.fromSource('datajson/roleWelfareinformation.json')
			.withDOM("<'row'<'pull-right margin-right-20'f>r><'row' t><'row'<'col-xs-3'l><'col-xs-2'><'col-xs-7'p>>")
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
			}).withOption('autoWidth', false);
		vm.dtColumns = [
			DTColumnBuilder.newColumn('td1').withTitle('福利类型'),
			DTColumnBuilder.newColumn('td2').withTitle('购买时间').withOption('width', '160px'),
			DTColumnBuilder.newColumn('td3').withTitle('有效期'),
			DTColumnBuilder.newColumn('td4').withTitle('上次领取时间').withOption('width', '160px')
		];

		welfareTableInstance.vm = vm;
	}
);
angular.module('app').controller('getWelfareTableCtrl', function (DTOptionsBuilder,
																  DTColumnBuilder, getWelfareTableInstance) {
		/**
		 * 表格设定，福利领取记录
		 */
		var vm = this;
		vm.dtInstance = {};
		vm.dtOptions = DTOptionsBuilder.fromSource('datajson/roleWelfareget.json')
			.withDOM("<'row'<'pull-right margin-right-20'f>r><'row' t><'row'<'col-xs-3'l><'col-xs-2'><'col-xs-7'p>>")
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
			}).withOption('autoWidth', false);
		vm.dtColumns = [
			DTColumnBuilder.newColumn('td1').withTitle('领取时间').withOption('width', '160px'),
			DTColumnBuilder.newColumn('td2').withTitle('福利类型'),
			DTColumnBuilder.newColumn('td3').withTitle('福利来源'),
			DTColumnBuilder.newColumn('td4').withTitle('日志记录')
		];
		getWelfareTableInstance.vm = vm;
	}
);
module.exports = {
	url: '/role',
	views: {
		'content': {
			template: __inline('./role.html')
		}
	}
};

