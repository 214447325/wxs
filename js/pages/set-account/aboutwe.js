/**
 * Created by User on 2018/1/17.
 */
$(function() {

    $('.aservice').click(function() {
        var _html = '';
        _html = _html + '<div class="about-box">';
        _html = _html + '<div class="about-background"></div>';
        _html = _html + '<div class="about-div">';
        _html = _html + '<div>';
        _html = _html + '<div><a href="tel:4000-521-388" style="color: #0076FF" class="call">4000-521-388</a></div>';
        _html = _html + '<div>在线服务时间:9:00-21:00</div>';
        _html = _html + '</div>';
        _html = _html + '<a class="aboutbtn" href="javascript:;">取消</a>';
        _html = _html + '</div>';
        _html = _html + '</div>';
        $('body').append(_html);
        $('.about-div').animate({
            bottom:0
        },'slow');

        $('.aboutbtn').click(function() {
            $('.about-div').animate({
                bottom:'-5.1rem'
            },'slow',function() {
                $('.about-box').remove();
            });
        })
    })
});