/*
 *
 * 现金红包活动页面
 *
 * @getUrlVars().parameter          * 获取url中参数
 * @isMobilePhone(mobilePhone)      * 验证输入的是否为手机号
 * @textLength(text,min,max)        * 验证输入字符范围
 * @isNumber(number)                * 验证输入是否为数字
 * @dialog(btn,title,desc,fn)       * 弹出确认信息
 *
 * @auther:leelean
 * @time:2016-09-30
 *
 */

$(function(){
    var regularListDetail={};//正在热卖产品列表
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

            // 手机号中间四位加密
            encryptedPhone:function(mobilePhone){
                if (mobilePhone==undefined || mobilePhone== null || mobilePhone.length<11 ) {
                    return '';
                }
                var mobilePhone = mobilePhone;
                var phoneNumber = mobilePhone.substring(0,3) + "****" + mobilePhone.substring(8,11);
                return phoneNumber;
            }
        };

        // controller
        this.controller = {

        };

        // view
        this.view = {

            // 弹出活动细则
            dialogRule:function(){
                var $btn = $(".rule");
                var $close = $(".dialog-close,.dialog-bg");
                $btn.click(function(){
                    $(".dialog").removeClass("hide");
                });
                $close.click(function(){
                    $(".dialog").addClass("hide");
                })
            },

            // chooseV
            chooseV:function(){
                var $choose = $(".choose");
                $choose.click(function(){
                    $(this).attr("data-select","1");
                    $(this).addClass("border");
                    var $selectLength = $(".choose[data-select='1']").length;
                    if($selectLength==3){
                        $(".success").fadeIn(150);
                        setTimeout(function(){
                            window.location.href="receiveMoney.html";
                        },2000);
                    }
                })
            },

            // receiveMoney 验证手机号
            receiveMoney:function(){
                var $btn = $(".receiveMoney .btn");

                $btn.click(function(){
                    var phone = $(".receiveMoney .phone").val();
                    if(self.model.isMobilePhone(phone)){
                        $.ajax({
                            url: Setting.apiRoot2 + "/isRegistForGetReward.p2p",
                            data:{
                                phoneNum:phone,
                                activityType:13
                            },
                            type:"POST",
                            success:function(res){
                                console.log(JSON.stringify(res));
                                //self.model.clickDialog("温馨提示",res.code);
                                //alert(res.code);
                                //res.code = 1
                                if(res.code == -1) {
                                    self.model.clickDialog("温馨提示",res.message);
                                }

                                if (res.code == -2) {
                                    self.model.clickDialog("温馨提示","您已领取红包,请直接前往投资！",function(){
                                        window.location.href = '../../../pages/financing/regular.html';
                                    });
                                }

                                if (res.code == 1) {
                                    var userStatus = res.data.userStatus;
                                    if(userStatus == 0) {
                                        window.location.href = 'register.html?phoneNum=' + phone;
                                    }

                                    if(userStatus == 1) {
                                        window.location.href = 'useMoney.html?phoneNum=' + phone;
                                    }
                                }

                                //if(res.code!=1){
                                //    self.model.clickDialog("温馨提示","此号码已领取过该红包");
                                //    //alert('此号码已领取过该红包');
                                //
                                //}else{
                                //    if(res.data.userStatus==1){
                                //        self.model.clickDialog("温馨提示","恭喜您领取成功");
                                //        //alert('恭喜您领取成功');
                                //            //TODO  跳转红包列表页
                                //
                                //    }else{
                                //            //TODO  跳转重阳注册页
                                //
                                //    }
                                //}
                            },
                            error:function(res){

                            }
                        });
                    }else{
                        self.model.clickDialog("温馨提示","手机号输入有误")
                    }
                })
            },

            // url中获取手机号
            getPhoneNum:function(){
                var $phoneNum = $(".register .phoneNum");
                var $phoneNumSer = $(".register .phoneNumSer");
                $phoneNum.text(self.model.getUrlVars().phoneNum);
                $phoneNumSer.text(self.model.encryptedPhone(self.model.getUrlVars().phoneNum));
            },

            getUserPhone:function() {
                var url = location.search; //获取url中"?"符后的字串
                var param = {};
                if (url.indexOf("?") != -1) {
                    var str = url.substr(1);
                    strs = str.split("&");
                    for(var i = 0; i < strs.length; i ++) {
                        param[strs[i].split("=")[0]] = decodeURIComponent(strs[i].split("=")[1]);
                    }
                }
                var userPhone = param.phoneNum;
                if(userPhone != undefined && userPhone != null) {
                    $('.phoneNum').html(userPhone);
                }
            },

            // 获取验证码
            getCode:function(){
                var $btn = $(".getCode");
                $btn.click(function(){
                    var phone = $(".register .phoneNum").text();
                    if(phone == ""){
                        self.model.clickDialog("温馨提示","url中获取手机参数失败");
                    }else{
                        // 发送验证码
                        var data = {
                            phoneNum:phone,
                            type:2
                        };
                        $.ajax({
                            url:Setting.apiRoot1 + "/sms/send.p2p",
                            data:data,
                            success:function(res){
                                self.model.clickDialog("温馨提示",res.message);
                                if(res.code == 1){
                                    // 获取验证码后，按钮不可点击
                                    $btn.prop("disabled",true);

                                    // 倒计时
                                    var time = 60;
                                    function countDown(){
                                        time-=1
                                        $btn.text(time+"秒");
                                        // 倒计时完成后，可以重新获取
                                        if(time<=0){
                                            clearInterval(timeCountDown);
                                            $btn.prop("disabled",false);
                                            $btn.text("重新获取");
                                        }
                                    }
                                    var timeCountDown = setInterval(countDown,1000);
                                }else{
                                    self.model.clickDialog("温馨提示",res.message);
                                }
                            }
                        })
                    }
                })
            },

            // 点击注册按钮
            goRegister:function(){
                var $btn = $(".registerBtn");
                $btn.click(function(){

                    // 校验表单
                    var phoneNum = $(".phoneNum").text();
                    var regCode = $(".regCode").val();
                    var password = $(".regPwd").val();

                    if(!self.model.isMobilePhone(phoneNum)){
                        self.model.clickDialog("温馨提示","手机号码格式有误");
                        return false;
                    }else if(!self.model.isNumber(regCode)){
                        self.model.clickDialog("温馨提示","验证码为数字");
                        return false;
                    }else if(!self.model.textLength(password,6,20)){
                        self.model.clickDialog("温馨提示","密码为6-20位密码（数字、字母组合）");
                        return false;
                    }else if(self.model.isMobilePhone(phoneNum) && self.model.isNumber(regCode) && self.model.textLength(password,6,20)){
                        // 校验通过
                        var data = {
                            phoneNum:phoneNum,
                            password:password,
                            identifyCode:8456,
                            activityType:13
                        };
                        $.ajax({
                            url: Setting.apiRoot2 + "/registForInvestPackage.p2p",
                            data:data,
                            type:"POST",
                            success:function(res){
                                if(res.code == 1){
                                    self.model.clickDialog("温馨提示",res.message);
                                    // 如果res.code == 1
                                    $.ajax({
                                        url: Setting.apiRoot2 + "/login.p2p",
                                        data:{
                                            loginName:phoneNum,
                                            password:password
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
                                                    window.location.href = Setting.staticRoot + '/pages/activity/doubleNinth/userMoney.html?phoneNum='+phoneNum;
                                                });

                                            }
                                            else{
                                                self.model.clickDialog("温馨提示",loginRes.message);
                                            }
                                        }
                                    })
                                }else if(res.code == -1){
                                    self.model.clickDialog("温馨提示",res.message);
                                }
                            }
                        })
                    }

                })
            },

            // 密码可视化
            showPwd:function(){

                var $closeEye = $(".closeEye"),
                    $openEye = $(".openEye"),
                    $password = $(".regPwd");

                $closeEye.click(function(){
                    //$password.attr("type","password");
                    $password.attr("type","text");
                    $(this).hide();
                    $openEye.show();
                });

                $openEye.click(function(){
                    //$password.attr("type","text");
                    $password.attr("type","password");
                    $(this).hide();
                    $closeEye.show();
                })

            }
        };

        // init
        this.init = !function(){

            // 活动细则
            self.view.dialogRule();

            // 选择V
            self.view.chooseV();

            // 领取红包
            self.view.receiveMoney();

            // 从url中获取手机号
            self.view.getPhoneNum();

            // 获取验证码
            self.view.getCode();

            // 点击注册按钮
            self.view.goRegister();

            // 密码可视化
            self.view.showPwd();

            self.view.getUserPhone();

        }();

    }();

})