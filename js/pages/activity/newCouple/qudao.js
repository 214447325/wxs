$(function(){
    var param = Common.getParam();
    var pathname = window.location.pathname;
    var channelId = '';
    var fenxiangUrl = '';
    var linkUrl = window.location.href;
    if(pathname.indexOf('newCoupleTongxin.html') > 0){
      channelId = '1351';//同心渠道码
      fenxiangUrl = Setting.staticRoot + '/pages/activity/newCouple/tongxinqudao.html';
    };
    if(pathname.indexOf('newCoupleToutiao.html') > 0){
      channelId = '1233';
      fenxiangUrl = Setting.staticRoot + '/pages/activity/newCouple/toutiaoqudao.html';
    };
    if(pathname.indexOf('newCoupleWangyi.html') > 0){
      channelId = '1361';
      fenxiangUrl = Setting.staticRoot + '/pages/activity/newCouple/wangyiqudao.html';
    };
    if(pathname.indexOf('wangyiCZsignIn.html') > 0){
      channelId = '1371';
      fenxiangUrl = Setting.staticRoot + '/pages/activity/newCouple/wangyiqudao.html';
    };
    if(pathname.indexOf('wangyiCZwage.html') > 0){
      channelId = '1381';//网易车主工资渠道码
      fenxiangUrl = Setting.staticRoot + '/pages/activity/newCouple/wangyiqudao.html';
    };
    if(pathname.indexOf('wangyiYXsignIn.html') > 0){
      channelId = '1391';
      fenxiangUrl = Setting.staticRoot + '/pages/activity/newCouple/wangyiqudao.html';
    };
    if(pathname.indexOf('wangyiYXwage.html') > 0){
      channelId = '1401';//网易邮箱工资渠道码
      fenxiangUrl = Setting.staticRoot + '/pages/activity/newCouple/wangyiqudao.html';
    }
    if(pathname.indexOf('xinshu.html') > 0){
      channelId = '1421';//新数渠道码
      fenxiangUrl = Setting.staticRoot + '/pages/activity/newCouple/xinshuqudao.html';
    }
    // 头条渠道
    if(pathname.indexOf('financing.html') > 0){
      channelId = '1431';//理财
      fenxiangUrl = Setting.staticRoot + '/pages/activity/newCouple/toutiaoqudao.html';
    };
    if(pathname.indexOf('cashBack.html') > 0){
      channelId = '1441';//返现
      fenxiangUrl = Setting.staticRoot + '/pages/activity/newCouple/toutiaoqudao.html';
    };
    if(pathname.indexOf('redPacket.html') > 0){
      channelId = '1451';//红包
      fenxiangUrl = Setting.staticRoot + '/pages/activity/newCouple/toutiaoqudao.html';
    };
    if(pathname.indexOf('inCome.html') > 0){
      channelId = '1461';//收益
      fenxiangUrl = Setting.staticRoot + '/pages/activity/newCouple/toutiaoqudao.html';
    };
   
      //点击邀请按钮
      $('.activityButton2').click(function(){
        var version = param.version;
        var userId = sessionStorage.getItem('uid');
        var type = param.type;
        var shareTemplate = [
        '<a class="share" href="javascript:;">',
          '<i class="share_pic"></i>',
        '</a>'
        ].join('');
        if(version != null && version != undefined && version > 0){
          window.location.href = fenxiangUrl;
        } else if(type != null && type != undefined && type > 0) {
          window.location.href = fenxiangUrl;
        }else{
          //只有点击分享时候需要提示登录
          (!$('.share').length>0)  && $('body').append(shareTemplate);
         }
      });
      $('body').on('click', '.share', function(event) {
        $(this).remove();
      });
      var imgurl = 'http://106.15.44.101/group1/M00/00/15/ag8sZVnjei6ANqtLAABbYUnyaOU209.jpg';
      var title = '新人专享¥1446红包来啦！';
      var desc = '历史年化收益率12%，14天标最多相当于加息11.2%，还不快进来看看！';
      var link = linkUrl;
      share.shareFixed(imgurl, title, desc, link, "888");

      $('.closeXieyi').on('click',function(){
        $('.xieyi').hide();
      })
      $('.openXieyi').on('click',function(){
        $('.xieyi').show();
      })
      //勾选框
      var $checked = $('.isChecked');
      var isChecked = true;
      if(isChecked) {
          $checked.attr({'src': '../../../images/pages/account/ischecked-true.png'}).addClass('isTrue');
          isChecked = false;
      }
      $checked.click(function() {
        if(isChecked) {
            $(this).attr({'src': '../../../images/pages/account/ischecked-true.png'}).addClass('isTrue');
            isChecked = false;
        } else {
            $(this).attr({'src': '../../../images/pages/account/isChecked.png'}).removeClass('isTrue');
            isChecked = true;
        }
    });

    // 领取福利
    var uid = sessionStorage.getItem('uid');
    $('.activityButton,.activityButtonTwo').on('click',function(){
      var phone = $('input[name="phone"]').val();
      var megcode = $('input[name="code"]').val();
      var password = $('input[name="password"]').val();
      var noteCode = $('input[name="noteCode"]').val();
      // if(uid != null && uid != undefined && uid != ''){
      //   window.location.href = './newCoupleHD.html';
      // }else 
      if(phone != '' && megcode != '' && password != '' && noteCode != ''){
         $('.coupleButton').trigger('click');
      }else{
        $('.wrapper').scrollTop(0);
      }
    });
    var uuid = $.cookie('uuid');
    var formData = {};

    // 获取图形验证码
    var data = new Date();
    var tiem = data.getTime();
    var round = Math.floor(Math.random()*10);
    var divnceId = tiem + round;
    var img = new Image();
    img.src = Setting.apiRoot1 + '/code.p2p?type=1&divnceId='+divnceId+'&time=' + Date.now();
     $("#code").html(img);
    $("#code").on('click',function(){
        //微信才有UUID
        var img = new Image();
        img.src = Setting.apiRoot1 + '/code.p2p?type=1&divnceId='+divnceId+'&time=' + Date.now();
        $(this).html(img);
    });

    // 获取短信验证码
    var $sendAgain = $('.btn-msgcode');
    var smsTimer;
    var timeText = '<strong>{time}</strong>s';
    $sendAgain.on('click', function(){
      var $this = $(this);
      if($this.html()=='获取验证码' || $this.html()=='重新发送'){
        var registerPhone = $('input[name="phone"]').val(); //手机号码
        var imgcode = $('input[name="code"]').val(); //图形验证码
        var uuid = $.cookie('uuid');
        if(checkForm(registerPhone)){
          Common.sendMsgCode(registerPhone, 2, imgcode, divnceId, function(data){
              if(data.code != 1){
                  alert(data.message);
                  return false;
              }
              startSmsTimer(function(){
                  $this.html('重新发送');
              });
          });
        }
      }else{
        alert('请等待60秒');
      }
    });
      
    $('.coupleButton').on('click',function(){
      var registerPhone = $('input[name="phone"]').val(); //手机号码
      if(checkForm(registerPhone)){
        // 验证是否可以注册
        // $.ajax({
        //     url: Setting.apiRoot1 + '/isRegist.p2p?divnceId=' + uuid,
        //     type: 'post',
        //     dataType: 'json',
        //     data: {
        //       code:$('input[name="code"]').val(),//图形验证码
        //       phoneNum:$('input[name="phone"]').val(),
        //       type:2,
        //     }
        // }).done(function(res) {
          // if(res.code == 1){
              var phone = $('input[name="phone"]').val();
              var password = $('input[name="password"]').val();
              var msgcode = $('input[name="noteCode"]').val();
              formData.phoneNum = phone;//手机号
              formData.password = md5(password);//密码
              formData.msgcode = msgcode;//短信验证码
              formData.invitationCode = '';//邀请码
              formData.channelId = channelId;//同心渠道码
              // 可以注册
                // 验证短信验证码是否正确
                Common.validMsgCode(formData.phoneNum, formData.msgcode, 2, function(data){
                    if(data.code != 1){
                        alert('短信验证码输入有误！');
                        return false;
                    }
                    // 注册
                    $.ajax({
                        url: Setting.apiRoot2 + '/regist.p2p',
                        type: 'post',
                        dataType: 'json',
                        data: formData
                    }).done(function(res){
                        if(res.code != 1){
                            alert(res.message);
                            return false;
                        }
                        alert('注册成功！');
                        setTimeout(Common.login(formData.phoneNum,formData.password),1500);

                    }).fail(function(){
                        alert('网络链接失败');
                        return false;
                    });
                });
            //   }else {
            //     alert(res.message);
            // }
        // }).fail(function() {
        //     alert('网络链接失败');
        //     return false;
        // });
      }
    });
    //验证手机号码
    function checkForm(ph){
        var msgcode = $.trim($('input[name="code"]').val());
        var password = $.trim($('input[name="password"]').val());
        // var invitation = $.trim($invitation.val());//推荐人码

        if(ph.length == 0){
            alert('请输入手机号码！');
            return false;
        }

        if(!Common.reg.mobile.test(ph)){
            alert('请输入正确的手机号码！');
            return false;
        }

        if(msgcode.length == 0){
            alert('请输入图形码！');
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

        if(isChecked){
            alert('请阅读并同意《V金融理财协议》');
            return false;
        }

        formData.phoneNum = ph;
        formData.password = md5(password);
        formData.msgcode = msgcode;
        formData.invitationCode = '';


        //zyx 20160506 微信分多个注册渠道
        // if(!channelId){
        //     formData.channelId = "992";
        // }else{
        //     formData.channelId = channelId;
        // }

        var uuid = $.cookie('uuid');
        if(uuid){
            formData.uuid = uuid;
        }

        return true;
    }
    // 倒计时
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
  });