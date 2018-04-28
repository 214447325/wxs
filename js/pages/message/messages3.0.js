/**
 * Created by User on 2016/9/1.
 */
var userId = sessionStorage.getItem('uid');
var loginToken = sessionStorage.getItem('loginToken');
var isEnd = true;

var _resData = '';
var _comResData = '';
if (userId == null || userId == '' || userId == undefined) {
    userId = '';
}
function getMessages() {
    var $active = $('.active');//活动
    var $message = $('.message');//公告
    var $tabcon = $('.mess');
    //红包模板
    var setListData = doT.template([
        '{{~it :item:index}}',
        '<dl>',
        '<li class="messageOne"   style="height:2.925rem">',
        '<a href="' + Setting.staticRoot + '/pages/message/messagedetail.html?type={{=item.fileType}}&id={{=item.id}}">',
        '<span class="messageInfo messageFirst">',
        '<h2  >{{=item.title}}</h2>',
        '<nobr><p  class="detail">{{=item.keydesc}}</p></nobr>',
        '<p  class="time">{{=item.createTime.split(" ")[0]}}</p>',
        '</span>',
        '</a>',
        '</li>',
        '</dl>',
        '{{~}}'
    ].join(''));
    //获取消息列表
    $.ajax({
        url: Setting.apiRoot1 + '/getPublicMessage.p2p',
        type: "post",
        dataType: 'json',
        data: {
            type: 1,
            flag: 1
        }
    }).done(function (res) {
        if (res.code == 1) {
            var data = res.data.fileList;
            if (data.length > 0) {
                var _html = '';
                var keydesc = '';
                for (var i = 0; i < data.length; i++) {
                    keydesc = data[i].keydesc;
                    if (keydesc.length > 45) {
                        keydesc = keydesc.substring(0, 45);
                        keydesc = keydesc + '...';
                    }
                    _html = _html + '<li class="title-time" style="padding-top: 0;">' + data[i].createTime + '</li>' +
                    '<li class="messageOne" id="messageOne" style="width:9.2rem;height:auto;margin: 0 auto;margin-top: 0.3rem!important;">' +
                    '<a href=' + Setting.staticRoot + data[i].url + '>' +
                    ' <span class="messageInfo messageFirst">' +
                    '<h2>' + data[i].title + '</h2>' +
                    '</span>' +
                    '<div class="divp"><p class="detail">' + keydesc + '</p></div>' +
                    '<div class="dTime" id="dTime"><p class="time">查看详情</p><p class="pdetail">></p></div>' +
                    '</a>' +
                    '</li>'
                }
                $tabcon.html(_html);
            }
        } else {
            alert(res.message);
            return false;
        }

    }).fail(function () {
        alert('网络链接失败');
        return false
    });
}

//活动显示
var coun = 1;
function getActive() {
    var $active = $('.active');//活动
    var getTimestamp = new Date().getTime();
    $.ajax({
        url: Setting.root + '/post/queryList.do',
        type: "GET",
        dataType: 'json',
        data: {
            postCategory: 3,
            userId: userId,
            pageNum: coun,
            date: getTimestamp
        }
    }).done(function (res) {
        if (res.code == 1) {
            var _data = res.data;
            _resData = _data;
            if (_data.length != 0 && _data != '' && _data != null && _data != undefined) {
                coun = coun + 1;
                traverseData1(_data, $('#activeMess'));
                mui('#scroll1').pullRefresh().endPullupToRefresh((false)); //参数为true代表没有更多数据了。
            } else {
                $('.mui-scroll').append('<div class="mui-pull-bottom-tips"><div class="mui-pull-bottom-wrapper"><span class="mui-pull-loading">暂无数据</span></div></div>');
                mui('#scroll1').pullRefresh().endPullupToRefresh((true)); //参数为true代表没有更多数据了。
                $('#activeMess').addClass('noData');
            }
        }
    }).fail(function () {
        alert('查询失败！')
    });

}

