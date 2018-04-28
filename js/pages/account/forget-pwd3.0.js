/**
 * pwd.js
 * @author  tangsj
 * @return {[type]}       [description]
 */
$(function(){
    var $imgebtn = $('.imgebtn');//图形验证码
    var $imgeCode = $('.img-code');//获取图形验证码
    var uuid = $.cookie('uuid');
    //微信才有UUID
    var data = new Date();
    var tiem = data.getTime();
    var round = Math.floor(Math.random()*10);
    var divnceId = tiem + round;
    var img = new Image();
    img.src = Setting.apiRoot1 + '/code.p2p?type=1&divnceId='+divnceId+'&time=' + Date.now();
    $imgebtn.html(img);
    $imgebtn.click(function() {
        img.src = Setting.apiRoot1 + '/code.p2p?type=1&divnceId='+divnceId+'&time=' + Date.now();
        $imgebtn.html(img);
    });
    /**
     * 微信进来的访问判断，不是跳转到官网下载页
     * 20160226 zyx
     */
    var isWeiXin = Common.isWeiXin();
    var $forget =  $('.forget-pwd-form');

    var formData = {};
    /**
     * 忘记密码
     */
    if($forget.length > 0){

        var smsTimer;
        var $phone = $('[name=phone]');
        var $msgcode = $('[name=msgcode]');
        var $sendSms = $('.btn-msgcode');

        var defText = '获取验证码';
        var timeText = '<strong>{time}</strong>s';
        /**
         * 手机号码验证
         * @return {[type]} [description]
         */
        function checkPhone(){
            var phone = $.trim($phone.val());

            if(phone.length == 0){
                // alert('请输入手机号！');
                Common2.toast('请输入手机号');
                return false;
            }

            if(!Common.reg.mobile.test(phone)){
                // alert('请输入正确的手机号码！');
                Common2.toast('请输入正确的手机号码');
                return false;
            }

            formData.phoneNum = phone;
            return true;
        }
        $forget.on('click', '.next-btn', function(){
            var $this = $(this);

            if($this.hasClass('disabled')){
                return false;
            }

            if(checkPhone()){
                 var _imageCode = $.trim($imgeCode.val());
                 if(_imageCode == null || _imageCode == '' || _imageCode == undefined || _imageCode <= 0) {
                    Common2.toast('请输入图形验证码');
                    $this.removeClass('disabled');
                    return false;
                }

                $.post(Setting.apiRoot1 + '/isRegist.p2p?divnceId=' + divnceId,
                    {phoneNum: formData.phoneNum, code: _imageCode, type: 1},
                    function(data) {
                        if(data.code == 1) {
                             sessionStorage.setItem('resetInfo', JSON.stringify(formData));
                    window.location.href = 'reset-pwd.html?phone='+$phone.val() + '&imgcode=' + $imgeCode.val() + '&divnceId=' + divnceId ;
                        } else {
                            Common2.toast(data.message);
                            $this.removeClass('disabled');
                            return false;
                        }
                }, 'json');
            }
        })
        // .on('click', '.btn-msgcode', function(){
        //     var $this = $(this);
        //     if($this.hasClass('disabled')){
        //         return false;
        //     }

        //     if(checkPhone()){
        //         $this.addClass('disabled');
        //         var _imageCode = $.trim($imgeCode.val());
        //         if(_imageCode == null || _imageCode == '' || _imageCode == undefined || _imageCode <= 0) {
        //             alert('请输入图形验证码');
        //             $this.removeClass('disabled');
        //             return false;
        //         }

        //         $.post(Setting.apiRoot1 + '/isRegist.p2p?divnceId=' + divnceId,
        //             {phoneNum: formData.phoneNum, code: _imageCode, type: 1},
        //             function(data) {
        //                 if(data.code == 1) {
        //                     // 发送短信验证码
        //                     Common.sendMsgCode(formData.phoneNum, 1,_imageCode, divnceId,  function(data){
        //                         if(data.code != 1){
        //                             alert(data.message);
        //                             $this.removeClass('disabled');
        //                             return false;
        //                         }

        //                         startSmsTimer(function(){
        //                             $this.html(defText).removeClass('disabled');
        //                         });
        //                     });
        //                 } else {
        //                     alert(data.message);
        //                     $this.removeClass('disabled');
        //                     return false;
        //                 }
        //         }, 'json');

        //     }
        // });
    }
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