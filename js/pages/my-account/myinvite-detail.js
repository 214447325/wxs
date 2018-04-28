/**
 * zyx 
 * 我的邀请
 **/
$(function() {

	var param = Common.getParam();
	var $win = $(window);
	var $body = $('body');
	var uid = sessionStorage.getItem("uid")
	var loginToken = sessionStorage.getItem('loginToken');
	var $invitationcode = $(".invitationcode");

	var $phone = $(".phone");
	var $name = $(".name");
	var $code = $(".code");

	var phone = param.phone;
	var name = param.name;
	var code = param.code;

	$phone.html("手机号：" + phone);
	$name.html("姓名：" + name);
	$code.html("邀请码：" + code);

	if (!uid) {
		Common.toLogin();
		return false;
	}

	//
	$.ajax({
		url : Setting.apiRoot1 + '/u/inviteFriendDetail.p2p',
		type : 'post',
		dataType : 'json',
		data : {
			userId : uid,
			loginToken : loginToken
		}
	}).done(function(res) {
		if (res.code == 1) {
			alert(res.data.sumUserRelation);
			//		  var param = {
			//			  phone:res.data.phone,
			//			  name:res.data.name,
			//			  code:formData.code
			//        };

			//		  window.location.href=Setting.staticRoot+'/pages/my-account/setting/info-confirm.html?'+ $.param(param);

		} else {
			alert(res, message);
		}
	}).fail(function() {
		alert('网络链接失败');
	});

	/**
	 * yaoqing
	 */
	$body.on('click', '.next-btn', function(event) {

	});
});