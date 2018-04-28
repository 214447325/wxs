/**
 * Created by User on 2016/7/20.
 */

$(function () {
    var params = Common.getParam().userStatus;
    var phone = Common.getParam().phoneNum;
    $('.phone').html(phone);
    if (params == 1 || params == 0) {
        $('.downspan').html(1000);
    }
    if (params == 2) {
        $('.downspan').html(2000);
    }
});
