$(function(){
	var	param = Common.getParam();
	var type = param.type;
	var userId,loginToken,hobbyNum;
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
	var list = doT.template([
			'{{~it:item:index}}',
				'<div class="fl piece" data-value="{{=item.paramValue}}">{{=item.remark}}',
					'<div class="hobby-selected-img" ></div>',
				'</div>',
			'{{~}}',
		].join(''));
	$.ajax({
		url:Setting.apiRoot1 + '/getIntrest.p2p',
		type:'POST',
		dataType:'json',
	}).done(function(res){
		if(res.code == 1){
			console.log(res)
			$('.box').append(list(res.data));
			$('.piece').on('click',function(){
				var flag = $(this).hasClass('hobby-selected');
				if(flag){
					$(this).removeClass('hobby-selected');
				}else{
					$(this).addClass('hobby-selected');
				}
				hobbyNum = $('.hobby-selected').length;
				if(hobbyNum){
					$('.hobby-button').addClass('hobby-button-flag');
				}else{
					$('.hobby-button').removeClass('hobby-button-flag');
				}
			})
		}else{
			Common.toast(res.message)
		}
	})


	$('.hobby-button').on('click',function(){
		if(hobbyNum){
			var intrest = new Array();
			$('.hobby-selected').each(function(index,item){
				intrest[index] = {
		            "name": $(this).text(),
		            "value": $(this).data('value')
				}
			});
			$.ajax({
				url:Setting.apiRoot1 + '/u/doIntegralTask.p2p',
				type:'POST',
				dataType:'json',
				data:{
					userId:userId,
					loginToken:loginToken,
					type:3,
					jsonObj:JSON.stringify(intrest),
				}
			}).done(function(res){
				Common.ajaxDataFilter(res,function(res){
					if(res.code == 1){
						window.location.href  = '../../../pages/my-account/integral/list.html'+ window.location.search;

					}else{
						Common2.toast(res.message);
					}
				})
			}).fail(function(res){
				Common2.toast('网络连接失败！');
			})
		}else{
			Common2.toast('请选择一些你的兴趣爱好')
		}				
	});	
})