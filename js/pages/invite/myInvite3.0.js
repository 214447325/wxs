/**
 * Created by User on 2016/9/8.
 */
$(function () {
    var $peopleCount = $('.peopleCount');//已邀请好友人数
    var $money = $('.money');//累计奖励现金
    var $peopleRanking = $('.peopleRanking');//邀请人排行榜
    var $moneyRanking = $('.moneyRanking');//奖励现金排行榜
    var $hasInvestment = $('.investedFriends');//已投资按钮
    var $noInvestend = $('.noInvestend');//未投资好友
    var $returnPage = $('.returnImg');//返回上一页按钮

    var alist = '';//已投资
    var nlist = '';//未投资

    var userId = sessionStorage.getItem('uid');
    if (!userId) {
        Common.toLogin();
        return false;
    }

    $hasInvestment.click(function () {
        $(this).addClass('blue');
        $noInvestend.removeClass('blue');
    });

    $noInvestend.click(function () {
        $(this).addClass('blue');
        $hasInvestment.removeClass('blue');
    });

    $.ajax({
        url: Setting.apiRoot1 + '/u/inviteFriendDetail.p2p',
        type: 'post',
        dataType: 'json',
        data: {
            userId: userId,
            loginToken: sessionStorage.getItem('loginToken')
        }
    }).done(function (res) {
        Common.ajaxDataFilter(res, function () {
            console.log(JSON.stringify(res));
            if (res.code == 1) {
                $peopleCount.html(res.data.count);
                $money.html(res.data.sumUserRelation);
                $peopleRanking.html(res.data.userList);
                $moneyRanking.html(res.data.rewardList);
                alist = res.data.alreadyInvestUser;
                nlist = res.data.noInvestUser;
            }
        });
    }).fail(function () {
        alert('网络链接失败');
    });

    $returnPage.click(function () {
        window.location.href = '../../pages/index.html';
    });
});