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

	// 可领取和待领取
	var list = doT.template([
		'{{~it:item:index}}',
		'<div class="birthday-privilege">',
			'<img src="../../../images/pages/my-account3.0/privilege/rank-privilege.png">',
			'{{?item.upgrade != 1}}',
				'<div class="birthday-title">{{=item.vipPrivilegeRemark}}</div>',
				'<div class="birthday-botton" style="display:block;" onclick="receive({{=item.rateCouponId}})">立即领取</div>',
			'{{??}}',
				'<div class="birthday-title">{{=item.remark}}</div>',
				'<div class="mask mask-alert"></div>',
				'<div class="mask">',
					'<img src="../../../images/pages/my-account3.0/privilege/white.png" class="white">',
					'<div>{{=item.text}}</div>',
				'</div>',
			'{{?}}',
		'</div>',
		'{{~}}'
		].join(''));

	// 系统最高等级
	var higher= doT.template([
		'<div class="birthday-privilege">',
			'<img src="../../../images/pages/my-account3.0/privilege/higher.png">',
		'</div>'
	].join(''));

	//获取有礼券列表信息
	$.ajax({
		url:Setting.apiRoot1 +'/u/CourtesyCardCouponsInfo.p2p',
		type:'POST',
		dataType:'json',
		data:{
			userId: userId,
			loginToken:loginToken
		}
	}).done(function(res){
		Common.ajaxDataFilter(res,function(){
			if(res.code == 1){
				var nextVipPrivilege = res.data.nextVipPrivilege;//升级后可领取
				var userMaxVipLevel = res.data.userMaxVipLevel;//用户历史最大等级
				var userLevel = res.data.userLevel//用户当前等级
				$('.liyulist').append(list(res.data.vipPrivilegeVOList))//可领取
				var text=""//升级后可领取的文案
				if(userMaxVipLevel == userLevel){
					text = '升级后开启'
				}else{
					switch(userMaxVipLevel + 1){
						case 1 :text = '升级到白银会员可领取礼包';break;
						case 2 :text = '升级到黄金会员可领取礼包';break;
						case 3 :text = '升级到铂金会员可领取礼包';break;
						case 4 :text = '升级到钻石会员可领取礼包';break;
						default:text = '';break;
					}
				}
				if(nextVipPrivilege != null){
					for (var i = 0; i < nextVipPrivilege.length; i++) {
						nextVipPrivilege[i].upgrade = 1;
						nextVipPrivilege[i].text = text;
					}
				}
					
				//升级后可领取
				$('.liyulist').append(list(nextVipPrivilege))
				//已达到系统最高等级
				if(userMaxVipLevel == res.data.sysMaxVipLevel && nextVipPrivilege.length <=0 && res.data.vipPrivilegeVOList.length <= 0){
					$('.liyulist').append(higher())
				}
			}else{
				Common2.toast('网络连接失败！');
			}
		})
	}).fail(function(){
		Common2.toast('网络连接失败！');
	});

	// 领取成功弹框点击取消
	$('.btn-link').click(function(){
		window.location.href="./rank.html" + window.location.search;
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
});

// 领取卡券
function receive(rateCouponId){
	$.ajax({
		url:Setting.apiRoot1 +'/u/receiveCourtesyCardCoupons.p2p',
		type:'POST',
		dataType:'json',
		data:{
			userId: userId,
			loginToken:loginToken,
			rateCouponId:rateCouponId
		}
	}).done(function(res){
		Common.ajaxDataFilter(res,function(){
			if(res.code == 1){
				$('.ui-dialog').removeClass('hide');
			}else{
				Common2.toast('网络连接失败！');
			}
		})
	}).fail(function(){
		Common2.toast('网络连接失败！');
	});
}
