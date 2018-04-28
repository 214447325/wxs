/*
* @Author: User
* @Date:   2016-09-02 11:03:30
* @Last Modified by:   User
* @Last Modified time: 2017-03-09 14:49:06
*/

$(function(){
var isWeiXin = Common.isWeiXin();//微信进来的访问判断，不是跳转到官网下载页
var param = Common.getParam();
var weixin = param.weixin;
var userId =sessionStorage.getItem('uid');
var validName =sessionStorage.getItem('validName');//获取用户实名
var validTrade =sessionStorage.getItem('validTrade');//获取用户交易密码
var $ui_dialog_name = $('.ui-dialog-name');
var $btn_link_name  = $('.btn-link-name',$ui_dialog_name);
var $btn_default_name = $('.btn-default-name',$ui_dialog_name); 
var $ui_dialog_trade = $('.ui-dialog-trade');
var $btn_link_trade  = $('.btn-link',$ui_dialog_trade);
var $btn_default_trade = $('.btn-default',$ui_dialog_trade); 
// var _data;
var currentEndTime;//结束时间
var currentStartTime;//开始时间
var currentTime;//服务器当前时间
var currentStartTimeAlert;
var cAmount;
if(weixin){
  Common.weixinLogin(weixin);
}

    var myDay = new Date();
    var nextDate = new Date(myDay.getTime() + 24*60*60*1000); //后一天
    var newMonth = myDay.getMonth() + 1;
    var nextMonth = nextDate.getMonth() + 1;
    var myTime = myDay.getDate();
    var nextTime = nextDate.getDate();
    newMonth = newMonth < 10?'0' + newMonth : newMonth;
    nextMonth = nextMonth < 10?'0' + nextMonth : nextMonth;
    myTime = myTime < 10?'0' + myTime : myTime;
    nextTime = nextTime < 10?'0' + nextTime : nextTime;
    $('.day1').html(newMonth + '-' + myTime);
    $('.day2').html(newMonth + '-' + myTime);
    $('.day3').html(nextMonth + '-' + nextTime);
//理财页接口   七天乐
$.ajax({
    url: Setting.apiRoot1 + '/queryInvestPageInfo.p2p',
    type: 'post',
    dataType: 'json',
}).done(function(res){
    if(res.code == 1){
    var data=res.data.currentList.currentListDetail;
    console.log(data);
    pid=data[0].prodId;
    // _data = {
    //     pid: data[0].prodId,
    //     pname: data[0].prodTitle,
    //     pmount: data[0].canBuyAmt,
    //     minInvestAmount: data[0].minBuyAmt,
    //     maxInvestAmount: data[0].maxBuyAmt,
    //     maxRate:data[0].maxRate,
    //     minRate:data[0].minRate,
    //     act7:data[0].act7//是否参加邀请好友送奖励
    // };
    $.ajax({
        url:Setting.apiRoot1 + '/checkHuoQiBuyStatus.p2p',
        type:'post',
    }).done(function(res){
         Common.ajaxDataFilter(res,function(){
            console.log(res)
            if(res.code == 1){
                var dataCurrent = res.data;
                //时间转换
                var date = new Date();
                var fullYear= date.getFullYear();
                var month= date.getMonth() + 1;
                var day= date.getDate();
                currentStartTimeAlert = dataCurrent.currentStartTime;
                currentEndTime = new Date(fullYear +'/'+ month +'/'+day+' '+dataCurrent.currentEndTime).getTime();//结束时间
                currentStartTime = new Date(fullYear +'/'+ month +'/'+day+' '+dataCurrent.currentStartTime).getTime();//开始时间
                currentTime = new Date(fullYear +'/'+ month +'/'+day+' '+dataCurrent.currentTime).getTime();//服务器当前时间
                cAmount = dataCurrent.currentVoteAmt;//可投余额
                if(null != cAmount && '' != cAmount && undefined != cAmount) {
                    $('.current_amount').html((Common.comdify(parseFloat(cAmount).toFixed(2))));
                } else {
                    $('.current_amount').html(0);
                }
                setInterval(function(){
                    currentTime += 1000;
                    var btnClolor = $('.buy_btn').css('background');
                    var btnText = $('.buy_btn').text();
                    // 可以购买的情况
                    if ((currentStartTime < currentTime) &&  (currentTime <  currentEndTime)) {
                        if(parseFloat(cAmount) > 0){
                            if(btnClolor != '#6C6FFF'){
                                $('.buy_btn').css('background','#6C6FFF');
                            }
                            if(btnText != '立即抢购'){
                                $('.buy_btn').text('立即抢购');
                            }
                        }else{
                            if(btnClolor != '#CBCBCB'){
                                $('.buy_btn').css('background','#CBCBCB');
                            }
                            if(btnText != '今日已售罄'){
                                $('.buy_btn').text('今日已售罄');
                            }
                        }
                    }else {
                        if(currentStartTime > currentTime){//未开始
                            if(btnClolor != '#CBCBCB'){
                                $('.buy_btn').css('background','#CBCBCB');
                            }
                            if(btnText != '立即抢购'){
                                $('.buy_btn').text('立即抢购');
                            }
                        }else if(currentEndTime < currentTime){//已结束
                            if(btnClolor != '#CBCBCB'){
                                $('.buy_btn').css('background','#CBCBCB');
                            }
                            if(btnText != '今日已结束'){
                                $('.buy_btn').text('今日已结束');
                            }
                        }
                    }
                   
                },1000);
            }
         })

    })
 
   }

}).fail(function(){
});


      $('.close').on('click',function(){
          $('.ui-dialog').addClass('hide');
      }); 
       $('.buy_btn').on('click',function(){
            if(!userId){
                Common.toLogin();
                return false;
            }
            if (currentStartTime <= currentTime &&  currentTime <=  currentEndTime){
                if(cAmount > 0){
                    if (validName!=1) {
                      $ui_dialog_name.removeClass('hide');
                       $btn_link_name.attr('href',Setting.staticRoot + '/pages/my-account/setting/real-name.html');
                      $btn_default_name.attr('href',Setting.staticRoot + '/pages/financing/current.html');
                      return false;
                    }
                    if (validTrade!=1) {
                      $ui_dialog_trade.removeClass('hide');
                       $btn_link_trade.attr('href',Setting.staticRoot + '/pages/my-account/setting/dealPassword-setting.html');
                      $btn_default_trade.attr('href',Setting.staticRoot + '/pages/financing/current.html');  
                      return false;          
                    }
                    if (validTrade==1 && validName==1) {
                        var $this = $(this);
                        if($this.hasClass('disabled')){//按钮是否禁用
                            return false;
                        }
                        $this.addClass('disabled');
                        //window.location.href = Setting.staticRoot + '/pages/financing/currentbuy3.0.html?'+"jumpId=1&"+ $.param(_data);//七天乐购买页
                        window.location.href = Setting.staticRoot + '/pages/financing/currentbuy3.0.html?pid='+pid;//七天乐购买页
                        $this.removeClass('disabled');         
                    }
                }else{
                    alert('今日已售罄，明天再来吧');
                }
            }else{
                if(currentStartTime > currentTime){//未开始
                    alert('客官，抢购'+ currentStartTimeAlert +'开始哦');
                }else if(currentEndTime < currentTime){//已经结束
                    alert('今日已结束，明天再来吧');
                }
            } 
        });
    
    $('.currentlook').on('click',function(){
    var $this = $(this);
    if($this.hasClass('disabled')){//按钮是否禁用
        return false;
    }
    $this.addClass('disabled');
    window.location.href = Setting.staticRoot + '/pages/financing/currentDetail.html';//七天乐 产品详情页（三级页面）
    $this.removeClass('disabled');
});

//周周涨投资计息到期进度
//
//

//请求资产组合
    $.ajax({
        url:Setting.apiRoot1 + '/queryDebtInfo.p2p',
        type:"post",
        dataType:'json',
        data:{
            type:1
        }
    }).done(function(res){
        if(res.code==1){
            var arry = [];
            var pro = 0;
            var _resData = res.data;
            var _resLength = _resData.length;
            //判断资产详情是否满足6个
            if(_resLength < 4 ) {
                for(var i = 0; i < _resLength; i++) {
                    arry[i] = {y: parseFloat(_resData[i].eachPercent),name: _resData[i].loanPurpose };
                }
            } else {
                for(var i = 0; i < 4; i++) {
                    arry[i] = {y: parseFloat(_resData[i].eachPercent),name: _resData[i].loanPurpose};
                    pro += parseFloat(_resData[i].eachPercent);
                }
                arry[4] = {y:100 - pro,name:'其他'};
            }
            //资产组合圆环配比highcharts
            //var arry = [{//圆环默认值 自动计算百分比
            //    y: 99,
            //    name: '个人资金周转'
            //},
            //    {
            //    y: 2,
            //    name: '个人消费'
            //}, {
            //    y: 3,
            //    name: '扩大经营'
            //}, {
            //    y: 4,
            //    name: '装修'
            //},
            //    {
            //    y: 6,
            //    name: '其他'
            //}];

            $('#portfolioChart').highcharts({
                chart: {
                    plotBackgroundColor: null,
                    plotBorderWidth: null,
                    plotShadow: false,
                    marginRight: 200
                },
                colors:[
                    'rgb(86,122,191)',//第一个颜色
                    'rgb(248,231,53)',//第二个颜色
                    'rgb(251,155,65)',//第三个颜色
                    'rgb(219,69,72)',
                    'rgb(145,48,57)',
                ],
                title: {
                    text: ''
                },
                tooltip: {
                    pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>',
                    percentageDecimals: 1,
                    enabled: false
                },
                credits: {
                    enabled: false
                },
                plotOptions: {
                    pie: {
                        size:'100%',
                        innerSize: '50%',
                        borderWidth: 0,
                        allowPointSelect: false,
                        cursor: 'pointer',
                        dataLabels: {
                            enabled: false  //是否直接呈现数据 也就是外围显示数据与
                        },
                        point : {
                            events : {
                                legendItemClick: function() {
                                    return false;
                                }
                            }
                        },
                        showInLegend: true
                    }
                },
                legend: {
                    layout: 'vertical',
                    backgroundColor: '#FFFFFF',
                    floating: true,
                    align: 'right',
                    verticalAlign: 'middle',
                    labelFormatter: function () {
                        return this.name;
                    },
                    itemMarginTop: 6,
                    itemMarginBottom: 6,
                    x: -20 // = marginLeft - default spacingLeft
                },
                series: [{
                    type: 'pie',
                    name: 'Browser share',
                    states: {
                        hover: {
                            enabled: false
                        }
                    },
                    data:arry
                }]
            });
        }else{
            alert(res.message);
            return false;
        }
    }).fail(function(){
        alert('网络链接失败');
        return false
    });
//
//

});