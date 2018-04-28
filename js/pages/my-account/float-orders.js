/*
* @Author: User
* @Date:   2016-06-28 11:30:15
* @Last Modified by:   User
* @Last Modified time: 2016-08-15 17:52:41
*/

$(function(){

var $floatOrders = $('.float-orders');
var $info = $('.info');
var $safemode = $('.safemode');
var param = Common.getParam();
var userId = sessionStorage.getItem('uid');
var timeType=param.timeType;
var lineId=param.lineId;

var lineTitle = param.lineTitle;
var $lineTitle = $('.lineTitle');
$lineTitle.html(lineTitle);

// var status=param.status;
  var $tabcon1       = $('.noExpired');
  var $tabcon2       = $('.hadExpired');
    $info.removeClass('hide');
    $safemode.addClass('hide');
    $floatOrders.on('click', '.tab-info a', function(){
      var $this = $(this);
      $this.addClass('active').siblings('.active').removeClass('active');
      var target= $this.data('target');
      $('.' + target).removeClass('hide').siblings('.block-items').addClass('hide');
    });

 var setListData1 = doT.template([
    '{{~it :item:index}}',
    '<dl >',

    '<div class="item">',
      '<div class="floatinfo">',
      '<div class="expectInterest">预期收益(元):','</div>',
      '<div class="expectInterest special">{{=item.minSum }}~{{=item.maxSum }}','</div>',
       '<div class="currentWeight">初始净值(元):{{=item.startNetValue.toFixed(2)}}','</div>',
        '<div class="amount">持有金额(元):{{=item.holdAmount}}','</div>',
       
      '</div>',   
     '<div class="floatinfo2">',
     '<div class="yearrate">年化收益率:','</div>',
     '<div class="yearrate special">8%~33%','</div>',
     // '<div class="newNetValue">最新净值(元):{{=item.newNetValue.toFixed(2)}}','</div>',
     '<div class="endDate">{{=item.createTime}}投资','</div>',
     '<div class="endDate">{{=item.endDate}}到期','</div>',
     '</div>',
    '</div>',
   '</dl>',
    '{{~}}'
  ].join(''));

  var setListData2 = doT.template([
    '{{~it :item:index}}',
    '<dl >',

    '<div class="item">',
      '<div class="floatinfo">',
      '<div class="endInterest">最终收益(元):','</div>',
      '<div class="endInterest special">{{=item.endInterest}}','</div>',
        '<div class="currentWeight">初始净值(元)：{{=item.startNetValue.toFixed(2)}}','</div>',
         '<div class="amount">持有金额(元):{{=item.holdAmount}}','</div>',
      '</div>',   
     '<div class="floatinfo2">',
     '<div class="yearRate">最终年化利率:','</div>',
     '<div class="yearRate special">{{=item.yearRate}}','</div>',
     //'<div class="newNetValue">最终净值(元):{{=item.endNetValue.toFixed(2)}}','</div>',
      '<div class="endDate">{{=item.createTime}}投资','</div>',
      '<div class="endDate">{{=item.endDate}}到期','</div>',
     '</div>',
    '</div>',
   '</dl>',
    '{{~}}'
  ].join(''));

$.ajax({
    url:Setting.apiRoot1 + '/u/queryMyFloatInterestLoanIfExpire.p2p',
    type:"post",
    dataType:'json',
    data:{
     userId:userId,
     timeType:timeType,
     lineId:lineId,
     loginToken:sessionStorage.getItem('loginToken'),
     status:0
    }
  }).done(function(res){
      if(res.code==1){
        var data = res.data.floatInterestList;
        
        var list =[];
      //var minSum = 0;
       //var maxSum = 0;
       for(var i=0;i<data.length;i++){
        var fullLength =(timeType).toString().length;
        var last = timeType.toString().substr(fullLength-1, 1);
        var front = timeType.toString().substr(0, fullLength-1);
        if( last==1){
            list[i] = front / 365;//日
           }else if(last==2){
            list[i] = front*30 /365;//月
           }else if(last == 3){
            list[i] =front*365 /365;//年
           }else if(last == 4){
            list[i] = front*7 /365;//周
           }
          // data[i].percent = list[i];
          //alert(data[i].holdAmount);
           data[i].minSum = (list[i]*data[i].holdAmount*0.08).toFixed(2);
           //alert(data[i].minSum.toFixed(2));
           data[i].maxSum = (list[i]*data[i].holdAmount*0.33).toFixed(2);
           //alert(data[i].maxSum);
       }
        
        $tabcon1.html(setListData1(data));
      }else{
        alert(res.message);
          return false;
      }

  }).fail(function(){
    alert('网络链接失败');
    return false
  });

$.ajax({
    url:Setting.apiRoot1 + '/u/queryMyFloatInterestLoanIfExpire.p2p',
    type:"post",
    dataType:'json',
    data:{
     userId:userId,
     timeType:timeType,
     lineId:lineId,
     loginToken:sessionStorage.getItem('loginToken'),
     status:1
    }
  }).done(function(res){
      if(res.code==1){
      var data = res.data.floatInterestList;
      
       
        $tabcon2.html(setListData2(data));
      }else{
        alert(res.message);
          return false;
      }

  }).fail(function(){
    alert('网络链接失败');
    return false
  });


 $floatOrders.on('click','.btn',function() {
    
      $.ajax({
    url:Setting.apiRoot1 + '/u/detailBuyGoTo.p2p',
    type:"post",
    dataType:'json',
    data:{
      type:4,
      userId:userId,
      loginToken:sessionStorage.getItem('loginToken'),
      timeType:timeType
    }
  }).done(function(res){
      if(res.code==1){
          var data =res.data;
         // alert(data);
        // for(var i=0; i<data.length;i++){
        //    //alert(data[i].timeType);
        
        // }
        var balanceAccount=data.accountAmt;
        var pid=data.loanId;
        var pname=data.loanTitle;
        var pmount=data.amount;
        var minInvestAmount=data.minLimit;
        var maxInvestAmount=data.maxInvestAmount;
        var minInterest=data.minInterest;
         var weightValue=data.weightValue;
         window.location.href = Setting.staticRoot + '/pages/financing/floatbuy.html?pid='+pid+'&pname='+pname+'&pmount='+pmount+'&balanceAccount='+balanceAccount+'&minInterest='+minInterest+'&minInvestAmount='+minInvestAmount+'&maxInvestAmount='+maxInvestAmount+'&weightValue='+weightValue;

      }else{
        alert(res.message);
          return false;
      }

  }).fail(function(){
    alert('网络链接失败');
    return false
  });
    //pid=1310&pname=择时稳赢一期&pmount=354497&minInterest=949.315068&minInvestAmount=5000&maxInvestAmount=500000&weightValue=%201.27&balanceAccount=9529404.86

    
});
  
  

});


