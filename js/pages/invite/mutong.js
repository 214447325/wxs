/**
 *
 * @author  zyx
 * @return {[type]}       [description]
 */

$(function () {

    /* 9-42行 实现置地按钮条跟随滚动进行隐藏；点击跳转到对应form上；  */
    var search = window.location.search;
    if (search == '?user=1') {
        $('.regist').hide();
    } else {
        window.location.href = '#invite';
    }
    $('.regist').click(function () {
        window.location.href = '#form-user'
        $('.regist').hide();
    });
    $('.wrapper').scroll(function () {
        //滚动条滚动的距离
        var scroHeight = $(this).scrollTop();

        var $window = $(window).height();

        //到达指定的div的距离
        var joinHeight = $('#join').height();

        var bodyHeight = $('body').height();

        var invitefriendHeight = $('.invitefriend').height();

        var h = $window + 300;

        if (scroHeight >= h) {

            $('.regist').hide();

        } else {
            $('.regist').show();
        }
    });

    var visiturl = location.search; //获取url中"?"符后的字串
    var param = {};
    if (visiturl.indexOf("?") != -1) {
        var str = visiturl.substr(1);
        strs = str.split("&");
        for (var i = 0; i < strs.length; i++) {
            param[strs[i].split("=")[0]] = decodeURIComponent(strs[i].split("=")[1]);
        }
    }

    var channelId = param.channelId;

    var $registerStep1 = $('.inviteregister');

    var inviteCode = param.code;
    var phone = param.phone;

    var ph = phone;

    var xcode = param.ucode;
    if (xcode != null && xcode != undefined && xcode != '(null)' && xcode != '') {
        inviteCode = xcode;
    }

    var $sendAgain = $('.send-sms-code');
    var $inputphone = $('[name=phone]', $registerStep1);

    // 为用户发送短信验证码
    var smsTimer;
    var defText = '重新<br />发送验证码';
    var timeText = '<strong>{time}</strong>s<br />后重新发送';
    var $datalist = $('.datalist');
    var $red = $('.red');
    //V金融广播 接口
    // $.ajax({
    //     url: Setting.apiRoot1 + '/getInviteDetailList.p2p',
    //     type: 'post',
    //     dataType: 'json'
    //   }).done(function(res){

    //   	if(res.code == -1){
    //           alert('查询失败');
    //           return false;
    //         }
    //         $red.html(res.data.totalNumber);

    //         var list = res.data.list;
    //         if(list.length>0){
    //         	var html = "";
    //         	for(var i=0;i<list.length;i++){
    //         		html += "<li><p>";
    //         		html += "<span>&nbsp;"+list[i].mainName+"&nbsp;</span>";
    //         		html += "<em>邀请好友</em>";
    //         		html += "<span >&nbsp;"+list[i].subName+"&nbsp;</span>&nbsp;";
    //         		html += "<em>投资</em><span >"+list[i].investAmount+"</span><em>元</em>&nbsp;";
    //         		html += "<em>瓜分</em><span >"+list[i].totalAmount+"</span><em>元 现金</em>";
    //         		html += "</p></li>";
    //         	}
    //         }
    //         $('.datalist').html(html);

    //   }).fail(function(){
    //     alert('网络链接失败');
    //   });

    $sendAgain.on('click', function () {
        var ph = $inputphone.val();
        var $this = $(this);
        if ($this.hasClass('disabled')) {
            return false;
        }
        $this.addClass('disabled');
        if (ph == "" || ph.length == 0) {
            alert('手机号码不能为空！');
            $this.removeClass('disabled');
            return false;
        }
        if (!Common.reg.mobile.test(ph)) {
            alert('请输入正确的手机号码！');
            $this.removeClass('disabled');
            return false;
        }
        Common.sendMsgCode(ph, 2, function (data) {
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

    var formData = {};

    function checkForm() {
        // 注册提交
        var $msgcode = $('[name=sms-code]', $registerStep1);
        var $password = $('[name=new-password]', $registerStep1);
        var msgcode = $.trim($msgcode.val());
        var password = $.trim($password.val());
//        var invitation = inviteCode;
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

        formData.phoneNum = $.trim(inputphone);
        formData.password = md5(password);
        formData.msgcode = msgcode;
        //formData.invitationCode = invitation;
        formData.peer = "weixin";

        if (channelId != null && channelId != undefined && channelId != '(null)' && channelId != '') {
            formData.channelId = channelId;
        }


        var uuid = $.cookie('uuid');
        if (uuid) {
            formData.uuid = uuid;
        }
        return true;
    }

    $registerStep1.on('click', '.inviteMoneybtn', function () {
        var $this = $(this);
        if ($this.hasClass('disabled')) {
            return false;
        }

        if (checkForm()) {
            $this.addClass('disabled');

            // 验证短信验证码是否正确
            Common.validMsgCode(formData.phoneNum, formData.msgcode, 2, function (data) {
                if (data.code != 1) {
                    alert('验证码输入有误！');
                    $this.removeClass('disabled');
                    return false;
                }

                // 验证码输入正确
                $.ajax({
                    url: Setting.apiRoot2 + '/regist.p2p',
                    type: 'post',
                    dataType: 'json',
                    data: formData
                }).done(function (res) {
                    if (res.code == 1) {

                        alert('注册成功！');

                        var formData1 = {};

                        formData1.loginName = formData.phoneNum;
                        formData1.password = formData.password;

                        var uuid = $.cookie('uuid');
                        if (uuid) {
                            formData1.uuid = uuid;
                        }

                        $.ajax({
                            url: Setting.apiRoot2 + '/login.p2p',
                            type: 'post',
                            dataType: 'json',
                            data: formData1,
                            cache: false
                        }).done(function (res) {

                            if (res.code == 1) {
                                sessionStorage.clear();
                                sessionStorage.setItem('uname', res.data.phoneNum);
                                sessionStorage.setItem('uid', res.data.id);
                                sessionStorage.setItem('ucode', res.data.code);
                                sessionStorage.setItem('loginToken', res.token);
                                sessionStorage.setItem('payChannel', res.data.payChannel);
                                sessionStorage.setItem('relation', res.data.relation);
                                sessionStorage.setItem('realname', res.data.name);//zyx add
                                sessionStorage.setItem('relation', res.data.relation);//zyx add

                                alert("您已成功加入V金融！");
                                function jumurl() {
                                    window.location.href = Setting.staticRoot + '/pages/financing/float.html';
//                      	  window.location.href = Setting.staticRoot + '/pages/invite/invitesuccess.html?phone='+phone;
                                }

                                setTimeout(jumurl, 1000);


                            } else {
                                alert(res.message);
                                $this.removeClass('disabled').text(defText);
                            }
                        }).fail(function () {
                            alert('网络链接失败');
                            $this.removeClass('disabled').text(defText);
                            return false;
                        });

                    } else if (res.code == -2) {
                        alert(res.message);
                        $this.removeClass('disabled');
                        return false;
                    } else {
                        alert(res.message);
                        $this.removeClass('disabled');
                        return false;
                    }

                }).fail(function () {
                    alert('网络链接失败');
                    $this.removeClass('disabled');
                    return false;
                });
            });
        }
    });


    $('.Bonusrules').click(function (event) {
        $('.maskLayer').css('display', 'block');
        $('#center').removeClass('center').addClass('centerOpen');
        $('.close').click(function (event) {
            $('.maskLayer').css('display', 'none');
            $('#center').removeClass('centerOpen').addClass('center');
        })

    });


});