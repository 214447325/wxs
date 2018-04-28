/**
 * Created by User on 2017/2/8.
 */
$(function() {
    var param = Common.getParam();
    var userId = sessionStorage.getItem('uid') || param.userId;
    var loginToken = sessionStorage.getItem('loginToken') || param.loginToken;
    //if(!userId){
    //    Common.toLogin();
    //    return false;
    //}
    var mySwiper = new Swiper('.swiper-container',{
        nextButton:'.swiper-button-next',
        onInit: function(swiper) {
            $.ajax({
                url: Setting.apiRoot1 + '/u/myAccountBill.p2p',
                type: 'post',
                dataType: 'json',
                data: {
                    userId: userId,
                    loginToken : loginToken
                }
            }).done(function(res) {
                /**
                 * registTime:注册时间
                 * map1:首投金额和时间
                 * map2:累计投资金额
                 * map3:累计收益总额
                 * map4:周周涨投资次数
                 * map5:定期投资次数
                 * map6:浮动投资次数
                 * map7:年化收益率
                 */

                if(res.code == 1) {
                    var _map = res.data.data;
                    var registTime = res.data.registTime;
                    var _html = '';
                    //添加注册时间
                    _html = _html + '<div class="bill_div">' +
                                    '<div class="bill_left">注册时间</div>' +
                                    '<div class="bill_right font"><span class="p">' + registTime + '</span></div>' +
                                    '</div>';

                    if(_map != null && _map != '' && _map != undefined && JSON.stringify(_map) != '{}') {
                        //首投时间+金额
                        if(_map.map1 != null && _map.map1 != '' && _map.map1 != undefined) {
                            _html = _html + '<div class="bill_div">' +
                                            '<div class="bill_left">首投时间/金额</div>' +
                                            '<div class="bill_right">' +
                                            '<a class="font"><span class="p">' + _map.map1.firstInvestTime + '</span>投资了</a><a class="font"><span class="p">' + parseFloat(_map.map1.firstInvestAmt) + '</span>元</a></div>' +
                                            '</div>';
                        }

                        //累计投资金额
                        if(_map.map2 != null && _map.map2 != '' && _map.map2 != undefined) {
                            _html = _html + '<div class="bill_div">' +
                                            '<div class="bill_left">累计投资金额</div>' +
                                            '<div class="bill_right font"><span class="p">' + parseFloat(_map.map2.totalInvestAmt) + '</span>元</div>' +
                                            '</div>';
                        }

                        //累计收益总额
                        if(_map.map3 != null && _map.map3 != '' && _map.map3 != undefined) {
                            _html = _html + '<div class="bill_div">' +
                                            '<div class="bill_left">累计收益总额</div>' +
                                            '<div class="bill_right font"><span class="p">' + parseFloat(_map.map3.totalGetAmt) + '</span>元</div>' +
                                            '</div>';
                        }

                        //周周涨投资次数
                        if(_map.map4 != null && _map.map4 != '' && _map.map4 != undefined) {
                            _html = _html + '<div class="bill_div">' +
                                            '<div class="bill_left">周周涨投资次数</div>' +
                                            '<div class="bill_right font"><span class="p">' + _map.map4.curCount + '</span>次</div>' +
                                            '</div>';
                        }

                        //定期投资次数
                        if(_map.map5 != null && _map.map5 != '' && _map.map5 != undefined) {
                            var _text = '';
                            var list = _map.map5;
                            _html = _html + '<div class="bill_div">' +
                                            '<div class="bill_left">定期投资次数</div>';
                            for(var i = 0; i < list.length; i++) {
                                _text = _text + '<div class="bill_right font"><span class="p">' + list[i].loanCycle + '</span>周定期投资了<span class="p">' + list[i].count + '</span>次</div>';
                            }
                            _html = _html + _text + '</div>';
                        }

                        //浮动投资次数
                        if(_map.map6 != null && _map.map6 != '' && _map.map6 != undefined) {
                            _html = _html + '<div class="bill_div bill_end">' +
                                            '<div class="bill_left">浮动收益投资次数</div>' +
                                            '<div class="bill_right font"><span class="p">' + _map.map6.floatCount + '</span>次</div>' +
                                            '</div>';
                        }

                        //年化收益率
                        //if(_map.map7 != null && _map.map7 != '' && _map.map7 != undefined) {
                        //    _html = _html + '<div class="bill_div bill_end">' +
                        //                    '<div class="bill_left">平均年化收益率为</div>' +
                        //                    '<div class="bill_right font"><span class="p">' + parseFloat(_map.map7.rate)*100 + '</span>%</div>' +
                        //                    '</div>';
                        //}

                    } else {

                        _html = _html + '<div class="bill_div bill_no_data">2016年里还没有投资过任何产品哦~</div>';
                    }
                    $('.bill').html(_html);
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

    $('.note_button').click(function() {
        window.location.href = '../../../pages/active/memorie/memorie_phone.html?userId=' + userId;
    });
});