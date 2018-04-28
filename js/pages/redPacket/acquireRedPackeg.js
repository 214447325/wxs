/**
 * Created by User on 2016/7/19.
 */
$(function () {
    var userStatus = 0;
    var channelId = Common.getParam().channelId;
    $('.acqImg3').click(function () {
        var $input = $('.txt');
        var ph = $input.val();
        var $this = $(this);
        if (ph == "" || ph.length == 0) {
            alert('手机号码不能为空！');
            $this.removeClass('disabled');
            return false;
        } else {
            if (!Common.reg.mobile.test(ph)) {
                alert('请输入正确的手机号码！');
                $this.removeClass('disabled');
                return false;
            } else {
                $.post(Setting.apiRoot2 + '/isRegistForGetReward.p2p', {phoneNum: ph}, function (datas) {
                    var code = datas.code;
                    if (code == -1) {
                        alert(datas.message);
                    }
                    if (code == 1) {
                        userStatus = datas.data.userStatus;
                        //判断用户是否要注册
                        if (userStatus == 0) {
                            window.location.href = '../../pages/redPacket/redPackeg-login.html?phoneNum=' + ph + '&&channelId=' + channelId;
                        } else {
                            alert(datas.message);
                            setTimeout(function () {
                                jum(userStatus, ph)
                            }, 1000);
                        }
                    }
                }, 'json');
            }
        }
    });
});

function jum(userStatus, ph) {
    var s;
    s = '?userStatus=' + userStatus + '&&phoneNum=' + ph;
    window.location.href = '../../pages/redPacket/downloadAPP.html' + s;
}
