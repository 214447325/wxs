/**
 * pay.js
 * @author zyx
 * @return {[type]}       [description]
 */
$(function(){

  var defText = '确认付款';
  var payText = '支付中...';

  var payInfo = sessionStorage.getItem('buy-pro');
  var userId = sessionStorage.getItem('uid');
  var payData =  sessionStorage.getItem('payData');
  var $ui_dialog = $('.ui-dialog');
  var $btn_link  = $('.btn-link',$ui_dialog);
  var $btn_default = $('.btn-default',$ui_dialog);
  var param = Common.getParam();
  var reback = param.reback;
  var cycle = param.cycle;

  var isJoinInvite = param.isJoinInvite;

  var $inputBox = $('.input-box');
  var $boxs = $('.box', $inputBox);
  var pass = '';

  if(!userId){
    Common.toLogin();
    return false;
  }

  if(!payInfo){
    window.location.href = Setting.staticRoot + '/pages/index.html';
    return false;
  }

  payInfo = JSON.parse(payInfo);

  var $pay = $('.page-pay');
  var $money = $('.money');

  $money.text(parseFloat(payInfo.investAmt).toFixed(2) + '元');

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
    var post = {
      data: payData,
      investAmt: payInfo.investAmt,
      userId: userId,
      prodId: payInfo.prodId,
      tradePassword: md5(pwd),
      isJoinInvite:isJoinInvite
    };

    post.loginToken=sessionStorage.getItem('loginToken');

    $.ajax({
      url: Setting.apiRoot1 + '/u/investForPhone.p2p',
      type: 'post',
      dataType: 'json',
      data: post
    }).done(function(res){
      Common.ajaxDataFilter(res, function(res){
        if(res.code != 1){
          alert(res.message, function(){
            $this.removeClass('disabled').text(defText);
          });
          return false;
        }
        // 新手标购买跳转,新手标页
        $ui_dialog.removeClass('hide');
        if(param.noviceId){
          $btn_link.attr('href',Setting.staticRoot + '/pages/financing/current.html');
          $btn_default.attr('href',Setting.staticRoot + '/pages/my-account/myAccount.html');
          return false;
        }
        //周周涨
        if(param.current){
          $btn_link.attr('href',Setting.staticRoot + '/pages/financing/current.html');
          $btn_default.attr('href',Setting.staticRoot + '/pages/my-account/myAccount.html');
          return false;
        }
        //  我的产品页
        sessionStorage.removeItem('buy-pro');
        
    $btn_link.attr('onclick','location.replace(document.referrer);');
    $btn_default.attr('href',Setting.staticRoot + '/pages/my-account/myAccount.html');
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
    pass = val;

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
