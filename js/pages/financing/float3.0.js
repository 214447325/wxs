/*
* @Author: User
* @Date:   2016-09-02 11:03:30
* @Last Modified by:   User
* @Last Modified time: 2017-02-06 17:35:45
*/
var currentFloatListDetail={};//正在热卖产品列表
var pastFloatListDetail={};
var userId =sessionStorage.getItem('uid');
var validName =sessionStorage.getItem('validName');//获取用户实名
var validTrade =sessionStorage.getItem('validTrade');//获取用户交易密码
var $ui_dialog_name = $('.ui-dialog-name');
var $btn_link_name  = $('.btn-link-name',$ui_dialog_name);
var $btn_default_name = $('.btn-default-name',$ui_dialog_name);
var $ui_dialog_trade = $('.ui-dialog-trade');
var $btn_link_trade  = $('.btn-link',$ui_dialog_trade);
var $btn_default_trade = $('.btn-default',$ui_dialog_trade); 
$(function(){
var isWeiXin = Common.isWeiXin();//微信进来的访问判断，不是跳转到官网下载页
var param = Common.getParam();
var weixin = param.weixin;
if(weixin){
  Common.weixinLogin(weixin);
}

var $regularTitle       = $('.regularTitle');
var $regulartitle_p       = $('.regulartitle-p');
var $regularTitle_past       = $('.regularTitle-past');
var $regulartitle_p_past       = $('.regulartitle-p-past');
//理财页接口   七天乐
var $tabcon1       = $('.floatList');//浮动-正在热卖
var $tabcon2       = $('.floatList-past');//浮动-往期
var _data={};//每种产品对应的参数列表
var setListData1 = doT.template([
'{{~it :item:index}}',
	// '<dl >',
	// '<div class="item">',
		'<div class="floatItem" onClick="floatItem({{=item.prodId}})">',
			'<div class="itemName">{{=item.prodTitle}}','</div>',
			'<div class="itemLeft">',
				'<span class="title-p"><span style="font-size:0.4533rem;">{{=(item.minRate).toFixed(1)}}~</span>{{=(item.maxRate).toFixed(1)}}',
					// '<i>%','</i>',
				'</span>',
				'<span class="title-top">历史年化收益率(%)','</span>',
			'</div>',	
			'<div class="itemCenter">',
				'<span class="title-p">',
					'<i class="investCycle">{{=item.investCycle}}','</i>',
					'<i class="investType">{{=item.investType}}','</i>',
				'</span>',
				'<span class="title-top">投资期限','</span>',
			'</div>',
			'<div class="itemRright">',
				'{{?item.buyStatus==2}}',//if  buyStatus=2为融资中 可购买
					'<a href="javascript:;" class="item-buy" onClick="item_buy({{=item.prodId}})">抢购','</a>',
				'{{??item.buyStatus==20}}',//else if  buyStatus=20预约中 不可购买
					'<a href="javascript:;" class="item-buy item-gray" >预约中','</a>',
				'{{??}}',//else 已售罄 不可购买
					'<a href="javascript:;" class="item-buy item-ckjz" >查看净值','</a>',
				'{{?}}',
			'</div>',
			'{{? item.buyStatus != 2 && item.buyStatus !=20}}',
				'<img class="itemRrightImg" src="../../images/pages/financing/float3.0/yishouxin.png" alt="" />',
			'{{?}}'	,
		'</div>',
	// '</div>',
	// '</dl>',
'{{~}}'
].join(''));

var setListData2 = doT.template([
'{{~it :item:index}}',
	// '<dl >',
	// '<div class="item">',
		'<div class="floatItem stopItem" onClick="stopItem({{=item.prodId}})">',
			'<div class="itemName">{{=item.prodTitle}}','</div>',
			'<div class="itemLeft">',
				'<span class="title-p">{{=(item.minRate).toFixed(1)}}',
					// '<i>%','</i>',
				'</span>',
				'<span class="title-top">{{=item.yearRateValue}}</span>',
			'</div>',	
			'<div class="itemCenter">',
				'<span class="title-p">',
					'<i class="investCycle">{{=item.investCycle}}','</i>',
					'<i class="investType">{{=item.investType}}','</i>',
				'</span>',
				'<span class="title-top">投资期限','</span>',
			'</div>',
			'<div class="itemRright">',
				'<a href="javascript:;" class="item-buy item-ckjz">查看净值','</a>',
				// '<img src="../../images/pages/financing/float3.0/yishouxin.png" alt=""  style="width:1.2533rem;"/>',
			'</div>',
				'<img class="itemRrightImg" src="../../images/pages/financing/float3.0/yishouxin.png" alt="" />',
		'</div>',
	// '</div>',
	// '</dl>',
'{{~}}'
].join(''));


      $.ajax({
        url: Setting.apiRoot1 + '/queryInvestPageInfo.p2p',
        type: 'post',
        dataType: 'json'
      }).done(function(res){
        if(res.code == 1){
           //浮动-正在热卖列表
        	var currentFloatList=res.data.currentFloatList;
        	$regularTitle.text(currentFloatList.title);
	$regulartitle_p.text(currentFloatList.showLabel);
	currentFloatListDetail=res.data.currentFloatList.currentFloatListDetail;
	for (var i = 0; i < currentFloatListDetail.length; i++) {
		var detailLength=currentFloatListDetail[i].investTerm.length;
		currentFloatListDetail[i].investCycle=currentFloatListDetail[i].investTerm.substr(0,detailLength-1);
		currentFloatListDetail[i].investType=currentFloatListDetail[i].investTerm.substr(detailLength-1,1);
	}
	$tabcon1.html(setListData1(currentFloatListDetail));
	//浮动-往期产品列表
	var pastFloatList=res.data.pastFloatList;
	$regularTitle_past.text(pastFloatList.title);
	$regulartitle_p_past.text(pastFloatList.showLabel);
	pastFloatListDetail=res.data.pastFloatList.pastFloatListDetail;
	for (var i = 0; i < pastFloatListDetail.length; i++) {
		var detailLength=pastFloatListDetail[i].investTerm.length;
		pastFloatListDetail[i].investCycle=pastFloatListDetail[i].investTerm.substr(0,detailLength-1);
		pastFloatListDetail[i].investType=pastFloatListDetail[i].investTerm.substr(detailLength-1,1);
	}
	$tabcon2.html(setListData2(pastFloatListDetail));

        }else{
        	
        }
      }).fail(function(){
      	alert('网络链接失败');
      });

});

