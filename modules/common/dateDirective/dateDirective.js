/**  description 定制日期组件按钮以及下拉div显示,依赖于bootstrap
 *   author tangyue
 *   date 2015/10/23
 */
angular.module('app').directive('dateButton', function () {
    return {
        restrict: 'E',
        transclude: true,
        scope: {//在dom上使用这些属性要将驼峰规则的写法换成-的
            /*
             * 【dom使用：single-date="true" 】->代表1个日期选择项,
             * 【dom使用：single-date="false"】->代表2个日期选择项,
             * 【这个属性必须设置】
             * */
            singleDate: "@",
            /*
             * 【dom使用：choose-year】-> 代表只选择年份【dom上必须设置single-date="true"】,
             * 不设置choose-year ：代表选择年月日
             * */
            chooseYear: "@",
            /*
             * 【dom使用：year-month】->代表只选择年月【dom上必须设置single-date="true"】,
             * 不设置year-month：代表选择年月日
             * */
            yearMonth: "@",
            datename:"="//同一个页面使用多次时，这个值不能设定为一样的
        },
        replace: true,
        controller: function ($scope) {
            $scope.setDefaultDate = function (beforeDay) {
                $scope.errorTip = '';
                if ($scope.chooseYear == '') {//只选择年
                    $scope.sDate = moment().year();
                } else if ($scope.yearMonth == '') {//只选择年月
                    $scope.sDate = moment().format("YYYY-MM");
                } else {
                    //开始时间是结束时间的前7天(包括今天就是传6)
                    $scope.sDate = moment().subtract(beforeDay, 'days').format("YYYY-MM-DD");
                    //设置开始时间的val值，已满足datetimepicker组件默认active按钮为输入框的值的那一天
                    angular.element("#startinp").val($scope.sDate);
                    if ($scope.startInstance) {
                        $scope.startInstance.datetimepicker('update', $scope.sDate);
                    }
                }
                if ($scope.singleDate == 'false') {
                    //结束时间设置当前时间
                    $scope.eDate = moment().format("YYYY-MM-DD");
                }
            }
            $scope.clicknum = 0;
            //同一个按钮点击显示或者消失
            $scope.showOrHide = function () {
                $scope.errorTip = '';
                //$scope.clicknum++;//在鼠标移开归0
                //if ($scope.clicknum == 1) {//点击1次
                //    $scope.isShow = true;
                //    angular.element(".moverdiv").addClass('open');
                //    angular.element(".mleavediv").removeClass('open');
                //} else {//点击多次显示隐藏
                    $scope.isShow = !$scope.isShow;
                //}
            }
            $scope.isShowContent = function (isSure) {
                $scope.errorTip = '';
                if (isSure) {//确定
                    if ($scope.singleDate == 'false') {
                        $scope.isShow = true;
                        if (moment($scope.sDate).isAfter($scope.eDate)) {
                            $scope.errorTip = '开始时间不能大于结束时间';
                        } else {// 日期合法
                            $scope.errorTip = '';
                            $scope.isShow = false;
                        }
                    } else {
                        $scope.isShow = false;
                    }
                } else {//取消
                    if ($scope.singleDate == 'false') {
                        $scope.setDefaultDate(6);
                    } else {
                        $scope.setDefaultDate(0);
                    }
                    $scope.isShow = false;
                }
            };
            /*设置默认时间*/
            if ($scope.singleDate == 'false') {
                $scope.setDefaultDate(6);
            } else {
                $scope.setDefaultDate(0);
            }
            /*初始化日期组件*/
            function setInitDatetimepicker(singleDate, chooseYear, yearMonth, $scope) {
                var fmat = "", sview = 0, mview = 0, eddate = '';
                if (chooseYear == '') {//年
                    fmat = 'yyyy';
                    sview = 4;
                    mview = 4;
                    //eddate = moment().year();
                } else if (yearMonth == '') {//年月
                    fmat = 'yyyy-mm';
                    sview = 3;
                    mview = 3;
                } else {//默认年月日
                    fmat = 'yyyy-mm-dd';
                    sview = 2;
                    mview = 2;
                    //eddate = moment().format("YYYY-MM-DD");
                }
                $scope.startInstance = $(".startDT").datetimepicker({
                    language: 'zh-CN',
                    format: fmat,
                    startView: sview,
                    minView: mview,
                    weekStart: 1,
                    todayBtn: 1,
                    autoclose: 1,
                    todayHighlight: 1,
                    forceParse: 0
                    //endDate: eddate //结束时间，在这时间之后都不可选
                });
                $scope.startInstance.on("changeDate", function(e) {
                    $scope.datename.isvalid=true;
                });
                if (singleDate == 'false') {
                    $scope.endInstance = $(".endDT").datetimepicker({
                        language: 'zh-CN',
                        format: 'yyyy-mm-dd',
                        weekStart: 1,
                        todayBtn: 1,
                        autoclose: 1,
                        todayHighlight: 1,
                        startView: 2,
                        minView: 2,
                        forceParse: 0
                        //endDate: moment().format("YYYY-MM-DD")//结束时间，在这时间之后都不可选
                    });
                    $scope.endInstance.on("changeDate", function(e) {
                        $scope.datename.isvalid=true;
                    });
                }
            }

            setInitDatetimepicker($scope.singleDate, $scope.chooseYear, $scope.yearMonth, $scope);
            /*设置样式*/

            if ($scope.yearMonth == "") {//单选年月
                $scope.inputhead="年月";
                $scope.myStyle = {padding: '0 9px'};
            } else if ($scope.chooseYear == "") {//单选年
                $scope.inputhead="年";
                $scope.myStyle = {padding: '0 20px'};
                //$scope.xxsmInput = {width: '98px'};
            } else if ($scope.singleDate == 'true') {//单选年月日
                $scope.inputhead="年月日";
                $scope.myStyle = {padding: '0'};
            }
            /**
             * 输入格式校验
             */
            $scope.validateDate = function () {
                var sstrdate = $scope.sDate + "";
                var estrdate = $scope.eDate + "";
                var reg;
                if ($scope.yearMonth == "") {//单选年月
                    reg = /^((?!0000)[0-9]{4})-(0[1-9]|1[0-2])$/;
                    $scope.inputMaxlength=7;
                } else if ($scope.chooseYear == "") {//单选年
                    reg = /^(?!0000)[0-9]{4}$/;
                    $scope.inputMaxlength=4;
                } else {//年月日
                    reg = /^(?:(?!0000)[0-9]{4}-(?:(?:0[1-9]|1[0-2])-(?:0[1-9]|1[0-9]|2[0-8])|(?:0[13-9]|1[0-2])-(?:29|30)|(?:0[13578]|1[02])-31)|(?:[0-9]{2}(?:0[48]|[2468][048]|[13579][26])|(?:0[48]|[2468][048]|[13579][26])00)-02-29)$/;
                    $scope.inputMaxlength=10;
                }
                if (!sstrdate.match(reg)) {
                    $scope.sdaterror = true;
                } else {
                    $scope.sdaterror = false;
                }
                if ($scope.singleDate == 'false') {
                    if (!estrdate.match(reg)) {
                        $scope.edaterror = true;
                    } else {
                        $scope.edaterror = false;
                    }
                    if(!$scope.sdaterror&&!$scope.edaterror){
                        $scope.datename.isvalid=true;
                    }else{
                        $scope.datename.isvalid=false;
                    }
                }
                 if($scope.singleDate == 'true'){
                     if(!$scope.sdaterror){
                         $scope.datename.isvalid=true;
                     }else{
                         $scope.datename.isvalid=false;
                     }
                 }
            }
            /*恢复输入正确状态*/
            $scope.resetErrorState=function(){
                $scope.isShow = false;
                $scope.sdaterror=false;
                $scope.edaterror = false;
                $scope.datename.isvalid=true;
            }

        },
        template: __inline('./dateButton.html')
    };
});


