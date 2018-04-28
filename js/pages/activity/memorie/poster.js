/**
 * Created by User on 2017/2/8.
 */
$(function() {
    var param = Common.getParam();
    var pageNum = param.posterNum;
    var photoNumber = '';
    var pageIndex = 0;
    var userId = sessionStorage.getItem('uid') || param.userId;
    var loginToken = sessionStorage.getItem('loginToken') || param.loginToken;
    if(!userId){
        Common.toLogin();
        return false;
    }
    var $input = $('input[name=monery]');
    var _interestAmt;//赚的钱
    var _registTime ;
    var status = 1;//明文
    if(pageNum) {
        pageIndex = pageNum;
    }
    var mySwiper = new Swiper('.swiper-container',{
        initialSlide:pageIndex,
        prevButton:'.swiper-button-prev',
        nextButton:'.swiper-button-next',
        onInit: function(swiper) {
            photoNumber = swiper.activeIndex;
            $.ajax({
                url: Setting.apiRoot1 + '/u/getImgData.p2p',
                type: 'post',
                dataType: 'json',
                data: {
                    userId: userId,
                    loginToken : loginToken
                }
            }).done(function(res) {
                if(res.code == 1) {
                    var _data = res.data;
                    _registTime = _data.registTime;
                    $('.text').html(_registTime);
                    _interestAmt = _data.interestAmt;
                    $('.font_text').html(parseFloat(_interestAmt));
                    $('.number').val(parseFloat(_data.rich));
                }
                if(res.code == -99) {
                    var _time = res.data.registTime;
                    var _html = '<div class="poster_nodata">' +
                                '<div class="poster_div">' +
                                '<div class="poster_content">' +
                                '<div>2016年还没有与V金融相遇</div>' +
                                '<div>' + _time + '才加入V金融</div>' +
                                '<div>......</div>' +
                                '<div>2066年，投资不多，也就5个亿</div>' +
                                '</div>' +
                                '<div class="code">' +
                                '<div class="code_img">' +
                                '<img src="../../../images/pages/activity/memorie/memorie.png" class="codeImg">' +
                                '</div>' +
                                '<div class="code_img_text">扫一扫，生成我的海报</div>' +
                                '</div>' +
                                '</div>' +
                                '</div>';

                    $('.poster_box').html(_html);
                }
            }).fail(function(){
                alert('网络链接失败，请刷新重试！');
                return false;
            });
            if(photoNumber == 0) {
                $('.button-prev').removeClass('swiper-button-prev');
            } else {
                $('.button-prev').addClass('swiper-button-prev');
            }

            if(photoNumber == 3) {
                $('.button-next').removeClass('swiper-button-next');
            } else {
                $('.button-next').addClass('swiper-button-next');
            }
        },
        onSlideChangeStart: function(swiper){
            photoNumber = swiper.activeIndex;
            if(photoNumber == 0) {
                $('.button-prev').removeClass('swiper-button-prev');
            } else {
                $('.button-prev').addClass('swiper-button-prev');
            }

            if(photoNumber == 3) {
                $('.button-next').removeClass('swiper-button-next');
            } else {
                $('.button-next').addClass('swiper-button-next');
            }
        }
    });

    //点击明文或者是密文
    $('.img').click(function() {
        var $poster = $('.poster_text');
        var $eye = $poster.find('.img');
        var $text = $poster.find('.font_text');
        if($eye.hasClass('eye0')) {
            $('.img').attr({'src': '../../../images/pages/activity/memorie/clear.png'});
            $text.html(_interestAmt);
            $eye.removeClass('eye0');
            status = 1;
        } else {
            $('.img').attr({'src': '../../../images/pages/activity/memorie/cipher.png'});
            $text.html('******');
            $eye.addClass('eye0');
            status = 0;
        }
    });

    var $number = $('.number');
    //var $posterAlert = $('.poster_alert');//弹框
    //var $button = $('.divbtn');//点击确定按钮
    $number.on('input change', function(e) {
        var _input = $.trim($('.change' + photoNumber).val());

        if(isNaN(_input) || _input == null || _input == ''){
            $number.val('');
            return false;
        }
        $number.val(_input);
    });

    //点击海报预览按钮
    $('.poster').click(function() {
        var _input = $.trim($number.val());//财富值
        if(_input == null || _input == '' || _input == undefined) {
            _input = 0;
        }

        if(_interestAmt == null || _interestAmt == '' || _interestAmt == undefined) {
            _interestAmt = 0;
        }
        window.location.href = '../../../pages/active/memorie/modify_poster.html?posterNum=' + photoNumber + '&userId=' + userId + '&rich=' + _input + '&interestAmt=' + _interestAmt + '&status=' + status;
    });
});
