/**
 * 
 * @author zyx
 * @return {[type]}       [description]
 */
$(function(){
	
  var url = location.search; //获取url中"?"符后的字串
   var param = {};
   if (url.indexOf("?") != -1) {
      var str = url.substr(1);
      strs = str.split("&");
      for(var i = 0; i < strs.length; i ++) {
         param[strs[i].split("=")[0]] = decodeURIComponent(strs[i].split("=")[1]);
      }
   }

  var $topUp = $('.top-up');

  var $bankcard = $('input[name=bankcard]');
  var $bank = $('input[name=bank]');
  var $limitday =$('.limitday',$topUp);//银行限额单笔&单日
  var $limitonce =$('.limitonce',$topUp);//银行限额单笔&单日
  var $money = $('input[name=money]');
  var $span  = $('.blue span',$topUp);//手续费
//  var $agreeNo = $('input[name=agreeNo]');
  var $bindType = $('input[name=bindType]');
  var $bank_code = $('input[name=bank_code]');
  var $cardType = $('input[name=bank_card_type]');
  var $acctName = $('input[name=acctName]');
  var $phone_number = $('input[name=phone_number]');


  var $paymentChannel = $('.paymentChannel');
  
  var loginToken = param.loginToken;
  var uid = param.uid;
  sessionStorage.setItem("uid", uid);
//  var uid = sessionStorage.getItem("uid");
  
  //Data init 充值表单内容
  $bankcard.val(param.cardNo);
  $bank.val(param.bankName);
  $span.val(param.fee);
//  $agreeNo.val(param.agreeNo);
  $bindType.val(param.bindType);
  $bank_code.val(param.bankCode);
  $cardType.val(param.cardType);
  $acctName.val(param.acctName);
  $money.val(param.amt);
  
  var limitday = param.limitday;
  var limitonce = param.limitonce;
  
  $limitday.html(limitday);
  $limitonce.html(limitonce);
  
  //绑卡设置只读，手机号不显示
  if(param.bindType=='1'){
	  $bankcard.val(param.cardNo).attr('readonly', 'readonly');
	  $phone_number.closest('li').addClass('hide');
  }

  if (!uid) {
//    Common.toLogin();
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
//    var agreeno = $.trim($agreeNo.val());
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
//    if(!Common.reg.money.test(money)){
//      alert('金额输入有误，最多只能到小数点后两位');
//      return false;
//    }
    money = parseFloat(money);
    if(money < parseFloat(param.rechargeMin)){
      alert('充值金额不能低于'+ param.rechargeMin +'元');
      return false;
    }
    if(money > parseFloat(limit)){
        alert('充值金额不能高于'+ limit +'元');
        return false;
    }
    
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
          loginToken:loginToken
        }
      }).done(function(res){

          if(res.code == 1){
//       	  var url = 'http://www-1.fuiou.com:18670/mobile_pay/timbnew/timb01.pay'; 
       	  var url = 'https://mpay.fuiou.com:16128/timbnew/timb01.pay';
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
   });

  $('.next-btn').trigger('click');
  
  
});
