/**
 * Created by User on 2017/6/1.
 */
$(function() {
    var $alert = $('.vside-ul-li7');//点击活动细则的按钮
    var $alertBox = $('.valert-box');//弹框
    var $close = $('.close');//点击关闭按钮
    var $liclick = $('.liclick');//点击侧边栏的按钮
    var $receive = $('.li-click');//点击立即领取按钮

    var param = Common.getParam();
    var sharePostId = param.sharePostId;
    var userId = '';
    var loginToken = '';
    if(sharePostId == 1) {
        userId = sessionStorage.getItem('uid');
        loginToken = sessionStorage.getItem('loginToken');
    } else {
        userId = sessionStorage.getItem('uid') || param.uid;
        loginToken = sessionStorage.getItem('loginToken') || param.loginToken;
    }
    //点击活动细则
    $alert.click(function() {
        $alertBox.show();
        $('.wrapper').css({'overflow':'hidden'});
    });

    //点击关闭按钮
    $close.click(function() {
        $alertBox.hide();
        $('.wrapper').css({'overflow':'auto'});
    });

    $liclick.click(function() {
        $liclick.css({'width':'1.8rem','height': '0.8rem'}).html('').addClass('discroller');
        //图片放大并且加边框
        $(this).css({'width':'2rem','height': '1rem'}).html('<img src="../../images/pages/activity/v-select.png"/>');
        var _value = $(this).attr('ng-value');
        //按钮跳转
        window.location.href = '#box' + _value;
    });

    $liclick.css({'width':'1.8rem','height': '0.8rem'}).html('');
    $('.vside-ul-li1').css({'width':'2rem','height': '1rem'}).html('<img src="../../images/pages/activity/v-select.png"/>');


    $('.wrapper').scroll(function() {
        if($liclick.hasClass('discroller')) {
            $liclick.removeClass('discroller');
            return false;
        }

        //滚动条滚动的距离
        $.each($('.scroll'), function(i, n) {
            var a = i + 1;
            var _top = $('#box' + a).offset().top;
            $liclick.css({'width':'1.8rem','height': '0.8rem'}).html('');
            if(_top > 0) {
                $('.vside-ul-li' + a).css({'width':'2rem','height': '1rem'}).html('<img src="../../images/pages/activity/v-select.png"/>');
                return false;
            }
        });
    });

    //立即领取
    $receive.click(function() {
        if(!userId){
            Common.toLogin();
            return false;
        }

        var _ngValue = $(this).attr('ng-value');
        $.ajax({
            url: Setting.apiRoot1 + '/u/vholiday.p2p',
            type: 'post',
            dataType: 'json',
            data : {
                userId: userId,
                type: _ngValue,
                loginToken: loginToken
            }
        }).done(function(res){
            alert(res.message);
        }).fail(function() {
            alert('网络连接失败！');
        });
    });

    $('.aclick').click(function() {
        var _href = $(this).attr('ng-value');
        if(userId == undefined || userId == '' || userId == null) {
            userId = '';
        }

        if(loginToken == undefined || loginToken == '' || loginToken == null) {
            loginToken = '';
        }
        window.location.href = _href + '?uid=' + userId + '&loginToken=' + loginToken;
    });

    //活动分享
    var imgurl = 'http://106.15.44.101/group1/M00/00/0F/ag8sZVk6YzWAAWJhAACXi3NYKgM378.jpg';
    var title = 'V利节，给钱不手软';
    var desc = '现金不设限，5.18%全程加息、518元返现…统统是你的！';
    var link = 'https://static.wdclc.cn/wx/pages/active/vwelfare.html';
    share.shareFixed(imgurl, title, desc, link, "888");
});