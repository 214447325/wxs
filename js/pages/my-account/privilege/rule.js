$(function(){
	$.ajax({
		url:Setting.apiRoot1 +'/vipDetailList.p2p',
		type:'POST',
		dataType:'json'
	}).done(function(res){
		Common.ajaxDataFilter(res,function(){
			if(res.code == 1){
				var n = 2;
				for (var i = 0; i < res.data.length; i++) {
					switch(res.data[i].rank){
						case '1':
							$('.InvestTotal').eq(3).html('≥' + Common.comdify(res.data[i].minInvestTotal));
							$('.AnnualizedAssets').eq(3).html('≥' + Common.comdify(res.data[i].minAnnualizedAssets));
							break;

						case '2':
							$('.InvestTotal').eq(2).html('≥' + Common.comdify(res.data[i].minInvestTotal));
							$('.AnnualizedAssets').eq(2).html('≥' + Common.comdify(res.data[i].minAnnualizedAssets));
							break;

						case '3':
							$('.InvestTotal').eq(1).html('≥' + Common.comdify(res.data[i].minInvestTotal));
							$('.AnnualizedAssets').eq(1).html('≥' + Common.comdify(res.data[i].minAnnualizedAssets));
							break;

						case '4':
							$('.InvestTotal').eq(0).html('≥' + Common.comdify(res.data[i].minInvestTotal));
							$('.AnnualizedAssets').eq(0).html('≥' + Common.comdify(res.data[i].minAnnualizedAssets));
							break;
					}
					

				}
			}
		})
	}).fail(function(){
		Common2.toast('网络连接失败！');
	})

})