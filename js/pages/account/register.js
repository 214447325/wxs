/**
 * register.js
 * @author  tangsj
 * @return {[type]}       [description]
 */
$(function(){

  /**
   * 微信进来的访问判断，不是跳转到官网下载页
   * 20160226 zyx 
   */
  var isWeiXin = Common.isWeiXin();
	  
	var param = Common.getParam();
	var inviteCode = param.code;
	
	var channelId = param.channelId;

  /**
   * Register Step1
   * @return {[type]} [description]
   */
  !function(){
    var $registerStep1 = $('.register-step1');

    if($registerStep1.length > 0){

      /**
       * 加载Banner 图片
       * @return {[type]} [description]
       */
      !function(){}();

      var $phone = $('[name=phone]', $registerStep1);
      var $vcode = $('[name=vcode]', $registerStep1);

      var formData = {}
      /**
       * 表单验证
       * @return {[type]} [description]
       */
      function checkForm(){
        var phone = $.trim($phone.val());
        var vcode = $.trim($vcode.val());

        if(phone.length == 0){
          Common2.toast('请输入手机号码！');
          return false;
        }

        if(!Common.reg.mobile.test(phone)){
          Common2.toast('请输入正确的手机号码！');
          return false;
        }

        if(vcode.length == 0){
          Common2.toast('请输入验证码！');
          return false;
        }

        formData.phoneNum = phone;
        formData.code = vcode;
      
        return true;
      }
      /**
       * 验证码
       * @return {[type]} [description]
       */
      $registerStep1.on('click', '.Verification-code', function(){
    	var uuid = $.cookie('uuid');
    	//微信才有UUID
        var img = new Image();
        img.src = Setting.apiRoot1 + '/code.p2p?type=1&divnceId='+uuid+'&time=' + Date.now();
        $(this).html(img);
      }).on('click', '.submit-btn', function(){
        var $this = $(this);

        if($this.hasClass('disabled')){
          return false;
        }

        if(checkForm()){
          $this.addClass('disabled');
          var uuid = $.cookie('uuid');
          $.ajax({
            url: Setting.apiRoot1 + '/isRegist.p2p?divnceId=' + uuid,
            type: 'post',
            dataType: 'json',
            data: formData,
          }).done(function(res) {
            if(res.code == 1){
              // 可以注册
              sessionStorage.setItem('registerPhone', formData.phoneNum);
              sessionStorage.setItem('inviteCode', inviteCode);
              
              //zyx 20160506 微信分多个注册渠道
              if(!channelId){
            	  window.location.href = Setting.staticRoot + '/pages/account/register-2.html';
              }else{
            	  sessionStorage.setItem('channelId', channelId);
            	  window.location.href = Setting.staticRoot + '/pages/account/register-2.html?channelId='+channelId;
              }
              
              return false;
            }

            Common2.toast(res.message, function(){
              $this.removeClass('disabled');
              if(res.code == -2){
                window.location.href = Setting.staticRoot + '/pages/account/login.html';
              }
            });
          }).fail(function() {
            Common2.toast('网络异常',Setting.staticRoot+'/images/pages/ui/wifi.png');
            $this.removeClass('disabled');
            return false;
          });
        }
      });

      $('.Verification-code').trigger('click');
    }
  }();

  /**
   * Register Step2
   * @return {[type]} [description]
   */
  !function(){
    var $registerStep2 = $('.register-step2');

    if($registerStep2.length > 0){
      // 读取注册上一步中的电话号码
      var $registerStep = $('.register-step');
      var $registerPhone = $('.register-phone');
      var $sendAgain = $('.sendAgain');

      var registerPhone = sessionStorage.getItem('registerPhone');
      if(!registerPhone){
        window.location.href = Setting.staticRoot + '/pages/account/register.html';
        return false;
      }
      $registerPhone.html(registerPhone);

      var inviteCode = sessionStorage.getItem('inviteCode');
      if(inviteCode && inviteCode != 'undefined'){
    	  $('[name=invitation]').val(inviteCode);
    	  $('[name=invitation]').attr("readonly", true);
      }
      
      // 为用户发送短信验证码
      var smsTimer;
      var defText = '重新获取';
      var timeText = '<strong>{time}</strong>s<br />';
      $sendAgain.on('click', function(){
        var $this = $(this);
        if($this.hasClass('disabled')){
          return false;
        }
        $this.addClass('disabled');
        Common.sendMsgCode(registerPhone, 2, function(data){
          if(data.code != 1){
            Common2.toast(data.message);
            $this.removeClass('disabled');
            return false;
          }

          startSmsTimer(function(){
            $this.html(defText).removeClass('disabled');
          });
        });
      }).trigger('click');

      // 短信发送定时器
      function startSmsTimer(timeOver){
        if(!!smsTimer){
          clearInterval(smsTimer);
        }
        var _i = Common.vars.sendWait;
        smsTimer = setInterval(function(){
          $sendAgain.html(timeText.replace(/{time}/, _i--));
          if(_i < 0){
            clearInterval(smsTimer);
            smsTimer = null;
            timeOver();
          }
        }, 1000);
      }

      // 注册提交
      var $msgcode = $('[name=msgcode]');
      var $password = $('[name=password]');
      var $invitation = $('[name=invitation]');
      var $agreement = $('[name=agreement]');

      var formData = {};

      function checkForm(){
        var msgcode = $.trim($msgcode.val());
        var password = $.trim($password.val());
        var invitation = $.trim($invitation.val());

        if(msgcode.length == 0){
          Common2.toast('请输入验证码！');
          return false;
        }

        if(password.length == 0){
          Common2.toast('请输入密码！');
          return false;
        }

        if(!Common.reg.pwd.test(password)){
          Common2.toast('密码格式有误，请输入6-20位字符！');
          return false;
        }

        if(!$agreement.prop('checked')){
          Common2.toast('请阅读并同意《V金融用户使用协议》');
          return false;
        }

        formData.phoneNum = sessionStorage.getItem('registerPhone');
        formData.password = md5(password);
        formData.msgcode = msgcode;
        formData.invitationCode = invitation;
        
        //zyx 20160506 微信分多个注册渠道
        if(!channelId){
        	formData.channelId = "992";
        }else{
        	formData.channelId = channelId;
        }
        
        var uuid = $.cookie('uuid');
        if(uuid){
        	formData.uuid = uuid;
        }
        
        return true;
      }

      $registerStep2.on('click', '.submit-btn', function(){
        var $this = $(this);

        if($this.hasClass('disabled')){
          return false;
        }

        if(checkForm()){
          $this.addClass('disabled').html('数据提交中...');

          // 验证短信验证码是否正确
          Common.validMsgCode(formData.phoneNum, formData.msgcode, 2, function(data){
            if(data.code != 1){
              Common2.toast('验证码输入有误！');
              $this.removeClass('disabled').html('注册');
              return false;
            }

            // 验证码输入正确
            $.ajax({
              url: Setting.apiRoot2 + '/regist.p2p',
              type: 'post',
              dataType: 'json',
              data: formData
            }).done(function(res){
              if(res.code != 1){
                Common2.toast(res.message);
                $this.removeClass('disabled').html('注册');
                return false;
              }
              
              Common2.toast('注册成功！');
              function  jumurl(){
            	  window.location.href = Setting.staticRoot + '/pages/account/login.html';
              }
              setTimeout(jumurl,1500);
              
              // 注册成功
//              Common2.toast('注册成功！', function(){
//                sessionStorage.removeItem('registerPhone');
//                window.location.href = Setting.staticRoot + '/pages/account/login.html';
//              });
              
              
            }).fail(function(){
              Common2.toast('网络异常',Setting.staticRoot+'/images/pages/ui/wifi.png');
              $this.removeClass('disabled').html('注册');
              return false;
            });
          });
        }
      });

    }
  }();
});