/**
 * account index.js
 * @author tangsj
 * @return {[type]}       [description]
 */
$(function(){
	
  /**
   * 微信进来的访问判断，不是跳转到官网下载页
   * 20160226 zyx 
   */
  var isWeiXin = Common.isWeiXin();
	  
  var $account         = $('.my-account');
  var $accountAmt      = $('.accountAmt',$account);//可用金额
  var $onLandAmt       = $('.onLandAmt',$account); //在途资金
  var $inUseAmt        = $('.inUseAmt',$account);//在投金额
  var $yesterdayIncome = $('.yesterdayIncome',$account);//昨日总收益
  var $currentIncome   = $('.currentIncome',$account);//周周涨产品
  var $regularIncome   = $('.regularIncome',$account);//定期金额
  var $phone           = $('.phone',$account);
  var $avatar          = $('.avatar',$account);
  var $inuseAmt        = $('.inuseAmt',$account);

  var userId = sessionStorage.getItem('uid');

  if(!userId){
    Common.toLogin();
    return false;
  }
  
  var payChanel = 2;  //
  if(userId==1){
	  payChanel =1;
  }
  // 去充值
  $account.on('click', '.recharge', function(){
    var $this = $(this);

    if($this.hasClass('disabled')){
      return false;
    }
    // 调用充值跳转接口
    $this.addClass('disabled');
    var rurl = Setting.apiRoot1 + '/u/fy/recharge/goto.p2p';
    if(payChanel==1){
    	rurl = Setting.apiRoot1 + '/u/fy/recharge/goto.p2p';
    }
//    return false;
    $.ajax({
      url: rurl,
      type: 'post',
      dataType: 'json',
      data: {
        userId: userId,
        loginToken:sessionStorage.getItem('loginToken')
      }
    }).done(function(res){
      Common.ajaxDataFilter(res, function(res){
        if(res.code == 1){ // 已实名认证
          var fee = res.data.fee;
          var rechargeMin = res.data.rechargeMin;
          var cardlist = {};
          if(res.data.cardList.length > 0){
            cardlist = res.data.cardList[0];
          }
          
          var param = {
        	fee: fee || 0,
            acctName:cardlist.acctName || '',
            agreeNo:cardlist.agreeNo || '',
            bankCode:cardlist.bankCode || '',
            bankName:cardlist.bankName || '',
            cardNo: cardlist.cardNo || '',
            cardType:cardlist.cardType,
            rechargeMin: rechargeMin || 100,
            bindType :cardlist.bindType
          }
          
          if(payChanel==1){
          	window.location.href = Setting.staticRoot + '/pages/my-account/top-upFY.html?' + $.param(param);
          }else{
          	window.location.href = Setting.staticRoot + '/pages/my-account/top-upFY.html?' + $.param(param);
          }
          
        }else if(res.code == -2){ // 未实名认证
          $this.removeClass('disabled');
          confirm('您还未完成实名认证，请先完成实名认证！', function(){
            window.location.href = Setting.staticRoot + '/pages/my-account/setting/real-name.html';
          });
        }else{	
          alert(res.message);
          $this.removeClass('disabled');
          return false;
        }
      });
    }).fail(function(){
      alert('网络链接失败');
      $this.removeClass('disabled');
      return false;
    });

 
  }).on('click', '.cash', function(){
    var $this = $(this);

    if($this.hasClass('disabled')){
      return false;
    }

    // 调用提现跳转接口
    $this.addClass('disabled');
    
   var withUrl = Setting.apiRoot1 + '/u/rb/extract/goto.p2p';
    if(payChanel==1){
    	withUrl = Setting.apiRoot1 + '/u/extract/goto.p2p';
    }
    $.ajax({
      url: withUrl,
      type: 'post',
      dataType: 'json',
      data: {
        userId: userId,
        loginToken:sessionStorage.getItem('loginToken')
      }
    }).done(function(res){
      Common.ajaxDataFilter(res, function(res){
        if(res.code == 1){ // 已实名认证
          var cardlist = {};
          if(res.data.cardList.length > 0){
            cardlist = res.data.cardList[0];
          }

          var param = {
            extractMin: res.data.extractMin,
            card: cardlist.cardNo || '',
            amount: res.data.amount,
            prcptcd: cardlist.prcptcd || '',
            provinceName: cardlist.provinceCode || '',
            cityName: cardlist.cityCode || '',
            fee: res.data.fee,
            braBankName: cardlist.braBankName,
            bankName: cardlist.bankName,
            bindType:cardlist.bindType,
            agreeNo:cardlist.agreeNo,
            bankCode:cardlist.bankCode,
            cardType:cardlist.cardType,
            status:cardlist.status
          }
          var bindType = cardlist.bindType;
          if(bindType!='1' && payChanel==2){
        	  alert('您还未绑定银行卡，请去充值绑卡。');
            $this.removeClass('disabled');
        	  return false;
          }

          if(payChanel==1){
          	 window.location.href = Setting.staticRoot + '/pages/my-account/withdrawalFY.html?' + $.param(param);
          }else{
          	 window.location.href = Setting.staticRoot + '/pages/my-account/withdrawalFY.html?' + $.param(param);
          }
          
        }else if(res.code == -2){ // 未实名认证
          $this.removeClass('disabled');
          confirm('您还未完成实名认证，请先完成实名认证！', function(){
            window.location.href = Setting.staticRoot + '/pages/my-account/setting/real-name.html';
          });
        }else{
          alert(res.message);
          $this.removeClass('disabled');
          return false;
        }
      });
    }).fail(function(){
      alert('网络链接失败');
      $this.removeClass('disabled');
      return false;
    });

  });
  
  // 我的账户信息总览
  $.ajax({
    url:Setting.apiRoot1 + '/u/myAccountInfo.p2p',
    type:"post",
    dataType:'json',
    data:{
      userId: userId,
      loginToken:sessionStorage.getItem('loginToken')
    }
  }).done(function(res){
    Common.ajaxDataFilter(res,function(){
      if(res.code==1){
    	  //var $inuseAmt;
    	  var data = res.data;
          var _hide_number = data.phoneNum.substr(3,4);
          var phoneNum = data.phoneNum.replace(_hide_number,'****');
          $accountAmt.text((data.accountAmt).toFixed(2));
          $inUseAmt.text((data.inUseAmt).toFixed(2));
          $yesterdayIncome.text((data.yesterdayIncome).toFixed(2));
          // $currentIncome.text('￥' + (data.currentIncome).toFixed(2));
          // $regularIncome.text('￥' + (data.regularIncome).toFixed(2));
          $onLandAmt.text('￥' + (data.onLandAmt).toFixed(2));
          parseFloat((data.inUseAmt).toFixed(2));
          parseFloat((data.onLandAmt).toFixed(2));
          /*$inuseAmt.text(parseFloat((data.inUseAmt).toFixed(2))+parseFloat((data.onLandAmt).toFixed(2)));*/
          $inuseAmt.text((parseFloat(data.inUseAmt)+parseFloat(data.onLandAmt)).toFixed(2));
          $avatar.attr('src',Setting.imgRoot + data.logo);
          $phone.text(phoneNum);
      }else{
    	  alert(res.message);
          return false;
      }
      
    })
  }).fail(function(){
    alert('网络链接失败');
    return false
  });
  
  
});
