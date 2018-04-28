/*
* @Author: User
* @Date:   2016-10-26 09:56:26
* @Last Modified by:   User
* @Last Modified time: 2017-01-17 16:12:40
*/
	
$(function(){
	$("ul#ticker02").liScroll({travelocity: 0.1});//滚动消息
	var userId = sessionStorage.getItem('uid');
	var loginToken = sessionStorage.getItem('loginToken');
	var useList;
	var unList;
	var rewardAmount = 0;
	var $extractReward= $('.extractReward');
	var $amount       = $('.amount');
	if(!userId){
	Common.toLogin();
	return false;
	}

	var setCoupon = doT.template([
	'{{~it :item:index}}',
		'<div class="coupon">',
			'<div class="detail">',
				'<div class="inprods">',					
					'<span class="indata">{{=(item.amount).toFixed(2)}}','</span>',					
					'{{?item.couponType ==1 || item.couponType ==2 || item.couponType ==3}}',//1天数加息券 //2全程加息券 //3 体验金 
						'<span class="intitle">奖励金额(元)','</span>',
					'{{?}}',
					'{{?item.couponType ==4}}',//4现金红包
						'<span class="intitle">现金红包(元)','</span>',
					'{{?}}',
					'{{?item.couponType ==5}}',//5投资红包 
						'<span class="intitle">投资红包(元)','</span>',
					'{{?}}',
				'</div>',
				'<div class="dashed">','</div>',
				'<div class="cpinfo">',
					'{{?item.couponType ==1}}',
						'<span class="day"><span>使用产品：</span>{{=item.activityName}}','</span>',
						'<span class="application"><span>天数加息券：</span>{{=(item.rateAmount).toFixed(2)}}%','</span>',
						'<span class="awardAmount"><span>领取时间：</span>{{=item.receiveTime}}','</span>',
					'{{?}}',
					'{{?item.couponType ==2}}',
						'<span class="day"><span>使用产品：</span>{{=item.activityName}}','</span>',
						'<span class="application"><span>全程加息券：</span>{{=(item.rateAmount).toFixed(2)}}%','</span>',
						'<span class="application"><span>领取时间：</span>{{=item.receiveTime}}','</span>',
					'{{?}}',
					'{{?item.couponType ==3}}',
						'<span class="day"><span>使用产品：</span>{{=item.activityName}}','</span>',
						'<span class="application"><span>体验金：</span>{{=item.rateAmount}}元','</span>',
						'<span class="application"><span>领取时间：</span>{{=item.receiveTime}}','</span>',
					'{{?}}',
					'{{?item.couponType ==5}}',
						'<span class="day"><span>来源：</span>{{=item.activityName}}','</span>',
						'<span class="day"><span>使用规则：</span>可立即提现','</span>',
					'{{?}}',

					'{{?item.couponType ==4}}',
						'{{?item.remark != "全场达标红利"}}',
							// '<span class="day"><span>来源：</span>{{=item.activityName}}','</span>',
							// '<span class="day"><span>使用规则：</span>可立即提现','</span>',
							'{{? item.remark == "新手标奖励"}}',
								'<span class="day"><span>来源：</span>{{=item.activityName}}','</span>',
								'<span class="day"><span>使用规则：</span>隔日领取','</span>',
							'{{?? item.remark == "会员体系"}}',
								'<span class="day"><span>来源：</span>{{=item.activityName}}','</span>',
								'<span class="day"><span>领取时间：</span>{{=item.receiveTime}}','</span>',
							'{{??}}',
								'<span class="day"><span>来源：</span>{{=item.activityName}}','</span>',
								'<span class="day"><span>使用规则：</span>可立即提现','</span>',
							'{{?}}',
						'{{??}}',
							// '<span class="day"><span>使用产品：</span>{{=item.activityName}}','</span>',
							'<span class="day"><span>来源：</span>{{=item.remark}}','</span>',
							'<span class="day"><span>领取时间：</span>{{=item.receiveTime}}','</span>',
						'{{?}}',
					'{{?}}',
				'</div>',
			'</div>',
			'<div class="state" >',
				'{{?item.status==0 }}',
					// '<img src="../../images/pages/my-account3.0/reward3.0/ddlq.png" class="ddlq"/>',
					'<span style="margin-top:0.65rem;color:#888;">等待领取...</span>',
				'{{??}}',
					// '<img src="../../images/pages/my-account3.0/reward3.0/ddlq.png" class="ddlq"/>',
					'<span style="margin-top:0.5rem;">已获得金额 </span>',
				'{{?}}',
			'</div>',
		'</div>',
	'{{~}}'
	].join(''));

	var setunList = doT.template([
	'{{~it :item:index}}',
		'<div class="coupon setun">',
			'<div class="detail">',
				'<div class="inprods">',
					'<span class="indata">￥{{=(item.amount).toFixed(2)}}','</span>',
					'{{?item.couponType ==1 || item.couponType ==2 || item.couponType ==3}}',//1天数加息券 //2全程加息券 //3 体验金 
						'<span class="intitle">奖励金额(元)','</span>',
					'{{?}}',
					'{{?item.couponType ==4}}',//4现金红包
						'<span class="intitle">现金红包(元)','</span>',
					'{{?}}',
					'{{?item.couponType ==5}}',//5投资红包 
						'<span class="intitle">投资红包(元)','</span>',
					'{{?}}',
				'</div>',
				'<div class="dashed">','</div>',
				'<div class="cpinfo">',
					'{{?item.couponType ==1}}',
						'<span class="day"><span>使用产品：</span>{{=item.activityName}}','</span>',
						'<span class="application"><span>天数加息券：</span>{{=(item.rateAmount).toFixed(2)}}%','</span>',
						'<span class="awardAmount"><span>领取时间：</span>{{=item.receiveTime}}','</span>',
					'{{?}}',
					'{{?item.couponType ==2}}',
						'<span class="day"><span>使用产品：</span>{{=item.activityName}}','</span>',
						'<span class="application"><span>全程加息券：</span>{{=(item.rateAmount).toFixed(2)}}%','</span>',
						'<span class="application"><span>领取时间：</span>{{=item.receiveTime}}','</span>',
					'{{?}}',
					'{{?item.couponType ==3}}',
						'<span class="day"><span>使用产品：</span>{{=item.activityName}}','</span>',
						'<span class="application"><span>体验金：</span>{{=item.rateAmount}}元','</span>',
						'<span class="application"><span>领取时间：</span>{{=item.receiveTime}}','</span>',
					'{{?}}',
					// '{{?item.couponType ==4 || item.couponType ==5}}',
					// 	'<span class="day"><span>来源：</span>{{=item.activityName}}','</span>',
					// 	'<span class="day"><span>使用规则：</span>可立即提现','</span>',
					// '{{?}}',

					'{{?item.couponType ==5}}',
						'<span class="day"><span>来源：</span>{{=item.activityName}}','</span>',
						'<span class="day"><span>使用规则：</span>可立即提现','</span>',
					'{{?}}',

					'{{?item.couponType ==4}}',
						// '{{?item.remark != "浓浓秋意,双倍收益"}}',
						'{{?item.remark != "全场达标红利"}}',
							'{{?item.remark == "新手标奖励"}}',
								'<span class="day"><span>来源：</span>{{=item.activityName}}','</span>',
								'<span class="day"><span>使用规则：</span>隔日领取','</span>',
							'{{??}}',
								'<span class="day"><span>来源：</span>{{=item.activityName}}','</span>',
								'<span class="day"><span>使用规则：</span>可立即提现','</span>',
							'{{?}}',
						'{{??}}',
							// '<span class="day"><span>使用产品：</span>{{=item.activityName}}','</span>',
							'<span class="day"><span>来源：</span>{{=item.remark}}','</span>',
							'<span class="day"><span>领取时间：</span>{{=item.receiveTime}}','</span>',
						'{{?}}',
					'{{?}}',


				'</div>',
			'</div>',
			'<div class="state" >',
			'</div>',
		'</div>',
	'{{~}}'
	].join(''));
	var coun = 1;
	function getList(){
		$.ajax({
			url: Setting.apiRoot1 + '/u/rewardCenter.p2p',
			type: 'post',
			dataType: 'json',
			async:false,
			data:{
				userId:userId,
		      	loginToken:loginToken,
		      	pageNum:coun,
		      	pageSize:10
			}
		}).done(function(res){
			Common.ajaxDataFilter(res,function(){
			var data=res.data;	
			// 先显示可以领取的，在现实不可以领取的
			useList=data.useList;//可以领取的
			unList=data.unList;//不可以领取的
			// 由于如果没有对应的券时后台就不返回这个字段，故做此判断。
			if(useList == null || useList == undefined){
				useList = [];
			}
			if(unList == null || unList == undefined){
				unList = [];
			}
			// 先判断可以领取的券，
			if(useList.length != 0 && useList != '' && useList != null && useList != undefined) {
                coun = coun + 1;
                mui('#scroll1').pullRefresh().endPullupToRefresh((false)); //参数为true代表没有更多数据了。
            } else {
            	// 在判断不可以领取的券。
            	if(unList.length != 0 && unList != '' && unList != null && unList != undefined){
            		coun = coun + 1;
	                mui('#scroll1').pullRefresh().endPullupToRefresh((false)); //参数为true代表没有更多数据了。
            	}else{
        			//$('.mui-scroll').append('<div class="mui-pull-bottom-tips"><div class="mui-pull-bottom-wrapper"><span class="mui-pull-loading">暂无数据</span></div></div>');
	                mui('#scroll1').pullRefresh().endPullupToRefresh((true)); //参数为true代表没有更多数据了。
	                $('#activeMess').addClass('noData');
            	} 
            }

			if (useList.length == 0 && unList.length == 0 && unList.length == 0 && unList.length == 0) {
				if(coun == 1 && useList.length == 0){
					$('.couponList').append("<img src='../../images/pages/my-account3.0/null3.0.png' class='nullimg'><p class='Null'>暂无数据</p>");
				}
			}else{
				$('.couponList').append(setCoupon(useList));
				$('.unList').append(setunList(unList));
			}

			rewardAmount = parseFloat(rewardAmount) + data.rewardAmount;
			$amount.text(Common.comdify(parseFloat(rewardAmount).toFixed(2)) + '元');

			if(rewardAmount > 0){
				$extractReward.removeClass('btn-gray disabled').addClass('btn-default');
			}else{
				$('.amount').removeClass('red');
				$extractReward.removeClass('btn-default').addClass('btn-gray disabled');
			}
			
			if(res.code == -1){
			alert('查询失败');
			return false;
			}
			})

		}).fail(function(){
		alert('网络链接失败');
		});
	};

	//取
	$extractReward.on('click',function(){
		var $this = $(this);
		if($this.hasClass('disabled')){
			return false;
		}
		$this.addClass('disabled');
		$.ajax({
			url: Setting.apiRoot1 + '/u/extractRewardCenter.p2p',
			type: 'post',
			dataType: 'json',
			data: {
			 userId : userId,
			 loginToken:sessionStorage.getItem('loginToken')
			}
		}).done(function(res){
			Common.ajaxDataFilter(res,function(){
			if(res.code == -1){
			 alert(res.message);
			 return false;
			 } else {
                if(res.code != 1) {
                    $this.removeClass("disabled");
                    alert(res.message);
                    return false;
                } else {
                    window.location.href = '../../pages/my-account/rewardCenter.html';
                }
                //$('.alert-layer').css('display', 'flex');
                //$('#reloadbtn').on('click',function(){
                //    $('.alert-layer').css('display', 'none');//遮罩层消失
                //    location.reload();
                //});

            }
			});
		}).fail(function(){
			alert('网络链接失败');
			$this.removeClass("disabled");
		});
	});

	// 分页
	mui.init({
        swipeBack: false,
        preloadPages: [getList()]
    });
     (function($) {
        $.ready(function() {
            //循环初始化所有下拉刷新，上拉加载。
            $.each(document.querySelectorAll('.mui-scroll'), function(index, pullRefreshEl) {
                $(pullRefreshEl).pullToRefresh({
                    up: {
                        contentrefresh: '正在加载...',
                        callback: function() {
                            var self = this;
                                setTimeout(function() {
                                	var g1NoData = document.getElementById('activeMess');
                                    if(hasClass(g1NoData,'noData')) {
                                        noData();
                                        return false;
                                    }
                                   var active = getList();
                                    if(active == undefined || active == null || active == '' ){
                                        self.endPullUpToRefresh(false);
                                    } else {
                                        self.endPullUpToRefresh(true);
                                    }
                                },1500);
                        }
                    }
                });
            });
        });
    })(mui);

    function noData() {
	    $('.mui-pull-loading').html('暂无数据');
	}

	function hasClass(element, cls) {
        return (' ' + element.className + ' ').indexOf(' ' + cls + ' ') > -1;
    }

});
