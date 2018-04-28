// 周周涨产品详情

$(function(){

  var $current_account = $('.current-account');
  var $question_one = $('.question-one');
  var $question_two = $('.question-two');
  var $know=$('.know');
  var $knew=$('.knew');
  var $yesterdayIncome= $('.yesterdayIncome',$current_account); //昨日周周涨收益
  var $currentRate    = $('.currentRate',$current_account);//今日周周涨收益率
  var $hadShare       = $('.hadShare',$current_account); //周周涨持有份额
  var $totalInterest  = $('.totalInterest',$current_account);//累计收益
  var $check  = $('.check',$current_account);
  var $buy_btn=$('.currentbuy',$current_account);
  var hadShare;
  var param = Common.getParam();  

  var userId = sessionStorage.getItem('uid');

  if(!userId){
    Common.toLogin();
    return false;
  }

  $.ajax({
    url: Setting.apiRoot1 + '/u/queryMyCurrentLoan.p2p',
    type: 'post',
    dataType: 'json',
    data:{
      userId:userId,
      loginToken:sessionStorage.getItem('loginToken')
    }
  }).done(function(res){
    Common.ajaxDataFilter(res,function(){
      var data = res.data;
      $yesterdayIncome.text((data.yesterdayIncome).toFixed(2));
      $currentRate.text((data.totalRate).toFixed(2) + '%');
      $hadShare.text('￥' + Common.comdify((data.hadShare).toFixed(2)));
      $totalInterest.text('￥' + (data.totalInterest).toFixed(2));
      hadShare=data.hadShare;

      if(res.code == -1){
        alert('查询失败');
        return false;
      }
    })

  }).fail(function(){
    alert('网络链接失败')
  });

  $check.on('click',  function(){
       window.location.href = "currentPortfolio.html?hadShare="+hadShare;
     });

   $question_one.on('click',  function(){
         document.getElementById("question1").style.display='block';
  });
   $know.on('click',  function(){
         document.getElementById("question1").style.display='none';
  });

     $question_two.on('click',  function(){
         document.getElementById("question2").style.display='block';
  });
   $knew.on('click',  function(){
         document.getElementById("question2").style.display='none';
  });
 //从我的七天乐进入点击购买
 $current_account.on('click','.currentbuy',function() {
  Common.queryProductInfo(1,1, function(res){
      if(res.code != 1){
        alert(res.message);
        return false;
      }

      var data = res.data[0];
      var _data = {
        pid: data.productId,
        pname: data.title,
        pmount: data.amount,
        minInterest: data.minInterest,
        minInvestAmount: data.minInvestAmount,
        maxInvestAmount: data.maxInvestAmount,
        type:'current'
      };

       window.location.href = Setting.staticRoot+'/pages/financing/currentbuy.html?' +"jumpId=2&"+ $.param(_data);

    }); 


});

});
