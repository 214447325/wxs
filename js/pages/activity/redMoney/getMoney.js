/*
*
* 现金红包活动页面
*
* @getUrlVars().parameter          * 获取url中参数
* @isMobilePhone(mobilePhone)      * 验证输入的是否为手机号
* @textLength(text,min,max)        * 验证输入字符范围
* @isNumber(number)                * 验证输入是否为数字
* @dialog(btn,title,desc,fn)       * 弹出确认信息
* @scrollTop(scroll,time)          * 指定时间向上间隔滚动
* @encryptedPhone(mobilePhone)     * 手机号中间四位隐藏
*
* @auther:leelean
* @time:2016-09-28 18:00
*
*/

$(function(){
    var isTure =true;
    var joinHeight = $('.join').height();
    var bannerHeight = $('.banner').height();

    var inviteCode = '';
    $(document).scroll(function() {
        //滚动条滚动的距离
        var scroHeight = $(this).scrollTop();
        //console.log(scroHeight+"-"+bannerHeight - scroHeight)
        if (joinHeight >= bannerHeight - scroHeight) {
            $('.fixed-bottom').hide();
        } else {
            $('.fixed-bottom').show();
        }
    });

    var Common =  {reg:{
        mobile: /^((\+86)|(\(\+86\)))?-?(13|15|18|17)[0-9]{9}$/, // 验证手机号码
        pwd: /^[a-zA-Z0-9]{6,20}$/, // 登录密码 6-16位字符
        payPwd: /^[0-9]{6}$/, // 交易密码 6-16位字符
        isNum: /^[0-9]*$/,
        money: /^\d{1,12}(?:\.\d{1,2})?$/, // money
        idCard: /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/ // 身份证
    }

    };
    var getMoney = !function(){

        var self = this;

        // model
        this.model = {

            // 获取url中参数
            getUrlVars:function (){
                var vars = [],
                    hash;
                var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
                for (var i = 0; i < hashes.length; i++) {
                    hash = hashes[i].split('=');
                    vars.push(hash[0]);
                    var reg = /\#/g;
                    if (!hash[1]) {
                        return false;
                    }
                    var regHash = hash[1].replace(reg, function (word) {
                        return /\#/.test(word) && "";
                    });
                    vars[hash[0]] = regHash;
                }
                return vars;
            },
            // 验证输入的是否为手机号
            isMobilePhone:function(mobilePhone){
                var mobilePhone = mobilePhone;
                if(/^((\+86)|(\(\+86\)))?-?(13|15|18|17)[0-9]{9}$/.test(mobilePhone)){
                    return true;
                }else{
                    return false;
                }
            },
            // 验证输入字符范围
            textLength:function(text,min,max){
                var length = text.length;
                if(length>=min && length<=max){
                    return true;
                }else{
                    return false;
                }
            },
            // 验证输入是否为数字
            isNumber:function(number){
                if(!number==""){
                    if(/^[0-9]*$/.test(number)){
                        return true;
                    }else{
                        return false;
                    }
                }else{
                    return false;
                }
            },

            // 弹出框
            clickDialog:function(title,desc,fn){

                var $dialog = $(".dialog"),
                    $dialog_title = $(".dialog-title"),
                    $dialog_desc = $(".dialog-desc"),
                    $dialog_btn = $(".dialog-btn");

                // 触发dialog
                $dialog.removeClass("hide");
                $dialog_title.text(title);
                $dialog_desc.text(desc);

                // 点击确定按钮
                $dialog_btn.click(function(){
                    $dialog.addClass("hide");
                    if(fn){
                        fn();
                    }else{
                        return false;
                    }
                });
            },

            // 自动滚动，每三秒滚动一次
            scrollTop:function(scroll,time){
                var area = $(scroll);
                var timespan = time;
                var timeID;
                area.hover(function(){
                    clearInterval(timeID);
                },function(){
                    timeID = setInterval(function(){
                        var moveline = area.find("li:first");
                        var lineheight = moveline.height();
                        moveline.animate({marginTop:-lineheight+"px"},500,function(){
                            moveline.css("marginTop",0).appendTo(area);
                        });
                    },timespan)
                }).trigger("mouseleave");
            },

            // 手机号中间四位加密
            encryptedPhone:function(mobilePhone){
                var mobilePhone = mobilePhone;
                var phoneNumber = '';
                if (mobilePhone != undefined && mobilePhone != null && mobilePhone != '') {
                    phoneNumber = mobilePhone.substring(0,3) + "****" + mobilePhone.substring(8,11);
                } else {
                    phoneNumber = 'undefined邀请人未找到';
                    self.model.clickDialog("温馨提示","因邀请码未找到,请注册后补填邀请码！");
                }
                return phoneNumber;
            }
        };

        // controller
        this.controller = {

            // 设置手机号
            setPhone:function(){

                // 手机号中间四位隐藏
                var mobilePhone = self.model.getUrlVars().phone;
                inviteCode = self.model.getUrlVars().code;
                var phoneNumber = self.model.encryptedPhone(mobilePhone);
                self.view.setPhone(".mobilePhone",phoneNumber);

            },

            // 点击注册按钮
            formSubmit:function(){
                console.log(JSON.stringify(inviteCode));
                var phone = $("#phone").val();
                var code = $("#code").val();
                var pwd = $("#pwd").val();

                if(phone == null || phone == '') {
                    self.model.clickDialog("温馨提示","请你输入手机号码！");
                    return false;
                }

                if(code == null || code == '') {
                    self.model.clickDialog("温馨提示","请您输入验证码！");
                    return false;
                }

                if(pwd == null || pwd == '') {
                    self.model.clickDialog("温馨提示","请您输入密码！");
                    return false;
                }


                if(!self.model.isMobilePhone(phone)){
                    self.model.clickDialog("温馨提示","手机号格式输入有误！");
                }else if(!self.model.isNumber(code)){
                    self.model.clickDialog("温馨提示","验证码输入有误！");
                }else if(!self.model.textLength(pwd,6,20)){
                    self.model.clickDialog("温馨提示","密码必须6-20位数字、字母！");
                }else  if(!Common.reg.pwd.test(pwd)) {
                    self.model.clickDialog("温馨提示",'密码格式有误！');
                    return false;
                }else if(self.model.isMobilePhone(phone) && self.model.isNumber(code) && self.model.textLength(pwd,6,20)){

                    // 验证验证码参数
                    var data = {
                        phoneNum:phone,
                        identifyCode:code,
                        type:2
                    };

                    // 注册参数
                    var regData = {
                        phoneNum:phone,
                        password:md5(pwd),
                        msgcode:code,
                        invitationCode:inviteCode,
                        peer:"weixin",
                        channelId:"992"
                    };


                    // 对验证码进行验证
                    $.ajax({
                        url: Setting.apiRoot1 + "/sms/validate.p2p",
                        data:data,
                        success:function(res){
                            if(res.code == 1){
                                // 进行注册
                                $.ajax({
                                    url: Setting.apiRoot2 + "/regist.p2p",
                                    data:regData,
                                    success:function(data){
                                        self.model.clickDialog("温馨提示","注册成功！",function(){
                                            if(res.code == 1){

                                                // 如果res.code == 1
                                                $.ajax({
                                                    url: Setting.apiRoot2 + "/login.p2p",
                                                    data:{
                                                        loginName:phone,
                                                        password:md5(pwd)
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

                                                            self.model.clickDialog("温馨提示","您已成功加入V金融！",function(){
                                                                window.location.href = Setting.staticRoot + '/pages/financing/regular.html';
                                                            });

                                                        }
                                                        else{
                                                            if(isTure){
                                                                self.model.clickDialog("温馨提示",loginRes.message);
                                                                isTure = false;
                                                            }

                                                        }
                                                    }
                                                })
                                            }
                                        });
                                    }
                                })
                            }else{
                                self.model.clickDialog("温馨提示",res.message);
                            }
                        }
                    })
                }
                //else{
                //    self.model.clickDialog("温馨提示","111");
                //}

            },

            // 获取验证码
            getVerCode:function(){
                var phone = $("#phone").val();
                var getVerCode = $(".getVerCode");
                var $getVerCodeBtn = $(".getVerCodeBtn");
                if(self.model.isMobilePhone(phone)){

                    // 发送验证码
                    var data = {
                        phoneNum:phone,
                        type:2
                    };
                    $.ajax({
                        url:Setting.apiRoot1 + "/sms/send.p2p",
                        data:data,
                        success:function(res){
                            if(res.code == 1){

                                self.model.clickDialog("温馨提示",res.message);

                                // 获取验证码后，按钮不可点击
                                $getVerCodeBtn.prop("disabled",true);

                                // 倒计时
                                var time = 60;
                                function countDown(){
                                    time-=1;
                                    $getVerCodeBtn.text(time+"秒");
                                    // 倒计时完成后，可以重新获取
                                    if(time<=0){
                                        clearInterval(timeCountDown);
                                        $getVerCodeBtn.prop("disabled",false);
                                        $getVerCodeBtn.text("重新获取");
                                    }
                                }
                                var timeCountDown = setInterval(countDown,1000);
                            }else{
                                self.model.clickDialog("温馨提示",res.message);
                            }
                        }
                    })
                }else{
                    self.model.clickDialog("温馨提示","手机号格式输入有误");
                }
            }

        };

        // view
        this.view = {

            // 设置手机号
            setPhone:function(ele,text){
                $(ele).text(text);
            },

            // 设置滚动列表
            setList:!function(){
                $.ajax({
                    url: Setting.apiRoot1 + "/getInviteDetailList.p2p",
                    success:function(res){
                        //console.log(res.data.list);
                        var $content = $(".quotationGun"),
                            str = "";
                        for(var i=0; i<res.data.list.length; i++){
                            //console.log(i);
                            str+=
                            '<li><p><span>'+res.data.list[i].mainName+' </span>邀请 <span>'+res.data.list[i].subName+'</span>投资<span>'+res.data.list[i].investAmount+'元</span>瓜分现金<span>'+res.data.list[i].totalAmount+'元</span></p></li>'
                        }
                        $content.html(str);
                    }
                })
            }(),

            // 点击注册按钮
            formSubmit:!function(){
                //点击立即注册进行跳转
                var button = $(".fixed-bottom");
                //点击注册按钮
                var _submit = $('.submit');
                //点击密码中的明文或者密文
                var _images = $('.images');
                button.click(function(){
                    window.location.href = '#formRegister';
                    $(this).hide();
                });

                _submit.click(function() {
                    self.controller.formSubmit();
                });


                var isImage = true;
                //明文或者密文
                _images.click(function() {
                    if(isImage) {
                        $(this).attr({'src': 'images/eye-open.png'});
                        isImage = false;
                        $('#pwd').attr({'type': 'text'});
                    } else {
                        $(this).attr({'src': 'images/eye-close.png'});
                        isImage = true;
                        $('#pwd').attr({'type': 'password'});
                    }
                });

                //点击查看明细
                var _look = $('.look');

                _look.click(function() {
                    $('.log-alert').show();
                    $('body').addClass('sco');
                });

                $('.log-alert').click(function() {
                    $(this).hide();
                    $('body').removeClass('sco');
                });

            }(),

            // 获取验证码
            getVerCode:!function(){
                var btn = $(".getVerCodeBtn");
                btn.click(function(){
                    self.controller.getVerCode();
                });
            }()
        };

        // init
        this.init = !function(){
            self.controller.setPhone();
            self.model.scrollTop("ul.quotationGun",2000);
        }();

    }();
    //window.location.href = '#banner';
});