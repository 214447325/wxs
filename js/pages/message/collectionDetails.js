var userId = sessionStorage.getItem('uid');
var loginToken = sessionStorage.getItem('loginToken');
if (userId == null || userId == '' || userId == undefined) {
    userId = '';
}

$(function () {
    mui.init({
        swipeBack: false,
        preloadPages: [mine()]
    });
});

var count = 1;
function mine() {
    if (!userId) {
        Common.toLogin();
        return false;
    } else {
        var _date = new Date();
        $.ajax({
            url: Setting.root + '/u/favorities/getList.do',
            type: "GET",
            dataType: 'json',
            data: {
                pageNum: count,
                userId: userId,
                date: _date.getTime()
            }
        }).done(function (res) {
            if (res.code == 1 && res.data != undefined && res.data != '' && res.data != null) {
                var _data = res.data;
                if (_data.length != 0 && _data != '' && _data != null && _data != undefined) {
                    count = count + 1;
                    traverseData1(_data);
                }
            } else {
                alert("暂无收藏");
            }
        }).fail(function () {
            alert('查询失败！')
        });
    }
}

function traverseData1(data) {
    var _html = '';
    for (var i = 0; i < data.length; i++) {
        var browseTotal = '';
        var postImage = '';
        var bumpTotal = '';
        var isLike = '';
        var isFavorite = '';
        var avatar = '';
        var nickName = '';
        var post_type = '';
        var url = '';

        var endli = '';
        var endVaild = '';
        var likeTotal = 0;

        if (data[i].postCategory == 1) {
            data[i].postCategory = "金融";
        }
        if (data[i].postCategory == 2) {
            data[i].postCategory = "热点";
        }

        //post_type == 3跳转活动详情页
        if (data[i].postCategory == 3) {
            data[i].postCategory = "活动";
            post_type = 3;
            if (data[i].vaild == 2) {
                endli = 'endli';
                endVaild = '<div class="endAct"></div><div class="endActicon">活动结束</div>';
            }
            url = data[i].postContent;
        } else {
            post_type = 0;
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
            postImage = '<img src=' + data[i].postImage + ' class="postImage">';
        } else {
            postImage = data[i].postImage;
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
        '<span class="item-user-time">' + data[i].createTime + '</span>' +
        '<span class="item-user-time1">' + data[i].postCategory + '</span>' +
        '<div class="icon-wrap-v2 read-icon-v3">' +
        '<span class="readnum">阅读' + browseTotal + '</span>' +
        '</div>' +
        '</div>' +
        '</div>' +
        '</div>' +
        '<div class="detail-bottom">' +
        '<div class="report-content" content_id="' + data[i].id + '" name="' + data[i].nickName + '" post_type=' + post_type + ' url=' + url + '>' +
        '<p class="grouptitle feed-two-line"><span>' + data[i].postTitle + '</span></p>' +
            // '<p class="groupbrief feed-two-line"><span>'+data[i].postDigest+'</span></p>'+
        '<div class="feed-img img-ph">' +
        '<div class="img-wrap clearfix">' +
        '<div class="feed-img img-ph">' +
        '<div>' + postImage + '</div>' +
        '</div>' +
        '</div>' +
        '</div>' +
        '</div>' +
        '<div class="img-wrap clearfix" style="padding: 0 10px 0px;margin-top: -0.5rem;">' +
            // '<div class="feed-img img-ph" style="padding-top: 0.4rem;">'+
            // '<div class="img-wrap clearfix">'+
            // '<div class="feed-img img-ph">'+
            // '<div>'+postImage+'</div>'+
            // '</div>' +
            // '</div>' +
            // '</div>' +
        '<p class="groupbrief feed-two-line"><span>' + data[i].postDigest + '</span></p>' +
        '</div>' +


        '</div>' +
        '</a>' +
        '<div class="itemTitle">' +
        '<a class="bumpTotal">' + bumpTotal + '</a>' +
        '<a class="bumpTotala">评论</a>' +
        '<a class="bumpTotala">•</a>' +
        '<a class="bumpTotala">' + likeTotal + '</a>' +
        '<a class="bumpTotala">点赞</a>' +
        '</div>' + endVaild +
        '</li>'
    }
    $('#item3mobile03').append(_html);
}

mui("#item3mobile03").on('tap', '.report-content', function (data) {
    var id = this.getAttribute("content_id");
    var post_type = this.getAttribute("post_type");
    if (post_type != 3) {
        getPagesUrl(id);
    } else {
        var url = this.getAttribute('url');
        window.location.href = url + '?postId=' + id;
    }
});

mui("#item3mobile03").on('tap', '.comments1', function (data) {
    var id = this.getAttribute("post_id");
    var post_type = this.getAttribute("post_type");
    if (post_type != 3) {
        getPagesUrl(id);
    } else {
        var url = this.getAttribute('url');
        window.location.href = url + '?postId=' + id;
    }
});

function getPagesUrl(id) {
    var $id = $('#' + id);
    var _name = $id.attr('name');
    var _count = $id.find('.readnum').html();
    window.location.href = "../../pages/message/messageDetails.html?postId=" + id + "&readNum=" + _count + '&islike=' + $id.attr('islike') + '&isfavorite=' + $id.attr('isfavorite');
}

//社区-点击点赞按钮

mui("#item3mobile03").on('tap', '.praises1', function () {
    if (!userId) {
        Common.toLogin();
        return false;
    }
    var _name = this.getAttribute("name");
    var isLike = this.getAttribute("islike");
    var $name = $('div[name=' + _name + ']');
    if (isLike == 1) {
        //取消点赞
        isLike = 0;
    } else {
        //点赞
        isLike = 1;
    }

    $.ajax({
        url: Setting.root + '/u/post/likeHandler.do',
        type: "GET",
        dataType: 'json',
        data: {
            userId: userId,
            postId: _name,
            likeType: isLike
        }
    }).done(function (res) {
        if (res.code != 1) {
            alert(res.message);
        }
        //判断是点赞还是取消改变样式
        if (isLike == 1) {
            $name.contents().find('img').attr({'src': '../../images/pages/activity/24@3x.png'});
            $name.contents().find('p').addClass('likeTotal').html(res.data);
        } else {
            $name.contents().find('img').attr({'src': '../../images/pages/activity/zan@3x.png'});
            $name.contents().find('p').removeClass('likeTotal').html(res.data);
        }
        $name.attr({'isLike': isLike});
    });

});
//社区-点击收藏按钮
mui("#item3mobile03").on('tap', '.collection1', function () {
    if (!userId) {
        Common.toLogin();
        return false;
    }
    var _name = this.getAttribute('collection1');
    var _isfavorite = this.getAttribute('isfavorite');
    var $collection = $('div[collection1=' + _name + ']');
    if (_isfavorite == '' || _isfavorite == null || _isfavorite == undefined || _isfavorite == 'undefined') {
        $.ajax({
            url: Setting.root + '/u/favorities/append.do',
            type: "GET",
            dataType: 'json',
            data: {
                userId: userId,
                postId: _name
            }
        }).done(function (res) {
            if (res.code == 1) {
                var $praise = $('div[collection1=' + _name + '] .div01 .praise');//帖子的数量
                var $praiseImg = $('div[collection1=' + _name + '] .div01 .praiseImg');//帖子的图片
                var _praise = parseInt($praise.html());
                $praise.addClass('likeTotal').html(_praise + 1);
                $collection.attr({'isfavorite': 1});
                $praiseImg.attr({'src': '../../images/pages/activity/collection@3x.png'});
            } else {
                alert(res.message);
            }
        }).fail(function () {
            alert('收藏失败！')
        });

    } else {
        $.ajax({
            url: Setting.root + '/u/favorities/del.do',
            type: "GET",
            dataType: 'json',
            data: {
                userId: userId,
                postId: _name
            }
        }).done(function (res) {
            if (res.code == 1) {
                var $praise = $('div[collection1=' + _name + '] .div01 .praise');//帖子的数量
                var $praiseImg = $('div[collection1=' + _name + '] .div01 .praiseImg');//帖子的图片
                var _praise = parseInt($praise.html());
                $praise.removeClass('likeTotal').html(_praise - 1);
                $collection.attr({'isfavorite': ''});
                $praiseImg.attr({'src': '../../images/pages/activity/noCollection@3x.png'});
                window.location.reload();
            } else {
                alert(res.message);
            }
        }).fail(function () {
            alert('取消收藏失败！')
        });
    }
});
