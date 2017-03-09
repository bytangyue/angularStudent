'use strict';

/**  description 路由中心
 *   author tangyue
 *   date 2015/9/28
 */

var app = angular.module('app');

/**
 * 各个单独开发的pege模块（导入的是js文件）
 */
var login = require('pages/login/login');
var inANotice = require('pages/informAndNotice/informAndNotice');
var loginN = require('pages/loginNotice/loginNotice');
var news = require('pages/newsNotice/newsNotice');
var role = require('pages/role/role');
var activity = require('pages/activity/activity');
var send = require('pages/sendMail/sendMail');
var first = require('pages/firstMail/firstMail');
var freeze = require('pages/roleFreeze/roleFreeze');
var banned = require('pages/bannedList/bannedList');
var acc= require('pages/accountInformation/accountInformation');
var sensitive = require('pages/sensitiveFiltration/sensitiveFiltration');
var expense = require('pages/expenseCalendar/expenseCalendar');
var army = require('pages/armyGroup/armyGroup');
var chat = require('pages/chatMonitoring/chatMonitoring');
var barrage = require('pages/barrageMonitoring/barrageMonitoring');
var auction = require('pages/auctionCompany/auctionCompany');
/**
 * ui-router控制页面跳转
 */
app.config(['$stateProvider', '$urlRouterProvider', function ($stateProvider, $urlRouterProvider) {
    //$urlRouterProvider.otherwise('/dashbord');//参数与dashbord.js中url:一致
    $stateProvider.state("login", login)
        .state("informAndNotice", inANotice)//等级分布
        .state("loginNotice", loginN)//登录公告
        .state("newsNotice", news)//新闻公告
        .state("role", role)//角色
        .state("activity", activity)//活动
        .state("sendMail", send)//发送邮件
        .state("firstMail", first)//首登邮件
        .state("roleFreeze", freeze)//角色冻结
        .state("bannedList", banned)//禁言名单
        .state("accountInformation", acc)//账号信息
        .state("sensitiveFiltration", sensitive)//铭感词过滤
        .state("expenseCalendar", expense)//玩家消费记录
        .state("armyGroup",army)//军团
        .state("chatMonitoring", chat)//聊天监控
        .state("barrageMonitoring",barrage)//弹幕监控
        .state("auctionCompany", auction)//拍卖行
}]);

