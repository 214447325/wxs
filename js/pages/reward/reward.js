/**
 * 用户设置中心
 **/
$(function () {
    var $win = $(window);
    var $body = $('body');
    var formData = {}


    function checkForm() {

        userName = $.trim(_name.val());
        idNo = $.trim(_number.val());

        if (!userName.length > 0) {
            alert("请输入姓名")
            return false
        }
        ;
        if (!idNo.length > 0) {
            alert("请输入身份证号码")
            return false
        }
        ;
        if (!Common.reg.idCard.test(idNo)) {
            alert("身份证号码格式有误，请重新输入！")
            return false
        }
        ;
        formData.userName = userName;
        formData.idNo = idNo;
        formData.loginToken = sessionStorage.getItem('loginToken');
        return true;
    }

    formData.loginToken = sessionStorage.getItem('loginToken');
    $body.on('click', '.real-btn', function (event) {
        if (checkForm()) {
            $.ajax({
                url: Setting.apiRoot1 + '/u/idCard/validate.p2p',
                type: 'post',
                dataType: 'json',
                data: formData,
            })
                .done(function (res) {
                    Common.ajaxDataFilter(res, function () {
                        console.log(res);
                    })

                })
                .fail(function () {
                    console.log("error");
                })


        }
        ;

    });
});