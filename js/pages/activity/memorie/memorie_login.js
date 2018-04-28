/**
 * Created by User on 2017/2/7.
 */
$(function() {
    var param = Common.getParam();
    var userId = sessionStorage.getItem('uid');//获取手机号码
    var loginToken = sessionStorage.getItem('loginToken') || param.loginToken;

    var iphone = '';
    //var $input = $('.input_text');//input对话框
    var $button = $('.login_button');//点击确认解锁
    var $alert = $('.login_alert');//跳出弹框
    var $content = $('.login_confirm_content');//弹框内容
    var wrapperHeight = $('.wrapper').height();
    $('.banner').height(wrapperHeight + 'px');

    if(!userId){
        Common.toLogin();
        return false;
    }

    //点击确认解锁按钮
    $button.click(function() {

        //请求借口获取数据
        $.ajax({
            url: Setting.apiRoot1 + '/u/VDiaryLogin.p2p',
            type: 'post',
            dataType: 'json',
            data: {
                userId: userId,
                loginToken : loginToken
            }
        }).done(function(res) {
            //页面正常的跳转
            if(res.code == 1 || res.code == 0) {
                window.location.href = '../../../pages/active/memorie/memorie_content.html?userId=' + userId;
            } else if(res.code == -2) { // 2017年注册的
                window.location.href = '../../../pages/active/memorie/memorie_end.html?userId=' + userId;
            } else {
                confirm(res.message,function() {
                    Common.toLogin();
                })
            }
        }).fail(function(){
            alert('网络链接失败，请刷新重试！');
            return false;
        });
    });

    $('.wrong').click(function() {
        $alert.hide();
        $content.html('');
    });

});