/**
 * appDial.js
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
    var version = param.version;
    if (userId) {
        sessionStorage.setItem('uid', userId);
    }

    if (!userId) {
        Common.toLogin();
        return false;
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
        alert('网络信号较差，请刷新重试！');
        return false;
    });


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
        //$ruleDialog.fadeIn();
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
                var amount = res.data.pcoupon.amount;
                //var rate = res.data.pcoupon.rate;
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
                        init: function (id) {
                            if ($('#' + id).find('.lottery-unit').length > 0) {
                                $lottery = $('#' + id);
                                $units = $lottery.find('.lottery-unit');
                                this.obj = $lottery;
                                this.count = $units.length;
                                $lottery.find('.lottery-unit.lottery-unit-' + this.index).addClass('active');
                            }
                        },
                        roll: function () {
                            var index = this.index;
                            var count = this.count;
                            var lottery = this.obj;
                            $(lottery).find('.lottery-unit.lottery-unit-' + index).removeClass('active');
                            index += 1;
                            if (index > count - 1) {
                                index = 0;
                            }
                            $(lottery).find('.lottery-unit.lottery-unit-' + index).addClass('active');
                            this.index = index;
                            return false;
                        },
                        stop: function (index) {
                            this.prize = index;
                            return false;
                        }
                    };

                    function roll() {
                        lottery.times += 1;
                        lottery.roll(); //转动过程调用的是lottery的roll方法，这里是第一次调用初始化
                        if (lottery.times > lottery.cycle + 10 && lottery.prize == lottery.index) {
                            clearTimeout(lottery.timer);
                            lottery.prize = -1;
                            lottery.times = 0;
                            click = false;
                        } else {
                            if (lottery.times < lottery.cycle) {
                                lottery.speed -= 10;
                            } else if (lottery.times == lottery.cycle) {
                                lottery.prize = 4;
                                if (coupon_id == 0) {
                                    message = "亲爱的V粉，恭喜您抽中了杰尼龟，价值100积分的奖励，请至“我的-我的积分”查询！";
                                    lottery.prize = 0;
                                } else {
                                    message = "亲爱的V粉，恭喜您抽中了" + data.title + "，价值" + amount + "元的现金红包，请至“我的-现金奖励！";
                                    var aIndex = [7, 6, 5, 4, 3, 2, 1, 0];
                                    var c = 0;
                                    for (var i = 0; i < prize.length; i++) {
                                        if (prize[i].id == coupon_id) {
                                            c = aIndex[i]
                                        }
                                    }
                                    lottery.prize = c;
                                }
                                setTimeout(function () {
                                    alert(message);
                                    $this.removeClass('disabled');
                                }, 4000);
                            } else {
                                if (lottery.times > lottery.cycle + 10 && ((lottery.prize == 0 && lottery.index == 7) || lottery.prize == lottery.index + 1)) {
                                    lottery.speed += 110;
                                } else {
                                    lottery.speed += 20;
                                }
                            }
                            if (lottery.speed < 40) {
                                lottery.speed = 40;
                            }
                            lottery.timer = setTimeout(roll, lottery.speed); //循环调用
                        }
                        return false;
                    }

                    var click = false;
                    lottery.init('lottery');
                    if (click) { //click控制一次抽奖过程中不能重复点击抽奖按钮，后面的点击不响应
                        return false;
                    } else {
                        lottery.speed = 100;
                        roll(); //转圈过程不响应click事件，会将click置为false
                        click = true; //一次抽奖完成后，设置click为true，可继续抽奖
                        return false;
                    }
                }
                //rotateDial(data.deg, function () {
                //
                //    var message = "";
                //    if (data.title == null || data.title == undefined) {
                //        data.title = 'v金融奖品';
                //    }
                //    if (type == 5) {
                //        message = "亲爱的V粉，非常抱歉您抽中了" + data.title + "，很遗憾没有获得奖品，再接再厉吧！";
                //    } else {
                //        //message = "亲爱的V粉，恭喜您抽中了" + data.title + "，价值" + amount + "元的红包已放入您的奖品，请查收呦！";
                //        if (rate != undefined && rate != null && rate != '') {
                //            message = "亲爱的V粉，恭喜您抽中了" + data.title + "，价值" + rate + "%的天数加息券已放入您的超值礼券中，请查收呦！";
                //        } else {
                //            message = "亲爱的V粉，恭喜您抽中了" + data.title + "，价值" + amount + "元的红包已放入您的奖品，请查收呦！";
                //        }
                //    }
                //
                //    alert(message);
                //    $this.removeClass('disabled');
                //});


            });
        }).fail(function () {
            alert('网络信号较差，请刷新重试！');
            $this.removeClass('disabled');
            return false;
        });
    });

    $ruleDialog.on('click', '.exit', function () {
        $ruleDialog.fadeOut();
    });

    var messagingIframe;
    messagingIframe = document.createElement('iframe');
    messagingIframe.style.display = 'none';
    document.documentElement.appendChild(messagingIframe);
    function IOSJS(jsonStr, url) {
        messagingIframe.src = "ios://" + url + "?jsonStr=" + jsonStr;
    }

    var $body = $('body');
    $body.on('click', '.bt1', function (event) {
    //    event.stopPropagation();
        if (type == 1) {
            var c = getVersion(version, type);
            if (c <= 3690) {
                window.homepage.sendDivice('10003', 'userId', userId);
            } else {
                window.AndroidWebView.setMyreward();
            }
            //
        } else if (type == 2) {
            var obj = {
                functionId: "",
                key: "",
                value: ""
            };
            obj.functionId = '10003';
            obj.key = 'userId';
            obj.value = userId;

            IOSJS(JSON.stringify(obj), "sendDivice");
        }
    });


    function getVersion(version, type) {
        var v = '';
        for (var i = 0; i < version.length; i++) {
            if (version[i] != '.') {
                v = v + version[i];
            }
        }
        if ((v.length == 3 || v.length == 4) && type == 1) {
            v = v + '0'
        } else {
            if (v.length == 3 && type == 2) {
                v = v + '0'
            }
        }
        return parseInt(v)
    }


    $body.on('click', '.sharetxt', function (event) {
        if (type == 1) {
            var c = getVersion(version, type);
            if (c <= 3690) {
                window.homepage.sendDivice('10002', 'userId', userId);
            } else {
                window.AndroidWebView.setH5Share('889');
            }

        } else {
            var obj = {
                functionId: "",
                key: "",
                value: ""
            };
            obj.functionId = '10002';
            obj.key = 'userId';
            obj.value = userId;

            IOSJS(JSON.stringify(obj), "sendDivice");

        }
    });
});
