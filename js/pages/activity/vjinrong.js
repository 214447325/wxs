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
                dataType: 'json',
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
                    if(res.code == -2 && res.message == '您已注册，请直接登录') {
                        alert(res.message);
                        $('.submit').click(function() {
                            $.ajax({
                                url: Setting.apiRoot1 + '/queryInvestPageInfo.p2p',
                                type: 'post',
                                dataType: 'json'
                            }).done(function(res) {
                                if(res.code == 1) {
                                    var _res = res.data.regularList.regularListDetail;
                                    var _data;
                                    for(var i = 0; i < _res.length; i++) {
                                        if(_res[i].investTerm == '4周') {
                                            _data = {
                                                pid: _res[i].prodId,
                                                pname: _res[i].prodTitle,
                                                pmount: _res[i].canBuyAmt,
                                                minInvestAmount: _res[i].minBuyAmt,
                                                maxInvestAmount: _res[i].maxBuyAmt,
                                                maxRate:_res[i].maxRate,
                                                minRate:_res[i].minRate,
                                                addRate:_res[i].addRate,
                                                cycle:_res[i].loanCycle,
                                                cycleType:_res[i].cycleType,
                                                // act10:regularListDetail[i].act10,//是否参加iphone活动 0不参加  1参加
                                                // act11:regularListDetail[i].act11,//是否参加投资返现活动 0不参加  1参加
                                                action:_res[i].action,//是否参加大额加息
                                                action2:_res[i].action2,//是否参加加息券
                                                action5:_res[i].action5,//是否参加投资红包
                                                addInterest:_res[i].addInterestLabel,
                                                detailLabel:_res[i].detailLabel,
                                                buyStatus:_res[i].buyStatus
                                            }
                                        }
                                    }

                                    window.location.href =  Setting.staticActive + '/pages/financing/regular-detail3.0.html?'+ $.param(_data);
                                }

                            }).fail(function() {
                                alert('网络链接失败');
                            });
                        });
                    } else {
                        alert(res.message);
                        $this.removeClass('disabled');
                        return false;
                    }

                }
            }).fail(function() {
                $this.removeClass('disabled');
                alert('网络连接失败');
            });
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
                                    sessionStorage.clear();
                                    sessionStorage.setItem('uname', loginRes.data.phoneNum);
                                    sessionStorage.setItem('uid', loginRes.data.id);
                                    sessionStorage.setItem('uuid', loginRes.data.weixin);
                                    sessionStorage.setItem('ucode', loginRes.data.code);
                                    sessionStorage.setItem('loginToken',loginRes.token);
                                    sessionStorage.setItem('payChannel',loginRes.data.payChannel);
                                    sessionStorage.setItem('relation',loginRes.data.relation);
                                    sessionStorage.setItem('realname',loginRes.data.name);
                                    sessionStorage.setItem('relation',loginRes.data.relation);
                                    confirm("您已成功加入V金融！", function() {
                                        window.location.href = 'http://a.app.qq.com/o/simple.jsp?pkgname=zy.yunhoo.com.zhongyin';
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
    //var $registerStep1 = $('.registered-form');
    //$registerStep1.on('click', '.Verification-code', function(){
    //    var uuid = $.cookie('uuid');
    //    //微信才有UUID
    //    var img = new Image();
    //    img.src = Setting.apiRoot1 + '/code.p2p?type=1&divnceId='+uuid+'&time=' + Date.now();
    //    $(this).html(img);
    //});
    !function(){
        var $registerStep1 = $('.registered-form');
        if($registerStep1.length > 0){
            $registerStep1.on('click', '.Verification-code', function(){
                //var uuid = $.cookie('uuid');
                //微信才有UUID
                var uuid = $.cookie('uuid');
                var img = new Image();
                //img.src =  Setting.apiRoot1 + '/code.p2p?type=1&divnceId=' + uuid + '&time=' + Date.now();
                //img.src =  'http://106.15.44.101/group1/M00/00/0D/ag8sZVkenKKAZnQoAABBJalppHw801.jpg';
                img.src =  Setting.apiRoot3 + '/code.p2p?type=1&divnceId=' + uuid + '&time=' + Date.now();
                $(this).html(img);
            });

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