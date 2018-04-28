/**
 * top-up.js
 * @author zyx
 * @return {[type]}       [description]
 */
$(function(){

  var param = Common.getParam();
  var $topUp = $('.top-up');
  var uid = sessionStorage.getItem("uid");
  var $bankcard = $('input[name=bankcard]');
  var $bank = $('input[name=bank]');
  var $money = $('input[name=money]');
  var $span  = $('.blue span',$topUp);//手续费
  var $agreeNo = $('input[name=agreeNo]');
  var $bindType = $('input[name=bindType]');
  var $bank_code = $('input[name=bank_code]');
  var $bank_card_type = $('input[name=bank_card_type]');
  var $acctName = $('input[name=acctName]');
  var $phone_number = $('input[name=phone_number]');
  var $merchant_id = $('input[name=merchant_id]');
  var $submit = $('input[name=submit]');
  var $cancel = $('input[name=cancel]');
  var $submit2 = $('input[name=submit2]');
  var $cancel2 = $('input[name=cancel2]');
  var $check_code = $('input[name=check_code]');
  var $sendSmsAgain = $('input[name=sendSmsAgain]');
  var formData = {};
  var formAgreeData = {};
  var confirmData = {};
  
  //Data init 充值表单内容
  $bankcard.val(param.cardNo);
  $bank.val(param.bankName);
  $span.val(param.fee);
  $agreeNo.val(param.agreeNo);
  $bindType.val(param.bindType);
  $bank_code.val(param.bankCode);
  $bank_card_type.val(param.cardType);
  $acctName.val(param.acctName);
  
  //绑卡设置只读，手机号不显示
  if(param.bindType=='1'){
	$bankcard.val(param.cardNo).attr('readonly', 'readonly');
	$phone_number.closest('li').addClass('hide');
  }
  
  /**
   * [检测是否登录]
   * @param  {[type]} !uid [description]
   * @return {[type]}      [description]
   */
  if (!uid) {
    Common.toLogin();
    return false;
  }

  /**
   * 表单验证
   * @return {[type]} [description] 
   */
  function check(){
    var bankcard = $.trim($bankcard.val());
    var bank = $.trim($bank.val());
    var money = $.trim($money.val());
    var bankcode = $.trim($bank_code.val());
    var banktype = $.trim($bank_card_type.val());
    var agreeno = $.trim($agreeNo.val());
    var phone_number = $.trim($phone_number.val());
    var bindType = $.trim($bindType.val());

    if(bankcard.length == 0){
      alert('请输入您的银行卡号');
      return false;
    }
    if(bank.length == 0){
        alert('未查询出银行卡名称！');
        return false;
    }
    if(bindType!='1' && phone_number.length == 0){
        alert('请填写银行预留手机号');
        return false;
    }
    if(bindType!='1' && !phone_number.match(/^1[3|4|5|7|8][0-9]\d{4,8}$/)){
    	alert('请填正确的手机号');
        return false;
    }
    if(money.length == 0){
      alert('请输入您要充值的金额');
      return false;
    }
    if(!Common.reg.money.test(money)){
      alert('金额输入有误，最多只能到小数点后两位');
      return false;
    }
    money = parseFloat(money);
    if(money < parseFloat(param.rechargeMin)){
      alert('充值金额不能低于'+ param.rechargeMin +'元');
      return false;
    }
    
    //未绑卡请求的data参数
    formData.userId = uid;//4;//uid
    formData.card_no = bankcard.replace(/\s/g, '');
    formData.bank_name = bank;
    formData.total_fee = money;
    formData.bank_card_type = banktype; // wap
    formData.bank_code = bankcode;
    formData.phone_number = phone_number;
    formData.bind_id = agreeno;
    //绑卡请求的data参数
    formAgreeData.userId = uid;
    formAgreeData.bind_id = agreeno;
    formAgreeData.total_fee=money;
    
    return true;
  }

  /**
   * 充值的下一步：1、会对绑卡和未绑卡进行区分；2、未绑卡会对招行和非招行的进行区分，招行还另外做鉴权
   * @return {[type]} [description]
   */
  $topUp.on('click', '.next-btn', function(){
    var $this = $(this);
    if($this.hasClass('disabled')){
      return false;
    }
    
    //绑卡和未绑卡不同请求接口
    var payUrl = Setting.apiRoot1 + '/u/rb/noBindCardPay.p2p';
    var data = formData;
    if($bindType.val()=='1'){
    	payUrl = Setting.apiRoot1 + '/u/rb/bindCardPay.p2p';
    	data = formAgreeData;
    }
    data.loginToken=sessionStorage.getItem('loginToken');
    //表单验证通过
    if(check()){
      $this.addClass('disabled');
      $.ajax({
        url: payUrl,
        type: 'post',
        dataType: 'json',
        data: data
      }).done(function(res){
        Common.ajaxDataFilter(res, function(res){
          //code=1 非招行卡首次签约or所有卡的绑卡签约 code=2 招行首次绑卡需要鉴权跳转;
          if(res.code == 1){
        	//签约之后，需要组装确认支付接口的请求参数
        	confirmData.userId = uid;
      	  	confirmData.order_no = res.data.order_no;
//      	confirmData.check_code = "123456";
      	    $this.removeClass('disabled');
    	    var maskLayer=document.getElementById('maskLayer');
    	    var verification =document.getElementById('verification');
    		maskLayer.style.display='block';
    		verification.style.display='block';
          }else if(res.code == 2){
        	//招行鉴权传递参数，其中merchant_id|data|encryptkey必须隐藏
    	    var param = {
    			order_no:res.data.order_no || '',
    			merchant_id:res.data.merchant_id || '',
    			encryptkey:res.data.encryptkey || '',
    			data:res.data.data || '',
	            acctName:res.data.owner || '',
	            bankName:res.data.bank_name || '',
	            cardNo: res.data.card_no || '',
	            total_fee:res.data.total_fee
    	    }
    	    $this.removeClass('disabled');
    	    //跳转到鉴权页
    	    var cmbUrl = Setting.staticRoot + '/pages/my-account/CMBBank.html?' + $.param(param);
    	    window.location.href = cmbUrl;
          }else{
        	//返回其他错误信息，弹出提示。
        	if(res.data){
        		alert(res.data.result_msg);
        	}else{
        		alert(res.message);
        	}
            $this.removeClass('disabled');
            return false;
          }
        })
      }).fail(function(){
        alert('网络链接失败');
        $this.removeClass('disabled');
        return false;
      });
    }
  }).on('input change blur', 'input[name=bankcard]', function(e){
    var $this = $(this);
    var card = $.trim($this.val());

    if(card.length == 0){
      return false;
    }

    if(e.type == 'focusout'){
      getCardInfo(card.replace(/\s/g, ''), function(info){
        if(!!info.bankName){
          //$bank.closest('li').removeClass('hide');
          $bank.val(info.bankName);
        }
      });
      return false;
    }
   /* card = card.replace(/\s/g,'').replace(/(\d{4})(?=\d)/g,"$1 ");*/
    $this.val(card);
  });

  //金额变化后自动添加小数点
  $money.on('change',function(){
    $(this).val(parseFloat($(this).val()).toFixed(2));
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
   * 重发短信：
   * @return {[type]} [description]
   */
//  $sendSmsAgain.on('click',function(){
//    var $this = $(this);
//    if($this.hasClass('disabled')){
//      return false;
//    }
//	
//	
//  });
  
  /**
   * 卡bin查询，异步调用
   * @return {[type]} [description]
   */
  function getCardInfo(cardNum, callback){
	if(cardNum=='' || cardNum.length<16){
	    alert('请输入正确长度的银行卡号');
	    return false;
	}else{
		$.ajax({
	      url: Setting.apiRoot1 + '/u/rb/queryCardBin.p2p',
	      type: 'post',
	      dataType: 'json',
	      data: {
	    	card_no: cardNum,
	        userId: uid,
	        loginToken:sessionStorage.getItem('loginToken')
	      }
	    }).done(function(res){
	      console.log(res);
	      Common.ajaxDataFilter(res, function(res){
	        if(res.code == 1){
	          callback(res.data);
	          $bank.val(res.data.bank_name);
	          $bank_code.val(res.data.bank_code);
	          $bank_card_type.val(res.data.bank_card_type);
	          $bankcard.val(res.data.card_no);
	          $merchant_id.val(res.data.merchant_id);
	        }
	      });
	    }).fail(function(){
	        alert('网络链接失败');
	        $this.removeClass('disabled');
	        return false;
        });
	}
  }
  
  /**
   * 确认支付：弹出验证码输入页面的确认按钮
   * @return {[type]} [description]
   */
  $submit.on('click',function(){
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
  
  //验证码支付确认页消失
  $cancel.on('click',function(){
	  $check_code.val('');
	  
	  //取消跳转账户
	  confirm('确定取消本次交易吗?', function(){
		  window.location.href = Setting.staticRoot + '/pages/my-account/myAccount.html';
      });
	  
	  //验证码取消按钮，隐藏弹出层
//	  var maskLayer=document.getElementById('maskLayer');
//	  var verification=document.getElementById('verification');
//	  maskLayer.style.display='none';
//	  verification.style.display='none';
	  
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
