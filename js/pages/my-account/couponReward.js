/**
 * Created by User on 2016/11/2.
 */

$(function() {
    var $button = $('.button1');//点击立即领取按钮
    var userId = sessionStorage.getItem('uid');//获取用户的ID
    var loginToken = sessionStorage.getItem('loginToken');
    var rewardList = '';
    var formData = {};

    //userId =55685;
    //loginToken ='940a793422d4e8a03a171b9bde50bfbd';

    if(!userId){
        Common.toLogin();
        return false;
    }

    formData.userId = userId;
    formData.loginToken = loginToken;


    $.ajax({
        url: Setting.apiRoot1 + '/u/getMyRateCouponRewardAmt.p2p',
        type: 'post',
        dataType: 'json',
        data: formData
    }).done(function(res){
        if(res.code == 1) {
            rewardList = res.data.rewardResultList;
            var _html = '';
            for(var i = 0; i < rewardList.length; i++) {
                var userTime = rewardList[i].useTime;
                var _div = '';
                if(rewardList[i].noGetAmt <= 0) {
                    _html = _html + '<div class="reward reward2">';
                    _div =  '<div class="div2">' +
                            '<div class="icon icon1"></div>' +
                            '<div class="btn1 button2"></div>' +
                            '</div>' +
                            '</div>';
                } else {
                    _html = _html + '<div class="reward reward1 ra'+ rewardList[i].opId +'">';
                    _div =  '<div class="div2">' +
                            '<div class="icon icon1"></div>' +
                            '<div class="btn1 button1" onclick="clickRate('+ rewardList[i].opId +')"></div>' +
                            '</div>' +
                            '</div>';
                }
                _html =  _html + '<div class="div1">' +
                        '<div class="rdiv1">' +
                        '<div class="rdiv1Content">加息:<span class="add1">+'+ rewardList[i].addRate +'%</span></div>' +
                        '<div class="rdiv1Content">使用的产品:<span class="pro">'+ rewardList[i].prodTitle + '</span></div>' +
                        '<div class="rdiv1Content">加息天数:<span class="day">'+ rewardList[i].addDays +'</span></div>' +
                        '</div>' +
                        '</div>' +
                        '<div class="div1">' +
                        '<div class="rdiv1">' +
                        '<div class="rdiv1Content">已领取:<span class="receive">'+ rewardList[i].getAwardAmt+'</span>元</div>' +
                        '<div class="rdiv1Content">使用时间:<span class="time">' + userTime +'</span></div>'+
                        '<div class="rdiv1Content">奖励(元):<span class="money">' + rewardList[i].noGetAmt + '</span></div>' +
                        '</div>' +
                        '</div>' +
                         _div
            }
            $('.content').html(_html);
        } else {
            alert(res.message);
        }

    }).fail(function(){
        alert('网络链接失败');
        return false;
    });

    ////点击领取按钮开始洒金币
    //$button.click(function() {
    //    if(!($(this).hasClass('bt'))){
    //        //启动金币下落
    //        Timerr = setInterval(aa,200);
    //        $('.bg').show();
    //        $(".div").removeClass("bg_2").addClass("bg_1");
    //        //图片替换
    //        var $parent = $(this).parent().parent();
    //        $parent.removeClass('reward1').addClass('reward2');
    //        $(this).addClass('bt');
    //        //时间控制金币下落结束
    //        setTimeout(function(){
    //            clearInterval(Timerr,20);
    //            $(".div").removeClass("bg_1");
    //            $('.bg').hide();
    //        },5000);
    //    }
    //});
    //
    //$('.button2').click(function() {
    //    alert('A')
    //});
});


function clickRate(opId) {
    var userId = sessionStorage.getItem('uid');//获取用户的ID
    var loginToken = sessionStorage.getItem('loginToken');
        //userId =52711;
        //loginToken ='6ac798bde1c4d76f010658885961292f';
    var $parent = $('.ra' + opId);
    if(!($parent.hasClass('bt'))) {
        var formData = {};
        formData.userId = userId;
        formData.loginToken = loginToken;
        formData.opId = opId;
        //发送请求
        $.ajax({
            url: Setting.apiRoot1 + '/u/extractMyCouponReward.p2p',
            type: 'post',
            dataType: 'json',
            data: formData
        }).done(function(res){
            //console.log(JSON.stringify(res))
            if(res.code==1){
                Timerr = setInterval(aa,200);
                $('.bg').show();
                $(".div").removeClass("bg_2").addClass("bg_1");
                //图片替换
                $parent.removeClass('reward1').addClass('reward2');
                $parent.addClass('bt');
                //时间控制金币下落结束
                setTimeout(function(){
                    clearInterval(Timerr,20);
                    $(".div").removeClass("bg_1");
                    $('.bg').hide();
                },2500);
            }else{
                alert(res.message);
                return false;
            }
        }).fail(function(){
            alert('网络链接失败');
            $this.removeClass('disabled');
            return false;
        });
    }
}