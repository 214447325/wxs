/**
 * Created by User on 2016/12/29.
 * , '神秘红包'（神秘红包）
 */
$(function () {
    // var text = ['天数加息券', '全程加息券', '邀请好友', '体验金', '投资红包', '现金红包'];
    var text = ['全程加息券', '投资红包', '现金红包'];
    for (var i = 0; i < text.length; i++) {
        var _html = '<div class="button" onclick="getPage(' + i + ')">' +
            '<div class="div1">' +
            '<img src="../../images/pages/my-account3.0/icon' + i + '.png" class="img">' +
            ' </div>' +
            '<div class="div2">' + text[i] +
            '</div>' +
            '</div>';
        $('.vip' + i).html(_html);
    }
    var param = Common.getParam();
    var num = param.num;
    if (num == null || num == undefined || null == '') {
        num = 0;
    }
    var swiper = new Swiper('.swiper-container', {
        autoplayDisableOnInteraction: false,
        grabCursor: true,
        slidesPerView: 4,
        slidesPerGroup: 4,
        history: 'love',
        initialSlide: num,
        paginationClickable: true,
        mousewheelControl: false
    });
    $('.vip' + num).css({'opacity': '10'});

});
//(神秘红包) 'rights-mysterious.html?num=6'
function getPage(number) {
    // var url = ['rights-temporary.html?num=0', 'rights-full.html?num=1', 'rights-invite.html?num=2', 'rights-gold.html?num=3',
    //     'rights-investment.html?num=4', 'rights-cashred.html?num=5'];
    var url = ['rights-full.html?num=0', 'rights-investment.html?num=1', 'rights-cashred.html?num=2'];
    window.location.href = '../../pages/my-account/' + url[number];
}