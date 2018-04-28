/**
 * Created by User on 2016/7/25.
 */


$(function() {
    var formAction = {one: '请选择省', two: '请选择市' ,three: '北京市', four: '天津市', five: '上海市', six: '重庆市'};
    var param = Common.getParam();
    param.amount = parseFloat(param.amount);//账户可用余额
    var $amount = $('.unit');//可提现金额  
    var $bankImg = $('.bank');
    var $bankName = $('.bank-type');
    var $bankCard = $('.bank-Id');
    var $account = $('.span-account');
    var $money = $('.span-money');
    var $amountMoney = $('input[name="money"]');//输入框
    var $province = $('select[name=province]');
    var $cityName = $('input[name=cityName]');
    var $withdrawal = $('.withdrawal');
    var $provinceName = $('input[name=provinceName]');
    var $img1 = $('.img1');
    var $img2 = $('.img2');
    var curCanExtractAmt ;
    var bankName ;
    //获取用的ID检测是否登录
    var uid = sessionStorage.getItem("uid");
    var loginToken = sessionStorage.getItem("loginToken");
    var $city = $('select[name=city]');
    var province;
    var city;
    var withdrawChanel;
    var formData = {};
    var extraMin;
    var bankImgURL;
    var limitonce;
    var limitday;
    var pro;
    var ci;

    var res = JSON.parse(sessionStorage.getItem('resaction'));
    if (!uid || res == null || res == '') {
        // if (res == null || res == '') {
        //     window.location.href = Setting.staticRoot + '/pages/my-account/myAccount.html';
        // }
        // Common.toLogin();
        return false;
    }

    var cardList = res.data.cardList;
    withdrawChanel = res.data.withdrawChanel;


	//获取省份和城市联动
	var provinceName = param.provinceName;
	
	if(provinceName=='' || provinceName==null || provinceName==undefined){
		getAreaData("1", function(data){
			$province.html(areaTpl({
				txt: '请选择省',
				list: data
			}));
		  });
	} else {
		$provinceName.val(param.provinceName);
		$cityName.val(param.cityName);
		$province.add($city).add($braBankName).closest('li').addClass('hide');
	}

	Common.ajaxDataFilter(res, function(res){
	//1 成功
	if(res.code == 1){
        extraMin = res.data.extractMin;
        $amountMoney.attr({'placeholder': '提现金额' + extraMin +'元起'});
        amountMoney = param.amount;
        curCanExtractAmt = res.data.curCanExtractAmt;
        amountMoney = parseFloat(amountMoney);
        curCanExtractAmt = parseFloat(curCanExtractAmt);
        $amount.html(amountMoney.toFixed(2) );
        // if(curCanExtractAmt > amountMoney) {
        // $amount.html(amountMoney.toFixed(2) );
        // }

        // if (curCanExtractAmt <= amountMoney) {
        // $amount.html(curCanExtractAmt.toFixed(2) );
        // }


        for (var i = 0; i < cardList.length; i++) {
            var datas = cardList[i];
            if (cardList[i].payChannel == 4) {
                if (datas.bindType == 1) {
                    $('.bindCard1').attr({src: '../../images/pages/my-account/bind.png'}).css({'marginLeft': '3.6rem'});
                }
            }
            if (cardList[i].payChannel == 3) {
                if (datas.bindType == 1) {
                    $('.bindCard2').attr({src: '../../images/pages/my-account/bind.png'}).css({'marginLeft': '3.6rem'});
                }
            }
        }

        for (var i = 0; i < cardList.length; i++ ) {
           if(withdrawChanel == cardList[i].payChannel) {
                pro = cardList[i].provinceCode;
                ci = cardList[i].cityCode;
            } else {
               if(cardList[i].provinceCode != undefined) {
                   pro = cardList[i].provinceCode;
                   ci = cardList[i].cityCode;
               }
           }
        }

        //获取城市
        if (ci == '' || ci == 'undefined' || ci == null) {
            $('.with-bank-cit').addClass('bank-city');
            $('.bank-city').html('<div class="bank-city-div"></div><div class="city-div ct">省份/城市<span class="city-span">请选择省份和城市</span><img src="../../images/pages/my-account3.0/nextPage3.0.png" style="width:0.4rem;height:0.4rem;vertical-align:middle;"/></div>');
        }
        var isBank = $('.with-bank-cit').hasClass('bank-city');
        getWithdrawChanel (withdrawChanel);

        var account = res.data.count;
        if(account > 0){
            $account.html(account);
        }else{
            $('.bank-Id').html('提现手续费每笔¥2.00')
        }
		var money = res.data.fee;
        formData.fee = money;
		$money.html(parseFloat(money).toFixed(2));

        var bankCardNo;

        $('.ct').click(function() {
            $('.regist').show();
        });
        //点击取消的按钮
        $('.cascade-close').click(function() {
            $('.regist').hide();
        });


        function isBindType(withDatas, c) {
            if (withDatas.bindType != 1) {
                confirm('在该支付通道提现需先绑定银行卡', function() {
                    window.location.href = Setting.staticRoot + '/pages/my-account/topup-cash.html';
                });
                return false;
            } else {
                withdrawChanel = c;
                getWithdrawChanel(c)
            }
        }

        function getWithdrawChanel (withdrawChanel) {
            for(var i = 0; i < cardList.length; i++) {
                if (withdrawChanel == cardList[i].payChannel) {
                    var withDatas = res.data.cardList[i];
                    if(withdrawChanel == 3  ) {
                        $img1.attr({src: '../../images/pages/my-account/with-notxz.png'});
                        $img2.attr({src: '../../images/pages/my-account/with-xz.png'});
                    }
                    if( withdrawChanel == 4) {
                        $img1.attr({src: '../../images/pages/my-account/with-xz.png'});
                        $img2.attr({src: '../../images/pages/my-account/with-notxz.png'});
                    }
                }
                if (withdrawChanel == cardList[i].payChannel && cardList[i].bindType == 1 && cardList[i].cardNo != '') {
                    firstWithdrawChanel(withDatas);
                } else {
                    if(cardList[i].bindType == 1) {
                        firstWithdrawChanel(cardList[i]);
                    }
                }
            }
        }

        function firstWithdrawChanel(withDatas) {
            bankImgURL = withDatas.bankImgURL;
            bankName = withDatas.bankName;
            bankCardNo = withDatas.cardNo;
            limitonce = withDatas.limitonce;
            limitday = withDatas.limitday;

           //if(!isBank) {
           //     pro = withDatas.provinceCode;
           //     ci = withDatas.cityCode;
           //}

            //对银行的卡号进行拆分
            if (16 <= bankCardNo.length < 20) {
                var cardNo1 = bankCardNo.substr(0,4);
                var cardNo2 = bankCardNo.substr(bankCardNo.length - 4, bankCardNo.length);
                var cardNo4 = bankCardNo.substr(5,bankCardNo.length - 4);
                var d = '';
                for (var i = 0; i < cardNo4.length; i++) {
                    if (i % 5 == 0) {
                        d += '&nbsp';
                    } else {
                        d += '*';
                    }

                }
                var cardNo3 = cardNo1 + d + '&nbsp' + cardNo2;
                formData.bankCard = cardNo2;
                // $bankCard.html(cardNo3);
            }
            $bankImg.attr({src: bankImgURL});
            $bankName.html(bankName + '（' +cardNo3.substr(-4) + '）');
        }
        //点击确定按钮
        $('.cascade-determine').click(function() {
            province = $('.pro').html();
            city = $('.ci').html();
             p = province.split('-')[0];
            if (province != formAction.one) {
                $('.city-span').addClass('sp').html(p);
            }

            if (city != formAction.two) {
                var c = city.split('-')[0];
                if(c == formAction.three || c == formAction.four || c == formAction.five || c == formAction.six) {
                    $('.city-span').html(p);
                } else {
                    $('.city-span').html(p + c);
                }

            }
            pro = province;
            ci = city;
            $('.regist').hide();
        });



        //点击宝付提现
        $('.spanImg1').click(function() {
            var c = 4;
            for (var i = 0; i < cardList.length; i++) {
                if( c == cardList[i].payChannel) {
                    var withDatas = cardList[i];
                    isBindType(withDatas, c);
                }
            }
        });

        //点击富友提现
        $('.spanImg2').click(function() {
            var c = 3;
            for (var i = 0; i < cardList.length; i++) {
                if( c == cardList[i].payChannel) {
                    var withDatas = cardList[i];
                    isBindType(withDatas, c);
                }
            }
        });

    //点击提现按钮
        $('.btn-next').click(function() {
        var amountMoney = $.trim($amountMoney.val());
            if (check(amountMoney, pro, ci)) {
                var bdType = -1;
                for (var i = 0; i < cardList.length; i++) {
                    var _cardNo = cardList[i].cardNo;
                    if((null == _cardNo || "" == _cardNo)) {
                        continue;
                    }
                    bdType = cardList[i].bindType;
                }
                if(bdType != 1){
                    confirm('在该支付通道提现需先绑定银行卡', function() {
                        window.location.href = Setting.staticRoot + '/pages/my-account/topup-cash.html';
                    });
                    return false;
                }
                if (withdrawChanel == 3) {
                    if (isBank) {
                        pro = province.split('-')[1];
                        ci = city.split('-')[1];
                    }
                }

                if (withdrawChanel == 4) {
                    if (isBank) {
                        pro = province.split('-')[0];
                        ci = city.split('-')[0];
                    }
                }

                //确认支付传入参数
                formData.provinceCode = pro;
                formData.cityCode = ci;
                formData.braBankName = bankName;
                formData.cardNum = bankCardNo.replace(/\s/g, '');
                formData.account = account;
                //			提现金额
                formData.amount = amountMoney;
                formData.prcptcd = param.prcptcd;
                formData.bankImgURL = bankImgURL;

                //判断是否有免费的提现次数
                if (account == 0) {
                    confirm(res.data.warning, function() {
                            //console.log(JSON.stringify(formData))
                        gotoPay()
                    });
                    $('.btn-default').html('我知道了');
                    $('.full-btn a').eq(1).remove();
                } else {
                    gotoPay();
                }
            }
        });
	}else if(res.code == -2){ 
			// 未实名认证
		confirm('您还未完成实名认证，请先完成实名认证！', function(){
		    window.location.href = Setting.staticRoot + '/pages/my-account/setting/real-name.html';
		});
	}else{	
		alert(res.message);
		return false;
	}
	});

    var $input = $('input[name="money"]');
    $input.on('input change',function(e){
        var $this = $(this);
        var money = $.trim($this.val());
        money = parseFloat(money);

        if(isNaN(money)){
            $this.val('');
            return false;
        }

        if(e.type == 'change'){
            $this.val(parseFloat($this.val()).toFixed(2));
        }
        if($this.val() >= extraMin){
            $('.city-div2').hide();
            $('.city-div3').show();
            $('.btn-next').css('background','#2B6FF9');
        }else{
            $('.city-div2').show();
            $('.city-div3').hide();
            $('.btn-next').css('background','#AAC5FC');
        }
    });
//
	 /**
	   * 获取地区信息 如果查询省份，parentId=1   查询城市，则传该省的id
	   * @param  {[type]} pid [description]
	   * @return {[type]}     [description]
	   */
	function getAreaData(parentId, callback){
		var paramid = '';
		if(parentId!=''){
			paramid = parentId;
			$.ajax({
		      url: Setting.apiRoot1 + '/getProvinceAndCity.p2p',
		      type: 'post',
		      dataType: 'json',
		      data: {
		        parentId: paramid,
		        payChannelId:3
		      }
		    }).done(function(res){
		      if(res.code != 1){
		        alert(res.message);
		        return false;
		      }
		      callback(res.data);
		    }).fail(function(){
		      alert('网络链接失败，请刷新重试！');
		      return false;
		    });
		}
	}
	  
	var areaTpl = doT.template([
      '<option value="|">{{=it.txt}}</option>',
      '{{~it.list :item:index}}',
        '<option value="{{=item.id}}">{{=item.name}}-{{=item.no}}</option>',
      '{{~}}'
    ].join(''));

	  
	//选择下拉框
	$withdrawal.on('change', '.select-ui select', function(){
	    var $this = $(this);
	    var _txt = $this.find('option:selected').text();
	    
	    $this.siblings('span.text').html(_txt).removeClass('gray');
	    if(this.name == 'province'){
	      $provinceName.val(_txt);
	      renderCity(this.value);
	    }else{
	      $cityName.val(_txt);
	    }
	}).on('input change blur', 'input[name=bankcard]', function(e){
	    var $this = $(this);
	    var card = $.trim($this.val());
	    if(card.length == 0){
	      return false;
	    }
	    card = card.replace(/\s/g,'').replace(/(\d{4})(?=\d)/g,"$1 ");
	    $this.val(card);
	}).on('click', '.btn-next', function(){
	    var $this = $(this);
	    if($this.hasClass('disabled')){
	      return false;
	    }
	});
	  
	  /**
	   * 渲染City列表
	   * @return {[type]} [description]
	   */
	function renderCity(parentId){
	    getAreaData(parentId, function(data){
	      $city.html(areaTpl({
	        txt: '请选择市',
	        list: data
	      })).siblings('span.text').addClass('gray').html('请选择市');
	    });
	}
	  
	function check(amountMoney, province, city){

        if(province=='' || province==undefined || province == formAction.one){
            Common2.toast('请完整的选择城市的省份信息');
            return false;
        }

        if(city=='' || city==undefined || city == formAction.two){
            Common2.toast('请完整的选择城市的省份信息');
            return false;
        }

        if (amountMoney.length == 0) {
        	Common2.toast('请你输入提现金额');
        	return false;
        }

        if(parseFloat(amountMoney) < parseFloat(extraMin)){
        	 Common2.toast('提现金额不能小于' + extraMin + '元');
        	 return false;
        }
        var money1 = $amount.html();//账户 余额
        if( parseFloat(amountMoney)  > parseFloat(money1)){
            Common2.toast('可提现的金额不足');
            return false;
        }

        return true;
    }

//if (amountMoney - limitonce > 0) {
//    alert('单笔最大提现金额不得超过' + limitonce + '元');
//    return false;
//}

// var hj = $amount.html();
//  if (amountMoney - hj > 0) {
//      alert('单笔最大提现金额不得超过' + hj + '元');
//      $amountMoney.val(hj);
//      return false;
//  }

// var money1 = $amount.html();
// if( amountMoney - money1 > 0){
// 	alert('可提现的金额不足');
// 	return false;
// }

		  
   /**
   * 去支付页面输入密码 
   * @return {[type]} [description]
   */
  function gotoPay(){
	    sessionStorage.setItem('withdrawal-pay', JSON.stringify(formData));
	    if(withdrawChanel==4){
	        window.location.href = 'withdrawal-payBF.html';
	    }else if(withdrawChanel==3){
	    	// window.location.href = 'withdrawal-payFY.html';
            $.ajax({
                url:'./withdrawal-payFY2.html',
                dataType:'html',
            }).done(function(res){
                $('body').append(res)
            })
	    }
  }

  $('.all').on('click',function(){
    var money = $('.unit').html();
    $('input[name="money"]').val(money);

    if(money >= extraMin){
        $('.city-div2').hide();
        $('.city-div3').show();
        $('.btn-next').css('background','#2B6FF9');
    }else{
        $('.city-div2').show();
        $('.city-div3').hide();
        $('.btn-next').css('background','#AAC5FC');
    }
  })
});
