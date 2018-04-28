/**
 * Created by User on 2017/2/14.
 */
$(function() {
    var url = window.location.href.split("#")[0];//获取地址
    var imgurl = 'http://static.wdclc.cn/upload/20170223/20170224163141.jpg';//获取图片的logo
    var shareId = "888";
    var info = {
        url:url
    };

    var one = {
        title: '你 收到了一条来自2066年的神秘信息……',
        desc: '听说看了这条神秘消息的人，50年后的身价统统上亿！正所谓天机不可泄露，就等你亲自来揭秘！',
        link: url,
        imgUrl: imgurl
    };

    var all = {
        title: '你 收到了一条来自2066年的神秘信息……',
        desc: '听说看了这条神秘消息的人，50年后的身价统统上亿！正所谓天机不可泄露，就等你亲自来揭秘！',
        link: url,
        imgUrl: imgurl
    };

    //获取分享信息
    $.ajax({
        url: Setting.apiRoot1 + '/getShare.p2p?shareId='+shareId,
        type: 'GET',
        dataType: 'json',
        async: true
    }).done(function(res) {
        if (res.code == 1) {
            one.title = '@你 收到了一条来自2066年的神秘信息……';
            one.desc='听说看了这条神秘消息的人，50年后的身价统统上亿！正所谓天机不可泄露，就等你亲自来揭秘！';
            all.title = '@你 收到了一条来自2066年的神秘信息……';
            all.desc='听说看了这条神秘消息的人，50年后的身价统统上亿！正所谓天机不可泄露，就等你亲自来揭秘！';
            one.imgUrl = imgurl;
            all.imgUrl = imgurl;

            one.link = 'https://static.wdclc.cn/wx/pages/active/memorie/memorie_index.html';
            all.link = 'https://static.wdclc.cn/wx/pages/active/memorie/memorie_index.html';

            wxshare();
        }
    }).fail(function() {
        alert('网络链接失败，请刷新重试！');
        return false;
    });
    function wxshare(){

        $.ajax({
            url: Setting.apiRoot1 + '/wx/jsInfo.p2p',
            type: 'GET',
            dataType: 'json',
            data: {"param": JSON.stringify(info)},
            async: true
        }).done(function(res) {

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

            }else{
                /*alert(res.code);*/
            }

        }).fail(function() {
            alert('网络链接失败，请刷新重试！');
            //return false;
        });
    }

});