/**
 * Created by User on 2017/10/18.
 */

$(function() {
    var param = Common.getParam();
    var uid = sessionStorage.getItem('uid') || param.uid;
    var loginToken = sessionStorage.getItem('loginToken') || param.loginToken;

    $.ajax({
        url:Setting.apiRoot1 + '/queryInvestPageInfo.p2p',
        type: 'post',
        dataType: 'json'
    }).done(function(res) {
        if(res.code == 1) {
            var regularList = res.data.regularList.regularListDetail;
            var prodId = '';
            for(var i = 0; i < regularList.length; i++) {
                if(regularList[i].loanCycle == 12) {
                    prodId = regularList[i].prodId;
                }
            }

            if(uid != undefined && uid != null && uid != '') {
                clickRate(prodId);
            }

            var $grateBtn = $('.grate-button');
            $grateBtn.attr({'prodId':prodId});
            $grateBtn.click(function() {
                window.location.href = Setting.staticRoot + '/pages/financing/buy3.0.html?pid=' + prodId;
            });

            $('.grateClose').click(function(){
                $('.grateAlert').hide();
                $('.wrapper').css({'overflow':'auto'});
                clickRate(prodId);
            });

            $('.dark, .button1').click(function() {
                var $dark0 = $('.dark');
                if($dark0.hasClass('dark0')) {
                    if($dark0.hasClass('disabled')) {
                        return false;
                    }
                    $dark0.addClass('disabled');
                    //判断该用户是否已经登录
                    if(uid == undefined || uid == null || uid == '') {
                        Common.toLogin();
                        return false;
                    }

                    var $grateAlert = $('.grateAlert');
                    var $grateBanner = $('.grateBanner');
                    $.ajax({
                        url:Setting.apiRoot1 + '/u/appreciationInReturn/receive.p2p',
                        type: 'post',
                        dataType: 'json',
                        data: {
                            userId:uid,
                            loginToken:loginToken
                        }
                    }).done(function(res) {
                        $dark0.removeClass('disabled');
                        var $wraper = $('.wrapper');
                        if(res.code == 1) {
                            var message = res.message;
                            if(message.indexOf('3%') != -1) {
                                $grateAlert.show();
                                $wraper.css({'overflow':'hidden'});
                                $grateBanner.addClass('banner3');
                            }

                            if(message.indexOf('6%') != -1) {
                                $grateAlert.show();
                                $wraper.css({'overflow':'hidden'});
                                $grateBanner.addClass('banner6');
                            }
                        } else {
                            alert(res.message);
                            return false;
                        }
                    }).fail(function() {
                        $dark0.removeClass('disabled');
                        alert('网络连接失败！');
                        return false;
                    });
                } else {
                    return false;
                }
            });
        }
    }).fail(function() {
        alert('网络连接失败！');
        return false;
    });



    function clickRate(prodId) {
        var $button1 = $('.button1');
        var $dark = $('.dark');
        $.ajax({
            url:Setting.apiRoot1 + '/u/appreciationInReturn/receiveInfo.p2p',
            type: 'post',
            dataType: 'json',
            data: {
                userId:uid,
                loginToken:loginToken
            }
        }).done(function(res) {
            if(res.code == 1) {
                var _data = res.data;
                var couponStatus = _data.couponStatus;
                var rate = _data.rate;
                //该用户还未使用券

                if(couponStatus == 0) {
                    return false;
                }

                if(couponStatus == 1) {
                    if(rate == 3) {
                        $button1.addClass('light');
                        $dark.removeClass('dark0').addClass('dark3l').html('').after('<div class="gButton" prodId="' + prodId + '"></div>');
                    }

                    if(rate == 6) {
                        $button1.addClass('light');
                        $dark.removeClass('dark0').addClass('dark6l').html('').after('<div class="gButton" prodId="' + prodId + '"></div>');
                    }
                } else {
                    if(rate == 3) {
                        $button1.addClass('dark');
                        $dark.removeClass('dark0').addClass('dark3d').html('').after('<div class="gButton" prodId="' + prodId + '"></div>');
                    }

                    if(rate == 6) {
                        $button1.addClass('dark');
                        $dark.removeClass('dark0').addClass('dark6d').html('').after('<div class="gButton" prodId="' + prodId + '"></div>');
                    }
                }

                $('.gButton').click(function() {
                    var pid = $(this).attr('prodId');
                    window.location.href = Setting.staticRoot + '/pages/financing/buy3.0.html?pid=' + pid;
                })
            } else {
                alert(res.message);
                return false;
            }
        }).fail(function() {
            alert('网络连接失败!');
            return false;
        })
    }

    var imgurl = 'http://106.15.44.101/group1/M00/00/15/ag8sZVnnEuKAcfIqAACP_IxZVGc763.jpg';
    var title = 'V粉感恩大回馈';
    var desc = '神秘礼包加息，感恩一路有你';
    var link = Setting.staticRoot + '/pages/active/gratefulness.html';
    share.shareFixed(imgurl, title, desc, link, "888");
});