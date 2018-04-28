/**
 * 用户设置中心
**/
$(function(){
    var $win = $(window);
    var $body = $('body');
    var formData = {};
    var userName, idNo, password,_name,_number,_pass;
    var $form = $(".real-name-form");
    _name = $('input[name=name]',$form);
    _number = $('input[name=number]',$form);
    _pass = $('input[name=pass]',$form);

    var _uid = sessionStorage.getItem("uid");
    if(!_uid){
        Common.toLogin();
        return false;
    }

    $('.realchange').click(function() {
        if($(this).hasClass('istrue')) {
            $(this).attr({'src':'../../../images/pages/my-account3.0/vimg/z.png'});
            $(this).removeClass('istrue');
            _pass.attr({'type':'text'});
        } else {
            $(this).attr({'src':'../../../images/pages/my-account3.0/vimg/bi.png'});
            $(this).addClass('istrue');
            _pass.attr({'type':'password'});
        }
    })

    function checkForm(){
        userName =  $.trim(_name.val());
        idNo =  $.trim(_number.val());
        password = $.trim(_pass.val());
        if (!userName.length>0) {
            Common2.toast("请输入姓名");
            return false
        };
        if (!idNo.length>0) {
            Common2.toast("请输入身份证号码");
            return false
        };

        if (!Common.reg.idCard.test(idNo)) {
            Common2.toast("身份证号码格式有误，请重新输入！");
            return false
        };

        if (!password.length>0) {
            Common2.toast("请输入交易密码");
            return false
        };

        if(!Common.reg.payPwd.test(password)){
            Common2.toast('请设置由6位数字组成的交易密码！');
            return false;
        }


        formData.userName =  userName ;
        formData.idNo = idNo ;
        formData.userId = _uid ;
        formData.loginToken = sessionStorage.getItem('loginToken');
        formData.password = md5(password);
        return true;
    }

    $('.realname-rule').click(function() {
        $('.real-box').show();
        var _wheight = $(window).height();
        var $reabox = $('.reabox');
        var _rheight = $reabox.height();
        $reabox.css({'top':((_wheight - _rheight) / 2) + 'px'});
        $('.rknow').click(function() {
            $('.real-box').hide();
        });
    });

  /**
   * [实名认证]
   * @param  {[type]} event)  userName   idNo   userId
   * @return {[type]}        [description]
   */
    $body.on('click', '.real-btn', function(event) {
        var $this = $(this);
        var $real_btn = $('.real-btn');
        if (checkForm()) {
            if($real_btn.hasClass('disabled')) {
                return false;
            }
            $real_btn.addClass('disabled')
            $this.addClass('disabled').html('实名认证中...');
            $.ajax({
                url: Setting.apiRoot1 + '/u/idCardValiAndPwd.p2p',
                type: 'post',
                dataType: 'json',
                data: formData,
            }).done(function(res) {
                $real_btn.removeClass('disabled');
                Common.ajaxDataFilter(res,function(){
                    switch(res.code){
                      case 0:{
                          sessionStorage.setItem('validName',1);//是否设置实名认证
                          sessionStorage.setItem('validTrade',1);//是否设置交易密码
                          sessionStorage.setItem('cardNum',formData.idNo);//是否设置实名认证
                          sessionStorage.setItem('realname',formData.userName);//是否设置实名认证
                          Common2.toast('实名认证成功');
                          function  jumurl(){
                              window.location.href=Setting.staticRoot+'/pages/financing/regular.html';
                          }
                          setTimeout(jumurl,2500);

                          break;
                      }
                        case -10:
                            sessionStorage.setItem('validName',1);//是否设置实名认证
                            sessionStorage.setItem('cardNum',formData.idNo);//是否设置实名认证
                            sessionStorage.setItem('realname',formData.userName);//是否设置实名认证
                            $.ajax({
                                url: Setting.apiRoot1 + '/u/setTradePwd.p2p',
                                type: 'post',
                                dataType: 'json',
                                data: formData,
                            }).done(function(res) {
                                Common.ajaxDataFilter(res,function(res) {
                                    if(res.code == 1) {
                                        Common2.toast('交易密码设置成功！');
                                        function  jumurl(){
                                            window.location.href=Setting.staticRoot+'/pages/financing/regular.html';
                                        }
                                        setTimeout(jumurl,2500);
                                    } else {
                                        Common2.toast(res.message);
                                    }
                                })
                            }).fail(function() {
                                Common2.toast('网络连接失败！');
                                return false;
                            });
                            break;
                        default:
                            confirm(res.message , function(){
                                window.location.href=Setting.staticRoot+'/pages/my-account/myAccount.html';
                            });
                            break;
                    }
                    $this.removeClass('disabled').html('确认');
                })

            }).fail(function() {
                $real_btn.removeClass('disabled');
                Common2.toast('网络链接失败');
                $this.removeClass('disabled').html('确认');
            })
        };
    });

});