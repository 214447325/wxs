/**
 * Created by User on 2017/1/19.
 */
$(function() {
    var $dalert = $('.dalert');//弹框背景
    var $div = $('.div');
    var $close = $('.close');//点击关闭按钮
    var param = Common.getParam();
    //获取用户的ID
    var userId = sessionStorage.getItem('uid') || param.uid;
    //获取用户的loginToken
    var loginToken = sessionStorage.getItem('loginToken') || param.loginToken;

    if(!userId){
        Common.toLogin();
        return false;
    }

    $.ajax({
        url: Setting.apiRoot1 + '/activity/u/queryNewYearReward.p2p',
        type: 'post',
        dataType: 'json',
        data: {
            userId: userId,
            loginToken:loginToken
        }
    }).done(function(res) {
        Common.ajaxDataFilter(res, function(res){
            if(res.code == 1) {
                var _data = res.data;
                var _html = '';
                var status = '';
                var text = '';
                var click = '';
                //宝宝摄影和孝心套餐
                var list = _data.list;
                var text1 = '';
                var text2 = '';
                var num = '';
                var centext = '';
                var btntext = '';
                if(list != null && list != undefined) {
                    for(var i = 0; i < list.length; i++) {
                        click = '';
                        if(list[i].rewardType == 4) {
                            text1 = '宝宝摄影套餐';
                            text2 = '（价值868元）';
                            centext = '提交信息后15个工作日内，将有客服联系到店拍摄时间。（1月24日~2月2日春节期间不予预约）';
                            btntext = '查看详情';
                            click = 'onclick="getBaby(' + list[i].rewardType + ')"';

                        }

                        if(list[i].rewardType == 5) {
                            text1 = '孝心体检套餐';
                            text2 = '（价值232元）';
                            num = list[i].rules;
                            centext = '体检套餐仅限50周岁以上人群使用，请于1月31日前完成预约，并于2月28日前完成体检。';
                            btntext = '立即预约';
                            click = 'onclick="getBaby(' + list[i].rewardType + ',' + num + ')"';
                        }
                        _html = _html + '<div class="condiv">' +
                                        '<div class="left">' +
                                        '<div class="ftdiv">' +
                                        '<p>' + text1 + '</p>' +
                                        '<p>' + text2 + '</p>' +
                                        '</div>' +
                                        '</div>' +
                                        '<div class="center">' +
                                        '<div class="erdiv">' +
                                        '<p>' + centext +
                                        '</p>' +
                                        '</div>' +
                                        '</div>' +
                                        '<div class="right">' +
                                        '<div class="htdiv ht1" ' + click + '>' + btntext + '</div>' +
                                        '</div>' +
                                        '</div>';
                    }
                }


                //加息券（天数和全程）
                var rcsList = _data.rcsList;
                if(rcsList != null && rcsList != undefined) {
                    for(var i = 0; i < rcsList.length; i++) {
                        status = '';
                        text = '';
                        click = '';
                        if(rcsList[i].status == 1) {
                            status = 'ht1';
                            text = '立即使用';
                            click = 'onclick="getBaby(' + 0 + ')"'
                        }
                        if(rcsList[i].status == 2) {
                            status = 'ht2';
                            text = '已使用';
                        }
                        _html = _html + '<div class="condiv">' +
                                        '<div class="left">' +
                                        '<div class="ftdiv">' +
                                        '<p>+' + rcsList[i].addRate + '%</p>' +
                                        '<p>' + rcsList[i].couponTitle + '</p>' +
                                        '</div>' +
                                        '</div>' +
                                        '<div class="center">' +
                                        '<div class="erdiv erdiv1">' +
                                        '<p>加息天数：' + rcsList[i].addDays + '</p>' +
                                        '<p>使用产品：' + rcsList[i].fitProds + '</p>' +
                                        '<div class="divp"><p class="p">有效期：' + rcsList[i].validEndTime + '</p>' +
                                        '</div></div>' +
                                        '</div>' +
                                        '<div class="right">' +
                                        '<div class="htdiv ' + status + '" '+ click +'>' + text + '</div>' +
                                        '</div>' +
                                        '</div>';
                    }
                }


                //红包
                var cashReds = _data.cashReds;
                if(cashReds != null && cashReds != undefined) {
                    for(var i = 0; i < cashReds.length; i++) {
                        text1 = '';
                        status = '';
                        text = '';
                        click = '';
                        click = 'onclick="getBaby(' + cashReds[i].rewardType + ',' + cashReds[i].rewardId + ', ' + i + ')"';
                        if(cashReds[i].rewardType == 3) {
                            text1 = '¥200元';
                            if(cashReds[i].status == 1) {
                                status = 'ht3';
                                text = '提取至余额';
                            }
                            if(cashReds[i].status == 2) {
                                status = 'ht2';
                                text = '已使用';
                            }
                        }

                        if(cashReds[i].rewardType == 6) {
                            text1 = '¥28元';
                            if(cashReds[i].status == 1) {
                                status = 'ht3';
                                text = '提取至余额';
                            }
                            if(cashReds[i].status == 2) {
                                status = 'ht2';
                                text = '已领取';
                            }
                        }

                        _html = _html + '<div class="condiv">' +
                                        '<div class="left">' +
                                        '<div class="ftdiv">' +
                                        '<p>' + text1 + '</p>' +
                                        '<p>现金红包</p>' +
                                        '</div>' +
                                        '</div>' +
                                        '<div class="center">' +
                                        '<div class="erdiv erdiv2">' +
                                        '<p>使用规则：可立即提现</p>' +
                                        '</div>' +
                                        '</div>' +
                                        '<div class="right">' +
                                        '<div class="htdiv ' + status + ' btu' + i + '" ' + click + '>' + text + '</div>' +
                                        '</div>' +
                                        '</div>';
                    }
                }

                $('.content').html(_html);
            } else {
                $('.dalert').show();
                $('.div4').show();
                $('.dal').html(res.message);
                //alert(res.message)
            }
        });
    });

    //点击关闭按钮
    $close.click(function() {
        $div.hide();
        $dalert.hide();
    });

    $('.bton').click(function() {
        $('.div').hide();
        $dalert.hide();
    });

});

