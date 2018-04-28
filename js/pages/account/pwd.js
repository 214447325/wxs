/**
 * pwd.js
 * @author  tangsj
 * @return {[type]}       [description]
 */
$(function(){
	
  /**
   * 微信进来的访问判断，不是跳转到官网下载页
   * 20160226 zyx 
   */
  var isWeiXin = Common.isWeiXin();
	  
  var $forget =  $('.forget-pwd-form');
  var $reset = $('.reset-pwd-form');

  var formData = {};
  /**
   * 忘记密码
   */
  if($forget.length > 0){

    var smsTimer;
    var $phone = $('[name=phone]');
    var $msgcode = $('[name=msgcode]');
    var $sendSms = $('.send-sms-code');

    var defText = '获取验证码';
    var timeText = '<strong>{time}</strong>s后重新发送';
    /**
     * 手机号码验证
     * @return {[type]} [description]
     */
    function checkPhone(){
      var phone = $.trim($phone.val());

      if(phone.length == 0){
        alert('请输入手机号！');
        return false;
      }

      if(!Common.reg.mobile.test(phone)){
        alert('请输入正确的手机号码！');
        return false;
      }

      formData.phoneNum = phone;
      return true;
    }

    /**
     * 验证码校验
     * @return {[type]} [description]
     */
    function checkMsgCode(){
      var msgcode = $.trim($msgcode.val());

      if(msgcode.length == 0){
        alert('请输入验证码！');
        return false;
      }

      formData.code = msgcode;
      return true;
    }

    // 短信发送定时器
    function startSmsTimer(timeOver){
      if(!!smsTimer){
        clearInterval(smsTimer);
      }
      var _i = Common.vars.sendWait;
      smsTimer = setInterval(function(){
        $sendSms.html(timeText.replace(/{time}/, _i--));
        if(_i < 0){
          clearInterval(smsTimer);
          smsTimer = null;
          timeOver();
        }
      }, 1000);
    }

    $forget.on('click', '.btn-next', function(){
      var $this = $(this);

      if($this.hasClass('disabled')){
        return false;
      }

      if(checkPhone() && checkMsgCode()){

        Common.validMsgCode(formData.phoneNum, formData.code, 1, function(data){
          if(data.code != 1){
            alert('验证码输入有误！');
            $this.removeClass('disabled');
            return false;
          }

          sessionStorage.setItem('resetInfo', JSON.stringify(formData));
          window.location.href = 'reset-pwd.html';
        });
      }
    }).on('click', '.send-sms-code', function(){
      var $this = $(this);

      if($this.hasClass('disabled')){
        return false;
      }

      if(checkPhone()){
        $this.addClass('disabled');

        Common.sendMsgCode(formData.phoneNum, 1, function(data){
          if(data.code != 1){
            alert('验证码发送失败，请点击重新发送验证码！');
            $this.removeClass('disabled');
            return false;
          }

          startSmsTimer(function(){
            $this.html(defText).removeClass('disabled');
          });
        });
      }
    });
  }

  /**
   * 重置密码
   */
  if($reset.length > 0){
    var resetInfo = sessionStorage.getItem('resetInfo');

    if(!resetInfo){
      window.location.href = 'forget-pwd.html';
      return false;
    }

    formData = JSON.parse(resetInfo);

    var $password = $('[name=password]');
    var $confirmpwd = $('[name=confirmpwd]');

    /**
     * 表单验证
     * @return {[type]} [description]
     */
    function checkForm(){
      var password = $.trim($password.val());
      var confirmpwd = $.trim($confirmpwd.val());

      if(password.length == 0){
        alert('请输入新的登录密码！');
        return false;
      }

      if(!Common.reg.pwd.test(password)){
        alert('新登录密码格式有误，请输入6-20位字母或数字！');
        return false;
      }

      if(confirmpwd.length == 0){
        alert('请再次输入登录密码！');
        return false;
      }

      if(password !== confirmpwd){
        alert('两次输入的密码不一致！');
        return false;
      }

      formData.password = md5(password);
      formData.comfirmPwd = md5(confirmpwd);

      return true;
    }
    $reset.on('click', '.submit-change', function(){
      var $this = $(this);

      if($this.hasClass('disabled')){
        return false;
      }

      if(checkForm()){
        formData.type = 1;

        $this.addClass('disabled');
        $.ajax({
          url: Setting.apiRoot1 + '/password/reset.p2p',
          type: 'post',
          dataType: 'json',
          data: formData
        }).done(function(res){
          if(res.code != 1){
            alert(res.message);
            $this.removeClass('disabled');
            return false;
          }

//          alert('密码重置成功！', function(){
//            sessionStorage.removeItem('resetInfo');
//            window.location.href = Setting.staticRoot + '/pages/account/login.html';
//          });
          
          alert('密码重置成功！');
          function  jumurl(){
        	  sessionStorage.removeItem('resetInfo');
              window.location.href = Setting.staticRoot + '/pages/account/login.html';
          }
          setTimeout(jumurl,1500);
          
        }).fail(function(){
          alert('网络链接失败');
          $this.removeClass('disabled');
          return false;
        });;
      }
    });
  }
});