/**
 * currentbuy.js
 * 
 * @author zyx 
 * @return {[type]} [description]
 */

$(function() {
	sessionStorage.removeItem('buy-pro');
	var $buy = $('.page-buy');
	var $profit = $('.profit', $buy); // 收益
	var $total = $('.total', $buy);
	var $title = $('.title', $buy);
	var $amount = $('.amount', $buy);
	var $minInterest = $('.min', $buy);
	var $input = $('.input', $buy);//支付金额
	var $month = $('.money-input .month', $buy);
	var $ui_list = $('.ui-list', $buy);
	var $select = $('ul', $ui_list);
	var $ui_dialog = $('.ui-dialog');
	var $agreement = $('.agreement');
	var maxRate;
	var $expectmoney = $('.expectmoney');
	var $full=$('.full');//全额按钮
	var balanceAccount;//页面显示账户余额
	var money;
	var $selfExtra = $('.selfExtra');
	$selfExtra.text(0);
	var $back=$('.back');//返回按钮
	var timeLineFlag = false; // 判断是否为倒计时
	var time;
	var num;
	var SysSecond;
	var InterValObj;
	var yuyue = false;// 定期的预约申请
	
	var param = Common.getParam();
	var jumpId= param.jumpId;
	var amount=param.pmount;
	var max = param.maxInvestAmount;
	var $payMoney = $('.pay-money', $buy);
	var $limitmoney = $('.limitmoney', $buy);// 限制输入金额
	var reback = 0;//默认自动续投
	var isJoinInvite = 1;// 默认参加活动
	var ja = document.getElementById('joinActive');
	 ja.checked='true';

	if (!param.pid || !param.pname || !param.pmount || !param.minInterest
			|| !param.minInvestAmount || !param.maxInvestAmount) {
		alert('参数有误！！');
		window.location.href = Setting.staticRoot + '/pages/index.html';
		return false;
	}

	// 如果不是体验金,隐藏体验金ui
	if (param.type != 'novice') {
		$ui_list.hide();
	} else {
		$input.attr("readonly", "readonly");
	}
	if (param.type == 'current') {
		$month.text('每月');
	}

	// 倒计时
	if (param.yuyue) {
		$payMoney.text('预约申请');
		yuyue = true;
		num = param.num || 0;
	} else if (param.timeLine) {
		timeLineFlag = true;
		time = param.timeLine;

		// console.log(decodeURIComponent(time));
		SysSecond = moment(decodeURIComponent(time)).unix() - moment().unix();
		SetRemainTime();
		InterValObj = window.setInterval(SetRemainTime, 1000);
	}
	// 倒计时
	var day, hour, minite, second;
	function SetRemainTime() {
		if (SysSecond > 0) {
			// day = Math.floor(SysSecond / (60 * 60 * 24));
			// hour = Math.floor(SysSecond / (60 * 60)) - (day * 24);
			// minite = Math.floor(SysSecond / 60) - (day * 24 * 60) - (hour *
			// 60);
			// second = Math.floor(SysSecond) - (day * 24 * 60 * 60) - (hour *
			// 60 * 60) - (minite * 60);
			hour = Math.floor(SysSecond / (60 * 60));
			minite = Math.floor(SysSecond / 60) - (hour * 60);
			second = Math.floor(SysSecond) - (hour * 60 * 60) - (minite * 60);

			$payMoney.html((hour > 9 ? hour : '0' + hour) + "时"
					+ (minite > 9 ? minite : '0' + minite) + "分"
					+ (second > 9 ? second : '0' + second) + '秒');
			SysSecond = SysSecond - 1;
		} else {
			clearInterval(InterValObj);
			timeLineFlag = false;
			$payMoney.html('确定');
		}
	}

	param.pmount = parseFloat(param.pmount);
	param.minInterest = parseFloat(param.minInterest);
	param.minInvestAmount = parseFloat(param.minInvestAmount);
	param.maxInvestAmount = parseFloat(param.maxInvestAmount);
	var userId = sessionStorage.getItem('uid');
	var account;
	var noviceId;

	if (!userId) {
		Common.toLogin();
		return false;
	}
	/**
	 * 检查是否设置交易密码
	 */
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
							$('.pay-money').addClass('disabled btn-gray')
									.removeClass('btn-default');
							return false;
						}
					});
				}).fail(function() {
			alert('网络链接失败，请刷新重试！');
			return false;
		});
	}();

	!function() {//获得年化利率

		  $.ajax({
			    url:Setting.apiRoot1 + '/queryProdInfo.p2p',
			    type:"post",
			    dataType:'json',
			    data:{
			     loanType:1,
			     type:1
			    }
			  }).done(function(res){
			      if(res.code==1){
			var data=res.data;
			maxRate=data[0].maxRate;
			//alert(maxRate);
			      }else{
			        alert(res.message);
			          return false;
			      }

			  }).fail(function(){
			    alert('网络链接失败');
			    return false
			  });
	}();

	/**
	 * 设置账户金额（元）：
	 */
	!function() {
		var $balanceAccount = $('.balanceAccount');

		$.ajax({
			url : Setting.apiRoot1 + '/u/myAccountInfo.p2p',
			type : 'post',
			dataType : 'json',
			data : {
				userId : userId,
				loginToken : sessionStorage.getItem('loginToken')
			}
		}).done(function(res) {
			Common.ajaxDataFilter(res, function(data) {
				if (data.code != 1) {
					alert(data.message);
					return false;
				}
				account = data.data;
				balanceAccount=account.accountAmt;
	
				$balanceAccount.text(Common.comdify(account.accountAmt.toFixed(2)));
			});
		}).fail(function() {
			alert('账户余额加载失败，请刷新重试！');
			return false;
		});
	}();

	/**
	 * 设置页面数据
	 */
	!function() {
		$title.text(param.pname);
		$amount.text(Common.comdify(param.pmount.toFixed(2)));//设置页面可投金额
		$minInterest.text(param.minInvestAmount)
		$input.attr('placeholder', '起投金额' + param.minInvestAmount /* +'的整数倍' */);
	}();

	//限制金额输入
	  function limitInput(balanceAccount) {
	    money = $.trim($input.val());
	    var value = parseFloat(money);
	    var mathMin;
	    mathMin= Math.min(max, balanceAccount, amount);
	    if (mathMin==max && value>max) {
	      alert('单笔最大投资金额为'+max);
	      $input.val(max);
	    }
	    if (mathMin==balanceAccount && value>balanceAccount) {
	      alert('投资金额不能大于账户余额');
	       $input.val(balanceAccount);
	    }
	    if (mathMin==amount && value>amount) {
	      alert('投资金额不能大于可投金额');
	      $input.val(amount);
	    }
	  }

	// 添加体验金数据
	+function() {
		var __li = doT
				.template([
						'{{~it: item:index}}',
						'<li>',
						'<div class="slideOne">',
						'<input type="checkbox" name="check" value="{{=item.id}}" amount="{{=item.amount}}">',
						'<i></i>',
						'<label for="slideOne"></label>',
						'</div>',
						'<div  class="pl30 fz24">可用体验金 <span class="red">{{=item.amount}}</span></div>',
						'</li>', '{{~}}' ].join(''));
		if (param.type == 'novice') {
			$.ajax({
				url : Setting.apiRoot1 + '/u/getMyReward.p2p',
				type : 'post',
				dataType : 'json',
				data : {
					userId : userId,
					rewardType : 2,
					loginToken : sessionStorage.getItem('loginToken')
				},
			}).done(function(res) {
				Common.ajaxDataFilter(res, function() {
					var list = res.data.rewardResultList;
					var _str = '';
					var _list = [];
					for ( var i in list) {
						if (list[i].status == 1) {
							_list.push(list[i]);
						}
					}
					$select.html(__li(_list));
				});
			}).fail(function() {
				alert('体验金数据抓取失败，请刷新重试！');
				return false;
			});
		}
	}();

	/**
	 * page Event
	 */

	$buy.on('click','input[name="chk"]',function() {
			var automatic = document.getElementById('automatic');
			var autoafter = document.getElementsByClassName('autoafter');

			/* alert(automatic.checked); */// 是否被选中.
			if (automatic.checked == true) {
				automatic.style.backgroundImage = "url('../../images/pages/buy7day_true.png')";
				$('.sevdaycontent').removeClass('sev');
				reback = 0;//选中为0
				// alert(reback);
			} else {
				automatic.style.backgroundImage = "url('../../images/pages/buy7day_bg.png')";
				$('.sevdaycontent').addClass('sev');
				reback = 1;
				// alert(reback);
			}
	});

	$buy.on('click','input[name="joinActiveChk"]',function() {
		var joinActive = document.getElementById('joinActive');
		if (joinActive.checked == true) {
			joinActive.style.backgroundImage = "url('../../images/pages/buy7day_true.png')";
			isJoinInvite = 1;
			active();
		} else {
			joinActive.style.backgroundImage = "url('../../images/pages/buy7day_bg.png')";
			isJoinInvite = 0;
			$selfExtra.html('勾选参加邀请活动会获得活动奖励');
		}
	});
           

     //点击购买全额     
     $full.on('click',function(){

     	$input.val(balanceAccount);//显示全额
     	money = $.trim($input.val());//金额
          if (money>param.maxInvestAmount) {//输入金额大于单笔最大
          		alert('单笔最大投资额'+max);
          	if(balanceAccount>param.maxInvestAmount){
		$input.val(param.maxInvestAmount);
          	}else{
		$input.val(balanceAccount);
          	}
           
           money = $.trim($input.val());//投资金额自动变为最大可投金额
           if (reback==1) {//不续投
	     expect=(money*7/365*0.0888).toFixed(2);
	 }else{//默认续投
	     	 expect=(money*7/365*(0.0888+0.0898+0.0910+0.0924)+money*2/365*0.0942).toFixed(2);
	 }
  	$expectmoney.html(expect);   //每月收益

          }
          if (reback==1) {//不续投
	     expect=(money*7/365*0.0888).toFixed(2);
	 }
	     else{//默认续投
	     	 expect=(money*7/365*(0.0888+0.0898+0.0910+0.0924)+money*2/365*0.0942).toFixed(2);
	     }
  	$expectmoney.html(expect);   //每月收益

  	active();
     });

    //键盘弹起事件
    $input.on('keyup',function(){

     limitInput(balanceAccount);
     getActive(reback);
  });

