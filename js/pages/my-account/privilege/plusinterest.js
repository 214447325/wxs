$(function(){
		$.ajax({
		url:Setting.apiRoot1 +'/raisePrivilege.p2p',
		type:'POST',
		dataType:'json',
	}).done(function(res){
		console.log(res)
		if(res.code == 1){
			var n = 2;
			for (var i = res.data.length-1; i > 0; i--) {
				$('.interestNum').eq(i-2*n).html(parseFloat(res.data[i].VALUE).toFixed(1) + '%');
				n--;
			}
		}
	}).fail(function(){
		Common2.toast('网络连接失败！');
	})
})