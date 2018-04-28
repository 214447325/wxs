/*
* @Author: User
* @Date:   2016-09-02 11:03:30
* @Last Modified by:   User
* @Last Modified time: 2017-01-15 17:50:55
*/
var regularListDetail={};//正在热卖产品列表
var newProdListDetail={};
var userId =sessionStorage.getItem('uid');
var validName =sessionStorage.getItem('validName');//获取用户实名
var validTrade =sessionStorage.getItem('validTrade');//获取用户交易密码
var $ui_dialog_name = $('.ui-dialog-name');
var $btn_link_name  = $('.btn-link-name',$ui_dialog_name);
var $btn_default_name = $('.btn-default-name',$ui_dialog_name);
var $ui_dialog_trade = $('.ui-dialog-trade');
var $btn_link_trade  = $('.btn-link',$ui_dialog_trade);
var $btn_default_trade = $('.btn-default',$ui_dialog_trade); 
var newProd= sessionStorage.getItem('newProd');
var week3 = 0;
var week3Level10000 = 1;
var week3Level30000 = 1;
var week3Level50000 = 1;


//登录接口新增返回字段：newProd，是否可买新手标，0代表不可买，2代表可买2周，4代表可买4周,6代表都可以买
// if (newProd==0) {
// 	$('<div class="havebuyNew"></div>').insertAfter($('.regularList'));
// } else {
// 	$('<div class="mapnew"></div>').insertBefore($('.regularList'));
// }
if(newProd == null){
	newProd = 6;
}
if(newProd != 0){
	$('<div class="mapnew"></div>').insertBefore($('.regularList'));
}
$(function(){
	var isWeiXin = Common.isWeiXin();//微信进来的访问判断，不是跳转到官网下载页
	var param = Common.getParam();
	var weixin = param.weixin;
	var _data={};//每种产品对应的参数列表
	if(weixin){
	  Common.weixinLogin(weixin);
	}

	var $regularTitle = $('.regularTitle');
	var $regulartitle_p = $('.regulartitle-p');

	// 14周
	var loanCycle14 = 0;
	var isAmt = 0;
	var levelRate = 0;
	// 14周特殊标
	var queryUser14WeekExt = 0;
	var level14 = 0;
	// 3周活期转存
	var currentStockValidator = 0;

	//理财页接口   七天乐
	var $tabcon1       = $('.regularList');
	var setListData1 = doT.template([
	    '{{~it :item:index}}',

	    // 3周（2个）,14周标没有购买资格就不插入
	    // '<span>{{=(item.investCycle != 3 || (item.investCycle == 3 && (item.minRate + item.addRate) != 14 && item.week3 == 1 && (item.week3Level10000 == 1 || item.week3Level30000 == 1 || item.week3Level50000 == 1)) || ( item.investCycle == 3 && item.currentStockValidator == 1 && (item.minRate + item.addRate == 14))) && (item.loanCycle != 14 || (item.loanCycle == 14 && item.loanCycle14 != 0) || (item.queryUser14WeekExt == 1 && item.level14 ==(item.minRate + item.addRate)) )}}</span>',
	   ' {{?(item.investCycle != 3 || (item.investCycle == 3 && (item.minRate + item.addRate) != 14 && item.week3 == 1 && (item.week3Level10000 == 1 || item.week3Level30000 == 1 || item.week3Level50000 == 1)) || ( item.investCycle == 3 && item.currentStockValidator == 1 && (item.minRate + item.addRate == 14))) && (item.loanCycle != 14 || (item.loanCycle == 14 && item.loanCycle14 != 0) || (item.queryUser14WeekExt == 1 && item.level14 ==(item.minRate + item.addRate)) )}}',

			'<div class="regularItem" onClick="regularItem(event,{{=item.prodId}})">',
				'<div class="itemName">',
					'<span class="pName">{{=item.prodTitleNew}}','</span>',
					// '{{?item.addRate != 0}}',
					'{{?item.label !=null && item.label !="" && item.label !=undefined}}',

					'<span class="addRate"><img src="../../images/pages/financing/regular3.0/gift.png"/><span>{{=item.label}}</span>','</span>',
					'{{?}}',
					// '<span class="plabel">',
					// '{{?item.label !=null && item.label !="" && item.label !=undefined}}',
					// 	'{{?item.label =="hot"}}',
					// 		'<span class="labBg">正在热卖','</span>',
					// 	'{{??item.label =="new"}}',
					// 		'<span class="labBg">新手推荐','</span>',
					// 	'{{??}}',
					// 		'<span class="labBg">{{=item.label}}','</span>',
					// 	'{{?}}',
					// '{{?}}',
					// '</span>',
					// '<span class="plabel">',
					// 	'{{?item.pushLabel !=""}}',
					// 		'<span class="labBg">{{=item.pushLabel}}','</span>',
					// 	'{{?}}',
					// '</span>',
				'</div>',
				'<div class="itemLeft">',
					'{{?item.addRate == 0}}',
						'{{?item.addInterestLabel !="" }}',
							'<span class="title-p">{{=(item.minRate).toFixed(1)}}',
								'<i class="InterestLabel">%','</i>',
								'<i class="InterestLabel" style="color:#FF721F;">{{=item.addInterestLabel}}','</i>',
							'</span>',
						'{{??}}',
							//id="buy{{=item.investCycle}}"主要用作如果是9周的话保留2位小数
							'<span class="title-p" id="buy{{=item.investCycle}}">{{=(item.minRate).toFixed(1)}}',
								'<i class="InterestLabel">%','</i>',
							'</span>',
						'{{?}}',
					'{{??}}',
						'{{?item.addInterestLabel !="" }}',
							'<span class="title-p">{{=(item.minRate).toFixed(1)}}',
								'<i class="InterestLabel">%','</i>',
								'<i class="InterestLabel" style="color:#FF721F;">+{{=item.addRate.toFixed(1)}}{{=item.addInterestLabel}}','</i>',
							'</span>',
						'{{??}}',
							'<span class="title-p">{{=(item.minRate).toFixed(1)}}',
								'<i class="InterestLabel">%','</i>',
								'<i class="InterestLabel" style="color:#FF721F;">+{{=item.addRate.toFixed(1)}}%','</i>',
							'</span>',
						'{{?}}',
					'{{?}}',
					'<span class="title-top">历史年化收益','</span>',

				'</div>',
				'<div class="itemCenter">',
					'<span class="title-p">',
						'<i class="investCycle">{{=item.investCycle}}','</i>',
						'<i class="investType">{{=item.investType}}','</i>',
					'</span>',
					'<span class="title-top">期限','</span>',
				'</div>',
				'<div class="itemRright">',
					'{{?item.buyStatus==2}}',//if  buyStatus=2为融资中 可购买
						'{{?item.investCycle == 3 && (item.minRate + item.addRate != 14)}}',
							'{{?item.week3 == 1}}',
								'{{?item.week3Level10000 == 1 || item.week3Level30000 == 1 || item.week3Level50000 == 1 }}',
									'<a href="javascript:;" class="item-buy" onClick="item_buy({{=item.prodId}})">立即加入','</a>',
								'{{??}}',
									'<a href="javascript:;" id="no_buy2" class="item-buy item-gray">立即加入','</a>',
								'{{?}}',
							'{{??item.week3 == 0}}',
								'{{?item.currentStockValidator == 1}}',
									'<a href="javascript:;" class="item-buy" onClick="item_buy({{=item.prodId}})">立即加入','</a>',
								'{{??}}',
								'<a href="javascript:;" id="no_buy" class="item-buy item-gray">立即加入','</a>',
								'{{?}}',
							'{{?}}',
						'{{??item.investCycle == 14}}',
							'{{?item.loanCycle14 == 1 || item.queryUser14WeekExt == 1}}',
								'<a href="javascript:;" class="item-buy" onClick="item_buy({{=item.prodId}})">立即加入','</a>',
							'{{??}}',
								'<a href="javascript:;" id="no_buy14" class="item-buy item-gray">立即加入','</a>',
							'{{?}}',
						'{{??}}',
							'<a href="javascript:;" class="item-buy" onClick="item_buy({{=item.prodId}})">立即加入','</a>',
						'{{?}}',
					'{{??item.buyStatus==20}}',//else if  buyStatus=20等待加入 不可购买
						'<a href="javascript:;" class="item-buy item-gray dengdai" >等待加入','</a>',
					'{{??}}',//else 已售罄 不可购买
						'<a href="javascript:;" class="item-buy item-gray" ><img class="yishouxinimg" src="../../images/pages/financing/regular3.0/item-gray.png" />','</a>',
					'{{?}}',
				'</div>',
			'</div>',


			'{{?}}',
	'{{~}}'
	].join(''));

    //新手标list   未购买可立即加入
	var setMapnew = doT.template([
	    '{{~it :item:index}}',
	    	'{{?item.newProd != 0}}',
	    		'{{?item.newProd == item.loanCycle || item.newProd == 6}}',

	    	
					'<div class="regularItem" onClick="mapnewItem({{=item.prodId}})">',
						'<div class="itemName">',
							'<img src="../../images/pages/financing/regular3.0/new.png" style="width:1.6rem;height:0.533rem;vertical-align:middle;margin-right:0.2133rem;margin-top:-0.0988rem;"/>',
							'<span class="pName">{{=item.prodTitleNew}}','</span>',
							// '{{?item.addRate != 0}}',
							'{{?item.label !=null && item.label !="" && item.label !=undefined}}',

							'<span class="addRate"><img src="../../images/pages/financing/regular3.0/gift.png"/><span>{{=item.label}}</span>','</span>',
							'{{?}}',
							'<span class="plabel">',
							'{{?item.label !=null && item.label !="" && item.label !=undefined}}',
								'{{?item.label =="hot"}}',
									'<span class="labBg">正在热卖','</span>',
								'{{??item.label =="new"}}',
									'<span class="labBg">新手标','</span>',
								'{{??}}',
									'<span class="labBg">{{=item.label}}','</span>',
								'{{?}}',
							'{{?}}',
							'</span>',
							'<span class="plabel">',
								'{{?item.pushLabel !=""}}',
									'<span class="labBg">{{=item.pushLabel}}','</span>',
								'{{?}}',
							'</span>',
						'</div>',
						'<div class="itemLeft">',
							'{{?item.addRate == 0}}',
								'{{?item.addInterestLabel !="" }}',
									'<span class="title-p">{{=(item.minRate).toFixed(1)}}',
									'<i class="InterestLabel">%','</i>',
										// '<i class="InterestLabel">{{=item.addInterestLabel}}','</i>',
									'</span>',
								'{{??}}',
									'<span class="title-p">{{=(item.minRate).toFixed(1)}}',
										'<i class="InterestLabel">%','</i>',
									'</span>',
								'{{?}}',
							'{{??}}',
								'{{?item.addInterestLabel !="" }}',
									'<span class="title-p">{{=(item.minRate).toFixed(1)}}',
										'<i class="InterestLabel">+{{=item.addRate.toFixed(1)}}{{=item.addInterestLabel}}','</i>',
									'</span>',
								'{{??}}',
									'<span class="title-p">{{=(item.minRate).toFixed(1)}}',
										'<i class="InterestLabel">+{{=item.addRate.toFixed(1)}}%','</i>',
									'</span>',
								'{{?}}',
							'{{?}}',
							'<span class="title-top">历史年化收益','</span>',
						'</div>',
						'<div class="itemCenter">',
							'<span class="title-p">',
								'<i class="investCycle">期限{{=item.investCycle}}','</i>',
								'<i class="investType">{{=item.investType}}','</i>',
							'</span>',
							'{{?item.loanCycle == 2}}',
								'<span class="title-top">加入上限100,000元','</span>',
							'{{??}}',
								'<span class="title-top">加入上限120,000元','</span>',
							'{{?}}',
						'</div>',

						// '<div class="itemRright">',
							'{{?item.buyStatus==2}}',//if  buyStatus=2为融资中 可购买
								'<div class="itemRright">',
									'<a href="javascript:;" class="item-buy" onClick="new_buy({{=item.prodId}})">立即加入','</a>',
								'</div>',

							'{{??item.buyStatus==20}}',//else if  buyStatus=20等待加入 不可购买
								'<div class="itemRright">',
									'<a href="javascript:;" class="item-buy item-gray" >等待加入','</a>',
								'</div>',
							'{{??}}',//else 已售罄 不可购买
								'<a href="javascript:;" class="item-buy item-gray" ><img class="yishouxinimg" src="../../images/pages/financing/regular3.0/item-gray.png" />','</a>',
							'{{?}}',
						// '</div>',
					'</div>',

				'{{?}}',
	    	'{{?}}',
		'{{~}}'
	].join(''));

	//0112
	//新手标list   已购买 灰
	var havebuyNew = doT.template([
	    '{{~it :item:index}}',
			'<div class="regularItem" onClick="mapnewItem({{=item.prodId}})">',
				'<div class="itemName">',
					'<span class="pName">{{=item.prodTitleNew}}','</span>',
					// '{{?item.addRate != 0}}',
					'{{?item.label !=null && item.label !="" && item.label !=undefined}}',
					
					'<span class="addRate"><img src="../../images/pages/financing/regular3.0/gift.png"/><span>{{=item.label}}</span>','</span>',
					'{{?}}',
					'<span class="plabel">',
					'{{?item.label !=null && item.label !="" && item.label !=undefined}}',
						'{{?item.label =="hot"}}',
							'<span class="labBg">正在热卖','</span>',
						'{{??item.label =="new"}}',
							'<span class="labBg">新手标','</span>',
						'{{??}}',
							'<span class="labBg">{{=item.label}}','</span>',
						'{{?}}',
					'{{?}}',
					'</span>',
					'<span class="plabel">',
						'{{?item.pushLabel !=""}}',
							'<span class="labBg">{{=item.pushLabel}}','</span>',
						'{{?}}',
					'</span>',
				'</div>',
				'<div class="itemLeft">',
					'{{?item.addRate == 0}}',
						'{{?item.addInterestLabel !="" }}',
							'<span class="title-p">{{=(item.minRate).toFixed(1)}}%',
								// '<i class="InterestLabel">{{=item.addInterestLabel}}','</i>',
							'</span>',
						'{{??}}',
							'<span class="title-p">{{=(item.minRate).toFixed(1)}}%',
								'<i class="InterestLabel">%','</i>',
							'</span>',
						'{{?}}',
					'{{??}}',
						'{{?item.addInterestLabel !="" }}',
							'<span class="title-p">{{=(item.minRate).toFixed(1)}}%',
								// '<i class="InterestLabel">+{{=item.addRate.toFixed(1)}}{{=item.addInterestLabel}}','</i>',
							'</span>',
						'{{??}}',
							'<span class="title-p">{{=(item.minRate).toFixed(1)}}%',
								// '<i class="InterestLabel">+{{=item.addRate.toFixed(1)}}','</i>',
							'</span>',
						'{{?}}',
					'{{?}}',
					'<span class="title-top">历史年化收益 ','</span>',
				'</div>',
				'<div class="itemCenter">',
					'<span class="title-p">',
						'<i class="investCycle">{{=item.investCycle}}','</i>',
						'<i class="investType">{{=item.investType}}','</i>',
					'</span>',
					'<span class="title-top">期限','</span>',
				'</div>',
				'<div class="itemRright">',
						'{{?item.buyStatus!=2}}',//if  buyStatus=2为融资中 可购买
							'<a href="javascript:;" class="item-buy item-gray" ><img class="yishouxinimg" src="../../images/pages/financing/regular3.0/item-gray.png" />','</a>',
						'{{??}}',//if  buyStatus=2为融资中 可购买
							'<a href="javascript:;" class="item-buy item-gray" >已购买','</a>',
						'{{?}}',
				'</div>',
			'</div>',
	'{{~}}'
	].join(''));

	// 判断可以购买14周
	if(userId){
    	$.ajax({
	    	url:Setting.apiRoot1 + '/u/queryUser14Week.p2p',
	    	type:"POST",
	    	dataType:'json',
	    	async:false,
	    	data:{
	    		userId:userId,
	    		loginToken:sessionStorage.getItem('loginToken')
	    	}
	    }).done(function(res){
	    	if(res.code == 1){
	    		var data = res.data;
	    		levelRate = data.levelRate;//最大利率
	    		isAmt = data.maxPurchasedAmt - data.purchasedAmt;//最大限额 - 已购买额度
				loanCycle14 = 0;
				switch(parseInt(data.level)){
					case 1:loanCycle14 = data.levelRate == 11 ? 1:0;break;
					case 2:loanCycle14 = data.levelRate == 13 ? 1:0;break;
					case 3:loanCycle14 = data.levelRate == 15.5 ? 1:0;break;
					case 4:loanCycle14 = data.levelRate == 17 ? 1:0;break;
				}
	    	}
	    })

	    /**
       * 特殊用户14周
       * @userId  {[number]}  用户id 
       * @loginToken {[type]}  loginToken 
       * @return 
     */
	    $.ajax({
	      url:Setting.apiRoot1 + '/u/queryUser14WeekExt.p2p',
	      dataType:'json',
	      type:'POST',
	      async:false,
	      data:{
	        userId:userId,
	        loginToken:sessionStorage.getItem('loginToken'),
	      }
	    }).done(function(res){
	      if(res.code == 1){
	       if(res.data.maxPurchasedAmt - res.data.purchasedAmt > 0){
	       		queryUser14WeekExt = 1;
	       }
	       level14 = res.data.levelRate;
	      }
	    }).fail(function(){
      		Common2.toast('网络异常',Setting.staticRoot+'/images/pages/ui/wifi.png');
	    });

	    /**
       * 验证用户是否可以参加活期转化3周定期
       * @userId  {[number]}  用户id 
       * @loginToken {[type]}  loginToken 
       * @return 
     */
	    $.ajax({
	      url:Setting.apiRoot1 + '/u/currentStockValidator.p2p',
	      dataType:'json',
	      type:'POST',
	      async:false,
	      data:{
	        userId:userId,
	        loginToken:sessionStorage.getItem('loginToken'),
	      }
	    }).done(function(res){
	      if(res.code == 1){
	       if(res.data == 1){
	       	currentStockValidator = 1;
	       }
	      }
	    }).fail(function(){
      		Common2.toast('网络异常',Setting.staticRoot+'/images/pages/ui/wifi.png');

	    })
    }

	$.ajax({
		url: Setting.apiRoot1 + '/queryInvestPageInfo.p2p',
		type: 'post',
		dataType: 'json',
		async:false,
		data:{
			week14:1
		}
	}).done(function(res){
		// console.log('固定收入：',res.data.regularList.regularListDetail)
		if(res.code == 1) {
            //周周派息列表
            var regularList = res.data.regularList;
            $regularTitle.text(regularList.title);
            $regulartitle_p.text(regularList.showLabel);
            regularListDetail = res.data.regularList.regularListDetail;
            // 3周标判断
            if(userId && sessionStorage.getItem('loginToken')){
            	$.ajax({
					url:Setting.apiRoot1 + "/u/checkUser3Week.p2p",
					type:'post',
					dataType:'json',
					async:false,
					data:{
						userId : userId,
						loginToken : sessionStorage.getItem('loginToken')
					}
				}).done(function(data){
					Common.ajaxDataFilter(data,function(){
						if(data.code == 1){
							week3 = data.data.week3;
							week3Level10000 = data.data.week3Level10000;
							week3Level30000 = data.data.week3Level30000;
							week3Level50000 = data.data.week3Level50000;
						}else{
							Common2.toast(data.message);
						}
					})
				}).fail(function(res){
                  	Common2.toast('网络异常',Setting.staticRoot+'/images/pages/ui/wifi.png');
					return false;
				});
            }
            for (var i = 0; i < regularListDetail.length; i++) {
                var detailLength = regularListDetail[i].investTerm.length;
                regularListDetail[i].investCycle = regularListDetail[i].investTerm.substr(0, detailLength - 1);
                regularListDetail[i].investType = regularListDetail[i].investTerm.substr(detailLength - 1, 1);
                regularListDetail[i].week3 = week3;
                regularListDetail[i].week3Level10000 = week3Level10000;
                regularListDetail[i].week3Level30000 = week3Level30000;
                regularListDetail[i].week3Level50000 = week3Level50000;
                regularListDetail[i].currentStockValidator = currentStockValidator;
                if(regularListDetail[i].loanCycle == 14){
                	regularListDetail[i].queryUser14WeekExt = queryUser14WeekExt;
                	regularListDetail[i].level14 = level14;
                	if(regularListDetail[i].minRate + regularListDetail[i].addRate == levelRate && loanCycle14 == 1){
                		if(isAmt > 0){
                			regularListDetail[i].loanCycle14 = 1;//利率可能变化
                		}else if(isAmt <= 0){
                			regularListDetail[i].loanCycle14 = 2;//利率可能变化
                		}
					}else{
						regularListDetail[i].loanCycle14 = 0;
					}
				}
            }
            $tabcon1.html(setListData1(regularListDetail));
            //如果是2周则保留2位小数
            for (var i = 0; i < regularListDetail.length; i++) {
                if (regularListDetail[i].investCycle == 9) {
                    $('#buy9').html((regularListDetail[i].minRate).toFixed(2));
                }
            }
            //新手标mapNewprodList
            // newProdListDetail = res.data.mapNewprodList.newProdListDetail;
            newProdListDetail = res.data.mapNewprodList2.newProdListDetail;
            for (var i = 0; i < newProdListDetail.length; i++) {
                var detailLength = newProdListDetail[i].investTerm.length;
                newProdListDetail[i].investCycle = newProdListDetail[i].investTerm.substr(0, detailLength - 1);
                newProdListDetail[i].investType = newProdListDetail[i].investTerm.substr(detailLength - 1, 1);
                newProdListDetail[i].newProd = newProd;
            }
            $('.mapnew').html(setMapnew(newProdListDetail));

            //已购买新手havebuyNew
            // $('.havebuyNew').html(havebuyNew(newProdListDetail));


           
        }
	}).fail(function(){
  		Common2.toast('网络异常',Setting.staticRoot+'/images/pages/ui/wifi.png');

	});


    var vjr_selectedConpon_id = sessionStorage.getItem('vjr_selectedConpon_id');
    if(vjr_selectedConpon_id != undefined || vjr_selectedConpon_id != null || vjr_selectedConpon_id != '') {
        sessionStorage.removeItem('vjr_selectedConpon_id');
    }

    var vjr_selectedConpon = sessionStorage.getItem('vjr_selectedConpon');
    if(vjr_selectedConpon != undefined || vjr_selectedConpon != null || vjr_selectedConpon != '') {
        sessionStorage.removeItem('vjr_selectedConpon');
    }

    var slreValue = sessionStorage.getItem('slreValue');
    if(slreValue != undefined || slreValue != null || slreValue != '') {
        sessionStorage.removeItem('slreValue');
    }

    var haveuse = sessionStorage.getItem('haveuse');
    if(haveuse != undefined || haveuse != null || haveuse != '') {
        sessionStorage.removeItem('haveuse');
    }

    var clicktype = sessionStorage.getItem('clicktype');
    if(clicktype != undefined || clicktype != null || clicktype != '') {
        sessionStorage.removeItem('clicktype');
    }

});

