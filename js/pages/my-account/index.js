/**
 * account index.js
 * @author zyx
 * @return {[type]}       [description]
 */
$(function () {

    /**
     * 微信进来的访问判断，不是跳转到官网下载页
     * 20160226 zyx
     */
    var isWeiXin = Common.isWeiXin();

    var $account = $('.my-account');
    var $accountAmt = $('.accountAmt', $account);//可用金额
    var $onLandAmt = $('.onLandAmt', $account); //在途资金
//  var $inUseAmt        = $('.inUseAmt',$account);//在投金额
    var $yesterdayIncome = $('.yesterdayIncome', $account);//昨日总收益
    var $currentIncome = $('.currentIncome', $account);//周周涨产品
    var $regularIncome = $('.regularIncome', $account);//定期金额
    var $phone = $('.phone', $account);
    var $avatar = $('.avatar', $account);
    var $inuseAmt = $('.inuseAmt', $account);

    var userId = sessionStorage.getItem('uid');
    var payChanel = sessionStorage.getItem('payChannel');
    payChanel = 4;//微信版线上富友
    var param = Common.getParam();
    var rcd = param.rcd;

    var $verSub = $('.ver-sub');
    var $verCancel = $('.ver-cancel');
    if (rcd == 0000) {//充值成功返回rcd
        $('#maskLayer2').css('display', 'block');
    } else {
        $('#maskLayer2').css('display', 'none');
    }
    $verSub.on('click', function () {
        window.location.href = '../my-account/myAccount.html';
    })
    $verCancel.on('click', function () {
        window.location.href = '../../pages/financing/float.html';
    })
    $verCancel

    if (!userId) {
        Common.toLogin();
        return false;
    }


    //var payChanel = 3;  //
//  if(userId==1){
//    payChanel =1;
//  }

    var lookTotalIncome = {};
    var hasMoney = 0;
    // 我的账户信息总览
    $.ajax({
        url: Setting.apiRoot1 + '/u/myAccountInfo.p2p',
        type: "post",
        dataType: 'json',
        data: {
            userId: userId,
            loginToken: sessionStorage.getItem('loginToken')
        }
    }).done(function (res) {
        Common.ajaxDataFilter(res, function () {
            if (res.code == 1) {
                //var $inuseAmt;
                var data = res.data;
                var _hide_number = data.phoneNum.substr(3, 4);
                var phoneNum = data.phoneNum.replace(_hide_number, '****');
                hasMoney = data.accountAmt;
                $accountAmt.text(Common.comdify((data.accountAmt).toFixed(2)));
                $inuseAmt.text(Common.comdify((data.inUseAmt).toFixed(2)));
//          $yesterdayIncome.text((data.yesterdayIncome).toFixed(2));
                //$yesterdayIncome.text((data.totalIncome).toFixed(2));//原来显示昨日总收益，改为累计总收益

                $yesterdayIncome.text(Common.comdify((data.totalIncome).toFixed(2)));

                $currentIncome.text('昨日收益:￥' + (data.yesCurIncome).toFixed(2));//改为显示周周涨昨日收益
//           $currentIncome.text('￥' + (data.currentIncome).toFixed(2));
                // $regularIncome.text('￥' + (data.regularIncome).toFixed(2));
                $onLandAmt.text('￥' + (data.onLandAmt).toFixed(2));
//          parseFloat((data.inUseAmt).toFixed(2));
//          parseFloat((data.onLandAmt).toFixed(2));
                /*$inuseAmt.text(parseFloat((data.inUseAmt).toFixed(2))+parseFloat((data.onLandAmt).toFixed(2)));*/
//          $inuseAmt.text((parseFloat(data.inUseAmt)+parseFloat(data.onLandAmt)).toFixed(2));
                $avatar.attr('src', Setting.imgRoot + data.logo);
                $phone.text(phoneNum);


                lookTotalIncome.total = (data.totalIncome).toFixed(2);
                lookTotalIncome.ding = (data.regularIncome).toFixed(2);
                lookTotalIncome.ying = (data.billIncome).toFixed(2);
                lookTotalIncome.huo = (data.currentIncome).toFixed(2);

            } else {
                alert(res.message);
                return false;
            }

        })
    }).fail(function () {
        alert('网络链接失败');
        return false
    });

    // 去充值
    $account.on('click', '.recharge', function () {
        var $this = $(this);

        if ($this.hasClass('disabled')) {
            return false;
        }

        var data = {
            userId: userId,
            loginToken: sessionStorage.getItem('loginToken')
        };

        // 调用充值跳转接口
        $this.addClass('disabled');
        var rurl = Setting.apiRoot1 + '/u/rb/recharge/goto.p2p';
        if (payChanel == 1) {
            rurl = Setting.apiRoot1 + '/u/recharge/goto.p2p';
        } else if (payChanel == 3) {
            rurl = Setting.apiRoot1 + '/u/fy/recharge/goto.p2p';
        } else if (payChanel == 4) {
            //zyx 20160511 add TODO
            window.location.href = Setting.staticRoot + '/pages/my-account/topup-cash.html';
        }

        if (payChanel != 4) {
            $.ajax({
                url: rurl,
                type: 'post',
                dataType: 'json',
                data: data
            }).done(function (res) {
                Common.ajaxDataFilter(res, function (res) {
                    if (res.code == 1) { // 已实名认证
                        var fee = res.data.fee;
                        var rechargeMin = res.data.rechargeMin;
                        var limitonce = res.data.limitonce;
                        var limitday = res.data.limitday;
                        var cardlist = {};
                        if (res.data.cardList.length > 0) {
                            cardlist = res.data.cardList[0];
                        }

                        var param = {
                            fee: fee || 0,
                            acctName: cardlist.acctName || '',
                            agreeNo: cardlist.agreeNo || '',
                            bankCode: cardlist.bankCode || '',
                            bankName: cardlist.bankName || '',
                            cardNo: cardlist.cardNo || '',
                            cardType: cardlist.cardType,
                            rechargeMin: rechargeMin || 100,
                            bindType: cardlist.bindType,
                            limitonce: limitonce,
                            limitday: limitday
                        }

                        if (payChanel == 1) {
                            window.location.href = Setting.staticRoot + '/pages/my-account/top-upLL.html?' + $.param(param);
                        } else if (payChanel == 3) {
                            window.location.href = Setting.staticRoot + '/pages/my-account/top-upFY.html?' + $.param(param);
                        }

                    } else if (res.code == -2) { // 未实名认证
                        $this.removeClass('disabled');
                        confirm('您还未完成实名认证，请先完成实名认证！', function () {
                            window.location.href = Setting.staticRoot + '/pages/my-account/setting/real-name.html';
                        });
                    } else {
                        alert(res.message);
                        $this.removeClass('disabled');
                        return false;
                    }
                });
            }).fail(function () {
                alert('网络链接失败');
                $this.removeClass('disabled');
                return false;
            });
        }

        $this.removeClass('disabled');
    }).on('click', '.cash', function () {
        var $this = $(this);

        if ($this.hasClass('disabled')) {
            return false;
        }

        // 调用提现跳转接口
        $this.addClass('disabled');

        var withUrl = Setting.apiRoot1 + '/u/rb/extract/goto.p2p';
        if (payChanel == 1) {
            withUrl = Setting.apiRoot1 + '/u/extract/goto.p2p';
        } else if (payChanel == 3) {
            withUrl = Setting.apiRoot1 + '/u/fy/extract/goto.p2p';
        } else if (payChanel == 4) {
            //zyx 20160511 add TODO
            //获取该用户的提现信息判断是否有余额可提现和该用户是否认证
            $.post(Setting.apiRoot1 + '/u/findTransChanel.p2p', {
                userId: sessionStorage.getItem('uid'),
                loginToken: sessionStorage.getItem('loginToken'), transType: 20
            }, function (res) {
                //console.log(JSON.stringify(res));
                if (res.code == -2) {
                    confirm(res.message, function () {
                        window.location.href = Setting.staticRoot + '/pages/my-account/setting/real-name.html';
                    });
                    return false;
                }

                var withdrawChanel = res.data.withdrawChanel;
                var isBind = true;
                var cardList = res.data.cardList;
                for (var i = 0; i < cardList.length; i++) {
                    if (cardList[i].bindType == 1) {
                        isBind = false;
                        sessionStorage.setItem('resaction', JSON.stringify(res));
                        window.location.href = Setting.staticRoot + '/pages/my-account/withdrawal-cash.html?amount=' + hasMoney;
                    }
                }

                if (isBind) {
                    alert('请先充值再提现');
                }
            }, 'json');
        }


        if (payChanel != 4) {
            $.ajax({
                url: withUrl,
                type: 'post',
                dataType: 'json',
                data: {
                    userId: userId,
                    loginToken: sessionStorage.getItem('loginToken')
                }
            }).done(function (res) {
                Common.ajaxDataFilter(res, function (res) {
                    if (res.code == 1) { // 已实名认证
                        var cardlist = {};
                        if (res.data.cardList.length > 0) {
                            cardlist = res.data.cardList[0];
                        }

                        var param = {
                            extractMin: res.data.extractMin,
                            card: cardlist.cardNo || '',
                            amount: res.data.amount,
                            prcptcd: cardlist.prcptcd || '',
                            provinceName: cardlist.provinceCode || '',
                            cityName: cardlist.cityCode || '',
                            fee: res.data.fee,
                            braBankName: cardlist.braBankName,
                            bankName: cardlist.bankName,
                            bindType: cardlist.bindType,
                            agreeNo: cardlist.agreeNo,
                            bankCode: cardlist.bankCode,
                            cardType: cardlist.cardType,
                            status: cardlist.status
                        }
                        var bindType = cardlist.bindType;
                        if (bindType != '1') {
                            alert('请完成一笔成功充值，绑卡后再进行提现。');
                            return false;
                        }

                        if (payChanel == 1) {
                            window.location.href = Setting.staticRoot + '/pages/my-account/withdrawalLL.html?' + $.param(param);
                        } else if (payChanel == 3) {
                            window.location.href = Setting.staticRoot + '/pages/my-account/withdrawalFY.html?' + $.param(param);
                        }

                    } else if (res.code == -2) { // 未实名认证
                        $this.removeClass('disabled');
                        confirm('您还未完成实名认证，请先完成实名认证！', function () {
                            window.location.href = Setting.staticRoot + '/pages/my-account/setting/real-name.html';
                        });
                    } else {
                        alert(res.message);
                        $this.removeClass('disabled');
                        return false;
                    }
                });
            }).fail(function () {
                alert('网络链接失败');
                $this.removeClass('disabled');
                return false;
            });
        }


        $this.removeClass('disabled');
    });


    // 去充值
    $account.on('click', '.lookTotalIncome', function () {
        var param = lookTotalIncome;
        window.location.href = Setting.staticRoot + '/pages/my-account/my-account_total_detail.html?' + $.param(param);
    });


});
