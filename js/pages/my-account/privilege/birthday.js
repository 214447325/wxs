$(function(){
	var	param = Common.getParam();
	var type = param.type;
	var userId,loginToken;
	// ios调用h5页面
	if(type == 2){
		userId = param.uid;
		loginToken = param.loginToken;
	}else{
		userId = sessionStorage.getItem('uid');
		loginToken = sessionStorage.getItem('loginToken');
	}
	if(!userId){
		// ios APP跳转到登录
		if(type == 2){
			iOS.HtmlJumpLogin();
		}else{
			Common.toLogin();
			return false;
		}
	}
	$.ajax({
		url:Setting.apiRoot1 +'/u/birthdayInfo.p2p',
		type:'POST',
		dataType:'json',
		data:{
			userId: userId,
			loginToken:loginToken
		}
	}).done(function(res){
		Common.ajaxDataFilter(res,function(){
			if(res.code == 1){
				$('.birthday-text').text('距离生日月还有'+ res.data.dateSpace+'天');
				if(res.data.levelConditional == 1){
					if(res.data.isGet == 1){//可以领取
						$('.birthday-botton').css('display','block');
						$('.mask').css('display','none');
						$('.birthday-botton').click(function(){
							$.ajax({
								url:Setting.apiRoot1 +'/u/birthdayBenefits.p2p',
								type:'POST',
								dataType:'json',
								async:false,
								data:{
									userId: userId,
									loginToken:loginToken
								}
							}).done(function(res){
								Common.ajaxDataFilter(res,function(){
									if(res.code == 1){
										$('.ui-dialog').removeClass('hide');
										$('.birthday-botton').css('display','none');
										$('.birthday-botton2').css('display','block');
										$('.mask').css('display','none');
										$('.birthday-botton2').click(function(){
											Common2.toast('生日当月可领');
										})
									}else{
										Common2.toast(res.message)
									}
								})
							}).fail(function(){
								Common2.toast('网络连接失败！');
							})
						})
					}else if(res.data.isGet == 2){//已经领取过
						$('.birthday-botton').css('display','none');
						$('.birthday-botton2').css('display','block');

						$('.mask').css('display','none');
						$('.birthday-botton2').click(function(){
							Common2.toast('生日当月可领');
						})
					}else if(res.data.isGet == 3){//未到领取月份不可领取
						$('.birthday-botton').css('display','none');
						$('.birthday-botton2').css('display','block');
						$('.mask').css('display','none');
						$('.birthday-botton2').click(function(){
							Common2.toast('生日当月可领');
						})
					}
				}
			}
		})
	}).fail(function(){
		Common2.toast('网络连接失败！');
	});
	// 领取成功弹框点击取消
	$('.btn-link').click(function(){
		window.location.href="./birthday.html" + window.location.search;
	});

	//领取成功弹框点击查看礼券
	$('.btn-default-two').click(function(){
		// if(type == 2){
		// 	// ios APP跳转到我的卡券
		// 	iOS.HtmlJumpCoupon();
		// }else{
			window.location.href = '../reward/red-envelope.html' + window.location.search;
		// }
		
	})
})