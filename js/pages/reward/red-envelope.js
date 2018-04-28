// 红包接口
var $ui_dialog = $('.ui-dialog');
var $btn_link = $('.btn-link', $ui_dialog);
var $btn_default = $('.btn-default', $ui_dialog);
var remark;
var rewardList = {};
var rewardAmt;
var rewardResultList;
var rewardResultList2;

$(function () {

    var $red_envelope = $('.red-envelope');
    var $tabcon = $('.tabcon', $red_envelope);
    var $extractReward = $('.extractReward', $red_envelope);
    var $tab = $('.nav-select li', $red_envelope);
    var $btn_box = $('.btn-box', $red_envelope);
    var $amount = $('.amount', $red_envelope);
    var userId = sessionStorage.getItem('uid');

    if (!userId) {
        Common.toLogin();
        return false;
    }
    $('.dialog-close').on('click', function () {
        $ui_dialog.addClass('hide');
    });

    //红包模板
    var _red_envelope_ = doT.template([
        '{{~it :item:index}}',
        '{{?item.status == 1}}',
        '<dl class="row-ui">',
        '{{??}}',
        '<dl class="row-ui old">',
        '{{?}}',
        '<a href="javascript:;">',
        '<dt>',
        '<span></span>',
        '{{?item.status == 1}}',
        '<p class="notActive">可使用</p>',
        '{{??item.status == 2}}',
        '<p>已使用</p>',
        '{{??item.status == 3}}',
        '<p>已过期</p>',
        '{{?}}',
        '</dt>',
        '<dd>',
        '{{?item.status == 1}}',
        '<h3 class="notActive">￥{{=item.amount}}</h3>',
        '{{??}}',
        '<h3>￥{{=item.amount}}</h3>',
        '{{?}}',
        '<p>',
        '来源：<span class="lx">{{=item.activityName}}</span> <br>',
        '使用规则：<span class="lx">可立即提现到账户余额</span> <br>',
        '有效期：<span class="lx">{{=item.endTime}}</span> <br>',
        '</p>',
        '</dd>',
        '</a>',
        '</dl>',
        '{{~}}'
    ].join(''));
    // 体验金模板
    var _e_money_ = doT.template([
        '{{~it :item:index}}',
        '{{?item.status == 5}}',
        '<dl class="row-ui five">',
        '{{??item.status == 6}}',
        '<dl class="row-ui six">',
        '{{??}}',
        '<dl class="row-ui old">',
        '{{?}}',
        '<a href="javascript:;">',
        '{{?item.status == 5}}',
        '<dt>',
        '<span id="buySpan" onclick="actionBuy({{=item.couponId}})" class="span"></span>',
        '<p class="notActive">未激活</p>',
        '</dt>',
        '{{??item.status == 6}}',
        '<dt>',
        '<span class="span"></span>',
        '<p>已激活</p>',
        '</dt>',
        '{{??item.status == 3}}',
        '<dt>',
        '<span class="span"></span>',
        '<p>已过期</p>',
        '</dt>',
        '{{??}}',
        '{{?}}',
        '<dd>',
        '{{?item.status == 5}}',
        '<h3 class="notActive">￥{{=item.amount}}</h3>',
        '{{??}}',
        '<h3>￥{{=item.amount}}</h3>',
        '{{?}}',
        '<p>',
        '来源：<span class="lx">{{=item.activityName}}</span> <br>',
        '使用规则：<span class="lx">{{=item.remark}}</span> <br>',
        '有效期：<span class="lx">{{=item.endTime}}</span> <br>',
        '</p>',
        '</div></dd>',
        '</a>',
        '</dl>',
        '{{~}}'
    ].join(''));

//现金红包 
    $.ajax({
        url: Setting.apiRoot1 + '/u/getMyReward.p2p',
        type: 'post',
        dataType: 'json',
        async: false,
        data: {
            userId: userId,
            rewardType: 1,
            pageNum: 1,
            pageSize: 50,
            loginToken: sessionStorage.getItem('loginToken')
        }
    }).done(function (res) {
        Common.ajaxDataFilter(res, function () {
            if (res.code == -1) {
                alert('查询失败');
                return false;
            }
            rewardAmt = res.data.rewardAmt;
            rewardResultList = res.data.rewardResultList;
            $amount.text(rewardAmt + '元')
            $tabcon.removeClass('e-money');
            if (rewardResultList.length == 0) {
                $tabcon.append("<img src='../../../images/pages/my-account3.0/null3.0.png'><p class='Null'>暂无数据</p>");
            } else {
                $tabcon.html(_red_envelope_(rewardResultList));
            }

            if (rewardAmt > 0) {
                $extractReward.removeClass('btn-gray disabled').addClass('btn-default');
            } else {
                $extractReward.removeClass('btn-default').addClass('btn-gray disabled');
            }

        });
    }).fail(function () {
        alert('网络链接失败');
    });

//投资红包
    $.ajax({
        url: Setting.apiRoot1 + '/u/getMyReward.p2p',
        type: 'post',
        dataType: 'json',
        async: false,
        data: {
            userId: userId,
            rewardType: 6,
            loginToken: sessionStorage.getItem('loginToken')
        }
    }).done(function (res) {
        Common.ajaxDataFilter(res, function () {
            if (res.code == -1) {
                alert('查询失败');
                return false;
            }
            $tabcon.addClass('e-money');
            rewardResultList2 = res.data.rewardResultList;
            if (rewardResultList.length == 0) {
                //$tabcon.append("<img src='../../../images/pages/my-account3.0/null3.0.png' ><p class='Null'>暂无数据</p>");
            } else {
                // rewardList=rewardResultList;
                // for(var i=0; i<rewardList.length;i++){
                //      remark=rewardList[i].remark;
                // }
                //$tabcon.html(_e_money_(rewardResultList));
            }

        })
    }).fail(function () {
        alert('网络链接失败');
    });

    //  提现
    $extractReward.on('click', function () {
        var $this = $(this);
        if ($this.hasClass('disabled')) {
            return false;
        }

        $this.addClass('disabled');
        $.ajax({
            url: Setting.apiRoot1 + '/u/extractReward.p2p',
            type: 'post',
            dataType: 'json',
            data: {
                userId: userId,
                loginToken: sessionStorage.getItem('loginToken')
            }
        }).done(function (res) {
            Common.ajaxDataFilter(res, function () {
                if (res.code == -1) {
                    alert(res.message);
                    return false;
                }
                alert(res.message);
                $tab.eq(0).click();
            });
        }).fail(function () {
            alert('网络链接失败');
            $this.removeClass("disabled");
        });
    });


    // tab切换
    $tab.on('click', function () {
        $tabcon.html('');
        var index = $(this).index();
        $tab.removeClass('active').eq(index).addClass('active');
        // 隐藏显示底部
        if ($(this).data('type') == 'ext') {
            $btn_box.show();
        } else {
            $btn_box.hide();
        }
        // 红包请求
        if (index == 0) {
            $amount.text(rewardAmt + '元')
            $tabcon.removeClass('e-money');
            if (rewardResultList.length == 0) {
                $tabcon.append("<img src='../../../images/pages/my-account3.0/null3.0.png'><p class='Null'>暂无数据</p>");
            } else {
                $tabcon.html(_red_envelope_(rewardResultList));
            }

            if (rewardAmt > 0) {
                $extractReward.removeClass('btn-gray disabled').addClass('btn-default');
            } else {
                $extractReward.removeClass('btn-default').addClass('btn-gray disabled');
            }
        } else if (index == 1) {
            $tabcon.addClass('e-money');

            if (rewardResultList2.length == 0) {
                $tabcon.append("<img src='../../../images/pages/my-account3.0/null3.0.png' ><p class='Null'>暂无数据</p>");
            } else {
                // rewardList=rewardResultList2;
                // for(var i=0; i<rewardList.length;i++){
                //      remark=rewardList[i].remark;
                // }
                $tabcon.html(_e_money_(rewardResultList2));
            }
        }
    }).eq(0).click();

});

//点击激活按钮
function actionBuy(couponId) {
    for (var i = 0; i < rewardResultList2.length; i++) {
        if (couponId == rewardResultList2[i].couponId) {
            $('.ui-dialog p').html(rewardResultList2[i].remark);
            $ui_dialog.removeClass('hide');
            $btn_link.attr('href', Setting.staticRoot + '/pages/financing/regular.html');
            $btn_default.attr('onclick', '$ui_dialog.addClass("hide");');
            break;
        }
    }
};
