/*
 * @Author: User
 * @Date:   2016-10-28 13:27:29
 * @Last Modified by:   liuyang
 * @Last Modified time: 2017-11-9 23:11:27
 */
var $ui_dialog = $('.ui-dialog');
var $btn_link = $('.btn-link', $ui_dialog);
var $btn_default = $('.btn-default', $ui_dialog);
var investmentRed;//投资红包
var couponList;//加息券
var cashRed;//体验金
$(function () {
    var $tabcon = $('.tabcon');//投资红包列表
    var $tabcon2 = $('.tabcon2');//体验金列表
    var $couponList = $('.couponList');//加息券列表
    // var $extractReward= $('.extractReward');
    var $amount = $('.amount');
    var userId = sessionStorage.getItem('uid');
    // 判断用户是否登录，没有登录跳转到登录页面
    if (!userId) {
        Common.toLogin();
        return false;
    }
    ;

    //tap 加息券列表
    var setCoupon = doT.template([
        '{{~it :item:index}}',
        '{{?item.status ==1}}',
        '<div class="coupon">',
        '{{??item.status ==4}}',
        '<div class="coupon setGrayTwo">',
        '{{??}}',
        '<div class="coupon setGray setGrayTwo">',
        '{{?}}',
        '<div class="detail">',
        '<div class="inprods">',
        '{{?item.couponType ==1}}',//1天数加息券
        '<span class="indata">{{=item.addRate}}%', '</span>',
        '<span class="intitle">天数加息券</span>',
        '{{?}}',
        '{{?item.couponType ==2}}',//2全程加息券
        '<span class="indata">{{=item.addRate}}%', '</span>',
        '<span class="intitle">全程加息券</span>',
        '{{?}}',
        //'<span class="intitle">{{=item.couponTitle}}','</span>',
        '</div>',
        '<div class="dashed">', '</div>',
        '<div class="cpinfo">',
        '{{?item.couponOrigin != "" && item.couponOrigin != null}}',//1天数加息券
        '<span class="day"><span>来源：</span><span>{{=item.couponOrigin}}</span>', '</span>',
        '{{?}}',
        '<span class="day"><span>加息天数：</span><span>{{=item.addDays}}</span>', '</span>',
        '<span class="application"><span><span>适用产品：</span></span><span>{{=item.fitProds}}</span>', '</span>',
        '<span class="awardAmount"><span><span>有效期：</span></span><span>{{=item.validEndTime}}</span>', '</span>',
        '</div>',
        '</div>',
        '{{?item.status ==1}}',//状态1、 1未使用 2已使用 3已过期 4已结清
        '<div class="state statu01" onClick="goUse()">',
        '<span>立<br />即<br />使<br />用', '</span>',
        '</div>',
        '{{??item.status ==2}}',
        '<div class="state statu02" >',
        // '<span>已<br />使<br />用','</span>',
        '<img src="../../../images/pages/my-account3.0/exclusive/yishiyong.png" alt="" />',

        '</div>',
        '{{??item.status ==3}}',
        '<div class="state statu02" >',
        // '<span>已<br />过<br />期','</span>',
        '<img src="../../../images/pages/my-account3.0/exclusive/yiguoqi.png" alt="" />',

        '</div>',
        '{{??item.status ==4}}',
        '<div class="state statu02" >',
        '<span>已<br />结<br />清', '</span>',
        '</div>',
        '{{?}}',
        '</div>',
        '{{~}}'
    ].join(''));
    //加息券列表pageSize
    var _setCouponPageNum = 1;
    var _setCouponPageSize = 10;

    //tap 投资红包
    var _e_money_ = doT.template([
        '{{~it :item:index}}',
        '{{?item.status == 5}}',
        '<div class="coupon">',
        '{{??item.status == 7}}',
        '<div class="coupon setGrayTwo">',
        '{{??}}',
        '<div class="coupon setGray setGrayTwo">',
        '{{?}}',
        '<div class="detail">',
        '<div class="inprods">',
        '<span class="indata indataTwo">￥{{=item.amount}}', '</span>',
        '<span class="intitle">{{=item.activityName}}', '</span>',
        '</div>',
        '<div class="dashed">', '</div>',
        '<div class="cpinfo reward_cpinfo">',
        '{{?item.activityName != "" && item.activityName != null}}',
        '<span class="day"><span>来源：</span><span>{{=item.activityName}}', '</span></span>',
        '{{?}}',
        '<span class="day"><span>使用规则：</span><span>{{=item.remark}}', '</span></span>',
        '<span class="application"><span>适用产品：</span>{{=item.useContent}}', '</span>',
        '<span class="awardAmount"><span>有效期：</span>{{=item.endTime}}', '</span>',
        '</div>',
        '</div>',
        '{{?item.status ==5}}',//状态1、3已过期  5未激活  6已使用 7不可用
        '<div class="state statu01" onClick="goUse()">',
        '<span>立<br />即<br />使<br />用', '</span>',
        '</div>',
        '{{??item.status ==6}}',
        '<div class="state statu02" >',
        // '<span>已<br />使<br />用','</span>',
        '<img src="../../../images/pages/my-account3.0/exclusive/yishiyong.png" alt="" />',
        '</div>',
        '{{??item.status == 7}}',
        '<div class="state statu02" >',
        '<span>不<br />可<br />用', '</span>',
        // '<img src="../../../images/pages/my-account3.0/exclusive/yishiyong.png" alt="" />',
        '</div>',
        '{{??item.status ==3}}',
        '<div class="state statu02" >',
        // '<span>已<br />过<br />期','</span>',
        '<img src="../../../images/pages/my-account3.0/exclusive/yiguoqi.png" alt="" />',
        '</div>',
        '{{?}}',
        '</div>',
        '{{~}}'
    ].join(''));
    //投资红包pageSize
    var _e_moneyPageNum = 1;
    var _e_moneyPageSize = 10;

    //tap 体验金
    var _red_envelope_ = doT.template([
        '{{~it :item:index}}',
        '{{?item.status ==1}}',
        '<div class="coupon">',
        '{{??item.status ==4}}',
        '<div class="coupon setGrayTwo">',
        '{{??}}',
        '<div class="coupon setGray setGrayTwo">',
        '{{?}}',
        '<div class="detail">',
        '<div class="inprods">',
        '<span class="indata indataTwo">￥{{=item.voucherAmount}}', '</span>',
        '<span class="intitle">体验金', '</span>',
        '</div>',
        '<div class="dashed">', '</div>',
        '<div class="cpinfo reward_cpinfo">',
        '<span class="day"><span>使用规则：</span>{{=item.remark}}', '</span>',
        '<span class="application"><span>适用产品：</span>{{=item.useContent}}', '</span>',
        '<span class="awardAmount"><span>体验天数：</span>{{=item.cycleTime}}', '</span>',
        '<span class="awardAmount"><span>有效期：</span>{{=item.validEndTime}}', '</span>',
        '</div>',
        '</div>',
        '{{?item.status ==1}}',//状态1、 1未使用 2已使用 3已过期 4已结清
        '<div class="state statu01" onClick="goUse()">',
        '<span>立<br />即<br />使<br />用', '</span>',
        '</div>',
        '{{??item.status ==2}}',
        '<div class="state statu02" >',
        // '<span>已<br />使<br />用','</span>',
        '<img src="../../../images/pages/my-account3.0/exclusive/yishiyong.png" alt="" />',
        '</div>',
        '{{??item.status ==3}}',
        '<div class="state statu02" >',
        // '<span>已<br />过<br />期','</span>',
        '<img src="../../../images/pages/my-account3.0/exclusive/yiguoqi.png" alt="" />',
        '</div>',
        '{{??item.status ==4}}',
        '<div class="state statu02" >',
        '<span>已<br />结<br />清', '</span>',
        '</div>',
        '{{?}}',
        '</div>',
        '{{~}}'
    ].join(''));
    //体验金pageSize
    var _redPeoplePageNum = 1;
    var _redPeoplePageSize = 10;

    /**
     *@param  {[type]} num  [类型] // 类型 5投资红包   3体验金  1加息券
     *@param  {[type]} PageNum  [当前第几页]
     *@param  {[type]} PageSize  [每页显示几条数据]
     *
     *
     */
    function setCouponFun(num, PageNum, PageSize) {
        var flag = false;
        $.ajax({
            url: Setting.apiRoot1 + '/u/getALLMyReward.p2p',
            type: 'post',
            dataType: 'json',
            async: false,
            data: {
                userId: userId,
                loginToken: sessionStorage.getItem('loginToken'),
                type: num,
                pageNum: PageNum,
                pageSize: PageSize
            }
        }).done(function (res) {
            Common.ajaxDataFilter(res, function () {
                if (res.code == 1) {
                    couponList = res.data.RewardResultList;
                    if (couponList.length == 0 && _setCouponPageNum == 1) {
                        switch (num) {
                            case 1:
                                if ($('.couponList').eq(0).find('.nullimg').length <= 0)$couponList.append("<img src='../../../images/pages/my-account3.0/null3.0.png' class='nullimg'><p class='Null'>暂无数据</p>");
                                break;//加息券
                            case 3:
                                if ($('.tabcon2').eq(0).find('.nullimg').length <= 0)$tabcon2.append("<img src='../../../images/pages/my-account3.0/null3.0.png' class='nullimg'><p class='Null'>暂无数据</p>");
                                break;//体验金
                            case 5:
                                if ($('.tabcon').eq(0).find('.nullimg').length <= 0)$tabcon.append("<img src='../../../images/pages/my-account3.0/null3.0.png' class='nullimg'><p class='Null'>暂无数据</p>");
                                break;//投资红包
                        }
                    } else {
                        if (couponList != undefined && couponList != null && couponList != '') {
                            PageNum = PageNum + 1;
                            switch (num) {
                                case 1:
                                    $couponList.append(setCoupon(couponList));
                                    _setCouponPageNum = PageNum;
                                    break;//加息券
                                case 3:
                                    $tabcon2.append(_red_envelope_(couponList));
                                    _redPeoplePageNum = PageNum;
                                    break;//体验金
                                case 5:
                                    $tabcon.append(_e_money_(couponList));
                                    _e_moneyPageNum = PageNum;
                                    break;//投资红包
                            }
                            flag = true;
                        }
                    }
                } else if (res.code == -1) {
                    alert('查询失败');
                } else {
                    alert(res.message);
                }
            });
        }).fail(function () {
            alert('网络链接失败');
        });
        return flag;
    }

    // 分页
    mui.init({
        swipeBack: false,
        preloadPages: [setCouponFun(1, _setCouponPageNum, _setCouponPageSize), setCouponFun(5, _e_moneyPageNum, _e_moneyPageSize), setCouponFun(3, _redPeoplePageNum, _redPeoplePageSize)]
    });
    (function ($) {
        $.ready(function () {
            //循环初始化所有下拉刷新，上拉加载。
            $.each(document.querySelectorAll('.li_list'), function (index, pullRefreshEl) {
                $(pullRefreshEl).pullToRefresh({
                    up: {
                        contentrefresh: '正在加载...',
                        callback: function () {
                            var self = this;
                            var navLi1 = $('.navLi1>a')[0].className;
                            var navLi2 = $('.navLi2>a')[0].className;
                            var navLi3 = $('.navLi3>a')[0].className;
                            if (navLi1) {
                                setTimeout(function () {
                                    var active = setCouponFun(1, _setCouponPageNum, _setCouponPageSize);
                                    if (active) {
                                        console.log(self)
                                        self.endPullUpToRefresh(false);
                                    } else {
                                        self.endPullUpToRefresh(true);
                                    }
                                }, 1500);
                            }

                            if (navLi2) {
                                setTimeout(function () {
                                    var community = setCouponFun(5, _e_moneyPageNum, _e_moneyPageSize);
                                    if (community) {
                                        self.endPullUpToRefresh(false);
                                    } else {
                                        self.endPullUpToRefresh(true);
                                    }
                                }, 1500);
                            }
                            if (navLi3) {
                                setTimeout(function () {
                                    var redPeopleFun = setCouponFun(3, _redPeoplePageNum, _redPeoplePageSize);
                                    if (redPeopleFun) {
                                        self.endPullUpToRefresh(false);
                                    } else {
                                        self.endPullUpToRefresh(true);
                                    }
                                }, 1500);
                            }
                        }
                    }
                });
            });
        });
    })(mui);
});
// 跳转到固收页
function goUse() {
    window.location.href = "../../../pages/financing/regular.html";
}
//点击激活按钮
function actionBuy(couponId) {
    for (var i = 0; i < investmentRed.length; i++) {
        if (couponId == investmentRed[i].couponId) {
            $('.ui-dialog p').html(investmentRed[i].remark);
            $ui_dialog.removeClass('hide');
            $btn_link.attr('href', Setting.staticRoot + '/pages/financing/regular.html');
            $btn_default.attr('onclick', '$ui_dialog.addClass("hide");');
            break;
        }
    }
};