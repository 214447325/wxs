/**
 * 交易密码设置
**/
$(function(){
  var $win = $(window);
  var $body = $('body');

  var $psdForm = $('.setting-dealpassword-form');

  var $deal_psd = $('[name=deal-password]', $psdForm);
  var $agin_psd = $('[name=password-agin]', $psdForm);
  var $uid = sessionStorage.getItem("uid")
  var formData ={}

  /**
   * 密码验证
   * @return {[type]} [description]
   */
  if(!$uid){
    Common.toLogin();
    return false;
  }
  function checkForm(){
    var deal_psd = $.trim($deal_psd.val());
    var _agin_psd =  $.trim($agin_psd.val());

    if (!deal_psd.length>0) {
      alert("请输入交易密码！")
      return false;
    }

    if(!Common.reg.payPwd.test(deal_psd)){
      alert('密码格式有误，请重新输入！');
      return false;
    }

    if (!_agin_psd.length>0) {
      alert("请再次输入交易密码！")
      return false;
    }
    if (deal_psd != _agin_psd) {
      alert("两次密码输入不一致")
      return false;
    }


    formData.password = md5(_agin_psd)
    // formData.oldPassword = md5("888888")
    formData.userId = $uid
    formData.type = 2 //交易密码
    formData.loginToken = sessionStorage.getItem('loginToken');
    return true;
  }

  $body.on('click', '.setting-dealpassword', function(event) {
    var $this = $(this)
    if (checkForm()) {
      $this.addClass('disabled').html('数据提交中...');
      $.ajax({
        url: Setting.apiRoot1 +'/u/password/modify.p2p',
        type: 'post',
        dataType: 'json',
        data: formData,
      })
      .done(function(data) {
        Common.ajaxDataFilter(data.code,function(){
          switch(data.code){
            case 1:
            	sessionStorage.setItem('validTrade',1);//是否设置交易密码
            	alert("设置成功");
                function  jumurl(){
                	window.location.href = Setting.staticRoot+'/pages/my-account/myAccount.html';
                }
                setTimeout(jumurl,1000);

              break;
            default:
              alert(data.message);
              break;
          }
          $this.removeClass('disabled').html('确认');
        })
      })
      .fail(function() {
        alert('网络链接失败');
        $this.removeClass('disabled').html('确认');
      })
    }
 });


});