var flag = 0;
function new_buy(prodId){
	if(!userId){
		Common.toLogin();
		flag = 1;
		return false;
	}
	if (validName!=1) {
		$ui_dialog_name.removeClass('hide');
		$btn_link_name.attr('href',Setting.staticRoot + '/pages/my-account/setting/real-name.html');
		$btn_default_name.attr('href',Setting.staticRoot + '/pages/financing/regular.html');
		flag = 1;
		return false;
	}
	if (validTrade!=1) {
		$ui_dialog_trade.removeClass('hide');
		$btn_link_trade.attr('href',Setting.staticRoot + '/pages/my-account/setting/dealPassword-setting.html');
		$btn_default_trade.attr('href',Setting.staticRoot + '/pages/financing/regular.html');
		flag = 1;
		return false;
	}
	if (validTrade==1 && validName==1) {
		for(var i=0;i<newProdListDetail.length;i++){
			if(newProdListDetail[i].prodId==prodId){
				pid = newProdListDetail[i].prodId;
				var detailLength = newProdListDetail[i].investTerm.length;
				pname = newProdListDetail[i].investTerm.substr(0, detailLength - 1);
			}
		}
		//window.location.href =  '../../pages/financing/buy3.0.html?'+ $.param(_data);
		window.location.href = '../../pages/financing/buy3.0.html?pid='+ pid;//定期购买页
	}
	flag = 0;
	event.stopPropagation();
}

