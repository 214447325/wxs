$(function(){
	var param = Common.getParam();
	var id = param.goodsId;
	var stock = param.stock;
	if(stock>0){
		$('.button').addClass('button2')
	}
	$.ajax({
		url: Setting.apiRoot1 + '/getProdInfo/'+ id+'.p2p',
		type: 'get',
		dataType: 'json',
		async:false,
	}).done(function(res){
		Common.ajaxDataFilter(res,function(){
			if(res.code == 1){
				console.log(res)
				var data = res.data;
				$('.bannerImg').attr('src',data.imageUrl);
				$('.goodsName').html(data.prodName);
				$('.integral').html(data.score + '积分');
				$('.details').html(data.content);
				
				if(data.prodType == 1){
					$('.price').html('');
				}else{
					$('.price').html('参考价：¥' + data.amount);
				}
			}else{
				Common2.toast(res.message);
			}
		})
	}).fail(function(){
		alert('网络链接失败');
	});

	$('.button').on('click',function(){
		if(!$(this).hasClass('button2')){
			Common2.toast('商品库存不足')
		}else{
			window.location.href = '../../../pages/shoppingMall/commodityExchange/exchange.html' + window.location.search;
		}
	})
})