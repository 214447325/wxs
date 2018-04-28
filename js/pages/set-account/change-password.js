/**
 * 修改d登录密码
**/
$(function(){
  var $win = $(window);
  var $body = $('body');

  var $psdForm = $('.forget-pwd-form');

  var $old_psd = $('[name=old-password]', $psdForm);
  var $psd = $('[name=new-password]', $psdForm);
  var $agin_psd = $('[name=agin-password]', $psdForm);
  var $imgcode = $('[name=imgcode]', $psdForm);
  var $showPassworld = $('.show-img');//点击显示密码
  var $uid = sessionStorage.getItem("uid");
  var data = new Date();
  var tiem = data.getTime();
  var round = Math.floor(Math.random()*10);
  var divnceId = tiem + round;
  var formData ={};

  /**
   * 密码验证
   * @return {[type]} [description]
   */
  if(!$uid){
    Common.toLogin();
    return false;
  }
  function checkPsd(){
    var _old_psd = $.trim($old_psd.val());
    var _psd  = $.trim($psd.val());
    var _agin_psd =  $.trim($agin_psd.val());
    var _imgcode =  $.trim($imgcode.val());
    if (!_old_psd.length>0) {
       Common2.toast("请输入原密码")
      return false;
    }
    if(!Common.reg.pwd.test(_old_psd)){
       Common2.toast('旧密码格式有误，请重新输入');
      return false;
    }

    if (!_psd.length>0) {
       Common2.toast("请设置新的登录密码")
      return false;
    }

    if(!Common.reg.pwd.test(_psd)){
       Common2.toast('新密码格式有误，请重新输入');
      return false;
    }

    if (!_imgcode>0) {
      Common2.toast('请输入图形验证码')
      return false;
    }

    // if (!_agin_psd.length>0) {
    //   alert("请再次输入新密码！")
    //   return false;
    // }

    // if (_psd != _agin_psd) {
    //   alert("两次密码输入不一致!")
    //   return false;
    // }

    if (_old_psd == _agin_psd) {
       Common2.toast("新登录密码不能与原密码一致")
      return false;
    }

    /**
    *
    *newPassword 是 string 新密码 
    *password 是 string 原密码 
    *userId 是 string 用户id 
    *code 是 string 输入的图形验证码 
    * divnceId 是 string 图片id 
    *loginToken 是 String 登录密匙 

    */

    // formData.password = md5(_agin_psd)
    formData.newPassword = md5(_psd)
    formData.password = md5(_old_psd)
    formData.userId = $uid;
    formData.code = _imgcode;
    formData.divnceId = divnceId;
    formData.loginToken = sessionStorage.getItem('loginToken');
    return true;
  }

  $body.on('click', '.change-psd', function(event) {
    var $this = $(this)
    if (checkPsd()) {
      $this.addClass('disabled').html('数据提交中...');
      $.ajax({
        // url: Setting.apiRoot1 +'/u/password/modify.p2p',
        url: Setting.apiRoot1 +'/u/restLoginPsd.p2p',
        type: 'post',
        dataType: 'json',
        data: formData,
      }).done(function(data) {
        Common.ajaxDataFilter(data,function(){
          switch(data.code){
            case 1:
                sessionStorage.removeItem('uid');
                 Common2.toast("修改成功");
                function  jumurl(){
               	 window.location.href=Setting.staticRoot+'/pages/account/login.html';
                }
                setTimeout(jumurl,1000);
                
                //iOS  or   Android
//                var browser = {
//	                versions: function () {
//		                var u = navigator.userAgent, app = navigator.appVersion;
//		                return { //移动终端浏览器版本信息 
//			                ios: !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/), //ios终端 
//			                android: u.indexOf('Android') > -1 || u.indexOf('Linux') > -1, //android终端或uc浏览器 
//			                iPhone: u.indexOf('iPhone') > -1, //是否为iPhone或者QQHD浏览器 
//			                iPad: u.indexOf('iPad') > -1, //是否iPad 
//		                };
//	                }(),
//                }
//                
//                if (browser.versions.iPhone || browser.versions.iPad || browser.versions.ios) {
//                          alert("修改成功");
//                          function  jumurl(){
//                             window.location.href =Setting.staticRoot+'/pages/account/login.html';
//                          }
//                          setTimeout(jumurl,1000);
//                          
//                }
//                if (browser.versions.android) {
//                	 alert("修改成功");
//                     function  jumurl(){
//                    	 window.location.href=Setting.staticRoot+'/pages/account/login.html';
//                     }
//                     setTimeout(jumurl,1000);
//                }
              
              break;
            default:
               Common2.toast(data.message);

              break;
          }
          //
          $this.removeClass('disabled').html('修改');
        })
      })
      .fail(function() {
        Common2.toast('网络异常',Setting.staticRoot+'/images/pages/ui/wifi.png');
        $this.removeClass('disabled').html('修改');
      })
    }
 });


  // 图形验证码
  $('.Verification-code').on('click', function(){
    //微信才有UUID
      var img = new Image();
      img.src = Setting.apiRoot1 + '/code.p2p?type=1&divnceId='+divnceId+'&time=' + Date.now();
      $(this).html(img);
  })
  var img = new Image();
  img.src = Setting.apiRoot1 + '/code.p2p?type=1&divnceId='+divnceId+'&time=' + Date.now();
  $('.Verification-code').html(img);


  var isShowPassworld = true; //用来判断密码是否隐藏

  //点击密码显示按钮
  $showPassworld.click(function() {
      if(isShowPassworld) {
          $(this).attr({'src': '../../../images/pages/account/show-passworld3.0.png'});
          $psd.attr({'type': 'text'});
          isShowPassworld = false;
      } else {
          $(this).attr({'src': '../../../images/pages/account/login-show3.0.png'});
          $psd.attr({'type': 'password'});
          isShowPassworld = true;
      }
    });

});