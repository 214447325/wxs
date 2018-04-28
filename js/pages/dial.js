/**
 * dial.js
 * @author tangsj
 * @return {[type]}       [description]
 */
$(function () {

    var $dial = $('.dial');
    var $ruleDialog = $('.rule-dialog');
    var $stage = $('.stage', $dial);

    var param = Common.getParam();

    var userId = sessionStorage.getItem('uid') || param.uid;
    var type = param.type;
    var loginToken = sessionStorage.getItem('loginToken') || param.loginToken;

    //微信 zyx 20160504
    var weixin = param.weixin;
    if (weixin) {
        $.ajax({
            url: Setting.apiRoot2 + '/weixinLogin.p2p',
            type: 'post',
            dataType: 'json',
            async: false,
            data: {
                weixin: weixin,
            }
        }).done(function (res) {
            if (res.code == 1) {
                sessionStorage.clear();
                sessionStorage.setItem('uname', res.data.phoneNum);
                sessionStorage.setItem('uid', res.data.id);
                sessionStorage.setItem('uuid', res.data.weixin);
                sessionStorage.setItem('ucode', res.data.code);
                sessionStorage.setItem('loginToken', res.token);
                sessionStorage.setItem('payChannel', res.data.payChannel);
                sessionStorage.setItem('relation', res.data.relation);
                sessionStorage.setItem('realname', res.data.name);//zyx add
                sessionStorage.setItem('relation', res.data.relation);//zyx add
                sessionStorage.setItem('validName', res.data.validName);
                sessionStorage.setItem('validTrade', res.data.validTrade);
                sessionStorage.setItem('validName', res.data.validName);//是否设置实名认证
                sessionStorage.setItem('status', downloadStatus);
                sessionStorage.setItem('newProd', res.data.newProd);//是否购买过新手标
                sessionStorage.setItem('isBirthday', res.data.isBirthday);//是否购买过新手标
                sessionStorage.setItem('gifts20171111', res.data.gifts20171111);//是否购买过新手标
                userId = res.data.id;
                loginToken = res.token;
                sessionStorage.setItem('dialLogin', '1');
            }
        }).fail(function () {
            alert("网络错误");
        });
    } else {
        if (userId) {
            sessionStorage.setItem('uid', userId);
        }

        if (!userId) {
            Common.toLogin();
            return false;
        }
    }


    // 奖品列表 , 可以抽奖次数
    var prize = [], num = 0, cdeg = 0;

    // 加载奖品列表
    $.ajax({
        url: Setting.apiRoot1 + '/u/getdialReward.p2p',
        type: 'post',
        dataType: 'json',
        data: {
            type: 1,
            userId: userId,
            loginToken: loginToken
        }
    }).done(function (res) {
        Common.ajaxDataFilter(res, function (res) {

            if (res.code != 1) {
                alert(res.message);
                return false;
            }
            prize = res.data.dialRewardList;
            num = res.data.num;
            renderPrize();
            $stage.removeClass('hide');
        });
    }).fail(function () {
        alert('网络链接失败，请刷新重试！');
        return false;
    });

    var messagingIframe;
    messagingIframe = document.createElement('iframe');
    messagingIframe.style.display = 'none';
    document.documentElement.appendChild(messagingIframe);
    function IOSJS(jsonStr, url) {
        messagingIframe.src = "ios://" + url + "?jsonStr=" + jsonStr;
    }

    function renderPrize() {
        var _html = [];

        var _tpl = doT.template([
            '<div class="col col-{{=parseInt(it.title.length/3)}}">',
            '{{?!!it.bizData}}',
            '<img style="width: 1rem" src="{{=Setting.imgRoot + "/" + it.bizData}}" alt="" />',
            '{{?}}',
            '<p class="ptitle" style="font-size: 0.3rem;color: #ffffff;">{{=it.title}}</p>',
            '</div>'
        ].join(''));

        $.each(prize, function (index, item) {
            _html.push(_tpl(item));
            item.deg = index * 45;
        });
        $stage.find('.price').html(_html.join(''));
    }

    /**
     * 转动转盘
     * @param  {[type]}   deg      [description]
     * @param  {Function} callback [description]
     * @return {[type]}            [description]
     */
    function rotateDial(deg, callback) {
        var d = deg + (Math.random() * 15) * (Math.ceil(Math.random() * 10) > 4.5 ? 1 : -1);
        cdeg += 12 * 360 - d;

        TweenMax.to($stage.find('.price'), 5, {
            ease: Quint.easeInOut,
            css: {
                rotation: cdeg
            },
            onComplete: function () {
                // 矫正圆周
                cdeg += d;
                callback();
            }
        });
    }

    /**
     * 根据ID 返回奖品信息
     * @param  {[type]} id [description]
     * @return {[type]}    [description]
     */
    function getPrizeById(id) {
        var _tmp = {};
        $.each(prize, function () {
            if (this.id == id) {
                _tmp = this;
            }
        });
        return _tmp;
    }

    //点击我知道了
    $('.instructions,.instructions-box').click(function () {
        $('.in-alert').hide();
    });


    $('.bt2').click(function () {
        $('.in-alert').show();
    });

    $dial.on('click', '.draw-btn', function () {
        var $this = $(this);

        if ($this.hasClass('disabled')) {
            return false;

        }

        $this.addClass('disabled');
        $.ajax({
            url: Setting.apiRoot1 + '/u/randomDialReward.p2p',
            type: 'post',
            dataType: 'json',
            data: {
                type: 1,
                userId: userId,
                loginToken: loginToken
            }
        }).done(function (res) {
            Common.ajaxDataFilter(res, function (res) {
                if (res.code != 1) {
                    alert(res.message);
                    $this.removeClass('disabled');
                    return false;
                }
                var coupon_id = res.data.pcoupon.couponId;
                var data = getPrizeById(res.data.pcoupon.couponId);
                var type = res.data.pcoupon.couponType;
                //var rate = res.data.pcoupon.rate;
                var amount = res.data.pcoupon.amount;
                var message = "";
                if (coupon_id == 0) {
                    data.title = 'v金融奖品';
                }
                if (type == 5) {
                    message = "亲爱的V粉，非常抱歉您抽中了" + data.title + "，很遗憾没有获得奖品，再接再厉吧！";
                    alert(message);
                    $this.removeClass('disabled');
                } else {
                    var lottery = {
                        index: -1, //当前转动到哪个位置，起点位置
                        count: 0, //总共有多少个位置
                        timer: 0, //setTimeout的ID，用clearTimeout清除
                        speed: 20, //初始转动速度
                        times: 0, //转动次数
                        cycle: 50, //转动基本次数：即至少需要转动多少次再进入抽奖环节
                        prize: -1, //中奖位置
                        init: function(id) {
                            if($('#' + id).find('.lottery-unit').length > 0) {
                                $lottery = $('#' + id);
                                $units = $lottery.find('.lottery-unit');
                                this.obj = $lottery;
                                this.count = $units.length;
                                $lottery.find('.lottery-unit.lottery-unit-' + this.index).addClass('active');
                            }
                        },
                        roll: function() {
                            var index = this.index;
                            var count = this.count;
                            var lottery = this.obj;
                            $(lottery).find('.lottery-unit.lottery-unit-' + index).removeClass('active');
                            index += 1;
                            if(index > count - 1) {
                                index = 0;
                            }
                            $(lottery).find('.lottery-unit.lottery-unit-' + index).addClass('active');
                            this.index = index;
                            return false;
                        },
                        stop: function(index) {
                            this.prize = index;
                            return false;
                        }
                    };

                    function roll() {
                        lottery.times += 1;
                        lottery.roll(); //转动过程调用的是lottery的roll方法，这里是第一次调用初始化
                        if(lottery.times > lottery.cycle + 10 && lottery.prize == lottery.index) {
                            clearTimeout(lottery.timer);
                            lottery.prize = -1;
                            lottery.times = 0;
                            click = false;
                        } else {
                            if(lottery.times < lottery.cycle) {
                                lottery.speed -= 10;
                            } else if(lottery.times == lottery.cycle) {
                                lottery.prize = 4;
                                if (coupon_id == 0) {
                                    message = "亲爱的V粉，恭喜您抽中了杰尼龟，价值100积分的奖励，请至“我的-我的积分”查询！";
                                    lottery.prize = 0;
                                } else {
                                    message = "亲爱的V粉，恭喜您抽中了" + data.title + "，价值" + amount + "元的现金红包，请至“我的-现金奖励！";
                                    var aIndex = [7,6,5,4,3,2,1,0];
                                    var c = 0;
                                    for(var i = 0; i < prize.length; i++) {
                                        if(prize[i].id == coupon_id) {
                                            c = aIndex[i]
                                        }
                                    }
                                    lottery.prize = c;
                                }
                                setTimeout(function(){
                                    alert(message);
                                    $this.removeClass('disabled');
                                },4000);
                            } else {
                                if(lottery.times > lottery.cycle + 10 && ((lottery.prize == 0 && lottery.index == 7) || lottery.prize == lottery.index + 1)) {
                                    lottery.speed += 110;
                                } else {
                                    lottery.speed += 20;
                                }
                            }
                            if(lottery.speed < 40) {
                                lottery.speed = 40;
                            }
                            lottery.timer = setTimeout(roll, lottery.speed); //循环调用
                        }
                        return false;
                    }

                    var click = false;
                    lottery.init('lottery');
                    if(click) { //click控制一次抽奖过程中不能重复点击抽奖按钮，后面的点击不响应
                        return false;
                    } else {
                        lottery.speed = 100;
                        roll(); //转圈过程不响应click事件，会将click置为false
                        click = true; //一次抽奖完成后，设置click为true，可继续抽奖
                        return false;
                    }
                }
            });
        }).fail(function () {
            alert('网络链接失败，请刷新重试！');
            $this.removeClass('disabled');
            return false;

        });
    });

    $ruleDialog.on('click', '.exit', function () {
        $ruleDialog.fadeOut();
    });


    //分享
    !function () {
        var $body = $('body')
        var shareTemplate = [
            '<a class="share" href="javascript:;">',
            '<i class="share_pic"></i>',
            '</a>'
        ].join('');

        $body.on('click', '.sharetxt', function (event) {
            event.stopPropagation();
            (!$('.share').length > 0) && $body.append(shareTemplate)
        });
        $body.on('click', '.share', function (event) {

            $(this).remove();
        });
    }();

    var url = window.location.href.split("#")[0];
    var userId = sessionStorage.getItem('uid');
    var imgurl = Setting.imgRoot + '/upload/logo/logo.png';

    var info = {
        url: url
    };


    function success() {
        $.ajax({
            url: Setting.apiRoot1 + '/u/shareActivity.p2p',
            type: 'post',
            dataType: 'json',
            data: {
                userId: userId,
                type: 1,
                loginToken: loginToken
            }
        }).done(function (res) {
            alert(res.message);
            return false;
        }).fail(function (res) {
            alert('网络链接失败，请刷新重试！');
            return false;
        });
    }

    var one = {
        title: 'V金融福利大放送，现金、红包、豪礼等你拿！',
        desc: '邀请朋友送壕礼！',
        link: url,
        imgUrl: imgurl,
        success: success
    };

    var all = {
        title: 'V金融福利大放送，现金、红包、豪礼等你拿！',
        link: url,
        imgUrl: imgurl,
        success: success
    };

    $.ajax({
        url: Setting.apiRoot1 + '/getShare.p2p',
        type: 'GET',
        dataType: 'json',
        async: false
    }).done(function (res) {
        if (res.code == 1) {
            one.title = res.data.title;
            one.desc = res.data.content;
            all.title = res.data.title;
            all.desc = res.data.content;
        }
    }).fail(function () {
        alert('网络链接失败，请刷新重试！');
        return false;
    });


    function wxshare() {

        $.ajax({
            url: Setting.apiRoot1 + '/wx/jsInfo.p2p',
            type: 'GET',
            dataType: 'json',
            data: {"param": JSON.stringify(info)},
            async: false
        }).done(function (res) {

            if (res.code == 1) {
                var data = res;

                wx.config({
                    debug: false,
                    appId: data.appId,
                    timestamp: data.timestamp,
                    nonceStr: data.nonceStr,
                    signature: data.signature,
                    jsApiList: [
                        // 所有要调用的 API 都要加到这个列表中
                        'checkJsApi',
                        'onMenuShareTimeline',
                        'onMenuShareAppMessage',
                        'onMenuShareQQ',
                        'onMenuShareWeibo',
                        'hideMenuItems',
                        'showMenuItems',
                        'hideAllNonBaseMenuItem',
                        'showAllNonBaseMenuItem',
                        'getNetworkType',
                        'openLocation',
                        'getLocation',
                        'hideOptionMenu',
                        'showOptionMenu',
                        'closeWindow'
                    ]
                });

                wx.ready(function () {
                    wx.onMenuShareAppMessage(one);
                    wx.onMenuShareTimeline(all);
                    wx.onMenuShareQQ(one);
                    wx.onMenuShareWeibo(one);
                });

            } else {
                //alert("和微信服务器通信失败，请30分钟后重试");
            }

        }).fail(function () {
            alert('网络链接失败，请刷新重试！');
            return false;
        });

    }

    wxshare();


});
