$(function(){
	var param = Common.getParam();
	var loanId = param.pid;
	// var investCycle=param.investCycle;


	//购买页面刷新接口 取浮动产品的最新净值
	$.ajax({
	  url: Setting.apiRoot1 + '/queryProductActions.p2p',
	  type: 'post',
	  async:false,
	  dataType: 'json',
	  data: {
	    loanId: loanId
	  }
	}).done(function(res){
	  Common.ajaxDataFilter(res, function(data){
	    if(data.code == 1){
	    	var data=res.data;
	    	console.log(data);
	    	loanCycle=data.loanCycle;
	             $('#investCycle').html(loanCycle);
	    }
	  });
	}).fail(function(){
	  alert('网络链接失败，请刷新重试！');
	  return false;
	});


});