getActive(reback);

 function getActive(reback) {
        money = $.trim($input.val());//输入金额
        if(money != null && money != '') {

        var expect = 0;
        if (reback==1) {//不续投
            expect=(money*7/365*0.0888).toFixed(2);

        }else{
            expect=(money*7/365*(0.0888+0.0898+0.0910+0.0924)+money*2/365*0.0942).toFixed(2);
        }

        $expectmoney.html(expect);   //每月收益
        active();
        }
    }



	// $buy.on('click','input[name="joinActiveChk"]',function() {
	function active(){
		var joinActive = document.getElementById('joinActive');
		 money = $('.input').val();
		 if(money>=1000){
			  ja.checked = 'true';
			  ja.style.backgroundImage = "url('../../images/pages/buy7day_true.png')";
			  isJoinInvite = 1;
		}

		if (joinActive.checked == true) {
			joinActive.style.backgroundImage = "url('../../images/pages/buy7day_true.png')";
			isJoinInvite = 1;
			var selfExtra = 0;
		          if(money<1000){
			  ja.checked = '';
			  ja.style.backgroundImage = "url('../../images/pages/buy7day_bg.png')";
			  isJoinInvite = 0;
			  $selfExtra.text('勾选参加邀请活动会获得活动奖励');
		       	  return false;					
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
			}
		           $selfExtra.text(selfExtra);
		       }else {
			joinActive.style.backgroundImage = "url('../../images/pages/buy7day_bg.png')";
			isJoinInvite = 0;
	    		$selfExtra.html('勾选参加邀请活动会获得活动奖励');
		}

		
	    }
           // });

	// 充值跳转
	$buy.on('click','.rechargeBtn',function() {
		window.location.href = Setting.staticRoot + '/pages/my-account/topup-cash.html' ;
						  
	});

	$ui_dialog.on('click', '.close,.btn-link', function(event) {
		$(this).closest('.ui-dialog').hide();
	}).on('click', '.btn-default', function() {
		if (num > 0) {
			alert('你已经预约过了');
			return false;
		}
		$.ajax({
			url : Setting.apiRoot1 + '/u/appointmentApply.p2p',
			type : 'post',
			dataType : 'json',
			data : {
				userId : userId,
				loanId : param.pid,
				loginToken : sessionStorage.getItem('loginToken')
			}
		}).done(function(res) {
			Common.ajaxDataFilter(res, function() {
				alert(res.message);
			});
		}).fail(function() {
			alert('预约失败');
		})
	});

	$buy.on('click', '.pay-money', function() {
		var $this = $(this);

		if (yuyue || timeLineFlag) {
			$ui_dialog.show();
			return false;
		}

		if ($this.hasClass('disabled')) {
			return false;
		}

		var money = $.trim($input.val());
		if (money <= 0) {
			alert('输入的金额需大于0元');
			$input.val('');
			return false;
		}
		if (money <100) {
			alert('起投金额100元');
			return false;
		}
		if (!Common.reg.money.test(money)) {
			alert('输入金额无效！');
			$input.val('');
			return false;
		}
		if (money < param.minInvestAmount) {
			/* alert('输入投资金额需要为' + param.minInvestAmount + '的整数倍！'); */
			alert('投资金额不能小于起投金额');
			$input.val('');
			return false;
		}
		if (isJoinInvite==1) {
			if (money<1000) {
			alert('参加活动起投金额为1000元');
			isJoinInvite=0;
			return false;	
			}
		}
		
		
		if (param.type == 'novice') {
			var $radio = $('input[name="check"]:checked', $ui_list);
			var _amount = $radio.attr('amount');
			var noviceId = $radio.val();
			if (parseFloat(money) > _amount) {
				alert('投资金额不能大于体验金金额');
				$input.val('');
				return false;
			}
		} else {
			if (parseFloat(money) > account.accountAmt.toFixed(2)) {
				alert('投资金额不能大于可用余额');
				$input.val('');
				return false;
			}
			if (parseFloat(money) > param.pmount.toFixed(2)) {
				alert('投资金额不能大于剩余可购余额');
				$input.val('');
				return false;
			}
			if (parseFloat(money) < param.minInvestAmount.toFixed(2)) {
				alert('投资金额不能小于最小可投金额');
				$input.val('');
				return false;
			}

			if (parseFloat(money) > param.maxInvestAmount.toFixed(2)) {
				alert('投资金额不能大于单笔最大投资额' + param.maxInvestAmount);
				$input.val('');
				return false;
			}

		}

		var post = {
			investAmt : money,
			prodId : param.pid
		}
		sessionStorage.setItem('buy-pro', JSON.stringify(post));
		if (param.type == 'novice') {
			window.location.href = 'pay.html?noviceId=' + noviceId;
		} else {
			window.location.href = 'pay.html?reback=' + reback+'&isJoinInvite=' + isJoinInvite;
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

    $back.on('click',  function(){alert('123')
    	if (jumpId==1) {
    		window.location.href = "../financing/current.html";	
    	}else if(jumpId==2){
    		window.location.href = "../my-account/current/current-account.html";	
    	}else if(jumpId==null){
    		window.location.href = "../index.html";	
    	}
    	
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
