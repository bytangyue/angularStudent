/**   description 等级分布
 *   author tangyue
 *   date 2015/11/12
 */
var _format = require('data/dataFormat');
angular.module("app").factory('mailTableInstance', function () {
	return {};
}).factory('acceTableInstance', function () {
	return {};
}).factory('oneAcceTableInstance', function () {
	return {};
}).controller("sendMailCtrl",
	function ($rootScope, $scope, $timeout, $cookieStore, mailTableInstance, acceTableInstance, $http) {
		$rootScope.breadCNavigation = "发送邮件";
		$scope.setOverallTitle = "提示：1、此处操作，服务器为全局使用；2、*号为必填项，其余为非必填项。";
		//保存附件按钮是否显示
		$scope.saveacce.showacce = true;
		$scope.isShowAccefun = function () {
			$scope.mainShowAccefun($scope);
		}
		/*清空服务器、渠道、平台数据*/
		$scope.emptypopdata();
		/*时间组件配置*/
		$scope.querydate = {"dateclass": "qudate", "isvalid": true};
		/*清空渠道数据*/
		$scope.emptyAgentData = function () {
			$scope.agentfil.conData = [];
			console.log($scope.sendgroup);
		}
		$timeout(function () {
			utils.initTip();//等tip标签生成了再去初始化hover提示框
		}, 50);
		$scope.checksmailTableAll = function (ischeck) {// 全选/取消
			_format.setCheckboxAll(ischeck, mailTableInstance.vm.dtInstance.DataTable);
		}
		$scope.deleteSelected = function () {//批量删除
			var selecteData = _format.checkSelectedData(mailTableInstance.vm.dtInstance, $scope);
			_format.deleteOption($scope, selecteData.length, "dele");
			$scope.deleDeleData = selecteData;//选中数据
		}
		$scope.$on('sendMailDeleteOne', function (d, eventData) {//table删除操作
			$scope.isacce = false;
			_format.deleteOption($scope, "one", "dele");
			_format.deleteActiveClass(eventData.thisobj);
			$scope.deleDeleData = eventData.operateDatas;//选中数据
		});
		$scope.$on('sendMailQueryOne',function(d, eventData){//table查看操作
			$scope.sendMailText='queryone';
			$scope.modalparams = {
				"title": "查看设置",
				"btnText1": "关闭",
				"btnText2": "",
				"showEle": "other"
			};
			_format.deleteActiveClass(eventData.thisobj);
		});
		$scope.$on('accelistDeleteOne', function (d, eventData) {//附件列表table删除操作
			$scope.isacce = true;
			_format.deleteOption($scope, "one", "dele");
			_format.deleteActiveClass(eventData.thisobj);
			$scope.deleDeleData = eventData.operateDatas;//选中数据
		});
		$scope.modalConfirm = function () {//模态窗口确认按钮操作
			if ($scope.modalparams.showEle == "dele") {//删除接口
				if ($scope.isacce) {
					console.log('该对接附件列表delete接口了', "选中的数据：", $scope.deleDeleData);
					//acceTableInstance.vm.dtInstance.reloadData();//重新加载数据
				} else {
					console.log('该对接定时邮件列表delete接口了', "选中的数据：", $scope.deleDeleData);
					//mailTableInstance.vm.dtInstance.reloadData();//重新加载数据
				}
			}
		}
		/*查询确定操作*/
		$scope.querysendmail = function () {
			var isqueryServer = _format.checkServerData($scope.showServerData, $scope);
			if (isqueryServer) {//选择了服务器值
				$scope.querypop.ispopshow = false;
				console.log('query');
			} else {
				$scope.querypop.ispopshow = true;
			}
		}
		/*添加附件*/
		$scope.addAcce = function () {
			$scope.mainAddAcce($scope);
		}
		/*添加网址*/
		$scope.addwebAddress = function () {
			$scope.mainAddwebAddress($scope);
		}
		/*定时发送设置*/
		$scope.sendOntime = function () {
			$scope.setTimeSend=!$scope.setTimeSend;
		}
		$scope.resettable = function () {
			$timeout(function () {
				mailTableInstance.vm.dtInstance.dataTable.fnAdjustColumnSizing();
			}, 10);
		}
		/*设置步骤激活样式*/
		$scope.stepObj={};
		$scope.stepObj.stepCurrent='editMail';
		$scope.stepObj.isEditMail=true;
		/*步骤上一步下一步*/
		$scope.setStepActive=function(){
			if($scope.stepObj.stepCurrent=='editMail'){
				$scope.stepObj.isAccessory=false;
				$scope.stepObj.isEditMail=true;
				$scope.stepObj.isSendMail=false;
			}
			if($scope.stepObj.stepCurrent=='accessory'){
				$scope.stepObj.isAccessory=true;
				$scope.stepObj.isEditMail=false;
				$scope.stepObj.isSendMail=false;
			}
			if($scope.stepObj.stepCurrent=='sendMail'){
				$scope.stepObj.isAccessory=false;
				$scope.stepObj.isEditMail=false;
				$scope.stepObj.isSendMail=true;
			}
			$('.step-item').each(function(){
				$(this).removeClass('active-prev');
			});
			$timeout(function(){
				var pre=$('.step-item.active').prev();
				if(pre){
					pre.addClass('active-prev');
				}
			},5);
		};
	});
