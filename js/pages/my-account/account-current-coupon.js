/**
 * Created by User on 2016/11/1.
 */
var couponData;//我的加息券查看列表
$(function() {
	$("ul#ticker02").liScroll({travelocity: 0.1});//滚动消息
	var userId = sessionStorage.getItem('uid');//userid
	var loginToken = sessionStorage.getItem('loginToken');
	var param = Common.getParam();
	var financeId=param.financeId;
	var $content=$('.content');
	var $footer = $('.footer');//确定按钮

	//var tempChooseConpon=sessionStorage.getItem('vjr_selectedConpon_id')==undefined?[]:JSON.parse(sessionStorage.getItem('vjr_selectedConpon_id'));
	var tempChooseConpon=[];
	var tempChooseConponObj=[];
	var tempWeightSum=0;
	var setCoupon = doT.template([
		//这里判断之前选中的加息券id数组，加上这个class selectTrue
	'{{~it :item:index}}',
		'<div class="singleConpon">',
			'{{?item.couponType ==1}}',
				'<img src="../../images/pages/my-account3.0/Highlight-day.png" class="cpamount" weight="{{=item.weight}}" cpid="{{=item.id}}">',
			'{{?}}',
			'{{?item.couponType ==2}}',
				'<img src="../../images/pages/my-account3.0/Highlight-full.png" class="cpamount" weight="{{=item.weight}}" cpid="{{=item.id}}">',
			'{{?}}',
			'<div class="cpinfo">',
				'<span>+{{=item.rate}}%','</span>',
				'{{?item.couponType ==1}}',			
					'<span>加息天数：{{=item.addDays}}天','</span>',
				'{{?}}',
				'{{?item.couponType ==2}}',
					'<span>加息天数：所投产品期限','</span>',
				'{{?}}',
			'</div>',
			'<div class="cpselect">',
				'<img src="../../images/pages/my-account3.0/unselected.png" class="ifselect">',
			'</div>',
		'</div>',	
	'{{~}}'
	].join(''));

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
		prodType:1,//周周涨
		financeId:-1
	}
	}).done(function(res){
	Common.ajaxDataFilter(res,function(){
	  if(res.code==1){
	  	couponData=res.data;
	  	if (couponData.length>0) {
	  	$content.html(setCoupon(couponData));	  		
	  }else{
	  	$footer.hide();
	  	$content.html('<img src="../../images/pages/my-account3.0/kk.png" class="kk"/>');	
	  }

	  	
	  	
	  	$('.singleConpon').on('click', function() {
	  		var $ifselect = $(this).find('.ifselect');//是否选中，选中打钩
			var chooseWeight=$(this).children('img').attr('weight');//当前点击的加息券的权重
			var chooseConponId=$(this).children('img').attr('cpid');//当前点击的加息券的id
			
			if ($(this).hasClass('selectTrue')) {
				tempWeightSum=tempWeightSum-Number(chooseWeight);
				$ifselect.attr("src","../../images/pages/my-account3.0/unselected.png");
				for(var i=0;i< tempChooseConpon.length;i++){
					if(tempChooseConpon[i]==chooseConponId){
						tempChooseConpon.splice(i,1);
					}
				}
				for(var i=0;i<tempChooseConponObj.length;i++){
					if(tempChooseConponObj[i].id==chooseConponId){
						tempChooseConponObj.splice(i,1);
					}
				}
				$(this).toggleClass('selectTrue');
						
			}else{
				if(Number(chooseWeight)+tempWeightSum>3){
	  				return false;
	  			}

				if(tempWeightSum>=3){
					console.log('总权重'+tempWeightSum);
					$(this).removeClass('selectTrue');
					return;
				}else{
					tempWeightSum+=Number(chooseWeight);
					console.log(tempWeightSum+"-"+chooseWeight);
				}

				$ifselect.attr("src","../../images/pages/my-account3.0/selected.png");	
				tempChooseConpon.push(chooseConponId);	

				for(var i=0;i<couponData.length;i++){
					if(couponData[i].id==chooseConponId){
						tempChooseConponObj.push(couponData[i])
					}
				}
				$(this).toggleClass('selectTrue');				
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
	      alert(res.message);
	      return false;
	  }
	})
	}).fail(function(){
	alert('网络链接失败');
	return false
	});

	var $rate = $('.rate');//加息券触发范围

             var couponurl=param;console.log(couponurl);//这里在把你上个页面输入的3000带回去，赋值到输入框里，在触发一次keyup事件就行了，
	//点击确定按钮
	$footer.click(function() {

		  var ad = tempChooseConpon.toString(); 
		  console.log(ad);
		  var userCouponIds = ad.replace('[','');
		  var userRateCouponIds = userCouponIds.replace(']','');
		// var selectedConpon=JSON.stringify(tempChooseConponObj);
		// sessionStorage.setItem('vjr_selectedConpon_id',JSON.stringify(tempChooseConpon));
		// sessionStorage.setItem('vjr_selectedConpon',selectedConpon);

		// var preUrl=sessionStorage.getItem('currentUrl_buy3.0');
		// sessionStorage.setItem('WeightSum_coupon',tempWeightSum);
	 //    	window.location.href=preUrl;
		$.ajax({
		url:Setting.apiRoot1 + '/u/useRateCoupon.p2p',
		type:"post",
		async:false,
		dataType:'json',
		data:{
			userId: userId,
			loginToken:loginToken,
			prodType:1,//周周涨
			financeId:-1,
			userRateCouponIds:userRateCouponIds
		}
		}).done(function(res){
		Common.ajaxDataFilter(res,function(){
		  if(res.code==1){
		  	alert('使用成功');
		    
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



});


