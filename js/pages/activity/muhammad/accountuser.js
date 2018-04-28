/**
 * Created by User on 2017/6/20.
 */

var _random; // 随机数
var uuid = $.cookie('uuid');//获取uuid
var openId = $.cookie('openId');//获取openId
var arr = [];
//championId = 53257;
//var uuid = 111111;//获取uuid
//var openId = 111111;//获取openId
$(function() {
    document.addEventListener('WeixinJSBridgeReady', function onBridgeReady() {
        // 通过下面这个API隐藏右上角按钮
        WeixinJSBridge.call('hideOptionMenu');
    });
    var $body = $('body');
    var shareTemplate = [
        '<a class="share" href="javascript:;">',
        '<i class="share_pic"></i>',
        '</a>'
    ].join('');
    var param = Common.getParam();
    var sharePostId = param.sharePostId;
    var userId = '';
    var loginToken = '';
    var version = '';

    userId =  sessionStorage.getItem('uid') ||param.uid || $.cookie('uid');
    loginToken = sessionStorage.getItem('loginToken') || param.loginToken || $.cookie('loginToken');
    version = param.version;

    if(userId != undefined && userId != null && userId != '' && loginToken != undefined && loginToken != '' && loginToken != null) {
        $.cookie('uid',userId);
        $.cookie('loginToken',loginToken);
    }

    if(loginToken) {
        //shareActivity(userId, loginToken);
    } else {
        sessionStorage.clear();
        Common.toLogin();
    }

    //var version = param.version;

    var $rules = $('.userbox-ruleImg');//点击争霸规则
    $rules.click(function() {
        alertBox(1);
    });
    var _date = new Date();
    $.ajax({
        url:Setting.apiRoot1 + '/u/branchInfo.p2p',
        dataType:"json",
        type:"post",
        data: {
            userId: userId,
            uuid: uuid,
            openId: openId,
            date:_date.getTime(),
            loginToken: loginToken
        }
    }).done(function(res) {
        if(res.code == 1) {
            var _data = res.data;
            var $pos = $('.pos');
            var _html = '';
            var star = _data.star;//金星数量
            var _headurl = _data.headurl;//头像
            if(_headurl == undefined || _headurl == null || _headurl == '') {
                _headurl = '../../../images/pages/activity/muhammad/usericon.png'
            }

            var win = _data.win;
            var bar = _data.bar;
            var j = 0;
            //控制进度条的高度
            if( bar == 1) {
                $pos.height('2.1rem');
                j = 1;
            }

            if(bar == 2) {
                $pos.height('3.8rem');
                j = 2;
            }

            if(bar == 3) {
                $pos.height('100%');
                j = 3;
            }
            $pos.attr({'src':'../../../images/pages/activity/muhammad/pos' + j + '.png'});
            //控制金星的数量
            if(bar == 1 || bar == 2 || bar == 3 ) {
                for(var i = 1; i <= bar; i++) {
                    $('.bg' + i).attr({'src':'../../../images/pages/activity/muhammad/starbig2.png'});
                }
            }
            //if(_data.challengers == null || _data.challengers  == undefined || _data.challengers == '' || (_data.challengers).length == 0) {
            //    _html = _html + '<div class="user-div-top-title">' +
            //                    '<ul>' +
            //                    '<li>您还没有在分会场和好友大战过哦~</li>' +
            //                    '<li>分享活动让好友挑战你，或者寻找好友链接</li>' +
            //                    '<li>挑战好友拿奖励吧！</li>' +
            //                    '</ul>' +
            //                    '</div>';
            //} else {
                _html = _html + '<div class="user-div-info-left">' +
                                '<div class="user-div-tou">' +
                                '<img src="../../../images/pages/activity/muhammad/crown.png" class="crown">' +
                                '<img src=' + _headurl + ' class="tou">' +
                                '</div>' +
                                '<div class="user-div-phone">' + _data.phonenum + '</div>' +
                                '</div>' +
                                '<div class="user-div-info-right">' +
                                '<ul>' +
                                '<li>争霸 <a>' + _data.total + '</a> 次</li>' +
                                '<li>赢 <a>' + win + '</a> 平 <a>' + _data.flat + '</a> 输 <a>' + _data.loser + '</a></li>' +
                                '<li>已集齐 <a>' + star + '</a> 颗金星</li>' +
                                '<li>累计获 <a>' + _data.redpacket + '</a> 元红包， <a>' + _data.cash + '</a> 元现金</li>' +
                                '</ul>' +
                                '</div>';
            //}
            var challengers = _data.challengers;
            var _cHtml = '';
            if(challengers != null && challengers != undefined && challengers != '' && challengers.length > 0) {
                _cHtml = _cHtml + '<ul>';
                //判断是app
                if((version != undefined && version != null && version != '') && (version == true || version == 'true')) {
                    for(var i = 0; i < challengers.length; i++) {
                        _cHtml = _cHtml + '<li>' +
                        '<div class="tou1">' +
                        '<img src=' + challengers[i].headUrl + ' class="user">' +
                        '</div>' +
                        '<div class="userphone">' + challengers[i].phoneNum +  '</div>' +
                        '<div class="count">赢了' + challengers[i].count + '次</div>' +
                        '</li>';
                    }
                } else {
                    for(var i = 0; i < challengers.length; i++) {
                        var istrue = '';
                        var _text = '';
                        if(challengers[i].isPK) {
                            istrue = 'yes';
                            _text = '挑战TA';
                        } else {
                            istrue = 'no';
                            _text = '已挑战';
                        }
                        _cHtml = _cHtml + '<li>' +
                        '<div class="tou1">' +
                        '<img src=' + challengers[i].headUrl + ' class="user">' +
                        '</div>' +
                        '<div class="userphone">' + challengers[i].phoneNum +  '</div>' +
                        '<div class="challenge ' + istrue + '" isPK=' + challengers[i].isPK + ' id=' + challengers[i].id + '>' + _text + '</div>' +
                        '</li>';
                    }
                }
                _cHtml = _cHtml + '</ul>';
                $('.user-div-bottom-content').html(_cHtml);
            }
            $('.user-div-top').html(_html);

            $('.yes').click(function() {
                var ispk = $(this).attr('isPK');
                if(ispk) {
                    var id = $(this).attr('id');
                    window.location.href = 'https://open.weixin.qq.com/connect/oauth2/authorize?appid=wxb9292153d3cc8750&redirect_uri=https://web.wdclc.cn/wx/activity/notify/code.p2p&response_type=code&scope=snsapi_userinfo&state=' + id +'a';
                    //if(uuid == undefined || uuid == null || uuid == '') {
                    //    $.get('http://web.wdclc.cn/wx/boxingBranchShare.p2p',{championId:id});
                    //} else {
                    //    window.location.href = '../../../pages/active/muhammad/share_index.html?championId=' + id + '&challengerId=' + userId + '&shareIn=true&uuid=' + uuid + '&openId=' + openId;
                    //}
                }
            });

        } else {
            if(res.code == -99) {
                alertBox(6,res.message);
            } else {
                alertBox(4,res.message);
            }
        }
    });

    $('.returnz').click(function() {
        window.location.href = '../../../pages/active/muhammad/muhammad_index.html?uid=' + userId + '&loginToken=' + loginToken;
    });


    $('.sharBtn').click(function() {
        var version = param.version;
        var type = param.type;
        if(!userId){
            var href = Setting.staticRoot+"/pages/invite/myInvite.html";
            sessionStorage.clear();
            window.location.replace(Setting.staticRoot + '/pages/account/login.html?from=' + encodeURIComponent(href));
            //return false;
        }else {
            //if (version != null && version != undefined && version.length > 0) {
            //    window.location.href =  Setting.staticRoot + '/pages/invite/inviteShare.html';
            //} else if (type != null && type != undefined && type.length > 0) {
            //    window.location.href =  Setting.staticRoot + '/pages/invite/inviteShare.html';
            //}
            //else {
                //只有点击分享时候需要提示登录
                (!$('.share').length > 0) && $body.append(shareTemplate);
            //}
        }
    });

    $body.on('click', '.share', function(event) {
        $(this).remove();
    });






    function alertBox(number,tex,monery) {
        var $box = $('.alert_box');
        $('.wrapper').addClass('over');
        $box.show();
        var _html = '';
        var _text = '';
        var _content = '';
        var _btnContent = '';
        _html += '<div class="alert_back"></div>' ;

        var param = Common.getParam();
        var challengerId = param.challengerId;//擂主ID
        var challengerType = param.challengerType;
        switch (number){
            case 1:{
                _text += '<div class="alertBox_rule">' +
                '<img src="../../../images/pages/activity/muhammad/close.png" class="closeBox" onclick="closeClick()">' +
                '<div class="alert_Box_Rule">' +
                '<div class="alert_Rule_title">活动细则</div>' +
                '<div class="alert_Rule_One">1、即日起-2017年8月10日，参与活动猜拳拿奖励，每天可挑战同一个用户3次；</div>' +
                '<div class="alert_Rule_rest">2、根据用户猜拳赢的相应次数，可获得相应投资红包奖励：<div class="div_table"><table><tr><td>猜赢次数</td><td>红包金额</td></tr><tr><td>50</td><td>30元</td></tr><tr><td>80</td><td>80元</td></tr> <tr><td>100</td><td>125元</td></tr></table></div></div>' +
                '<div class="alert_Rule_rest">3、用户每赢100次，即可获得1颗金星，且奖励进度清零，开始新一轮奖励计算；</div>' +
                '<div class="alert_Rule_rest">4、用户集满相应数量的金星，即可获得额外奖励：<div class="div_table_six"><table><tr><td>金星数量</td><td>额外奖励</td></tr><tr><td>1颗</td><td>1%全程加息券+30元现金</td></tr><tr><td>3颗</td><td>2%全程加息券+50元现金</td></tr> <tr><td>5颗</td><td>3%全程加息券+100元现金</td></tr></table></div></div>' +
                '<div class="alert_Rule_rest">5、奖品发放<p>①全程加息券：发放至“账户-超值礼券”中；</p><p>②现金：发放至“账户-现金奖励”中，可进入查看并提取至余额；</p><p>③投资红包：发放至“账户-超值礼券”中，可进入查看；</p></div>' +
                '</div>' +
                '</div>';
                break;
            }

            case 3 :{
                var _alertTitle = '';
                _alertTitle = '温馨提示';
                _content = '<div style="color: #000000;height:1.5rem;font-weight: bold">红包还没攒够，你确定现在就要领取吗？听说养肥了变成50元大红包再领效果会更棒哦~';
                _btnContent = '<div class="alert_Share_Button">' +
                '<a href="../../../pages/active/muhammad/muhammad_log.html?challengerId=' + challengerId+ '&challengerType='+challengerType+'">' +
                '<div class="alert_Share_Left">我偏要领</div>' +
                '</a>' +
                '<div class="alert_Share_Right" onclick="closeClick()">我再等等</div>' +
                '</div>';
                _text += '<div class="alert_share">' +
                '<img src="../../../images/pages/activity/muhammad/close.png" class="closeBox" onclick="closeClick()">' +
                '<div class="sweet_title">' + _alertTitle + '</div>' +
                '<div class="alert_share_content">' + _content + '</div>' +
                _btnContent +
                '</div>';
                break;
            }

            //正常的弹框如网络请求不成功
            case 4 :{
                _text += '<div class="play_box">' +
                '<img src="../../../images/pages/activity/muhammad/close.png" class="closeBox" onclick="closeClick()">' +
                '<div class="sweet_title">温馨提示</div>' +
                '<div class="sweet_play_content">' + tex +'</div>' +
                '<div class="play_button" onclick="closeClick()">确定</div>' +
                '</div>';
                break;
            }

            case 6 :{
                _text += '<div class="play_box">' +
                '<img src="../../../images/pages/activity/muhammad/close.png" class="closeBox" onclick="closeClick()">' +
                '<div class="sweet_title">温馨提示</div>' +
                '<div class="sweet_play_content">' + tex +'</div>' +
                '<div class="play_button" onclick="closeClick(6)">确定</div>' +
                '</div>';
                break;
            }
        }
        _html += _text;
        _html += '</div>';
        $box.html(_html);
    }

});
var url = window.location.href.split("#")[0];//获取地址
var imgurl = 'http://106.15.44.101/group1/M00/00/11/ag8sZVlkMFmAGGwXAACHCYziLKU845.jpg';//获取图片的logo
var info = {
    url:url
};