angular.module('app').controller('timeMailCtrl', function ($scope, $rootScope, $compile, DTOptionsBuilder,
														   DTColumnBuilder, mailTableInstance, $window) {
		/**
		 * 表格设定,定时邮件列表
		 */
		var vm = this;
		vm.delete = deleteRow;
		vm.query = queryRow;
		vm.dtInstance = {};
		vm.operateDatas = {};
		vm.dtOptions = DTOptionsBuilder.fromSource('datajson/sendMailOntime.json')
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
			DTColumnBuilder.newColumn('td2').withTitle('名称'),
			DTColumnBuilder.newColumn('td3').withTitle('生效时间').withOption('width', '160px'),
			DTColumnBuilder.newColumn('td4').withTitle('失效时间').withOption('width', '160px'),
			DTColumnBuilder.newColumn('td5').withTitle('间隔时间（分钟）').withOption('width', '160px'),
			DTColumnBuilder.newColumn(null).withTitle('操作').notSortable()
				.renderWith(actionsHtml)

		];
		/*最后一列操作 start*/
		function deleteRow(operateDatas, thisobj) {//删除
			$("#" + thisobj).addClass("one-dele-active");
			$scope.$emit('sendMailDeleteOne', {"operateDatas": operateDatas, "thisobj": thisobj});
		}
		function queryRow(operateDatas, thisobj) {//查看
			$("#" + thisobj).addClass("one-copy-active");
			$scope.$emit('sendMailQueryOne', {"operateDatas": operateDatas, "thisobj": thisobj});
		}
		function createdRow(row, data, dataIndex) {
			$compile(angular.element(row).contents())($scope);
		}

		function actionsHtml(data, type, full, meta) {
			return _format.apenddeAQuHtml(vm.operateDatas, data);
		}

		/*最后一列操作 end*/
		mailTableInstance.vm = vm;
		angular.element($window).bind('resize', function () {
			mailTableInstance.vm.dtInstance.dataTable.fnAdjustColumnSizing();
		});
	}
);
angular.module('app').controller('acceTableCtrl', function ($scope, $rootScope, $compile, DTOptionsBuilder,
															DTColumnBuilder, acceTableInstance, $window) {
		/**
		 * 表格设定,附件列表
		 */
		var vm = this;
		vm.delete = deleteRow;
		vm.dtInstance = {};
		vm.operateDatas = {};
		vm.dtOptions = DTOptionsBuilder.fromSource('datajson/sendMailAccessory.json')
			.withDOM("<'row' t>")
			.withBootstrap()
			.withLanguage({
				"sEmptyTable": "暂无数据",
				"sLoadingRecords": "加载中...",
				"sProcessing": "正在玩命处理...",
				"sZeroRecords": "暂无记录！"
			}).withOption('autoWidth', false).withOption('createdRow', createdRow);
		vm.dtColumns = [
			DTColumnBuilder.newColumn('td1').withTitle('附件类型'),
			DTColumnBuilder.newColumn('td2').withTitle('数量'),
			DTColumnBuilder.newColumn('td3').withTitle('SID'),
			DTColumnBuilder.newColumn(null).withTitle('操作').notSortable()
				.renderWith(actionsHtml).withOption('width', '80px')

		];
		/*最后一列操作 start*/
		function deleteRow(operateDatas, thisobj) {//删除
			$("#" + thisobj).addClass("one-dele-active");
			$scope.$emit('accelistDeleteOne', {"operateDatas": operateDatas, "thisobj": thisobj});
		}

		function createdRow(row, data, dataIndex) {
			$compile(angular.element(row).contents())($scope);
		}

		function actionsHtml(data, type, full, meta) {
			return _format.apendDeleteHtml(vm.operateDatas, data, "seacce");
		}

		/*最后一列操作 end*/
		acceTableInstance.vm = vm;
		angular.element($window).bind('resize', function () {
			acceTableInstance.vm.dtInstance.dataTable.fnAdjustColumnSizing();
		});
	}
);
angular.module('app').controller('oneAcceTableCtrl', function (DTOptionsBuilder,
															DTColumnBuilder, oneAcceTableInstance) {
		/**
		 * 表格设定,定时邮件列表点击查看时显示的附件信息
		 */
		var vm = this;
		vm.dtInstance = {};
		vm.dtOptions = DTOptionsBuilder.fromSource('datajson/sendMailAccessory.json')
			.withDOM("<'row' t>")
			.withBootstrap()
			.withLanguage({
				"sEmptyTable": "暂无数据",
				"sLoadingRecords": "加载中...",
				"sProcessing": "正在玩命处理...",
				"sZeroRecords": "暂无记录！"
			}).withOption('autoWidth', false);
		vm.dtColumns = [
			DTColumnBuilder.newColumn('td1').withTitle('附件类型'),
			DTColumnBuilder.newColumn('td2').withTitle('数量'),
			DTColumnBuilder.newColumn('td3').withTitle('SID')
		];
		oneAcceTableInstance.vm = vm;
	}
);
module.exports = {
	url: '/sendMail',
	views: {
		'content': {
			template: __inline('./sendMail.html')
		}
	}
};

