/**
 * Created by User on 2016/8/24.
 */
$(function() {
/**
 * 提示框
 * @param {Object} msg
 */
var tip = function(msg) {
    var div = document.createElement("div");
    div.setAttribute("class", "popup-tip");
    div.innerHTML = '<span>' + msg + '</span>';
    document.getElementsByTagName("body")[0].appendChild(div);
    setTimeout(function() {
        document.getElementsByTagName("body")[0].removeChild(div);
    }, 1500);
};

    var $returnPage = $('.img-header');//点击页面顶部的返回上一页按钮
    var $phone = $('.tel-phone');//获取手机号码
    var $refer = $('.unknown');//点击推荐下拉框
    var $friends = $('.friends-number');//显示好友邀请的输入框
    var $showPassworld = $('.show-img');//点击显示密码
    var $passworld = $('.password');//密码框
    var $checked = $('.isChecked');//勾选框

    var param = Common.getParam();
    var inviteCode = sessionStorage.getItem('inviteCode');
    var imgcode = param.imgcode;
    var divnceId = param.divnceId;
    var channelId = param.channelId;

    //解析地址栏信息
    var params = Common.getParam();
    var phone = params.telPhone;
    $phone.text('');
    $phone.text(phone);

    //点击返回上一页按钮
    $returnPage.click(function() {
        window.location.href = '../../pages/account/register.html'
    });

    //点击推荐下拉框
    var isRefer = true;
    $refer.click(function() {
        if(isRefer) {
            $(this).attr({'src': '../../images/pages/account/unup3.0.png'});
            $friends.show();
            isRefer = false;
        } else {
            $(this).attr({'src': '../../images/pages/account/unknown3.0.png'});
            $friends.hide();
            isRefer = true;
        }
    });

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

    //点击勾选框
    var isChecked = true;
    if(isChecked) {
        $checked.attr({'src': '../../images/pages/account/ischecked-true.png'}).addClass('isTrue');
        isChecked = false;
    }

    $checked.click(function() {
        if(isChecked) {
            $(this).attr({'src': '../../images/pages/account/ischecked-true.png'}).addClass('isTrue');
            isChecked = false;
        } else {
            $(this).attr({'src': '../../images/pages/account/isChecked.png'}).removeClass('isTrue');
            isChecked = true;
        }
    });


    /**
     * Register Step2
     * @return {[type]} [description]
     */
    !function(){
        var $registerStep2 = $('.register-step2');

        if($registerStep2.length > 0){
            // 读取注册上一步中的电话号码
            var $registerPhone = $('input[name="phone"]');
            var $sendAgain = $('.btn-msgcode');

            var registerPhone = sessionStorage.getItem('registerPhone');
            if(!registerPhone){
                window.location.href = Setting.staticRoot + '/pages/account/register.html';
                return false;
            }
            $registerPhone.html(registerPhone);

            // var inviteCode = sessionStorage.getItem('inviteCode');
            if(inviteCode && inviteCode != 'undefined'){
                $('[name=invitation]').val(inviteCode);
                $('[name=invitation]').attr("readonly", true);
            }

            // 为用户发送短信验证码
            var smsTimer;
            var defText = '重新获取';
            sessionStorage.setItem('shebeihao','0');
            var timeText = '<strong>({time}s)</strong>';
            $sendAgain.on('click', function(){
                var $this = $(this);
                if($this.hasClass('disabled')){
                    return false;
                }
                registerPhone = $.trim(phone);
                $this.addClass('disabled');
                var uuid = $.cookie('uuid');
                Common.sendMsgCode(registerPhone, 2, imgcode, divnceId, function(data){
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
                    sessionStorage.setItem('shebeihao',_i)
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
            $password.val('');
            var $invitation = $('[name=invitation]');

            var formData = {};
            var data = {};

            $invitation.focusout(function(event) {
                 // inviteCode = $.trim($invitation.val());
                 if (inviteCode!=null && inviteCode!='') {
                          //邀请码接口
                          $.ajax({
                              url: Setting.apiRoot1 + '/getUserByInviteCode.p2p',
                              type: 'post',
                              dataType: 'json',
                              data:{
                                inviteCode: inviteCode
                              }
                          }).done(function(res){
                        if(res.code == 1){
                            // (res.message);
                        }else{
                           tip(res.message);
                        }

                      }).fail(function(){
                        // alert('网络链接失败');
                        Common2.toast('网络异常',Setting.staticRoot+'/images/pages/ui/wifi.png');
                        return false;
                      });
                  }

            });
            function checkForm(ph){
                var msgcode = $.trim($msgcode.val());
                var password = $.trim($password.val());
                var invitation = inviteCode;

                if(ph.length == 0){
                    Common2.toast('请输入手机号码');
                    return false;
                }

                if(!Common.reg.mobile.test(ph)){
                    // alert('请输入正确的手机号码！');
                    Common2.toast('请输入正确的手机号码');
                    return false;
                }

                if(msgcode.length == 0){
                    // alert('请输入验证码！');
                    Common2.toast('请输入验证码');

                    return false;
                }

                if(password.length == 0){
                    // alert('请输入密码！');
                    Common2.toast('请设置登录密码');
                    return false;
                }

                if(!Common.reg.pwd.test(password)){
                    // alert('密码格式有误，请输入6-20位字符！');
                    Common2.toast('密码格式有误，请输入6-20位字符');
                    return false;
                }

                if(isChecked){
                    // alert('请阅读并同意《V金融理财协议》');
                    Common2.toast('请先勾选并同意平台服务协议');
                    return false;
                }

                formData.phoneNum = phone;
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

            $registerStep2.on('click', '.next-btn', function(){

                var $this = $(this);

                if($this.hasClass('disabled')){
                    return false;
                }
                phone = $.trim(phone);

                if(checkForm(phone)){
                    $this.addClass('disabled').html('数据提交中...');

                    // 验证短信验证码是否正确
                    Common.validMsgCode(formData.phoneNum, formData.msgcode, 2, function(data){
                        if(data.code != 1){
                            if (data.code == -2) {
                                Common2.toast('短信验证码已过期');
                                $this.removeClass('disabled').html('注册');
                                return false;
                            }
                            Common2.toast('短信验证码不正确');
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
                                // alert(res.message);
                                Common2.toast(res.message);
                                $this.removeClass('disabled').html('注册');
                                return false;
                            }

                            // alert('注册成功！');
                            Common2.toast('注册成功');
                            function  jumurl(){

                                $.post(Setting.apiRoot2 + '/login.p2p',{loginName: formData.phoneNum, password: formData.password}, function(res) {
                                    console.log(JSON.stringify(res));
                                    var downloadStatus = sessionStorage.getItem('status');
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
                                    sessionStorage.setItem('gifts20171111',res.data.gifts20171111);//是否购买过新手标
                                    if(res.data.gifts20171111 == 0){
                                        var list = JSON.stringify(res.data.giftsList20171111)
                                        sessionStorage.setItem('giftsList',list);
                                        sessionStorage.setItem('gifts20171111Flag',1);
                                    }
                                    if(res.data.isBirthday == 1){
                                        var list = JSON.stringify(res.data.resList)
                                        sessionStorage.setItem('resList',list);
                                        sessionStorage.setItem('birthdayFlag',1);
                                    }
                                    if(param.from!=null && param.from!=undefined){
                                        window.location.href = decodeURIComponent(param.from);
                                    }else{
                                        window.location.href =  '../../pages/my-account/myAccount.html';
                                    }
                                },'json');
                            }
                            setTimeout(jumurl,1500);

                        }).fail(function(){
                            // alert('网络链接失败');
                            Common2.toast('网络异常',Setting.staticRoot+'/images/pages/ui/wifi.png');
                            $this.removeClass('disabled').html('注册');
                            return false;
                        });
                    });
                }
            });

        }

         
        
    }();
        /*显示close*/
        $('.msgcode').bind('input propertychange',function(){
            if($(this).val().length > 0){
                $('.close').show();
            }else{
                $('.close').hide();
            }
        })
        /*close*/
        $('.close').on('click',function(){
            $('.msgcode').val('');
             $(this).hide();
        })
});