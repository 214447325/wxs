/**
 * Created by User on 2017/5/12.
 */
$(function() {
    var param = Common.getParam();
    var channelId = param.channelId;//渠道ID为5001；
    var $phone = $('.tel-phone');//获取输入的手机号码
    var $msgcode = $('.msgcode');//验证码
    var $password = $('.password');//密码
    var formData = {};
    var smsTimer;
    var defText = '重新发送';
    var timeText = '<strong>{time}</strong>s';
    var $sendAgain = $('.gdiv');
    var uid = $.cookie('uuid');
    $sendAgain.click(function() {
        var $this = $(this);
         if($this.hasClass('disabled')){
            return false;
        }
        var $vcode = $('input[name="vcode"]');
        var inputVal = $.trim($vcode.val());
        var registerPhone = $.trim($phone.val());
        $this.addClass('disabled');
        if(registerPhone == "" || registerPhone == null || registerPhone == undefined){
            alert("请输入您的手机号");
            $this.removeClass('disabled');
            return false;
        }else{
            if(inputVal == '' || inputVal == null || inputVal == undefined ) {
                alert('请输入图形验证码');
                $this.removeClass('disabled');
                return false;
            }
            $.ajax({
                url:Setting.apiRoot1 + "/isRegist.p2p?divnceId=" + uid,
                type:"post",
                data:{
                    type:2,
                    code:inputVal,
                    phoneNum:registerPhone
                }
            }).done(function(res){
                if(res.code == 1){
                    Common.sendMsgCode(registerPhone, 2,inputVal,uid, function(data){
                        if(data.code != 1){
                            alert(data.message);
                            $this.removeClass('disabled');
                            return false;
                        }
                        startSmsTimer(function(){
                            $this.html(defText).removeClass('disabled');
                        });
                    });
                } else {
                    alert(res.message);
                    $this.removeClass('disabled');
                    return false;
                }
            })
        }
    });

    //点击立即注册按钮
    $('.bto').click(function() {
        var $vcode = $('input[name="vcode"]');
        var inputVal = $vcode.val();

        var $this = $(this);
        if($this.hasClass('disabled')){
            return false;
        }
        var phone = $.trim($phone.val());

        if(checkForm(phone,inputVal)) {
            $this.addClass('disabled');
            // 验证短信验证码是否正确
            Common.validMsgCode(formData.phoneNum, formData.msgcode, 2, function(data) {
                if (data.code != 1) {
                    alert('验证码输入有误！');
                    $this.removeClass('disabled');
                    return false;
                }
                $.ajax({
                    url: Setting.apiRoot2 + '/regist.p2p',
                    type: 'post',
                    dataType: 'json',
                    data: formData,
                }).done(function(res) {
                    if (res.code != 1) {
                        alert(res.message);
                        $this.removeClass('disabled');
                        return false;
                    } else {
                        $.ajax({
                            url: Setting.apiRoot2 + "/login.p2p",
                            data:{
                                loginName:formData.phoneNum,
                                password:formData.password
                            },
                            success:function(loginRes){
                                // 判断登录状态是否为1
                                if(loginRes.code == 1){
                                    var downloadStatus = sessionStorage.getItem('status');//获取首页下载APP的按钮的状态
                                    sessionStorage.clear();
                                    sessionStorage.setItem('uname', res.data.phoneNum);
                                    sessionStorage.setItem('nickName',res.data.nickName);
                                    sessionStorage.setItem('avatar',res.data.avatar);
                                    sessionStorage.setItem('uid', res.data.id);
                                    sessionStorage.setItem('uuid', res.data.weixin);
                                    sessionStorage.setItem('ucode', res.data.code);
                                    sessionStorage.setItem('loginToken',res.token);
                                    sessionStorage.setItem('payChannel',res.data.payChannel);
                                    sessionStorage.setItem('realname',res.data.name);//zyx add
                                    sessionStorage.setItem('relation',res.data.relation);//zyx add
                                    sessionStorage.setItem('cardNum',res.data.cardNum);//身份证
                                    sessionStorage.setItem('validTrade',res.data.validTrade);//是否设置交易密码
                                    sessionStorage.setItem('validName',res.data.validName);//是否设置实名认证
                                    sessionStorage.setItem('status',downloadStatus);
                                    sessionStorage.setItem('newProd',res.data.newProd);//是否购买过新手标
                                    sessionStorage.setItem('isBirthday',res.data.isBirthday);//是否购买过新手标
                                    if(res.data.isBirthday == 1){
                                        var list = JSON.stringify(res.data.resList);
                                        sessionStorage.setItem('resList',list);
                                        sessionStorage.setItem('birthdayFlag',1);
                                    }
                                    confirm("您已成功加入V金融！", function() {
                                        window.location.href = Setting.staticRoot + '/pages/financing/regular.html';
                                    });
                                }
                                else{
                                    alert(loginRes.message);
                                }
                            }
                        })
                    }
                });
            });
        }
    });
    !function(){
        var $registerStep1 = $('.registered-form');

        if($registerStep1.length > 0){
            $registerStep1.on('click', '.Verification-code', function(){
                $('input[name="vcode"]').val("");
                //var uuid = $.cookie('uuid');
                var uuid = undefined;
                //微信才有UUID
                var img = new Image();
                img.src = Setting.apiRoot1 + '/code.p2p?type=1&divnceId='+uuid+'&time=' + Date.now();
                $(this).html(img);
            })

            $('.Verification-code').trigger('click');
        }
    }();
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

    function checkForm(ph){
        var $vcode = $('input[name="vcode"]');
        var msgcode = $.trim($msgcode.val());
        var password = $.trim($password.val());
        var vcode = $.trim($vcode.val());
        if(!Common.reg.mobile.test(ph)){
            alert('请输入正确的手机号码！');
            return false;
        }
        if(vcode.length == 0){
            alert('请输入图形验证码');
            return false;
        }
        if(ph.length == 0){
            alert('请输入手机号码！');
            return false;
        }

        if(msgcode.length == 0){
            alert('请输入验证码！');
            return false;
        }

        if(password.length == 0){
            alert('请输入密码！');
            return false;
        }

        if(!Common.reg.pwd.test(password)){
            alert('密码格式有误，请输入6-20位字符！');
            return false;
        }

        formData.vcode = vcode;
        formData.phoneNum = $.trim(ph);
        formData.password = md5(password);
        formData.msgcode = msgcode;
        formData.peer = "weixin";
        formData.channelId = channelId;

        //var uuid = $.cookie('uuid');
        //if(uuid){
        //    formData.uuid = uuid;
        //}
        return true;
    }
});