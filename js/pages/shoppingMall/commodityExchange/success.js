$(function(){
	var param = Common.getParam();
	var result = param.result;
	if(result == 2){
		$('.explain').html('我们将在10个工作日为您安排配送事宜<br/>如遇问题可致电4000521388');
		$('.regular').attr("href","javascript:window.location.href = './gift.html'+window.location.search;")
	}else if(result == 1){
		$('.explain').html('礼品已发放至您的账户中');
		$('.regular').attr("href","javascript:window.location.href = '../../my-account/reward/red-envelope.html'+window.location.search;")
	}
})