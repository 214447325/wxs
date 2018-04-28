/*
* @Author: User
* @Date:   2016-09-09 09:52:55
* @Last Modified by:   User
* @Last Modified time: 2017-03-09 14:50:30
*/
$(function(){
var isWeiXin = Common.isWeiXin();//微信进来的访问判断，不是跳转到官网下载页
var param = Common.getParam();
// 特殊用户
if(param.special == 5){
    console.log('/week14Ploan')
    $.ajax({
        url:Setting.apiRoot1 + '/week14Ploan.p2p',
        dataType:'json',
        type:'POST',
        async:false,
    }).done(function(res){
        if(res.code == 1){
            pid=res.data.prodId;
            pname=res.data.prodTitleNew;
            minRate=res.data.minRate;
            maxRate=res.data.maxRate;
            addRate=res.data.addRate;

            // act10=res.data.act10;
            buyStatus=res.data.buyStatus;
            addInterest=res.data.addInterestLabel;

            // weixin = res.data.weixin;
            cycle=res.data.cycleType;
            detailLabel=res.data.detailLabel;

            pmount = res.data.canBuyAmt; //可投余额
            cycle=res.data.loanCycle;//周期
            minInvestAmount=res.data.minBuyAmt;//起头金额
        }
    })
}else{
    var pid=param.pid;
    var pname=param.pname;
    var minRate=param.minRate;
    var maxRate=param.maxRate;
    var addRate=param.addRate;
    var pmount=param.pmount;
    var act10=param.act10;
    var buyStatus=param.buyStatus;
    var addInterest=param.addInterest;

    var weixin = param.weixin;
    var cycle=param.cycle;
    var detailLabel=param.detailLabel;

    var pmount = param.pmount; //可投余额
    var cycle=param.cycle;//周期
    var minInvestAmount=param.minInvestAmount;//起头金额
}
// var pid=param.pid;
// var pname=param.pname;
// var minRate=param.minRate;
// var maxRate=param.maxRate;
// var addRate=param.addRate;
// var pmount=param.pmount;
// var act10=param.act10;
// var buyStatus=param.buyStatus;
// var addInterest=param.addInterest;
var $prodTitle=$('.prod-title');
var $showRate=$('.showRate');
var $addLabel=$('.p-label');
// var weixin = param.weixin;
// var cycle=param.cycle;
// var detailLabel=param.detailLabel;
var userId =sessionStorage.getItem('uid');
var validName =sessionStorage.getItem('validName');//获取用户实名
var validTrade =sessionStorage.getItem('validTrade');//获取用户交易密码
// 是否可以购买三周标
var week3 = 1;
var week3Level10000 = 1;
var week3Level30000 = 1;
var week3Level50000 = 1;

var $ui_dialog_name = $('.ui-dialog-name');
var $btn_link_name  = $('.btn-link-name',$ui_dialog_name);
var $btn_default_name = $('.btn-default-name',$ui_dialog_name);
var $ui_dialog_trade = $('.ui-dialog-trade');
var $btn_link_trade  = $('.btn-link',$ui_dialog_trade);
var $btn_default_trade = $('.btn-default',$ui_dialog_trade); 
var $addInterest = $('.addInterest');
$addInterest.text(addInterest);
// var pmount = param.pmount; //可投余额
// var cycle=param.cycle;//周期
// var minInvestAmount=param.minInvestAmount;//起头金额





// 14周
var loanCycle14 = 0;
var isAmt = 0;
var levelRate = 0;
if(null != pmount && '' != pmount && undefined != pmount) {
    $('.cast').html((Common.comdify(parseFloat(pmount).toFixed(0))));
} else {
    $('.cast').html(0);
}

if(null != cycle && '' != cycle && undefined != cycle) {
    $('.cycle').html(cycle);
} else {
    $('.cycle').html('--');
}

if(null != minInvestAmount && '' != minInvestAmount && undefined != minInvestAmount) {
    $('.minInvestAmount').html(minInvestAmount);
} else {
    $('.minInvestAmount').html(100);
}
var newProd= sessionStorage.getItem('newProd');//登录接口新增返回字段：newProd，是否可买新手标，1代表可买，0代表不可买
var flag = pname.indexOf('新手标');
if (flag > -1 && newProd== '0') {
    $('.buy_btn').removeClass('buy_btn').addClass('buy_gray').html('已购买');
}

if (buyStatus==2) {
    $('.buy_btn').html('立即加入');
    if(pname.indexOf('3周') > -1 && (minRate+addRate)!= 14){
        $.ajax({
            url:Setting.apiRoot1 + "/u/checkUser3Week.p2p",
            type:'post',
            dataType:'json',
            async:false,
            data:{
                userId : userId,
                loginToken : sessionStorage.getItem('loginToken')
            }
        }).done(function(res){
            Common.ajaxDataFilter(res,function(){
                if(res.code == 1){
                    week3 = res.data.week3;
                    week3Level10000 = res.data.week3Level10000;
                    week3Level30000 = res.data.week3Level30000;
                    week3Level50000 = res.data.week3Level50000;
                }else{
                    Common2.toast(res.message);
                }
            })
        }).fail(function(res){
            Common2.toast('网络异常',Setting.staticRoot+'/images/pages/ui/wifi.png');
            return false;
        })
        if(week3 == 0){
            $('.buy_btn').removeClass('buy_btn').addClass('buy_gray').addClass('no_buy');
            $('.no_buy').on('click',function(){
                Common2.toast('您不符合购买条件，详情请参照“3周专享活动”规则');
            })
        }else if(week3 == 1 && week3Level10000 == 0 && week3Level30000 == 0 && week3Level50000 == 0){
            $('.buy_btn').removeClass('buy_btn').addClass('buy_gray').addClass('no_buy');
            $('.no_buy').on('click',function(){
                Common2.toast('每一个金额档次只能投资一次，请勿重复购买');
            })
        }
    }
    if(pname.indexOf('14') > -1){
        $.ajax({
            url:Setting.apiRoot1 + '/u/queryUser14Week.p2p',
            type:"POST",
            dataType:'json',
            async:false,
            data:{
                userId:userId,
                loginToken:sessionStorage.getItem('loginToken')
            }
        }).done(function(res){
            if(res.code == 1){
                var data = res.data;
                var isAmt = data.maxPurchasedAmt - data.purchasedAmt;//最大限额 - 已购买额度
                if(isAmt <= 0){
                    $('.buy_btn').removeClass('buy_btn').addClass('buy_gray');
                    $('.buy_gray').on('click',function(){
                        Common2.toast('可投余额不足');
                    })
                }
            }
        })
    }

}else if (buyStatus==20) {
    $('.buy_btn').removeClass('buy_btn').addClass('buy_gray').html('预约中');
}else{
    $('.buy_btn').removeClass('buy_btn').addClass('buy_gray').html('募集完成');
    // $('.p6').hide();
    $('.cast').text('--')
}

if(weixin){
  Common.weixinLogin(weixin);
}

if (flag > -1) {
    document.title=pname;
} else {
    // document.title=cycle+'周定期';
    document.title=pname;
}

    var myDay = new Date();
    var date2 = new Date(myDay);
    date2.setDate(myDay.getDate() + (cycle * 7));
    var year = date2.getFullYear();
    var month = date2.getMonth() + 1;
    month = month < 10 ? ('0' + month) : month;
    var day3 = date2.getDate();
    day3 = day3 < 10 ? ('0' + day3) : day3;
    // $('.day1').html(GetDateStr(0));
    $('.day2').html(GetDateStr(1));
    // $('.day3').html(year + '-'+ month + '-' + day3);
    $('.day3').html(month + '-' + day3);


if (minRate==maxRate && addRate==0) {
    $showRate.html(parseFloat(minRate).toFixed(1) + '<span style="font-size:0.32rem;display: inline-block;vertical-align:bottom;margin-top: -0.23rem;">%</span>');
}
if (minRate==maxRate && addRate!=0) {
    $showRate.html(parseFloat(minRate).toFixed(1)+'<span style="font-size:0.32rem;display: inline-block;vertical-align:bottom;margin-top: -0.23rem;">%+'+parseFloat(addRate).toFixed(1)+'%</span>');
}
if (minRate!=maxRate && addRate==0) {
    $showRate.html(parseFloat(minRate).toFixed(1)+ '<span style="font-size:0.32rem;display: inline-block;vertical-align:bottom;margin-top: -0.23rem;">%~</span>'+parseFloat(maxRate).toFixed(1) + '<span style="font-size:0.32rem;display: inline-block;vertical-align:bottom;margin-top: -0.23rem;">%</span>');
}
if (minRate!=maxRate && addRate!=0) {
    $showRate.html(parseFloat(minRate).toFixed(1)+'<span style="font-size:0.32rem;display: inline-block;vertical-align:bottom;margin-top: -0.23rem;">%~</span>'   +-parseFloat(maxRate).toFixed(1)+'<span style="font-size:0.2rem;display: inline-block;vertical-align:bottom;margin-top: -0.23rem;">%+</span>'+parseFloat(addRate).toFixed(1)) + '<span style="font-size:0.32rem;display: inline-block;vertical-align:bottom;margin-top: -0.23rem;">%</span>';
}


/*产品详情选项卡*/
var zczhTitle = $('.zczh-title');

zczhTitle.on('click',function(item,index){
    var index = $(this).index();
    zczhTitle.removeClass('active');
    $(this).addClass('active');
    console.log($('.swiper-pagination').find('span').eq(index));
    $('.swiper-pagination-bullet').eq(index).click()
    // $('.swiper-slide').removeClass('swiper-slide-active');
    // $('.swiper-slide').eq(index).addClass('swiper-slide-active');
})
new Swiper ('.swiper-container', {
    loop: false,
    pagination:'.swiper-pagination',
     paginationClickable :true,
    onSlideChangeEnd: function(swiper){
        index=swiper.activeIndex;
        zczhTitle.removeClass('active');
        zczhTitle.eq(index).addClass('active');
    }
});



if (detailLabel.length>0) {
    $addLabel.removeClass('hide');
}

$('.close').on('click',function(){
    $('.ui-dialog').addClass('hide');
}); 
$('.buy_btn').on('click',  function(){
        if(!userId){
        Common.toLogin();
        return false;
        }
        if (validName!=1) {
          $ui_dialog_name.removeClass('hide');
           $btn_link_name.attr('href',Setting.staticRoot + '/pages/my-account/setting/real-name.html');
          $btn_default_name.attr('onclick','window.location.reload();');
          return false;
        }
        if (validTrade!=1) {
          $ui_dialog_trade.removeClass('hide');
           $btn_link_trade.attr('href',Setting.staticRoot + '/pages/my-account/setting/dealPassword-setting.html');
          $btn_default_trade.attr('onclick','window.location.reload();');
          return false;          
        }
        if (validTrade==1 && validName==1) {
            var detailLength = pname.length;
            var pnameName = pname.substr(0, detailLength - 1)
            //window.location.href = '../../pages/financing/buy3.0.html?'+ $.param(param);
            window.location.href = '../../pages/financing/buy3.0.html?pid='+pid;//定期购买页
        }
});

$('.zczh').on('click',function(){
    var $this = $(this);
    if($this.hasClass('disabled')){//按钮是否禁用
        return false;
    }
    $this.addClass('disabled');
    window.location.href = Setting.staticRoot + '/pages/financing/regularDetail.html?cycle='+cycle;//七天乐 产品详情页（三级页面）
    $this.removeClass('disabled');
});

    $.ajax({
        url:Setting.apiRoot1 + '/queryDebtInfo.p2p',
        type:"post",
        dataType:'json',
        data:{
            type:3
        }
    }).done(function(res){
        if(res.code==1){
            var arry = [];
            var pro = 0;
            var _resData = res.data;
            var _resLength = _resData.length;
            //判断资产详情是否满足5个
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
                    x: -20// = marginLeft - default spacingLeft
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
            Common2.toast(res.message);
            return false;
        }

    }).fail(function(){
        Common2.toast('网络异常',Setting.staticRoot+'/images/pages/ui/wifi.png');
        return false
    });

    $.ajax({
        url:Setting.apiRoot1 +'/prodPurchaseTime.p2p',
        type:'POST',
        dataType:'json',
        data:{
            loanCycle:cycle
        }
    }).done(function(res){
        Common.ajaxDataFilter(res,function(){
            console.log(res)
            if(res.code == 1){
                $('.lockTime').text(res.data.lockTime);
                $('.startTime').text(res.data.startTime);
                $('.endTime').text(res.data.endTime);
            }
        })
    })
});

function GetDateStr(AddDayCount) { 
      var dd = new Date(); 
      dd.setDate(dd.getDate()+AddDayCount);//获取AddDayCount天后的日期 
      var y = dd.getFullYear(); 
      var m = dd.getMonth()+1;//获取当前月份的日期 
      m = m < 10 ? ('0' + m) : m;
      var d = dd.getDate(); 
      d = d < 10 ? ('0' + d) : d;
      return m+"-"+d; 
      // return y+"-"+ m+"-"+d; 
    } 