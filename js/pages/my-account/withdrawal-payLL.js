/**
 * withdrawal-pay.js
 * @author tangsj
 * @return {[type]}       [description]
 */
$(function(){

  var defText = '确认付款';
  var payText = '支付中...';

  var payInfo = sessionStorage.getItem('withdrawal-pay');
  var userId = sessionStorage.getItem('uid');

  var $inputBox = $('.input-box');
  var $boxs = $('.box', $inputBox);
  var pass = '';

  if(!userId){
    Common.toLogin();
    return false;
  }

  if(!payInfo){
    window.location.href = Setting.staticRoot + '/pages/my-account/myAccount.html';
    return false;
  }

  payInfo = JSON.parse(payInfo);

  var $pay = $('.page-pay');
  var $money = $('.money');

  // setData
  $money.text(parseFloat(payInfo.amount).toFixed(2) + '元');

  $pay.on('click', '.submit-pay', function(){
    var $this = $(this);

    if($this.hasClass('disabled')){
      return false;
    }

    var pwd = $('input', $inputBox).val();

    if(pwd.length < 6){
      alert('请输入完整的交易密码！');
      return false;
    }

    $this.addClass('disabled').text(payText);
    payInfo.tradePassword = md5(pwd);
    payInfo.userId = userId;
    $.ajax({
      url: Setting.apiRoot1 + '/u/withdraw.p2p',
      type: 'post',
      dataType: 'json',
      data: payInfo
    }).done(function(res){
      Common.ajaxDataFilter(res, function(res){
        alert(res.message, function(){
          if(res.code != 1){
            $this.removeClass('disabled').text(defText);
            return false;
          }
          sessionStorage.removeItem('withdrawal-pay');
          window.location.href = Setting.staticRoot + '/pages/my-account/myAccount.html';
        });
      });
    }).fail(function(){
      alert('支付失败，请重试！');
      $this.removeClass('disabled').text(defText);
      return false;
    });

  });

  $inputBox.on('keydown input focus blur', 'input', function(e){
    var $this = $(this);

    if(e.type == 'keydown'){
      var code = e.keyCode;
      if(code != 8 && (code < 48 || code > 57)){
        return false;
      }
    }
    var val = $.trim( $this.val() );
    pass = parseInt(val);

    isNaN(pass) && ( pass = '' );

    pass = pass + '';
    if(pass.length > 6){
      pass = pass.substring(0, 6);
    }
    $inputBox.find('input').val(pass);

    if(e.type == 'focusout'){
      $boxs.removeClass('focus');
    }
    var len = pass.length;
    if(e.type == 'focusin'){
      len == 0 ? (true) : (len = len - 1);
    }
    $boxs.eq(len).addClass('focus').siblings('.focus').removeClass('focus');
    var passArr = pass.split('');
    $boxs.each(function(index, box){
      var $box = $(box);

      if(!!passArr[index]){
        $box.addClass('full');
      }else{
        $box.removeClass('full');
      }
    });
  });
});