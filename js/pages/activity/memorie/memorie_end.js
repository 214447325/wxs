/**
 * Created by User on 2017/2/9.
 */
$(function() {
    var param = Common.getParam();
    var userId = sessionStorage.getItem('uid') || param.userId;
    if(!userId){
        Common.toLogin();
        return false;
    }
    //点击生成海报的按钮
    $('.poster').click(function() {
        window.location.href = '../../../pages/active/memorie/poster.html?userId=' + userId;
    });
});