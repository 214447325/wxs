/**
 * Created by User on 2016/7/7.
 */
//$(function(){
//    var search = window.location.search ;
//    if (search == '?user=1') {
//        $('#userClick').hide();
//    }
//});

$('#userClick').click(function () {
    $('#userClick').hide();
});

$('.invitefriend').scroll(function () {
    var scroHeight = $(this).scrollTop();
    var joinHeight = $('#join').height();
    if (scroHeight >= 2500) {
        $('#userClick').hide();
    } else {
        $('#userClick').show();
    }
});


//$('#registerImg1').click(function() {
//    var formData = {}
//     var isPersion = isUser(formData);
//    if(isPersion) {
//        $.post(Setting.apiRoot1 + '/isRegist.p2p', {formData: formData}, function(data){
//            console.log(JSON.stringify(formData))
//        });
//    }
//});


//function isUser(formData) {
//
//    var $phone = $('input[name="phone"]').val();
//    var $verification = $('input[name="verification"]').val();
//    var $password = $('input[name="password"]').val();
//
//    var phone = $.trim($phone);
//    var vcode = $.trim($verification);
//    var password = $.trim($password);
//
//    if(phone.length == 0){
//        alert('请输入手机号码！');
//        return false;
//    }
//
//
//    if(vcode.length == 0){
//        alert('请输入验证码！');
//        return false;
//    }
//
//    if(password.length ==0) {
//        alert('请输入密码！');
//        return false;
//    }
//
//    if(6 > password.length) {
//        alert('请输入合法的密码！')
//        return false;
//    }
//
//    if(password.length > 20) {
//        alert('请输入合法的密码！')
//        return false;
//    }
//
//    formData.phoneNum = phone;
//    formData.code = vcode;
//    formData.password = password;
//    return true;
//}




























