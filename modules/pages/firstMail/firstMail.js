/**   description 等级分布
 *   author tangyue
 *   date 2015/11/12
 */
var _format = require('data/dataFormat');
angular.module("app").factory('firstmailTableInstance', function () {
	return {};
}).factory('fmacceTableInstance', function () {
	return {};
}).factory('oneFmAcceTableInstance', function () {
	return {};
}).controller("fmailCtrl",
	function ($rootScope, $scope, $timeout, $cookieStore, firstmailTableInstance, fmacceTableInstance, $http) {
		$rootScope.breadCNavigation = "首登邮件";
		$scope.setOverallTitle = "提示：1、此处操作，服务器和渠道均为全局使用；2、同一渠道只会有一个首登邮件，后面添加的会覆盖历史的！";
		//保存附件按钮是否显示
		$scope.saveacce.showacce = true;
		$scope.isShowAccefun = function () {
			$scope.mainShowAccefun($scope);
		}
		/*清空服务器、渠道、平台数据*/
		$scope.emptypopdata();
		/*时间组件配置*/
		$scope.querydate = {"dateclass": "qudate", "isvalid": true};
		$timeout(function () {
			utils.initTip();//等tip标签生成了再去初始化hover提示框
		}, 1000);
		$scope.checkfmailTableAll = function (ischeck) {// 全选/取消
			_format.setCheckboxAll(ischeck, firstmailTableInstance.vm.dtInstance.DataTable);
		}
		$scope.deleteSelected = function () {//批量删除
			var selecteData = _format.checkSelectedData(firstmailTableInstance.vm.dtInstance, $scope);
			_format.deleteOption($scope, selecteData.length, "dele");
			$scope.deleDeleData = selecteData;//选中数据
		}
		$scope.$on('firstMailDeleteOne', function (d, eventData) {//table删除操作
			$scope.fmisacce = false;
			_format.deleteOption($scope, "one", "dele");
			_format.deleteActiveClass(eventData.thisobj);
			$scope.deleDeleData = eventData.operateDatas;//选中数据
		});
		$scope.$on('firstMailQueryOne',function(d, eventData){//table查看操作
			$scope.modalparams = {
				"title": "查看设置",
				"btnText1": "关闭",
				"btnText2": "",
				"showEle": "other"
			};
			_format.deleteActiveClass(eventData.thisobj);
		});
		/*添加附件*/
		$scope.addAcce = function () {
			$scope.mainAddAcce($scope);
		}
		/*添加网址*/
		$scope.addwebAddress = function () {
			$scope.mainAddwebAddress($scope);
		}
		$scope.$on('fmaccelistDeleteOne', function (d, eventData) {//附件列表table删除操作
			$scope.fmisacce = true;
			_format.deleteOption($scope, "one", "dele");
			_format.deleteActiveClass(eventData.thisobj);
			$scope.deleDeleData = eventData.operateDatas;//选中数据
		});
		$scope.modalConfirm = function () {//模态窗口确认按钮操作
			if ($scope.modalparams.showEle == "dele") {//删除接口
				if ($scope.fmisacce) {
					console.log('该对接附件列表delete接口了', "选中的数据：", $scope.deleDeleData);
					//fmacceTableInstance.vm.dtInstance.reloadData();//重新加载数据
				} else {
					console.log('该对接定时首增邮件列表delete接口了', "选中的数据：", $scope.deleDeleData);
					//firstmailTableInstance.vm.dtInstance.reloadData();//重新加载数据
				}
			}
		}
		$scope.resettable = function () {
			$timeout(function () {
				firstmailTableInstance.vm.dtInstance.dataTable.fnAdjustColumnSizing();
			}, 10);
		}
		/*设置步骤激活样式*/
		$scope.stepObj={};
		$scope.stepObj.stepCurrent='editFirstMail';
		$scope.stepObj.iseditFirstMail=true;
		/*步骤上一步下一步*/
		$scope.setStepActive=function(){
			if($scope.stepObj.stepCurrent=='editFirstMail'){
				$scope.stepObj.isAccessory=false;
				$scope.stepObj.iseditFirstMail=true;
			}
			if($scope.stepObj.stepCurrent=='accessory'){
				$scope.stepObj.isAccessory=true;
				$scope.stepObj.iseditFirstMail=false;
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
angular.module('app').controller('firstmailTableCtrl', function ($scope, $window, $compile, $timeout, DTOptionsBuilder,
																 DTColumnBuilder, firstmailTableInstance) {
		/**
		 * 表格设定
		 */
		var vm = this;
		vm.delete = deleteRow;
		vm.query = queryRow;
		vm.dtInstance = {};
		vm.operateDatas = {};
		vm.dtOptions = DTOptionsBuilder.fromSource('datajson/firstMailList.json')
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
			DTColumnBuilder.newColumn('td2').withTitle('渠道'),
			DTColumnBuilder.newColumn('td3').withTitle('邮件名称'),
			DTColumnBuilder.newColumn('td4').withTitle('内容'),
			DTColumnBuilder.newColumn('td5').withTitle('生效时间').withOption('width', '160px'),
			DTColumnBuilder.newColumn('td6').withTitle('失效时间').withOption('width', '160px'),
			DTColumnBuilder.newColumn(null).withTitle('操作').notSortable()
				.renderWith(actionsHtml).withOption('width', '160px')
		];
		/*最后一列操作 start*/
		function deleteRow(operateDatas, thisobj) {//删除
			$("#" + thisobj).addClass("one-dele-active");
			$scope.$emit('firstMailDeleteOne', {"operateDatas": operateDatas, "thisobj": thisobj});
		}
		function queryRow(operateDatas, thisobj) {//查看
			$("#" + thisobj).addClass("one-copy-active");
			$scope.$emit('firstMailQueryOne', {"operateDatas": operateDatas, "thisobj": thisobj});
		}
		function createdRow(row, data, dataIndex) {
			$compile(angular.element(row).contents())($scope);
		}

		function actionsHtml(data, type, full, meta) {
			return _format.apenddeAQuHtml(vm.operateDatas, data);
		}

		/*最后一列操作 end*/
		firstmailTableInstance.vm = vm;
		angular.element($window).bind('resize', function () {
			firstmailTableInstance.vm.dtInstance.dataTable.fnAdjustColumnSizing();
		});
	}
);
angular.module('app').controller('fmacceTableCtrl', function ($scope, $compile, DTOptionsBuilder,
															  DTColumnBuilder, fmacceTableInstance) {
		/**
		 * 表格设定,附件列表
		 */
		var vm = this;
		vm.delete = deleteRow;
		vm.dtInstance = {};
		vm.operateDatas = {};
		vm.dtOptions = DTOptionsBuilder.fromSource('datajson/firstMailAccessory.json')
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
			$scope.$emit('fmaccelistDeleteOne', {"operateDatas": operateDatas, "thisobj": thisobj});
		}

		function createdRow(row, data, dataIndex) {
			$compile(angular.element(row).contents())($scope);
		}

		function actionsHtml(data, type, full, meta) {
			return _format.apendDeleteHtml(vm.operateDatas, data, "fiacce");
		}

		/*最后一列操作 end*/
		fmacceTableInstance.vm = vm;
	}
);
angular.module('app').controller('oneFmAcceTableCtrl', function (DTOptionsBuilder,
															   DTColumnBuilder, oneFmAcceTableInstance) {
		/**
		 * 表格设定,首登邮件列表点击查看时显示的附件信息
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
		oneFmAcceTableInstance.vm = vm;
	}
);
module.exports = {
	url: '/firstMail',
	views: {
		'content': {
			template: __inline('./firstMail.html')
		}
	}
};

