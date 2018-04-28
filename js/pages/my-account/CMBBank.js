/**
 * CMBBank.js
 * @author zyx
 * @return {[type]}       [description]
 */
$(function(){

  var param = Common.getParam();
  var confirmData = {};
  var $topUp = $('.top-up');
  var uid = sessionStorage.getItem("uid");
  var $bankcard = $('input[name=bankcard]');
  var $bank = $('input[name=bank]');
  var $money = $('input[name=money]');
  var $acctName = $('input[name=acctName]');
  var $order_no = $('input[name=order_no]');
  var $merchant_id = $('input[name=merchant_id]');
  var $encryptkey = $('input[name=encryptkey]');
  var $data = $('input[name=data]');
  var $submit1 = $('input[name=submit1]');
  var $cancel1 = $('input[name=cancel1]');
  var $submit2 = $('input[name=submit2]');
  var $cancel2 = $('input[name=cancel2]');
  var $check_code = $('input[name=check_code]');
  var $sendSmsAgain = $('input[name=sendSmsAgain]');
  
  if(param.result_code==undefined || param.result_code==''){
	  //没有返回result_code，是由充值页跳转进来
  }else{
	  //鉴权页面返回来，进行处理
	  var code = param.result_code;
	  if(code!='' && code.length>1){
		  if(code=='0000'){
			  var maskLayer=document.getElementById('maskLayer');
	    	  var verification =document.getElementById('verification');
	    	  maskLayer.style.display='block';
	    	  verification.style.display='block';
	    	  //确认支付的参数对象赋值
			  confirmData.userId = param.userId;
			  confirmData.order_no = param.order_no;
		  }else{
			  window.location.href = Setting.staticRoot + '/pages/my-account/myAccount.html';
		  }
	  }
  }
  	
  //Data init 充值表单内容
  $bankcard.val(param.cardNo);
  $bank.val(param.bankName);
  $acctName.val(param.acctName);
  $order_no.val(param.order_no);
  $merchant_id.val(param.merchant_id);
  $encryptkey.val(param.encryptkey);
  $data.val(param.data);
  $money.val(param.total_fee);

  /**
   * 涉及鉴权回调不作登录处理
   * @param  {[type]} !uid [description]
   * @return {[type]}      [description]
   */
//  if (!uid) {
//    Common.toLogin();
//    return false;
//  }

  //提交招行鉴权
  $topUp.on('click', '#next-btn', function(){
	  document.getElementById('gocmb').submit();
  });
  
//为用户发送短信验证码
  var smsTimer;
  var defText = '重新发送';
  var timeText = '{time}s后重试';

  // 短信发送定时器
  function startSmsTimer(timeOver){
    if(!!smsTimer){
      clearInterval(smsTimer);
    }
    var _i = Common.vars.sendWait;
    smsTimer = setInterval(function(){
      $sendSmsAgain.val(timeText.replace(/{time}/, _i--));
      if(_i < 0){
        clearInterval(smsTimer);
        smsTimer = null;
        timeOver();
      }
    }, 1000);
  }
  
  $sendSmsAgain.on('click', function(){
    var $this = $(this);
    if($this.hasClass('disabled')){
      return false;
    }
    $this.addClass('disabled');
    //重发短信
	var url = Setting.apiRoot1 + "/u/rb/sendSmsAgain.p2p";
	var data = {};
	data.userId = confirmData.userId;
	data.order_no = confirmData.order_no;
	data.loginToken=sessionStorage.getItem('loginToken');
	if(confirmData.order_no=='' || confirmData.userId==''){
		return false;
	}else{
	  $.ajax({
        url: url,
        type: 'post',
        dataType: 'json',
        data: data
      }).done(function(res){
        Common.ajaxDataFilter(res, function(res){
          if(res.code == 1){
        	  //设置60秒倒计时
        	  alert("发送成功");
          }else{
        	//返回其他错误信息，弹出提示。
          	if(res.data){
          		alert(res.data.result_msg);
          	}else{
          		alert(res.message);
          	}
          	$check_code.val('');
            $this.removeClass('disabled');
          }
          //倒计时
	      	startSmsTimer(function(){
	      	  $this.val(defText).removeClass('disabled');
	      	});
        })
      }).fail(function(){
        alert('网络链接失败');
        $check_code.val('');
        $this.removeClass('disabled');
      });
	}
  });
  /**
   * 确认支付：弹出验证码输入页面的确认按钮. 同步top-up.JS 
   * @return {[type]} [description]
   */
  $submit1.on('click',function(){
  	//异步请求确认支付
    var $this = $(this);
    if($this.hasClass('disabled')){
      return false;
    }
    
	//确认支付接口地址
	var confirmUrl = Setting.apiRoot1 + "/u/rb/confirmPay.p2p";
    var chcode = $check_code.val();
	if(chcode=='' || chcode==undefined || chcode.length<4 || chcode.length>6){
		alert('验证码不正确！');
	    //让验证码的确认按钮可用，验证设为空
	    $check_code.val('');
        $this.removeClass('disabled');
        return false;
	}else{
	  confirmData.check_code = $.trim($check_code.val());
	  confirmData.loginToken=sessionStorage.getItem('loginToken');
	  $.ajax({
        url: confirmUrl,
        type: 'post',
        dataType: 'json',
        data: confirmData
      }).done(function(res){
        Common.ajaxDataFilter(res, function(res){
        //alert("订单号："+confirmData.order_no+" 确认后返回结果："+res.code);
          if(res.code == 1){
        	  //隐藏弹出层
              var maskLayer=document.getElementById('maskLayer');
              var verification=document.getElementById('verification');
              maskLayer.style.display='none';
              verification.style.display='none';
              
              //打开成功跳转层
              var maskLayer2=document.getElementById('maskLayer2');
              var verification2 =document.getElementById('verification2');
      		  maskLayer2.style.display='block';
      		  verification2.style.display='block';
          }else{
        	//返回其他错误信息，弹出提示。
          	if(res.data){
          		alert(res.data.result_msg);
          	}else{
          		alert(res.message);
          	}
          	$check_code.val('');
            $this.removeClass('disabled');
            return false;
          }
        })
      }).fail(function(){
        alert('网络链接失败');
        $check_code.val('');
        $this.removeClass('disabled');
        return false;
      });
	}
  });
	  
  $cancel1.on('click',function(){
	  //取消跳转账户
	  confirm('确定取消本次交易吗?', function(){
		  window.location.href = Setting.staticRoot + '/pages/my-account/myAccount.html';
      });
  });
  
  //去查看账户
  $submit2.on('click',function(){
	  //成功充值后，确认点击查看账户
	  window.location.href = Setting.staticRoot + '/pages/my-account/myAccount.html';
  });
  
  //去理财的周周涨页面
  $cancel2.on('click',function(){
	  //成功充值后，去投资点击查看周周涨
	  window.location.href = Setting.staticRoot + '/pages/financing/current.html';
  });
	  
});