var count = 1;
//推荐
function getCommunity() {
    var $item3mobile = $('.item3mobile');
    var userId = sessionStorage.getItem('uid');
    var loginToken = sessionStorage.getItem('loginToken');
    var getTimestamp = new Date().getTime();
    $.ajax({
        url: Setting.root + '/post/queryList.do',
        type: "GET",
        dataType: 'json',
        data: {
            pageNum: count,
            userId: userId,
            date: getTimestamp
        }
    }).done(function (res) {
        if (res.code == 1) {
            var _data = res.data;
            _comResData = _data;
            if (_data.length != 0 && _data != '' && _data != null && _data != undefined) {
                count = count + 1;
                traverseData1(_data, $('#item3mobile03'));
                mui('#scroll3').pullRefresh().endPullupToRefresh((false));
            } else {
                mui('#scroll3').pullRefresh().endPullupToRefresh((true));
                $('.mui-scroll').append('<div class="mui-pull-bottom-tips"><div class="mui-pull-bottom-wrapper"><span class="mui-pull-loading">暂无数据</span></div></div>');
                $('#item3mobile03').addClass('noData');
            }

        }
    }).fail(function () {
        alert('查询失败！')
    });
}

function traverseData1(data, $html) {
    var _html = '';
    for (var i = 0; i < data.length; i++) {
        var browseTotal = '';
        var postImage = '';
        var bumpTotal = '';
        var isLike = '';
        var nickName = '';
        var avatar = '';
        var isFavorite = '';
        var endli = '';
        var endVaild = '';
        var likeTotal = 0;
        var actUrl = '0';

        if (data[i].postCategory == 1) {
            data[i].postCategory = "金融";
        }
        if (data[i].postCategory == 2) {
            data[i].postCategory = "热点";
        }
        if (data[i].postCategory == 3) {
            if (data[i].vaild == 2) {
                endli = 'endli';
                endVaild = '<div class="endAct"></div><div class="endActicon">活动结束</div>';
                actUrl = '0';
            } else {
                actUrl = data[i].postContent;
            }
            //data[i].postCategory = "活动";
        }
        if (data[i].postCategory == 4) {
            data[i].postCategory = "资讯";
        }
        if (data[i].postCategory == 5) {
            data[i].postCategory = "V-TIME";
        }
        if (data[i].postCategory == 6) {
            data[i].postCategory = "V薇说";
        }

        //阅读数
        if (data[i].browseTotal != null && data[i].browseTotal != '' && data[i].browseTotal != undefined) {
            browseTotal = data[i].browseTotal;
        } else {
            browseTotal = 0;
        }
        //正文图片
        if (data[i].postImage != null && data[i].postImage != '' && data[i].postImage != undefined) {
            postImage = '<img src=' + data[i].postImage + ' class="postImage" />';
        }

        //昵称
        if (data[i].nickName != null && data[i].nickName != '' && data[i].nickName != undefined) {
            nickName = '<img src=' + data[i].nickName + '>';
        }

        //判断是否有回复
        if (data[i].bumpTotal != null && data[i].bumpTotal != '' && data[i].bumpTotal != undefined) {
            bumpTotal = data[i].bumpTotal;
        } else {
            bumpTotal = 0;
        }

        //数量点赞
        if (data[i].likeTotal != null && data[i].likeTotal != '' && data[i].likeTotal != undefined) {
            likeTotal = data[i].likeTotal;
        } else {
            likeTotal = 0;
        }

        //判断当前用户是否点赞
        if (data[i].isLike != null && data[i].isLike != '' && data[i].isLike != undefined) {
            isLike = data[i].isLike;
        } else {
            isLike = 0;
        }

        //当前用户是否收藏
        if (data[i].isFavorite != null && data[i].isFavorite != '' && data[i].isFavorite != undefined) {
            isFavorite = data[i].isFavorite;
        } else {
            isFavorite = 0
        }

        //判断是否有头像
        if (data[i].avatar == undefined || data[i].avatar == null || data[i].avatar == '') {
            avatar = '../../images/pages/message/tou@3x.png';
        } else {
            avatar = data[i].avatar;
        }

        _html = _html + '<li class="item3mobileLi ' + endli + '">' +
        '<a class="move" id="' + data[i].id + '" isLike=' + isLike + ' isFavorite=' + isFavorite + '>' +
        '<div class="detail-top">' +
        '<div class="item-user" style="padding: 20px 10px 12px;color: #8c8c8c;">' +
        '<div class="item-user-wrap" style="position: relative;">' +
        '<div class="item-user-avator" style="loat: left;overflow: hidden;position: relative;border-radius: 50%;width: 35px;height: 35px;">' +
        '<img style="border-radius: 50%;width: 100%;vertical-align: middle;height: 100%;background-color: #efece9;" class="avator-img img-ph" src=' + avatar + ' />' +
        '</div>' +
        '<span class="item-user-text">' +
        '<span class="item-user-name">' + data[i].nickName + '</span>' +
        '<span></span>' +
        '</span>' +
        '<span class="item-user-time">' + data[i].createTime + '</span>';
        if (data[i].postCategory != 3) {
            _html = _html + '<span class="item-user-time1">' + data[i].postCategory + '</span>';
        }

        _html = _html + '<div class="icon-wrap-v2 read-icon-v3">' +
        '<span class="readnum">阅读' + browseTotal + '</span>' +
        '</div>' +
        '</div>' +
        '</div>' +
        '</div>' +
        '<div class="detail-bottom">' +
        '<div class="report-content">' +
        '<p class="grouptitle feed-two-line" url="' + actUrl + '" postID="' + data[i].id + '" name="' + data[i].nickName + '" style="margin-bottom: 0;"><span>' + data[i].postTitle + '</span></p>' +

        '<div class="img-wrap clearfix" style="margin-bottom: 10px;">' +
        '<div class="feed-img img-ph">' +
        '<div class="img-wrap clearfix" style="height: 4rem;overflow: hidden;position: relative;">' +
        '<div class="feed-img img-ph">' +
        '<div>' + postImage + '</div>' +
        '</div>' +
        '</div>' +
        '</div>' +
        '</div>' +

        '<p class="groupbrief feed-two-line" url="' + actUrl + '" postID="' + data[i].id + '" name="' + data[i].nickName + '" style="margin-bottom: 0;"><span>' + data[i].postDigest + '</span></p>' +
        '</div>' +
            //'<div class="img-wrap clearfix" style="padding: 0 10px 5px;margin-top: -0.5rem;">'+
            //'<div class="feed-img img-ph">'+
            //'<div class="img-wrap clearfix">'+
            //'<div class="feed-img img-ph">'+
            //'<div>'+postImage+'</div>'+
            //'</div>' +
            //'</div>' +
            //'</div>' +
            //'</div>' +
        '</div>' +
        '</a>' +
        '<div class="itemTitle" >' +
        '<a class="bumpTotal">' + bumpTotal + '</a>' +
        '<a class="bumpTotala">评论</a>' +
        '<a class="bumpTotala">•</a>' +
        '<a class="bumpTotala">' + likeTotal + '</a>' +
        '<a class="bumpTotala">点赞</a>' +
        '</div>' + endVaild +
        '</li>'
    }
    $html.append(_html);
}


