$(function () {
    var param = Common.getParam();
    var postId = param.postId;
    //var readCount = param.readNum;
    var $read = $('.read');
    $.ajax({
        url: Setting.root + '/post/queryInfo.do',
        type: "GET",
        dataType: 'json',
        data: {
            postId: postId
        }
    }).done(function (res) {
        if (res.code == 1) {
            var _data = res.data;
            var _html = '';
            var avatar = '../../images/pages/message/tou@3x.png';
            var nickName = '';
            if (_data.avatar != null && _data.avatar != '' && _data.avatar != undefined) {
                avatar = _data.avatar;
            }

            if (_data.nickName != null && _data.nickName != '' && _data.nickName != undefined) {
                nickName = _data.nickName;
            }

            _html = _html + '<div class="user">' +
            '<div class="user-img">' +
            '<img src=' + avatar + ' class="userImg">' +
            '</div>' +
            '<div class="user-title">' +
            '<div class="user-name">' + nickName + '</div>' +
            '<div class="user-time">' + _data.createTime + '</div>' +
            '</div>' +
            '<div class="red">' +
            '<a class="redCount">阅读' + _data.browseTotal + '</a>' +
            '</div>' +
            '</div>' +
            '<div class="content">' +
            '<div class="content-title">' + _data.postTitle + '</div>' +
            '<div class="content-body">' + _data.postContent + '</div>' +
            '</div>';

            $read.append(_html);
        }
    }).fail(function () {
        alert('网络链接失败');
    });
});