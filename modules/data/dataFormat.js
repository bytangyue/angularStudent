/**
 * Created by zhongxingxing on 2015/10/28.
 */
var _ = require('tools/underscore/underscore');
require('tools/md5/md5');

module.exports = {
    /**
     * 数据后端服务地址
     */
    dataServerConfig: {
        httpUrl: 'http://192.168.1.188:8888'
    },
    /**
     * 等级分布数据格式化
     * @param dataArray
     */
    levelTableFormat: function (dataArray) {
        var formatedTableData = [];
        var formatedLineData = {
            legend: ['等级分布'],
            xAix: [],
            seriesData: []
        }
        if (angular.isArray(dataArray)) {
            var seriData = {data: []};
            _.each(_.sortBy(dataArray[0], 'level'), function (value, key, list) {
                var _obj = {};
                var calculate = value.t1 / value.t2;
                var percent = Number(calculate * 100).toFixed(2) + '%';
                _obj.level = value.level;
                _obj.num = value.t1;
                _obj.rate = percent;
                formatedLineData.xAix.push('等级' + value.level);
                seriData.data.push(value.t1);
                formatedTableData.push(_obj);
            });
            formatedLineData.seriesData.push(seriData);
        }
        return {
            table: formatedTableData,
            line: formatedLineData
        }
    },
    /**
     * vip分布数据格式化
     * @param dataArray
     * @returns {{table: Array, line: {legend: string[], xAix: Array, seriesData: Array}}}
     */
    vipTableFormat: function (dataArray) {
        var formatedTableData = [];
        var formatedLineData = {
            legend: ['VIP分布'],
            xAix: [],
            seriesData: []
        }
        if (angular.isArray(dataArray)) {
            var seriData = {data: []};
            _.each(_.sortBy(dataArray, 'dt'), function (value, key, list) {
                var _obj = {};
                var percent = Number(value.rate * 100).toFixed(2) + '%';
                _obj.vip = value.vip;
                _obj.number = value.number;
                _obj.rate = percent;
                formatedLineData.xAix.push('VIP' + value.vip);
                seriData.data.push(value.number);
                formatedTableData.push(_obj);
            });
            formatedLineData.seriesData.push(seriData);
        }
        return {
            table: formatedTableData,
            line: formatedLineData
        }
    },
    /**
     * 日增用户数据格式化
     * @param dataArray
     * @returns {{table: Array, line: {legend: string[], xAix: Array, seriesData: Array}}}
     */
    dayAddUserFormat: function (dataArray) {
        var formatedTableData = [];
        var formatedLineData = {
            legend: ['日增激活', '日增注册', '日增建角'],
            xAix: [],
            seriesData: []
        }
        if (angular.isArray(dataArray)) {
            var seriactData = {data: []};
            var seriregData = {data: []};
            var sericrtData = {data: []};
            _.each(_.sortBy(dataArray, 'dt'), function (value, key, list) {
                var _obj = {};
                var dtStr = moment(value.dt).format('YYYY-MM-DD');
                _obj.dt = dtStr;
                _obj.rzact = value.rzact;
                _obj.rzreg = value.rzreg;
                _obj.rzcrt = value.rzcrt;
                formatedLineData.xAix.push(dtStr);
                seriactData.data.push(value.rzact);
                seriregData.data.push(value.rzreg);
                sericrtData.data.push(value.rzcrt);
                formatedTableData.push(_obj);
            });
            formatedLineData.seriesData.push(seriactData);
            formatedLineData.seriesData.push(seriregData);
            formatedLineData.seriesData.push(sericrtData);
        }
        return {
            table: formatedTableData,
            line: formatedLineData
        }
    },
    /**
     * 设备留存
     * @param dataArray
     */
    equipmentRatesFormat: function (dataArray) {
        var formatedTableData = [];
        var formatedLineData = {
            legend: ['2日留存率', '3日留存率', '7日留存率', '15日留存率', '30日留存率'],
            xAix: [],
            seriesData: []
        }
        if (angular.isArray(dataArray)) {
            var seri2Data = {data: []};
            var seri3Data = {data: []};
            var seri7Data = {data: []};
            var seri15Data = {data: []};
            var seri30Data = {data: []};
            _.each(_.sortBy(dataArray, 'dt'), function (value, key, list) {
                var _obj = {};
                var dtStr = moment(value.dt).format('YYYY-MM-DD');
                _obj.dt = dtStr;
                var lc2 = Number(value.lc2 * 100).toFixed(2);
                var lc3 = Number(value.lc3 * 100).toFixed(2);
                var lc7 = Number(value.lc7 * 100).toFixed(2);
                var lc15 = Number(value.lc15 * 100).toFixed(2);
                var lc30 = Number(value.lc30 * 100).toFixed(2);
                _obj.lc2 = lc2 + '%';
                _obj.lc3 = lc3 + '%';
                _obj.lc7 = lc7 + '%';
                _obj.lc15 = lc15 + '%';
                _obj.lc30 = lc30 + '%';
                formatedLineData.xAix.push(dtStr);
                seri2Data.data.push(lc2);
                seri3Data.data.push(lc3);
                seri7Data.data.push(lc7);
                seri15Data.data.push(lc15);
                seri30Data.data.push(lc30);
                formatedTableData.push(_obj);
            });
            formatedLineData.seriesData.push(seri2Data);
            formatedLineData.seriesData.push(seri3Data);
            formatedLineData.seriesData.push(seri7Data);
            formatedLineData.seriesData.push(seri15Data);
            formatedLineData.seriesData.push(seri30Data);
        }
        return {
            table: formatedTableData,
            line: formatedLineData
        }
    },
    /**
     * 用户活跃
     * @param dataArray
     */
    userActivesFormat: function (dataArray) {
        var formatedTableData = [];
        var formatedLineData = {
            legend: ['日活跃用户人数', '周活跃用户人数', '月活跃用户人数', '用户活跃度'],
            xAix: [],
            seriesData: [],
            seriesTwoData: []
        }
        if (angular.isArray(dataArray)) {
            var seridauData = {data: []};
            var seriwauData = {data: []};
            var serimauData = {data: []};
            var serilivenessData = {data: []};

            _.each(_.sortBy(dataArray, 'dt'), function (value, key, list) {
                var _obj = {};
                var dtStr = moment(value.dt).format('YYYY-MM-DD');
                _obj.dt = dtStr;
                _obj.dau = value.dau;
                _obj.wau = value.wau;
                _obj.mau = value.mau;
                _obj.liveness = Number(value.liveness * 100).toFixed(2) + '%';
                formatedLineData.xAix.push(dtStr);
                seridauData.data.push(value.dau);
                seriwauData.data.push(value.wau);
                serimauData.data.push(value.mau);

                serilivenessData.data.push(Number(value.liveness * 100).toFixed(2));
                formatedTableData.push(_obj);
            });
            formatedLineData.seriesData.push(seridauData);
            formatedLineData.seriesData.push(seriwauData);
            formatedLineData.seriesData.push(serimauData);
            formatedLineData.seriesTwoData.push(serilivenessData);
        }
        return {
            table: formatedTableData,
            line: formatedLineData
        }
    },
    /**
     * 在线时长
     * @param dataArray
     */
    onlineTimeFormat: function (dataArray) {
        var _format = require('data/dataFormat');
        var formatedTableData = [];
        var formatedLineData = {
            legend: [],
            timeLine: [],
            allData: []
        }

        function formatOnlieTableData(obj, realdata) {
            _.each(realdata, function (realValue) {
                obj[_format.timeFormat(realValue.seconds)] = realValue.number;
            });
        }

        if (angular.isArray(dataArray)) {
            var i = 0;
            _.each(_.sortBy(dataArray, 'time'), function (value, key, list) {
                var _oneLineObj = {};
                var dtStr = moment.unix(Number(value.dt / 1000)).format('YYYY-MM-DD');
                _oneLineObj.dt = dtStr;
                formatedLineData.timeLine.push(dtStr);
                var realData = value.data;
                if (i == 0) {//过滤出legend
                    var _dataPerDay = []
                    _.each(realData, function (realValue) {
                        var _tmpTime = moment('2015-03-01 00:00:00', 'YYYY-MM-DD HH:mm:ss');
                        formatedLineData.legend.push(_format.timeFormat(realValue.seconds));
                        _dataPerDay.push(realValue.number);

                        formatOnlieTableData(_oneLineObj, realData);
                    });
                    formatedLineData.allData.push(_dataPerDay);
                } else {
                    var _dataPerDay = []
                    _.each(realData, function (realValue) {
                        formatOnlieTableData(_oneLineObj, realData);
                        _dataPerDay.push(realValue.number);
                    });
                    formatedLineData.allData.push(_dataPerDay);
                }
                formatedTableData.push(_oneLineObj);
                i++;
            });
        }
        return {
            table: formatedTableData,
            line: formatedLineData
        }
    },
    /**
     * 付费用户数统计
     * @param dataArray
     * @returns {{table: Array, line: {legend: string[], xAix: Array, seriesData: Array}}}
     */
    payUsersCountFormat: function (dataArray) {
        var formatedTableData = [];
        var formatedLineData = {
            legend: ['日总人数', '日总金额', '日总人次', '日增人数', '日增金额', '周总人数', '周总金额', '周总人次', '周增人数', '周增金额', '月总人数', '月总金额', '月总人次', '月增人数', '月增金额'],
            xAix: [],
            seriesData: []
        }
        if (angular.isArray(dataArray)) {
            var day_device_nums = {data: []};
            var day_pay_nums = {data: []};
            var day_device_ttls = {data: []};
            var day_device_nums_new = {data: []};
            var day_device_ttls_new = {data: []};
            var week_device_nums = {data: []};
            var week_pay_nums = {data: []};
            var week_device_ttls = {data: []};
            var week_device_nums_new = {data: []};
            var week_device_ttls_new = {data: []};
            var month_device_nums = {data: []};
            var month_pay_nums = {data: []};
            var month_device_ttls = {data: []};
            var month_device_nums_new = {data: []};
            var month_device_ttls_new = {data: []};
            _.each(_.sortBy(dataArray, 'dt'), function (value, key, list) {
                value.dt = moment(value.dt).format('YYYY-MM-DD');
                formatedTableData.push(value);

                formatedLineData.xAix.push(value.dt);

                day_device_nums.data.push(value.day_device_nums);
                day_pay_nums.data.push(value.day_pay_nums);
                day_device_ttls.data.push(value.day_device_ttls);
                day_device_nums_new.data.push(value.day_device_nums_new);
                day_device_ttls_new.data.push(value.day_device_ttls_new);
                week_device_nums.data.push(value.week_device_nums);
                week_pay_nums.data.push(value.week_pay_nums);
                week_device_ttls.data.push(value.week_device_ttls);
                week_device_nums_new.data.push(value.week_device_nums_new);
                week_device_ttls_new.data.push(value.week_device_ttls_new);
                month_device_nums.data.push(value.month_device_nums);
                month_pay_nums.data.push(value.month_pay_nums);
                month_device_ttls.data.push(value.month_device_ttls);
                month_device_nums_new.data.push(value.month_device_nums_new);
                month_device_ttls_new.data.push(value.month_device_ttls_new);
            });
            formatedLineData.seriesData.push(day_device_nums);
            formatedLineData.seriesData.push(day_pay_nums);
            formatedLineData.seriesData.push(day_device_ttls);
            formatedLineData.seriesData.push(day_device_nums_new);
            formatedLineData.seriesData.push(day_device_ttls_new);
            formatedLineData.seriesData.push(week_device_nums);
            formatedLineData.seriesData.push(week_pay_nums);
            formatedLineData.seriesData.push(week_device_ttls);
            formatedLineData.seriesData.push(week_device_nums_new);
            formatedLineData.seriesData.push(week_device_ttls_new);
            formatedLineData.seriesData.push(month_device_nums);
            formatedLineData.seriesData.push(month_pay_nums);
            formatedLineData.seriesData.push(month_device_ttls);
            formatedLineData.seriesData.push(month_device_nums_new);
            formatedLineData.seriesData.push(month_device_ttls_new);
        }
        return {
            table: formatedTableData,
            line: formatedLineData
        }
    },
    /**
     * 用户保证传入的是number
     * @param time
     * @returns {*}
     */
    timeFormat: function (time) {
        var timeStr = '';
        var hour = '00:';
        var min = '00';
        if (time < 3600) {
            min = Number(time / 60).toFixed(0);
            if (min < 10) {
                min = '0' + min;
            }
        } else {
            hour = Number(time / 3600).toFixed(0);
            if (hour < 10) {
                hour = ('0' + hour) + ":";
            } else {
                hour += ":";
            }
        }
        return hour + min;
    },
    /**
     * 产品收入能力格式化
     * @param dataArray
     */
    productAnalysisFormat: function (dataArray, ispercent) {
        var formatedTableData = [];
        var formatedLineData = {
            xAix: [],
            seriesData: []
        }
        if (angular.isArray(dataArray)) {
            var seriDayData = {data: []};
            var seriWeekData = {data: []};
            var seriMonthData = {data: []};
            _.each(_.sortBy(dataArray, 'dt'), function (value, key, list) {
                var _onelineData = {}
                var dtStr = moment.unix(Number(value.dt / 1000)).format('YYYY-MM-DD')
                _onelineData.dt = dtStr;
                var day = Number((value.day_numerator / (value.day_denominator == 0 ? 1 : value.day_denominator)) * 100).toFixed(2);
                var week = Number((value.week_numerator / (value.week_denominator == 0 ? 1 : value.week_denominator)) * 100).toFixed(2);
                var month = Number((value.month_numerator / (value.month_denominator == 0 ? 1 : value.month_denominator)) * 100).toFixed(2);
                if (ispercent) {
                    _onelineData.dayRate = day + '%';
                    _onelineData.weekRate = week + '%';
                    _onelineData.monthRate = month + '%';
                } else {
                    _onelineData.dayRate = day;
                    _onelineData.weekRate = week;
                    _onelineData.monthRate = month;
                }

                formatedTableData.push(_onelineData);
                formatedLineData.xAix.push(dtStr);
                seriDayData.data.push(day);
                seriWeekData.data.push(week);
                seriMonthData.data.push(month);
            });
            formatedLineData.seriesData.push(seriDayData);
            formatedLineData.seriesData.push(seriWeekData);
            formatedLineData.seriesData.push(seriMonthData);
        }
        return {
            table: formatedTableData,
            line: formatedLineData
        }
    },
    /**
     * 产品收入能力分析配置
     */
    productAnalysisConfig: (function () {
        return {
            method: ['pay_rate', 'apay_rate', 'arppu', 'arpu', 'addarppu', 'addarpu', 'ltv'],
            haspercent: [true, true, false, false, false, false, false],
            pay_rate: ['日付费率', '周付费率', '月付费率'],
            apay_rate: ['日付费率', '周付费率', '月付费率'],
            arppu: ['日付费率', '周付费率', '月付费率'],
            arpu: ['日付费率', '周付费率', '月付费率'],
            addarppu: ['日付费率', '周付费率', '月付费率'],
            addarpu: ['日付费率', '周付费率', '月付费率'],
            ltv: ['日付费率', '周付费率', '月付费率']
        }
    })(),
    /**
     *table表头复选框全选
     */
    setCheckboxAll: function (ischecked,table) {
        if (ischecked) {//选中【全选】
            $(this).parent().addClass('selected');
            table.rows({page: 'current'}).select();
        } else {//不选
            $(this).parent().removeClass('selected');
            table.rows({page: 'current'}).deselect();
        }
    },
    /**
     * 检测是否选择了服务器
     */
    checkServerData: function (sData, $scope) {
        if (sData.length <= 0) {
            $scope.warn = '服务器不能为空，请选择服务器';
            $scope.tipShow = true;
            return false;
        } else {
            $scope.warn = '';
            $scope.tipShow = false;
            return true;
        }
    },
    /**
     *table检测是否选中了行，并返回数据
     * tipNum=2时同一界面有2个温馨提示框，不传tipNum值时同一界面有1个温馨提示框
     */
    checkSelectedData: function (tableinst, $scope) {
        var selecteData = tableinst.DataTable.rows({selected: true}).data();
        var flag;
        if (selecteData.length <= 0) {
            $scope.warn = '请任意选择一行数据';
            $scope.tipShow = true;
            flag = false;
        } else {
            $scope.warn = '';
            $scope.tipShow = false;
            flag = true;
        }
        if (flag) {
            utils.showModal();
        }
        return selecteData;
    },
    /**
     * 启动模态，在隐藏模态窗口的时候移除删除样式
     */
    deleteActiveClass: function (obj) {
        utils.showModal();
        $('#myModal').on('hidden.bs.modal', function (e) {
            $("#" + obj).removeClass("one-dele-active");
            $("#" + obj).removeClass("one-copy-active");
        });
    },
    /**
     *table操作列生成删除复制查看按钮
     */
    apendHtml: function (datas, data) {
        datas[data.id] = data;
        return '<button type="button" class="btn btn-yellow padding-2-12" id="dele' + data.id + '" ng-click="showCase.delete(showCase.operateDatas[' + data.id + '],\'dele' + data.id + '\')">' +
            '<i class="fa fa-trash-o"></i> 删除' +
            '</button>&nbsp;' +
            '<button type="button" class="btn purple-btn-table padding-2-12" id="copy' + data.id + '" ng-click="showCase.copy(showCase.operateDatas[' + data.id + '],\'copy' + data.id + '\')">' +
            '<i class="fa fa-files-o"></i> 复制' +
            '</button>&nbsp;' +
            '<button type="button" class="btn purple-btn-table padding-2-12" id="query' + data.id + '" ng-click="showCase.query(showCase.operateDatas[' + data.id + '],\'query' + data.id + '\')">' +
            '<i class="fa fa-search-plus"></i> 查看' +
            '</button>';
    },
    /**
     *table操作列生成删除查看按钮
     */
    apenddeAQuHtml: function (datas, data) {
        datas[data.id] = data;
        return '<button type="button" class="btn btn-yellow padding-2-12" id="dele' + data.id + '" ng-click="showCase.delete(showCase.operateDatas[' + data.id + '],\'dele' + data.id + '\')">' +
            '<i class="fa fa-trash-o"></i> 删除' +
            '</button>&nbsp;' +
            '<button type="button" class="btn purple-btn-table padding-2-12" id="query' + data.id + '" ng-click="showCase.query(showCase.operateDatas[' + data.id + '],\'query' + data.id + '\')">' +
            '<i class="fa fa-search-plus"></i> 查看' +
            '</button>';
    },
    /**
     *table操作列生成查看按钮
     */
    apendQueryHtml: function (datas, data) {
        datas[data.id] = data;
        return '<button type="button" class="btn purple-btn-table padding-2-12" id="query' + data.id + '" ng-click="showCase.query(showCase.operateDatas[' + data.id + '],\'query' + data.id + '\')">' +
            '<i class="fa fa-search-plus"></i> 查看' +
            '</button>';
    },
    /**
     *table操作列生成删除按钮
     */
    apendDeleteHtml: function (datas, data, deleText) {
        if (typeof deleText == "undefined") {
            deleText = '';
        }
        datas[data.id] = data;
        return '<button type="button" class="btn btn-yellow padding-2-12" id="del2e' + data.id + deleText + '" ng-click="showCase.delete(showCase.operateDatas[' + data.id + '],\'del2e' + data.id + deleText + '\')">' +
            '<i class="fa fa-trash-o"></i> 删除' +
            '</button>';
    },
    /**
     * 模态窗口警告配置
     * @param $scope
     * @param seddata 显示的红色文字
     * @param showText =【dele:删除，auction:拍卖行状态列表，talk：全服禁言，other:非提示性文字的布局块】
     */
    deleteOption: function ($scope, seddata, showText) {
        $scope.modalparams = {
            "title": "警告",
            "btnText1": "否",
            "btnText2": "是",
            "showEle": showText,
            "isEdit": true,//不可编辑
            "selectedData": seddata
        };
        //倒计时
        $scope.modalparams.count = 5;
        var clearId = setInterval(function () {
            $scope.modalparams.count--;
            if ($scope.modalparams.count <= 0) {
                clearInterval(clearId);
                $scope.modalparams.count = '';
                $scope.modalparams.isEdit = false;//可编辑
            }
            $scope.$apply();
        }, 1000);
    },
    /**
     *
     * @descrition: 对字符串进行截取，包括普通字符和中文字符
     * @param : str ->待截取的字符串
     * @param : len ->要截取的长度
     *
     * 比如cutstr('hello',2)->he...  cutstr("您好呀",4)->您好...
     * 优先选择后台进行字符串截取，后css截取，最后js截取
     */
    cutString: function (str, len) {
        var temp,
            icount = 0,
            patrn = /[^\x00-\xff]/g,  //中文字符匹配
            strre = "";
        for (var k = 0; k < str.length; k++) {
            if (icount < len) {
                temp = str.substr(k, 1);
                if (temp.match(patrn) == null) {//英文字符长度
                    icount = icount + 1;
                } else {//中文字符长度
                    icount = icount + 2;
                }
                strre += temp;
            } else {
                break
            }
        }
        return strre + "...";
    },
    /**
     * 字符串布尔转布尔类型
     * @param str
     * @returns {boolean}
     */
    changeBoolean: function (str) {
        if (str == "true") {
            return true;
        } else {
            return false;
        }
    },
    /**
     * 检测时间
     * @returns {boolean}
     */
    checkdate: function ($scope, dateobj) {
        var paArray = [];
        //日期双选时查询取值
        var datete = angular.element("." + dateobj.dateclass).text().trim();
        if (dateobj.isvalid) {//是合法的时间
            $scope.tipShow = false;
            if (datete.indexOf("~") > 0) {
                var flag;
                var dateText = datete.split("~");
                if (moment(dateText[0]).isAfter(dateText[1])) {
                    $scope.tipShow = true;
                    $scope.warn = '开始时间不能大于结束时间';
                    flag = false;
                } else {
                    $scope.tipShow = false;
                    flag = true;
                }
                //if(flag){
                //    if (moment(dateText[1]).diff(moment(dateText[0]), 'days') + 1 > 7) {
                //        $scope.tipShow=true;
                //        $scope.warn='最多只允许查询7天数据';
                //        flag = false;
                //    } else {
                //        $scope.tipShow=false;
                //        flag = true;
                //    }
                //}
                if (flag) {
                    paArray.push("startTime=" + dateText[0].trim());
                    paArray.push("endTime=" + dateText[1].trim());
                } else {
                    paArray = [];
                }
            } else {
                paArray.push("startTime=" + datete);
            }
        } else {
            $scope.tipShow = true;
            $scope.warn = '输入的日期不合要求或不存在该日期';
        }
        return paArray;
    }

};