/**
 * index.js
 * @author  zyx
 * @return {[type]}       [description]
 */
$(function () {

    /**
     * 微信进来的访问判断，不是跳转到官网下载页
     * 20160226 zyx
     */
    var isWeiXin = Common.isWeiXin();

    var param = Common.getParam();
    //微信 zyx 20160504
    var weixin = param.weixin;
    if (weixin) {
        Common.weixinLogin(weixin);
    }


    var $index = $('.index');
    var $buy_btn = $('.buy-btn', $index);
    var $download = $('.download', $index);
    var $open = $('.open', $index);
    var $close = $('.close', $index);
    var userId = sessionStorage.getItem('uid');
    var $progress = $('.progress');
    var buy_link = '';
    var startStatus = 1;
    var beginStatus = sessionStorage.getItem('status');

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
    /**
     * 加载Banner 图片
     * @return {[type]} [description]
     */


    !function () {
        var $banner = $('.banner', $index);
        var _html = doT.template([
            '<div class="swiper-container">',
            '<div class="swiper-wrapper">',
            '{{~it :item:index}}',
            '<div class="swiper-slide">',

            '<img onclick=getUrl("{{=item.url}}") src="{{=Setting.imgRoot + item.filePath}}" alt="">',

            '</div>',
            '{{~}}',
            '</div>',
            '<div class="swiper-pagination"></div>',
            '</div>'
        ].join(''));

        //首页滚动banner
        $.ajax({
            url: Setting.apiRoot1 + '/advertisementImage.p2p',
            type: 'post',
            dataType: 'json',
            data: {
                type: 2
            }
        }).done(function (res) {
            if (res.code == 1) {
                var fileList = res.data.fileList;
                if (fileList.length > 0) {
                    //放到缓存中
                    for (var r = 0; r < fileList.length; r++) {
                        var fl = fileList[r];
                        var shareid = fl.shareid;
                        if (shareid == undefined || shareid == null) {
                            continue;
                        }
                        var url = fl.url;
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
                            pagination: '.banner .swiper-pagination',
                        });
                    }
                }
            } else {
                $banner.hide();
            }
        }).fail(function () {
            $banner.hide();
        });


        //获取公告消息的接口
        $.ajax({
            url: Setting.apiRoot1 + '/getPublicMessage.p2p',
            type: 'post',
            dataType: 'json',
            data: {
                type: 1
            }
        }).done(function (res) {
            if (res.code == 1) {
                var fileList = res.data.fileList;
                if (fileList.length > 0) {
                    var hh = "<li>";
                    for (var r = 0; r < fileList.length; r++) {
//          	alert(fileList[r].title + ":" + fileList[r].url);
                        hh = hh + '<a href="' + Setting.staticRoot + fileList[r].url + '">' + fileList[r].title + '</a>';
                    }
                    hh = hh + "</li>";
                    $("#ticker02").html(hh);
                }
            } else {
                //没有消息的时候
            }
        }).fail(function () {
            $banner.hide();
        });

    }();


    /**
     * 加载首页数据
     * @return {[type]} [description]
     */
    !function () {
        var $progress = $('.progress', $index),
            $buy = $('.buy', $index);

        Common.queryProductInfo(1, 1, function (res) {
            if (res.code != 1) {
                alert(res.message);
                return false;
            }

            var data = res.data[0];
            $progress.find('.title').text(data.title);
            $progress.find('.min').html(data.minRate.toFixed(2).toString().replace(/(\d*)(\.\d*)$/, function ($1, $2, $3) {
                return '<i>' + $2 + '</i>' + $3
            }));
            $progress.find('.max').html(data.maxRate.toFixed(2).toString().replace(/(\d*)(\.\d*)$/, function ($1, $2, $3) {
                return '<i>' + $2 + '</i>' + $3
            }));
            $progress.find('.info').attr('href', Setting.staticRoot + '/pages/financing/product-info.html?pid=' + data.productId);
            $buy.find('.amount').text(Common.comdify(data.amount.toFixed(2)));

            var _data = {
                pid: data.productId,
                pname: data.title,
                pmount: data.amount,
                minInterest: data.minInterest,
                minInvestAmount: data.minInvestAmount,
                maxInvestAmount: data.maxInvestAmount,
                type: 'current'
            };

            $progress.on('click', function () {
                window.location.href = Setting.staticRoot + '/pages/financing/product-info.html?pid=' + data.productId;
            });

            if (data.buttonStatus == 1) {
                // 倒计时
                $buy_btn.text('倒计时');
                _data.timeLine = data.timeLine;
                buy_link = 'financing/currentbuy.html?' + $.param(_data);
            } else if (data.buttonStatus == 2) {
                // 默认值
                $buy_btn.text('立即抢购');
                buy_link = 'financing/currentbuy.html?' + $.param(_data);
            } else if (data.buttonStatus == 3) {
                // 敬请期待
                $buy_btn.text('敬请期待');
                return false;
            }
            var _value = data.progress.toFixed(2);
            if (_value > 0.01) {
                _value -= 0.01;
            }


            $('.outer-circle').circleProgress({
                value: _value,
                startAngle: -Math.PI / 4 * 2,
                size: 290 * lib.flexible.dpr,
                lineCap: 'round',
                fill: {
                    gradient: ["#ffd4c4", "#fc7b75"]
                }
            });

            // 进行实名认证
            $buy_btn.on('click', function () {
                if (!userId) {
                    confirm('请先登录！', function () {
                        window.location.href = Setting.staticRoot + '/pages/account/login.html';
                    });
                    return false;
                }
                Common.checkRealName(userId, function () {
                    window.location.href = buy_link;
                });
            });

            var $noticeright = $('.noticeright');
            // 进行实名认证
            $noticeright.on('click', function () {
                window.location.href = Setting.staticRoot + '/pages/message/messagelist.html';

            });

        });


    }();
});
