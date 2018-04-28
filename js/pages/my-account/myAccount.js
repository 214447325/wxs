/*
* @Author: User
* @Date:   2016-08-31 17:18:19
* @Last Modified by:   User
* @Last Modified time: 2017-03-06 10:32:02
*/

$(function(){
	var isWeiXin = Common.isWeiXin();//微信进来的访问判断，不是跳转到官网下载页
	var param = Common.getParam();//param取url参数
	var userId = sessionStorage.getItem('uid');//session取uid
	var loginToken = sessionStorage.getItem('loginToken');//session取uid
	var payChanel = sessionStorage.getItem('payChannel');//session取payChanel
	var $account = $('.myAccount');//body
	var $investment = $('.investment');
	var $totalIncome = $('.totalIncome');
	var $accountAmt = $('.accountAmt');
	var $income = $('.income');// 最新收益
	var inUseAmt;//在投总额 queryMyAccountInfo接口
	var totalIncome;//累计收益
	var accountAmt;//可用余额
	var income;//最新收益
	var curHoldAmount;
	var floatHoldAmt;
	var regularHoldAmt;
	var rankVip;//用户等级
	var totalAmt;

	// var current = $('.current');//周周涨
	// var float = $('.float');//浮动
	// if()
	var circledata = [{//圆环默认值 自动计算百分比
		value: 100,
		name: '周周涨'
	}, {
		value: 100,
		name: '浮动收益'
	}, {
		value: 100,
		name: '固定收益'
	}];
	//请求时间戳
	var timestamp = Date.parse(new Date());
	//zyx 20160920 end 

	if(!userId){
	Common.toLogin();
	return false;
	}
    Common.currentStock(userId,loginToken);
	

	// 是否显示周周涨和活期
	$.ajax({
		url:Setting.apiRoot1 + '/getCurrentAndFolat.p2p',
		type:'GET',
		dataType:'json',
		data:{
			userId:userId
		}
	}).done(function(res){
		Common.ajaxDataFilter(res,function(){
			console.log(res)
			if(res.code == 1){
				var currentCount  = res.data.currentCount;
				var floatCount  = res.data.floatCount;
				// 1代表活期，4代表浮动，5代表都有，0代表都没有，-1代表传递参数有误
				if(currentCount > 0){
					$(".current").css('display','block');
				}
				if(floatCount > 0){
					$(".float").css('display','block');
				}
			}
		})
	})
	
	// 我的账户信息总览
	$.ajax({
	url:Setting.apiRoot1 + '/u/queryMyAccountInfo.p2p',
	type:"post",
	async:false,
	dataType:'json',
	data:{
		userId: userId,
		loginToken:loginToken,
		guid:timestamp
		
	}
	}).done(function(res){
	Common.ajaxDataFilter(res,function(){
	  if(res.code==1){
	    var data = res.data;
          if(data == undefined || data == null || data == '') {
              Common.toLogin();
              return false;
          }
	    if (data.privilege>0) {
	    	$('.p-count').html(data.privilege+'张').css('display', 'block');
	    }
	    if (data.vouches>0) {
	    	$('.v-count').html(data.vouches+'张').css('display', 'block');
	    }

        if (data.cashBonusPoint == 1) {
            $('.x-count').css('display', 'block');
        }

	    inUseAmt=parseFloat(data.inUseAmt).toFixed(2);//在投总额
	    totalIncome=parseFloat(data.totalIncome).toFixed(2);//累计收益
	    accountAmt=parseFloat(data.accountAmt).toFixed(2);//可用余额
	    totalAmt=parseFloat(data.totalAmt).toFixed(2);//可用余额
	    income = parseFloat(data.rewardYesterday.toString().match(/^\d+(?:\.\d{0,2})?/)).toFixed(2);
	    curHoldAmount=parseFloat(data.curHoldAmount).toFixed(2);//周周涨在投金额
	    floatHoldAmt=parseFloat(data.floatHoldAmt).toFixed(2);//固收在投金额
	    regularHoldAmt=parseFloat(data.regularHoldAmt).toFixed(2);//浮动在投金额
	    yesterDayTotalRate=parseFloat(data.yesterDayTotalRate).toFixed(2);
	    yesterDayInterest=parseFloat(data.yesterDayInterest).toFixed(2);
	    regularTime=data.regularTime;
	    regularTotalAmount=parseFloat(data.regularTotalAmount).toFixed(2);
	    floatEndTime=data.floatEndTime;
	    floatTotalAmount=parseFloat(data.floatTotalAmount).toFixed(2);
	    headportrait = data.avatar;
		$('.icon-left').attr('src',headportrait);
	    
	    if(floatTotalAmount<0){
	    	floatTotalAmount = 0.00
	    }
	    circledata[0].value=data.curHoldAmount;//周周涨在投金额
	    circledata[1].value=data.floatHoldAmt;//固收在投金额
	    circledata[2].value=data.regularHoldAmt;//浮动在投金额
                couponCount=data.couponCount;
                inviteNumber=data.inviteNumber;
                rankVip=data.rankVip;
                if (rankVip==0) {
                    $('.privilege').html('普通会员');
                }else{
                    $('.privilege').html('V'+rankVip+'会员');
                }
	      
	  }else{
	    alert(res.message);
	      return false;
	  }
	  
	  
	})
	}).fail(function(){
	alert('网络链接失败');
	return false
	});  
	//渲染圆环  
	/*var myChart = echarts.init(document.getElementById('main'));
	var option = {
		series: [{
			name: '收益',
			type: 'pie',
			radius: ['65%', '90%'],
	                         center: ['50%', '50%'],
			hoverAnimation: false,
			selectedMode: false,
			label: {
				normal: {
					show:false,
					formatter: '{c}\n{b} >',
	                                            textStyle:{
	                                                fontSize:10
	                                            }
				}
			},
	                    labelLine: {
	                        normal: {
	                        	   show:false,
	                            smooth: 0,
	                            length: 3,
	                            length2: 60
	                        }
	                    },
			data: circledata
		}],
	                color:['rgb(255,131,86)','rgb(255,238,61)','rgb(70,103,236)'],
	                backgroundColor:'#fff',
	                animationDuration:0
	};
	myChart.setOption(option);*/
   
	
	

	// if(income > 0){
	// 	$('.income').css('display','inline');
	// 	var num = upMum($income,income,60,20);//最新收益
	// }
	// 数字递增
	function upMum(Html,endValue,number,time){
		var add = endValue/number;
		var num = 0;
		var InterTime = setInterval(function(){
			num = num + add;
			var text = parseFloat(num.toString().match(/^\d+(?:\.\d{0,2})?/));
			if(num >= endValue){
				text = endValue;
				clearInterval(InterTime);
			}
			Html.html('+' + text);
		},time);

	}
	$('.curHoldAmount').html(Common.comdify(curHoldAmount));//活
	$('.floatHoldAmt').html(Common.comdify(floatHoldAmt));//浮
	$('.regularHoldAmt').html(Common.comdify(regularHoldAmt));//定
	//活
	if (curHoldAmount>0) {
		$('.yesterDayTotalRate').html('昨日年化'+yesterDayTotalRate+'%');
	} else {
		$('.yesterDayTotalRate').html('您暂未投资周周涨产品');
	}
	$('.yesterDayInterest').html('昨日收益'+Common.comdify(yesterDayInterest));
	//浮
	if (regularHoldAmt>0) {
		$('.regularTime').html('最近一笔'+regularTime+'到期');
	} else {
		$('.regularTime').html('您暂未投资定期产品');
	}	
	$('.regularTotalAmount').html('预期总收益'+Common.comdify(regularTotalAmount));
	//定
	if (floatHoldAmt>0) {
		$('.floatEndTime').html('最近一笔'+floatEndTime+'到期');
	} else {
		$('.floatEndTime').html('您暂未投资浮动收益产品');
	}	
	$('.floatTotalAmount').html('当前盈利'+Common.comdify(floatTotalAmount));
	

	//去充值
	$account.on('click', '.topup-btn', function(){
		var $this = $(this);
		if($this.hasClass('disabled')){//充值按钮是否禁用
			return false;
		}
		$this.addClass('disabled');
		window.location.href = Setting.staticRoot + '/pages/my-account/topup-cash.html';
		$this.removeClass('disabled');

	});

	//去提现
	$account.on('click', '.withdraw-btn', function(){
		var $this = $(this);
		if($this.hasClass('disabled')){//提现按钮是否禁用
		  return false;
		}
		$this.addClass('disabled');
	           $.post(Setting.apiRoot1 + '/u/findTransChanel.p2p', {userId:userId,
	            loginToken: loginToken, transType:20,guid:timestamp }, function(res) {
	            console.log(JSON.stringify(res));
	            if(res.code == -2 ) {
	                confirm(res.message, function() {
	                    window.location.href = Setting.staticRoot + '/pages/my-account/setting/real-name.html';
	                });
	                return false;
	            }

	            var withdrawChanel  = res.data.withdrawChanel;
	            var isBind = true;
	            var cardList = res.data.cardList;
	            for (var i = 0; i < cardList.length; i++) {
	                if(cardList[i].bindType == 1) {
	                    isBind = false;
	                    sessionStorage.setItem('resaction', JSON.stringify(res));
	                    window.location.href = Setting.staticRoot + '/pages/my-account/withdrawal-cash.html?amount='+accountAmt;
	                }
	            }

	            if (isBind) {
	                alert('请先充值再提现');
	            }
	        }, 'json');
	           	$this.removeClass('disabled');
	});


	// //账户信息
	// $account.on('click', '.top-left', function(){
	//     window.location.href = Setting.staticRoot + '/pages/my-account/setting/setting-center.html?rankVip='+rankVip+'&couponCount='+couponCount+'&inviteNumber='+inviteNumber;
	// });
	// $account.on('click', '.top-right', function(){
	//     window.location.href = Setting.staticRoot + '/pages/my-account/reward/red-envelope.html';
	// });
	// $account.on('click', '.top-right-past', function(){
	//     window.location.href = Setting.staticRoot + '/pages/my-account/transaction-records.html';
	// });$('.check ').attr('href', '');
	//设置页面数据
	var ege = sessionStorage.getItem('ege');
	if(ege > 0){
		$investment.html('--');//圆环内部 在投总额
		$totalIncome.html('--');//累计收益
		$accountAmt.html('--');//可用余额
		$income.html('--');//可用余额
		$('.show').attr('src','../../images/pages/my-account3.0/hide.png');
		// $('.icon-left').attr('src','../../images/pages/my-account3.0/headportrait.png');
	}else{
		$investment.html(Common.comdify(totalAmt));//圆环内部 在投总额
		$totalIncome.html(Common.comdify(totalIncome));//累计收益
		$accountAmt.html(Common.comdify(accountAmt));//可用余额
		$income.html("+" + Common.comdify(income));//可用余额
		$('.show').attr('src','../../images/pages/my-account3.0/show.png');
		// $('.icon-left').attr('src',headportrait);
	}
	$('.show').on('click',function(){
		var ege = sessionStorage.getItem('ege');
		if(ege > 0){
			$investment.html(Common.comdify(totalAmt));//圆环内部 在投总额
			$totalIncome.html(Common.comdify(totalIncome));//累计收益
			$accountAmt.html(Common.comdify(accountAmt));//可用余额
			$income.html("+" + Common.comdify(income));//可用余额
			$('.show').attr('src','../../images/pages/my-account3.0/show.png');
			// $('.icon-left').attr('src',headportrait)
		    sessionStorage.setItem('ege','-1');
		}else{
			$investment.html('--');//圆环内部 在投总额
			$totalIncome.html('--');//累计收益
			$accountAmt.html('--');//可用余额
			$income.html('--');//可用余额
			$('.show').attr('src','../../images/pages/my-account3.0/hide.png');
			// $('.icon-left').attr('src','../../images/pages/my-account3.0/headportrait.png');
		    sessionStorage.setItem('ege','1');
		}
	});
	$('.li01').on('click',function(){
		window.location.href = 'myPrivilege.html';
		/*$.ajax({
			url:Setting.apiRoot1 + '/getCurrentTime.p2p',
			type:'POST',
			dataType:'json',
		}).done(function(res){
			console.log(res);
			if(res.code == 1){
				var time = res.data.currentTime.replace(/\-/g,'/');
				var startTime = new Date('2018/04/01').getTime();
				var newTime = new Date(time).getTime()
				console.log(newTime >= startTime)
				if(newTime >= startTime){
	    			window.location.href = 'myPrivilege.html';
				}else{
					window.location.href = 'myPrivilegeOld.html';
				}
			}else{
				alert('网络链接失败');
			}
		}).fail(function(){
	        alert('网络链接失败');
	    })*/
	});
	$('.li02').on('click',function(){
	    window.location.href = 'reward/red-envelope.html';
	});
	$('.li03').on('click',function(){
	    window.location.href = 'rewardCenter.html';
	});
	$('.li04').on('click',function(){
	    window.location.href = 'myinvite/myinvite-index.html';
	});
	$('.li05').on('click',function(){
		window.location.href = 'myIntegral.html';
		/*$.ajax({
			url:Setting.apiRoot1 + '/getCurrentTime.p2p',
			type:'POST',
			dataType:'json',
		}).done(function(res){
			console.log(res);
			if(res.code == 1){
				var time = res.data.currentTime.replace(/\-/g,'/');
				var startTime = new Date('2018/04/01').getTime();
				var newTime = new Date(time).getTime()
				console.log(newTime >= startTime)
				if(newTime >= startTime){
	    			window.location.href = 'myIntegral.html';
				}else{
					alert('即将上线');
				}
			}else{
				alert('网络链接失败');
			}
		}).fail(function(){
	        alert('网络链接失败');
	    })*/
	});
	$('.li06').on('click',function(){
	    window.location.href = '../../pages/my-account/canuseAmt.html';
	});
	$('.current').on('click',function(){
		console.log(11)
	    window.location.href = '../../pages/my-account/current/current-account.html';	//周周涨二级
	});
	$('.regular').on('click',function(){
	    window.location.href = '../../pages/my-account/my-product.html';	//固收二级
	});
	$('.float').on('click',function(){
	    window.location.href = '../../pages/financing/my-float.html';	//浮动二级
	});
	$('.data-left').on('click',function(){
		// window.location.href='../../pages/my-account/addupIncome.html?accumulate=' + totalIncome;//
	});
	$('.data-right').on('click',function(){
		// window.location.href='../../pages/my-account/canuseAmt.html';//可用余额
	});
	$('.top-left').on('click',function(){
		window.location.href = Setting.staticRoot + '/pages/my-account/setting/setting-center.html?rankVip='+rankVip+'&couponCount='+couponCount+'&inviteNumber='+inviteNumber;
	});
});

