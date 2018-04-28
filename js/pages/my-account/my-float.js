/*
* @Author: User
* @Date:   2016-06-27 20:11:39
* @Last Modified by:   User
* @Last Modified time: 2016-07-04 16:28:39
*/
$(function(){
    
var $tabcon       = $('.floatList');
var $floatTotalAsset       = $('.float-totalAsset');
var $minInterest = $('.minInterest');
var $maxInterest      = $('.maxInterest');
var $totalInterest       = $('.totalInterest');
var $checktrend       = $('.checktrend');
var $check       = $('.check');
var floatHasmoney;
 var param = Common.getParam();

var userId = sessionStorage.getItem('uid');

 var setListData = doT.template([
    '{{~it :item:index}}',
    '<dl >',

    '<div class="item">',
    '<div class="examine">{{=item.lineTitle}}',
    '<a class="checktrend"   href="../../pages/my-account/float-trend.html?lineId={{=item.lineId}}">查看净值走势','</a>',
    '<a class="check"   href="../../pages/my-account/floatPortfolio.html?lineId={{=item.lineId}}&floatHasmoney={{=item.floatHasmoney}}">查看资产组合','</a>',
    '</div>',
     '<a class="orders" href="float-orders.html?timeType={{=item.timeType}}&lineId={{=item.lineId}}&lineTitle={{=item.lineTitle}}">',
      '<div class="round">8%~{{=item.rate}}%','</div>',
      '<div class="floatinfo">',
      	'<div class="amount">在投金额(元):{{=item.amount}}','</div>',
	'<div class="currentWeight">预期收益(元):{{=(item.percent*item.amount*0.08).toFixed(2)}}~{{=(item.percent*item.amount*item.rate/100).toFixed(2)}}','</div>',
      '</div>',   
     '<div class="arrow">','</div>',
     '</a>',
    '</div>',
   '</dl>',
    '{{~}}'
  ].join(''));

  $.ajax({
    url:Setting.apiRoot1 + '/u/queryMyFloatInterestLoan.p2p',
    type:"post",
    dataType:'json',
    data:{
      type:4,
      // purposeCode: purposeCode,
      loanType:1,
      userId:userId,
      loginToken:sessionStorage.getItem('loginToken')
    }
  }).done(function(res){
      if(res.code==1){
        var data = res.data.myFloatInterestInvestList;
        
        var list =[];
        var min= 0;
        var max= 0;
        // var min;
        // var max;
        for(var i=0; i<data.length;i++){
        	 //alert(data[i].timeType);
        	 var fullLength =(data[i].timeType).toString().length;
        	 var last = data[i].timeType.toString().substr(fullLength-1, 1);
        	 var front = data[i].timeType.toString().substr(0, fullLength-1);
        	 
        	 if( last==1){
        	 	list[i] = front / 365;//日
        	 }else if(last==2){
        	 	list[i] = front*30 /365;//月
        	 }else if(last == 3){
        	 	list[i] =front*365 /365;//年
        	 }else if(last == 4){
        	 	list[i] = front*7 /365;//周
        	 }
        	 data[i].percent = list[i];
        	 //minSum = minSum +list[i]*data[i].amount*0.08;
           min= parseFloat(min+data[i].percent*data[i].amount*0.08);
           minSum=min.toFixed(2);
        	 max= parseFloat(max+ data[i].percent*data[i].amount*(data[i].rate/100));
           maxSum=max.toFixed(2);
           
           data[i].floatHasmoney = res.data.floatInterestAmtSum;
           //alert(data[i].floatHasmoney);
        	 // max=maxSum.toFixed(2);
        	 //var percent=list[i];
        	 // alert(data[i].timeType);
        }
       
        floatHasmoney=res.data.floatInterestAmtSum;
        //alert(floatHasmoney);
        $tabcon.html(setListData(data));
        $floatTotalAsset.html(floatHasmoney);
        //alert(res.data.floatInterestAmtSum);
          
	$minInterest.text(minSum);
	$maxInterest.text(maxSum);
	$totalInterest.text((res.data.totalInterest).toFixed(2));
	
      }else{
        alert(res.message);
          return false;
      }

  }).fail(function(){
    alert('网络链接失败');
    return false
  });
   
});