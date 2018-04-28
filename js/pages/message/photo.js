/**
 * Created by User on 2017/5/10.
 */
$(function () {
    var _html = '';
    var _url = '';
    var $wrapper = $('.wrapper');
    _html = _html + '<div class="photo">' +
    '<div class="photo_background"></div>' +
    '<img src=' + _url + ' class="photo_img" id="postImg">' +
    '</div>';
    $wrapper.append(_html);
    //点击图片，图片放大
    mui("body").on('tap', '.postImage', function () {
        $('.photo').show();
        var _url = this.getAttribute('src');
        var postImg = document.getElementById('postImg');
        postImg.setAttribute('src', _url);
    });
    $('.photo').click(function () {
        $('.photo').hide();
    });
});