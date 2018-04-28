/**
 * invite.js
 * @author tangsj
 * @return {[type]}       [description]
 */
$(function () {

//  var param = Common.getParam();

    var visiturl = location.search; //获取url中"?"符后的字串
    var param = {};
    if (visiturl.indexOf("?") != -1) {
        var str = visiturl.substr(1);
        strs = str.split("&");
        for (var i = 0; i < strs.length; i++) {
            param[strs[i].split("=")[0]] = decodeURIComponent(strs[i].split("=")[1]);
        }
    }

    var weixin = param.weixin;

    $.ajax({
        url: Setting.apiRoot2 + '/weixinLogin.p2p',
        type: 'post',
        dataType: 'json',
        async: true,
        data: {
            weixin: weixin,
        }
    }).done(function (res) {
        if (res.code == 1) {
            sessionStorage.clear();
            sessionStorage.setItem('uname', res.data.phoneNum);
            sessionStorage.setItem('uid', res.data.id);
            sessionStorage.setItem('ucode', res.data.code);
            sessionStorage.setItem('loginToken', res.token);
            sessionStorage.setItem('payChannel', res.data.payChannel);

            window.location.href = Setting.staticRoot + "/pages/invite/myInvite.html?weixin=" + weixin + "&uid=" + res.data.id + "&code=" + res.data.code;

        } else {
            alert(res.code);
            return false;
        }
    }).fail(function () {
        alert("网络错误");
    });


});
