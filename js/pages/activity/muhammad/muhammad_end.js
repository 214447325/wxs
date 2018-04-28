/**
 * Created by User on 2017/3/6.
 */
/**
 * Created by User on 2017/3/6.
 */
$(function() {
    var $button = $('.button');//点击放入账户按钮
    var $monery = $('.monery');//
    var $phonenumber = $('.phonenumber');//手机号码

    var _monery = sessionStorage.getItem('sumReward');//领取金额
    var _phoneNumber = sessionStorage.getItem('challengerPhone');//获取手机号码
    $monery.html(_monery);
    $phonenumber.html(_phoneNumber);

    function alertBox(tex) {
        var $box = $('.alert_box');
        $('.wrapper').addClass('over');
        $box.show();
        var _html = '';
        var _text = '';
        _html += '<div class="alert_back"></div>' ;
        _text += '<div class="play_box">' +
        '<img src="../../../images/pages/activity/muhammad/close.png" class="closeBox" onclick="closeClick()">' +
        '<div class="sweet_title">温馨提示</div>' +
        '<div class="sweet_play_content">' + tex +'</div>' +
        '<div class="play_button" onclick="closeClick()">确定</div>' +
        '</div>';
        _html += _text;
        _html += '</div>';
        $box.html(_html);
    }
});

function closeClick() {
    $('.wrapper').removeClass('over');
    $('.alert_box').hide();
}
