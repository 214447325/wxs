/**
 * top-up.js
 * @author tangsj
 * @return {[type]}       [description]
 */
$(function(){

  var param = Common.getParam();

  param.rechargeMin = param.rechargeMin || 0;

  var $topUp = $('.top-up');

  var uid = sessionStorage.getItem("uid");
  var $bankcard = $('input[name=bankcard]');
  var $bank = $('input[name=bank]');
  var $money = $('input[name=money]');
  var $span  = $('.blue span',$topUp);//手续费
  var formData = {};

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
   * 获取银行卡名称
   * @return {[type]} [description]
   */
  function getCardInfo(cardNum, callback){
    $.ajax({
      url: Setting.apiRoot1 + '/u/bankcard/cardbin.p2p',
      type: 'post',
      dataType: 'json',
      data: {
        cardNum: cardNum,
        userId: uid
      }
    }).done(function(res){
      console.log(res);
      Common.ajaxDataFilter(res, function(res){
        if(res.code == 1){
          callback(res.data);
        }
      });
    });
  }

  /**
   * 表单验证
   * @return {[type]} [description]
   */
  function check(){
    var bankcard = $.trim($bankcard.val());
    var bank = $.trim($bank.val());
    var money = $.trim($money.val());

    if(bankcard.length == 0){
      alert('请输入您的银行卡号');
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

    formData.cardNum = bankcard.replace(/\s/g, '');
    formData.bank = bank;
    formData.amount = money;
    formData.type = 3; // wap
    formData.userId = uid;
    return true;
  }

  // Event
  $topUp.on('click', '.next-btn', function(){
    var $this = $(this);

    if($this.hasClass('disabled')){
      return false;
    }
    if(check()){
      $this.addClass('disabled');
      $.ajax({
        url: Setting.apiRoot1 + '/u/recharge.p2p',
        type: 'post',
        dataType: 'json',
        data: formData
      }).done(function(res){
        Common.ajaxDataFilter(res, function(res){
          if(res.code == 1){
            var $form = $('<form></form>');
            $form.attr('action', Setting.payUrl),
            $form.attr('method', 'post');
            $form.append($('<input>').attr('name', 'req_data').val(JSON.stringify(res.data)));
            $form.submit();
            $span.text((res.data.fee).toFixed(2));
          }else{
            alert(res.message);
            $this.removeClass('disabled');
            return false;
          }
        })
      }).fail(function(){
        alert('服务器异常');
        $this.removeClass('disabled');
        return false;
      });
    }
  }).on('input change blur', 'input[name=bankcard]', function(e){
    var $this = $(this);

    $bank.closest('li').addClass('hide');

    var card = $.trim($this.val());

    if(card.length == 0){
      return false;
    }

    if(e.type == 'focusout'){
      getCardInfo(card.replace(/\s/g, ''), function(info){
        if(!!info.bankName){
          $bank.closest('li').removeClass('hide');
          $bank.val(info.bankName);
        }
      });
      return false;
    }
    card = card.replace(/\s/g,'').replace(/(\d{4})(?=\d)/g,"$1 ");
    $this.val(card);
  });

  // Data init
  if(!!param.cardNo){
	
    $bankcard.val(param.cardNo).trigger('change').trigger('blur').attr('readonly', 'readonly');
  }

  $money.on('change',function(){
    $(this).val(parseFloat($(this).val()).toFixed(2));
  });
});
