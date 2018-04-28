/**
 * Created by User on 2017/3/6.
 */
$(function() {
    var param = Common.getParam();
    var $button = $('.button');//点击放入账户按钮
    var $monery = $('.monery');//提现金额
    var $phone = $('.phoneNumber');//手机号码
    var $passInput = $('.pass_input');//密码输入框
    var $loginCode = $('.log_code');
    var uuid = sessionStorage.getItem('uuid');
    var openId = sessionStorage.getItem('openId');
    var phoneNumber = sessionStorage.getItem('challengerPhone');//获取挑战者的手机号码
	var challengerId = param.challengerId;//擂主ID
	var challengerType = param.challengerType;
    var _monery = sessionStorage.getItem('sumReward');//提现金额


    $monery.html(_monery);
    $phone.html(phoneNumber);

    //challengerType等于40为预注册用户
    if(challengerType == 40) {
        $passInput.show();
        $loginCode.show();
    } else {
        $passInput.hide();
        $loginCode.hide();
    }


    var $msgcode = $('.msgcode');//验证码
    var $password = $('.password');//密码
    var formData = {};
    var smsTimer;
    var defText = '重新发送';
    var timeText = '<strong>{time}</strong>s';
    var $sendAgain = $('.gdiv');
    $sendAgain.click(function() {
        var $this = $(this);
        if($this.hasClass('disabled')){
            return false;
        }
        var registerPhone = phoneNumber;
        $this.addClass('disabled');
        Common.sendMsgCode(registerPhone, 2, function(data){
            if(data.code == -2) {
                activityCash(challengerId)
            }

            if(data.code != 1 && data.code != -2){
                alertBox(data.message);
                $this.removeClass('disabled');
                return false;
            }

            startSmsTimer(function(){
                $this.html(defText).removeClass('disabled');
            });
        });
    });


    //点击把钱放入账户的按钮
    $button.click(function() {
        //如果challengerType为40表示先注册然后执行把钱放入账户的请求
        var $this = $(this);
        if($this.hasClass('disabled')){
            return false;
        }
        var phone = phoneNumber;
        if(challengerType == 40) {
            registerUser();
        } else {
            activityCash(challengerId);
        }
        // window.location.href = '../../../pages/active/muhammad/muhammad_end.html';
    });

    function activityCash(challenId) {
         $.ajax({
             url: Setting.apiRoot1 + '/getActivityCash.p2p',
            type: 'post',
             dataType: 'json',
             data: {
                 challengerId: challenId,
                 uuid:uuid,
                 openId:openId
             }
         }).done(function(res) {
             if(res.code == 1) {

                 window.location.href = '../../../pages/active/muhammad/muhammad_end.html';
             }
         }).fail(function() {
            alertBox('网络链接失败');
        });
    }

    function registerUser() {
        var $this = $button;
        var phone = phoneNumber;
        if(checkForm(phone)) {
            $this.addClass('disabled').html('数据提交中...');
            // 验证短信验证码是否正确
            Common.validMsgCode(formData.phoneNum, formData.msgcode, 2, function(data) {
                if (data.code != 1) {
                    alertBox('验证码输入有误！');
                    $this.removeClass('disabled').html('注册');
                    return false;
                }
                $.ajax({
                    url: Setting.apiRoot2 + '/regist.p2p',
                    type: 'post',
                    dataType: 'json',
                    data: formData
                }).done(function(res) {
                    if (res.code != 1) {
                        alertBox(res.message);
                        $this.removeClass('disabled').html('注册');
                        return false;
                    } else {
                        activityCash(challengerId);
                    }
                });
            });
        }
    }



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
        var msgcode = $.trim($msgcode.val());
        var password = $.trim($password.val());

        if(ph.length == 0){
            alertBox('请输入手机号码！');
            return false;
        }

        if(!Common.reg.mobile.test(ph)){
            alertBox('请输入正确的手机号码！');
            return false;
        }

        if(msgcode.length == 0){
            alertBox('请输入验证码！');
            return false;
        }

        if(password.length == 0){
            alertBox('请输入密码！');
            return false;
        }

        if(!Common.reg.pwd.test(password)){
            alertBox('密码格式有误，请输入6-20位字符！');
            return false;
        }

        formData.phoneNum = $.trim(ph);
        formData.password = md5(password);
        formData.msgcode = msgcode;
        formData.channelId = '992';
        return true;
    }


    function alertBox(tex) {
        var $box = $('.alert_box');
        $('.wrapper').addClass('over');
        $box.show();
        var _html = '';
        var _text = '';
        _html += '<div class="alert_back"></div>' ;
                _text += '<div class="play_box">' +
                '<img src="../../../images/pages/activity/muhammad/close.png" class="closeBox" onclick="closeClick()">' +
                '<div class="sweet_title">温馨提示</div>' +
                '<div class="sweet_play_content">' + tex +'</div>' +
                '<div class="play_button" onclick="closeClick()">确定</div>' +
                '</div>';
        _html += _text;
        _html += '</div>';
        $box.html(_html);
    }
});

function closeClick() {
    $('.wrapper').removeClass('over');
    $('.alert_box').hide();
}
