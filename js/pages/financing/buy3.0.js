/*
* @Author: User
* @Date:   2016-09-08 14:09:27
* @Last Modified by:   User
* @Last Modified time: 2017-03-09 15:03:50
*/

$(function(){
	sessionStorage.removeItem('buy-pro');
	var week3;
	var week3Level10000;
	var week3Level30000;
	var week3Level50000;
	var $buy = $('.page-buy');//body
	var $amount = $('.amount', $buy);//可投余额(标的余额)
	var $amountLimit = $('.amountLimit', $buy);//加入上限
	var $balanceAccount = $('.balanceAccount');//账户余额
	var $input = $('.input', $buy);//用户输入金额
	var $payMoney = $('.pay-money');
	var $agreement = $('.agreements');//投资协议
	var $risk = $('.risk');//投资协议
	var $expectmoney = $('.expectmoney');//预期收益
	var jxspan = 0;//礼券收益
	var $full= $('.full');//全额按钮
	var $selfExtra = $('.selfExtra');//活动奖励
	$selfExtra.text(0);//奖励默认显示0
	var $payMoney = $('.pay-money', $buy);//确定按钮
    var interest = 0;
    var ctype;
	//自定义UI弹出层
	var $ui_dialog = $('.ui-dialog');
	var $btn_link  = $('.btn-link',$ui_dialog);
	var $btn_default = $('.btn-default',$ui_dialog);
	$('.dialog-close').on('click',function(){
		$ui_dialog.addClass('hide');
	});
	//userid&logintoken
	var userId = sessionStorage.getItem('uid');//userid
	var loginToken = sessionStorage.getItem('loginToken');
	//param pid购买页
	var param = Common.getParam();
	var pid=param.pid;//产品ID
    var _interest = sessionStorage.getItem('slreValue');
    if(_interest != undefined && _interest != null && _interest != '') {
        _interest = _interest.toString();
    }
	//定义全局
	var pname;//title
	var pmount;//可投余额(标的余额)
	var amountLimit;//加入上限
	var maxInvestAmount;//最大投资金额
	var minInvestAmount;//最小起投金额
	var maxRate;//最大利率
	var minRate;//最小利率
	var addRate;//加息
	var cycle;//周期时长
	var cycleType;//周期类型
	var action;//是否参加大额加息活动
	var action2;//是否参加加息券
	var action3;//是否参加体验金
	var action5;//是否参加投资红包
	var maxPrivilege;//最大特权
	var haveuse;//已经勾选
	var justforuse;//勾选过后
	var clicktype;//类型
	var accountAmt;//账户余额
	var money;//用户投资输入框的金额值
	var expect;//每月收益的值
	var isJoinInvite=0;//默认参加邀请活
	var percent;
	var selfExtra;
	var regularRate;
	var addInterestRate;//投资加息
	var minAmt = [];
	var maxAmt = [];
	var interestRate = [];
	var couponIds=[];
	var redIds=[];
	var expIds=[];
	var cp_data;//{pid,amount,expect}
	var indata = {};
	var vjr_selectedConponObj;
	var addCouponHtml='';
	var jxdata='';
    var prodType; //产品类型



/*尊享加息标 全场达标红利 开年红包*/
	var flagQCDB = 0;//全场达标红利是否开始 1：开始 0：活动无效
	var flagKNHB = 0;//开年红包是否开始 1：开始 0：活动无效
    var eightexpect = 0;
    var eightRate = 0;
    var redexpect = 0;
    var rate = 0;
    var startredexpect = 0;
    var startrate = 0;
    var activityRate = 0;

	// 14周
	var loanCycle14 = 0;
	var isAmt = 0;
	var levelRate = 0;

	//37
	var size;

	//点击勾选框
    var $checked = $('.isChecked');//勾选框
    var isChecked = true;
    if(isChecked) {
        $checked.attr({'src': '../../images/pages/account/ischecked-true.png'}).addClass('isTrue');
        isChecked = false;
    }

    $checked.click(function() {
        if(isChecked) {
            $(this).attr({'src': '../../images/pages/account/ischecked-true.png'}).addClass('isTrue');
            isChecked = false;
        } else {
            $(this).attr({'src': '../../images/pages/account/isChecked.png'}).removeClass('isTrue');
            isChecked = true;
        }
    });
		
	if(!param.pid){
		Common2.toast('参数有误！！');
		window.location.href = Setting.staticRoot + '/pages/index.html';
		return false;
	}
	if(!userId){
		Common.toLogin();
		return false;
	}

	//0110
	//购买页面刷新接口
	!function(){
		$.ajax({
		  url: Setting.apiRoot1 + '/u/queryMyProductActions.p2p',
		  type: 'post',
		  async:false,
		  dataType: 'json',
		  data: {
		    userId:userId,
	          loginToken:loginToken,
		    loanId: pid
		  }
		}).done(function(res){
		  Common.ajaxDataFilter(res, function(data){
		    if(data.code == 1){
		    	var data=res.data;
		    	//固收产品的详细信息
			pname=data.prodTitle;//title	
			var detailLength = data.investTerm.length;
			investTerm	= pname.substr(0, detailLength - 1)
			pmount=parseFloat(data.canBuyAmt);//可投余额(标的余额)
			amountLimit=parseFloat(data.amountLimit);//加入上限
			maxInvestAmount = parseFloat(data.maxBuyAmt);//最大投资金额
			minInvestAmount =parseFloat(data.minBuyAmt);//最小起投金额
			// $input.attr('placeholder','请输入'+minInvestAmount+'的整数倍')
			maxRate=data.maxRate;//最大利率
			minRate=data.minRate;//最小利率
			addRate=data.addRate;//加息
			cycle=data.loanCycle;//周期时长
			cycleType=data.cycleType;//周期类型
			action=data.action;//是否参加大额加息活动
			action2=data.action2;//是否参加加息券
			action3=data.action3;//是否参加体验金
			action5=data.action5;//是否参加投资红包
			maxPrivilege=data.maxPrivilege;//当前去除已参加的其他活动后的总权重
			prodType=data.prodType;//标的类型
			if((cycle == 8 || cycle == 12)&& prodType == 3){
				activityRate=data.activityRate;//尊享加息标
			}
			eightRate = activityRate;
			flagQCDB = data.flagQCDB*1;//全场达标红利是否开始
			flagKNHB = data.flagKNHB*1;//开年红包是否开始
			// 3周标去掉全额购买
			if((data.loanCycle == 3 && (minRate + addRate) != 14) || data.loanCycle == 22){
				$('.full').remove();
				$('.fullLine').remove();
				$('.addcoupon').hide();
				$('.addcoupon2').show();

			}
			if (action==1) {//大额加息
				//$('.addimg').removeClass('hide');
			}
			if (action2==0) {//加息券
				$('.addcoupon').hide();
				$('.addcoupon2').show();
			}
			if (action3==0) {//体验金
				$('.experience').hide();
			}
			if (action5==0) {//投资红包
				$('.investred').hide();
			}
	            ifAddInterest()
		    } else {
	            Common2.toast(res.message);
	            return false;
	        }
		  });
		}).fail(function(){
	  		Common2.toast('网络异常',Setting.staticRoot+'/images/pages/ui/wifi.png');
		  	return false;
		});
		/*14周判断可购买金额和是否可以购买*/
		// if(investTerm == 14){
		// 	$.ajax({
		//     	url:Setting.apiRoot1 + '/u/queryUser14Week.p2p',
		//     	type:"POST",
		//     	dataType:'json',
		//     	async:false,
		//     	data:{
		//     		userId:userId,
		//     		loginToken:loginToken
		//     	}
		//     }).done(function(res){
		//     	console.log('14周：',res);
		//     	if(res.code == 1){
		//     		var data = res.data;
		    		// levelRate = data.levelRate;//最大利率
		    		// isAmt = data.maxPurchasedAmt - data.purchasedAmt;//最大限额 - 已购买额度
					// loanCycle14 = 0;
					// switch(parseInt(data.level)){
					// 	case 1:loanCycle14 = data.levelRate == 11 ? 1:0;break;
					// 	case 2:loanCycle14 = data.levelRate == 13 ? 1:0;break;
					// 	case 3:loanCycle14 = data.levelRate == 15.5 ? 1:0;break;
					// 	case 4:loanCycle14 = data.levelRate == 17 ? 1:0;break;
					// }
		    // 	}
		    // })
		// }

		 /**
	       * 特殊用户14周
	       * @userId  {[number]}  用户id 
	       * @loginToken {[type]}  loginToken 
	       * @return 
	     */
	     if(investTerm == 14){
		    $.ajax({
		      url:Setting.apiRoot1 + '/u/queryUser14WeekExt.p2p',
		      dataType:'json',
		      type:'POST',
		      async:false,
		      data:{
		        userId:userId,
		        loginToken:loginToken,
		      }
		    }).done(function(res){
		      if(res.code == 1){
		       isAmt = res.data.maxPurchasedAmt - res.data.purchasedAmt;//最大限额 - 已购买额度
		      	maxInvestAmount = isAmt;
		      }
		    }).fail(function(){
	      		Common2.toast('网络异常',Setting.staticRoot+'/images/pages/ui/wifi.png');

		    })
	     }

	    /*
			活期转存3周标 判断用户购买额度
	    */
	     if(investTerm == 3 && (minRate + addRate) == 14){
		    $.ajax({
		      url:Setting.apiRoot1 + '/u/userCurrentStockInfo.p2p',
		      dataType:'json',
		      type:'POST',
		      async:false,
		      data:{
		        userId:userId,
		        loginToken:loginToken,
		      }
		    }).done(function(res){
		      if(res.code == 1){
		      	maxInvestAmount = res.data.voteAmount ;
		      }
		    }).fail(function(){
	      		Common2.toast('网络异常',Setting.staticRoot+'/images/pages/ui/wifi.png');
		    })
		}
		//尊享加息标
		if(activityRate != 0 && (investTerm == 8 || investTerm == 12)){
            $('.812redrate').html('+' + activityRate + '%');
		}
	}(); 

	(function($){
	    $.fn.extend({
	        donetyping: function(callback,timeout){
	            timeout = timeout || 500; // 1 second default timeout
	            var timeoutReference,
	                doneTyping = function(el){
	                    if (!timeoutReference) return;
	                    timeoutReference = null;
	                    callback.call(el);
	                };
	            return this.each(function(i,el){
	                var $el = $(el);
	                $el.is(':input') && $el.on('keyup keypress',function(e){
	                    if (e.type=='keyup' && e.keyCode!=8) return;
	                    if (timeoutReference) clearTimeout(timeoutReference);
	                    timeoutReference = setTimeout(function(){
	                        doneTyping(el);
	                    }, timeout);
	                }).on('blur',function(){
	                    doneTyping(el);
	                });
	            });
	        }
	    });
	})(jQuery);


	//0110
	//查询所有档位并存储到indata{};
	(function(){
		if (action==1) {
			$.ajax({
			url:Setting.apiRoot1 + '/queryAction1.p2p',
			type:"post",
			dataType:'json',
			async:false,
			data:{
				loanId: pid
			}
			}).done(function(res){
			Common.ajaxDataFilter(res,function(){
				if(res.code==1){
					indata = res.data;
				}else{
				Common2.toast(res.message);
				return false;
				}
			})
			}).fail(function(){
          		Common2.toast('网络异常',Setting.staticRoot+'/images/pages/ui/wifi.png');
				return false
			});  	
		}
	})();
	//0110
	//投资金额对应档位indata获取相应区间的rate;
	function  ifAddInterest(){
		if (indata.length>0) {
			for (var i = 0; i < indata.length; i++) {
				if( Number(indata[i].minAmt) <= Number(money) && Number(money) < Number(indata[i].maxAmt) ) {
				addInterestRate = indata[i].addRate;
				break;
				}else{
				addInterestRate = 0;	
				}
			}
			regularRate=parseFloat(minRate)+parseFloat(addRate)+parseFloat(addInterestRate);			
		}else{
			regularRate=parseFloat(minRate)+parseFloat(addRate);	
		}
		if(activityRate != 0 && (investTerm == 8 || investTerm == 12)){
			regularRate=parseFloat(minRate);
		}
	}
    $('#annual').html(parseFloat(regularRate).toFixed(2) + '%');
	//0110
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
							Common2.toast(data.message);
							$payMoney.addClass('disabled btn-gray').removeClass('btn-default');
							return false;
						}
					});
				}).fail(function() {
              		Common2.toast('网络异常',Setting.staticRoot+'/images/pages/ui/wifi.png');
					return false;
		});
	}();

	//0110
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
		    Common2.toast(res.message);
		      return false;
		  }
		})
		}).fail(function(){
      		Common2.toast('网络异常',Setting.staticRoot+'/images/pages/ui/wifi.png');
			return false
		});  
	}();

	//0110
	//设置页面显示数据
	!function() {
        if(pname == undefined || pname == null || pname == '') {
            // document.title="购买";
            $('#annual').html('0');
            return false;
        } else {
            // document.title="购买"+pname;
        }
		$amount.text(Common.comdify(pmount));//设置页面可投余额(标的余额)
		$amountLimit.text(Common.comdify(amountLimit));
		if(accountAmt > 0){
			$balanceAccount.text((Common.comdify(accountAmt)));//显示账户余额
		}else{
			$balanceAccount.text('0.00');
		}
		if (pname=='新手标') {
			// $input.attr('placeholder', '起投'+minInvestAmount+'元,' +'最高10000元' );//投资输入框起投金额
		} else {
			// $input.attr('placeholder', '请输入' +minInvestAmount+'的整数倍');//投资输入框起投金额	
		}
	}();

	// //
	// // 点击购买全额   用户输入金额=账户余额  
	$full.on('click',function(){
		// match(/^\d+(?:\.\d{0,2})?/))
		// var pmount = parseInt(pmount/100 + '');
		// pmount = parseInt(pmount/100 + '')*100;
		// console.log(parseInt(pmount/100 + '')*100)

		var pmounts = parseInt(pmount/100 + '')*100;//剩余可投
		var maxInvestAmounts = parseInt(maxInvestAmount/100 + '')*100;//最大可投
		var accountAmts = parseInt(accountAmt/100 + '')*100;//账户余额
		money=$.trim($input.val());//点击购买全额并进行比较之后输入框的投资金额

		// 第一个数字为0时
		if(money.length > 1 && money == 0 ) {
            $input.val('');
        	$payMoney.text('确认');
        	return false
        }

        if (pmounts <= maxInvestAmounts && accountAmts > pmounts) {//账户余额>标的余额
       		Common2.toast('投资金额不能大于可投余额'+pmounts);
       		$input.val(pmounts);
       		$payMoney.text('确认加入'+Common.comdify(pmounts)+'元');
       	}else if(accountAmts>maxInvestAmounts){//最大投资金额<账户余额<标的余额
       		if(investTerm == 14){
				Common2.toast('剩余可投金额' +maxInvestAmounts + '元');
				$input.val(maxInvestAmounts);
       			$payMoney.text('确认加入'+Common.comdify(maxInvestAmounts)+'元');

			}else{
				Common2.toast('最大投资金额为'+maxInvestAmounts);
				$input.val(maxInvestAmounts);
       			$payMoney.text('确认加入'+Common.comdify(maxInvestAmounts)+'元');

			}
       	}else if(accountAmts<minInvestAmount){//账户余额<起投
            $ui_dialog.removeClass('hide');
            $btn_link.attr('href',Setting.staticRoot + '/pages/my-account/topup-cash.html');
            $btn_default.attr('onclick','window.location.reload();');
            return false;
       	}else{
			$input.val(accountAmts);
   			$payMoney.text('确认加入'+Common.comdify(accountAmts)+'元');
       	}


		/*判断14周的可够金额*/
       	

		money=$.trim($input.val());//点击购买全额并进行比较之后输入框的投资金额
		if( cycleType==1){
           	percent = cycle / 365;//日
       	}else if(cycleType==2){
           	percent = cycle*30 /365;//月
       	}else if(cycleType == 3){
           	percent =cycle*365 /365;//年
       	}else if(cycleType == 4){
           	percent = cycle*7 /365;//周
       	}

       	ifAddInterest();
       	expect =parseFloat(percent*money*regularRate/100);
       	 sessionStorage.setItem('_expect',expect);
       	

        //金额改变请重新选择
        if (frontamt!=undefined && frontamt!=null && frontamt!='') {
            // if ((sessionStorage.getItem('vjr_couponIds')!=null && sessionStorage.getItem('vjr_couponIds')!='')) {
                if (Number(money)!=Number(frontamt)) {
                    $('.Common2.toast-layer').css('display', 'flex');
                    // $('#reloadbtn').on('click',function(){
                        sessionStorage.setItem('vjr_couponIds','');
                        // sessionStorage.setItem('vjr_expIds','');
                        // sessionStorage.setItem('vjr_redIds','');
                        sessionStorage.setItem('clicktype','');
                        sessionStorage.removeItem('vjr_selectedConpon');
                        // sessionStorage.removeItem('vjr_selectedRed');
                        // sessionStorage.removeItem('vjr_selectedExp');
                        sessionStorage.removeItem('vjr_selectedConpon_id');
                        // sessionStorage.removeItem('selectedConpon');
                        // sessionStorage.removeItem('vjr_selectedRed_id');
                        // sessionStorage.removeItem('vjr_selectedExp_id');
                        $('.ret').hide();
                        eightRate = activityRate;//尊享加息标
                        pro = 0;
                         // 开年红包
                         if((cycle == 2 || cycle == 4 || cycle == 8 || cycle == 12 || cycle == 26 || cycle == 52 )&& prodType == 3){
							if(money >= 50000  && flagKNHB == 1){
	                        	startrate = 0.5;
								$('.startrate').html('+'+startrate+'%');
	                        }
						}else{
                        	startrate = 0;
							$('.startrate').html('');
                        }
                        

                        $('.Common2.toast-layer').css('display', 'none');//遮罩层消失
                        viewCoupon();
                    // });
                }
            // }
        }
    	console.log('eightRate2--',eightRate)

     	if((cycle == 2 || cycle == 4 || cycle == 8 || cycle == 12 || cycle == 26 || cycle == 52 )&& prodType == 3){
        	redrate(money)
        }

       	if(jxspan != 0 && jxspan !=undefined && jxspan !=null){
        	// $expectmoney.html(expect + "+（优惠券）"+jxspan + "+（红利）"+ redexpect + "+（开年）"+startredexpect + "+（尊享）" + eightexpect ); //预期收益
        	$expectmoney.html(parseFloat(expect*1 + jxspan*1 + redexpect*1 + startredexpect*1 + eightexpect*1).toFixed(2));

       	}else{
       		// $expectmoney.html(expect+ "+（红利）"+redexpect + "+（开年）"+ startredexpect+ "+（尊享）" + eightexpect );
        	$expectmoney.html(parseFloat(expect*1 + redexpect*1 + startredexpect*1 + eightexpect*1).toFixed(2));

       	}
       	// $expectmoney.html(expect); //预期收益
	          
        //点击全额购买的同时改变{pid,amount,expect}
		cp_data={
            pid:pid,
            amount:money,
            expect:expect,
            cycle:cycle,
            interest:interest,
            regularRate:regularRate,
            pagebuy:0,
            justforuse:maxPrivilege
        };
       	viewCoupon();
	});

	//0110
	//键盘弹起事件
	// $('#example').donetyping(function(){
	//   $('#example-output').text('Event last fired @ ' + (new Date().toUTCString()));
	// }); 
	// $input.donetyping(function(){
	
	// });
	
	$input.keyup(function(){
		jxspan = 0;
        donetyp();
	});
    var _inputVal = $input.val();
    if(_inputVal != null && _inputVal != '' && _inputVal != undefined) {
        donetyp();
    }
    function donetyp() {
    	console.log(111)
    	var pmounts = parseInt(pmount/100 + '')*100;
		var maxInvestAmounts = parseInt(maxInvestAmount/100 + '')*100;
		var accountAmts = parseInt(accountAmt/100 + '')*100;
        money = $.trim($input.val());//输入金额


        // 第一个数字为0时
		if((money.length > 1 && money <= 0 )|| money.length <=0) {
            $input.val('');
        	$payMoney.text('确认');
           	$expectmoney.html('0.00'); //预期收益
        }
        if(money.length > 1 && money != 0) {
        	if(/\./.test(money)){
            	Common2.toast(minInvestAmount +'元起投，递增金额100');
    		   	// $input.val('');
    		   	$input.blur();
        		$payMoney.text('确认');
        	}
        }
        if (money>pmounts && accountAmts > pmounts) {//输入金额>标的余额
            Common2.toast('当前已超出剩余可投金额');
            $input.val(pmount);
           	money = pmount;
        }
        if (money>pmounts && accountAmts <= pmounts) {//输入金额>标的余额
            Common2.toast('当前已超出剩余可投金额');
            $input.val(pmount);
           	money = pmount;
        }
        if(money>maxInvestAmounts){//输入金额>最大投资金额
            // Common2.toast('最大投资金额为'+maxInvestAmounts);
            Common2.toast('当前已超出剩余可投金额');
            $input.val(maxInvestAmounts);
           	money = maxInvestAmounts;
        }
    	$payMoney.text('确认加入'+Common.comdify(money)+'元')


        if( cycleType==1){
            percent = cycle / 365;//日
        }else if(cycleType==2){
            percent = cycle*30 /365;//月
        }else if(cycleType == 3){
            percent =cycle*365 /365;//年
        }else if(cycleType == 4){
            percent = cycle*7 /365;//周
        }
        ifAddInterest();
       
        expect =parseFloat(percent*money*regularRate/100);
        sessionStorage.setItem('_expect',expect);
       	

        //金额改变请重新选择
        if (frontamt!=undefined && frontamt!=null && frontamt!='') {
            // if ((sessionStorage.getItem('vjr_couponIds')!=null && sessionStorage.getItem('vjr_couponIds')!='')) {
                if (Number(money)!=Number(frontamt)) {
                    $('.Common2.toast-layer').css('display', 'flex');
                    // $('#reloadbtn').on('click',function(){
                        sessionStorage.setItem('vjr_couponIds','');
                        // sessionStorage.setItem('vjr_expIds','');
                        // sessionStorage.setItem('vjr_redIds','');
                        sessionStorage.setItem('clicktype','');
                        sessionStorage.removeItem('vjr_selectedConpon');
                        // sessionStorage.removeItem('vjr_selectedRed');
                        // sessionStorage.removeItem('vjr_selectedExp');
                        sessionStorage.removeItem('vjr_selectedConpon_id');
                        // sessionStorage.removeItem('selectedConpon');
                        // sessionStorage.removeItem('vjr_selectedRed_id');
                        // sessionStorage.removeItem('vjr_selectedExp_id');
                        $('.ret').hide();
                        eightRate = activityRate;//尊享加息标
                        pro = 0;
                         // 开年红包
                          if((cycle == 2 || cycle == 4 || cycle == 8 || cycle == 12 || cycle == 26 || cycle == 52 )&& prodType == 3){
							if(money >= 50000  && flagKNHB == 1){
	                        	startrate = 0.5;
								$('.startrate').html('+'+startrate+'%');
	                        }
						}else{
                        	startrate = 0;
							$('.startrate').html('');
                        }

       //                  if(money >= 50000 && flagKNHB == 1){
       //                  	startrate = 0.5;
							// $('.startrate').html('+'+startrate+'%');
       //                  }else{
       //                  	startrate = 0;
							// $('.startrate').html('');
       //                  }
                        

                        $('.Common2.toast-layer').css('display', 'none');//遮罩层消失
                        viewCoupon();
                    // });
                }
            // }
        }
    	console.log('eightRate1--',eightRate)

     	if((cycle == 2 || cycle == 4 || cycle == 8 || cycle == 12 || cycle == 26 || cycle == 52 )&& prodType == 3){
        	redrate(money)
        }else{
        	if(eightRate){
	            $('.812redrate').html('+' + parseFloat(eightRate).toFixed(2) + '%');
	        }else{
	            $('.812redrate').html('');
	        }
	        if(startrate){
	            $('.startrate').html('+' + parseFloat(startrate).toFixed(2) + '%');
	        }else{
				$('.startrate').html('');
	        }
        }
        if(jxspan != 0 && jxspan !=undefined && jxspan !=null){
        	// $expectmoney.html(expect + "+"+jxspan +"" ); //预期收益
        	// $expectmoney.html(expect + "+(优惠券)"+jxspan + "+（红利）"+redexpect + "+（开年）"+ startredexpect+ "+（尊享）" + eightexpect );
        	$expectmoney.html(parseFloat(expect*1 + jxspan*1 + redexpect*1 + startredexpect*1 + eightexpect*1).toFixed(2));
       	}else{
       		// $expectmoney.html(expect)
       		// $expectmoney.html(expect+ "+（红利）"+redexpect + "+（开年）"+ startredexpect+ "+（尊享）" + eightexpect );
        	$expectmoney.html(parseFloat(expect*1 + redexpect*1 + startredexpect*1 + eightexpect*1).toFixed(2));

       	}

        //输入投资金额的同时改变{pid,amount,expect,interest礼券收益}
        cp_data={
            pid:pid,
            amount:money,
            expect:expect,
            cycle:cycle,
            interest:interest,
            regularRate:regularRate,
            pagebuy:0,
            justforuse:maxPrivilege
        };

        viewCoupon();
    }

    sessionStorage.setItem('justforuse',maxPrivilege);
	//0110
	//输入金额>起投金额之后 
	//查找可用加息券 可用投资红包 可用体验金
	function viewCoupon(){
      	if (money>=minInvestAmount) {
		    $('.addcoupon').addClass('canclick').find('span').removeClass('used');//.html('全程加息券不可和其他奖励同时使用')加息券一栏字体变黑
		    // $('.usecoupon').attr('href', '../../pages/my-account/reward/myCoupon.html?'+ $.param(cp_data));
			$.ajax({
			// url:Setting.apiRoot1 + '/u/usefulRateCoupon.p2p',
			url:Setting.apiRoot1 + '/u/checkUsefulRateCoupon.p2p',
			type:"post",
			async:false,
			dataType:'json',
			data:{
				userId: userId,
				loginToken:sessionStorage.getItem('loginToken'),
				prodId:pid,
				amount:money
			}
			}).done(function(res){
			Common.ajaxDataFilter(res,function(){
			  if(res.code==1){
			  	var data=res.data;
			  	size=data.size;
	              sessionStorage.setItem('_size',size);
			  	if (size>0) {
			  		// $('.showSize').html(size+'张可用').show();
			  		// $(".rowac span").html('未使用');
			  		$('.couponLeftImg').addClass('visible');
	  				$('.addcoupon span').css('margin-right','0.7rem');
		    		$('.usecoupon').attr('href', '../../pages/my-account/reward/myCoupon.html?'+ $.param(cp_data));
		    		var selectedConpon = JSON.parse(sessionStorage.getItem('vjr_selectedConpon'));
		    		console.log('selectedConpon',selectedConpon)
		    		if(!(selectedConpon != undefined && selectedConpon !='' && selectedConpon.length > 0)){
		    			removegift();
		    			$(".rowac span").html('可使用优惠券');
		    			if(activityRate != 0 && (investTerm == 8 || investTerm == 12)){
				            $('.812redrate').html('+' + activityRate + '%');
						}
		    		}

			  	} else {
			  		// $('.showSize').hide();
			  		$(".rowac span").html('无可用优惠券');
			  		$('.couponLeftImg').removeClass('visible');
			  		$('.addcoupon span').css('margin-right','0.32rem');
		    		$('.usecoupon').attr('href', 'javascript:;');
				    if(activityRate != 0 && (investTerm == 8 || investTerm == 12)){
			            $('.812redrate').html('+' + activityRate + '%');
					}
					removegift();
	                return false;
			  	}

			  }else{
			      //Common2.toast(res.message);
	              //$input.val(' ');
			      return false;
			  }
			})
			}).fail(function(){
	      		Common2.toast('网络异常',Setting.staticRoot+'/images/pages/ui/wifi.png');
				return false
			});
      	}else{
  		    $('.rowac a').removeAttr('href');
		    $('.canclick').removeClass('canclick');
		    // $('.showSize').hide();
		    $(".rowac span").removeClass('used').html('无可用优惠券');
	  		$('.couponLeftImg').removeClass('visible');
	  		$('.addcoupon span').css('margin-right','0.32rem');
    		$('.usecoupon').attr('href', 'javascript:;');
      	}
	}
	//0110
	//点击确定按钮 决定购买
	$buy.on('click', '.pay-money', function() {
		var $this = $(this);
		if ($this.hasClass('disabled')) {
			return false;
		}
		money = $.trim($input.val());
		if (money <= 0) {
			Common2.toast('输入的金额需大于0元');
			// $input.val('');
			return false;
		}

		if(money.length >= 3  && money != 0 && /\./.test(money/100)) {
			Common2.toast(minInvestAmount +'元起投，递增金额100');
			return false;
        }
		if (!Common.reg.money.test(money)) {
			Common2.toast('输入金额无效！');
			// $input.val('');
			return false;
		}
		if (money < minInvestAmount) {
			Common2.toast('投资金额不能小于起投金额'+minInvestAmount+'元');
			// $input.val('');
			return false;
		}
		if (parseFloat(money) >accountAmt) {
			Common2.toast('当前可用余额不足');
            // $ui_dialog.removeClass('hide');
            // $btn_link.attr('href',Setting.staticRoot + '/pages/my-account/topup-cash.html');
            // $btn_default.attr('onclick','window.location.reload();');
            return false;
		}
		if (parseFloat(money) >pmount.toFixed(2)) {
			Common2.toast('当前已超出剩余可投金额');
			// $input.val('');
            $input.val(maxInvestAmounts);
			return false;
		}
		if (parseFloat(money) <minInvestAmount.toFixed(2)) {
			Common2.toast('投资金额不能小于最小可投金额');
			// $input.val('');
			return false;
		}
		if (parseFloat(money) >maxInvestAmount.toFixed(2)) {
			// Common2.toast('投资金额不能大于单笔最大投资额' +maxInvestAmount);
			Common2.toast('当前已超出剩余可投金额');
            $input.val(maxInvestAmount);
			// $input.val('');
			return false;
		}
		if (isChecked) {
			Common2.toast('请先勾选并同意平台服务协议');
			return false;
		}

		/*判断14周的可投金额*/
		if(investTerm == 14 && parseFloat(money) > isAmt){
			Common2.toast('剩余可投金额' +isAmt.toFixed(2) + '元');
			// $input.val('');
			return false;
		}
		//可以购买3周标的条件 以及档位
		if(investTerm == 3 && (minRate+addRate)!= 14){
			 $.ajax({
			    url:Setting.apiRoot1 + "/u/checkUser3Week.p2p",
			    type:'post',
			    dataType:'json',
			    async:false,
			    data:{
			        userId : userId,
			        loginToken : sessionStorage.getItem('loginToken')
			    }
			}).done(function(res){
			    Common.ajaxDataFilter(res,function(){
			        if(res.code == 1){
			            week3 = res.data.week3;
			            week3Level10000 = res.data.week3Level10000;
			            week3Level30000 = res.data.week3Level30000;
			            week3Level50000 = res.data.week3Level50000;
		            	if(week3 != 0){
							var oneMoney = 10000;
							var twoMoney = 30000;
							var thereMoney = 50000;
							if(parseFloat(money) >= oneMoney && parseFloat(money) < twoMoney){
								if(week3Level10000 == 0){
									Common2.toast('每一个金额档次只能投资一次，请勿重复购买');
									return false;
								}
							}else if(parseFloat(money) >= twoMoney && parseFloat(money) < thereMoney){
								if(week3Level30000 == 0){
									Common2.toast('每一个金额档次只能投资一次，请勿重复购买');
									return false;
								}
							}else if(parseFloat(money) == thereMoney){
								if(week3Level50000 == 0){
									Common2.toast('每一个金额档次只能投资一次，请勿重复购买');
									return false;
								}
							}
							var post = {
								investAmt : money,
								prodId : pid
							};
							sessionStorage.setItem('buy-pro', JSON.stringify(post));
					        if(parseFloat(money) <= parseFloat(maxInvestAmount)) {
					        	payHtml();
					            // window.location.href = 'pay.html?cycle='+cycle+'&clicktype='+ctype;
					        } else {
					            Common2.toast('不能大于上限' + maxInvestAmount + '元');
					            $input.val(maxInvestAmount);
					        }
						}else{
							Common2.toast('您不符合购买条件，详情请参照“3周专享活动”规则');
							return false;

						}
			        }else{
			            Common2.toast(res.message);
			        }
			    })
			}).fail(function(res){
          		Common2.toast('网络异常',Setting.staticRoot+'/images/pages/ui/wifi.png');
			    return false;
			})
		}else{
			var post = {
				investAmt : money,
				prodId : pid
			};
			sessionStorage.setItem('buy-pro', JSON.stringify(post));
	        if(parseFloat(money) <= parseFloat(maxInvestAmount)) {
	        	payHtml();
	            // window.location.href = 'pay.html?cycle='+cycle+'&clicktype='+ctype;
	        } else {
	            Common2.toast('不能大于上限' + maxInvestAmount + '元');
	            $input.val(maxInvestAmount);
	        }
		}
		

	}).on('click', '.recharge', function() {
		var $this = $(this);
		if ($this.hasClass('disabled')) {
			return false;
		}
	});
	
	//0110
	//购买协议点击跳转
	$agreement.on('click',  function(){
	var fullName = sessionStorage.getItem('realname');
	var showName = "***";
	if(fullName==null || fullName==undefined || fullName.length<1){
	// Common2.toast('姓名错误：'+fullName);
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
	// Common2.toast('手机号错误：'+fullPhone);
	}else{
	var _hide_number = fullPhone.substr(3,4);
	phoneNum = fullPhone.replace(_hide_number,'****');//手机
	}

	var fullCertNo = sessionStorage.getItem('cardNum');
	var cardNum = "***************";
	if(fullCertNo==null || fullCertNo==undefined || fullCertNo.length<15){
	// Common2.toast('身份证号错误：'+cardNum);
	}else{
	var _front_cardnum = fullCertNo.substr(0,3);
	var _last_cardnum = fullCertNo.substr(14,4);
	cardNum = _front_cardnum+'***********'+_last_cardnum;//身份证
	}

	window.location.href = "regular-agreement.html?uName="+showName+"&uMobile="+phoneNum+"&uSFZ="+cardNum;
	// window.location.href = "../account/service-agreement.html";
	});
	$risk.on('click',function(){
		window.location.href = 'risk.html';
	})


	//隐藏显示活动细则
	$('.content-Img0').click(function(data) {
		$('.juzhong').hide();
		$('.maskLayer').css({'display': 'none'});
	});
	$('#Bonusrules').click(function(data) {
		$('.juzhong').show();
	});

	//0111
	//0110
	//返回回来的购买页面
	var frontamt=param.amount;//上次输入的投资金额
	var expect=param.expect;//上次预期收益
	if(frontamt!=null && frontamt !=undefined){
		$input.val(frontamt);
		// 开年红包
		if((cycle == 2 || cycle == 4 || cycle == 8 || cycle == 12 || cycle == 26 || cycle == 52 )&& prodType == 3){
				if(frontamt >= 50000 && flagKNHB == 1){
				startrate = 0.5;
			}
		}
		$payMoney.text('确认加入'+Common.comdify(frontamt)+'元');
		// if(jxspan != 0 && jxspan !=undefined && jxspan !=null){
  //       	$expectmoney.html(expect + ""+jxspan +"" ); //预期收益
  //      	}else{
  //      		$expectmoney.html(expect)
  //      	}
		// $expectmoney.html(expect);
		ifAddInterest();//取得regularRate(考虑minrate addrate addintrstrate)	

		haveuse=sessionStorage.getItem('haveuse');//加息券体验金投资红包页面已经用掉的权重
		if (haveuse!=null && haveuse!=undefined) {
	  		justforuse=maxPrivilege-haveuse;//勾选后当前剩余权重
	  	} else {
	  		justforuse=maxPrivilege;	
	  	}

	  	cp_data={//{pid,amount,expect}
			pid:pid,
			amount:frontamt,
			expect:expect,
            cycle:cycle,
            regularRate:regularRate,
            interest:interest,
            pagebuy:0,
			justforuse:justforuse
		};
		clicktype=sessionStorage.getItem('clicktype');//1---加息券   2---投资红包   3---体验金  选择类型
        var pro = 0.00;
        var _pro = 0;
        var _resData=0;
        var _jxs = 0;
        var _jx = 0;
        var _jxss = 0.00;
        var _jxsData = 0;
		//
		//加息券---------1
		if (clicktype==1) {
			if(sessionStorage.getItem('vjr_selectedConpon')!=undefined&&sessionStorage.getItem('vjr_selectedConpon')!=''){
				vjr_selectedConponObj=JSON.parse(sessionStorage.getItem('vjr_selectedConpon'));
				//已选加息券对象数组
				if (vjr_selectedConponObj.length>0) {
					for(var i=0;i<vjr_selectedConponObj.length;i++){
						console.log('优惠券type',vjr_selectedConponObj[i].type)
						if(vjr_selectedConponObj[i].type==1){
							addCouponHtml+='+'+vjr_selectedConponObj[i].privilege+"%"+"("+vjr_selectedConponObj[i].cycleTime+'天'+")"+'&nbsp';
                            _pro = parseFloat(parseFloat(frontamt)*parseFloat(vjr_selectedConponObj[i].privilege)*parseFloat(vjr_selectedConponObj[i].cycleTime)/36500).toFixed(2);
                            _resData = parseFloat(_resData) + parseFloat(_pro);
                            pro = parseFloat(((parseFloat(expect)+parseFloat(_resData))*365/(parseFloat(cycle)*7*parseFloat(frontamt))*100).toFixed(2));
                            jxdata+= _pro +'+';
                            _jxsData = _jxsData + _pro;
                            _jxs = _jxs + parseFloat(_pro);
                            ctype = 1;
                            eightRate = pro*1 + activityRate*1 - regularRate*1;

                        }else if(vjr_selectedConponObj[i].type==2){
							addCouponHtml+=vjr_selectedConponObj[i].privilege+"%"+'(全程)'+'&nbsp';
							jxdata+=parseFloat(parseFloat(frontamt)*parseFloat(vjr_selectedConponObj[i].privilege)*parseFloat(7*cycle)/36500).toFixed(2)+'+';
                            _jxss = parseFloat(parseFloat(frontamt)*parseFloat(vjr_selectedConponObj[i].privilege)*parseFloat(7*cycle)/36500).toFixed(2);
                            _jxsData = _jxsData + _jxss;
                            //_resData = parseFloat(_resData) + parseFloat(_pro);
                            pro =  parseFloat(parseFloat(regularRate) + parseFloat(vjr_selectedConponObj[i].privilege)).toFixed(2);
                            _jx = parseFloat(parseFloat(frontamt)*parseFloat(vjr_selectedConponObj[i].privilege)*parseFloat(7*cycle)/36500).toFixed(2);
                            _jxs = _jxs + parseFloat(_jx);
                            ctype = 1;
                            eightRate = pro*1 + activityRate*1 - regularRate*1;
            				// $('.812redrate').html('+' + parseFloat(eightRate).toFixed(2) + '%');
                        }else if(vjr_selectedConponObj[i].type==3){
							addCouponHtml+=vjr_selectedConponObj[i].privilege+"元"+'体验金'+'&nbsp';
                            _pro = parseFloat(parseFloat(frontamt)*regularRate*parseFloat(vjr_selectedConponObj[i].cycleTime)/36500).toFixed(2);
                            _resData = parseFloat(_resData) + parseFloat(_pro);
                            pro = parseFloat(((parseFloat(expect)+parseFloat(_resData))*365/(parseFloat(cycle)*7*parseFloat(frontamt))*100).toFixed(2));
                            jxdata+= _pro +'+';
                            _jxsData = _jxsData + _pro;
                            //pro += parseFloat(parseFloat((parseFloat(expect)+parseFloat(_pro))*365/(cycle*7*parseFloat(frontamt))).toFixed(2));
                            ctype = 3;
                            _jxs = _jxs + parseFloat(_pro);
                            eightRate = pro*1 + activityRate*1 - regularRate*1;
                        }else if(vjr_selectedConponObj[i].type==5){
							addCouponHtml+=+vjr_selectedConponObj[i].privilege+"元"+'投资红包'+'&nbsp';
                            _pro = parseFloat(vjr_selectedConponObj[i].privilege).toFixed(2);
                            _resData = parseFloat(_resData) + parseFloat(_pro);
                            pro = parseFloat(((parseFloat(expect)+parseFloat(_resData))*365/(parseFloat(cycle)*7*parseFloat(frontamt))*100).toFixed(2));
                            //pro += parseFloat(parseFloat((parseFloat(expect)+parseFloat(_pro))*365/(cycle*7*parseFloat(frontamt))).toFixed(2));
                            jxdata+=_pro+'+';
                            _jxsData = _jxsData + _pro;
                            _jxs = _jxs + parseFloat(_pro);
                            ctype = 2;

                            // 开年红包
                            startrate = parseFloat(pro*1 + startrate - regularRate).toFixed(2);
    						$('.startrate').html('+'+startrate+'%');


						}
						// console.log('_resData',_resData)
						// console.log('预期收益：',expect)
						// console.log('投资金额：',frontamt)
						// console.log('pro',pro)
						var couponid=vjr_selectedConponObj[i].id;
						var couponTitleList = vjr_selectedConponObj[i].title;
						couponIds[i]=couponid;
					}

					jxdata=jxdata.substr(0,jxdata.length-1);

                    //console.log(JSON.stringify(_jxs))
                    //Common2.toast($('#jxspan').html())
                    cp_data.interest = _interest;
                    var _textAddCouponHtml = '可使用优惠券';
			  		$('.couponLeftImg').addClass('visible');
			  		$('.addcoupon span').css('margin-right','0.7rem');
		   			$('.usecoupon').attr('href', '../../pages/my-account/reward/myCoupon.html?'+ $.param(cp_data));

                    if(addCouponHtml != undefined && addCouponHtml != '' && addCouponHtml != null && addCouponHtml != 0) {
                        _textAddCouponHtml = couponTitleList
                    }

					$("#addcoupon").addClass('used').html(_textAddCouponHtml);
                    //sessionStorage.setItem('slreValue',_interest);
                    var _sl = sessionStorage.getItem('slreValue');
                    if(_sl == undefined || _sl == null || _sl == '') {
                        _sl = 0;
                    }
					$('#jxspan').html(_sl);
					jxspan = _sl;
                    // $('#annual').html(pro + '%');
					// $('.jxdata').slideDown();
				}else{
					
				}
			}
			if(jxspan != 0 && jxspan !=undefined && jxspan !=null){
	        	// $expectmoney.html(expect + "+"+jxspan +"" ); //预期收益
       			// $expectmoney.html(expect + "+（优惠券）"+jxspan + "+（红利）"+redexpect + "+（开年）"+ startredexpect+ "+（尊享）" + eightexpect );
        	$expectmoney.html(parseFloat(expect*1 + jxspan*1 + redexpect*1 + startredexpect*1 + eightexpect*1).toFixed(2));


	       	}else{
	       		// $expectmoney.html(expect)
       			// $expectmoney.html(expect+ "+（红利）"+redexpect + "+（开年）"+ startredexpect+ "+（尊享）" + eightexpect );
        	$expectmoney.html(parseFloat(expect*1 + redexpect*1 + startredexpect*1 + eightexpect*1).toFixed(2));


	       	}
			$('.usecoupon').attr('href', '../../pages/my-account/reward/myCoupon.html?'+$.param(cp_data));
		}
		//
		//投资红包---------2
		if (clicktype==2) {
			if(sessionStorage.getItem('vjr_selectedRed')!=undefined&&sessionStorage.getItem('vjr_selectedRed')!=''){
				var vjr_selectedRedObj=JSON.parse(sessionStorage.getItem('vjr_selectedRed'));
				// console.log(vjr_selectedRedObj);//已选红包对象数组

				var addRedHtml='';
				var tzdata='';
				if (vjr_selectedRedObj.length>0) {				
					for(var i=0;i<vjr_selectedRedObj.length;i++){
						addRedHtml+=vjr_selectedRedObj[i].amount;
						var redid=vjr_selectedRedObj[i].id;
						redIds[i]=redid;
					}
					$("#addred").addClass('used').html(addRedHtml+'元');
					$('#tzspan').html(addRedHtml);
					$('.tzdata').slideDown();
					$("#addexperience").html('体验金不可和其他奖励同时使用');
					$("#addcoupon").html('全程加息券不可和其他奖励同时使用');
				}else{
					//vjr_selectedConponObj=JSON.parse(sessionStorage.getItem('vjr_selectedConpon'));
					vjr_selectedConponObj=sessionStorage.getItem('vjr_selectedConpon')==undefined?[]:JSON.parse(sessionStorage.getItem('vjr_selectedConpon'));
					//console.log(vjr_selectedConponObj);
					if (vjr_selectedConponObj.length>0) {
						for(var i=0;i<vjr_selectedConponObj.length;i++){
							if(vjr_selectedConponObj[i].addDays!=null || vjr_selectedConponObj[i].addDays!=undefined){
								addCouponHtml+='加息'+vjr_selectedConponObj[i].rate+"%"+"("+vjr_selectedConponObj[i].addDays+'天'+")"+'&nbsp';
								jxdata+=parseFloat(parseFloat(frontamt)*parseFloat(vjr_selectedConponObj[i].rate)*parseFloat(vjr_selectedConponObj[i].addDays)/36500).toFixed(2)+'+';
							}else{
								addCouponHtml+='加息'+vjr_selectedConponObj[i].rate+"%"+'(全程)'+'&nbsp';
								jxdata+=parseFloat(parseFloat(frontamt)*parseFloat(vjr_selectedConponObj[i].rate)*parseFloat(7*cycle)/36500).toFixed(2)+'+';
							}
							var couponid=vjr_selectedConponObj[i].id;
							couponIds[i]=couponid;
						}
						jxdata=jxdata.substr(0,jxdata.length-1);
						$("#addcoupon").addClass('used').html(addCouponHtml);
                        sessionStorage.setItem('slreValue',_interest);
						$('#jxspan').html(jxdata);
						jxspan = jxdata;
						// $('.jxdata').slideDown();
						$("#addexperience").html('体验金不可和其他奖励同时使用');
						$("#addred").html('投资红包不可和其他奖励同时使用');
						sessionStorage.setItem('clicktype',1);//1---加息券   2---投资红包   3---体验金  选择类型
					}else{
						$("#addcoupon").html('全程加息券不可和其他奖励同时使用');
						$("#addexperience").html('体验金不可和其他奖励同时使用');
						$("#addred").html('投资红包不可和其他奖励同时使用');						
					}

				}
			}
			$('.useinvestred').attr('href', '../../pages/my-account/reward/myInvestRed.html?'+$.param(cp_data)); 
			if (justforuse==0) {//剩余可选为0  则加息券 体验金都不能用  
				$('.investred').addClass('canclick');
				$('.usecoupon').removeAttr('href');
				$('.useexperience').removeAttr('href');
			} else {//剩余大于0  则三者都能用   
				$('.rowac').addClass('canclick');
				$('.usecoupon').attr('href', '../../pages/my-account/reward/myCoupon.html?'+$.param(cp_data));
				$('.useexperience').attr('href', '../../pages/my-account/reward/myExperience.html?'+$.param(cp_data));
			}	
		}
		//
		//体验金---------3
		if (clicktype==3) {
			if(sessionStorage.getItem('vjr_selectedExp')!=undefined&&sessionStorage.getItem('vjr_selectedExp')!=''){
				var vjr_selectedExpObj=JSON.parse(sessionStorage.getItem('vjr_selectedExp'));
				// console.log(vjr_selectedExpObj);//已选体验金对象数组

				var addExpHtml='';
				var expRate=parseFloat(minRate)+parseFloat(addRate);
				var tydata;
				if (vjr_selectedExpObj.length>0) {
					for(var i=0;i<vjr_selectedExpObj.length;i++){
						addExpHtml+=vjr_selectedExpObj[i].voucherAmount;
						tydata=parseFloat(parseFloat(vjr_selectedExpObj[i].voucherAmount)*parseFloat(vjr_selectedExpObj[i].addDays)*parseFloat(expRate)/36500).toFixed(2);
						var expid=vjr_selectedExpObj[i].id;
						expIds[i]=expid;
					}
					$("#addexperience").addClass('used').html(addExpHtml+'元');
					$('#tyspan').html(tydata);
					$('.tydata').slideDown();
					$("#addcoupon").html('全程加息券不可和其他奖励同时使用');
					$("#addred").html('投资红包不可和其他奖励同时使用');
				}else{
					//vjr_selectedConponObj=JSON.parse(sessionStorage.getItem('vjr_selectedConpon'));
					vjr_selectedConponObj=sessionStorage.getItem('vjr_selectedConpon')==undefined?[]:JSON.parse(sessionStorage.getItem('vjr_selectedConpon'));
					// console.log(vjr_selectedConponObj);
					if (vjr_selectedConponObj.length>0) {
						for(var i=0;i<vjr_selectedConponObj.length;i++){
							if(vjr_selectedConponObj[i].addDays!=null || vjr_selectedConponObj[i].addDays!=undefined){
								addCouponHtml+='加息'+vjr_selectedConponObj[i].rate+"%"+"("+vjr_selectedConponObj[i].addDays+'天'+")"+'&nbsp';
								jxdata+=parseFloat(parseFloat(frontamt)*parseFloat(vjr_selectedConponObj[i].rate)*parseFloat(vjr_selectedConponObj[i].addDays)/36500).toFixed(2)+'+';
							}else{
								addCouponHtml+='加息'+vjr_selectedConponObj[i].rate+"%"+'(全程)'+'&nbsp';
								jxdata+=parseFloat(parseFloat(frontamt)*parseFloat(vjr_selectedConponObj[i].rate)*parseFloat(7*cycle)/36500).toFixed(2)+'+';
							}
							var couponid=vjr_selectedConponObj[i].id;
							couponIds[i]=couponid;
						}
						jxdata=jxdata.substr(0,jxdata.length-1);
						$("#addcoupon").addClass('used').html(addCouponHtml);
                        sessionStorage.setItem('slreValue',_interest);
						$('#jxspan').html(_interest);
						jxspan = _interest;

						// $('.jxdata').slideDown();
						$("#addexperience").html('体验金不可和其他奖励同时使用');
						$("#addred").html('投资红包不可和其他奖励同时使用');
						sessionStorage.setItem('clicktype',1);//1---加息券   2---投资红包   3---体验金  选择类型
					}else{
						$("#addcoupon").html('全程加息券不可和其他奖励同时使用');
						$("#addexperience").html('体验金不可和其他奖励同时使用');
						$("#addred").html('投资红包不可和其他奖励同时使用');						
					}

				}
			}			
			$('.useexperience').attr('href', '../../pages/my-account/reward/myExperience.html?'+$.param(cp_data)); 
			if (justforuse==0) {//剩余可选为0  则加息券 体验金都不能用  
				$('.experience').addClass('canclick');
				$('.usecoupon').removeAttr('href');
				$('.useinvestred').removeAttr('href');
			} else {//剩余大于0  则三者都能用   
				$('.rowac').addClass('canclick');
				$('.usecoupon').attr('href', '../../pages/my-account/reward/myCoupon.html?'+$.param(cp_data));
				$('.useinvestred').attr('href', '../../pages/my-account/reward/myInvestRed.html?'+$.param(cp_data));
			}	
		}	
		clicktype=sessionStorage.getItem('clicktype');//1---加息券   2---投资红包   3---体验金  选择类型
		donetyp();/* 默认执行一次计算金额*/
	}else{
		removegift();/* 默认执行一次计算金额*/
	}
    var _vjr_selectedConpon_id = sessionStorage.getItem('vjr_selectedConpon_id');
    //存储当前已选择的加息券
    if(ctype == 1) {
        var coupons=JSON.stringify(couponIds);
        sessionStorage.setItem('vjr_couponIds',coupons);
    }

    if(ctype == 2) {
        //存储当前已选择的投资红包
        //var reds=JSON.stringify(redIds);
        var reds=JSON.stringify(couponIds);
        sessionStorage.setItem('vjr_redIds',reds);
    }

    if(ctype == 3) {
        //存储当前已选择的体验金
        //var exps=JSON.stringify(expIds);
        var exps=JSON.stringify(couponIds);
        sessionStorage.setItem('vjr_expIds',exps);
    }

	//console.log(sessionStorage.getItem('vjr_couponIds'))


  //   var selectedConpon_id = sessionStorage.getItem('vjr_selectedConpon_id');
  //   if(selectedConpon_id == 0) {
  //       // $('#addcoupon').html('可使用优惠券');
  //       $('#addcoupon').html('无可用优惠券'); 
		// $('.couponLeftImg').removeClass('visible');
  // 		$('.addcoupon span').css('margin-right','0.32rem');
		// $('.usecoupon').attr('href', 'javascript:;');
  //   }
  //   if(selectedConpon_id == null || selectedConpon_id == '') {
  //       // $('#addcoupon').html('请重新输入金额');
  //       // $('#addcoupon').html('可使用优惠券');
  //       $('#addcoupon').html('无可用优惠券'); 
		// $('.couponLeftImg').removeClass('visible');
  // 		$('.addcoupon span').css('margin-right','0.32rem');	
		// $('.usecoupon').attr('href', 'javascript:;');
  //   }

    /*输入密码页面*/
    function payHtml(){
		sessionStorage.setItem('cycle',cycle);
		sessionStorage.setItem('clicktype',ctype);
    	$.ajax({
			url:'./pay2.html',
			dataType:'html',
			async:false,
			success:function(e){
				$('.wrapper').append(e)
			}
		})
    }

    /*清楚礼券收益*/
    function removegift(){
    	$('#jxspan').html('0.00');
    	jxspan = 0;
		// $('.jxdata').hide();
    	sessionStorage.removeItem('vjr_selectedConpon_id');
    	sessionStorage.removeItem('vjr_selectedConpon');
    	sessionStorage.removeItem('slreValue');
    	sessionStorage.removeItem('haveuse');
    	sessionStorage.removeItem('clicktype');
    }

   
    function redrate(money){
    	console.log(money == '')
    	if(money == ''){
    		money = 0;
    		expect = 0;
    		eightexpect = 0;
			startredexpect = 0;

    	}
    	//尊享加息标
		if((activityRate != 0 && (investTerm == 8 || investTerm == 12)) || eightRate != 0){
			regularRate=parseFloat(minRate);
    		eightexpect = parseFloat(percent*money*activityRate/100);
            $('.812redrate').html('+' + parseFloat(eightRate).toFixed(2) + '%');
		}else{
			$('.812redrate').html('');
		}

		/*全场达标红利*/
		if(flagQCDB == 1){
			if(money >= 10000){
		    	var num = 10000;
		    	rate = parseInt(money/num)/10;
		    	rate =  rate <= 1 ? rate : 1;
		    	redexpect = parseFloat(percent*money*rate/100);
		    	$('.redrate').html('+' + rate + '%');
				
		    }else{
		    	rate = 0;
		    	redexpect = 0;
		    	$('.redrate').html('');
		    }
		}else{
			rate = 0;
	    	redexpect = 0;
	    	$('.redrate').html('');
		}
    	
	    /*开年红包*/
    	if(money >= 50000 && flagKNHB == 1){
			startredexpect = parseFloat(percent*money*0.5/100);
			if((cycle == 2 || cycle == 4 || cycle == 8 || cycle == 12 || cycle == 26 || cycle == 52 )&& prodType == 3){
				if(pro == null || pro == 0){
					startrate = 0.5;
				}
			}
			$('.startrate').html('+'+startrate+'%');
		}else{
			startredexpect = 0;
			startrate = 0;
    		$('.startrate').html('');
		}
    	// console.log(expect,jxspan,redexpect, startredexpect, eightexpect)

    }
});
