/**
 * login.js
 * @author  zyx
 * @return {[type]}       [description]
 */
$(function(){

  /**
   * 微信进来的访问判断，不是跳转到官网下载页
   * 20160226 zyx 
   */
  var isWeiXin = Common.isWeiXin();
	  
  var $loginForm = $('.login-form');

  var param = Common.getParam();

  var $phone = $('[name=phone]', $loginForm);
  var $password = $('[name=password]', $loginForm);

  var formData = {};
  var defText = '立即登录';
  var loadingText = '登录中...';
  
  var hh = window.location.href;
  var uid = sessionStorage.getItem('uid');
//  alert(hh);
  if(hh!=null && hh!=''){
	  if(hh.indexOf("invite.html")||hh.indexOf("myInvite.html")||hh.indexOf("dial.html") || hh.indexOf("dial.html")){
		  if(uid){
			  //zyx 
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
      alert('请输入手机号码！');
      return false;
    }

    if(!Common.reg.mobile.test(phone)){
      alert('请输入正确的手机号码！');
      return false;
    }

    if(password.length == 0){
      alert('请输入密码！');
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

  $loginForm.on('click', '.submit-btn', function(){
    var $this = $(this);

    if($this.hasClass('disabled')){
      return false;
    }

    if(checkForm()){
      $this.addClass('disabled').text(loadingText);
      $.ajax({
        url: Setting.apiRoot2 + '/login.p2p',
        type: 'post',
        dataType: 'json',
        data: formData,
        cache:false
      }).done(function(res){
        if(res.code == 1){
          var downloadStatus = sessionStorage.getItem('status');//获取首页下载APP的按钮的状态 
          sessionStorage.clear();
          sessionStorage.setItem('uname', res.data.phoneNum);
          sessionStorage.setItem('uid', res.data.id);
          sessionStorage.setItem('ucode', res.data.code);
          sessionStorage.setItem('loginToken',res.token);
          sessionStorage.setItem('payChannel',res.data.payChannel);
          sessionStorage.setItem('realname',res.data.name);//zyx add
          sessionStorage.setItem('relation',res.data.relation);//zyx add
          sessionStorage.setItem('cardNum',res.data.cardNum);//身份证
          sessionStorage.setItem('status',downloadStatus);
          
          if(param.from!=null && param.from!=undefined){
            window.location.href = decodeURIComponent(param.from);
          }else{
        	window.location.href = Setting.staticRoot + '/pages/my-account/myAccount.html';
          }
          
        }else{
          alert(res.message);
          $this.removeClass('disabled').text(defText);
        }
      }).fail(function(){
        alert('网络链接失败');
        $this.removeClass('disabled').text(defText);
        return false;
      });
    }
  });
});