//点击按钮进行判断
function getBaby(number, num, count) {
    var param = Common.getParam();
    //获取用户的ID
    var userId = sessionStorage.getItem('uid') || param.uid;
    //获取用户的loginToken
    var loginToken = sessionStorage.getItem('loginToken') || param.loginToken;
    var $dalert = $('.dalert');//弹框背景
    var $div3 = $('.div3');//宝宝套餐的弹框
    var $div = $('.div');
    /**
     * number :
     * 0：天数或者全程加息券
     * 3:200元现金红包（num为ID）
     * 4：宝宝摄影套餐
     * 5：孝心体验套餐(num为预定码)
     * 6:28元红包（num为ID）
     *
     */
    if(number == 0) {
        window.location.href = '../../../pages/financing/regular.html';
    }
    if(number == 4) {
        $dalert.show();
        $div3.show();
        $('.reward').html('宝宝摄影套餐（价值868元）');
        $('.divtent').html('客服人员将在2017年2月3日后的十个工作内，按先后获奖的顺序电话联系您，确定预约信息');
        $('.button').click(function() {
            $div.hide();
            $dalert.hide();
        });
    }
    if(number == 5) {
        $dalert.show();
        $('.div5').show();
        $('.blereward').html('<a>' + num + '</a>');
        $('.blebutn').click(function() {
            window.location.href = 'http://t.cn/RMT0EHQ';
        });
    }
    if(number == 3 || number == 6) {
        $.ajax({
            url: Setting.apiRoot1 + '/activity/u/extractActionReward.p2p',
            type: 'post',
            dataType: 'json',
            data: {
                userId: userId,
                rewardId: num,
                loginToken:loginToken
            }
        }).done(function(res) {
            Common.ajaxDataFilter(res, function(res){
                var $btu = $('.btu' + count);
                if(res.code == 1) {
                    $('.dalert').show();
                    $('.div6').show();
                    $('.logindal').html('提现成功');
                    $('.loginbtn').click(function() {
                        $div.hide();
                        $dalert.hide();
                    });

                    if($btu.hasClass('ht3')) {
                        $btu.removeClass('ht3').addClass('ht2');
                        $('.ht2').html('已领取');
                    }
                } else {
                    $('.dalert').show();
                    $('.div6').show();
                    $('.logindal').html(res.message);
                    $('.loginbtn').click(function() {
                        $div.hide();
                        $dalert.hide();
                    });
                }
            });
        }).fail(function(){
            $('.dalert').show();
            $('.div4').show();
            $('.dal').html('网络链接失败，请刷新重试！');
            //alert('网络链接失败，请刷新重试！');
            return false;
        });
    }
}