var flag = 0;
function item_buy(prodId){
        if(!userId){
        Common.toLogin();
        flag = 1;
        return false;
        }
        if (validName!=1) {
          $ui_dialog_name.removeClass('hide');
          $btn_link_name.attr('href',Setting.staticRoot + '/pages/my-account/setting/real-name.html');
          $btn_default_name.attr('href',Setting.staticRoot + '/pages/financing/float.html');
          flag = 1;
          return false;
        }
        if (validTrade!=1) {
          $ui_dialog_trade.removeClass('hide');
           $btn_link_trade.attr('href',Setting.staticRoot + '/pages/my-account/setting/dealPassword-setting.html');
          $btn_default_trade.attr('href',Setting.staticRoot + '/pages/financing/float.html');  
          flag = 1;
          return false;          
        }
        if (validTrade==1 && validName==1) {
		 for(var i=0;i<currentFloatListDetail.length;i++){
		 	if(currentFloatListDetail[i].prodId==prodId){
				_data = {
					  pid: currentFloatListDetail[i].prodId,
					  pname: currentFloatListDetail[i].prodTitle,
					  pmount: currentFloatListDetail[i].canBuyAmt,
					  minInvestAmount: currentFloatListDetail[i].minBuyAmt,
					  maxInvestAmount: currentFloatListDetail[i].maxBuyAmt,
					  maxRate:currentFloatListDetail[i].maxRate,
					  minRate:currentFloatListDetail[i].minRate,
					  cycle:currentFloatListDetail[i].loanCycle,
					  cycleType:currentFloatListDetail[i].cycleType,
					  act11:currentFloatListDetail[i].act11,//是否参加投资返现活动
					  buyStatus:currentFloatListDetail[i].buyStatus
				};
		 	}
		 }

		window.location.href =  '../../pages/financing/floatbuy3.0.html?'+ $.param(_data);
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

function floatItem(prodId){
	if(flag==1)return false;

	 for(var i=0;i<currentFloatListDetail.length;i++){
	 	if(currentFloatListDetail[i].prodId==prodId){
			_data = {
				  pid: currentFloatListDetail[i].prodId,
				  investCycle: currentFloatListDetail[i].investCycle,
				  pname: currentFloatListDetail[i].prodTitle,
				  pmount: currentFloatListDetail[i].canBuyAmt,
				  minInvestAmount: currentFloatListDetail[i].minBuyAmt,
				  maxInvestAmount: currentFloatListDetail[i].maxBuyAmt,
				  maxRate:currentFloatListDetail[i].maxRate,
				  minRate:currentFloatListDetail[i].minRate,
				  cycle:currentFloatListDetail[i].loanCycle,
				  cycleType:currentFloatListDetail[i].cycleType,
				  act11:currentFloatListDetail[i].act11,//是否参加投资返现活动
				  buyStatus:currentFloatListDetail[i].buyStatus
			};
	 	}
	 }
	window.location.href =  '../../pages/financing/float-detail3.0.html?'+ $.param(_data);
	event.stopPropagation(); 
}

function stopItem(prodId){
	 for(var i=0;i<pastFloatListDetail.length;i++){
	 	if(pastFloatListDetail[i].prodId==prodId){
			_data = {
				  pid: pastFloatListDetail[i].prodId,
				  investCycle: pastFloatListDetail[i].investCycle,
				  pname: pastFloatListDetail[i].prodTitle,
				  pmount: pastFloatListDetail[i].canBuyAmt,
				  minInvestAmount: pastFloatListDetail[i].minBuyAmt,
				  maxInvestAmount: pastFloatListDetail[i].maxBuyAmt,
				  maxRate:pastFloatListDetail[i].maxRate,
				  minRate:pastFloatListDetail[i].minRate,
				  cycle:pastFloatListDetail[i].loanCycle,
				  cycleType:pastFloatListDetail[i].cycleType,
				  act11:pastFloatListDetail[i].act11,//是否参加投资返现活动
				  buyStatus:pastFloatListDetail[i].buyStatus
			};
	 	}
	 }
	window.location.href =  '../../pages/financing/float-detail3.0.html?'+ $.param(_data)+'&stop=1';
}