$(function () {
    var param = Common.getParam();//param取url参数
    var displayTitle = param.displayNav;
    var ds = sessionStorage.getItem('displayNav');

    if (ds == 0) {
        $('.clearfix').hide();
    } else {
        if (displayTitle == 0) {
            $('.clearfix').hide();
            sessionStorage.setItem('displayNav', displayTitle);//app端不显示顶部title
        }
    }

    var act = sessionStorage.getItem('act');//param.act;
    if (act == 1) {
        $('#mui-control-active').addClass('mui-active');
        $('#item3').removeClass('mui-active');
        $('#item1mobile').addClass('mui-active');
        $('#item3mobile').removeClass('mui-active');
    } else {
        sessionStorage.removeItem('act');
    }

    mui.init({
        swipeBack: false,
        preloadPages: [getMessages(), getActive(), getCommunity()]
    });

    (function ($) {
        $.ready(function () {
            //循环初始化所有下拉刷新，上拉加载。
            $.each(document.querySelectorAll('.mui-slider-group'), function (index, pullRefreshEl) {
                $(pullRefreshEl).pullToRefresh({
                    up: {
                        contentrefresh: '正在加载...',
                        callback: function () {
                            var self = this;
                            var _item1mobile = document.getElementById('item1mobile');//活动
                            var _item3mobile = document.getElementById('item3mobile');//推荐
                            var isitem1mobile = hasClass(_item1mobile, 'mui-active');//活动
                            var isitem3mobile = hasClass(_item3mobile, 'mui-active');//推荐
                            var g3NoData = document.getElementById('item3mobile03');//推荐
                            var g1NoData = document.getElementById('activeMess');//活动
                            if (isitem1mobile) {
                                setTimeout(function () {
                                    if (hasClass(g1NoData, 'noData')) {
                                        noData();
                                        return false;
                                    }
                                    var active = getActive();
                                    if (active == undefined || active == null || active == '') {
                                        self.endPullUpToRefresh(false);
                                    } else {
                                        self.endPullUpToRefresh(true);
                                    }
                                }, 1500);
                            }
                            if (isitem3mobile) {
                                setTimeout(function () {
                                    if (hasClass(g3NoData, 'noData')) {
                                        noData();
                                        return false;
                                    }
                                    var community = getCommunity();
                                    if (community == undefined || community == null || community == '') {
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

    function hasClass(element, cls) {
        return (' ' + element.className + ' ').indexOf(' ' + cls + ' ') > -1;
    }


});

function noData() {
    $('.mui-pull-loading').html('暂无数据');
}

//活动结束跳转
//mui("#activeMess").on('tap','.endli',function() {
//    window.location.href = '../../pages/activityOver/activityOver.html';
//});

//活动&公告
//点击评论按钮
mui(".messageList").on('tap', '.comments,.page', function () {
    if (!userId) {
        Common.toLogin();
        return false;
    }
    //回复帖子的数量
    var bumptotal = this.getAttribute("bumptotal");
    //帖子的id
    var posttype = this.getAttribute('posttype');
    //帖子的标题
    var posttitle = this.getAttribute('posttitle');
    //页面跳转的地址
    var pageUrl = $('div[postcontent=' + posttype + ']').html();
    $.ajax({
        url: Setting.root + '/post/incrBrowse.do',
        type: "GET",
        dataType: 'json',
        data: {
            postId: posttype
        }
    }).done(function (res) {
        if (res.code == 1) {
            window.location.href = pageUrl + '?postId=' + posttype + '&bumpTotal=' + bumptotal + '&postTitle=' + posttitle;
        }
    });
});


mui(".mess").on('tap', '.messageOne a', function () {
    var _href = this.getAttribute('href');
    window.location.href = _href;
});

//社区-点击摘要按钮
mui("#item3mobile03").on('tap', '.grouptitle,.groupbrief', function (data) {
    if (!userId) {
        Common.toLogin();
        return false;
    }
    var id = this.getAttribute("postID");
    sessionStorage.removeItem('act');
    getPageUrl(id);
});

//活动-点击摘要按钮
mui("#activeMess").on('tap', '.grouptitle,.groupbrief', function (data) {
    if (!userId) {
        Common.toLogin();
        return false;
    }

    var _date = new Date();
    $.ajax({
        url: Setting.root + '/post/incrBrowse.do',
        type: "GET",
        dataType: 'json',
        data: {
            postId: this.getAttribute("postID"),
            date: _date.getTime()
        }
    }).done(function (res) {
        if (res.code == 1) {
        } else {
            alert(res.message);
        }
    });

    sessionStorage.setItem('act', 1);
    var id = this.getAttribute("postID");
    var url = this.getAttribute('url');
    var $id = $('#' + id);
    var _count = $id.find('.readnum').html();
    window.location.href = url + '?postId=' + id + '&readNum=' + _count + '&islike=' + $id.attr('islike') + '&isfavorite=' + $id.attr('isfavorite') + '&act=1';
    //for(var i = 0; i < _resData.length; i++) {
    //    if(id == _resData[i].id) {
    //        //window.location.href = _resData[i].postContent + '?postId=' + id + '&readNum=' + _count + '&islike=' + $id.attr('islike') + '&isfavorite=' + $id.attr('isfavorite') + '&act=1';
    //    }
    //}
});


function getPageUrl(id) {
    var _date = new Date();
    $.ajax({
        url: Setting.root + '/post/incrBrowse.do',
        type: "GET",
        dataType: 'json',
        data: {
            postId: id,
            date: _date.getTime()
        }
    }).done(function (res) {
        if (res.code == 1) {
        } else {
            alert(res.message);
        }
    });
    var $id = $('#' + id);
    var _name = $id.attr('name');
    var _count = $id.find('.readnum').html();
    if (id == 2021) {
        window.location.href = 'https://mp.weixin.qq.com/s/vCc2JnW9slIC5GDDp2dxBg';
    } else {
        window.location.href = "../../pages/message/messageDetails.html?postId=" + id + "&readNum=" + _count + '&islike=' + $id.attr('islike') + '&isfavorite=' + $id.attr('isfavorite');
    }
}

$(".mine").click(function () {
    if (!userId) {
        Common.toLogin();
        return false;
    } else {
        window.location.href = "../../pages/message/mine.html";
    }
});
