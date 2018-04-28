/**
 * Created by User on 2016/11/1.
 */
var couponData;//我的加息券查看列表
var maxPrivilege;//用户能获得的最大权重
$(function() {
	$("ul#ticker02").liScroll({travelocity: 0.1});//滚动消息
	var userId = sessionStorage.getItem('uid');//userid
	var loginToken = sessionStorage.getItem('loginToken');
	var param = Common.getParam();
	var prodId=param.pid;
	var amount=param.amount;
	var expect=param.expect;
	var justforuse=param.justforuse;
	var $content=$('.content');
	var $footer = $('.footer');//确定按钮

	var last_red=sessionStorage.getItem('vjr_selectedRed_id')==undefined?[]:JSON.parse(sessionStorage.getItem('vjr_selectedRed_id'));
	console.log(last_red);
	//var tempChooseConpon=sessionStorage.getItem('vjr_selectedConpon_id')==undefined?[]:JSON.parse(sessionStorage.getItem('vjr_selectedConpon_id'));
	var tempChooseConpon=[];
	var tempChooseConponObj=[];
	var tempWeightSum=0;
	var residualWeight;//用户可选择的剩余最大权重
	if( sessionStorage.getItem('vjr_couponIds')!='[]' && sessionStorage.getItem('vjr_couponIds')!='' && sessionStorage.getItem('vjr_couponIds').length!=2){
		var setCoupon = doT.template([
		//这里判断之前选中的加息券id数组，加上这个class selectTrue
		'{{~it :item:index}}',	
				'<div class="singleSetgray" couponType="2">',
					'<div class="cpamount" weight="{{=item.weight}}" cpid="{{=item.id}}">',
						'<span>￥{{=item.amount}}','</span>',			
						'<span>投资红包','</span>',
					'</div>',
					'<div class="cpinfo">',
						'<span>来源：{{=item.title}}','</span>',
						'<span>有效期：{{=item.lifeTime}}','</span>',
					'</div>',
					'<div class="cpselect">',
						'<img src="../../../images/pages/my-account3.0/unselected.png" class="ifselect">',
					'</div>',
				'</div>',	
		'{{~}}'
		].join(''));		
	}else{
		var setCoupon = doT.template([
		//这里判断之前选中的加息券id数组，加上这个class selectTrue
		'{{~it :item:index}}',	
			'{{?item.weight <maxPrivilege || item.weight ==maxPrivilege}}',//单张加息券权重小于或等于最大权重	
				'<div class="singleConpon" couponType="1">',
					'<div class="cpamount" weight="{{=item.weight}}" cpid="{{=item.id}}">',
						'<span>￥{{=item.amount}}','</span>',			
						'<span>投资红包','</span>',
					'</div>',
					'<div class="cpinfo">',
						'<span>来源：{{=item.title}}','</span>',
						'<span>有效期：{{=item.lifeTime}}','</span>',
					'</div>',
					'<div class="cpselect">',
						'<img src="../../../images/pages/my-account3.0/unselected.png" class="ifselect">',
					'</div>',
				'</div>',
			'{{??item.weight >maxPrivilege}}',//单张加息券权重大于最大权重
				'<div class="singleSetgray" couponType="2">',
					'<div class="cpamount" weight="{{=item.weight}}" cpid="{{=item.id}}">',
						'<span>￥{{=item.amount}}','</span>',			
						'<span>投资红包','</span>',
					'</div>',
					'<div class="cpinfo">',
						'<span>来源：{{=item.title}}','</span>',
						'<span>有效期：{{=item.lifeTime}}','</span>',
					'</div>',
					'<div class="cpselect">',
						'<img src="../../../images/pages/my-account3.0/unselected.png" class="ifselect">',
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
		couponType:3,//3==投资红包
		useType:1,//使用场景，1--投资时查询  2--投资未到期查询
		prodType:3,//定期
		prodId:prodId,
		amount:amount
	}
	}).done(function(res){
	Common.ajaxDataFilter(res,function(){
	  if(res.code==1){
	  	if (justforuse==null || justforuse==undefined) {
	  		maxPrivilege=res.maxPrivilege;	
	  	} else {
	  		maxPrivilege=justforuse;
	  	}
	  	couponData=res.data;

		if (couponData.length>0) {
	  		$content.html(setCoupon(couponData));	  		
		}else{
			//$footer.hide();
			$content.html('<img src="../../../images/pages/my-account3.0/kk.png" class="kk"/>');	
		}

	  	
	  	
	  	$('.singleConpon').on('click', function() {
	  		var $ifselect = $(this).find('.ifselect');//是否选中，选中打钩
			var chooseWeight=$(this).children('.cpamount').attr('weight');//当前点击的加息券的权重
			var chooseConponId=$(this).children('.cpamount').attr('cpid');//当前点击的加息券的id
			
			if ($(this).hasClass('selectTrue')) {
				tempWeightSum=tempWeightSum-Number(chooseWeight);
				residualWeight=maxPrivilege-tempWeightSum;//剩余总权重
				console.log(residualWeight);
				console.log(tempWeightSum+"-"+chooseWeight);//移除选中状态后的加息券总权重和当前移除的某张加息券的权重
				$ifselect.attr("src","../../../images/pages/my-account3.0/unselected.png");
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
				if(Number(chooseWeight)+tempWeightSum>maxPrivilege){
	  				return false;
	  			}

				if(tempWeightSum>=maxPrivilege){
					console.log('总权重'+tempWeightSum);
					$(this).removeClass('selectTrue');
					return;
				}else{
					tempWeightSum+=Number(chooseWeight);
					residualWeight=maxPrivilege-tempWeightSum;//剩余总权重
					console.log(residualWeight);
					console.log(tempWeightSum+"-"+chooseWeight);
				}

				$ifselect.attr("src","../../../images/pages/my-account3.0/selected.png");	
				tempChooseConpon.push(chooseConponId);	

				for(var i=0;i<couponData.length;i++){
					if(couponData[i].id==chooseConponId){
						tempChooseConponObj.push(couponData[i])
					}
				}
				$(this).toggleClass('selectTrue');				
			}

			//根据剩余权重判断剩余加息券是否可选
			if (residualWeight==0) {//剩余总权重为0 不能选择其他任何加息券
					$(this).siblings().addClass('singleSetgray');
			}else{//剩余总权重为maxPrivilege 可选择任意加息券
				// $('.singleConpon[couponType=1]').removeClass('singleSetgray');
				// $('.singleConpon[couponType=2]').removeClass('singleSetgray');
				$('.singleConpon').removeClass('singleSetgray');
			}


			// if (residualWeight==0) {//剩余总权重为0 不能选择其他任何加息券
			// 	if (chooseWeight==3) {
			// 		$(this).siblings().addClass('singleSetgray');
			// 		//$('.singleSetgray[couponType=1]').children('.cpamount').attr("src","../../../images/pages/my-account3.0/unallow-day.png");
			// 		//$('.singleSetgray[couponType=2]').children('.cpamount').attr("src","../../../images/pages/my-account3.0/unallow-full.png");
			// 	}
			// 	if (chooseWeight==1) {
			// 		$('[couponType=2]').addClass('singleSetgray');
			// 		$('[couponType=1]:not([class="singleConpon selectTrue"])').addClass('singleSetgray');
			// 		//$('[couponType=2]').addClass('singleSetgray').children('.cpamount').attr("src","../../../images/pages/my-account3.0/unallow-full.png");
			// 		//$('[couponType=1]:not([class="singleConpon selectTrue"])').addClass('singleSetgray').children('.cpamount').attr("src","../../../images/pages/my-account3.0/unallow-day.png"); 
					
			// 	}

			// }else if(residualWeight>0 && residualWeight<maxPrivilege){//剩余总权重大于0小于maxPrivilege 只能选择天数加息券不可以选择全程
			// 	$('.singleConpon[couponType=1]').removeClass('singleSetgray');
			// 	$('[couponType=2]').addClass('singleSetgray');
			// 	//$('.singleConpon[couponType=1]').removeClass('singleSetgray').children('.cpamount').attr("src","../../../images/pages/my-account3.0/Highlight-day.png");
			// 	//$('[couponType=2]').addClass('singleSetgray').children('.cpamount').attr("src","../../../images/pages/my-account3.0/unallow-full.png");
			// }else{//剩余总权重为maxPrivilege 可选择任意加息券
			// 	$('.singleConpon[couponType=1]').removeClass('singleSetgray');
			// 	$('.singleConpon[couponType=2]').removeClass('singleSetgray');
			// 	//$('.singleConpon[couponType=1]').removeClass('singleSetgray').children('.cpamount').attr("src","../../../images/pages/my-account3.0/Highlight-day.png");
			// 	//$('.singleConpon[couponType=2]').removeClass('singleSetgray').children('.cpamount').attr("src","../../../images/pages/my-account3.0/Highlight-full.png");
			// }
	       
		});

		//更改加息券样式
		if(last_red!=[]){
			$('.singleConpon').each(function(index, el) {
				var tempThisId=$(this).children('.cpamount').attr('cpid');
				if(last_red.indexOf(tempThisId)>=0){
					// var $ifselect = $(this).find('.ifselect');
					// $ifselect.attr("src","../../../images/pages/my-account3.0/selected.png");
					$(this).trigger('click');
				}
			});		
		}

	    
	  }
	  // else{
	  //   $footer.hide();
	  //   alert(res.message);
	  //     return false;
	  // }
	})
	}).fail(function(){
	alert('网络链接失败');
	return false
	});

	var $rate = $('.rate');//加息券触发范围

             var couponurl=param;console.log(couponurl);//这里在把你上个页面输入的3000带回去，赋值到输入框里，在触发一次keyup事件就行了，
	//点击确定按钮
	$footer.click(function() {
		var selectedRed=JSON.stringify(tempChooseConponObj);//已选红包对象
		sessionStorage.setItem('vjr_selectedRed_id',JSON.stringify(tempChooseConpon));//已选红包id
		sessionStorage.setItem('vjr_selectedRed',selectedRed);

		var preUrl=sessionStorage.getItem('currentUrl_buy3.0');
		// console.log(sessionStorage.getItem('vjr_selectedRed'));
		// console.log(sessionStorage.getItem('vjr_selectedRed_id'));
		// console.log(sessionStorage.getItem('WeightSum_red'));
		sessionStorage.setItem('haveuse',tempWeightSum);
		sessionStorage.setItem('clicktype',2);
	    	window.location.href='../../../pages/financing/buy3.0.html?pid='+prodId+'&amount='+amount+'&expect='+expect;	
	});

});


