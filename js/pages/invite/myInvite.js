/**
 * myInvite.js
 * @author zyx
 * @return {[type]}       [description]
 */
$(function () {


    var $invitecode = $('.invitecode');
    var $invitecounts = $('.invitecounts');
    var $inviteAmount = $('.inviteAmount');

    var $phone = $('.phone');

    var visiturl = location.search; //获取url中"?"符后的字串
    var param = {};
    if (visiturl.indexOf("?") != -1) {
        var str = visiturl.substr(1);
        strs = str.split("&");
        for (var i = 0; i < strs.length; i++) {
            param[strs[i].split("=")[0]] = decodeURIComponent(strs[i].split("=")[1]);
        }
    }

    var userId;
    var pageStorageToken;
    var paramToken;
    var loginToken;
    var ucode;
    var phone;

    var next = param.next;
    if (next == 1) {
        ucode = param.code;
        phone = param.phone;
        //alert(ucode);
        window.location.href = Setting.staticRoot + '/pages/invite/noice_register.html?code=' + ucode + '&phone=' + phone;
    }

    var type = param.type;
    var url = window.location.href.split("#")[0];
    var imgurl = 'http://106.15.44.101/group1/M00/00/15/ag8sZVnjei6ANqtLAABbYUnyaOU209.jpg';
    var shareId = "888";
    var info = {
        url: url
    };

    if (param.uid != null && param.uid != undefined && param.uid != 'null') {
        userId = param.uid;
        sessionStorage.setItem('uid', userId);
    }


    var one = {
        title: 'V金融福利大放送，现金、红包、豪礼等你拿！',
        desc: '邀请朋友送壕礼！',
        link: url,
        imgUrl: imgurl
//		      success:success
    };

    var all = {
        title: 'V金融福利大放送，现金、红包、豪礼等你拿！',
        desc: '邀请朋友送壕礼！',
        link: url,
        imgUrl: imgurl
//		      success:success
    };

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

    var id = sessionStorage.getItem('uid');

    //判断id是否登录
    if (id) {
        var inPeople = sessionStorage.getItem('ucode')
        $('.login-div').html('<p class="login-invitation">邀请码 : <span class="login-span">' + inPeople + '</span></div>');
    }

//  if(!userId){
//	    Common.toLogin(Setting.staticRoot+"/pages/invite/myInvite.html");
//	    return false;
//  }

    var $body = $('body')
    var shareTemplate = [
        '<a class="share" href="javascript:;">',
        '<i class="share_pic"></i>',
        '</a>'
    ].join('');

    var messagingIframe;
    messagingIframe = document.createElement('iframe');
    messagingIframe.style.display = 'none';
    document.documentElement.appendChild(messagingIframe);
    var linkurl = Setting.staticRoot + '/pages/activity/newCouple/newCouple.html';


    function share() {
        $.ajax({
            url: 'https://web.wdclc.cn/getShare.p2p?shareId=' + shareId,
            type: 'GET',
            dataType: 'json',
            async: true
        }).done(function (res) {
            if (res.code == 1) {
                one.title = '新人专享¥1446红包来啦！';
                one.desc = '历史年化收益率12%，14天标最多相当于加息11.2%，还不快进来看看！';
                all.title = '新人专享¥1446红包来啦！';
                all.desc = '历史年化收益率12%，14天标最多相当于加息11.2%，还不快进来看看！';
                one.imgUrl = imgurl;
                all.imgUrl = imgurl;
                wxshare();
            } else {
                alert(res.message);
                return false;
            }
        }).fail(function () {
            alert('网络链接失败，请刷新重试！');
            return false;
        });
    }


    if (userId != null && userId != undefined && userId.length > 0) {
        //获取已邀请好友的个数
        $.ajax({
            url: Setting.apiRoot1 + '/u/getInvite.p2p',
            type: 'post',
            dataType: 'json',
            data: {
                userId: userId,
                loginToken: loginToken
            }
        }).done(function (res) {
            Common.ajaxDataFilter(res, function (data) {
                if (data.code == 1) {
                    //$invitecounts.html(data.data.counts);
                    //$inviteAmount.html(data.data.amount);
                    $('.inviteCount').html('你已经成功邀请<span class="span1 count">' + data.data.counts +
                    '</span>人,已获奖励<span class="span1 money">' + data.data.amount + '</span>元');
                    share();
                    //获取分享信息
                    // $.ajax({
                    //     url: Setting.apiRoot1 + '/getShare.p2p?shareId='+shareId,
                    //     type: 'GET',
                    //     dataType: 'json',
                    //     async: true
                    //   }).done(function(res) {
                    //
                    //     if (res.code == 1) {
                    //        one.title=res.data.title;
                    //        one.desc=res.data.content;
                    //        all.title=res.data.title;
                    //        all.desc=res.data.content;
                    //        one.imgUrl = imgurl;
                    //        all.imgUrl = imgurl;
                    //        wxshare();
                    //        var linkurl = res.data.url;
                    //邀请码获取
                    if (ucode == null || ucode == '' || ucode == 'null') {
                        $.ajax({
                            url: Setting.apiRoot1 + '/u/getInviteCode.p2p',
                            type: 'post',
                            dataType: 'json',
                            data: {
                                type: 1,
                                userId: userId,
                                loginToken: loginToken
                            }
                        }).done(function (res) {
                            if (res.code == 1) {
                                ucode = res.data.code;
                                phone = res.data.phone;
                                sessionStorage.setItem("ucode", ucode);
                                sessionStorage.setItem("uname", phone);
                                if (linkurl.indexOf("?") != -1) {
                                    linkurl = linkurl + "&";
                                } else {
                                    linkurl = linkurl + "?";
                                }
                                one.link = linkurl + "code=" + ucode + "&phone=" + phone + "&next=1";
                                all.link = linkurl + "code=" + ucode + "&phone=" + phone + "&next=1";

                                //邀请码 和 手机号
                                $invitecode.html(ucode);
                                $phone.html(phone);

                            } else {
                                alert(data.message);
                                return false;
                            }

                        }).fail(function () {
                            alert('网路异常，请刷新重试!');
                            return false;
                        });
                    } else {

                        if (linkurl.indexOf("?") != -1) {
                            linkurl = linkurl + "&";
                        } else {
                            linkurl = linkurl + "?";
                        }
                        one.link = linkurl + "code=" + ucode + "&phone=" + phone + "&next=1";
                        all.link = linkurl + "code=" + ucode + "&phone=" + phone + "&next=1";
                        //邀请码 和 手机号
                        $invitecode.html(ucode);
                        $phone.html(phone);
                    }
                    //  }
                    //}).fail(function() {
                    //
                    //  alert('网络链接失败，请刷新重试！');
                    //  return false;
                    //});
                    //
                } else {
                    alert(data.message);
                    return false;
                }
            });
        }).fail(function () {
            //alert('数据拉取失败，请刷新重试!');
        });

        function IOSJS(jsonStr, url) {
            messagingIframe.src = "ios://" + url + "?jsonStr=" + jsonStr;
        }

        $('.Bonusrules').click(function (event) {
            $('.maskLayer').css('display', 'block');
            $('#center').removeClass('center').addClass('centerOpen');
            $('.close').click(function (event) {
                $('.maskLayer').css('display', 'none');
                $('#center').removeClass('centerOpen').addClass('center');
            })
        });

        $body.on('click', '.share', function (event) {
            $(this).remove();
        });

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
    }

    //点击邀请按钮
    $('.splieAHref2').click(function (event) {
        var version = param.version;
        if (!userId) {
            var href = Setting.staticRoot + "/pages/invite/myInvite.html";
            window.location.replace(Setting.staticRoot + '/pages/account/login.html?from=' + encodeURIComponent(href));

            //return false;
        } else {

            if (version != null && version != undefined && version > 0) {
                window.location.href = Setting.staticRoot + '/pages/invite/inviteShare.html';
            } else if (type != null && type != undefined && type > 0) {
                window.location.href = Setting.staticRoot + '/pages/invite/inviteShare.html';
            }
            else {
                //只有点击分享时候需要提示登录
                (!$('.share').length > 0) && $body.append(shareTemplate);
            }

            //if(type != null && type != undefined && type > 0){
            //    window.location.href =  Setting.staticRoot + '/pages/invite/inviteShare.html';
            //}else{
            //    //只有点击分享时候需要提示登录
            //    (!$('.share').length>0)  && $body.append(shareTemplate);
            //}

        }

    });

    $('.login-href').click(function () {
        var href = Setting.staticRoot + "/pages/invite/myInvite.html";
        window.location.href = Setting.staticRoot + '/pages/account/login.html?from=' + encodeURIComponent(href);
    })
});

