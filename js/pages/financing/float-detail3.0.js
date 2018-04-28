/*
* @Author: User
* @Date:   2016-09-09 09:52:55
* @Last Modified by:   User
* @Last Modified time: 2017-03-09 14:51:20
*/
$(function(){
var isWeiXin = Common.isWeiXin();//微信进来的访问判断，不是跳转到官网下载页
var param = Common.getParam();
var pid=param.pid;
var investCycle=param.investCycle;
var pname=param.pname;
var pmount=param.pmount;
var buyStatus=param.buyStatus;
//var $canBuyAmt=$('.canBuyAmt');
var $prodTitle=$('.prod-title');
var $floatChart=$('.floatChart');
var $floatimg=$('.floatimg');
var $firstMonth=$('.firstMonth');
var $newNetValue=$('.newNetValue');
var $newYearRate=$('.newYearRate');
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
var floatxAxis = [];
var floatyAxis = [];
var floatweight=[];

 if(null != pmount && '' != pmount && undefined != pmount) {
     $('.float_amount').html((Common.comdify(parseFloat(pmount))));
 }

if (buyStatus==2) {
    $('.buy_btn').html('立即抢购');
    valuelineFalse();
}else if (buyStatus==20) {
    $('.buy_btn').removeClass('buy_btn').addClass('buy_gray').html('预约中');
    valuelineFalse();
}else{
    $('.buy_btn').removeClass('buy_btn').addClass('buy_gray').html('已售罄');
    $('.p8').hide();
    // $floatimg.hide(); 
    // $floatChart.show(); 
    valueline();
    $('.floatimg-title').html('择时稳赢最新走势图');
}

//$canBuyAmt.text('可购金额：'+Common.comdify(pmount));
if(weixin){
  Common.weixinLogin(weixin);
}
document.title=pname;

$('.close').on('click',function(){
    $('.ui-dialog').addClass('hide');
}); 

$('.buy_btn').on('click',  function(){
        $this=$(this);
        if ($this.hasClass('disabled')) {
            return false;
        }
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
           window.location.href =  '../../pages/financing/floatbuy3.0.html?'+ $.param(param);
        }

});

$('.look').on('click',function(){
    var $this = $(this);
    if($this.hasClass('disabled')){//按钮是否禁用
        return false;
    }
    $this.addClass('disabled');
    window.location.href = Setting.staticRoot + '/pages/financing/floatDetail.html?pid='+pid+'&investCycle='+investCycle;//浮动 产品详情页（三级页面）
    $this.removeClass('disabled');
});

//浮动收益净值图表
function valueline(){
    $.ajax({
        url: Setting.apiRoot1 + '/queryNetValueLineByLoanId.p2p',
        type: 'post',
        dataType: 'json',
        async:false,
        data:{
                loanId:pid,
                prodType:4
        }
    }).done(function(res){
        Common.ajaxDataFilter(res,function(){
        $('.floatYearRate').html(res.data.newYearRate);
        $firstMonth.html(res.data.firstMonth);
        $newNetValue.html(res.data.newNetValue);
        $newYearRate.html(res.data.newYearRate);
        var data=res.data.list;
        var datalength=data.length;
       for(var i=0; i<datalength;i++){
               var createTime = data[i].createTime;
               floatxAxis[i]=createTime;
               var stockIndex = data[i].stockIndex;//上证指数
               floatyAxis[i]=stockIndex;
               var weightValue=data[i].weightValue;
               floatweight[i]=weightValue;
       }       
        if(res.code == -1){
        alert('查询失败');
        return false;
        }
        })

    }).fail(function(){
    alert('网络链接失败');
    });
}

function valuelineFalse(){
    $.ajax({
        url: Setting.apiRoot1 + '/queryNetValueLineByLoanIdFalse.p2p',
        type: 'post',
        dataType: 'json',
        async:false
    }).done(function(res){
        Common.ajaxDataFilter(res,function(){
        $firstMonth.html(res.data.firstMonth);
        $newNetValue.html(res.data.newNetValue);
        $newYearRate.html(res.data.newYearRate);
        var data=res.data.list;
        console.log(data);
        var datalength=data.length;
       for(var i=0; i<datalength;i++){
               var createTime = data[i].createTime;
               floatxAxis[i]=createTime;
               var stockIndex = data[i].stockIndex;//上证指数
               floatyAxis[i]=stockIndex;
               var weightValue=data[i].weightValue;
               floatweight[i]=weightValue;
       }       
        if(res.code == -1){
        alert('查询失败');
        return false;
        }
        })

    }).fail(function(){
    alert('网络链接失败');
    });
}

    var maxyAxis=floatyAxis.sort()[floatyAxis.length-1];//最大上证指数
    var minyAxis=floatyAxis.sort()[0];//最小上证指数
    var maxWeight=floatweight.sort()[floatweight.length-1];//最大择时稳赢
    var minWeight=floatweight.sort()[0];//最小择时稳赢
    var maxY=Math.max(maxyAxis,maxWeight);//Y轴最大刻度;
    var minY= Math.min(minyAxis,minWeight);//Y轴最小刻度;

            // 
            // highcharts自适应
            Highcharts.chart('floatChart', {
                chart: {
                    type: 'line',
                },
                title: {
                    align:'left',
                    text: '',
                    style: {
                        color: '#666',
                        // fontWeight: 'bold',
                        fontSize:'0.32rem'
                    }
                },
                credits: {
                    enabled: false
                },
                xAxis: {
                    categories: floatxAxis,
                    tickInterval: 2,
                    tickWidth: 1,
                    lineColor: '#E6E6E6',
                    lineWidth: 1
                },
                yAxis: {
                    max: maxY,
                    min:  minY,
                    title: {
                        text: ''
                    },
                    // gridLineWidth: 0
                },
                tooltip: {
                    enabled: false
                },
                 legend: {
                    enabled: false,
                    align: 'right',
                    verticalAlign: 'top',
                    itemStyle: {
                        color: '#666',
                        fontSize:'0.3173rem'
                    }
                },
                plotOptions: {
                    line: {
                        dataLabels: {
                            enabled: false
                        },
                        enableMouseTracking: false
                    },
                    series: {
                        marker: {
                            enabled: false
                        }
                    }
                },
                series: [
                {
                    // type: 'area',
                    // name: '择时稳赢',
                    data: floatweight,
                    color: '#FF791F'
                },{
                    // type: 'area',
                    // name: '上证指数',
                    data: floatyAxis,
                    color: '#B1B3FF'
                }
                ]
            });
    //资产详情图表
    $.ajax({
        url: Setting.apiRoot1 + '/queryDebtInfoForFloatByLoanId.p2p',
        type: 'post',
        async:false,
        dataType: 'json',
        data: {
            type:4,
            loanId: pid
        }
    }).done(function(res){
        Common.ajaxDataFilter(res, function(data){
            console.log(data)
            if(data.code == 1){
                var _resData = data.data;
                var _resLength = _resData.length;
                var pro = 0;
                var arry = [];
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
                if(_resLength){
                    $("#portfolioChart").css('display',"block");
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
                            x: -20, // = marginLeft - default spacingLeft
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
                }
            }
        });
    }).fail(function(){
        alert('网络链接失败，请刷新重试！');
        return false;
    });




});