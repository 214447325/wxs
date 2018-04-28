var userId = sessionStorage.getItem('uid');
var loginToken = sessionStorage.getItem('loginToken');
var userNum = sessionStorage.getItem('uname');
if (userId == null || userId == '' || userId == undefined) {
    userId = '';
}

$(function () {
    mui.init({
        swipeBack: false,
        preloadPages: [mine()]
    });
});

//初始化方法
function mine() {
    //判断用户是否登录没有登录跳转登录
    if (!userId) {
        Common.toLogin();
        return false;
    }

    //获取手机号码
    var userNum = sessionStorage.getItem('uname');
    var nu = userNum.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2');
    $.ajax({
        url: Setting.root + '/u/query.do',
        type: "GET",
        dataType: 'json',
        data: {
            userId: userId
        }
    }).done(function (res) {
        if (res.code == 1) {
            var useNum = nu;
            var nickName = res.data.nickName;
            var avatar = res.data.avatar;
            if (avatar == null || avatar == '' || avatar == undefined) {
                avatar = '../../images/pages/message/tou@3x.png';
            }
            $("#userImg").attr("src", avatar);
            $("#userName").text(nickName);
            $("#userName1").text(nickName);
            $("#userNumber").text(useNum);
        } else {
            Common2.toast(res.message);
        }
    }).fail(function () {
        Common2.toast('连接失败！')
    });
}

//点击我的收藏页面的跳转
mui("#offCanvasContentScroll").on('tap', '#offCanvasShow', function (data) {
    window.location.href = "../../pages/message/collectionDetails.html";
});

//点击修改昵称
mui("#offCanvasContentScroll").on('tap', '#reviseName', function (data) {
    window.location.href = "../../pages/message/update_name.html";
});

function saveReport() {
    $("#imageForm").ajaxSubmit(function (res) {
        if (res.code == 1 && res.url != "" && res.url != "undefined") {
            var imgUrl = res.url;
            $.ajax({
                type: "GET",
                url: Setting.root + "/u/update.do",
                data: {
                    userId: userId,
                    avatar: imgUrl
                }
            }).done(function (res) {
                sessionStorage.setItem('avatar', imgUrl);
                $("#userImg").attr("src", imgUrl);
                window.location.reload();
            })
        } else {
            Common2.toast(res.message)
        }
    });
    return false;
}

$("#inputImg").change(function (e) {
    $('form').submit();
});

$('.libtn').click(function () {
    sessionStorage.clear();
    window.location.href = Setting.staticRoot + '/pages/my-account/myAccount.html';
});
