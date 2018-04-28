/**
 * zyx 
 * 绑定成功
**/
$(function(){
	
  var param = Common.getParam();
  var $win = $(window);
  var $body = $('body');
  var uid = sessionStorage.getItem("uid")
  var $invitationcode = $(".invitationcode");

  var $phone = $(".phone");
  var $name = $(".name");
  var $code = $(".code");
  
  var phone = param.phone;
  var name = param.name;
  var code = param.code;
  
  $phone.html("手机号："+phone);
  $name.html("姓名："+name);
  $code.html("邀请码："+code);
  
  if(!uid){
    Common.toLogin();
    return false;
  }

});