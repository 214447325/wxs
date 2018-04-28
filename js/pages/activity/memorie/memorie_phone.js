/**
 * Created by User on 2017/2/8.
 */
$(function() {
    var param = Common.getParam();
    var userId = sessionStorage.getItem('uid') || param.userId;
    var loginToken = sessionStorage.getItem('loginToken') || param.loginToken;
    if(!userId){
        Common.toLogin();
        return false;
    }
    $.ajax({
        url: Setting.apiRoot1 + '/u/getFutureLetter.p2p',
        type: 'post',
        dataType: 'json',
        data: {
            userId: userId,
            loginToken : loginToken
        }
    }).done(function(res) {
        if(res.code == 1) {
            $('.background').addClass('phone' + res.data);
        }
    }).fail(function(){
        alert('网络链接失败，请刷新重试！');
        return false;
    });
    //点击生成海报的按钮
    $('.poster').click(function() {
        window.location.href = '../../../pages/active/memorie/poster.html?userId=' + userId;
    });
});