function item_buy(prodId){
	if(!userId){
		Common.toLogin();
		flag = 1;
		return false;
	}
	if (validName!=1) {
		$ui_dialog_name.removeClass('hide');
		$btn_link_name.attr('href',Setting.staticRoot + '/pages/my-account/setting/real-name.html');
		$btn_default_name.attr('href',Setting.staticRoot + '/pages/financing/regular.html');
		flag = 1;
		return false;
	}
	if (validTrade!=1) {
		$ui_dialog_trade.removeClass('hide');
		$btn_link_trade.attr('href',Setting.staticRoot + '/pages/my-account/setting/dealPassword-setting.html');
		$btn_default_trade.attr('href',Setting.staticRoot + '/pages/financing/regular.html');
		flag = 1;
		return false;
	}
	if (validTrade==1 && validName==1) {
		for(var i=0;i<regularListDetail.length;i++){
			if(regularListDetail[i].prodId==prodId){
				pid=regularListDetail[i].prodId;
				var detailLength = regularListDetail[i].investTerm.length;
				pname = regularListDetail[i].investTerm.substr(0, detailLength - 1);
			}
		}
		//window.location.href =  '../../pages/financing/buy3.0.html?'+ $.param(_data);
		window.location.href = '../../pages/financing/buy3.0.html?pid='+pid;//定期购买页
	}
	flag = 0;
	event.stopPropagation();
}

