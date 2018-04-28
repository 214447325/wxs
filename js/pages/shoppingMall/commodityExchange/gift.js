$(function(){
	var param = Common.getParam();
	var type = param.type;
	var orderId = param.orderId;
	var userId,loginToken;
	// ios调用h5页面
	if(type == 2){
		userId = param.uid;
		loginToken = param.loginToken;
		// search = '&type=2&uid='+ userId + '&loginToken='+ loginToken;
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
		url:Setting.apiRoot1 + "/u/convertDetailsPage.p2p",
		type:'post',
		dataType:'json',
		data:{
			userProdId:orderId,
			userId:userId,
			loginToken:loginToken
		}
	}).done(function(res){
		Common.ajaxDataFilter(res,function(){
			if(res.code == 1){
				var data = res.data;
				$('.goods-num').html('数量：' + data.count);//int 数量 
				$('.createTime').html(data.createTime); //String 兑换时间 
				$('.goods-title').html(data.prodName); //String 商品信息 
				$('.goods-integral').html('-' + data.score + '积分'); //double 积分 
				$('.userProdId').html(data.userProdId); //String 订单号 
				$('.detailedAddress').html('地址：' + data.address);
				$('.goods-left').attr('src', data.images);
				$('.prodName').html(data.name); //String 订单号 
				$('.phoneNum').html(data.phone); //String 订单号 

				if(data.userProdStatus == 1){
					var img = '<img src="../../../images/pages/shoppingMall/commodityExchange/yifahuo.png" style="width:1.92rem;position: absolute;right:0.8rem;top:0;">';
					$('.goods').append(img);
				$('.deliverTime').html(data.deliverTime); //String 配送时间 
				$('.deliverInfo').html(data.deliverInfo); //String 快递信息 


					

				}else if(data.userProdStatus ==2){
					var img = '<img src="../../../images/pages/shoppingMall/commodityExchange/daipeisong.png" style="width:1.92rem;position: absolute;right:0.8rem;top:0;">';
					$('.goods').append(img);
				$('.deliverTime').html('待配送/暂无'); //String 配送时间 
				$('.deliverInfo').html('暂无'); //String 快递信息 


				}
			}else{
				Common2.toast(res.message);
			}
		})
	}).fail(function(){
		Common2.toast('网络连接失败！')
	})
})