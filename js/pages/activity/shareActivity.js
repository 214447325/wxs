/**
 * Created by User on 2017/6/1.
 */
//主要用作活动的分享
$(function() {
    var param = Common.getParam();
    var userId = sessionStorage.getItem('uid') || param.uid;
    var postId = param.postId;
    var url = window.location.href.split("#")[0];//获取地址
    //var url = 'https://static.wdclc.cn/wx/pages/active/love.html';
    var share = {};
    var one = {};
    var all = {};
    $.extend(share, {
        shareFixed: function(imgurl, title, desc, link, shareId) {
            var info = {
                url:url
            };
            //var shareId = "888";
             one = {
                title: title,
                desc: desc,
                link: link,
                imgUrl: imgurl
            };

             all = {
                title: title,
                desc: desc,
                link: link,
                imgUrl: imgurl
            };

            $.ajax({
                url: Setting.apiRoot1 + '/getShare.p2p?shareId='+shareId,
                type: 'GET',
                dataType: 'json',
                async: true
            }).done(function(res) {
                if (res.code == 1) {
                    wxshare(JSON.stringify(info));
                } else {
                    alert(res.message);
                    return false;
                }
            }).fail(function() {
                alert('网络链接失败，请刷新重试！');
                return false;
            });
        },
        shareChange: function () {
            var info = {
                url:url
            };

            var one = {
                title: '',
                desc: '',
                link: url,
                imgUrl: imgurl,
                success: function() {
                    successCallBack();
                }
            };

            var all = {
                title: '',
                desc: '',
                link: url,
                imgUrl: imgurl,
                success: function() {
                    successCallBack();
                }

            };

            $.ajax({
                url: Setting.root + '/post/share/sharePost.do',
                type: 'get',
                dataType: 'json',
                async: true,
                data: {
                    postId:postId,
                    userId:userId
                }
            }).done(function(res) {
                if(res.code == 1) {
                    var _data = res.data;
                    one.title = _data.title;
                    all.title = _data.title;
                    one.desc = _data.content;
                    all.desc = _data.content;
                    one.link = _data.url;
                    all.link = _data.url;
                    one.imgUrl =  _data.image;
                    all.imgUrl =  _data.image;
                    wxshare();
                } else {
                    alert(res.message);
                }
            }).fail(function() {
                alert('网络链接失败');
            });
        }
    }
    );

    function wxshare(data) {
        $.ajax({
            url: Setting.apiRoot1 + '/wx/jsInfo.p2p',
            type: 'GET',
            dataType: 'json',
            data: {"param": data},
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

    function successCallBack() {
        $.ajax({
            url: Setting.root + '/post/share/success.do',
            type: 'get',
            dataType: 'json',
            contentType : "application/x-www-form-urlencoded; charset=UTF-8",
            async: true,
            data: {
                postId:postId,
                userId:userId,
                shareSource:'h5'
            }
        }).done(function(res) {
            if(res.code != 1) {
                alert(res.message)
            }

        }).fail(function() {
            alert('网络链接失败，请刷新重试！');
            //return false;
        });
    }
    window.share = share;
});