/**
 * Created by User on 2016/8/23.
 */

$(function() {
    var isWeiXin = Common.isWeiXin();
    var $showPassworld = $('.show-img');//点击显示密码
    var $passworld = $('.password');//密码框
    var $login = $('.login-registered');//注册按钮
    var $loginForm = $('.login-form');//获取表单
    var param = Common.getParam();//解析地址栏中的信息
    var $phone = $('input[name="phone"]');//获取手机
    var $password = $('input[name="password"]');//获取密码
    var $forgotPassword = $('.forgotPassword');//忘记密码
    var formData = {};
    var defText = '立即登录';
    var loadingText = '登录中...';
    var hh = window.location.href;
    var uid = sessionStorage.getItem('uid');
    var $checked = $('.isChecked');//勾选框



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


    if(hh!=null && hh!=''){
        if(hh.indexOf("invite.html")||hh.indexOf("myInvite.html")||hh.indexOf("dial.html") || hh.indexOf("dial.html")){
            if(uid){
                window.location.href= Setting.staticRoot + '/pages/index.html';
            }
        }
    }


    //如果有手机号
    var sphone = sessionStorage.getItem('uname');
    if(sphone){
        $phone.val(sphone);
    }

    /**
     * 表单验证
     * @return {[type]} [description]
     */
    function checkForm(){
        var phone = $.trim($phone.val());
        var password = $.trim($password.val());

        if(phone.length == 0){
            Common2.toast('请输入手机号码');
            // alert('请输入手机号码！');
            return false;
        }

        if(!Common.reg.mobile.test(phone)){
            Common2.toast('手机号码格式不正确');
            // alert('请输入正确的手机号码！');
            return false;
        }

        if(password.length == 0){
            Common2.toast('请输入密码');
            // alert('请输入密码！');
            return false;
        }

         if(isChecked){
            // alert('请阅读并同意《V金融理财协议》');
            Common2.toast('请先勾选并同意平台服务协议');
            return false;
        }

        formData.loginName = phone;
        formData.password = md5(password);

        var uuid = $.cookie('uuid');
        if(uuid){
            formData.uuid = uuid;
        }

        return true;
    }

    //点击登录按钮
    $loginForm.on('click', '.login-btn', function(){
        var $this = $(this);

        if($this.hasClass('disabled')){
            return false;
        }

        if(checkForm()){
            // $this.addClass('disabled').text(loadingText);
          Common2.toast('登录中',Setting.staticRoot+'/images/pages/ui/loading.png',false);
            $.ajax({
                url: Setting.apiRoot2 + '/login.p2p',
                type: 'post',
                dataType: 'json',
                data: formData,
                cache:false
            }).done(function(res){
				console.log(res);
                $('#toastMessage').remove();
                if(res.code == 1){
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
                }else if(res.code == -3){//用户名或密码输入错误
                    if(res.data.count < 5 && res.data.count > 0){
                        Common2.toast('密码输入错误，您还可以尝试'+res.data.count+'次');
                        return false;
                    }
                    if(res.data.count == 0){
                        $('.backdrop').show()
                        // alert('登录密码输入错误次数过多，请于30分钟后登录或通过“找回密码”重置');
                        return false;
                    }
                     if(res.data.count >= 5){
                        Common2.toast(res.message);
                        return false;
                    }
                    // $this.removeClass('disabled').text(defText);
                }else if(res.code == -5){
                    $('.backdrop').show();
                    // alert('登录密码输入错误次数过多，请于30分钟后登录或通过“找回密码”重置');
                }else{
                    Common2.toast(res.message);
                }
            }).fail(function(){
                // alert('网络链接失败');
                  Common2.toast('网络异常',Setting.staticRoot+'/images/pages/ui/wifi.png');
                $this.removeClass('disabled').text(defText);
                return false;
            });
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
    $('.btn-link').click(function(){
        $('.backdrop').hide();
    })

    //点击注册按钮
    $login.click(function() {
       window.location.href = '../../pages/account/register.html';
    });

    //点击忘记密码
    $forgotPassword.click(function() {
        window.location.href = '../../pages/account/forget-pwd.html';
    });
});
