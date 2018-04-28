/**
 * Created by User on 2016/8/24.
 */
$(function() {
    var $returnBtn = $('.img-header');//点击返回按钮
    var $login = $('.login');//点击登录按钮
    var $nextBtn = $('.next-btn');//点击下一步按钮
    var $telPhone = $('.tel-phone');//获取手机号码

    var data = new Date();
    var tiem = data.getTime();
    var round = Math.floor(Math.random()*10);
    var divnceId = tiem + round;
    var _i = sessionStorage.getItem('shebeihao') - 1;
    var smsTime = setInterval(function(){
        if(_i <= 0){
            clearInterval(smsTime);
        }
        sessionStorage.setItem('shebeihao',_i--);
    },1000);

    /**
     * 微信进来的访问判断，不是跳转到官网下载页
     * 20160226 zyx
     */
    var isWeiXin = Common.isWeiXin();

    var param = Common.getParam();

    var channelId = param.channelId;


    /**
     * Register Step1
     * @return {[type]} [description]
     */
    !function(){
        var $registerStep1 = $('.registered-form');

        if($registerStep1.length > 0){

            /**
             * 加载Banner 图片
             * @return {[type]} [description]
             */
            !function(){}();

            var $phone = $('input[name="phone"]');
            var $vcode = $('input[name="vcode"]');

            var formData = {};
            /**
             * 表单验证
             * @return {[type]} [description]
             */
            function checkForm(){
                var phone = $.trim($phone.val());
                var vcode = $.trim($vcode.val());

                if(phone.length == 0){
                    // alert('请输入手机号码！');
                    Common2.toast('请输入手机号码');
                    return false;
                }

                if(!Common.reg.mobile.test(phone)){
                    Common2.toast('请输入正确的手机号码');
                    // alert('请输入正确的手机号码！');
                    return false;
                }

                if(vcode.length == 0){
                    // alert('请输入验证码！');
                    Common2.toast('请输入图形验证码')
                    return false;
                }

                formData.phoneNum = phone;
                formData.code = vcode;
                formData.type = 2;
                return true;
            }
            /**
             * 验证码
             * @return {[type]} [description]
             */
            $registerStep1.on('click', '.Verification-code', function(){
                var uuid = $.cookie('uuid');
                //微信才有UUID
                var img = new Image();
                img.src = Setting.apiRoot1 + '/code.p2p?type=1&divnceId='+divnceId+'&time=' + Date.now();
                $(this).html(img);
            }).on('click', '.next-btn', function(){
                var $this = $(this);

                if($this.hasClass('disabled')){
                    return false;
                }

                if(checkForm()){
                    $this.addClass('disabled');
                    var uuid = $.cookie('uuid');
                    console.log(sessionStorage.getItem('shebeihao'))
                    if(sessionStorage.getItem('shebeihao') <=0){

                    $.ajax({
                        url: Setting.apiRoot1 + '/isRegist.p2p?divnceId=' + divnceId,
                        type: 'post',
                        dataType: 'json',
                        data: formData
                    }).done(function(res) {
                        if(res.code == 1){
                            // 可以注册
                            sessionStorage.setItem('registerPhone', formData.phoneNum);
                            sessionStorage.setItem('inviteCode', $('input[name="invitation"]').val());

                            //zyx 20160506 微信分多个注册渠道
                            var phone = $.trim($phone.val());
                            if(!channelId){
                                window.location.href =  '../../pages/account/register-2.html?telPhone=' + phone + '&imgcode=' + formData.code + '&divnceId=' + divnceId;
                            }else{
                                sessionStorage.setItem('channelId', channelId);
                                window.location.href =  '../../pages/account/register-2.html?channelId='+channelId + '&telPhone='+ phone + '&imgcode=' + formData.code + '&divnceId=' + divnceId;
                            }

                            return false;
                        } else {
                             Common2.toast(res.message);
                            $this.removeClass('disabled');
                        }
                        //$this.removeClass('disabled');
                        //alert(res.message, function(){
                        //    $this.removeClass('disabled');
                        //    if(res.code == -2){
                        //        window.location.href =  '../../pages/account/login.html';
                        //    }
                        //});
                    }).fail(function() {
                            Common2.toast('网络异常',Setting.staticRoot+'/images/pages/ui/wifi.png');
                        // alert('网络链接失败');
                        $this.removeClass('disabled');
                        return false;
                    });
                }else{
                    // alert('sdfsf')
                }
                }
            });
            var uuid = $.cookie('uuid');
            var img = new Image();
            img.src = Setting.apiRoot1 + '/code.p2p?type=1&divnceId='+divnceId+'&time=' + Date.now();
            $('.Verification-code').html(img);
        }
    }();

    //点击返回按钮返回登录界面
    $returnBtn.click(function() {
        window.location.href = '../../pages/account/login.html';
    });

    //点击登录按钮
    $login.click(function() {
        window.location.href = '../../pages/account/login.html';
    });

     /*显示close*/
    $('.tel-phone').bind('input propertychange',function(){
        if($(this).val().length > 0){
            $('.close').show();
        }else{
            $('.close').hide();
        }
    })
    /*close*/
    $('.close').on('click',function(){
        $('.tel-phone').val('');
         $(this).hide();
    })

});