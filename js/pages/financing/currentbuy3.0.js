/**
 * currentbuy.js
 * 
 * @author zyx 
 * @return {[type]} [description]
 */

$(function() {
	sessionStorage.removeItem('buy-pro');
	var $buy = $('.page-buy');//body
	var $amount = $('.amount', $buy);//可投余额(标的余额)
	var $balanceAccount = $('.balanceAccount');//账户余额
	var $input = $('.input', $buy);//用户输入金额
	var $agreement = $('.agreement');//投资协议
	var $expectmoney = $('.expectmoney');//每月收益
	var $full= $('.full');//全额按钮 
	var $selfExtra = $('.selfExtra');//活动奖励
	$selfExtra.text(0);//奖励默认显示0
	var $joinActive=$('joinActive');//是否 参加邀请活动按钮 通过cla
	var ja = document.getElementById('joinActive');//是否 参加邀请活动按钮 通过ID
	var isJoinInvite = 0;// 默认参加活动 参加活动传1  不参加传0
	var $payMoney = $('.pay-money', $buy);//确定按钮
	var $ui_dialog = $('.ui-dialog');
	var $btn_link  = $('.btn-link',$ui_dialog);
	var $btn_default = $('.btn-default',$ui_dialog); 
	var userId = sessionStorage.getItem('uid');//userid
	//param
	var param = Common.getParam();
	var pid=param.pid;//产品ID

	//定义全局
	var pname;//title
	var pmount;//可投余额(标的余额)
	var maxInvestAmount;//最大投资金额
	var minInvestAmount;//最小起投金额
	var maxRate;//最大利率
	var minRate;//最小利率
	var act7;//是否参加邀请活动
	var accountAmt;//账户余额
	var money;//用户投资输入框的金额值
	var reback = 0;//默认自动续投
	var expect;//每月收益的值
	var isJoinInvite=0;//默认参加邀请活

    // 是否可以购买周周涨
	var currentEndTime;//结束时间
	var currentStartTime;//开始时间
	var currentTime;//服务器当前时间
	var currentStartTimeAlert;
	var cAmount;

	//参数不正确跳转首页
	if (!param.pid) {
		alert('参数有误！！');
		window.location.href = Setting.staticRoot + '/pages/index.html';
		return false;
	}

	//未登录前往登录页
	if (!userId) {
		Common.toLogin();
		return false;
	}

	//购买页面刷新接口
	!function(){
	$.ajax({
	  url: Setting.apiRoot1 + '/queryProductActions.p2p',
	  type: 'post',
	  async:false,
	  dataType: 'json',
	  data: {
	    loanId: pid
	  }
	}).done(function(res){
	  Common.ajaxDataFilter(res, function(data){
	    if(res.code == 1){
	    var data=res.data;
		pname=data.prodTitle;//title
		// pmount=parseFloat(data.canBuyAmt);//可投余额(标的余额)
		maxInvestAmount = parseFloat(data.maxBuyAmt);//最大投资金额
		minInvestAmount =parseFloat(data.minBuyAmt);//最小起投金额
		maxRate=data.maxRate;//最大利率
		minRate=data.minRate;//最小利率
		act7=data.act7;//是否参加邀请活动
		$.ajax({
			  url: Setting.apiRoot1 + '/checkHuoQiBuyStatus.p2p',
			  type: 'post',
			  async:false,
			}).done(function(res){
				console.log(res);
				if(res.code == 1){
					var dataCurrent = res.data;
					var date = new Date();
	                var fullYear= date.getFullYear();
	                var month= date.getMonth() + 1;
                	var day= date.getDate();	
	                currentStartTimeAlert = dataCurrent.currentStartTime;
	                currentEndTime = new Date(fullYear +'/'+ month +'/'+day+' '+dataCurrent.currentEndTime).getTime();//结束时间
	                currentStartTime = new Date(fullYear +'/'+ month +'/'+day+' '+dataCurrent.currentStartTime).getTime();//开始时间
	                currentTime = new Date(fullYear +'/'+ month +'/'+day+' '+dataCurrent.currentTime).getTime();//服务器当前时间
	                cAmount = dataCurrent.currentVoteAmt;//可投余额
	                if(null != cAmount && '' != cAmount && undefined != cAmount) {
	                	pmount = parseFloat(cAmount);
	                    // $('.current_amount').html((Common.comdify(parseFloat(cAmount).toFixed(2))));
	                } else {
	                	pmount = 0;
	                    // $('.current_amount').html(0);
	                }
                	setInterval(function(){
	                    currentTime += 1000;
	                    var btnClolor = $('.pay-money').css('background');
	                    var btnText = $('.pay-money').text();
	                    // 可以购买的情况
	                    if ((currentStartTime < currentTime) &&  (currentTime <  currentEndTime)) {
	                    	if(parseFloat(cAmount) > 0){
	                    		if(btnClolor != '#6C6FFF'){
		                        	$('.pay-money').css('background','#6C6FFF');
		                    	}
		                    	if(btnText != '立即抢购'){
		                    		$('.pay-money').text('立即抢购');
		                    	}
	                    	}else{
                				if(btnClolor != '#CBCBCB'){
		                        	$('.pay-money').css('background','#CBCBCB');
		                    	}
		                    	if(btnText != '今日已售罄'){
		                    		$('.pay-money').text('今日已售罄');
		                    	}
	                    	}
	                    }else {
	                        if(currentStartTime > currentTime){//未开始
	                        	if(btnClolor != '#CBCBCB'){
		                        	$('.pay-money').css('background','#CBCBCB');
		                    	}
		                    	if(btnText != '立即抢购'){
		                    		$('.pay-money').text('立即抢购');
		                    	}
	                        }else if(currentEndTime < currentTime){//已结束
	                        	if(btnClolor != '#CBCBCB'){
		                            $('.pay-money').css('background','#CBCBCB');
		                    	}
		                    	if(btnText != '今日已结束'){
		                    		$('.pay-money').text('今日已结束');
		                    	}
	                        }
	                    }
	                },1000);
	                
				}
			})


	    }
	  });
	}).fail(function(){
	  alert('网络链接失败，请刷新重试！');
	  return false;
	});
	}();  

	 //检查是否设置交易密码
	!function() {
		$.ajax({
			url : Setting.apiRoot1 + '/u/checkUserInfo.p2p',
			type : 'post',
			dataType : 'json',
			data : {
				userId : userId,
				type : 2,
				loginToken : sessionStorage.getItem('loginToken')

			}
		}).done(
				function(res) {
					Common.ajaxDataFilter(res, function(data) {
						if (data.code == -3) {
							alert(data.message);
							$('.pay-money').addClass('disabled btn-gray').removeClass('btn-default');
							return false;
						}
					});
				}).fail(function() {
			alert('网络链接失败，请刷新重试！');
			return false;
		});
	}();
	// 我的账户信息总览 获取账户余额
	!function() {
		$.ajax({
		url:Setting.apiRoot1 + '/u/queryMyAccountInfo.p2p',
		type:"post",
		async:false,
		dataType:'json',
		data:{
			userId: userId,
			loginToken:sessionStorage.getItem('loginToken')
		}
		}).done(function(res){
		Common.ajaxDataFilter(res,function(){
		  if(res.code==1){
		    var data = res.data;
		    accountAmt=data.accountAmt;//账户余额
		  }else{
		    alert(res.message);
		      return false;
		  }
		})
		}).fail(function(){
		alert('网络链接失败');
		return false
		});  
	}();
	//设置页面显示数据
	!function() {
		$amount.text(Common.comdify(pmount.toFixed(2)));//设置页面可投余额(标的余额)
		$balanceAccount.text(Common.comdify(accountAmt.toFixed(2)));//显示账户余额
		$input.attr('placeholder', '起投金额' +minInvestAmount /* +'的整数倍' */);//投资输入框起投金额
	}();
	
	$buy.on('click','input[name="joinActiveChk"]',function() {
		if (ja.checked == true) {//参加活动
			// alert(ja.checked);
			ja.style.backgroundImage = "url('../../images/pages/financing/current3.0/ifJoin.png')";
			isJoinInvite = 1;
		} else {//不参加
			// alert(ja.checked);
			ja.style.backgroundImage = "url('../../images/pages/buy7day_bg.png')";
			isJoinInvite = 0;
			// $selfExtra.html('勾选参加邀请活动会获得活动奖励');
		}

	});

	$('.dialog-close').on('click',function(){
	    $ui_dialog.addClass('hide');
	});            

    // 点击购买全额   用户输入金额=账户余额  
	$full.on('click',function(){
		$input.val(accountAmt);
	          if (accountAmt>pmount) {//账户余额>标的余额
	          		alert('投资金额不能大于周周涨可投余额'+pmount);
	          		$input.val(pmount);
	          	}else if(accountAmt>maxInvestAmount){//最大投资金额<账户余额<标的余额
			alert('最大投资金额为'+maxInvestAmount);
			$input.val(maxInvestAmount);
	          	}else if(accountAmt<minInvestAmount){//账户余额<起投
		            $ui_dialog.removeClass('hide');
		            $btn_link.attr('href',Setting.staticRoot + '/pages/my-account/topup-cash.html');
		            $btn_default.attr('onclick','window.location.reload();');
		            return false;
	          	}
		money=$.trim($input.val());
	          	
	           if (reback==1) {//不续投
		     expect=(money*7/365*0.0888).toFixed(2);
		 }else{//默认续投
		     	 expect=(money*7/365*(0.0888+0.0898+0.0910+0.0924)+money*2/365*0.0942).toFixed(2);
		 }
	  	$expectmoney.html(expect);   //每月收益
	  	active();
	});

	//键盘弹起事件
	$input.on('keyup',function(){
	    	money = $.trim($input.val());//输入金额
	          if (money>pmount) {//输入金额>标的余额
	          		alert('投资金额不能大于可投余额'+pmount);
	          		$input.val(' ');
	          		//$input.val(pmount);
                  $('.expectmoney').html('0.00');
                  return false;
	          	}
	          	if(money>maxInvestAmount){//输入金额>最大投资金额
                    alert('最大投资金额为'+maxInvestAmount);
                    $input.val(' ');
                    $('.expectmoney').html('0.00');

                    //$input.val(maxInvestAmount);
                    return false;
	          	}
	           if (reback==1) {//不续投
		     expect=(money*7/365*0.0888).toFixed(2);
		 }else{//默认续投
		     	 expect=(money*7/365*(0.0888+0.0898+0.0910+0.0924)+money*2/365*0.0942).toFixed(2);
		 }
	  	$expectmoney.html(expect);   //每月收益
	  	active();
	});

	function active(){
		money = $('.input').val();
	          if(money<1000){
			selfExtra = 0;
		}else if(money<5000){
			selfExtra = 0.4;
		}else if(money<10000){
			selfExtra = 2;
		}else if(money<20000){
			selfExtra = 4;
		}else if(money<30000){
			selfExtra = 8;
		}else if(money<60000){
			selfExtra = 16;
		}else if(money<100000){
			selfExtra = 33;
		}else if(money<200000){
			selfExtra = 66;
		}else if(money<500000){
			selfExtra = 166;
		}else if(money<800000){
			selfExtra = 500;
		}else if(money<1000000){
			selfExtra = 833;
		}else{
			selfExtra = 888;
		}
		$selfExtra.text(selfExtra);
	    }

	// 充值跳转
	$buy.on('click','.rechargeBtn',function() {
		window.location.href = Setting.staticRoot + '/pages/my-account/topup-cash.html' ;
						  
	});

	//点击确定按钮
	$buy.on('click', '.pay-money', function() {
		if(!userId){
            Common.toLogin();
            return false;
        }
		if (currentStartTime <= currentTime &&  currentTime <=  currentEndTime) {//可以抢购
			if(parseFloat(cAmount) > 0){
				var $this = $(this);
				if ($this.hasClass('disabled')) {
					return false;
				}
				money = $.trim($input.val());
				if (money <= 0) {
					alert('输入的金额需大于0元');
					$input.val('');
					return false;
				}
				if (!Common.reg.money.test(money)) {
					alert('输入金额无效！');
					$input.val('');
					return false;
				}
				if (isJoinInvite==1 && money<1000){
					alert('参加邀请活动起投金额1000元');
					$input.val('');
					return false;			
				}
				if (money < minInvestAmount) {
					alert('投资金额不能小于起投金额'+minInvestAmount+'元');
					$input.val('');
					return false;
				}
				if (parseFloat(money) >accountAmt) {
		            $ui_dialog.removeClass('hide');
		            $btn_link.attr('href',Setting.staticRoot + '/pages/my-account/topup-cash.html');
		            $btn_default.attr('onclick','window.location.reload();');
		            return false;
				}
				if (parseFloat(money) >pmount.toFixed(2)) {
					alert('投资金额不能大于剩余可购余额');
					$input.val('');
					return false;
				}
				if (parseFloat(money) <minInvestAmount.toFixed(2)) {
					alert('投资金额不能小于最小可投金额');
					$input.val('');
					return false;
				}
				if (parseFloat(money) >maxInvestAmount.toFixed(2)) {
					alert('投资金额不能大于单笔最大投资额' +maxInvestAmount);
					$input.val('');
					return false;
				}

				var post = {
					investAmt : money,
					prodId : pid
				}
				sessionStorage.setItem('buy-pro', JSON.stringify(post));
				window.location.href = 'pay-current.html?reback=' + reback+'&isJoinInvite=' + isJoinInvite;

			}else{
				alert('今日已售罄，明天再来吧');
			}
		}else{
			if(currentStartTime > currentTime){//未开始
            alert('客官，抢购'+ currentStartTimeAlert +'开始哦');
	        }else if(currentEndTime < currentTime){//已结束
	           alert('今日已结束，明天再来吧');
	        }
        }
	}).on('click', '.recharge', function() {
				var $this = $(this);

				if ($this.hasClass('disabled')) {
					return false;
				}

			});
	//周周涨页面明细规则点击查看
	$('.Bonusrules').click(function(event) {
	       $('.maskLayer').css('display','block');
		   $('#center').removeClass('center').addClass('centerOpen');
		   $('.close').click(function(event) {
		        $('.maskLayer').css('display','none');
		        $('#center').removeClass('centerOpen').addClass('center');
		   })
	}); 
	//周周涨购买协议点击跳转
	$agreement.on('click',  function(){
		var fullName = sessionStorage.getItem('realname');
		  var showName = "***";
		  if(fullName==null || fullName==undefined || fullName.length<1){
			  alert('姓名错误：'+fullName);
		  }else{
			  var fisrtName = fullName.substr(0,1);
			  if (fullName.length==2) {
				  showName = fisrtName+'*';
			  }else if(fullName.length==3){
				  showName = fisrtName+'**';
			  }else if(fullName.length==4){
				  showName = fisrtName+'***';
			  }//名字
		  }
		  var fullPhone = sessionStorage.getItem('uname');
		  var phoneNum = "***********";
		  if(fullPhone==null || fullPhone==undefined || fullPhone.length<11){
			  alert('手机号错误：'+fullPhone);
		  }else{
			  var _hide_number = fullPhone.substr(3,4);
			  phoneNum = fullPhone.replace(_hide_number,'****');//手机
		  }
		  
		  var fullCertNo = sessionStorage.getItem('cardNum');
		  var cardNum = "***************";
		  if(fullCertNo==null || fullCertNo==undefined || fullCertNo.length<15){
			  alert('身份证号错误：'+cardNum);
		  }else{
			  var _front_cardnum = fullCertNo.substr(0,3);
			  var _last_cardnum = fullCertNo.substr(14,4);
			  cardNum = _front_cardnum+'***********'+_last_cardnum;//身份证
		  }
	          
       window.location.href = "7day-agreement.html?uName="+showName+"&uMobile="+phoneNum+"&uSFZ="+cardNum;
     });

	   //隐藏显示活动细则
	   $('.content-Img').click(function(data) {
	    $('.juzhong').hide();
	  //  $('.maskLayer').attr({'disabled': 'false'})
	    $('.maskLayer').css({'display': 'none'});
	});

	$('#Bonusrules').click(function(data) {
	    $('.juzhong').show();
	});	
});
