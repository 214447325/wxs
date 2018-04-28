/*
 * @Author: User
 * @Date:   2016-09-01 16:38:15
 * @Last Modified by:   User
 * @Last Modified time: 2017-01-12 11:22:40
 */
var prodData = {};//首页产品展示详情列表
var postList;
$(function () {
    var isWeiXin = Common.isWeiXin();//微信进来的访问判断，不是跳转到官网下载页
    var param = Common.getParam();
    var weixin = param.weixin;
    if (weixin) {
        Common.weixinLogin(weixin);
    }

    var $index = $('.index');
    var $banner = $('.banner', $index);
    var $buy_btn = $('.buy-btn', $index);
    var $download = $('.download', $index);
    var $open = $('.open', $index);
    var $close = $('.close', $index);
    var userId = sessionStorage.getItem('uid');
    var $progress = $('.progress');
    var buy_link = '';
    var startStatus = 1;
    var beginStatus = sessionStorage.getItem('status');
    var newProd = sessionStorage.getItem('newProd');

    var loanCycle14 = 0;
    var isAmt = 0;
    var levelRate = 0;

<<<<<<< .mine
    $.ajax({
        url: Setting.apiRoot1 + '/getCurrentTime.p2p',
        type: 'POST',
        dataType: 'json',
    }).done(function (res) {
        console.log(res);
        if (res.code == 1) {
            var time = res.data.currentTime.replace(/\-/g, '/');
            var startTime = new Date('2018/04/01').getTime();
            var newTime = new Date(time).getTime()
            console.log(newTime >= startTime)
            if (newTime >= startTime) {
                $('.index-active').eq(0).addClass('hide');
                $('.index-active').eq(1).removeClass('hide');
            }
        } else {
            alert('网络链接失败');
        }
    }).fail(function () {
=======
	/*$.ajax({
		url:Setting.apiRoot1 + '/getCurrentTime.p2p',
		type:'POST',
		dataType:'json',
	}).done(function(res){
		console.log(res);
		if(res.code == 1){
			var time = res.data.currentTime.replace(/\-/g,'/');
			var startTime = new Date('2018/04/01').getTime();
			var newTime = new Date(time).getTime()
			console.log(newTime >= startTime)
			if(newTime >= startTime){
				$('.index-active').eq(0).addClass('hide');
				$('.index-active').eq(1).removeClass('hide');
			}
		}else{
			alert('网络链接失败');
		}
	}).fail(function(){
>>>>>>> .r9149
        alert('网络链接失败');
    })*/
    //console.log(newProd);//登录接口新增返回字段：newProd，是否可买新手标，1代表可买，0代表不可买
    if (!userId) {
        $('.noviceAct').show();
    } else {
        $('.noviceAct').hide();
    }

    if (sessionStorage.getItem('status') == null) {
        sessionStorage.setItem('status', 0);
    }

    if (beginStatus == startStatus) {
        $download.hide();
    } else {
        $open.on('click', function () {
            window.location.href = Setting.staticRoot + '/pages/appdown.html';
        });
        $close.on('click', function () {
            sessionStorage.setItem('status', startStatus);
            // alert(sessionStorage.getItem('status'));
            $this = $(this);
            $this.parent().slideUp(500);
        });
    }


//加载Banner 图片
    // !function(){

    var _html = doT.template([
        '<div class="swiper-container">',
        '<div class="swiper-wrapper">',
        '{{~it :item:index}}',
        '<div class="swiper-slide">',
        '<img onclick=getUrl("{{=item.url}}") src="{{=item.filePath}}" alt="">',
        '</div>',
        '{{~}}',
        '</div>',
        '<div class="swiper-pagination" style="bottom:0.2rem;"></div>',
        '</div>'
    ].join(''));

//首页展示产品列表
//productList
    var $tabcon1 = $('.indexList');
    var setListData1 = doT.template([
        '{{~it :item:index}}',
        // '<dl >',
        // '<div class="item">',
        '{{?item.prodTitle != undefined}}',
        '{{?item.loanCycle != 14 || (item.loanCycle == 14 && item.loanCycle14 == 1)}}',
        '<div class="indexItem" onClick="indexItem_jump({{=item.prodId}})" prodType="{{=item.prodType}}">',
        /*'<div class="itemTitle">',
         '<span class="title">{{=item.prodTitle}}','</span>',
         '{{?item.label !=null && item.label !="" && item.label !=undefined}}',
         '{{?item.label =="hot"}}',
         '<span class="labBg">正在热卖','</span>',
         '{{??item.label =="new"}}',
         '<span class="labBg">新手推荐','</span>',
         '{{??}}',
         '<span class="labBg">{{=item.label}}','</span>',
         '{{?}}',
         '{{?}}',
         '<span class="title-p">{{=item.pushLabel}}','</span>',
         '</div>',*/

        '<div class="itemContain">',
        // '<span class="contain-left">',
        // '{{?item.firstPageImage != undefined && item.firstPageImage != null && item.firstPageImage != ""}}',
        //                 '<img src={{=item.firstPageImage}} style="width:100%;height:100%;border-radius:0.2rem;">',
        // '{{??}}',
        // 	'<img src="../images/pages/indexPage/loser.png" style="width:100%;height:100%;border-radius:0.2rem;">',
        // '{{?}}',
        // '</span>',
        '<span class="contain-left">',
        '{{?item.label == null || item.label == "" || item.label == undefined}}',
        // '<i class="yearrate investTerm"><a class="a1">周周派息</a><a>{{=item.prodTitle}}</a>','</i>',
        '<i class="yearrate investTerm"><a class="yearrateEa text-overflow">{{=item.prodTitle}}</a>', '</i>',
        '{{?}}',
        '{{?item.label != null && item.label != "" && item.label != undefined}}',
        // '<i class="yearrate investTerm"><a class="a1">{{=item.label}}</a><a>{{=item.prodTitle}}</a>','</i>',
        '<i class="yearrate investTerm"><a class="yearrateEa text-overflow">{{=item.prodTitle}}</a>', '</i>',
        '{{?}}',
        // '<i class="yearrate-p text-overflow">{{=item.pushLabel}}','</i>',
        '</span>',
        // '<span class="contain-line">',
        '<span class="contain-right">',

        // '<i class="yearrate">{{=item.minRate}}','</i>',
        '{{?item.minRate == item.maxRate}}',
        '{{?item.addRate == 0}}',
        '<i class="yearrate">{{=(item.minRate).toFixed(1)}}',
        '<span class="percent">%</span>',
        '<i class="InterestLabel">{{=item.addInterestLabel}}', '</i>',
        '</i>',
        '{{?}}',
        '{{?item.addRate != 0}}',
        '<i class="yearrate">{{=item.minRate.toFixed(1)}}',
        '<span class="percent">%</span>',
        '<i class="InterestLabel">+{{=item.addRate.toFixed(1)}}{{=item.addInterestLabel}}', '</i>',
        '</i>',
        '{{?}}',
        '{{?}}',
        '{{?item.minRate != item.maxRate}}',
        '{{?item.addRate == 0}}',
        '<i class="yearrate">',
        '<i class="InterestLabel">{{=(item.minRate).toFixed(1)}}</i>',
        '<span class="percent">%</span>',
        '<i style="display:inline;">~{{=(item.maxRate).toFixed(1)}}</i>',
        '<span class="percent">%</span>',
        '<i class="InterestLabel">{{=item.addInterestLabel}}', '</i>',
        '</i>',
        '{{?}}',
        '{{?item.addRate != 0}}',
        '<i class="yearrate">',
        '<i class="InterestLabel">{{=item.minRate.toFixed(1)}}</i>',
        '<span class="percent">%</span>',
        '<i style="display:inline;">~{{=item.maxRate.toFixed(1)}}</i>',
        '<span class="percent">%</span>',
        '<i class="InterestLabel">+{{=parseFloat(item.addRate).toFixed(1)}}{{=item.addInterestLabel}}', '</i>',
        '</i>',
        '{{?}}',
        '{{?}}',
        '<i class="yearrate-p">历史年化收益', '</i>',
        '</span>',
        '</div>',
        '</div>',
        '{{?}}',
        '{{?}}',
        // '</div>',
        // '</dl>',
        '{{~}}'
    ].join(''));

    /*金融研究所查看更多 */
    /*financeResearch*/
    var $financeResearch = $('.financeResearchList');
    var setFinanceList = doT.template([
        '{{~it :item:index}}',
        '<div class="financeResearchTitle" onclick="hrefUrl({{=item.postId}})" >',
        '<div class="financeResearch">',
        '<div style="height:1.9rem;">',
        '<div class="financeRsh-title text-overflow">{{=item.postTitle}}', '</div>',
        '<div class="financeRsh-content text-overflow">{{=item.postDigest}}', ' </div>',
        '</div>',
        '<div class="financeRsh-contact">',
        '<img src="../images/pages/indexPage/redlineTitle.png" alt="">',
        '<span>V金融报员</span>',
        '<span style="">&bull;&nbsp; {{=item.replyCount}}评论 </span>',
        '</div>',
        '</div>',
        '<div class="financeResearch">',
        '<span style="display:block;text-align:center;">',
        '{{?item.firstPageImage != undefined && item.firstPageImage != null && item.firstPageImage != ""}}',
        '<img src={{=item.firstPageImage}} alt="" style="width:3.5733rem;height:2.6933rem;border-radius:0.05rem;">',
        '{{??}}',
        '<img src=../images/pages/indexPage/loser.png alt="" style="width:3.5733rem;height:2.6933rem;border-radius:0.05rem;">',
        '{{?}}',


        '</span>',

        '</div>',
        '</div>',
        '{{~}}'
    ].join(''));
    // 判断可以购买14周
    if (userId) {
        Common.currentStock(userId, sessionStorage.getItem('loginToken'));
        $.ajax({
            url: Setting.apiRoot1 + '/u/queryUser14Week.p2p',
            type: "POST",
            dataType: 'json',
            async: false,
            data: {
                userId: userId,
                loginToken: sessionStorage.getItem('loginToken')
            }
        }).done(function (res) {
            console.log('14周：', res);
            if (res.code == 1) {
                var data = res.data;
                levelRate = data.levelRate;//最大利率
                isAmt = data.maxPurchasedAmt - data.purchasedAmt;//最大限额 - 已购买额度
                loanCycle14 = 0;
                switch (parseInt(data.level)) {
                    case 1:
                        loanCycle14 = data.levelRate == 11 ? 1 : 0;
                        break;
                    case 2:
                        loanCycle14 = data.levelRate == 13 ? 1 : 0;
                        break;
                    case 3:
                        loanCycle14 = data.levelRate == 15.5 ? 1 : 0;
                        break;
                    case 4:
                        loanCycle14 = data.levelRate == 17 ? 1 : 0;
                        break;
                }
            }
        })
    }


    $.ajax({
        url: Setting.apiRoot1 + '/queryFirstPageInfoNew.p2p',
        type: 'post',
        dataType: 'json',
        async: false,
    }).done(function (res) {
        if (res.code == 1) {
            prodData = res.data.prodList;
            var tarbarShow = res.data.tarbarShow;
            var happyNewYear = res.data.happyNewYear;
            sessionStorage.setItem('tarbarShow', tarbarShow);
            if (tarbarShow == 2) {
                $('.nav a').css({
                    "background-position": "center .053rem",
                });
                $('.nav a.home').css({
                    "backgroundImage": "url(../images/pages/indexPage/index2.png)",
                    "backgroundSize": ".93rem .853rem",
                });
                $('.nav a.home.active').css({
                    "backgroundImage": "url(../images/pages/indexPage/index3.png)",
                    "backgroundSize": ".93rem .853rem",
                });

                $('.nav a.money').css({
                    "backgroundImage": "url(../images/pages/indexPage/money2.png)",
                    "backgroundSize": ".93rem .853rem",
                });
                $('.nav a.money.active').css({
                    "backgroundImage": "url(../images/pages/indexPage/money3.png)",
                    "backgroundSize": ".93rem .853rem",
                });

                $('.nav a.explore').css({
                    "backgroundImage": "url(../images/pages/indexPage/explore2.png)",
                    "backgroundSize": ".93rem .853rem",
                });
                $('.nav a.explore.active').css({
                    "backgroundImage": "url(../images/pages/indexPage/explore3.png)",
                    "backgroundSize": ".93rem .853rem",
                });

                $('.nav a.account').css({
                    "backgroundImage": "url(../images/pages/indexPage/account2.png)",
                    "backgroundSize": ".93rem .853rem",
                });
                $('.nav a.account.active').css({
                    "backgroundImage": "url(../images/pages/indexPage/account3.png)",
                    "backgroundSize": ".93rem .853rem",
                });
            }

            if (happyNewYear == 2) {
                $('.index-img2').attr('src', '../images/pages/indexPage/daily-drawNew2.png');
                $('.index-img1').attr('src', '../images/pages/indexPage/invite-friendNew2.png');
                $('.index-img3').attr('src', '../images/pages/indexPage/platformNew2.png');
                $('.index-img4').attr('src', '../images/pages/indexPage/safeNew2.png');
            }
            if (prodData.length > 0) {
                for (var i = 0; i < prodData.length; i++) {
                    if (prodData[i].loanCycle == 14) {
                        if (loanCycle14 == 1 && isAmt > 0) {
                            if (prodData[i].minRate + prodData[i].addRate == levelRate) {
                                prodData[i].loanCycle14 = 1;//利率可能变化
                            } else {
                                prodData[i].loanCycle14 = 0;//利率可能变化
                            }
                        }
                    } else {
                        prodData[i].loanCycle14 = 0;//利率可能变化
                    }
                }
                $('.licai').eq(0).css('display', 'block');
            } else {
                $('.licai').eq(0).css('display', 'none');
            }
            $tabcon1.html(setListData1(prodData));//首页产品列表展示
            if (newProd == 0) {
                $('.indexItem[prodType=5]').hide();
            }
            var fileList = res.data.bannerList;

            //if(fileList.length > 0){//将banner放到缓存中
            for (var r = 0; r < fileList.length; r++) {//遍历
                var fl = fileList[r];
                var shareid = fl.shareid;//shareid
                // console.log(shareid);
                if (shareid == undefined || shareid == null) {
                    continue;
                }
                var url = fl.url;//图片跳转的链接
                if (0 < shareid) {
                    var shareneed = fl.shareneed;
                    var gotoUrl = url + "?shareid=" + fl.shareid + "&sharetitle=" + fl.sharetitle + "&sharecontent=" + fl.sharecontent + "&shareimage=" + fl.shareimage + "&shareurl=" + fl.shareurl + "&shareneed=" + fl.shareneed;
                    if (shareneed == 1) {
                        gotoUrl = gotoUrl + "&sharereturnurl=" + fl.sharereturnurl;
                    }
                    gotoUrl = gotoUrl + "&uid=" + userId;
                    fileList[r].url = gotoUrl;
                }
            }
            $banner.html(_html(fileList)).removeClass('hide');
            if (fileList.length > 1) {
                new Swiper('.banner .swiper-container', {
                    autoplay: 3000,
                    loop: true,
                    // pagination:'.swiper-pagination',
                });
                // Swiper.pagination.bullets.css('background','#FF6600');
            }
            //}
            //金融研究所
            postList = res.data.postList;
            if (postList.length) {
                $('.licai').css('display', 'block');
                $financeResearch.html(setFinanceList(postList));
            }

        } else {
        }
    }).fail(function () {
        alert('网络链接失败');
    });
    $('.actbtn').on('click', function () {
        window.location.href = '../pages/activity/newCouple/newCouple.html'
    });
// function getPageUrl(id) {
//     var $id = $('#' + id);
//     var _name = $id.attr('name');
//     var _count = $id.find('.readnum').html();
//     if(id == 2021) {
//         window.location.href = 'https://mp.weixin.qq.com/s/vCc2JnW9slIC5GDDp2dxBg';
//     } else {
//         window.location.href = "../../pages/message/messageDetails.html?postId=" + id + "&readNum=" + _count;
//     }
// }

    // 生日礼包
    var birthdayData = doT.template([
        '<div class="birthdayContent">',
        '<div>亲爱的<span class="birName">', '</span>，V金融祝您生日月快乐！',
        '</div>',
        '<div>',
        '<img src="../images/pages/indexPage/birthday/main.png" alt="" class="birimg">',
        '</div>',
        '<div class="birbtnDiv">',
        '<img src="../images/pages/indexPage/birthday/button.png" alt="" class="birbtn">',
        '</div>',
        '</div>',
        '<div class="birthdayCoupon">',
        '<div class="birthdayCouponCten">',
        '<div>小小礼物，远不及您的支持与陪伴,', '<br/>却是我们浓浓的爱意：', '</div>',
        '{{~it :item:index}}',
        '{{?item.couponType == 2}}',
        '<div class="couponOne fluid">',
        '<div class="couponLeft">{{=item.addRate}}%全程加息券', '</div>',
        '<div class="couponRight">1张', '</div>',
        '</div>',
        '{{?}}',
        '{{?item.couponType == 1}}',
        '<div class="couponTwo fluid">',
        '<div class="couponLeft">{{=item.addDays}}{{=item.addRate}}%天数加息券', '</div>',
        '<div class="couponRight">1张', '</div>',
        '</div>',
        '{{?}}',
        '{{?item.couponType == 4}}',
        '<div class="couponThree fluid">',
        '<div class="couponLeft">现金红包', '</div>',
        '<div class="couponRight">{{=item.useRule}}元', '</div>',
        '</div>',
        '{{?}}',
        '{{~}}',
        '<div class="birPour fluid">',
        '<div style="float:left;margin-bottom:0.46rem;">注：', '</div>',
        '<div style="float:left;">1.加息券：直接发放至“账户-超值礼券”中；', '</div>',
        '<div style="float:left;">2.现金奖励：直接发放至“账户-现金奖励”中。', '</div>',
        '</div>',
        '<div>',
        '<img src="../images/pages/indexPage/birthday/vwx.png" alt="" class="vwx">',
        '<div style="font-size:0.2666rem;color:#000;">扫一扫，关注服务号', '</div>',
        ' </div>',
        // '<div class="share">','</div>',
        '</div>',
        '<div>',
        '<img src="../images/pages/indexPage/birthday/cancel.png" alt="" class="couponClose">',
        '</div>',
        '</div>',
    ].join(''));
    var isBirthday = sessionStorage.getItem('isBirthday');
    var birthdayFlag = sessionStorage.getItem('birthdayFlag');
    if (isBirthday == 1 && birthdayFlag == 1) {
        var realname = sessionStorage.getItem('realname');
        var userId = sessionStorage.getItem('uid');
        var list = JSON.parse(sessionStorage.getItem('resList'));
        var $birthday = $('.birthday');
        $birthday.html(birthdayData(list));
        $('.birName').html(realname);
        var birbtn = $('.birbtn');
        var birthdayCoupon = $('.birthdayCoupon');
        var couponClose = $('.couponClose');
        $birthday.css("display", 'block');
        // 跳转到生日优惠券页面
        birbtn.click(function () {
            $.ajax({
                url: Setting.apiRoot1 + '/u/getVipbirthday.p2p',
                data: {
                    "userId": userId,
                    "loginToken": sessionStorage.getItem('loginToken')
                },
                dataType: 'json',
                type: 'get',
            }).done(function (res) {
                sessionStorage.setItem('birthdayFlag', 2)
                if (res.code == 1) {
                    $('.birthdayContent').css("display", 'none');
                    birthdayCoupon.css('display', 'block');
                    sessionStorage.setItem('isBirthday', 2);
                } else if (res.code == 2) {
                    alert('领取失败');
                    $birthday.css("display", 'none');
                } else {
                    alert(res.message);
                    $birthday.css("display", 'none');
                }
            }).fail(function () {
                alert('网络链接失败');
                $birthday.css("display", 'none');
            });
        });
        //关闭生日优惠
        couponClose.click(function () {
            $birthday.css('display', 'none');
            var gifts20171111 = sessionStorage.getItem('gifts20171111');
            var gifts20171111Flag = sessionStorage.getItem('gifts20171111Flag');
            if (gifts20171111 == 0 && gifts20171111Flag == 1) {
                var $gifts = $('.gifts');
                $gifts.css('display', 'block');
            }
        });
    } else {
        var gifts20171111 = sessionStorage.getItem('gifts20171111');
        var gifts20171111Flag = sessionStorage.getItem('gifts20171111Flag');
        if (gifts20171111 == 0 && gifts20171111Flag == 1) {
            var $gifts = $('.gifts');
            $gifts.css('display', 'block');
        }
    }

//生日礼包分享
    var imgurl = 'http://106.15.44.101/group1/M00/00/12/ag8sZVmJVbqAZgapAABFSPrZeHA376.jpg';
    var title = 'V金融生日礼包大放送';
    var desc = '我在V金融领取了一份生日礼包，除了给力加息券，更有大额现金奖励，快进来看看...';
    var link = Setting.staticRoot + '/pages/birthday.html';
    share.shareFixed(imgurl, title, desc, link, "888");

    /**
     * 卡券礼包活动提醒
     * [indexItem_jump description]
     * @param  {[type]} prodId){                for(var i [description]
     * @return {[type]}           [description]
     */
    var CardCouponsHtml = doT.template([
        '<div class="ui-alert backdrop CardCouponsHtml">',
        '<div style="width:100%;height:11.9466rem;padding:0 1.2533rem 0 0.5333rem;position: absolute;top: 50%;margin-top:-5.9733rem;">',
        '<img src="../images/pages/indexPage/cardCoupons/close.png" alt="" class="closeCardCoupons" style="width:0.7466rem;float:right;">',
        '<img src="../images/pages/indexPage/cardCoupons/content.png" alt=""  style="width:100%;">',
        '<img src="../images/pages/indexPage/cardCoupons/CardCouponsBotton.png" alt=""  class="CardCouponsBotton" style="width:4rem;height:0.7466rem;position:absolute;bottom:0.8rem;left:50%;margin-left:-2rem;">',
        '</div>',
        '</div>',
    ].join(''));
    if (userId) {
        $.ajax({
            url: Setting.apiRoot1 + '/giftCardCoupons/u/tip.p2p',
            dataType: 'json',
            type: 'POST',
            data: {
                userId: userId,
                loginToken: sessionStorage.getItem('loginToken')
            }
        }).done(function (res) {
            Common.ajaxDataFilter(res, function () {
                if (res.code == 0) {
                    if (res.data.validate == 1) {
                        $('body').append(CardCouponsHtml());
                        $('.closeCardCoupons').click(function () {
                            $('.CardCouponsHtml').remove();
                        })
                        $('.CardCouponsBotton').click(function () {
                            window.location.href = '../pages/financing/regular.html'
                        })
                    }
                }
            })
        });
    }
});

function indexItem_jump(prodId) {
    for (var i = 0; i < prodData.length; i++) {
        if (prodData[i].prodId == prodId) {
            _data = {
                jumpId: 1,
                pid: prodData[i].prodId,
                pname: prodData[i].prodTitle,
                pmount: prodData[i].canBuyAmt,
                minInvestAmount: prodData[i].minBuyAmt,
                maxInvestAmount: prodData[i].maxBuyAmt,
                maxRate: prodData[i].maxRate,
                minRate: prodData[i].minRate,
                addRate: prodData[i].addRate,
                cycle: prodData[i].loanCycle,
                cycleType: prodData[i].cycleType,
                act10: prodData[i].act10,//是否参加iphone活动 0不参加  1参加
                act11: prodData[i].act11,//是否参加投资返现活动 0不参加  1参加
                buyStatus: prodData[i].buyStatus
            };
            if (prodData[i].prodType == 1) {
                window.location.href = '../pages/financing/currentbuy3.0.html?pid=' + prodId;
            }
            if (prodData[i].prodType == 3) {
                // window.location.href =  '../pages/financing/regular-detail3.0.html?'+ $.param(_data);
                window.location.href = '../pages/financing/buy3.0.html?pid=' + prodId;
            }
            if (prodData[i].prodType == 4) {
                // window.location.href =  '../pages/financing/float-detail3.0.html?'+ $.param(_data);
                window.location.href = '../pages/financing/floatbuy3.0.html?' + $.param(_data);
            }
            if (prodData[i].prodType == 5) {
                // window.location.href =  '../pages/financing/float-detail3.0.html?'+ $.param(_data);
                window.location.href = '../pages/financing/buy3.0.html?pid=' + prodId;
            }

        }


    }
}

function hrefUrl(postId) {
    for (var i = 0; i < postList.length; i++) {
        if (postList[i].postId == postId) {
            window.location.href = postList[i].url;
        }
    }
}