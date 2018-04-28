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
  var $limitday =$('.limitday',$topUp);//银行限额单笔&单日
  var $limitonce =$('.limitonce',$topUp);//银行限额单笔&单日
  var $money = $('input[name=money]');
  var $span  = $('.blue span',$topUp);//手续费
  var $agreeNo = $('input[name=agreeNo]');
  var $bindType = $('input[name=bindType]');
  var $bank_code = $('input[name=bank_code]');
  var $cardType = $('input[name=bank_card_type]');
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

  var $paymentChannel = $('.paymentChannel');
  
  
  //Data init 充值表单内容
  $bankcard.val(param.cardNo);
  $bank.val(param.bankName);
  $span.val(param.fee);
  $agreeNo.val(param.agreeNo);
  $bindType.val(param.bindType);
  $bank_code.val(param.bankCode);
  $cardType.val(param.cardType);
  $acctName.val(param.acctName);
  
  var limitday = param.limitday;
  var limitonce = param.limitonce;
  
  $limitday.html(limitday);
  $limitonce.html(limitonce);
  
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
    var limit = limitonce;
    var money = $.trim($money.val());
    var bankCode = $.trim($bank_code.val());
    var banktype = $.trim($cardType.val());
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
//    if(bindType!='1' && phone_number.length == 0){
//        alert('请填写银行预留手机号');
//        return false;
//    }
//    if(bindType!='1' && !phone_number.match(/^1[3|4|5|7|8][0-9]\d{4,8}$/)){
//      alert('请填正确的手机号');
//        return false;
//    }
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
    if(money > parseFloat(limit)){
        alert('充值金额不能高于'+ limit +'元');
        return false;
    }
    
    //未绑卡请求的data参数
    formData.userId = uid;//4;//uid
    formData.card_no = bankcard.replace(/\s/g, '');
    formData.bank_name = bank;
    formData.total_fee = money;
    formData.bank_card_type = banktype; // wap
    formData.bank_code = bankCode;
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
    }else{
      if(!check()){
    	  return false;
      }
      var orderUrl=  Setting.apiRoot1 + '/u/fy/rechargeForWeixin.p2p';
      var cardNum = $.trim($bankcard.val());
      var money = $.trim($money.val());
      var userId = uid;
      $this.addClass('disabled');
      $.ajax({
        url: orderUrl,
        type: 'post',
        dataType: 'json',
        data: {
          cardNum: cardNum,
          userId: uid,
          amount:money,
          loginToken:sessionStorage.getItem('loginToken')
        }
      }).done(function(res){

          if(res.code == 1){
        	  
//        	  alert(JSON.stringify(res.data));
//        	  return false;  13917645400
        	  //var url = 'http://www-1.fuiou.com:18670/mobile_pay/timbnew/timb01.pay';      
              var url = 'https://mpay.fuiou.com:16128/timbnew/timb01.pay';
        	  
//        	  url = url + "?mchntCd=" + res.data.mchntCd 
//        	  + "&orderid=" + res.data.orderid 
//        	  + "&ono=" + res.data.ono + res.data.orderid 
//        	  + "&backurl=" + res.data.backurl
//        	  + "&reurl=" + res.data.reurl 
//        	  + "&homeurl=" + res.data.homeurl 
//        	  + "&name=" + res.data.name 
//        	  + "&sfz=" + res.data.sfz 
//        	  + "&md5=" + res.data.md5 
//        	  
        	  var $form = $('<form></form>');
              $form.attr('action', url),
              $form.attr('method', 'post');
              
              $form.append($('<input>').attr('name', 'mchntCd').val(res.data.mchntCd));
              $form.append($('<input>').attr('name', 'orderid').val(res.data.orderid));
              $form.append($('<input>').attr('name', 'ono').val(res.data.ono));
              $form.append($('<input>').attr('name', 'backurl').val(res.data.backurl));
              $form.append($('<input>').attr('name', 'reurl').val(res.data.reurl));
              $form.append($('<input>').attr('name', 'homeurl').val(res.data.homeurl));
              $form.append($('<input>').attr('name', 'name').val(res.data.name));
              $form.append($('<input>').attr('name', 'sfz').val(res.data.sfz));
              
              $form.append($('<input>').attr('name', 'md5').val(res.data.md5));
              
//              $paymentChannel.html($form);
//              return false;
              $form.submit();
              
        	  
          }else if(res.data){
            alert(res.data.result_msg);
          }else{
            alert(res.message);
          }
            $this.removeClass('disabled');
            return false;
 
      }).fail(function(){
        alert('网络链接失败');
        $this.removeClass('disabled');
        return false;
      });
    }
   })
    
  .on('input change blur', 'input[name=bankcard]', function(e){
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
        url: Setting.apiRoot1 + '/u/fy/queryCardbin.p2p',
        type: 'post',
        dataType: 'json',
        data: {
          userId: uid,
          cardNum: cardNum,
          loginToken:sessionStorage.getItem('loginToken')
        }
      }).done(function(res){
        console.log(res);
        Common.ajaxDataFilter(res, function(res){
          if(res.code == 1){
            callback(res.data);
            /*$bank.val(res.data.bank_name);*/
            $bank.val(res.data.bankName);
            $cardType.val(res.data.cardType);
            $bank_code.val(res.data.bankCode);
            $limitday.html(res.data.limitday);
            $limitonce.html(res.data.limitonce);

          }
        });
      }).fail(function(){
          alert('网络链接失败');
          $this.removeClass('disabled');
          return false;
        });
  }
  }
  
  
  //验证码支付确认页消失
  $cancel.on('click',function(){
    $check_code.val('');
    
    //取消跳转账户
    confirm('确定取消本次交易吗?', function(){
      window.location.href = Setting.staticRoot + '/pages/my-account/myAccount.html';
      });
    
    //验证码取消按钮，隐藏弹出层
//    var maskLayer=document.getElementById('maskLayer');
//    var verification=document.getElementById('verification');
//    maskLayer.style.display='none';
//    verification.style.display='none';
    
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
