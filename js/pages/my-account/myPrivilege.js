/*
* @Author: User
* @Date:   2016-10-26 09:56:26
* @Last Modified by:   User
* @Last Modified time: 2017-01-13 18:03:06
*/
var url = location.search; //获取url中"?"符后的字串
var param = {};
if (url.indexOf("?") != -1) {
  var str = url.substr(1);
  strs = str.split("&");
  for(var i = 0; i < strs.length; i ++) {
     param[strs[i].split("=")[0]] = decodeURIComponent(strs[i].split("=")[1]);
  }
}
var type = param.type;
var userId,loginToken,vipRank;
	
$(function(){
	// ios调用h5页面
	if(type == 2){
		userId = param.uid;
		loginToken = param.loginToken;
	}else{
		userId = sessionStorage.getItem('uid');
		loginToken = sessionStorage.getItem('loginToken');
	}
	if(!userId){
		// ios APP跳转到登录
		if(type == 2){
			iOS.HtmlJumpLogin();
		}else{
			Common.toLogin();
			return false;
		}
	}
	var list = [
		{
			title:'完成风险测评',
			integral:200,
			id:1,
			flagStatus:1
		},
		{
			title:'完成风险测评',
			integral:200,
			id:1,
			flagStatus:2
		},
		{
			title:'完成风险测评',
			integral:200,
			id:1,
			flagStatus:3
		}
	];

	// 积分任务
	var integralList = doT.template([
		'{{~it:item:index}}',
		'<div class="content-list clearfix">',
			'<div class="float-left">',
				'<img src={{=item.ruleObj.imageUrl}}>',
			'</div>',
			'<div class="float-left content-right">',
				'<div class="float-left">',
					'<div class="content-title">{{=item.title}}</div>',
					'<div class="content-text">+{{=item.integral}}积分</div>',
				'</div>',
				'{{? item.flagStatus == 1}}',
					'<a class="float-right button" href="'+Setting.staticRoot+'{{=item.ruleObj.url}}'+window.location.search+'" style="background:#fff;color:#D7BB88;border:0.02666rem solid #D7BB88;">去完成</a>',
				'{{?? item.flagStatus == 2}}',
					'<div class="float-right button botton2" data-id={{=item.id}} >领取奖励</div>',
				'{{?? item.flagStatus == 3}}',
					'<div class="float-right button botton3" style="background:#fff;color:#9B9B9B;border:0.02666rem solid #9B9B9B;">已完成</div>',
				'{{?}}',
			'</div>',
		'</div>',
		'{{~}}'
	].join(''));

	getListData();
	// 积分任务
	getmemberTaskList();

	// 积分商城的商品
	var integralMall = doT.template([
		'{{~it:item:index}}',
		'<div class="details" data-id={{=item.prodId}} data-stock={{=item.stock}}>',
			'<img src="{{=item.imagesUrl}}" style="width:2.666rem;height:1.7066rem;">',
			'<div class="integralMall-title">{{=item.prodName}}</div>',
			'<div class="integralMall-money">{{=item.score}}积分</div>',
		'</div>',
		'{{~}}'
	].join(''));

	$.ajax({
		url: Setting.apiRoot1 + '/getProdList.p2p',
		type: 'get',
		dataType: 'json',
		async:false,
	}).done(function(res){
		Common.ajaxDataFilter(res,function(){
			if(res.code == 1){
				$('.integralMall-content').html(integralMall(res.data));
				$('.details').click(function(){
					var id = $(this).data('id');
					var stock = $(this).data('stock');
					window.location.href = '../../pages/shoppingMall/commodityExchange/details.html?goodsId='+ id+'&stock=' + stock + window.location.search.replace('?','&');
				})
			}else{
				Common2.toast(res.message);
			}
		})
	}).fail(function(){
		alert('网络链接失败');
	});

	
	function getListData(){
		// •会员中心接口
		$.ajax({
			url: Setting.apiRoot1 + '/u/memberCenter.p2p',
			type: 'post',
			dataType: 'json',
			async:false,
			data:{
				'userId':userId,
		      	'loginToken':loginToken
			}
		}).done(function(res){
			Common.ajaxDataFilter(res,function(){
				if(res.code == 1){
					$('.wrapper').removeClass('hide');
					var data=res.data;
					vipRank=data.vipRank;//用户当前等级
					sessionStorage.setItem('vipRank',vipRank);
					investTotal = data.investTotal;//当前投资总额
					annualizedAssets = data.annualizedAssets;//当前年华额
					investTotalSub = data.investTotalSub;//用户距离下一个等级需要投资额
					annualizedAssetsSub = data.annualizedAssetsSub;//用户距离下一个等级需要年华额
					/*banner*/
					// 已经获得的等级显示
					$('.slide-text').each(function(index,item){
						if(index <= vipRank){
							$(this).html(data.honoredName);
						}
					})
					// 未获得的等级的显示
					List = data.vipList;//每个等级的数据
					for(var i = 1;i < List.length; i++){
						var InvestTotalCount = List[i].minInvestTotal - investTotal;
						var AnnualizedAssetsCount = List[i].minAnnualizedAssets - annualizedAssets;
						if(InvestTotalCount <=0 && AnnualizedAssetsCount > 0){
							if(AnnualizedAssetsCount.toString().indexOf('.') > 0){
								$('.numCount').eq(i-1-vipRank).html('还差'+ parseFloat(AnnualizedAssetsCount).toFixed(2) +'年化额升级');
							}else{
								$('.numCount').eq(i-1-vipRank).html('还差'+ AnnualizedAssetsCount +'年化额升级');
							}
						}else if(InvestTotalCount > 0){
							if(InvestTotalCount.toString().indexOf('.') > 0){
								$('.numCount').eq(i-1-vipRank).html('还需'+ parseFloat(InvestTotalCount).toFixed(2) +'投资额升级');
							}else{
								$('.numCount').eq(i-1-vipRank).html('还需'+ InvestTotalCount +'投资额升级');
							}
						}
						// 水柱
						if((i-1) == vipRank){
							// percentage = investTotal/List[i].minInvestTotal*100;
							percentage = annualizedAssets/List[i].minAnnualizedAssets*100;
							if(percentage > 100){
								percentage = 100;
							}else if(percentage <=0 ){
								percentage = 0;
							}
							$('.percentage-line').css('width',percentage + '%');
							var percentage2 = percentage-(percentage/100 * percentage/10);
							if(percentage2 > 90.2){
								percentage2 = 90.2;
							}else if(percentage2 <=0 ){
								percentage2 = 0;
							}
							$('.triangle').css('left',percentage2 + '%');
						}
						if(vipRank == 4){
							percentage = 100;
							$('.percentage-line').css('width',percentage + '%');
							$('.triangle').css('left',percentage-(percentage/100 * percentage/10) + '%');
						}
					}
					// •vip登记年化达标额获取
					if(vipRank == 4){
						$('.percentage-title').html('恭喜您已是钻石会员，继续投资享更多惊喜！');
					}else{
						if(annualizedAssetsSub > 0 && investTotalSub > 0){
							$('.annualAmount').html(annualizedAssetsSub);
							$('.investmentAmount').html(investTotalSub);
							// 加速升级，获取特权的滚动效果
							var swiper2ActiveIndex = 0;
							setInterval(function(){
								swiper2ActiveIndex -= 1;
								$('.swiper2-wrapper').animate({'top':swiper2ActiveIndex+'rem'},function(){
									if(swiper2ActiveIndex <= -2){
										swiper2ActiveIndex = 0;
										$(this).css('top','0');
									}
								})
							},5000)
						}else if(annualizedAssetsSub > 0 && investTotalSub <= 0){
							$('.annualAmount').html(annualizedAssetsSub);
							$('.gapInvestTotal').css('display','none');
						}else if(annualizedAssetsSub <= 0 && investTotalSub > 0){
							$('.investmentAmount').html(investTotalSub);
							$('.gapannualAmount').css('display','none');
							$('.gapannualAmount').eq(1).css('display','none');
						}
					}
					
					
					// 
					if(vipRank == 1){
						$('.silver img').each(function(){
							var src = $(this).attr('src').replace('2.png','')
							$(this).attr('src',src+'.png');
							$('.silver').css('display','block');
						});
					}else if(vipRank == 2){
						$('.gold img').each(function(){
							var src = $(this).attr('src').replace('2.png','')
							$(this).attr('src',src+'.png');
							$('.gold').css('display','block');
						});
					}else if(vipRank == 3){
						$('.platinum img').each(function(){
							var src = $(this).attr('src').replace('2.png','')
							$(this).attr('src',src+'.png');
							$('.platinum').css('display','block');
						});
					}else if(vipRank == 4){
						$('.diamonds img').each(function(){
							var src = $(this).attr('src').replace('2.png','')
							$(this).attr('src',src+'.png');
							$('.diamonds').css('display','block');
						});
					}else{
						$('.ordinary img').each(function(){
							var src = $(this).attr('src').replace('2.png','')
							$(this).attr('src',src+'.png');
							$('.ordinary').css('display','block');
						});
					}
					var flag = true;
					var mySwiper = new Swiper ('.swiper-container', {
				        pagination: '.swiper-pagination',
				        slidesPerView: 1,
				        touchRatio : 0.5,
				        paginationClickable: true,
				        // spaceBetween: 10,
				        initialSlide :vipRank,//初始化时显示那个
				        onInit: function(swiper){
					      if(flag){
				        		var slideContent = $('.swiper-slide-active .slide-content');
								$('<div class="nowGrade">当前等级</div>').appendTo(slideContent);
								flag = false;
				        	}
					    },
				        onSlideChangeStart: function(swiper){
							vipIndex=swiper.activeIndex;//切换结束时，告诉我现在是第几个slide
							
							$('.privilege>a').css('display','none');
							$('.privilege img').each(function(){
								if($(this).attr('src').indexOf('2.png') < 0){
									var src = $(this).attr('src').replace('.png','')
									$(this).attr('src',src+'2.png')
								}
							})
							if(vipIndex > 1){
								$('.moreButton').css('display','block')
							}else{
								$('.moreButton').css('display','none')
							}

							if(vipIndex <= vipRank){
								if(vipRank == 1){
									$('.silver img').each(function(){
										var src = $(this).attr('src').replace('2.png','')
										$(this).attr('src',src+'.png');
									});
								}else if(vipRank == 2){
									$('.gold img').each(function(){
										var src = $(this).attr('src').replace('2.png','')
										$(this).attr('src',src+'.png')
									});
								}else if(vipRank == 3){
									$('.platinum img').each(function(){
										var src = $(this).attr('src').replace('2.png','')
										$(this).attr('src',src+'.png')
									});
								}else if(vipRank == 4){
									$('.diamonds img').each(function(){
										var src = $(this).attr('src').replace('2.png','')
										$(this).attr('src',src+'.png')
									});
								}else{
									$('.ordinary img').each(function(){
										var src = $(this).attr('src').replace('2.png','')
										$(this).attr('src',src+'.png')
									});
								}
							}
							if(vipIndex == 1){
								$('.line-text').text('白银会员特权');
								$('.silver').css('display','block');
							}else if(vipIndex == 2){
								$('.line-text').text('黄金会员特权');
								$('.gold').css('display','block');
							}else if(vipIndex == 3){
								$('.line-text').text('铂金会员特权');
								$('.platinum').css('display','block');
							}else if(vipIndex == 4){
								$('.line-text').text('钻石会员特权');
								$('.diamonds').css('display','block');
							}else{
								$('.line-text').text('普通会员特权');
								$('.ordinary').css('display','block');
							}
							if(vipIndex == vipRank){
								$('.line-text').text('我的特权');
							}
				    	}
					});
				}else if(res.code != -99){//未实名认证
					window.location.href = './notRealName.html';
				}
			})
		}).fail(function(){
			alert('网络链接失败');
		});
		
	};

	// 积分任务
	function getmemberTaskList(){
		$.ajax({
			url:Setting.apiRoot1 + '/u/memberTaskList.p2p',
			type:'post',
			dataType:'json',
			data:{
				userId:userId,
				loginToken:loginToken
			}
		}).done(function(res){
			Common.ajaxDataFilter(res,function(res){
				if(res.code == 1){
					var list = res.data;
					$('.content').html(integralList(list));
					$('.completeMore').removeClass('hide');
					// 已完成
					$('.botton3').click(function(){
						Common2.toast('该任务已完成');
					});
					$('.botton2').click(function(){
						var taskId = $(this).data('id');
						getIntegral(taskId)
					});
				}else{
					$('.completeMore').remove();
					Common2.toast(res.message)
				}
			})
		})
	}
	function getIntegral(taskId){
		$.ajax({
			url:Setting.apiRoot1 + '/u/getIntegral.p2p',
			type:'POST',
			dataType:'json',
			data:{
				userId:userId,
				taskId :taskId, 
				loginToken :loginToken
			}
		}).done(function(res){
			console.log(res)
			if(res.code == 1){
				Common2.toast('领取成功');
				getmemberTaskList();
			}else if(res.code == -99){
				var weixin = sessionStorage.getItem("uuid");
	        	if(weixin!=undefined && weixin!=null && weixin.length>10){
		            Common.weixinLogin(weixin);
	          	}else{
		            sessionStorage.clear();
		            href = href || window.location.href;
	  				window.location.replace(Setting.staticRoot + '/pages/account/login.html?from=' + encodeURIComponent(href));
	          	}
			}else{
				Common2.toast(res.message)
			}
		})
	}
	// 展开
	$('.open').click(function(){
		$('.privilege').css('height','auto')
		$(this).css('display','none');
		$('.stop').css('display','block')
	});
	$('.stop').click(function(){
		$('.privilege').css('height','2.6rem')
		$(this).css('display','none');
		$('.open').css('display','block')
	});

	$('.swiper-wrapper').click(function(){
		window.location.href = '../financing/vipupgrade.html' + window.location.search;
	});
	$('.joinlist').click(function(){
		window.location.href = '../financing/vipupgrade.html' + window.location.search;
	})
});

