/**
 * Created by User on 2016/9/7.
 */
$(function() {
    var $reset = $('.reset-pwd-form');
    var $passworld = $('.password');//密码框
    var $msgcode = $('[name=msgcode]');//短信验证码
    var $showPassworld = $('.show-img');//点击显示密码
    var $login = $('.login-registered');//注册按钮
    var $forget =  $('.reset-pwd-form');
    var data = new Date();
    var tiem = data.getTime();
    var round = Math.floor(Math.random()*10);
    var param = Common.getParam();
    var phone = param.phone;
    var divnceId = param.divnceId;
    var $phone = $('.tel-phone');
    var $sendSms = $('.btn-msgcode');
    $phone.text(phone);
    var $imgeCode = param.imgcode;//获取图形验证码
    var formData2 = {};
    var smsTimer;
    var defText = '重新获取';
    var timeText = '<strong>({time}s)</strong>';

        /**
     * 手机号码验证
     * @return {[type]} [description]
     */
    function checkPhone(){

        var phone = $.trim($('.tel-phone').text());

        if(phone.length == 0){
            // alert('请输入手机号！');
            Common2.toast('请输入手机号');

            return false;
        }

        if(!Common.reg.mobile.test(phone)){
            // alert('请输入正确的手机号码！');
            Common2.toast('请输入正确的手机号码');
            return false;
        }

        formData2.phoneNum = phone;
        return true;
    }
   /**
     * 验证码校验
     * @return {[type]} [description]
     */
    function checkMsgCode(){
        console.log(1)
        var msgcode = $.trim($msgcode.val());
        if(msgcode.length == 0){
            // alert('请输入验证码！');
            Common2.toast('请输入验证码');
            return false;
        }else{
            formData2.code = msgcode;
        return true;
        }

        
    }
    /**
     * 表单验证
     * @return {[type]} [description]
     */
    function checkForm(){
        console.log(checkPhone())
        if(checkPhone() && checkMsgCode()){

            var password = $.trim($password.val());
            if(password.length == 0){
                // alert('请输入新的登录密码！');
                Common2.toast('请输入新的登录密码！');
                return false;
            }

            if(!Common.reg.pwd.test(password)){
                // alert('新登录密码格式有误，请输入6-20位字母或数字！');
                Common2.toast('新登录密码格式有误，请输入6-20位字母或数字！');
                return false;
            }
            formData.password = md5(password);
            // formData.comfirmPwd = md5(password);
            console.log(JSON.stringify(formData))
        return true;
        }

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

    /*
    *用来判断密码是否隐藏
    */

    var isShowPassworld = true; //用来判断密码是否隐藏
    //点击密码显示按钮
    $showPassworld.click(function() {
        if(isShowPassworld) {
            $(this).attr({'src': '../../images/pages/account/show-passworld3.0.png'});
            $passworld.attr({'type': 'text'});
            isShowPassworld = false;
        } else {
            $(this).attr({'src': '../../images/pages/account/login-show3.0.png'});
            $passworld.attr({'type': 'password'});
            isShowPassworld = true;
        }
    });
    //点击注册按钮
    // $login.click(function() {
    //     window.location.href = '../../pages/account/register.html'
    // });

    /**
    *短息验证码
    */
     $forget.on('click', '.btn-msgcode', function(){
            var $this = $(this);
            if($this.hasClass('disabled')){
                return false;
            }
            if(checkPhone()){
                $this.addClass('disabled');
                var _imageCode = $.trim($imgeCode);
                if(_imageCode == null || _imageCode == '' || _imageCode == undefined || _imageCode <= 0) {
                    // alert('请输入图形验证码');
                    Common2.toast('请输入图形验证码');

                    $this.removeClass('disabled');
                    return false;
                }

                $.post(Setting.apiRoot1 + '/isRegist.p2p?divnceId=' + divnceId,
                    {phoneNum: formData2.phoneNum, code: _imageCode, type: 1},
                    function(data) {
                        if(data.code == 1) {
                            // 发送短信验证码
                            Common.sendMsgCode(formData2.phoneNum, 1,_imageCode, divnceId,  function(data){
                                if(data.code != 1){
                                    // alert(data.message);
                                    Common2.toast(data.message);
                                    $this.removeClass('disabled');
                                    return false;
                                }

                                startSmsTimer(function(){
                                    $this.html(defText).removeClass('disabled');
                                });
                            });
                        } else {
                            // alert(data.message);
                            Common2.toast(data.message);
                            $this.removeClass('disabled');
                            return false;
                        }
                }, 'json');

            }
        });
    $forget.find('.btn-msgcode').click()

    /*显示close*/
    $('.vcode').bind('input propertychange',function(){
       if($(this).val().length > 0){
            $('.close').show();
        }else{
            $('.close').hide();
        }
    })

    /*close*/
    $('.close').on('click',function(){
        $('.vcode').val('')
        $(this).hide();
    })

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

       
        $reset.on('click', '.submit-change', function(){
            var $this = $(this);

            if($this.hasClass('disabled')){
                return false;
            }

            if(checkForm()){
                formData.type = 1;
                Common.validMsgCode(formData.phoneNum, formData2.code, 1, function(data){
                    if(data.code != 1){
                        // alert('验证码输入有误！');
                        Common2.toast('验证码输入有误');
                        $this.removeClass('disabled');
                        return false;
                    }else{
                        $this.addClass('disabled');
                        $.ajax({
                            // url: Setting.apiRoot1 + '/password/reset.p2p',
                            url: Setting.apiRoot1 + '/password/newReset.p2p',
                            type: 'post',
                            dataType: 'json',
                            data: {
                                 password:formData.password,
                                  phoneNum:formData.phoneNum,
                                  code:formData2.code,
                                  type:1,
                                  userId:sessionStorage.getItem('uid')
                            }
                        }).done(function(res){
                            if(res.code != 1){
                                // alert(res.message);
                                Common2.toast(res.message);
                                $this.removeClass('disabled');
                                return false;
                            }
                            // alert('密码重置成功！');
                            Common2.toast('密码重置成功');
                            function  jumurl(){
                                sessionStorage.removeItem('resetInfo');
                                window.location.href = Setting.staticRoot + '/pages/account/login.html';
                            }
                            setTimeout(jumurl,1500);

                        }).fail(function(){
                            // alert('网络链接失败');
                            Common2.toast('网络异常',Setting.staticRoot+'/images/pages/ui/wifi.png');
                            $this.removeClass('disabled');
                            return false;
                        });
                   }
                })
            }
        });
    }

    
});