$('.ui-dialog').on('click', function() {
	flag = 0;
});
$('.close').on('click', function() {
	$('.ui-dialog').addClass('hide');
});

function regularItem(e,prodId){
	if(flag==1)return false;
	for(var i=0;i<regularListDetail.length;i++){
		if(regularListDetail[i].prodId==prodId){
			_data = {
				  pid: regularListDetail[i].prodId,
				  pname: regularListDetail[i].prodTitleNew,
				  pmount: regularListDetail[i].canBuyAmt,
				  minInvestAmount: regularListDetail[i].minBuyAmt,
				  maxInvestAmount: regularListDetail[i].maxBuyAmt,
				  maxRate:regularListDetail[i].maxRate,
				  minRate:regularListDetail[i].minRate,
				  addRate:regularListDetail[i].addRate,
				  cycle:regularListDetail[i].loanCycle,
				  cycleType:regularListDetail[i].cycleType,
				  // act10:regularListDetail[i].act10,//是否参加iphone活动 0不参加  1参加
				  // act11:regularListDetail[i].act11,//是否参加投资返现活动 0不参加  1参加
				  action:regularListDetail[i].action,//是否参加大额加息
				  action2:regularListDetail[i].action2,//是否参加加息券
				  action5:regularListDetail[i].action5,//是否参加投资红包
				  addInterest:regularListDetail[i].addInterestLabel,
				  detailLabel:regularListDetail[i].detailLabel,
				  buyStatus:regularListDetail[i].buyStatus
			};
		}
	}
	var e = e ? e : window.event;
	var tar = e.target || e.srcElement;
	if(tar.id == 'no_buy'){
		Common2.toast('您不符合购买条件，详情请参照“3周专享活动”规则');
	}else if(tar.id == 'no_buy2'){
		Common2.toast('每一个金额档次只能投资一次，请勿重复购买');
	}else if(tar.id == 'no_buy14'){
		Common2.toast('可投余额不足');
	}else{
		window.location.href =  '../../pages/financing/regular-detail3.0.html?'+ $.param(_data);

	}
}

