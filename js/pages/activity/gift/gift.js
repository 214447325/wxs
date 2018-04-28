$(function(){
	
	  var imgurl = 'http://106.15.44.101/group1/M00/00/16/ag8sZVn5MmiAa5GyAAC58fH9yx0062.jpg';
      var title = 'V金融双11狂欢节';
      var desc = '这个双11，22周定期，尽享22%年化收益，加息不啰嗦！';
      var link = Setting.staticRoot + '/pages/activity/gift/coupon11.html';
      share.shareFixed(imgurl, title, desc, link, "888");
      var shareButton = $('.fenxiang');
	  Common.share(shareButton,'/pages/invite/giftfenxiang.html');
	  $('.button').on('click',function(){
        $.ajax({
            url:Setting.apiRoot1 + '/getCurrentRegularIdByLoanCycle.p2p',
            type:'GET',
            data:{
                loanCycle:22
            }
        }).done(function(res){
            if(res.code == 1){
                window.location.href = '../../financing/buy3.0.html?pid='+ res.data;
            }else{
                alert(res.message);
            }
        }).fail(function(){
             alert('网络连接失败')
        });
	  })
})