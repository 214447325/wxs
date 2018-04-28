$(function(){
	var payCode = sessionStorage.getItem('payCode');
    var bearingTime,endTime;
	if(sessionStorage.getItem('bearingTime') != undefined && sessionStorage.getItem('bearingTime') != undefined){
		bearingTime = sessionStorage.getItem('bearingTime').split('-');
    	endTime = sessionStorage.getItem('endTime').split('-');
	}
	/**
     *是否显示卡券礼包的图片
     */
    var carCouponsHtml = doT.template([
    		'<div style="width:100%;" class="giftCarCoupons"><img src="../../images/pages/financing/payresult/carCouponButton.png" style="width:100%;" /></div>'
    	].join(''));

	$('.wrapper').css('display','none');

    if(payCode == 1){
    	$('.wrapper').css('display','block');
    	$('.bearingTime').text(bearingTime[0]+'年'+bearingTime[1]+'月'+bearingTime[2] + '日开始计息');
    	$('.endTime').text('预计'+ endTime[0]+'年'+endTime[1]+'月'+endTime[2] + '日到期退出');
    	if(sessionStorage.getItem('giftCarCoupons') == 1){
			$('.wrapper').append(carCouponsHtml);
			$('.giftCarCoupons').on('click',function(){
				sessionStorage.removeItem('giftCarCoupons');
				window.location.href = '../../pages/my-account/reward/red-envelope.html';
			})
		}
    	return false;
    }

/*当前网络不稳定*/
    var wifi = doT.template([
		'<div id="wifi" style="text-align: center;padding: 1rem;color: #9B9B9B;font-size: 0.4266rem;line-height: 0.64rem;">',
			'<img src="../../images/pages/financing/payresult/wifi.png"/>',
			'<div>当前网络不稳定</div>',
			'<div>请稍后再试</div>',
		'</div>',
		'<div style="font-size:0.32rem;color:#9B9B9B;margin-top:5rem;text-align:center;">如有疑问请致电客服：<span style="color:#2B6FF9;">400-088-0888</span></div>'
	].join(''));

    if(payCode == -400){
    	$('body').append(wifi);
    	return false;
    }

    /*剩余可投金额不足*/
    var surplus = doT.template([
		'<div id="surplus" style="text-align: center;padding: 1rem;color: #9B9B9B;font-size: 0.4266rem;line-height: 0.64rem;">',
			'<img src="../../images/pages/financing/payresult/surplus.png"/>',
			'<div>产品剩余可投金额不足</div>',
			'<div>请返回重新选择</div>',
		'</div>',
		'<div style="font-size:0.32rem;color:#9B9B9B;margin-top:5rem;text-align:center;">如有疑问请致电客服：<span style="color:#2B6FF9;">400-088-0888</span></div>'
	].join(''));

    if(payCode == -5){
    	$('body').append(surplus);
    	return false;
    }

    /*已售馨*/
    var sellout = doT.template([
		'<div id="sellout" style="text-align: center;padding: 1rem;color: #9B9B9B;font-size: 0.4266rem;line-height: 0.64rem;">',
			'<img src="../../images/pages/financing/payresult/sellout.png"/>',
			'<div>抱歉，已售馨</div>',
			'<div>请返回重新选择</div>',
			'<a href="../../pages/financing/regular.html" style="width:4rem;height:1rem;display:inline-block;line-height:1rem;border-radius:0.15rem;border:0.0133rem solid #9B9B9B;margin-top:0.5rem;">重新选择</a>',
		'</div>',
		'<div style="font-size:0.32rem;color:#9B9B9B;margin-top:5rem;text-align:center;">如有疑问请致电客服：<span style="color:#2B6FF9;">400-088-0888</span></div>'
	].join(''));

    if(payCode == -6){
    	$('body').append(sellout);
    	return false;
    }
})