/**
 * Created by User on 2016/7/19.
 */

$(function () {
    //从地址栏中解析手机号码
    var phone = Common.getParam().phoneNum;
    var channelId = Common.getParam().channelId;
    $('input[name="phone"]').val(phone);
    //进入注册界面的时候就向用户发送验证码
    getSend();
    $('.send-sms-code').click(function () {
        //点击验证码按钮的时候重新发送验证码
        getSend();
    });

    $('.acqImg3').click(function () {
        //判断手机号码和验证码以及密码是否合法
        if (checkForm()) {
            var phoneNum = $.trim($('input[name="phone"]').val());
            var msgcode = $('input[name="sms-code"]').val();
            var password = md5($('input[name="new-password"]').val());
            $.post(Setting.apiRoot2 + '/registForInvestPackage.p2p', {
                phoneNum: phoneNum,
                password: password,
                identifyCode: msgcode,
                channelId: channelId
            }, function (datas) {
                var code = datas.code;
                if (code == -1) {
                    alert(datas.message);
                }
                var userStatus = datas.data.userStatus;
                if (code == 1) {
                    alert(datas.message);
                    setTimeout(function () {
                        jump(userStatus, phoneNum)
                    }, 1000);
                }
            }, 'json');
        }
    });
});

function jump(userStatus, phoneNum) {
    var s;
    s = '?userStatus=' + userStatus + '&&phoneNum=' + phoneNum;
    window.location.href = '../../pages/redPacket/downloadAPP.html' + s;
}

//获取验证码以及验证码60s计时
function getSend() {
    // 为用户发送短信验证码
    var smsTimer;
    var defText = '重新发送';
    var timeText = '<strong>{time}</strong>s';
    var $inputphone = $('input[name="phone"]');
    var ph = $inputphone.val();
    var $sendAgain = $('.send-sms-code');

    if ($sendAgain.hasClass('disabled')) {
        return false;
    }
    $sendAgain.addClass('disabled');
    if (ph == "" || ph.length == 0) {
        alert('手机号码不能为空！');
        $sendAgain.removeClass('disabled');
        return false;
    }
    if (!Common.reg.mobile.test(ph)) {
        alert('请输入正确的手机号码！');
        $sendAgain.removeClass('disabled');
        return false;
    }
    Common.sendMsgCode(ph, 2, function (data) {
        if (data.code != 1) {
            alert(data.message);
            $sendAgain.removeClass('disabled');
            return false;
        }
        startSmsTimer(function () {
            $sendAgain.html(defText).removeClass('disabled');
        });
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

//	var formData = {};
    return true;
}

function checkForm() {
    // 注册提交
    var $inputphone = $('input[name="phone"]');
    var $msgcode = $('input[name="sms-code"]');
    var $password = $('input[name="new-password"]');
    var msgcode = $.trim($msgcode.val());
    var password = $.trim($password.val());
    var inputphone = $inputphone.val();
    if (inputphone.length == 0) {
        alert('请输入手机号码！');
        return false;
    }

    if (!Common.reg.mobile.test(inputphone)) {
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
    return true;
}
