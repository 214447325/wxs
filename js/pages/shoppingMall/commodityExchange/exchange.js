$(function(){
	var param = Common.getParam();
	var goodsId = param.goodsId;
	var type = param.type;
	var addressId = param.addressId;
	var userId,loginToken,prodType,phoneNum,channel,name;
	var search = '';
	// ios调用h5页面
	if(type == 2){
		channel = 2;
		userId = param.uid;
		loginToken = param.loginToken;
		search = '&type=2&uid='+ userId + '&loginToken='+ loginToken;
	}else{
		channel = 1;
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
	// 获取商品信息
	$.ajax({
		url: Setting.apiRoot1 + '/getProdInfo/'+ goodsId+'.p2p',
		type: 'get',
		dataType: 'json',
		async:false,
	}).done(function(res){
		Common.ajaxDataFilter(res,function(){
			if(res.code == 1){
				var data = res.data;
				$('.goods-left').attr('src',data.imageUrl);
				$('.goods-title').html(data.prodName);
				$('.goods-integral').html('-' +data.score + '积分');
				name = data.prodName;
				// $('.goods-num').html('数量：' +data.stock);
				prodType = data.prodType;
			}else{
				Common2.toast(res.message);
			}
		})
	}).fail(function(){
		alert('网络链接失败');
	});

	var list = doT.template([
		'<img class="fl map" src="../../../images/pages/shoppingMall/map/map.png">',
		 '<div class="fl mui-content">',
	       		'<div class="name">',
	       			'<span>{{=it.name}}</span>',
	       		     '<span class="phoneNum">{{=it.phoneNum}}</span>',
	       		 '</div>',
	      		'<div class="detailedAddress">{{=it.address.pro.name}}{{=it.address.city.name}}{{=it.address.dis.name}}{{=it.detailAddress}}</div>',
	      		'<!-- <div></div> -->',
	    '</div> ',
	    '<img class="fr edit" src="../../../images/pages/my-account3.0/exclusive/moreright.png">',
	].join(''));
	if(prodType == 2){
		if(addressId){
			getAddressDetail(addressId);
		}else{
			getAddress();
		}
		phoneNum = $('.phoneNum').html();
		$('.address').removeClass('hide');
	}else if(prodType == 1){
		if(type == 2){
			phoneNum = param.phoneNum;
		}else{
			phoneNum = sessionStorage.getItem('uname');
		}
		$('.address').remove();
	}
	

	/*获取地址列表*/
	function getAddress(){
		$.ajax({
			url:Setting.apiRoot1 + '/u/getAddress.p2p',
			type:'POST',
			dataType:'json',
			async:false,
			data:{
				userId:userId,
				loginToken:loginToken
			}
		}).done(function(res){
			Common.ajaxDataFilter(res,function(res){
				if(res.code == 1){
					var data = res.data;
					var isDefault = false;
					for (var i = 0; i < data.length; i++) {
						if(data[i].isDefault){
							isDefault = true;
							$('.address').html(list(data[i]))
						}
					}
					if(data.length <= 0){
						// 选择地址
						$('.address').on('click',function(){
							window.location.href = '../../../pages/shoppingMall/map/editAddress.html?goodsId='+goodsId + search;
						})
					}else{
						if(!isDefault){
							$('.address').html(list(data[0]))
						}
						// 选择地址
						$('.address').on('click',function(){
							window.location.href = '../../../pages/shoppingMall/map/myAddress.html?goodsId='+goodsId + search;
						})
					}
				}
			})
		})
	};

	//通过id查询地址信息
	function getAddressDetail(addressId){
		$.ajax({
			url:Setting.apiRoot1 + '/u/addressDetail.p2p',
			type:'POST',
			dataType:'json',
			async:false,
			data:{
				userId:userId,
				addressId:addressId,
				loginToken:loginToken
			}
		}).done(function(res){
			Common.ajaxDataFilter(res,function(res){
				if(res.code == 1){
					var data = res.data;
					$('.address').html(list(data));
					$('.address').on('click',function(){
						window.location.href = '../../../pages/shoppingMall/map/myAddress.html?goodsId='+goodsId + search;
					})
				}
			})
		})
	}

	
	// 确定兑换
	$('.button').click(function(){
		var address = $('.detailedAddress').html();
		$.ajax({
			url: Setting.apiRoot1 + '/u/convertProdInfo.p2p',
			type: 'get',
			dataType: 'json',
			async:false,
			data:{
				prodId:goodsId ,
				userId:userId,
				loginToken:loginToken,
				channel:channel,
				phoneNum:phoneNum,
				address: address
			}
		}).done(function(res){
			Common.ajaxDataFilter(res,function(){
				if(res.code == 1){
					window.location.href = '../../../pages/shoppingMall/commodityExchange/success.html?result='+ prodType +'&orderId=' + res.data.userProdId + search;
				}else{
					Common2.toast(res.message);
				}
			})
		}).fail(function(){
			alert('网络链接失败');
		});
	})
})