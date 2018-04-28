/**
 * set-accout.js
**/
$(function(){
    var $win = $(window);
    var $body = $('body');

    var $psdForm = $('.forget-pwd-form');
    var $old_psd = $('[name=old-password]', $psdForm);
    var $psd = $('[name=new-password]', $psdForm);
    var $agin_psd = $('[name=agin-password]', $psdForm);
    var $uid = sessionStorage.getItem("uid");
    var $identity = sessionStorage.getItem("uname");
    var $inputBox = $('.input-box');
    var formData ={};

  /**
   * 密码验证
   * @return {[type]} [description]
   */
    if(!$uid){
        Common.toLogin();
        return false;
    }
    $('.identity').html('请为账号'+$identity.substr(0,3)+'******'+$identity.substr(9,10))
    function checkPsd(){
        var _old_psd = $.trim($old_psd.val());
        var _psd  = $.trim($psd.val());
        var _agin_psd =  $.trim($agin_psd.val());
        if (!_old_psd.length>0) {
            Common2.toast("请输入旧密码");
            return false;
        }
        if(!Common.reg.payPwd.test(_old_psd)){
            Common2.toast('请设置由6位数字组成的旧密码');
            return false;
        }

        if (!_psd.length>0) {
            Common2.toast("请输入新密码");
            return false;
        }

        if(!Common.reg.payPwd.test(_psd)){
            Common2.toast('请设置由6位数字组成的交易密码');
            return false;
        }

        if (!_agin_psd.length>0) {
            Common2.toast("请再次输入新密码");
            return false;
        }

        if (_psd != _agin_psd) {
            Common2.toast("密码不一致，请重新输入");
            return false;
        }


        formData.password = md5(_agin_psd);
        formData.oldPassword = md5(_old_psd);
        formData.userId = $uid;
        formData.type = 2; //交易密码
        formData.loginToken=sessionStorage.getItem('loginToken');
        return true;
    }

    $body.on('click', '.change-psd', function(event) {
        var $this = $(this);
        if (checkPsd()) {
            $this.addClass('disabled').html('数据提交中...');
            $.ajax({
                url: Setting.apiRoot1 +'/u/password/modify.p2p',
                type: 'post',
                dataType: 'json',
                data: formData,
            }).done(function(data) {
                Common.ajaxDataFilter(data.code,function(){
                    switch(data.code){
                        case 1:
                            Common2.toast("交易密码设置成功");
                        function  jumurl(){
                            window.location.href=Setting.staticRoot+'/pages/my-account/myAccount.html';
                        }
                            setTimeout(jumurl,1000);
                            break;
                        default:
                            Common2.toast(data.message);
                            break;
                    }
                    $this.removeClass('disabled').html('下一步');
                })
            }).fail(function() {
                Common2.toast('网络链接失败');
                $this.removeClass('disabled').html('下一步');
            })
        }
    });

    var istrue = false;
    function viliateTradPas(password){
        $.ajax({
            url:Setting.apiRoot1 +'/u/viliateTradPas.p2p',
            dataType:'json',
            type:'POST',
            async:false,
            data:{
                userId:$uid,
                password:md5(password),
                loginToken:sessionStorage.getItem('loginToken')
            }
        }).done(function(res){
            Common.ajaxDataFilter(res,function(){
                if(res.code == 1){
                    return istrue = true;
                }else{
                    Common2.toast(res.message);
                    return istrue = false;
                }
            });
        })
    }

var flag = 0;
var pass = ''
$inputBox.on('keydown input focus blur', 'input', function(e){
    flag = flag + 1;
    var $this = $(this);
    if($this.data('herf') == 'two'){
        var $boxs = $('.box', $inputBox.eq(0));
    }
    if($this.data('herf') == 'three'){
        var $boxs = $('.box', $inputBox.eq(1));
    }
    if($this.data('herf') == 'four'){
        var $boxs = $('.box', $inputBox.eq(2));
    }

    if(e.type == 'keydown'){
      var code = e.keyCode;
      if(code != 8 && (code < 48 || code > 57)){
        return false;
      }
    }
    var val = $.trim( $this.val() );
    pass = val;// parseInt(val); 转整出错

    isNaN(pass) && ( pass = '' );

    pass = pass + '';
    if(pass.length > 6){
      pass = pass.substring(0, 6);
    }
    if(pass.length < 6){
        flag = 0;
    }
     if($this.data('herf') == 'two'){
        $inputBox.eq(0).find('input').val(pass);

    }
    if($this.data('herf') == 'three'){
        $inputBox.eq(1).find('input').val(pass);

    }
    if($this.data('herf') == 'four'){
        $inputBox.eq(2).find('input').val(pass);

    }

    if(e.type == 'focusout'){
      $boxs.removeClass('focus');
    }
    var len = pass.length;
    if(e.type == 'focusin'){
      len == 0 ? (true) : (len = len - 1);
    }
    $boxs.eq(len).addClass('focus').siblings('.focus').removeClass('focus');
    var passArr = pass.split('');
    $boxs.each(function(index, box){
      var $box = $(box);

      if(!!passArr[index]){
        $box.addClass('full');
      }else{
        $box.removeClass('full');
      }
    });
    if(pass.length == 6 && flag == 1){//密码输入完毕
        if($this.data('herf') == 'two'){
            var old_psd = $.trim($old_psd.val())
            viliateTradPas(old_psd);
            if(istrue){
                $('.page-pay').css('display','none');
                $('.page-pay').eq(1).css('display','block');
                flag = 0;
                pass = ''
            }
        }
        if($this.data('herf') == 'three'){
            var _old_psd = $.trim($old_psd.val());
            var _psd  = $.trim($psd.val());
            if(_old_psd != _psd){
                $('.page-pay').css('display','none');
                $('.page-pay').eq(2).css('display','block');
                flag = 0;
                pass = ''
            }else{
                 Common2.toast('新旧交易密码相同，请重新设置');
                 $this.val('');
                $('.page-pay').eq(1).find('.box').each(function(){
                    $(this).removeClass('.full');
                });
            }
        }
        if($this.data('herf') == 'four'){
            var _psd  = $.trim($psd.val());
            var _agin_psd =  $.trim($agin_psd.val());
            if(_agin_psd.length == 6){
                $('.change-psd').css('background','#2B6FF9');
            }
            if(_psd != _agin_psd){
                Common2.toast('密码不一致，请重新输入');
                $this.val('');
                $('input[name="new-password"]').val('');
                $('.page-pay').eq(1).find('.box').each(function(){
                    $(this).removeClass('.full');
                });
                $('.page-pay').eq(2).find('.box').each(function(){
                    $(this).removeClass('.full');
                });
                flag = 0;
                pass = '';
                $('.page-pay').css('display','none');
                $('.page-pay').eq(1).css('display','block');
                $('input[name="new-password"]').focus()
            }
        }
      }else{
        if($this.data('herf') == 'four'){
            var _agin_psd =  $.trim($agin_psd.val());
            if(_agin_psd.length != 6){
                $('.change-psd').css('background','#AAC5FC');
            }
        }
      }
  });
});