/** buy.js
 * @author zyx
 * @return {[type]}       [description]
 */


$(function(){//购买择时稳赢一期
	sessionStorage.removeItem('buy-pro');
	var $buy = $('.page-buy');//body
	var $back=$('.back');//返回上一页按钮
	var $title=$('.title');
	var $amount = $('.amount', $buy);//可投余额(标的余额)
	var $balanceAccount = $('.balanceAccount');//账户余额
	var $buyshare = $('.buyshare');//浮动购买份额
	var $floatMoney = $('.floatMoney');//浮动购买金额
	var $weightValue = $('.weightValue');//单位净值
	var $agreement = $('.agreement');//投资协议
	var $expectmoney = $('.expectmoney');//预期收益
	var $full= $('.full');//全额按钮 
	var $selfExtra = $('.selfExtra');//活动奖励
	$selfExtra.text(0);//奖励默认显示0
	var $payMoney = $('.pay-money', $buy);//确定按钮
	var userId = sessionStorage.getItem('uid');//userid
	//param
	var param = Common.getParam();
	var jumpId= param.jumpId;//jump
	var pid=param.pid;//产品ID
	var pname=param.pname;//title
	var pmount=parseFloat(param.pmount);//可投余额(标的余额)
	var maxInvestAmount = parseFloat(param.maxInvestAmount);//最大投资金额
	var minInvestAmount =parseFloat(param.minInvestAmount);//最小起投金额
	var maxRate=param.maxRate;//最大利率
	var minRate=param.minRate;//最小利率
	var cycle=param.cycle;//周期时长
	var cycleType=param.cycleType;//周期类型
	var act11=param.act11;//是否参加投资立返活动
	// alert(cycleType);
	// alert(cycle);
	// alert(maxRate);
	// alert(minRate);
  	//定义全局
  	var buyshare;
	var currentWeight;//最新净值
	var floatMoney;//用户购买的份额*单位净值=购买金额
	var expectMin;//预期收益min
	var expectMax;//预期收益max
	var selfExtra;
            
            if (act11==0) {
            	   $('.selfExtra-row').hide();
            }
	if(!param.pid || !param.pname || !param.pmount || !param.minInvestAmount || !param.maxInvestAmount){
	alert('参数有误！！');
	window.location.href = Setting.staticRoot + '/pages/index.html';
	return false;
	}
	if(!userId){
	Common.toLogin();
	return false;
	}



	//检查是否设置交易密码
	!function(){
	$.ajax({
	  url: Setting.apiRoot1 + '/u/checkUserInfo.p2p',
	  type: 'post',
	  dataType: 'json',
	  data: {
	    userId: userId,
	    type: 2,
	    loginToken:sessionStorage.getItem('loginToken')
	    
	  }
	}).done(function(res){
	  Common.ajaxDataFilter(res, function(data){
	    if(data.code == -3){
	      alert(data.message);
	      $('.pay-money').addClass('disabled btn-gray').removeClass('btn-default');
	      return false;
	    }
	  });
	}).fail(function(){
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

	//购买页面刷新接口 取浮动产品的最新净值
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
	    if(data.code == 1){
	    	var data=res.data;
	    	console.log(data);
	    	currentWeight=parseFloat(data.currentWeight);
	    }
	  });
	}).fail(function(){
	  alert('网络链接失败，请刷新重试！');
	  return false;
	});
	}();  

	//设置页面显示数据
	!function() {
		document.title='购买'+pname;
		$amount.text(Common.comdify(pmount.toFixed(2)));//设置页面可投余额(标的余额)
		$balanceAccount.text(Common.comdify(accountAmt.toFixed(2)));//显示账户余额
		$weightValue.text(Common.comdify(currentWeight));//单位净值 
		$buyshare.attr('placeholder', '起投份额' +minInvestAmount);//投资输入框起投份额
	}();



      
	//键盘弹起事件
	$buyshare.on('keyup',function(){
		buyshare = $.trim($buyshare.val());
        if( buyshare == 0) {
            $buyshare.val(' ');
        }

		if (buyshare>pmount) {//输入金额>标的余额
	          		alert('投资份额不能大于可投余额'+pmount);
	          		//$buyshare.val(pmount);
                    $(this).val(' ');
                    $('.floatMoney').html('0.00');
                    return false;
	          	}
	          	if(buyshare>maxInvestAmount){//输入金额>最大投资金额
			alert('最大投资份额为'+maxInvestAmount);
			//$buyshare.val(maxInvestAmount);
                    $(this).val(' ');
                    $('.floatMoney').html('0.00');
                    return false;
	          	}
	          	buyshare = $.trim($buyshare.val());
		floatMoney=parseFloat(buyshare*currentWeight).toFixed(2);
		$floatMoney.html(floatMoney);
	          expectMin =parseFloat(210/365*floatMoney*minRate/100).toFixed(2);
	          expectMax =parseFloat(210/365*floatMoney*maxRate/100).toFixed(2);
	          $expectmoney.html(expectMin+'~'+expectMax); //预期收益

		if(floatMoney != 0 && floatMoney != '' && floatMoney != null) {
			// $.post(Setting.apiRoot1 + '/investGetCoupon.p2p',function(res) {
			// 	var _data = res.data.float.floatList;
			// 	for (var i = 0; i < _data.length; i++) {
			// 		if(parseInt(floatMoney) >= parseInt(_data[i].paramKey)) {
			// 		selfExtra = _data[i].spare2;
			// 		}
			// 	}
			// 	$selfExtra.html(selfExtra);
			// });
			selfExtra=parseFloat(floatMoney*act11/100).toFixed(2);
			$selfExtra.html(selfExtra);
		}
	});


  // function activeFloat(cycleType, amount1)  {
  //     buyshare = $.trim($buyshare.val());
  //     if(buyshare != null && buyshare != '') {
  //         floatMoney=parseFloat(buyshare*weightValue).toFixed(2);
  //         $floatMoney.html(floatMoney);
  //         var expectMin = 0;
  //         var expectMax = 0;
  //         if( cycleType==1){
  //             percent = cycle / 365;//日
  //         }else if(cycleType==2){
  //             percent = cycle*30 /365;//月
  //         }else if(cycleType == 3){
  //             percent =cycle*365 /365;//年
  //         }else if(cycleType == 4){
  //             percent = cycle*7 /365;//周
  //         }
  //         expectMin =parseFloat(expectMin +percent*floatMoney*0.08).toFixed(2);
  //         expectMax =parseFloat(expectMax +percent*floatMoney*Rate/100).toFixed(2);
  //         $expectmoney.html(expectMin+'~'+expectMax); //预期收益
  //         //var joinActive = document.getElementById('joinActive');
  //         //if (joinActive.checked == true) {
  //         var selfExtra = 0;
  //         if(floatMoney != 0 && floatMoney != '' && floatMoney != null) {
  //             $.post(Setting.apiRoot1 + '/investGetCoupon.p2p',function(res) {
  //                 var _data = res.data.regular.regularList;
  //                 for (var i = 0; i < _data.length; i++) {
  //                     if(parseInt(floatMoney) >= parseInt(_data[i].paramKey)) {
  //                         selfExtra = _data[i].spare2;
  //                     }
  //                 }
  //                 $selfExtra.html(selfExtra);
  //             });
  //         }
  //         $selfExtra.text(selfExtra);
  //         if( buyshare > amount1) {
  //             $buyshare.val(amount1);
  //             expectMin = 0;
  //             expectMax = 0;
  //             floatMoney=parseFloat(amount1*weightValue).toFixed(2);
  //             $floatMoney.html(floatMoney);
  //             expectMin =parseFloat(expectMin +percent*floatMoney*0.08).toFixed(2);
  //             expectMax =parseFloat(expectMax +percent*floatMoney*Rate/100).toFixed(2);
  //             $expectmoney.html(expectMin+'~'+expectMax); //预期收益
  //         }

  //     }
  // }


	  //充值跳转
	  $buy.on('click','.rechargeBtn',function() {
	    
	    window.location.href = Setting.staticRoot + '/pages/my-account/topup-cash.html?';
	    
	   });

  $buy.on('click', '.pay-money', function(){
    var $this = $(this);
    if($this.hasClass('disabled')){
      return false;
    }
    if(buyshare <= 0){
      alert('输入的份额需大于0');
      $input.val('');
      return false;
    }
    if(!Common.reg.money.test(buyshare)){
      alert('投资份额格式不正确！');
      $input.val('');
      return false;
    }
    if(buyshare < minInvestAmount){
      alert('投资份额不能小于最小可投份额'+minInvestAmount + '份');
      return false;
    }
  if(buyshare> maxInvestAmount){
    alert('投资份额不能大于可投份额'+maxInvestAmount);
   $buyshare.val('');
    return false;
  }
  if(parseFloat(floatMoney) > accountAmt.toFixed(2)){
    alert('投资金额不能大于账户余额');
    $buyshare.val('');
    return false;
  }




    var post = {
      investAmt: floatMoney,
      prodId: pid
    }
    sessionStorage.setItem('buy-pro', JSON.stringify(post));
      window.location.href = 'floatpay.html?floatMoney='+floatMoney+'&weightValue='+parseFloat(currentWeight)+'&buyshare='+buyshare;

  }).on('input change', '.money-input input', function(e){
//点击事件 购买进行验证后跳转
    var $this = $(this);
    var money = $.trim($this.val());

    money = parseFloat(money);

    if(isNaN(money)){
      //$this.val('');
      return false;
    }

    if(e.type == 'change'){
      $this.val(money.toFixed(2));
    }
  
    $total.text(money.toFixed(2) + '元');
  }).on('click', '.recharge', function(){
    var $this = $(this);
    if($this.hasClass('disabled')){
      return false;
    }

  });
  
  //查看细则点击弹出显示
  $('.Bonusrules').click(function(event) {
         $('.maskLayer').css('display','block');
       $('#center').removeClass('center').addClass('centerOpen');
       $('.close').click(function(event) {
            $('.maskLayer').css('display','none');
            $('#center').removeClass('centerOpen').addClass('center');
       })
  }); 
  
  //购买协议点击跳转 
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
    
       window.location.href = "float-agreement.html?uName="+showName+"&uMobile="+phoneNum+"&uSFZ="+cardNum;
     });

  $('.content-Img').click(function(data) {
    $('.juzhong').hide();
    $('.maskLayer').css({'display': 'none'});
});

$('#Bonusrules').click(function(data) {
    $('.juzhong').show();
});
  
});
