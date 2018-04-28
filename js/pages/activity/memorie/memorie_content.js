/**
 * Created by User on 2017/2/7.
 */
$(function() {
    var param = Common.getParam();
    var phone = param.phone;
    var userId = sessionStorage.getItem('uid') ||param.userId;
    var loginToken = sessionStorage.getItem('loginToken') || param.loginToken;
    if(!userId){
        Common.toLogin();
        return false;
    }
    var mySwiper = new Swiper('.swiper-container',{
        nextButton:'.swiper-button-next',
        onInit: function(swiper) {

            //书的左面
            $.ajax({
                url: Setting.apiRoot1 + '/u/VDiaryLogin.p2p',
                type: 'post',
                dataType: 'json',
                data: {
                    userId: userId,
                    loginToken : loginToken
                }
            }).done(function(res) {
                if(res.code == 1 || res.code == 0) {
                    var _html = '';
                    var _text = '';
                   var _data = res.data[0];
                    if(res.code == 0) {
                        _text = '<div class="box_content no_left">' +
                                '2016年，我还没在V星球最好的理财平台投资过呢...' +
                                '</div>'
                    } else {
                        _text =  '<div class="content_title">' + _data.investmentTime + '</div>' +
                                '<div class="box_content">' +
                                '今天我把攒下的<a class="font"> ' + parseFloat(_data.amount) +' 元</a>私房钱投在V星球最好的理财平台—V金融！嘿嘿，坐等收钱咯！' +
                                '</div>'
                    }
                    _html = '<div class="box_content_right">' +
                            '<div class="content_title">' + _data.createTime + '</div>' +
                            '<div class="box_content">' +
                            '今天是我移民到V星球的第一天，听说这里是淘金者的天堂。Money，money，等我哟~' +
                            '</div>' +
                            '<div class="content_img">' +
                            '<div class="img img1"></div>' +
                            '</div>' +
                            _text +
                            '<div class="content_img">' +
                            '<div class="img img2"></div>' +
                            '</div>' +
                            '</div>';
                    $('.book_content1').html(_html);
                } else {
                    window.location.href = '../../../pages/active/memorie/memorie_log.html';
                    return false
                }
            });
            //    .fail(function(){
            //    alert('网络链接失败，请刷新重试！');
            //    return false;
            //});

            //书的右边
            $.ajax({
                url: Setting.apiRoot1 + '/u/VDiaryInterface.p2p',
                type: 'post',
                dataType: 'json',
                data: {
                    userId: userId,
                    loginToken : loginToken
                }
            }).done(function(res) {
                if(res.code == 1) {
                    var _html = '';
                    var _txt = '';
                    var _divText = '';
                    var _data = res.data;
                    var vAmount = parseFloat(_data.vAmount);
                    var redAmount = parseFloat(_data.redAmount);
                    var createTime = _data.createTime;
                    if(createTime == null || createTime == '' || createTime == undefined) {
                        _divText = '<div class="box_content no_right">' +
                                    '还未收获来到V星球的第一桶金，少赚了好多，555' +
                                    '</div>';
                    } else {
                        _divText =  '<div class="content_title">' + _data.createTime + '</div>' +
                                    '<div class="box_content">' +
                                    '今天终于收获了来到V星球的第一桶金，居然有<a class="font">' + parseFloat(_data.amount) + '元</a>！看来晚上我可以好好犒劳自己一顿了……' +
                                    '</div>'

                    }

                    if(vAmount == 0 && redAmount == 0) {
                        _txt = '居然错过了那么多~';
                    } else {
                        _txt = '居然白白赚了这么多钱！看来今夜做梦也会笑啦~';
                    }
                    _html =  _divText +
                            '<div class="content_img content_img1">' +
                            '<div class="img img3"></div>' +
                            '<div class="img img4"></div>' +
                            '</div>' +
                            '<div class="content_title">2016-12-31</div>' +
                            '<div class="box_content">' +
                            '今天心血来潮，算了一下大转盘累计抽奖的钱有<a class="font">' + vAmount + '元</a>，还有送的活动红包也有<a class="font">' + redAmount + '元</a>！' + _txt +
                            '</div>' ;
                    $('.box_content_left').html(_html);
                }

            }).fail(function(){
                    alert('网络链接失败，请刷新重试！');
                    return false;
            });
        },
        onSlideChangeStart: function(swiper){
            if (swiper.activeIndex == 1) {
                $('.button-next').removeClass('swiper-button-next');
            } else {
                $('.button-next').addClass('swiper-button-next');
            }
        }
    });

    $('.piece').click(function() {
        window.location.href = '../../../pages/active/memorie/memorie_detail.html?userId=' + userId;
    });
});