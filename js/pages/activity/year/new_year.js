/**
 * Created by User on 2017/1/18.
 */
$(function() {
    var windowHeight = $(window).height();
    var $investment = $('.investment');
    var $dial = $('.dial');
    var $stage = $('.stage', $dial);
    //背景弹框
    var $dalert = $('.dalert');
    $('.wrapper').scroll(function() {
        var wraHeight = $(this).scrollTop();
        if(wraHeight > windowHeight) {
            $investment.show();
        } else {
            $investment.hide();
        }
    });

    //点击立即投资按钮
    $investment.click(function() {
        window.location.href = '../../../pages/financing/regular.html';
    });

    //点击关闭按钮
    $('.close').click(function(){
        $('.div').hide();
        $dalert.hide();
    });

    $('.bton').click(function() {
        $('.div').hide();
        $dalert.hide();
    });

    //点击孝心体验套餐
    $('.piety').click(function() {
        $dalert.show();
        $('.div2').show();
    });

    //点击宝宝套餐
    $('.baby').click(function() {
        $dalert.show();
        $('.div1').show();
    });

    var _html = '';
    var cdeg = 0;
    for(var i = 0; i < 6; i++) {
        _html = _html + '<div class="col col-1">' +
        '<img style="width: 3.5rem" src="../../../images/pages/activity/year/'+ i +'.png" alt="" />' +
        '</div>'
        ;
    }

    $('.price').html(_html);

    /**
     * 转动转盘
     * @param  {[type]}   deg      [description]
     * @param  {Function} callback [description]
     * @return {[type]}            [description]
     */
    function rotateDial(deg, callback){
        var d = deg + (Math.random() * 15) * (Math.ceil(Math.random() * 10) > 4.5 ? 1 : -1);
        cdeg += 12 * 360 - d;
        TweenMax.to($stage.find('.price'), 5, {
            ease: Quint.easeInOut,
            css: {
                rotation: cdeg
            },
            onComplete: function(){
                // 矫正圆周
                cdeg += d;
                callback();
            }
        });
    }

    var param = Common.getParam();
    //获取用户的ID
    var userId = sessionStorage.getItem('uid') || param.uid;
    //获取用户的loginToken
    var loginToken = sessionStorage.getItem('loginToken') || param.loginToken;

    $.ajax({
        url: Setting.apiRoot1 + '/activity/u/rewardDetail.p2p',
        type: 'post',
        dataType: 'json',
        data: {
            userId: userId,
            loginToken:loginToken
        }
    }).done(function(res) {
        if(res.code == 1) {
            if(res.data == 0) {
                $('.start').addClass('disabled');
                $('.span').html(0);
                //弹提示框
                // $('.dalert').show();
                // $('.div4').show();
                // $('.dal').html('投资8周及以上定期单笔金额≥5000元，即可获得一次抽奖机会！多笔投资即可获得多次抽奖机会哦！');
                sessionStorage.setItem('caccount', 0);
            } else {
                $('.span').html(res.data);
                sessionStorage.setItem('caccount', res.data);
            }
        } else {
            $('.start').addClass('disabled');
            // $('.dalert').show();
            // $('.div5').show();
            // $('.logindal').html('请先登录');
            // $('.loginbtn').click(function() {
            //     window.location.href = '../../../pages/account/login.html';
            // });
        }
    }).fail(function(){
        $('.dalert').show();
        $('.div4').show();
        $('.dal').html('网络链接失败，请刷新重试！');
        return false;
    });



    function IOSJS(jsonStr, url){
        messagingIframe.src = "ios://"+url+"?jsonStr=" + jsonStr;
    }

    //点击我的奖励中心进行页面的跳转
    $('.mybtn').click(function(){
        window.location.href = '../../../pages/active/year/reward_center.html?uid=' + userId + '&loginToken=' + loginToken;
    });

    //点击转盘
    $('.start').click(function() {
        var $this = $(this);
        var count = sessionStorage.getItem('caccount');
        console.log(count);
        if (userId==undefined || userId==null || loginToken==undefined || loginToken==null) {
                $('.dalert').show();
                $('.div5').show();
                $('.logindal').html('请先登录');
                $('.loginbtn').click(function() {
                    window.location.href = '../../../pages/account/login.html';
                });     
                return false;       
        }

        if(count == 0 || count == null) {
            $('.dalert').show();
            $('.div4').show();
            $('.dal').html('投资8周及以上定期单笔金额≥5000元，即可获得一次抽奖机会！多笔投资即可获得多次抽奖机会哦！');
            return false;
        }

        if($this.hasClass('disabled')){
            return false;
        }

        $this.addClass('disabled');
        $.ajax({
            url: Setting.apiRoot1 + '/activity/u/dialReward.p2p',
            type: 'post',
            dataType: 'json',
            data: {
                userId: userId,
                loginToken:loginToken
            }
        }).done(function(res){
            if(res.code != 1){
                $('.dalert').show();
                $('.div4').show();
                $('.dal').html(res.message);
                $this.removeClass('disabled');
                return false;
            }

            if(count > 0 ) {
                count = count-1;
                $('.span').html(count);
                sessionStorage.setItem('caccount', count);
            } else {
                sessionStorage.setItem('caccount', 0);
                return false;
            }

            var rt = res.data.rewardType;
            var angle = (rt*60)-60;
            rotateDial(angle, function(){
                $dalert.show().find('.div3').show();
                var $reward = $('.reward');//标题
                var $divtent = $('.divtent');//内容
                var $button = $('.button');//按钮
                var url = '../../../pages/financing/regular.html';
                switch (rt) {
                    case 1:{
                        $reward.html(res.data.remark1 + res.data.remark2);
                        $divtent.html('加息券已放至“账户-超值礼券-加息券”，请于有效期内使用');
                        $button.html('立即使用').click(function() {
                            window.location.href = url;
                        });
                        break;
                    }
                    case 2: {
                        $reward.html(res.data.remark1);
                        $divtent.html('加息券已放至“账户-超值礼券-加息券”，请于有效期内使用');
                        $button.html('立即使用').click(function() {
                            window.location.href = url;
                        });
                        break;
                    }
                    case 3: {
                        $reward.html('200元现金红包');
                        $divtent.html('现金已释放至账户余额，可在“账户-现金奖励”查看详情');
                        $button.html('立即查看').click(function() {
                            window.location.href = '../../../pages/active/year/reward_center.html?uid=' + userId + '&loginToken=' + loginToken;
                        });
                        break;
                    }
                    case 4: {
                        $reward.html('宝宝摄影套餐（价值868元）');
                        $divtent.html('客服人员将在2017年2月3日后的十个工作日内，按获奖的先后顺序电话联系您，确定预约信息。 ');
                        $button.html('确定').click(function() {
                            $('.div').hide();
                            $dalert.hide();
                        });
                        break;
                    }
                    case 5: {
                        $reward.html('孝心体检套餐（价值235元）');
                        $divtent.html('体检套餐仅限50周岁以上人群使用，请于1月31日前完成预约，并于2月28日前完成体检。预约券码：' + '<a>' + res.data.remark1 + '</a>');
                        $button.html('立即预约').click(function() {
                            window.location.href = 'http://t.cn/RMT0EHQ';
                        });
                        break;
                    }
                    case 6: {
                        $reward.html('28元现金红包');
                        $divtent.html('现金已释放至账户余额，可在“账户-现金奖励”查看详情');
                        $button.html('立即查看').click(function() {
                            window.location.href = '../../../pages/active/year/reward_center.html?uid=' + userId + '&loginToken=' + loginToken;
                        });
                        break;
                    }
                }
                $this.removeClass('disabled');
            });
        }).fail(function(){
            $('.dalert').show();
            $('.div4').show();
            $('.dal').html('网络链接失败，请刷新重试！');
            $this.removeClass('disabled');
            return false;
        });
    });
});