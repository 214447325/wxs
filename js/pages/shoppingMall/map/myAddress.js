$(function(){
	var startPositionX,endPositionX;
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
	};
	var list = doT.template([
		'<!-- 侧滑导航根容器 -->',
		'{{~it:item:index}}',
		'<div class="mui-off-canvas-wrap mui-draggable">',
		  '<!-- 主页面容器 -->',
		  '{{? item.isDefault != 1}}',
		  	'<div class="mui-inner-wrap clearfix" data-index={{=index}}>',
		  '{{??}}',
		  	'<div style="padding:0.2666rem 0.4rem 0 0.4rem;background:#fff;font-size: 0.2666rem;">默认地址</div>',
		  	'<div class="mui-inner-wrap clearfix isDefault" data-index={{=index}} style="border:0;">',
		  '{{?}}',
		    '<div class="fl mui-content" data-id={{=item.no}}>',
		       		'<div class="name">',
		       			'<span>{{=item.name}}</span>',
		       		     '<span>{{=item.phoneNum}}</span>',
		       		 '</div>',
		      		'<div class="address">{{=item.address.pro.name}}{{=item.address.city.name}}{{=item.address.dis.name}}{{=item.detailAddress}}</div>',
		      		'<!-- <div></div> -->',
		    '</div> ',
		    '<img class="fr edit" src="../../../images/pages/shoppingMall/map/edit.png" data-id={{=item.no}}>',
		     '<!-- 菜单容器-->',
		     '<aside class="mui-off-canvas-right delete" data-id={{=item.no}}>删除</aside>',
		  '</div>',
		'</div>',
		'{{~}}'
	].join(''));

	// 获取数据
	getAddressList();

	/*获取地址列表*/
	function getAddressList(){
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
					// if(res.data.length > 0){
					$('.moren').html('5465465464');
					var data = ''
					var index;
					var isDefault = 0;
					for (var i = 0; i < res.data.length; i++) {
						if(res.data[i].isDefault == 1){
							isDefault = 1;
							data = res.data[i];
							index = i;
						}
					}
					if(isDefault > 0){
						res.data.splice(index,1);
						res.data.unshift(data);
					}
					$('.lists').html(list(res.data));
					editAddress();

					// }else{
					// 	window.location.href = '../../../pages/shoppingMall/map/editAddress.html'+ window.location.search;
					// }
				}else{
					Common2.toast(res.message);
				}
			})
		})
	};

	/*删除地址*/
	function deleteAddress(addressId){
		$.ajax({
			url:Setting.apiRoot1 + '/u/deleteAddress.p2p',
				type:'POST',
				dataType:'json',
				data:{
					userId:userId,
					loginToken:loginToken,
					addressId:addressId
				}
			}).done(function(res){
			Common.ajaxDataFilter(res,function(res){
				if(res.code == 1){
					Common2.toast('删除成功');
					getAddressList();
				}else{
					Common2.toast(res.message);
				}
			})
		})
		
	}

	// 修改地址
	function editAddress(){
		$('.edit').on('click',function(){
			var addressId = $(this).data('id');
			var href = href || window.location.href;
			window.location.href = '../../../pages/shoppingMall/map/editAddress.html?addressId='+ addressId + window.location.search.replace('?','&');
		}); 
	}
	

	// 删除地址
	$('.delete').click(function(){
		var addressId = $(this).data('id');
		deleteAddress(addressId)
	});

	// 选择地址完成
	$('.mui-content').on('click',function(){
		var addressId = $(this).data('id');
		window.location.href = '../../../pages/shoppingMall/commodityExchange/exchange.html?addressId=' + addressId +window.location.search.replace('?','&');
	});
	
	// 添加地址
	$('.myAddress-button').on('click',function(){
		var href = href || window.location.href;
		window.location.href = '../../../pages/shoppingMall/map/editAddress.html'+window.location.search;
	});

	var wrap = document.getElementsByClassName('mui-inner-wrap');
	for(var i = 0; i < wrap.length; i++){
		wrap[i].addEventListener('touchstart',function (e) {
			startPositionX = event.touches[0].pageX

		},false);
		wrap[i].addEventListener('touchmove',function (e) {
			endPositionX = e.touches[0].pageX

		},false)
		wrap[i].addEventListener('touchend',function (e) {
			var index = $(this).data('index');
			var distance = startPositionX - endPositionX;
			if(distance > 50){
				$('.mui-inner-wrap').eq(index).animate({'left':'-2rem'},300)
				$('.edit').eq(index).css('display','none');
			}else{
				$('.mui-inner-wrap').eq(index).animate({'left':'0'},300)
				$('.edit').eq(index).css('display','block');
			}
		})
	}
	
})
