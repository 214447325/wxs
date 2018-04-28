/**
 * Created by User on 2017/2/9.
 */
$(function() {
    var param = Common.getParam();
    var number = parseInt(param.posterNum);
    var userId = sessionStorage.getItem('uid') || param.userId;
    var loginToken = sessionStorage.getItem('loginToken') || param.loginToken;
    if(!userId){
        Common.toLogin();
        return false;
    }
    var rich = param.rich;//财富值
    var interestAmt = param.interestAmt;//投资金额
    var registTime = param.registTime;//注册时间
    var status = param.status;
    //$('.img').attr({'src': '../../../images/pages/activity/memorie/poster' + number + '.jpg'});
    $.ajax({
        url: Setting.apiRoot1 + '/u/drawImg.p2p',
        type: 'post',
        dataType: 'json',
        data: {
            userId: userId,
            loginToken : loginToken,
            coupAmt: interestAmt,
            rich: rich,
            status:status,
            random: number + 1
        }
    }).done(function(res) {
        if(res.code == 1 || res.code == -99) {
          //$('.img').attr({'src':'https://teststatic.wdclc.cn/' + res.data});
          $('.img').attr({'src':Setting.imgRoot + res.data});
        }
    }).fail(function(){
        alert('网络链接失败，请刷新重试！');
        return false;
    });

    $('.poster').click(function() {
        window.location.href = '../../../pages/active/memorie/poster.html?posterNum=' + number + '&userId=' + userId;
    });
});