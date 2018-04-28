/**
 * zyx 
 * 我的邀请主页
 **/
$(function(){
	
  var visiturl = location.search; //获取url中"?"符后的字串
  var param2 = {};
  if (visiturl.indexOf("?") != -1) {
     var str = visiturl.substr(1);
     strs = str.split("&");
     for(var i = 0; i < strs.length; i ++) {
        param2[strs[i].split("=")[0]] = decodeURIComponent(strs[i].split("=")[1]);
     }
  }
	  
  var next = param2.next;
  if(next==1){
	  ucode = param2.code;
	  phone = param2.phone;
	  alert(ucode);
	  window.location.href = Setting.staticRoot + '/pages/invite/noice_register.html?code='+ucode+'&phone='+phone;
  }
	  
  var $myinviteIndex = $('.mainIndex');
  
  //var $listmore=$('.listmore');
  var $moneylist = $('.moneylist');
  var $invitelist = $('.invitelist');
  
  var $myname = $('.myname');
  var $accountInvite = $('.accountInvite');
  var $accountMoney = $('.accountMoney');
  var $numberprize = $('.numberprize');
  var $moneyprize = $('.moneyprize');
  var $alreadyNum = $('.alreadyNum');
  var $newNum = $('.newNum');

  var userId = sessionStorage.getItem('uid');
  if(!userId){
    Common.toLogin();
    return false;
  }

  var code = sessionStorage.getItem('ucode');//自己的邀请码
  var relation = sessionStorage.getItem('relation');//1是绑定  0是没有绑定

  $inviteCode = $('.inviteCode');
  $inviteCode.html(code);
  $bindInvitation = $('.bindInvitation');  
  $bind = $('.bind');
  if(relation=='1'){
    $bindInvitation.html('已绑定');
    $bind.attr('href', '../../../pages/my-account/setting/binding-people.html?userId=' + userId);
  }else{
    $bindInvitation.html('未绑定');
    $bind.attr('href', '../../../pages/my-account/setting/binding-invitation.html');
  }

  var myname=sessionStorage.getItem('realname');
  var nameLength=myname.length;
  var myName=myname.substring(nameLength-1,nameLength);
  var fullName;
  if (nameLength==2) {
  fullName='*'+myName;
  }else if(nameLength==3){
  fullName='**'+myName;
  }else{
  fullName='***'+myName;
  }
  $myname.html("&nbsp;&nbsp;&nbsp;&nbsp;"+fullName+ "&nbsp;&nbsp;您的邀请成果");
  var selectTab = "";

    var html = '';
    var _html = '';
    var $showInvitelist = $('.showInvitelist');
  $.ajax({
      url: Setting.apiRoot1 + '/u/inviteFriendDetailNew.p2p',
      type: 'post',
      dataType: 'json',
      data: {
        userId : userId,
        loginToken:sessionStorage.getItem('loginToken')
      }
    }).done(function(res){
        Common.ajaxDataFilter(res,function(){
            if(res.code == -1){
              alert('查询失败');
              return false;
            }

           if(res.code != 1) {
               alert(res.message);
               return false;
           }
          var _inviteHtml = '';
          var $headerRecord = $('.headerRecord');
        if(res.data.cashBonus != null  && res.data.cashBonus != '' &&  res.data.cashBonus != undefined && res.data.cashBonus > 0) {
            _inviteHtml = '<div class="contentcol" style="width: 30%;">' +
                            '<div class="content1">' +
                            '<div class="inviteCount peopleCount accountInvite">' + res.data.count + '</div>' +
                            '<div class="inviteContent">已邀请好友 (人)</div>' +
                            '</div>' +
                            '<a class="content1" href="myinvite-rankinglist.html?page=nlist" >' +
                            '<div class="inviteList">邀请排行榜</div>' +
                            '<div class="list" id="nlist"><span class="listSpan peopleRanking numberprize">' + res.data.userList + '</span>名></div>' +
                            '</a>' +
                            '</div>' +
                            '<div class="fgImg">' +
                            '<img src="../../../images/pages/invite3.0/fg3.0.png" class="img1">' +
                            '</div>' +
                            '<div class="contentcol" style="width: 30%; margin: 0 0.2rem">' +
                            '<div class="content1">' +
                            '<div class="inviteCount money accountMoney">' + res.data.sumUserRelation + '</div>' +
                            '<div class="inviteContent">累计奖励现金 (元)</div>' +
                            '</div>' +
                            '<a class="content1" href="myinvite-rankinglist.html?page=mlist" >' +
                            '<div class="inviteList">奖励现金排行榜</div>' +
                            '<div class="list" id="mlist"><span class="listSpan moneyRanking moneyprize">' + res.data.rewardList + '</span>名></div>' +
                            '</a>' +
                            '</div>' +
                            '<div class="fgImg">' +
                            '<img src="../../../images/pages/invite3.0/fg3.0.png" class="img1">' +
                            '</div>' +
                            '<div class="contentcol" style="width: 30%;">' +
                            '<div class="content1">' +
                            '<div class="inviteCount peopleCount accountInvite">' + res.data.cashBonus + '</div>' +
                            '<div class="inviteContent">累计分红 (元)</div>' +
                            '</div>' +
                            '<a class="content1" href="myinvite-rankinglist.html?page=cashBonusList" >' +
                            '<div class="inviteList">分红排行榜</div>' +
                            '<div class="list" id="cashBonusList"><span class="listSpan peopleRanking numberprize">' + res.data.cashBonusSort + '</span>名></div>' +
                            '</a>' +
                            '</div>';
        } else {
            _inviteHtml = '<div class="contentcol">' +
            '<div class="content1">' +
            '<div class="inviteCount peopleCount accountInvite">' + res.data.count + '</div>' +
            '<div class="inviteContent">已邀请好友 (人)</div>' +
            '</div>' +
            '<a class="content1" href="myinvite-rankinglist.html?page=nlist" >' +
            '<div class="inviteList">邀请排行榜</div>' +
            '<div class="list" id="nlist"><span class="listSpan peopleRanking numberprize">' + res.data.userList + '</span>名></div>' +
            '</a>' +
            '</div>' +
            '<div class="fgImg">' +
            '<img src="../../../images/pages/invite3.0/fg3.0.png" class="img1">' +
            '</div>' +
            '<div class="contentcol">' +
            '<div class="content1">' +
            '<div class="inviteCount money accountMoney">' + res.data.sumUserRelation + '</div>' +
            '<div class="inviteContent">累计奖励现金 (元)</div>' +
            '</div>' +
            '<a class="content1" href="myinvite-rankinglist.html?page=mlist" >' +
            '<div class="inviteList">奖励现金排行榜</div>' +
            '<div class="list" id="mlist"><span class="listSpan moneyRanking moneyprize">' + res.data.rewardList + '</span>名></div>' +
            '</a>' +
            '</div>';
        }

          $headerRecord.html(_inviteHtml);
        var alist = res.data.alreadyInvestUser;
        var nlist = res.data.noInvestUser;
        if(alist!=null){
        	//$alreadyNum.html("已投资好友"+alist.length+"人");
        	 html = "";
        	for(var i=0;i<alist.length;i++){
        		html+=' <div class="invitefriendsTr invitelist">' +
                '<div class="name">'+alist[i].subName
        		+'</div><div class="phone">'+alist[i].phoneNum
        		+'</div><div class="cumulative">注册时间'+alist[i].registTime
        		+'</div></div>';
        	}
        	$showInvitelist.html(html);
        }
        if(nlist!=null){
        	$newNum.html("未投资好友"+nlist.length+"人");
        	 _html = "";
        	for(var i=0;i<nlist.length;i++){
        		_html+='<div class="invitefriendsTr invitelist">' +
                '<div class="name">'+nlist[i].subName
        		+'</div><div class="phone">'+nlist[i].phoneNum
        		+'</div><div class="cumulative">注册时间'+alist[i].registTime
        		+'</div></div>';
        	}
        }
        
      })
    }).fail(function(){
      alert('网络链接失败');
    });


    var $hasInvestment = $('.investedFriends');//已投资按钮
    var $noInvestend = $('.noInvestend');//未投资好友
    var $returnPage = $('.returnImg');//返回上一页按钮
    //$hasInvestment.click(function() {
    //    $(this).addClass('blue');
    //    $noInvestend.removeClass('blue');
    //    $showInvitelist.html(html);
    //});

    $noInvestend.click(function() {
        $(this).addClass('blue');
        $hasInvestment.removeClass('blue');
        $showInvitelist.html(_html);
    });

    $returnPage.click(function() {
        window.location.href = Setting.staticRoot + '/pages/index.html';
    });

    // Event
    //$invitelist.removeClass('hide');
    //$moneylist.addClass('hide');
    //
    //$myinviteIndex.on('click', '.rewardTable a', function(){
    //  var $this = $(this);
    //  $this.addClass('active').siblings('.active').removeClass('active');
    //  var target= $this.data('target');
    //  $('.' + target).removeClass('hide').siblings('.block-items').addClass('hide');
    //  selectTab = target;
    //
    //});
    
    
    var url = window.location.href.split("#")[0];
    var imgurl = Setting.imgRoot + '/wx/pages/invitelogo.png';
    var shareId = "888";
    var info = {
        url:url
    };
    
    var one = {
  		  	title: 'V金融福利大放送，现金、红包、豪礼等你拿！',
  		  	desc: '邀请朋友送壕礼！',
  		    link: url,
  		    imgUrl: imgurl
//  		      success:success
  		  };

    var all = {
    	title: 'V金融福利大放送，现金、红包、豪礼等你拿！',
        link: url,
        imgUrl: imgurl
//  		      success:success
    };
    

    var $body = $('body')
    var shareTemplate = [
    '<a class="share" href="javascript:;">',
      '<i class="share_pic"></i>',
    '</a>'
    ].join('');
    
    var messagingIframe;
    messagingIframe = document.createElement('iframe');
    messagingIframe.style.display = 'none';
    document.documentElement.appendChild(messagingIframe);
    
    $body.on('click', '.share', function(event) {
        $(this).remove();
      });
    
    $('.friends-btn').click(function(){
	  //event.stopPropagation(); 加上之后就不能点击
      (!$('.share').length>0)  && $body.append(shareTemplate);
        
      //获取分享信息
  	  $.ajax({
  	      url: Setting.apiRoot1 + '/getShare.p2p?shareId='+shareId,
  	      type: 'GET',
  	      dataType: 'json',
  	      async: true
  	    }).done(function(res) {
  	      if (res.code == 1) {
  		        one.title=res.data.title;
  		        one.desc=res.data.content;
  		        all.title=res.data.title;
  		        all.desc=res.data.content;
              one.imgUrl = res.data.image;
              all.imgUrl = res.data.image;
  		        wxshare();
              var linkurl = res.data.url;
  		        //邀请码获取
  	      	    $.ajax({
	      	        url: Setting.apiRoot1 + '/u/getInviteCode.p2p',
	      	        type: 'post',
	      	        dataType: 'json',
	      	        data: {
	      	          type: 1,
	      	          userId: userId,
	      	          loginToken:sessionStorage.getItem('loginToken')
	      	        }
	      	      }).done(function(res){
	      	          if(res.code == 1){
	      	          	var ucode = res.data.code;
	      	            var phone = res.data.phone;
//  		      	          	sessionStorage.setItem("ucode", ucode);
//  		      	          	sessionStorage.setItem("uname", phone);

                          if (linkurl.indexOf("?") != -1) {
                              linkurl = linkurl +"&";
                          }else{
                              linkurl = linkurl +"?";
                          }
	      	          	one.link = linkurl+"code="+ucode + "&phone="+phone+"&next=1";
	      	          	all.link = linkurl+"code="+ucode + "&phone="+phone+"&next=1";
                      }else{
	      	            alert(data.message);
	      	            return false;
	      	          }

	      	      }).fail(function(){
	      	        alert('网路异常，请刷新重试!');
	      	        return false;
	      	      });
  	      }
  	    }).fail(function() {
  	      alert('网络链接失败，请刷新重试！');
  	      return false;
  	    });
    	

     });
    
    function wxshare(){
      	$.ajax({
              url: Setting.apiRoot1 + '/wx/jsInfo.p2p',
              type: 'GET',
              dataType: 'json',
              data: {"param": JSON.stringify(info)},
              async: true
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
            	  /*alert(res.code);*/
              }
              
            }).fail(function() {
              alert('网络链接失败，请刷新重试！');
              return false;
            });
      }

});


