/**
 * 交易密码设置
**/
$(function(){
    var realname = sessionStorage.getItem('realname');
    var $wrapper = $('.wrapper');
    var userId = sessionStorage.getItem('uid');
    var loginToken = sessionStorage.getItem('loginToken');
    var formData = {};
    formData.userId = userId; //获取用户的ID
    formData.loginToken = loginToken;//获取用户的loginToken
    //pageInit();
    var smsTimer;
    var timeText = '<span>{time}</span>s后重发';


    //页面倒计时的方法
    function startSmsTimer(timeOver){
        if(!!smsTimer){
            clearInterval(smsTimer);
        }
        var _i = Common.vars.sendWait;
        smsTimer = setInterval(function(){
            $('.passrule').html(timeText.replace(/{time}/, _i--)).addClass('isfalse');
            if(_i < 0){
                clearInterval(smsTimer);
                smsTimer = null;
                timeOver();
            }
        }, 1000);
    }
    //nextTwo('新旧交易密码相同，请重新设置');
    pageInit();
    //nextThree()
    //初始页面的方法
    function pageInit() {
        var name = '';
        for(var i = 0; i < realname.length; i++) {
            if(i == (realname.length - 1)) {
                name = name + realname[i];
            } else {
                name = name + '*';
            }
        }

        var _html = '';
        _html = _html + '' +
        '<div class="usertitle">' +
            '填写 <span>' + name + '的身份证号</span> 验证身份' +
        '</div>' +
        '<div class="userCard">' +
            '<div class="userInput">' +
                '<input class="reset-input" type="text" name="number" placeholder="输入证件号" maxlength="20">' +
                '<a class="resetDelete" href="javascript:;"></a>' +
            '</div>' +
        '</div>' +
        '<div class="nextdiv">' +
            '<a class="resNextBtn" href="javascript:;">下一步</a>' +
             '<div class="nodisable"><div class="nonext"></div></div>' +
        '</div>';
        $wrapper.html(_html);
        var $text = $('input[name="number"]');
        var textValue = '';
        var $nextdiv = $('.nextdiv');
        var $resetDelete = $('.resetDelete');
        $text.keyup(function() {
            textValue = $text.val();
            if(textValue != undefined && textValue != null && textValue != '') {
                $('.nonext').remove();
                $('.resetDelete').show();
                $text.css({'color':'#4A4A4A'});
            } else {
                if(!$nextdiv.find('div').hasClass('nextdiv')) {
                    $('.nodisable').html('<div class="nonext"></div>');
                    $text.css({'color':'#CDCDCD'});
                }
            }
        });

        $resetDelete.click(function() {
            $text.val('');
            $resetDelete.hide();
            $('.nodisable').html('<div class="nonext"></div>');
        });

        var $resNextBtn = $('.resNextBtn');//点击下一步
        $resNextBtn.click(function() {
            textValue = $text.val();
            if (!Common.reg.idCard.test(textValue)) {
                Common2.toast("身份证号码格式有误，请重新输入！");
                return false
            };
            formData.idCard = textValue;//获取用户的身份证号
            $.post(Setting.apiRoot1 + '/u/viliateIdNum.p2p',formData, function(res) {
                Common.ajaxDataFilter(res,function() {
                    if(res.code == 1) {
                        nextOne();
                    } else {
                        if(res.code == -3) {
                            Common2.toast('证件号错误,还可以尝试' + res.data.count + '次');
                            return false;
                        } else {
                            Common2.toast(res.message);
                            return false
                        }

                    }
                })
            },'json');
        })
    }


    function getFocus($html,nextType) {
        $html.on('keydown input focus blur','input',function() {
            if($html.hasClass('disabled')) {
                $html.removeClass('disabled');
                return false;
            }
            var $input = $('input');
            var value = $input.val();
            if(value.length > 6) {
                value = value.substring(0,6);
                $input.val(value);
            }
            var _c = value.length;
            //if(_c == 0) {
            //    $('.a').removeClass('aicon2').find('.e').remove();
            //    $('a[line="' + _c + '"]').addClass('aicon2');
            //    $('.aicon2').html('<div class="e"></div>')
            //} else {
                $('.a').removeClass('aicon2').find('.e').remove();
                $('a[line="' + _c + '"]').addClass('aicon2');
                $('.aicon2').html('<div class="e"></div>');
            //}
            for(var i = 0; i < 7; i++) {
                if(value[i] != undefined && value[i] != null && value[i] != '') {
                    $('a[line="' + i + '"]').html('<div class="b"></div>');
                } else {
                }
            }

            if(_c == 6) {
                if(nextType == 1) {
                    checkpass($html,value);
                }
            }
        });
    }

    function checkpass($html,value) {
        if(!Common.reg.payPwd.test(value)){
            Common2.toast('请输入合法的交易密码！');
            return false;
        }
        formData.passworld1 = value;
        formData.newpass1 = md5(value);//第一次输入的密码
        var _arr = {};
        _arr.userId = formData.userId;
        //_arr.repPassword = formData.newpass2;
        _arr.password = formData.newpass1;
        _arr.code = formData.identifyCode;
        _arr.type = 2;
        _arr.phoneNum = formData.phoneNum;
        _arr.loginToken = formData.loginToken;
        _arr.useWay = 1;
        $html.addClass('disabled');
        $.ajax({
            url:Setting.apiRoot1 + '/u/restTradPsd.p2p',
            type:'post',
            dataType:'json',
            data:_arr
        }).done(function(res) {
            $html.removeClass('disabled');
            if(res.code == 1) {
                nextThree();
            } else {
                Common2.toast(res.message);
                return false;
            }
        }).fail(function() {
            Common2.toast('网络连接失败！');
            $html.removeClass('disabled')
        });
    }


    function nextOne() {
        var uname = sessionStorage.getItem('uname');
        formData.phoneNum = uname;//获取用户的手机号
        var _name = uname.substring(0,3);
        _name = _name + '*** ***';
        _name = _name + uname.substring((uname.length - 2),uname.length);
        formData.subPhone = _name;//获取截取过后的身份证号
        var _html = '';
        _html = _html + '' +
        '<div class="utitle">' +
        '<div>我们已发送 <span>验证码</span> 到您的手机</div>' +
        '<div>' + _name + '</div>' +
        '</div>' +
        '<div class="reset-box">' +
        '<div class="reset-box-input">' +
        '<div class="resetpass">' +
        '<a class="a" line="0"></a>' +
        '<a class="a" line="1"></a>' +
        '<a class="a" line="2"></a>' +
        '<a class="a" line="3"></a>' +
        '<input class="iconpass" style="left: 0" name="code" type="password" maxlength="4"/>' +
        '</div>' +
        '</div>' +
        '<div class="passrule"></div>' +
        '</div>';

        $wrapper.html(_html);
        //var defText = '获取验证码';
        var data = new Date();
        var tiem = data.getTime();
        var round = Math.floor(Math.random()*10);
        var divnceId = tiem + round;
        //短信验证码发送
        $.ajax({
            url:Setting.apiRoot1 + '/sms/send/rest/pwd.p2p',
            type:'post',
            dataType:'json',
            data:{
                type:3,
                phoneNum:formData.phoneNum,
                divnceId:divnceId
            }
        }).done(function(res) {
            $('.iconpass').removeClass('disable');
            startSmsTimer(function(){
                $('.passrule').html('收不到验证码? <a class="r-reload" href="javascript:;">重新发送</a>').removeClass('isfalse');
            });
            $('.passrule').click(function() {
                if($('.passrule').hasClass('isfalse')) {
                    return false;
                } else {
                    //重新发送短信验证码
                    nextOne();
                }
            })
        }).fail(function() {
            $('.iconpass').addClass('disable');
            Common2.toast('网络连接失败！');
            //return false;
        });

        $('.resetpass').on('keydown input focus blur','input',function() {
            var $resetpass = $('.resetpass');
            var $iconpass = $('.iconpass');
            if($iconpass.hasClass('disable')) {
                return false;
            }
            var $a = $('.a');
            var $aicon = $('.aicon');
            var $input = $('input');
            var value = $input.val();
            //var _c = value.length;
            if(value.length > 4) {
                value = value.substring(0,4);
                $input.val(value);
            }
            var _c = value.length;
            if(_c == 0) {
                $('.a').removeClass('aicon1').find('.aicon').remove();
                $('a[line="' + _c + '"]').addClass('aicon1');
                $('.aicon1').html('<div class="aicon"></div>')
            } else {
                $('.a').removeClass('aicon1').find('.aicon').remove();
                $('a[line="' + _c + '"]').addClass('aicon1');
                $('.aicon1').html('<div class="aicon"></div>');
            }
            for(var i = 0; i < 4; i++) {
                if(value[i] != undefined && value[i] != null && value[i] != '') {
                    $('a[line="' + i + '"]').html(value[i]);
                } else {
                }
            }

            if(_c == 4 && !$resetpass.hasClass('disabled')) {
                $resetpass.addClass('disabled');
                formData.identifyCode = value;
                $iconpass.addClass('disable');
                $.ajax({
                    url:Setting.apiRoot1 + '/sms/validate.p2p',
                    type:'post',
                    dataType:'json',
                    data:{
                        type:3,
                        phoneNum:formData.phoneNum,
                        identifyCode:value
                    }
                }).done(function(res) {
                    $iconpass.removeClass('disable');
                    if(res.code == 1) {
                        //进入下一步
                        nextTwo();
                    } else {
                        if(res.code == -3) {
                            Common2.toast('短信验证码输入错误，还剩余' + res.data.count + '次');
                            return false;
                        } else {
                            Common2.toast(res.message);
                            return false;
                        }

                    }
                }).fail(function() {
                    $iconpass.removeClass('disable');
                    Common2.toast('网络连接失败！');
                })
            } else {
                if(_c < 4) {
                    $resetpass.removeClass('disabled');
                }
            }

        });
    }

    function nextTwo() {
        var _html = '';
        _html = _html + '' +
        '<div class="utitle1">' +
            '<div>请为账号 ' + formData.subPhone + '</div>' +
            '<div>设置6位数字交易密码</div>' +
        '</div>' +
        '<div class="reset-pass-box">' +
            '<div class="reset-pass-box-input">' +
                '<a class="a" line="0"></a>' +
                '<a class="a" line="1"></a>' +
                '<a class="a" line="2"></a>' +
                '<a class="a" line="3"></a>' +
                '<a class="a" line="4"></a>' +
                '<a class="a" line="5" style="border-right: none"></a>' +
                '<input class="rest-pass" name="pass" type="password" maxlength="6"/>' +
            '</div>' +
            //'<div class="reset-pass-box-txt">交易密码不能是重复，连续的数字</div>' +
        '</div>';
        $wrapper.html(_html);
        getFocus($('.reset-pass-box-input'),1)
    }


    function nextThree() {
        var uname = sessionStorage.getItem('uname');
        formData.phoneNum = uname;
        var _html = '';
        _html = _html + '' +
        '<div class="utitle2">' +
        '请再次输入' +
        '</div>' +
        '<div class="reset-pass-box">' +
        '<div class="reset-pass-box-input">' +
        '<a class="a" line="0"></a>' +
        '<a class="a" line="1"></a>' +
        '<a class="a" line="2"></a>' +
        '<a class="a" line="3"></a>' +
        '<a class="a" line="4"></a>' +
        '<a class="a" line="5" style="border-right: none"></a>' +
        '<input class="rest-pass" name="pass" type="password" maxlength="6"/>' +
        '</div>' +
        '<a class="nextSubBtn ifalse" href="javascript:;">下一步<div class="isdisable"></div></a>' +
        '</div>';
        $wrapper.html(_html);
        var $nextSubBtn = $('.nextSubBtn');
        $('.reset-pass-box-input').on('keydown input focus blur','input',function() {
            var $input = $('input');
            var value = $input.val();

            if(value.length > 6) {
                value = value.substring(0,6);
                $input.val(value);
            }

            var _c = value.length;
            //if(_c == 0) {
            //    $('.a').removeClass('aicon2').find('.e').remove();
            //    $('a[line="' + _c + '"]').addClass('aicon2');
            //    $('.aicon2').html('<div class="e"></div>')
            //} else {
            $('.a').removeClass('aicon2').find('.e').remove();
            $('a[line="' + _c + '"]').addClass('aicon2');
            $('.aicon2').html('<div class="e"></div>');
            //}
            for(var i = 0; i < 6; i++) {
                if(value[i] != undefined && value[i] != null && value[i] != '') {
                    $('a[line="' + i + '"]').html('<div class="b"></div>');
                } else {
                }
            }

            if(_c == 6) {
                $nextSubBtn.removeClass('ifalse').find('.isdisable').remove();
            } else {
                if(!$nextSubBtn.hasClass('ifalse')) {
                    $nextSubBtn.addClass('ifalse').append('<div class="isdisable"></div>');
                }
            }
        });

        $nextSubBtn.click(function() {
            if($nextSubBtn.hasClass('ifalse')) {
                return false;
            }
            var $input = $('input');
            var value = $input.val();
            if(!Common.reg.payPwd.test(value)){
                Common2.toast('请输入合法的交易密码！');
                return false;
            }

            if(formData.passworld1 != value) {
                Common2.toast('密码不一致，请重新输入');
                return false;
            }
            formData.newpass2 = md5(value);//第二次输入的密码
            var _arr = {};
            _arr.userId = formData.userId;
            _arr.repPassword = formData.newpass2;
            _arr.password = formData.newpass1;
            _arr.code = formData.identifyCode;
            _arr.type = 2;
            _arr.phoneNum = formData.phoneNum;
            _arr.loginToken = formData.loginToken;
            _arr.useWay = 2;
            $.ajax({
                url:Setting.apiRoot1 + '/u/restTradPsd.p2p',
                type:'post',
                dataType:'json',
                data:_arr
            }).done(function(res) {
                if(res.code == 1) {
                    Common2.toast('交易密码设置成功');
                    function  jumurl(){
                        window.location.href=Setting.staticRoot+'/pages/my-account/myAccount.html';
                    }
                    setTimeout(jumurl,3000);
                } else {
                    if(res.code == -1) {
                        var text = res.message;
                        if(text != undefined && text != null && text != '') {
                            var _alertHtml = '';
                            _alertHtml = _alertHtml + '' +
                            '<div class="reset-alert">' +
                            '<div></div>' +
                            '<div class="reset-alert-box" style="background: #ffffff">' +
                            '<div>' + text + '</div>' +
                            '<a class="reset-alert-close" href="javascript:;">确定</a>' +
                            '</div>' +
                            '</div>';
                            $('body').append(_alertHtml);
                            var _wheight = $(window).height();
                            var $box = $('.reset-alert-box');
                            var _boxHeight = $box.height();
                            $box.css({'top':((_wheight - _boxHeight) / 2) + 'px'});
                            $('.reset-alert-close').click(function() {
                                $('.reset-alert').remove();
                                pageInit();
                                return false;
                            })
                        }
                    } else {
                        Common2.toast(res.message);
                    }

                }
            }).fail(function() {
                Common2.toast('网络连接失败！');
            })
        })

    }


  //  var $win = $(window);
  //  var $body = $('body');
  //
  //  var $resetForm = $('.reset-dealpassword-form');
  //  var $phone = $('[name=phone]', $resetForm);
  //  var $sms_code = $('[name=sms-code]', $resetForm); //验证码
  //  var $new_psd = $('[name=new-password]', $resetForm); //交易密码
  //  var $img_code = $('[name=img-code]',$resetForm);//图形验证码
  //  var $agin_psd = $('[name=agin-password]', $resetForm);
  //  var $uid = sessionStorage.getItem("uid");
  //  var formData ={};
  //  var $registernumber = $('.registernumber');//图形验证码
  //
  //  var uuid = $.cookie('uuid');
  //  var data = new Date();
  //  var tiem = data.getTime();
  //  var round = Math.floor(Math.random()*10);
  //  var divnceId = tiem + round;
  //  //微信才有UUID
  //  var img = new Image();
  //  img.src = Setting.apiRoot1 + '/code.p2p?type=1&divnceId='+divnceId+'&time=' + Date.now();
  //  $registernumber.html(img);
  //  $registernumber.click(function() {
  //      img.src = Setting.apiRoot1 + '/code.p2p?type=1&divnceId='+divnceId+'&time=' + Date.now();
  //      $registernumber.html(img);
  //  });
  //  if(!$uid){
  //      Common.toLogin();
  //      return false;
  //  }
  //  /**
  //   * 手机+密码验证
  //   * @return {[type]} [description]
  //   */
  //  var phone,sms_code,new_psd,agin_psd;
  //  function checkForm(){
  //      phone = $.trim($phone.val());
  //      sms_code = $.trim($sms_code.val());
  //      new_psd = $.trim($new_psd.val());
  //      agin_psd = $.trim($agin_psd.val());
  //      if (!phone.length>0) {
  //          Common2.toast("请输入手机号码！");
  //          return false;
  //      }
  //
  //      if(!Common.reg.mobile.test(phone)){
  //          Common2.toast('手机号码格式有误，请重新输入！');
  //          return false;
  //      }
  //
  //      if (!new_psd.length>0) {
  //          Common2.toast("请输入交易密码！");
  //          return false;
  //      }
  //      if(!Common.reg.payPwd.test(new_psd)){
  //          Common2.toast('请设置由6位数字组成的交易密码！');
  //          return false;
  //      }
  //
  //      if (!agin_psd.length>0) {
  //          Common2.toast("请再次输入交易密码！");
  //          return false;
  //      }
  //      if (new_psd != agin_psd) {
  //          Common2.toast("两次密码输入不一致");
  //          return false;
  //      }
  //      formData.userId = $uid ;
  //      formData.password = md5(new_psd);
  //      formData.comfirmPwd = md5(agin_psd);
  //      formData.code = sms_code;
  //      formData.type = 3 ;//交易密码
  //      formData.phoneNum = phone;
  //      formData.loginToken = sessionStorage.getItem('loginToken');
  //      return true;
  //  }
  //  //获取验证码
  //  var smsTimer;
  //  var defText = '获取验证码';
  //  var timeText = '<strong>{time}</strong>s后重新发送';
  //  var $sendAgain = $('.send-sms-code');
  //
  //  $sendAgain.on('click', function(event) {
  //      var $this = $(this);
  //      if($this.hasClass('disabled')){
  //          return false;
  //      }
  //      phone = $.trim($phone.val());
  //      if (!phone.length>0) {
  //          Common2.toast("请输入手机号码！");
  //          return false;
  //      }
  //      if(!Common.reg.pwd.test(phone)){
  //          Common2.toast('手机号码格式有误，请重新输入！');
  //          return false;
  //      }
  //      var _imageCode  =$.trim($img_code.val());
  //      if(_imageCode == null || _imageCode == '' || _imageCode == undefined || _imageCode.length <= 0) {
  //          Common2.toast('请输入图形验证码');
  //          return false;
  //      }
  //
  //      //图形验证码进行效验成功以后发送短信验证码
  //      $.post(Setting.apiRoot1 + '/isRegist.p2p?divnceId=' + divnceId,
  //      {phoneNum: phone, code: _imageCode, type: 3},
  //      function(data) {
  //          if(data.code == 1) {
  //              formData.phoneNum = phone ;
  //              $this.addClass('disabled');
  //              //获取验证码
  //              Common.sendMsgCode(formData.phoneNum, 3, _imageCode, divnceId, function (res) {
  //                  if (res.code != 1) {
  //                      Common2.toast(res.message);
  //                      $this.removeClass('disabled');
  //                      return false;
  //                  }
  //                  startSmsTimer(function(){
  //                      $this.html(defText).removeClass('disabled');
  //                  });
  //              });
  //          } else {
  //              Common2.toast(data.message);
  //              $this.removeClass('disabled');
  //              return false;
  //          }
  //  },'json');
  //});
  //// 短信发送定时器
  //function startSmsTimer(timeOver){
  //    if(!!smsTimer){
  //        clearInterval(smsTimer);
  //    }
  //    var _i = Common.vars.sendWait;
  //    smsTimer = setInterval(function(){
  //        $sendAgain.html(timeText.replace(/{time}/, _i--));
  //        if(_i < 0){
  //            clearInterval(smsTimer);
  //            smsTimer = null;
  //            timeOver();
  //        }
  //    }, 1000);
  //}
  //
  //
  //  //提交数据
  //$body.on('click', '.reset-dealpassword', function(event) {
  //    var $this = $(this);
  //    if (checkForm()) {
  //        $this.addClass('disabled').html('数据提交中...');
//          $.ajax({
//              url: Setting.apiRoot1 +'/password/reset.p2p',
//              type: 'post',
//              dataType: 'json',
//              data: formData,
//          }).done(function(data) {
//              Common.ajaxDataFilter(data.code,function(){
//                  switch(data.code){
//                      case 1:
//                          Common2.toast("重置密码成功！");
//                      function  jumurl(){
//                          window.location.href=Setting.staticRoot+'/pages/my-account/myAccount.html';
//                      }
//                          setTimeout(jumurl,1000);
//                          break;
//                      default:
//                          Common2.toast(data.message);
//                          break;
//                  }
//                  $this.removeClass('disabled').html('确认');
//              })
//          }).fail(function() {
//              Common2.toast('网络链接失败');
//              $this.removeClass('disabled').html('确认');
//          })
//      }
//  });
});