/**
 * Created by User on 2016/11/29.
 * 882
 */
$(function () {
    var $bto1 = $('.bto1');
    var param = Common.getParam();
    var channelId = param.channelId;
    var phone = param.phone;
    var inviteCode = param.code;
    var phoneNumber = '';
    if (phone != null && phone != undefined && phone != '') {
        phoneNumber = phone.substring(0, 3) + '****' + phone.substring(7, 11);
        //$('.span').html(phoneNumber);
        $('.dtext').html('您的好友<span class="span">' + phoneNumber + '</span>邀请您加入V金融，同享高额年化，拿会员福利！');
    } else {
        $('.dtext').html('"上"服务器的人太多了，感受身体被掏空了~待会再来宠幸人家吧！');
    }

    $(".wrapper").scroll(function (data) {
        var $wrapper = $(".wrapper");
        var topHeight = $wrapper.scrollTop();//获取滚动的距离
        var _height = $('.head').height() + $('.dialog').height() + $('.banner').height();
        var _height1 = $wrapper.height() + $('.rbox').height();

        if (topHeight > _height && _height1 > topHeight) {
            $bto1.show();
        } else {
            $bto1.hide();
        }
    });

    //点击立即注册的悬浮按钮
    $bto1.click(function () {
        window.location.href = '#form';
    });

    var $phone = $('.tel-phone');//获取输入的手机号码
    var $msgcode = $('.msgcode');//验证码
    var $password = $('.password');//密码
    var formData = {};
    var smsTimer;
    var defText = '重新发送';
    var timeText = '<strong>{time}</strong>s';
    var $sendAgain = $('.gdiv');
    var $imgCodeText = $('.imgCodeText');//图形验证框

    var uuid = $.cookie('uuid');

    !function () {
        var $registerStep1 = $('#form');
        if ($registerStep1.length > 0) {
            $registerStep1.on('click', '.Verification-code', function () {
                //var uuid = $.cookie('uuid');
                //微信才有UUID
                var uuid = $.cookie('uuid');
                var img = new Image();
                //img.src =  Setting.apiRoot1 + '/code.p2p?type=1&divnceId=' + uuid + '&time=' + Date.now();
                //img.src =  'http://106.15.44.101/group1/M00/00/0D/ag8sZVkenKKAZnQoAABBJalppHw801.jpg';
                img.src = Setting.apiRoot1 + '/vspecial/graphics/code.p2p?type=1&divnceId=' + uuid + '&time=' + Date.now();
                $(this).html(img);
            });

            $('.Verification-code').trigger('click');
        }
    }();
    //var $registernumber = $('.registernumber');//图形验证码
    //var Imgsrc = Setting.apiRoot1 + '/code.p2p?type=1&divnceId='+uuid+'&time=' + Date.now();
    //$registernumber.html('<img src="' + Imgsrc + '" />');
    //$registernumber.click(function() {
    //    Imgsrc = Setting.apiRoot1 + '/code.p2p?type=1&divnceId='+uuid+'&time=' + Date.now();
    //    $registernumber.html('<img src="' + Imgsrc + '" />');
    //});

    $sendAgain.click(function () {
        var $this = $(this);
        var _imgCodeValue = $.trim($imgCodeText.val());
        var registerPhone = $.trim($phone.val());

        if (registerPhone == null || registerPhone == undefined || registerPhone == '') {
            alert('请输入手机号码');
            return false;
        }

        if (_imgCodeValue == null || _imgCodeValue == undefined || _imgCodeValue == '') {
            alert('请输入图形验证码');
            return false;
        }

        if ($this.hasClass('disabled')) {
            return false;
        }

        $this.addClass('disabled');
        Common.sendMsgCode(registerPhone, 2, _imgCodeValue, uuid, function (data) {
            if (data.code != 1) {
                alert(data.message);
                $this.removeClass('disabled');
                return false;
            }
            startSmsTimer(function () {
                $this.html(defText).removeClass('disabled');
            });
        });
    });

    //点击立即注册按钮
    $('.bto').click(function () {
        var $this = $(this);
        if ($this.hasClass('disabled')) {
            return false;
        }
        var phone = $.trim($phone.val());
        if (checkForm(phone)) {
            $this.addClass('disabled');
            // 验证短信验证码是否正确
            Common.validMsgCode(formData.phoneNum, formData.msgcode, 2, function (data) {
                if (data.code != 1) {
                    alert('验证码输入有误！');
                    $this.removeClass('disabled');
                    return false;
                }
                $.ajax({
                    url: Setting.apiRoot2 + '/regist.p2p',
                    type: 'post',
                    dataType: 'json',
                    data: formData
                }).done(function (res) {
                    if (res.code != 1) {
                        alert(res.message);
                        $this.removeClass('disabled');
                        return false;
                    } else {
                        $.ajax({
                            url: Setting.apiRoot2 + "/login.p2p",
                            data: {
                                loginName: formData.phoneNum,
                                password: formData.password
                            },
                            success: function (loginRes) {
                                // 判断登录状态是否为1
                                if (loginRes.code == 1) {
                                    sessionStorage.clear();
                                    sessionStorage.setItem('uname', loginRes.data.phoneNum);
                                    sessionStorage.setItem('uid', loginRes.data.id);
                                    sessionStorage.setItem('uuid', loginRes.data.weixin);
                                    sessionStorage.setItem('ucode', loginRes.data.code);
                                    sessionStorage.setItem('loginToken', loginRes.token);
                                    sessionStorage.setItem('payChannel', loginRes.data.payChannel);
                                    sessionStorage.setItem('relation', loginRes.data.relation);
                                    sessionStorage.setItem('realname', loginRes.data.name);
                                    sessionStorage.setItem('relation', loginRes.data.relation);
                                    confirm("您已成功加入V金融！", function () {
                                        window.location.href = Setting.staticRoot + '/pages/financing/regular.html';
                                    });
                                }
                                else {
                                    alert(loginRes.message);
                                }
                            }
                        })
                    }
                });
            });
        }
    });

    // 短信发送定时器
    function startSmsTimer(timeOver) {
        if (!!smsTimer) {
            clearInterval(smsTimer);
        }
        var _i = Common.vars.sendWait;
        smsTimer = setInterval(function () {
            $sendAgain.html(timeText.replace(/{time}/, _i--));
            if (_i < 0) {
                clearInterval(smsTimer);
                smsTimer = null;
                timeOver();
            }
        }, 1000);
    }

    function checkForm(ph) {
        var msgcode = $.trim($msgcode.val());
        var password = $.trim($password.val());

        if (ph.length == 0) {
            alert('请输入手机号码！');
            return false;
        }

        if (!Common.reg.mobile.test(ph)) {
            alert('请输入正确的手机号码！');
            return false;
        }

        if (msgcode.length == 0) {
            alert('请输入验证码！');
            return false;
        }

        if (password.length == 0) {
            alert('请输入密码！');
            return false;
        }

        if (!Common.reg.pwd.test(password)) {
            alert('密码格式有误，请输入6-20位字符！');
            return false;
        }

        formData.phoneNum = $.trim(ph);
        formData.password = md5(password);
        formData.msgcode = msgcode;
        formData.invitationCode = inviteCode;
        formData.peer = "weixin";
        formData.channelId = '992';
        //zyx 20160506 微信分多个注册渠道
        if (!channelId) {
            formData.channelId = "992";
        } else {
            formData.channelId = channelId;
        }

        var uuid = $.cookie('uuid');
        if (uuid) {
            formData.uuid = uuid;
        }
        return true;
    }

});