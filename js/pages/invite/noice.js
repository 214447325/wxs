/**
 * Created by User on 2016/11/29.
 */
$(function () {
    var userId;
    var pageStorageToken;
    var paramToken;
    var loginToken;
    var ucode;
    var phone;
    var param = Common.getParam();
    var vtype = param.type;
    var weixin = param.weixin;
    if (weixin != null && weixin != undefined && weixin.length > 0) {
        userId = sessionStorage.getItem('uid');
        pageStorageToken = sessionStorage.getItem('loginToken');
        paramToken = param.loginToken;
        loginToken = paramToken;
        ucode = sessionStorage.getItem('ucode');
        phone = sessionStorage.getItem('uname');
    } else {
        userId = sessionStorage.getItem('uid') || param.uid;
        pageStorageToken = sessionStorage.getItem('loginToken');
        paramToken = param.loginToken;
        loginToken = '';
        if (paramToken == undefined || paramToken == '' || paramToken == null || paramToken == 'undefined') {
            loginToken = pageStorageToken;
        } else {
            loginToken = paramToken;
        }
        ucode = sessionStorage.getItem('ucode');
        if (!ucode) {
            ucode = param.code;
            sessionStorage.setItem('ucode', ucode);
        }
        phone = sessionStorage.getItem('uname') || param.phone;
    }

    var next = param.next;
    if (next == 1) {
        window.location.href = Setting.staticRoot + '/pages/invite/noice_register.html?code=' + ucode + '&phone=' + phone;
    }
    //&& userId != null && userId != undefined
    //判断是否登录
    if (userId && userId != null && userId != undefined && userId.length != 0 && userId != '(null)') {
        $('.regist').addClass('regist1').click(function () {
            if (vtype != null && vtype != undefined && vtype > 0) {
                window.location.href = Setting.staticRoot + '/pages/invite/inviteShare.html';
            } else {
                shareFriend();
            }
        });
    } else {
        $('.regist').addClass('regist2').click(function () {
            window.location.href = '../../pages/account/login.html';
        });
    }
    //var shareId = "1306";
    var shareId = "888";
    //点击活动规则
    $('.active').click(function () {
        $('.know').show().parent().addClass('wra');
    });

    //点击图片
    $('.know2').click(function () {
        $('.know').hide().parent().removeClass('wra');
    });

    var $c = $('.c');
    $c.click(function () {
        $('.c').removeClass('default');
        $('.air').hide();
        var cSize = $c.size();
        for (var i = 1; i <= cSize; i++) {
            $('.c' + i).attr({"src": "../../images/pages/invite/w" + i + ".png"});
        }
        if ($(this).hasClass('c1')) {
            $('.c1').addClass('default');
            $('.air1').show();
            $('.c1').attr({"src": "../../images/pages/invite/n1.png"});
        }
        if ($(this).hasClass('c2')) {
            $('.c2').addClass('default');
            $('.air2').show();
            $('.c2').attr({"src": "../../images/pages/invite/n2.png"});
        }
        if ($(this).hasClass('c3')) {
            $('.c3').addClass('default');
            $('.air3').show();
            $('.c3').attr({"src": "../../images/pages/invite/n3.png"});
        }
    });

    var $body = $('body');
    var shareTemplate = [
        '<a class="share" href="javascript:;">',
        '<i class="share_pic"></i>',
        '</a>'
    ].join('');

    //分享背景隐藏
    $body.on('click', '.share', function (event) {
        $(this).remove();
    });

    var url = window.location.href.split("#")[0];
    var imgurl = Setting.imgRoot + '/wx/images/pages/invitelogo.png';
    var info = {
        url: url
    };
    var one = {
        title: 'V金融福利大放送，现金、红包、豪礼等你拿！',
        desc: '邀请朋友送壕礼！',
        link: url,
        imgUrl: imgurl

    };

    var all = {
        title: 'V金融福利大放送，现金、红包、豪礼等你拿！',
        link: url,
        imgUrl: imgurl
    };

    function shareFriend() {
        (!$('.share').length > 0) && $body.append(shareTemplate);
    }

    $.ajax({
        url: Setting.apiRoot1 + '/getShare.p2p?shareId=' + shareId,
        type: 'GET',
        dataType: 'json',
        async: false
    }).done(function (res) {
        if (res.code == 1) {
            one.title = res.data.title;
            one.desc = res.data.content;
            all.title = res.data.title;
            all.desc = res.data.content;
            var linkurl = res.data.url;
            wxshare();
            if (linkurl.indexOf("?") != -1) {
                linkurl = linkurl + "&";
            } else {
                linkurl = linkurl + "?";
            }

            one.link = linkurl + "code=" + ucode + "&phone=" + phone + "&next=1";
            all.link = linkurl + "code=" + ucode + "&phone=" + phone + "&next=1";
        }
    }).fail(function () {
        alert('网络链接失败，请刷新重试！');
        return false;
    });
    function IOSJS(jsonStr, url) {
        messagingIframe.src = "ios://" + url + "?jsonStr=" + jsonStr;
    }

    function wxshare() {
        $.ajax({
            url: Setting.apiRoot1 + '/wx/jsInfo.p2p',
            type: 'GET',
            dataType: 'json',
            data: {"param": JSON.stringify(info)},
            async: true
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
                /*alert(res.code);*/
            }

        }).fail(function () {
            alert('网络链接失败，请刷新重试！');
            //return false;
        });
    }
});