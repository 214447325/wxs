$(function(){
	var param = Common.getParam();
	var userId = sessionStorage.getItem('uid');
    var loginToken = sessionStorage.getItem('loginToken');
    // 手机登录
    var type = param.type;
    if(type != null && type != undefined && type > 0){
        if(param.uid != null && param.uid != undefined && param.uid != 'null' && param.uid.length>0){
          userId = param.uid;
          sessionStorage.setItem('uid',param.uid);
        }
        if(param.loginToken != null && param.loginToken != undefined && param.loginToken != 'null' && param.loginToken.length>0){
          loginToken = param.loginToken;
          sessionStorage.setItem('loginToken',param.loginToken);
        }
    }
	// 分享
	 var imgurl = 'http://106.15.44.101/group1/M00/00/16/ag8sZVoM8iCACuIoAABXj3lEZCg928.jpg';
  	var title = 'V金融红包欢乐颂';
  	var desc = '投资逢千返10元现金红包，无限领取！';
  	var link = Setting.staticRoot + '/pages/activity/redPacket/redPacket.html';
  	share.shareFixed(imgurl, title, desc, link, "888");
  	var shareButton = $("#share");
  	Common.share(shareButton,'/pages/invite/redPacketfenxiang.html');
  	// 规则
  	$('.rule').on('click',function(){
        $('.guize').css('display','block')
    })
  	$('.closeguize').on('click',function(){
        $('.guize').css('display','none');
    });
    //接口
    if(!!userId){
      $.ajax({
      	url:Setting.apiRoot1 + '/u/queryAddInvestPRP.p2p',
      	dataType:'json',
      	type:'get',
      	data:{
      		userId:userId,
      		loginToken:loginToken
      	}
      }).done(function(res){
      	Common.ajaxDataFilter(res,function(res){
      		if(res.code == 1){
      			var data = res.data;
  				$('.money').eq(0).html(data.amtYear30);
  				$('.money').eq(1).html(data.amtYear92);
  				$('.red').html(data.amtYear30 - data.amtYear92);
      			if(data.redPkg*1 != 0){
      				$('.noMoney').css('display','none');
      				$('.redMoney').css('display','block');
      				$('.redMoney').html(data.redPkg + '<div>元</div>');
      			}
      		}
      	})
      }).fail(function(res){
      	alert('网络链接失败');
          return false
      })
    }
});