function mapnewItem(prodId){
	if(flag==1)return false;
	for(var i=0;i<newProdListDetail.length;i++){
		if(newProdListDetail[i].prodId==prodId){
			_data = {
				  pid: newProdListDetail[i].prodId,
				  pname: newProdListDetail[i].prodTitleNew,
				  pmount: newProdListDetail[i].canBuyAmt,
				  minInvestAmount: newProdListDetail[i].minBuyAmt,
				  maxInvestAmount: newProdListDetail[i].maxBuyAmt,
				  maxRate:newProdListDetail[i].maxRate,
				  minRate:newProdListDetail[i].minRate,
				  addRate:newProdListDetail[i].addRate,
				  cycle:newProdListDetail[i].loanCycle,
				  cycleType:newProdListDetail[i].cycleType,
				  action:newProdListDetail[i].action,//是否参加大额加息
				  action2:newProdListDetail[i].action2,//是否参加加息券
				  action5:newProdListDetail[i].action5,//是否参加投资红包
				  addInterest:newProdListDetail[i].addInterestLabel,
				  detailLabel:newProdListDetail[i].detailLabel,
				  buyStatus:newProdListDetail[i].buyStatus
			};
		}
	}
	window.location.href =  '../../pages/financing/regular-detail3.0.html?'+ $.param(_data);
}