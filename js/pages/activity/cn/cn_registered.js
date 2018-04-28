/**
 * Created by User on 2016/10/27.
 */

$(function() {
    var $ciphers = $('.ciphers');//控制明文和密文
    var $cipher = $('.cipher');//密码
    var param = Common.getParam();
    var channelId = param.channelId;
    var formData = {};
    var _isCiphers = true;

    $ciphers.click(function() {
        if(_isCiphers) {
            _isCiphers = false;
            $(this).removeClass('icon4').addClass('icon5');
            $cipher.attr({'type':'text'});
        } else {
            _isCiphers = true;
            $(this).removeClass('icon5').addClass('icon4');
            $cipher.attr({'type':'password'});
        }
    });


    var $sendAgain = $('.send-sms-code');//点击获取验证码按钮
    var $registerStep1 = $('.elevenForm');//注册的form表单
    var $inputphone = $('[name=phone]', $registerStep1);//手机输入框
    var $msgcode = $('[name=sms-code]', $registerStep1);//验证码输入框
    var $password = $('[name=new-password]', $registerStep1);//密码输入框
    var $registered = $('.regist-button');//点击立即领取按钮

    //鼠标移出输入框
    $inputphone.focusout(function(event) {
        getSend();
    });

    //点击获取验证码按钮
    $sendAgain.click(function() {
        getSend();
    });

    $msgcode.focusout(function(event) {
        var msgcode = $.trim($msgcode.val());
        // var password = $.trim($password.val());
        var inputphone = $.trim($inputphone.val());
        //验证码验证
        if(msgcode.length < 4){
            isInputFalse('promptCode', '请输入4位短信验证码！', false);
            return false;
        }
    });

    $password.focusout(function(event) {
        var password = $.trim($password.val());
        //密码验证
        if(password.length == 0){
            isInputFalse('promptPass', '请输入密码！', false);
            return false;
        }
        if(password.length < 6){
            isInputFalse('promptPass', '密码不能小于6位！', false);
            return false;
        }

        if(!Common.reg.pwd.test(password)){
            isInputFalse('promptPass', '密码暂不支持特殊字符！', false);
            return false;
        }
        isInputFalse('promptPass', '该密码可使用！', true);
        return true;
    });

    //点击立即领取按钮
    $registered.click(function(event) {
        var $this = $(this);
        if($this.hasClass('disabled')){
            return false;
        }
        if (checkForm()) {
            $this.addClass('disabled');
            Common.validMsgCode(formData.phoneNum, formData.identifyCode, 2, function(data){
                if(data.code == 1){
                    isInputFalse('promptCode', '验证码正确！', true);
                    $.ajax({
                        url: Setting.apiRoot2 + '/regist.p2p',
                        type: 'post',
                        dataType: 'json',
                        data: formData
                    }).done(function(res){
                        if(res.code==1){
                            //跳转注册成功页面
                            window.location.href = '../../../pages/active/cn/cn_success.html';
                        }else{
                            alert(res.message);
                            return false;
                        }
                    }).fail(function(){
                        alert('网络链接失败');
                        $this.removeClass('disabled');
                        return false;
                    });
                }else{
                    isInputFalse('promptCode', '验证码输入有误！', false);
                    $this.removeClass('disabled');
                    return false;
                }
            });
        }
    });

    function checkForm(){
        var msgcode = $.trim($msgcode.val());
        var password = $.trim($password.val());
        var inputphone = $.trim($inputphone.val());//手机号的值
        if(inputphone.length == 0){
            isInputFalse('promptPhone', '请输入手机号码！', false);
            return false;
        }

        if(!Common.reg.mobile.test(inputphone)){
            isInputFalse('promptPhone','请输入正确的手机号码！', false);
            return false;
        }

        if(password.length == 0){
            isInputFalse('promptPass','请输入密码！', false);
            return false;
        }
        if(password.length < 6){
            isInputFalse('promptPass','密码不能小于6位', false);
            return false;
        }

        if(!Common.reg.pwd.test(password)){
            isInputFalse('promptPass','密码格式有误！', false);
            return false;
        }

        if(msgcode.length == 0){
            isInputFalse('promptCode','请输入验证码！', false);
            return false;
        }


        formData.phoneNum = inputphone;
        formData.password = md5(password);
        formData.identifyCode = msgcode;
        formData.channelId = channelId;//触宝科技的channelId
        return true;

    }

    // 为用户发送短信验证码
    function getSend() {
        var defText = '重新发送';
        var ph = $inputphone.val();
        var $this = $sendAgain;
        if ($this.hasClass('disabled')) {
            return false;
        }
        $this.addClass('disabled');
        if (ph == "" || ph.length == 0) {
            isInputFalse('promptPhone', '手机号码不能为空！', false);
            $this.removeClass('disabled');
            return false;
        }
        if (!Common.reg.mobile.test(ph)) {
            isInputFalse('promptPhone', '请输入正确的手机号码！', false);
            $this.removeClass('disabled');
            return false;
        }
        Common.sendMsgCode(ph, 2, function (data) {
            if (data.code != 1) {
                isInputFalse('promptPhone', data.message, false);
                $this.removeClass('disabled');
                return false;
            } else {
                isInputFalse('promptPhone','该手机号码可以使用', true);
            }
            startSmsTimer(function () {
                $this.html(defText).removeClass('disabled');
            });
        });
    }

    // 短信发送定时器
    function startSmsTimer(timeOver){
        var smsTimer;
        var timeText = '<strong>{time}</strong>s';
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

    //判断输入是否正确
    function isInputFalse(label, message, isTrue){
        var _promptHtml = '';
        var $prompt = $('.' + label);//提示内容
        //默认打钩的图片
        var _src = '../../../images/pages/activity/cn/registered-true.png';
        var _div = 'div2';
        if(isTrue) {
             _src = '../../../images/pages/activity/cn/registered-true.png';
            _div = 'div2';
        } else {
            _src = '../../../images/pages/activity/cn/registered-false.png';
            _div = 'div1';
        }
        _promptHtml = _promptHtml + '<div class="symbol">' +
                    '<img src="'+ _src +'" class="img">' +
                    '</div>' +
                    '<div class="'+ _div +'">' + message +
                    '</div>';
        $prompt.html(_promptHtml)
    }
});