var one = {
    title: '来拳王争霸，与我大战三百回合！人人有钱！',
    desc: '战胜我！百元现金与最高3%加息券就给你！预备备...一二三，剪拳布！',
    link: url,
    imgUrl: imgurl
};

var all = {
    title: '来拳王争霸，与我大战三百回合！人人有钱！',
    desc: '战胜我！百元现金与最高3%加息券就给你！预备备...一二三，剪拳布！',
    link: url,
    imgUrl: imgurl
};

//function shareActivity(userId, loginToken) {
//    var data = {
//        userId:userId,
//        postId:2001,
//        loginToken:loginToken
//    };
//    $.ajax({
//        //url: Setting.apiRoot1 + '/u/activity/share/queryInfo.p2p',
//        url: Setting.root + '/post/share/sharePost.do',
//        type: 'get',
//        dataType: 'json',
//        data:data,
//        async: true
//    }).done(function(res) {
//        var _data = res.data;
//        if (res.code == 1) {
//    //        one.link =  'https://teststatic.wdclc.cn/wx/pages/active/muhammad/share_index.html?championId=' + userId;
//    //        all.link =  'https://teststatic.wdclc.cn/wx/pages/active/muhammad/share_index.html?championId=' + userId;
//            one.link =  "https://static.wdclc.cn/wx/pages/active/muhammad/muhammad_index.html?success=1&uid=" + userId;
//            all.link =  "https://static.wdclc.cn/wx/pages/active/muhammad/muhammad_index.html?success=1&uid=" + userId;
//            sessionStorage.setItem('htmlUrl', _data.url);
//            wxshare();
//        }
//    }).fail(function() {
//        alert('网络链接失败，请刷新重试！');
//        return false;
//    });
//}
//
//
//function wxshare(){
//    $.ajax({
//        url: Setting.apiRoot1 + '/wx/jsInfo.p2p',
//        type: 'GET',
//        dataType: 'json',
//        data: {"param": JSON.stringify(info)},
//        async: true
//    }).done(function(res) {
//
//        if (res.code == 1) {
//            var data = res;
//            wx.config({
//                debug: false,
//                appId: data.appId,
//                timestamp: data.timestamp,
//                nonceStr: data.nonceStr,
//                signature: data.signature,
//                jsApiList: [
//                    // 所有要调用的 API 都要加到这个列表中
//                    'checkJsApi',
//                    'onMenuShareTimeline',
//                    'onMenuShareAppMessage',
//                    'onMenuShareQQ',
//                    'onMenuShareWeibo',
//                    'hideMenuItems',
//                    'showMenuItems',
//                    'hideAllNonBaseMenuItem',
//                    'showAllNonBaseMenuItem',
//                    'getNetworkType',
//                    'openLocation',
//                    'getLocation',
//                    'hideOptionMenu',
//                    'showOptionMenu',
//                    'closeWindow'
//                ]
//            });
//
//            wx.ready(function () {
//                wx.onMenuShareAppMessage(one);
//                wx.onMenuShareTimeline(all);
//                wx.onMenuShareQQ(one);
//                wx.onMenuShareWeibo(one);
//            });
//
//        }else{
//            /*alert(res.code);*/
//        }
//
//    }).fail(function() {
//        alert('网络链接失败，请刷新重试！');
//        //return false;
//    });
//}


function closeClick(number) {
    if(number == 6) {
        sessionStorage.clear();
        Common.toLogin();
    }
    $('.wrapper').removeClass('over');
    $('.alert_box').hide();
}

//function closeClick() {
//    $('.wrapper').removeClass('over');
//    $('.alert_box').hide();
//}