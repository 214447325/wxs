var url = location.search; //获取url中"?"符后的字串
var param = {};
if (url.indexOf("?") != -1) {
  var str = url.substr(1);
  strs = str.split("&");
  for(var i = 0; i < strs.length; i ++) {
     param[strs[i].split("=")[0]] = decodeURIComponent(strs[i].split("=")[1]);
  }
}
var type = param.type;
var userId,loginToken;

$(function(){
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
			'<div class="list">',
				'<div class="list-top" data-index={{=index}}>',
					'<div class="list-title">{{=item.title}}</div>',
					'<div class="list-text">{{=item.text}}</div>',
					'<div class="open" ></div>',
				'</div>',
				'<div class="list-content">',
				'{{ for(var prop = 0;prop < item.data.length; prop++){ }}',
					'<div class="clearfix" style="margin:0.5rem 0;">',
						'<img class="float-left" src={{=item.data[prop].ruleObj.imageUrl}}>',
						'<div class="float-right clearfix right">',
							'<div class="float-left clearfix center">',
								'<div class="list-title">{{=item.data[prop].title}}</div>',
								'<div class="list-text">+{{=item.data[prop].integral}}</div>',
							'</div>',
							'{{? item.data[prop].flagStatus == 1}}',
								'<a class="float-right botton" href="'+Setting.staticRoot+'{{=item.data[prop].ruleObj.url}}'+window.location.search+'">去完成</a>',
							'{{?? item.data[prop].flagStatus == 2}}',
								'<div class="float-right botton2" data-id={{=item.data[prop].id}}>领取奖励</div>',
							'{{?? item.data[prop].flagStatus == 3}}',
								'<a class="float-right botton3">已完成</a>',
							'{{?}}',
						'</div>',

					'</div>',
					'{{ } }}',
				'</div>',
			'</div>',
			'{{~}}'
		].join(''));
	getListData();
	function getListData(){
		$.ajax({
			url:Setting.apiRoot1 + '/u/integralTaskList.p2p',
			type:'POST',
			dataType:'json',
			async:false,
			data:{
				userId:userId,
				loginToken:loginToken
			}
		}).done(function(res){
				if(res.code == 1){
					$('.listBox').html(list(res.data));
					// 已完成
					$('.botton3').click(function(){
						Common2.toast('该任务已完成');
					});
					$('.botton2').on('click',function(){
						var taskId = $(this).data('id')
						getIntegral(taskId)
					});
				}else if(res.code == -99){
					var weixin = sessionStorage.getItem("uuid");
		        	if(weixin!=undefined && weixin!=null && weixin.length>10){
			            Common.weixinLogin(weixin);
		          	}else{
			            sessionStorage.clear();
			            href = href || window.location.href;
	      				window.location.href = Setting.staticRoot + '/pages/account/login.html?from=' + encodeURIComponent(href);
		          	}
				}else{
					Common2.toast(res.message)
				}
		}).fail(function(){
			Common2.toast('网络连接失败！');
		})
	}

	function getIntegral(taskId){
		$.ajax({
			url:Setting.apiRoot1 + '/u/getIntegral.p2p',
			type:'POST',
			dataType:'json',
			data:{
				userId:userId,
				taskId :taskId, 
				loginToken :loginToken
			}
		}).done(function(res){
			console.log(res)
			if(res.code == 1){
				Common2.toast('领取成功');
				getListData();
				// window.location.href = window.location.href;
			}else if(res.code == -99){
				var weixin = sessionStorage.getItem("uuid");
	        	if(weixin!=undefined && weixin!=null && weixin.length>10){
		            Common.weixinLogin(weixin);
	          	}else{
		            sessionStorage.clear();
		            href = href || window.location.href;
	  				window.location.replace(Setting.staticRoot + '/pages/account/login.html?from=' + encodeURIComponent(href));
	          	}
			}else{
				Common2.toast(res.message)
			}
		})
	}
	
	$('.listBox').on('click','.list-top',function(){
		var index = $(this).data('index');
		if($('.open').eq(index).hasClass('close')){
			$('.open').eq(index).removeClass('close');
			$(".list-content").eq(index).slideUp();
		}else{
			$('.open').eq(index).addClass('close');
			$(".list-content").eq(index).slideDown();
		}
		
	})
});