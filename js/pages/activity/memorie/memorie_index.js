/**
 * Created by User on 2017/2/7.
 */
$(function() {
    var mySwiper = new Swiper('.swiper-container',{
        nextButton:'.swiper-button-next',
        onSlideChangeStart: function(swiper){
            if (swiper.activeIndex == 1) {
                $('.button-next').removeClass('swiper-button-next');
            } else {
                $('.button-next').addClass('swiper-button-next');
            }
        }
    });

    var param = Common.getParam();
    var userId = sessionStorage.getItem('uid') || param.uid;
    var loginToken = sessionStorage.getItem('loginToken') || param.loginToken;
    //if(userId && loginToken && userId != undefined && userId != 'undefined'){
    //    sessionStorage.setItem('uid', userId);
    //    sessionStorage.setItem('loginToken',loginToken);
    //} else {
    //    Common.toLogin();
    //    return false;
    //}

    //点击笔记本进行页面的跳转
    //$('.book').click(function() {
    //    alert('1')
    //    if(userId && loginToken && userId != undefined && userId != 'undefined') {
    //        alert('2')
    //        window.location.href = '../../../pages/active/memorie/memorie_log.html';
    //    } else {
    //        Common.toLogin();
    //        return false;
    //    }
    //});
});

function clickFun() {
    var param = Common.getParam();
    var userId = sessionStorage.getItem('uid') || param.uid;
    var loginToken = sessionStorage.getItem('loginToken') || param.loginToken;
    if(userId && loginToken && userId != undefined && userId != 'undefined'){
        window.location.href = '../../../pages/active/memorie/memorie_log.html';
    } else {
        Common.toLogin();
        return false;
    }
}