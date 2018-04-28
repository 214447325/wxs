/*
* @Author: User
* @Date:   2016-07-06 16:18:34
* @Last Modified by:   User
* @Last Modified time: 2016-08-15 17:44:15
*/
function getNowFormatDate() {
    var date = new Date();
    var seperator1 = "-";
    var seperator2 = ":";
    var year = date.getFullYear();
    var month = date.getMonth() + 1;
    var strDate = date.getDate();
    if (month >= 1 && month <= 9) {
        month = "0" + month;
    }
    if (strDate >= 0 && strDate <= 9) {
        strDate = "0" + strDate;
    }
    var currentdate = year + seperator1 + month + seperator1 + strDate;
    return currentdate;
}

function addDate(date,days){ 
       var d=new Date(date); 
       d.setDate(d.getDate()+days); 
       var m=d.getMonth()+1; 
       return d.getFullYear()+'-'+m+'-'+d.getDate(); 
     } 

$(function(){

var $floatOrders = $('.float-orders');
var $info = $('.info');
var $safemode = $('.safemode');
var param = Common.getParam();
var userId = sessionStorage.getItem('uid');//用户id
var timeType=param.timeType;//周期+周期类型 
var title = param.title;
var $lineTitle = $('.lineTitle');
$lineTitle.html(title);

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
        '<div class="amount">持有金额(元):','</div>',
        '<div class="amount special">{{=item.amount}}','</div>',
        '{{?item.isShowReward == 1}}',
        '<div class="expectInterest" >奖品:<span style="color: #ff0000">{{="iPhone7" }}</span>','</div>',
     '{{??}}',
     '<div class="expectInterest">预期收益(元):{{=item.expectInterest }}','</div>',
     '{{?}}',
     '</div>',
     '<div class="floatinfo2">',
        // '<div class="yearrate">年化收益率:','</div>',
        // '<div class="yearrate special">{{=item.yearRate}}%','</div>',
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
      '持有金额(元):<div class="amount special">{{=item.amount}}','</div>',
      '{{?item.isShowReward == 1}}',
      '<div class="expectInterest">奖品:<span style="color: #ff0000">{{="iPhone7" }}</span>','</div>',
      '{{??}}',
      '<div class="endInterest ">预期收益(元):{{=item.expectInterest }}','</div>',
      '{{?}}',
      '</div>',   
     '<div class="floatinfo2">',
     // '最终年化利率:<div class="yearRate special">{{=item.yearRate}}','</div>',
     '<div class="endDate">{{=item.createTime}}投资','</div>',
      '<div class="endDate">{{=item.endDate}}到期','</div>',
     '</div>',
    '</div>',
   '</dl>',
    '{{~}}'
  ].join(''));

$.ajax({
    url:Setting.apiRoot1 + '/u/queryMyRegularLoanIfExpire.p2p',
    type:"post",
    dataType:'json',
    data:{
     userId:userId,
     timeType:timeType,
     loginToken:sessionStorage.getItem('loginToken'),
     status:0
    }
  }).done(function(res){
      if(res.code==1){
        var data = res.data.regularList;
        
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
           // data[i].minSum = (list[i]*data[i].holdAmount*0.08).toFixed(2);
           // data[i].maxSum = (list[i]*data[i].holdAmount*0.33).toFixed(2);
           //alert(data[i].maxSum);
           // alert(data[i].endDate);
           data[i].expectInterest = (list[i]*data[i].amount*(data[i].yearRate/100)).toFixed(2);
           if (data[i].endDate==null) {
            addDate(getNowFormatDate(),front*7);
            data[i].endDate=addDate(getNowFormatDate(),front*7);
            //data[i].endDate=getNowFormatDate();
           }
           
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
    url:Setting.apiRoot1 + '/u/queryMyRegularLoanIfExpire.p2p',
    type:"post",
    dataType:'json',
    data:{
     userId:userId,
     timeType:timeType,
     loginToken:sessionStorage.getItem('loginToken'),
     status:1
    }
  }).done(function(res){
      if(res.code==1){
      var data = res.data.regularList;
      
       
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
      type:3,
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
        var yearRate=data.yearRate;
        var cycle=data.loanCycle;
        var cycleType=data.cycleType;
         //我的固收详情页购买跳转
         if(res.data.spEvents == 1) {
             window.location.href =  Setting.staticRoot + '/pages/financing/buy1.html?jumpId=2&pid='+pid+'&pname='+pname+'&pmount='+pmount+'&balanceAccount='+balanceAccount+'&minInterest='+minInterest+'&minInvestAmount='+minInvestAmount+'&maxInvestAmount='+maxInvestAmount+'&yearRate='+yearRate+'&timeType='+timeType+'&title='+title+'&cycle='+cycle+'&cycleType='+cycleType;
         } else {
             window.location.href = Setting.staticRoot + '/pages/financing/buy.html?jumpId=2&pid='+pid+'&pname='+pname+'&pmount='+pmount+'&balanceAccount='+balanceAccount+'&minInterest='+minInterest+'&minInvestAmount='+minInvestAmount+'&maxInvestAmount='+maxInvestAmount+'&yearRate='+yearRate+'&timeType='+timeType+'&title='+title+'&cycle='+cycle+'&cycleType='+cycleType;
         }

      }else{
        alert(res.message);
          return false;
      }

  }).fail(function(){
    alert('网络链接失败');
    return false
  });
   
});
	
	

});