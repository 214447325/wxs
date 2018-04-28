/**
 * zyx
 * 绑定成功
 **/
$(function(){

    var param = Common.getParam();
    var $win = $(window);
    var $body = $('body');
    var uid = sessionStorage.getItem("uid")
    var $invitationcode = $(".invitationcode");

    var $phone = $(".phone");
    var $name = $(".name");
    var $code = $(".code");

    var phone = param.phone;
    var name = param.name;
    var createTime = param.createTime;
    var userId = param.userId;
    $.ajax({
        url: Setting.apiRoot1 + '/u/getMasterByUserId.p2p',
        type: 'post',
        dataType: 'json',
        data: {
            userId : userId,
            loginToken:sessionStorage.getItem('loginToken')
        }
    }).done(function(res) {
        if(res.code==1){
            $phone.html("手机号："+ res.data.phoneNum);
            $name.html("姓名："+ res.data.userName);
            $code.html("邀请时间："+ res.data.createTime);
        }else{
            alert(res.message);
        }
    }).fail(function() {
        alert('网络链接失败');
        //$this.removeClass('disabled').html('确认');
    });



    if(!uid){
        Common.toLogin();
        return false;
    }
});