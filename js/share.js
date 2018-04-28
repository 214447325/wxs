(function () {

	var share_active = $('.share_active').val();
	var $share_url =  $('.share_url');
	
    var url = window.location.href.split("#")[0];
    var userId = sessionStorage.getItem('uid');
    var imgurl = Setting.imgRoot + '/upload/logo/logo.png';
    var shareId = "";
    var loginToken = sessionStorage.getItem('loginToken') || param.loginToken;
    var ucode = sessionStorage.getItem('ucode') || param.ucode;
    var phone = sessionStorage.getItem('uname') || param.phone;
    

    if(share_active==2){
    	//url = $share_url.val();
    	shareId = "888";
    }
    
    var info = {
        url:url
    };
    
    
    function success(){
        $.ajax({
          url: Setting.apiRoot1 + '/u/shareActivity.p2p',
          type: 'post',
          dataType: 'json',
          data: {
            userId: userId,
            type: 1,
            loginToken:loginToken
          }
        }).done(function(res) {
        	alert(res.message);
            return false;
          }).fail(function(res){
        	  alert('网络链接失败，请刷新重试！');
              return false;
        });
     }
    
    var one = {
    	title: 'V金融福利大放送，现金、红包、豪礼等你拿！',
    	desc: '邀请朋友送壕礼！',
        link: url,
        imgUrl: imgurl
//        success:success
    };
	   
    var all = {
    	title: 'V金融福利大放送，现金、红包、豪礼等你拿！',
        link: url,
        imgUrl: imgurl
//        success:success
    };
    
    if(share_active==2){
  	  if(ucode==null || ucode ==''){
  		//获取自己的邀请码
  	    $.ajax({
  	        url: Setting.apiRoot1 + '/u/getInviteCode.p2p',
  	        type: 'post',
  	        dataType: 'json',
  	        data: {
  	          type: 1,
  	          userId: userId,
  	          loginToken:loginToken
  	        }
  	      }).done(function(res){
  	        Common.ajaxDataFilter(res, function(data){
  	          if(data.code == 1){
  	          	ucode = data.data.code;
  	            phone = data.data.phone;
  	          	sessionStorage.setItem("ucode", ucode);
  	          	sessionStorage.setItem("uname", phone);
  	          	one.link = url+"?code="+ucode + "&phone="+phone + "&next=1";
  	          	all.link = url+"?code="+ucode + "&phone="+phone + "&next=1";
  	          }else{
  	            alert(data.message);
  	            return false;
  	          }
  	        });
  	      }).fail(function(){
  	        alert('网路异常，请刷新重试!');
  	        return false;
  	      });
  	  }else{
  		  one.link = url+"?code="+ucode + "&phone="+phone + "&next=1";
	      all.link = url+"?code="+ucode + "&phone="+phone + "&next=1";
  	  }
  	  
		one.title="邀请好友送壕礼";
	    one.desc="V金融开放邀请活动，邀请好友送壕礼";
	    
	    all.title="邀请好友送壕礼";
	    all.desc="V金融邀请活动，邀请好友送壕礼!";
	    
    }else{
		one.success = success;
    	all.success = success;
    	 $.ajax({
	        url: Setting.apiRoot1 + '/getShare.p2p',
	        type: 'GET',
	        dataType: 'json',
	        shareId : shareId,
	        async: false
	      }).done(function(res) {
	        if (res.code == 1) {
		        one.title=res.data.title;
		        one.desc=res.data.content;
		        all.title=res.data.title;
		        all.desc=res.data.content;
	        }
	      }).fail(function() {
	        alert('网络链接失败，请刷新重试！');
	        return false;
	      });
    }
   
    
    function wxshare(){
//    	alert(one.link);
//    	alert(one.title);
//    	alert(one.desc);
    	$.ajax({
            url: Setting.apiRoot1 + '/wx/jsInfo.p2p',
            type: 'GET',
            dataType: 'json',
            data: {"param": JSON.stringify(info)},
            async: false
          }).done(function(res) {
        	
            if (res.code == 1) {
            	var data = res;
            	
            	wx.config({
            		debug: false,
                    appId: data.appId,
                    timestamp: data.timestamp,
                    nonceStr: data.nonceStr,
                    signature: data.signature,
                    jsApiList: [
                        // 所有要调用的 API 都要加到这个列表中
                        'checkJsApi',
                        'onMenuShareTimeline',
                        'onMenuShareAppMessage',
                        'onMenuShareQQ',
                        'onMenuShareWeibo',
                        'hideMenuItems',
                        'showMenuItems',
                        'hideAllNonBaseMenuItem',
                        'showAllNonBaseMenuItem',
                        'getNetworkType',
                        'openLocation',
                        'getLocation',
                        'hideOptionMenu',
                        'showOptionMenu',
                        'closeWindow'
                    ]
                });
            	
                wx.ready(function () {
                    wx.onMenuShareAppMessage(one);
                    wx.onMenuShareTimeline(all);
                    wx.onMenuShareQQ(one);
                    wx.onMenuShareWeibo(one);
                });

            }else{
        	  //alert(res.code);
            }
            
          }).fail(function() {
            alert('网络链接失败，请刷新重试！');
            return false;
          });
    	
    }
    
    wxshare();
    
})();
