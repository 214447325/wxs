/** buy.js
 * @author zyx
 * @return {[type]}       [description]
 */

//起投金额HTML事件控制
 function limitInput(){
  sessionStorage.removeItem('buy-pro');
  var $buy = $('.page-buy');
  var $input = $('.money-input input', $buy);
  //var $month = $('.money-input .month',$buy);
  var param = Common.getParam();
  var money = $.trim($input.val());
  var value=parseFloat(money);
  var max=param.maxInvestAmount;
 //  if(parseInt(value)>max){
 //     alert('单笔最大金额为100万');
 //     $input.val('');
 //  }
 }


$(function(){
  sessionStorage.removeItem('buy-pro');
  var $buy = $('.page-buy');
  var $profit = $('.profit', $buy); // 收益
  var $total = $('.total', $buy);
  var $title = $('.title', $buy);
  var $balanceAccount = $('.balanceAccount', $buy);
  var $minInterest = $('.min', $buy);
  var $month = $('.money-input .month',$buy);
  var $ui_list = $('.ui-list',$buy);
  var $select  = $('ul',$ui_list);
  var $ui_dialog = $('.ui-dialog');
  var $agreement = $('.agreement');
  var $weightValue = $('.weightValue');
  var $buyshare = $('.buyshare');
  var $floatMoney = $('.floatMoney');
  var $expectmoney = $('.expectmoney');
  var cycle;
  var cycleType;
  var floatMoney;
  var expectMin;
  var Rate;
  var $selfExtra = $('.selfExtra');
  var timeLineFlag = false; //判断是否为倒计时
  var time;
  var num;
  var SysSecond;
  var InterValObj;
  var yuyue = false;//定期的预约申请
  var param = Common.getParam();
  //var minInvestAmount =   param.minInvestAmount;//最小可投份额
  var $autoisJoinInvite = $('.auto', $buy);
  var $sevdaycontent = $('.sevdaycontent', $buy);
  
  var isJoinInvite = 1;// 默认参加活动
  $selfExtra.text(0);
  //var ja = document.getElementById('joinActive');
  var buyshare;

  var timeType2;
  var $amount = $('.amount');
  

    //设置不显示，设置不勾选
  //ja.checked = true;
  //ja.style.backgroundImage = "url('../../images/pages/buy7day_true.png')";
  isJoinInvite = 1;
  
  var $payMoney = $('.pay-money',$buy);
  var $limitmoney=$('.limitmoney',$buy);//限制输入金额

  if(!param.pid || !param.pname || !param.balanceAccount || !param.minInterest || !param.minInvestAmount || !param.maxInvestAmount){
    alert('参数有误！！');
    window.location.href = Setting.staticRoot + '/pages/index.html';
    return false;
  }

  // 如果不是体验金,隐藏体验金ui
  //if(param.type != 'novice'){
  //  $ui_list.hide();
  //}else{
  //  $input.attr("readonly","readonly");
  //}
  //if(param.type == 'current'){
  //  $month.text('每月');
  //}

  var balanceAccount = parseFloat(param.balanceAccount);
  var weightValue = param.weightValue;//净值
  param.minInterest = parseFloat(param.minInterest);
  param.minInvestAmount = parseFloat(param.minInvestAmount);
  param.maxInvestAmount = parseFloat(param.maxInvestAmount);
  var userId = sessionStorage.getItem('uid');
  var account;
  var noviceId;

  if(!userId){
    Common.toLogin();
    return false;
  }
  
  var amount1 = 0;
  /**
   * 检查是否设置交易密码
   */
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
  
//产品概要接口
  $.ajax({
    url:Setting.apiRoot1 + '/queryProdInfo.p2p',
    type:"post",
    dataType:'json',
    data:{
     loanType:1,
     type:4
    }
  }).done(function(res){
      if(res.code==1){
		var data=res.data;
		var loanId=data[0].productId;
		cycle=data[0].cycle;
		cycleType=data[0].cycleType;
		Rate=data[0].minRate;
		//alert(Rate);
          
		$amount.text(Common.comdify(data[0].amount));//可购份额
           amount1=data[0].amount;
           //getFloatBuyValue(cycleType, amount1);
           //alert(amount1);
      }else{
        alert(res.message);
          return false;
      }

  }).fail(function(){
    alert('网络链接失败');
    return false
  });

  
  /**
   * 设置页面数据
   */
  !function(){
    $title.text(param.pname);
    $balanceAccount.text(Common.comdify(balanceAccount.toFixed(2)));//账户余额
    $weightValue.text(weightValue);//单位净值 
    $minInterest.text(param.minInvestAmount);
    $('.buyshare').val('起投份额'+ param.minInvestAmount);
    //$input.attr('placeholder', '起投份额'+ param.minInvestAmount /*+'的整数倍'*/);
  }();

  // 添加体验金数据
  +function(){
    var __li = doT.template([
      '{{~it: item:index}}',
      '<li>',
        '<div class="slideOne">',
            '<input type="checkbox" name="check" value="{{=item.id}}" amount="{{=item.amount}}">',
          '<i></i>',
          '<label for="slideOne"></label>',
        '</div>',
        '<div  class="pl30 fz24">可用体验金 <span class="red">{{=item.amount}}</span></div>',
      '</li>',
      '{{~}}'
    ].join(''));
    if(param.type == 'novice'){
      $.ajax({
        url: Setting.apiRoot1 + '/u/getMyReward.p2p',
        type: 'post',
        dataType:'json',
        data:{
          userId : userId,
          rewardType: 2,
          loginToken:sessionStorage.getItem('loginToken')
        },
      }).done(function(res){
        Common.ajaxDataFilter(res,function(){
          var list = res.data.rewardResultList;
          var _str = '';
          var _list = [];
          for(var i in list){
            if(list[i].status == 1){
              _list.push(list[i]);
            }
          }
          $select.html(__li(_list));
        });
      }).fail(function(){
        alert('体验金数据抓取失败，请刷新重试！');
        return false;
      });
    }
  }();
  
  /**
   * page Event
   */
  // $buy.on('click','input[name="check"]',function(){
  //    var index = $(this).index();
  //    if($(this).is(':checked')){
  //      $('input[name="check"]').prop("checked",false);
  //      $(this).prop("checked",true);
  //      var _amount = $(this).attr('amount');
  //      $input.val(_amount);
  //    }else{
  //       $(this).prop("checked",false);
  //       $input.val(0);
  //    }
  //    $input.focus().change();
  // });


      
//键盘弹起事件
$buyshare.on('keyup',function(){
  //getFloatBuyValue(cycleType, amount1);
    activeFloat(cycleType, amount1);
  });


  function activeFloat(cycleType, amount1)  {
      buyshare = $.trim($buyshare.val());
      if(buyshare != null && buyshare != '') {
          floatMoney=parseFloat(buyshare*weightValue).toFixed(2);
          $floatMoney.html(floatMoney);
          var expectMin = 0;
          var expectMax = 0;
          if( cycleType==1){
              percent = cycle / 365;//日
          }else if(cycleType==2){
              percent = cycle*30 /365;//月
          }else if(cycleType == 3){
              percent =cycle*365 /365;//年
          }else if(cycleType == 4){
              percent = cycle*7 /365;//周
          }
          expectMin =parseFloat(expectMin +percent*floatMoney*0.08).toFixed(2);
          expectMax =parseFloat(expectMax +percent*floatMoney*Rate/100).toFixed(2);
          $expectmoney.html(expectMin+'~'+expectMax); //预期收益
          //var joinActive = document.getElementById('joinActive');
          //if (joinActive.checked == true) {
          var selfExtra = 0;
          if(floatMoney != 0 && floatMoney != '' && floatMoney != null) {
              $.post(Setting.apiRoot1 + '/investGetCoupon.p2p',function(res) {
                  var _data = res.data.regular.regularList;
                  for (var i = 0; i < _data.length; i++) {
                      if(parseInt(floatMoney) >= parseInt(_data[i].paramKey)) {
                          selfExtra = _data[i].spare2;
                      }
                  }
                  $selfExtra.html(selfExtra);
              });
          }

          //if(floatMoney<1000){
          //    $selfExtra.text(0);
          //}else if(floatMoney<5000){
          //    selfExtra = 5;
          //}else if(floatMoney<10000){
          //    selfExtra = 25;
          //}else if(floatMoney<20000){
          //    selfExtra = 50;
          //}else if(floatMoney<30000){
          //    selfExtra = 100;
          //}else if(floatMoney<60000){
          //    selfExtra = 200;
          //}else if(floatMoney<100000){
          //    selfExtra = 400;
          //}else if(floatMoney<200000){
          //    selfExtra = 800;
          //}else if(floatMoney<500000){
          //    selfExtra = 2000;
          //}else if(floatMoney<800000){
          //    selfExtra = 6000;
          //}else if(floatMoney<1000000){
          //    selfExtra = 10000;
          //}else{
          //    selfExtra = 13000;
          //}
          $selfExtra.text(selfExtra);
          if( buyshare > amount1) {
              $buyshare.val(amount1);
              expectMin = 0;
              expectMax = 0;
              floatMoney=parseFloat(amount1*weightValue).toFixed(2);
              $floatMoney.html(floatMoney);
              expectMin =parseFloat(expectMin +percent*floatMoney*0.08).toFixed(2);
              expectMax =parseFloat(expectMax +percent*floatMoney*Rate/100).toFixed(2);
              $expectmoney.html(expectMin+'~'+expectMax); //预期收益
          }
          //} else {
          //    $selfExtra.text();
          //}
      }
  }


 //function getFloatBuyValue(cycleType, amount1) {
 //       buyshare = $.trim($buyshare.val());
 //       if(buyshare != null && buyshare != '') {
 //           floatMoney=parseFloat(buyshare*weightValue).toFixed(2);
 //           $floatMoney.html(floatMoney);
 //           var expectMin = 0;
 //           var expectMax = 0;
 //           if( cycleType==1){
 //               percent = cycle / 365;//日
 //           }else if(cycleType==2){
 //               percent = cycle*30 /365;//月
 //           }else if(cycleType == 3){
 //               percent =cycle*365 /365;//年
 //           }else if(cycleType == 4){
 //               percent = cycle*7 /365;//周
 //           }
 //           expectMin =parseFloat(expectMin +percent*floatMoney*0.08).toFixed(2);
 //           expectMax =parseFloat(expectMax +percent*floatMoney*Rate/100).toFixed(2);
 //           $expectmoney.html(expectMin+'~'+expectMax); //预期收益
 //           var joinActive = document.getElementById('joinActive');
 //           if (joinActive.checked == true) {
 //               var selfExtra = 0;
 //               if(floatMoney<1000){
 //                   $selfExtra.text(0);
 //               }else if(floatMoney<5000){
 //                   selfExtra = 5;
 //               }else if(floatMoney<10000){
 //                   selfExtra = 25;
 //               }else if(floatMoney<20000){
 //                   selfExtra = 50;
 //               }else if(floatMoney<30000){
 //                   selfExtra = 100;
 //               }else if(floatMoney<60000){
 //                   selfExtra = 200;
 //               }else if(floatMoney<100000){
 //                   selfExtra = 400;
 //               }else if(floatMoney<200000){
 //                   selfExtra = 800;
 //               }else if(floatMoney<500000){
 //                   selfExtra = 2000;
 //               }else if(floatMoney<800000){
 //                   selfExtra = 6000;
 //               }else if(floatMoney<1000000){
 //                   selfExtra = 10000;
 //               }else{
 //                   selfExtra = 13000;
 //               }
 //               $selfExtra.text(selfExtra);
 //               if( buyshare > amount1) {
 //                   $buyshare.val(amount1);
 //                   expectMin = 0;
 //                   expectMax = 0;
 //                   floatMoney=parseFloat(amount1*weightValue).toFixed(2);
 //                   $floatMoney.html(floatMoney);
 //                   expectMin =parseFloat(expectMin +percent*floatMoney*0.08).toFixed(2);
 //                   expectMax =parseFloat(expectMax +percent*floatMoney*Rate/100).toFixed(2);
 //                   $expectmoney.html(expectMin+'~'+expectMax); //预期收益
 //               }
 //           } else {
 //               $selfExtra.text();
 //           }
 //       }
 //   }

  
  //活动勾选框
  //$buy.on('click','input[name="joinActiveChk"]',function() {
  //  var joinActive = document.getElementById('joinActive');
  //  if (joinActive.checked == true) {
  //  joinActive.style.backgroundImage = "url('../../images/pages/buy7day_true.png')";
  //  isJoinInvite = 1;
  //  var selfExtra = 0;
  //       if(floatMoney<1000){
	//	      ja.checked = '';
	//		  ja.style.backgroundImage = "url('../../images/pages/buy7day_bg.png')";
	//		  isJoinInvite = 0;
	//	      alert('参加活动起投金额最低1000元');
	//	      return false;
	//      }else if(floatMoney<5000){
	//        selfExtra = 5;
	//      }else if(floatMoney<10000){
	//        selfExtra = 25;
	//      }else if(floatMoney<20000){
	//        selfExtra = 50;
	//      }else if(floatMoney<30000){
	//        selfExtra = 100;
	//      }else if(floatMoney<60000){
	//        selfExtra = 200;
	//      }else if(floatMoney<100000){
	//        selfExtra = 400;
	//      }else if(floatMoney<200000){
	//        selfExtra = 800;
	//      }else if(floatMoney<500000){
	//        selfExtra = 2000;
	//      }else if(floatMoney<800000){
	//        selfExtra = 6000;
	//      }else if(floatMoney<1000000){
	//        selfExtra = 10000;
	//      }else if(floatMoney==undefined ||floatMoney==null){
  //            selfExtra = 0;
  //         }else{
	//        selfExtra = 13000;
	//      }
	//      $selfExtra.text(selfExtra);
	//  } else {
	//    joinActive.style.backgroundImage = "url('../../images/pages/buy7day_bg.png')";
	//    isJoinInvite = 0;
	//    $selfExtra.html('勾选参加邀请活动会获得活动奖励');
	//  }
  //
  //});

  //充值跳转
  $buy.on('click','.rechargeBtn',function() {
    
    window.location.href = Setting.staticRoot + '/pages/my-account/topup-cash.html?';
    
   });

    var $buy = $('.page-buy');
    var $input = $('.money-input input', $buy);
  $buy.on('click', '.pay-money', function(){
    var $this = $(this);
     if(buyshare>amount1){
      alert("超过可够份额");
      return false;
     }
    if(yuyue || timeLineFlag){
      $ui_dialog.show();
      return false;
    }

    if($this.hasClass('disabled')){
      return false;
    }

    if(floatMoney <= 0){
      alert('输入的金额需大于0元');
      $input.val('');
      return false;
    }

    if(!Common.reg.money.test(floatMoney)){
      alert('输入金额无效！');
      $input.val('');
      return false;
    }
    
    var buyshare = $('.buyshare').val();
    if(buyshare < param.minInvestAmount){
      alert('投资份额不能小于'  + param.minInvestAmount + '份');
      return false;
    }

    //如果是新手标,用体验金购买
    if(param.type == 'novice'){
      var $radio   = $('input[name="check"]:checked',$ui_list);
      var _amount  = $radio.attr('amount');
      var noviceId = $radio.val();
      if(parseFloat(floatMoney) > _amount){
        alert('投资金额不能大于体验金金额');
        return false;
      }
    }else{
      if(parseFloat(floatMoney) > balanceAccount.toFixed(2)){
        alert('投资金额不能大于账户余额');
        $input.val('');
        return false;
      }
      if(parseFloat(floatMoney) < param.minInvestAmount.toFixed(2)){
        alert('投资金额不能小于最小可投份额');
        $input.val('');
        return false;
      }

      if(parseFloat(floatMoney) > param.maxInvestAmount.toFixed(2)){
        alert('投资金额不能大于单笔最大投资额'+param.maxInvestAmount);
        $input.val('');
        return false;
      }
    }

    var post = {
      investAmt: floatMoney,
      prodId: param.pid
    }
    sessionStorage.setItem('buy-pro', JSON.stringify(post));
    if(param.type == 'novice'){
      window.location.href = 'floatpay.html?noviceId='+noviceId ;
    }else{
      window.location.href = 'floatpay.html?isJoinInvite='+isJoinInvite+'&floatMoney='+floatMoney+'&weightValue='+parseFloat(weightValue)+'&buyshare='+buyshare;
    }
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

  $('.content-Img0').click(function(data) {
    $('.juzhong').hide();
    $('.maskLayer').css({'display': 'none'});
});

$('#Bonusrules').click(function(data) {
    $('.juzhong').show();
});
  
});
