/**
 * Created by User on 2016/9/20.
 */
$(function() {

    var param = Common.getParam();
    var active = param.active;
    var $navTitle = $('.com');//标题
    var $returnPage = $('.return-img');
    var  _html = '';

    if(active == 1) {
        _html = '<div class="navTitle">' +
                '<div class="commonWidth">' +
                '<div class="returnImg">' +
                '<a href="../../pages/message/messages.html?act=0">' +
                 '<img src="../../images/pages/return.png" class="return-img">' +
                '</a>' +
                 '</div>' +
                '<div>' +
                '<div class="titleContent">活动</div>' +
                '</div>' +
                '</div>' +
                '</div>';
    }

    $navTitle.html(_html);

    //$returnPage.click(function() {
    //    window.location.href = Setting.staticRoot+'/pages/message/messages.html';
    //});
});

//function returnPage() {
//    window.location.href = Setting.staticRoot + '/pages/message/messages.html?act=1';
//}