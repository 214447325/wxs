/**
 * Created by User on 2016/11/1.
 */
var couponData;//我的加息券查看列表
var maxPrivilege;
var $ui_dialog = $('.ui-dialog');
var $btn_link  = $('.btn-link',$ui_dialog);
var $btn_default = $('.btn-default',$ui_dialog);
$(function() {
	$("ul#ticker02").liScroll({travelocity: 0.1});//滚动消息
	var userId = sessionStorage.getItem('uid');//userid
	var loginToken = sessionStorage.getItem('loginToken');
	var param = Common.getParam();
    var amount = param.amount;//余额
    var cycleTime = param.day;
	var financeId=param.financeId;
	var restWeight=param.restWeight;
	var maxWeight=param.maxWeight;
	var $content=$('.content');
	var $footer = $('.footer');//确定按钮
	var $expected = $('.expected');
	//var tempChooseConpon=sessionStorage.getItem('vjr_selectedConpon_id')==undefined?[]:JSON.parse(sessionStorage.getItem('vjr_selectedConpon_id'));
	var tempChooseConpon=[];
	var tempChooseConponObj=[];
	var tempWeightSum=0;
	var residualWeight;
    var _speaceDay;
	if (restWeight==maxWeight) {//剩余权重为maxWeight 天数加息OR全称加息 均可选择
	var setCoupon = doT.template([
	'{{~it :item:index}}',
		'<div class="singleConpon" couponType="{{=item.couponType}}">' +
        // '<div class="singleId">+<a class="couponId">{{=item.couponId}}</a>元</div>',
			'{{?item.couponType ==1}}',
				//'<img src="../../images/pages/my-account3.0/Highlight-day.png" class="cpamount" weight="{{=item.weight}}" cpid="{{=item.id}}">',
					'<div class="cpamount" weight="{{=item.weight}}" cpid="{{=item.id}}">',
						'<span>+{{=item.rate}}%','</span>',			
						'<span>天数加息券','</span>',
					'</div>',
			'{{?}}',
			'{{?item.couponType ==2}}',
				//'<img src="../../images/pages/my-account3.0/Highlight-full.png" class="cpamount" weight="{{=item.weight}}" cpid="{{=item.id}}">',
					'<div class="cpamount" weight="{{=item.weight}}" cpid="{{=item.id}}">',
						'<span>+{{=item.rate}}%','</span>',			
						'<span>全程加息券','</span>',
					'</div>',
			'{{?}}',
			'<div class="cpinfo">有效期至{{=item.lifeTime}}','</span>',
			'</div>',
			'<div class="cpselect">',
				'<img src="../../images/pages/my-account3.0/unselected.png" class="ifselect">',
			'</div>',
		'</div>',			
	'{{~}}'	
	].join(''));

	}else{//剩余权重不足maxWeight 全称加息置灰不可选 仅天数加息可选
	var setCoupon = doT.template([
	'{{~it :item:index}}',
		'{{?item.couponType ==1}}',//天数加息可以点击状态	
			'<div class="singleConpon" couponType="{{=item.couponType}}">' +
            // '<div class="singleId">+<a class="couponId">{{=item.couponId}}</a>元</div>',
				//'<img src="../../images/pages/my-account3.0/Highlight-day.png" class="cpamount" weight="{{=item.weight}}" cpid="{{=item.id}}">',
					'<div class="cpamount" weight="{{=item.weight}}" cpid="{{=item.id}}">',
						'<span>+{{=item.rate}}%','</span>',			
						'<span>天数加息券','</span>',
					'</div>',
				'<div class="cpinfo">有效期至{{=item.lifeTime}}','</span>',
				'</div>',
				'<div class="cpselect">',					
					'<img src="../../images/pages/my-account3.0/unselected.png" class="ifselect">',					
				'</div>',
			'</div>',	
		'{{?}}',
		'{{?item.couponType ==2}}',//全称加息禁用
			'<div class="singleConpon singleSetgray" couponType="{{=item.couponType}}">',
            // '<div class="singleId" style="color: rgb(181,181,181) !important;">+<a class="couponId" style="color: rgb(181,181,181) !important;">{{=item.couponId}}</a>元</div>',
				//'<img src="../../images/pages/my-account3.0/unallow-full.png" class="cpamount" weight="{{=item.weight}}" cpid="{{=item.id}}">',
					'<div class="cpamount" weight="{{=item.weight}}" cpid="{{=item.id}}">',
						'<span>+{{=item.rate}}%','</span>',			
						'<span>全程加息券','</span>',
					'</div>',
				'<div class="cpinfo">有效期至{{=item.lifeTime}}','</span>',
				'</div>',
				'<div class="cpselect">',					
					'<img src="../../images/pages/my-account3.0/unselected.png" class="ifselect">',
				'</div>',
			'</div>',		
		'{{?}}',		
	'{{~}}'			
	].join(''));

	}

	$.ajax({
	url:Setting.apiRoot1 + '/u/getUsefulRateCoupon.p2p',
	type:"post",
	async:false,
	dataType:'json',
	data:{
		userId: userId,
		loginToken:loginToken,
		couponType:1,//1==加息券
		useType:2,//使用场景，1--投资时查询  2--投资未到期查询
		prodType:3,//定期
		financeId:financeId
	}
	}).done(function(res){
	Common.ajaxDataFilter(res,function(){
	  if(res.code==1){
	  	couponData=res.data;
  		maxPrivilege = res.maxPrivilege;
         _speaceDay = res.speaceDay; //加息券可以使用的天数
  		//$('#ticker02').html('<li><a>同时使用的奖励最多' + maxPrivilege + '个(加息券、红包),且全程加息全不可和其他奖励同时使用</a></li>')
          if (couponData.length>0) {
              for(var i = 0; i < couponData.length; i++) {
                  var _prDataValue = '';
                  if(couponData[i].couponType == 1) {//天数
                      _prDataValue = parseFloat(parseFloat(amount) * parseFloat(couponData[i].rate) * couponData[i].addDays / 36500).toFixed(2);
                      couponData[i]. couponId = _prDataValue;
                  }

                  if(couponData[i].couponType == 2) {//全程
                      _prDataValue = parseFloat(parseFloat(amount) * parseFloat(couponData[i].rate) * parseFloat(_speaceDay) / 36500).toFixed(2);
                      couponData[i]. couponId = _prDataValue;
                  }

                  if(couponData[i].couponType == 3) {
                      _prDataValue = parseFloat(parseFloat(amount) * parseFloat(couponData[i].rate) * couponData[i].addDays / 36500).toFixed(2);
                      couponData[i].couponId = _prDataValue;
                  }

                  if(couponData[i].couponType == 5) {
                      _prDataValue = parseFloat(couponData[i].rate).toFixed(2);
                      couponData[i].couponId = _prDataValue;
                  }
              }

              for(var i = 0; i < couponData.length; i++) {
                  for(var j = i + 1; j < couponData.length;j++) {
                      if(couponData[i].couponId < couponData[j].couponId) {
                          var tmp = couponData[i];
                          couponData[i] = couponData[j];
                          couponData[j] = tmp;
                      }
                  }
              }
              //console.log(JSON.stringify(couponData));
			$content.html(setCoupon(couponData));	  		
		}else{
			$footer.hide();
			$expected.hide();
			$content.html('<img src="../../images/pages/my-account3.0/kk.png" class="kk"/>');	
		}


          var couponIdCount = 0;
	  	$('.singleConpon').on('click', function() {
	  		var $ifselect = $(this).find('.ifselect');//是否选中，选中打钩
			var chooseWeight=$(this).children('.cpamount').attr('weight');//当前点击的加息券的权重
			var chooseConponId=$(this).children('.cpamount').attr('cpid');//当前点击的加息券的id
			if ($(this).hasClass('selectTrue')) {
                couponIdCount = couponIdCount - parseFloat($(this).find('.couponId').html());
				tempWeightSum=tempWeightSum-Number(chooseWeight);
				residualWeight=restWeight-tempWeightSum;//剩余总权重
                $ifselect.hide();
				$ifselect.attr("src","../../images/pages/my-account3.0/unselected.png");

				for(var i=0;i< tempChooseConpon.length;i++){
					if(tempChooseConpon[i]==chooseConponId){
						tempChooseConpon.splice(i,1);
					}
				}
                //console.log(JSON.stringify(tempChooseConponObj))
				for(var i=0;i<tempChooseConponObj.length;i++){
					if(tempChooseConponObj[i].id==chooseConponId){
                        if(tempChooseConponObj[i].couponType == 1) {
                            _speaceDay = _speaceDay + tempChooseConponObj[i].addDays;
                        }
						tempChooseConponObj.splice(i,1);
					}
				}


				$(this).toggleClass('selectTrue');
						
			}else{
				if(Number(chooseWeight)+tempWeightSum>restWeight){
	  				return false;
	  			}

				if(tempWeightSum>=restWeight && chooseWeight != 0){
					//console.log('总权重'+tempWeightSum);
					$(this).removeClass('selectTrue');
					return;
				}else{
					tempWeightSum+=Number(chooseWeight);
					residualWeight=restWeight-tempWeightSum;//剩余总权重
				}

				for(var i=0;i<couponData.length;i++){
					if(couponData[i].id==chooseConponId){
                        if(couponData[i].couponType == 1) {
                            _speaceDay = _speaceDay - couponData[i].addDays;
                            if(_speaceDay < 0) {
                                alert('投后用券天数之和不得超过产品剩余期限');
                                _speaceDay = _speaceDay + couponData[i].addDays;
                                return false;
                            } else {
                                tempChooseConponObj.push(couponData[i]);
                                $(this).toggleClass('selectTrue');
                                tempChooseConpon.push(chooseConponId);
                                $ifselect.show();
                                $ifselect.attr("src","../../images/pages/my-account3.0/selected.png");
                                couponIdCount = couponIdCount + parseFloat($(this).find('.couponId').html());
                            }
                        } else {
                            tempChooseConponObj.push(couponData[i]);
                            $(this).toggleClass('selectTrue');
                            tempChooseConpon.push(chooseConponId);
                            $ifselect.show();
                            $ifselect.attr("src","../../images/pages/my-account3.0/selected.png");
                            couponIdCount = couponIdCount + parseFloat($(this).find('.couponId').html());
                        }

                        //if(_speaceDay < 0) {
                        //    alert('投后用券天数之和不得超过产品剩余期限');
                        //    return false;
                        //} else {
                        //    tempChooseConponObj.push(couponData[i]);
                        //    $(this).toggleClass('selectTrue');
                        //    $ifselect.attr("src","../../images/pages/my-account3.0/selected.png");
                        //    console.log(JSON.stringify(tempChooseConponObj))
                        //}
					}
				}

			}

            if(couponIdCount <= 0 ) {
                $('.expectedMonery').html('0.00');
            } else {
                $('.expectedMonery').html(parseFloat(couponIdCount).toFixed(2));
            }
			//根据剩余权重判断剩余加息券是否可选
			if (residualWeight==0) {//剩余总权重为0 不能选择其他任何加息券
				// if (chooseWeight==maxWeight) {//剩余为0且当前选择的加息券权重为maxWeight 说明选择的是全称加息券
				// 	$(this).siblings().addClass('singleSetgray');
				// 	$('.singleSetgray[couponType=1]').children('img').attr("src","../../images/pages/my-account3.0/unallow-day.png");
				// 	$('.singleSetgray[couponType=2]').children('img').attr("src","../../images/pages/my-account3.0/unallow-full.png");
				// }
				// if (chooseWeight==1) {//剩余为0且当前选择的加息券权重为1 说明选择的是三张天数加息券
				// 	$('[couponType=2]').addClass('singleSetgray').children('img').attr("src","../../images/pages/my-account3.0/unallow-full.png");
				// 	$('[couponType=1]:not([class="singleConpon selectTrue"])').addClass('singleSetgray').children('img').attr("src","../../images/pages/my-account3.0/unallow-day.png"); 
					
				// }
				if (chooseWeight==3) {
					$(this).siblings().addClass('singleSetgray');
                    $('div[couponType=1]').removeClass('singleSetgray');
				}
				if (chooseWeight==1) {
					$('[couponType=2]').addClass('singleSetgray');
					$('[couponType=1]:not([class="singleConpon selectTrue"])').addClass('singleSetgray');
					//$('[couponType=2]').addClass('singleSetgray').children('.cpamount').attr("src","../../../images/pages/my-account3.0/unallow-full.png");
					//$('[couponType=1]:not([class="singleConpon selectTrue"])').addClass('singleSetgray').children('.cpamount').attr("src","../../../images/pages/my-account3.0/unallow-day.png"); 
					
				}

			}else if(residualWeight>0 && residualWeight<maxWeight){//剩余总权重大于0小于maxWeight 只能选择天数加息券不可以选择全程
				// $('.singleConpon[couponType=1]').removeClass('singleSetgray').children('img').attr("src","../../images/pages/my-account3.0/Highlight-day.png");
				// $('[couponType=2]').addClass('singleSetgray').children('img').attr("src","../../images/pages/my-account3.0/unallow-full.png");
				$('.singleConpon[couponType=1]').removeClass('singleSetgray');
				$('[couponType=2]').addClass('singleSetgray');
			}else{//剩余总权重为maxWeight 可选择任意加息券
				// $('.singleConpon[couponType=1]').removeClass('singleSetgray').children('img').attr("src","../../images/pages/my-account3.0/Highlight-day.png");
				// $('.singleConpon[couponType=2]').removeClass('singleSetgray').children('img').attr("src","../../images/pages/my-account3.0/Highlight-full.png");
				$('.singleConpon[couponType=1]').removeClass('singleSetgray');
				$('.singleConpon[couponType=2]').removeClass('singleSetgray');
			}	       
		});

		// //更改加息券样式
		// if(tempChooseConpon!=[]){
		// 	$('.singleConpon').each(function(index, el) {
		// 		var tempThisId=$(this).children('span').attr('cpid');
		// 		if(tempChooseConpon.indexOf(tempThisId)>=0){
		// 			var $ifselect = $(this).find('.ifselect');
		// 			$ifselect.attr("src","../../images/pages/my-account3.0/selected.png");
		// 		}
		// 	});
		
		// }

	    
	  }else{
	    $footer.hide();
	    $expected.hide();
	    alert(res.message);
	      return false;
	  }
	})
	}).fail(function(){
	alert('网络链接失败');
	return false
	});

	var $rate = $('.rate');//加息券触发范围

             var couponurl=param;
    //console.log(couponurl);//这里在把你上个页面输入的3000带回去，赋值到输入框里，在触发一次keyup事件就行了，
	//点击确定按钮
	$footer.click(function() {

		  var ad = tempChooseConpon.toString();
		  var userCouponIds = ad.replace('[','');
		  var userRateCouponIds = userCouponIds.replace(']','');
		// var selectedConpon=JSON.stringify(tempChooseConponObj);
		// sessionStorage.setItem('vjr_selectedConpon_id',JSON.stringify(tempChooseConpon));
		// sessionStorage.setItem('vjr_selectedConpon',selectedConpon);

		// var preUrl=sessionStorage.getItem('currentUrl_buy3.0');
		// sessionStorage.setItem('WeightSum_coupon',tempWeightSum);
	 //    	window.location.href=preUrl;
	 if (userRateCouponIds=='' || userRateCouponIds==null || userRateCouponIds.length<1) {
	 	alert('请选择有效的券');
	 	return false;
	 }else{
		$.ajax({
		url:Setting.apiRoot1 + '/u/useRateCoupon.p2p',
		type:"post",
		async:false,
		dataType:'json',
		data:{
			userId: userId,
			loginToken:loginToken,
			prodType:3,//定期
			financeId:financeId,
			userRateCouponIds:userRateCouponIds
		}
		}).done(function(res){
		Common.ajaxDataFilter(res,function(){
		  if(res.code==1){
			$ui_dialog.removeClass('hide');
			$btn_default.attr('onclick','window.location.href="../../pages/my-account/my-product.html";'); 
		  	
		    
		  }else{
		      alert(res.message);
		      return false;
		  }
		})
		}).fail(function(){
		alert('网络链接失败');
		return false
		});
	 }


	    	
	});



});


