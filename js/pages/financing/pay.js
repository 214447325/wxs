/**
 * pay.js
 * @author zyx
 * @return {[type]}       [description]
 */
$(function(){

    var defText = '确认付款';
    var payText = '支付中...';

    var payInfo = sessionStorage.getItem('buy-pro');
    var userId = sessionStorage.getItem('uid');
    var param = Common.getParam();
    var reback = param.reback;
    var cycle = param.cycle;
    var isJoinInvite = param.isJoinInvite;
    var clicktype = param.clicktype;
    var userRateCouponIds='';//加息券、体验金id
    var userRate = '';
    var investCouponId='';//投资红包id
    var invest = '';
    var vjr_selectedConpon =  [];
    vjr_selectedConpon =  sessionStorage.getItem('vjr_selectedConpon');
    if(vjr_selectedConpon != undefined && vjr_selectedConpon != null && vjr_selectedConpon != '') {
        vjr_selectedConpon = JSON.parse(sessionStorage.getItem('vjr_selectedConpon'))
        for(var i = 0; i < vjr_selectedConpon.length; i++) {
            if (vjr_selectedConpon[i].type == 1 || vjr_selectedConpon[i].type == 2) {
                // 加息券
                //var vjr_couponIds =sessionStorage.getItem('vjr_couponIds');
                //var strCon = vjr_couponIds.toString();
                //var strCon1 = strCon.replace('[','');
                //var strConpon = strCon1.replace(']','');
                //userRateCouponIds=strConpon;//加息券
                //userRate.push(vjr_selectedConpon[i].id);
                userRateCouponIds = userRateCouponIds + vjr_selectedConpon[i].id + ',';
            }

            if (vjr_selectedConpon[i].type == 3) {
                // 体验金
                //var vjr_expIds =sessionStorage.getItem('vjr_expIds');
                //var strExp = vjr_expIds.toString();
                //var strExp1 = strExp.replace('[','');
                //var strExperien = strExp1.replace(']','');
                //userRateCouponIds=strExperien;//体验金
                //userRate.push(vjr_selectedConpon[i].id);
                userRateCouponIds = userRateCouponIds + vjr_selectedConpon[i].id + ',';
            }

            if (vjr_selectedConpon[i].type == 5) {
                // 投资红包
                //var vjr_redIds =sessionStorage.getItem('vjr_redIds');
                //var strRed = vjr_redIds.toString();
                //var strRed1 = strRed.replace('[','');
                //var strRedbag = strRed1.replace(']','');
                //investCouponId=strRedbag;//红包
                investCouponId = investCouponId + vjr_selectedConpon[i].id + ',';
                //invest.push(vjr_selectedConpon[i].id);
            }
        }

        if(userRateCouponIds != undefined && userRateCouponIds != null && userRateCouponIds != '') {
            userRate = userRateCouponIds.substr(0,userRateCouponIds.length-1);
            //userRate = userRate + '';
            userRate.toString();
        }

        if(investCouponId != undefined && investCouponId != null && investCouponId != '') {
            invest = investCouponId.substr(0,investCouponId.length-1);
            //invest = invest + '';
            invest.toString();
        }
    }


    var $ui_dialog = $('.ui-dialog');
    var $ui_dialogFail = $('.ui-dialogFail');
    var $btn_link  = $('.btn-link',$ui_dialog);
    var $btn_default = $('.btn-default-two',$ui_dialog);
    var $btn_linkFail  = $('.btn-link',$ui_dialogFail);//重新输入
    var $btn_defaultFail = $('.btn-default-two',$ui_dialogFail);//忘记密码



    var $inputBox = $('.input-box');
    var $boxs = $('.box', $inputBox);
    var pass = '';

    if(!userId){
        Common.toLogin();
        return false;
    }

    if(!payInfo){
        window.location.href = Setting.staticRoot + '/pages/index.html';
        return false;
    }

    payInfo = JSON.parse(payInfo);

    var $pay = $('.page-pay');
    var $money = $('.money');

    // setData
    $money.text(parseFloat(payInfo.investAmt).toFixed(2) + '元');

//  $ui_dialog.on('click','.close,.btn-link',function(event) {
//     $(this).closest('.ui-dialog').hide();
//  }).on('click','.btn-default',function(){
//    if(num > 0){
//      alert('你已经预约过了');
//      return false;
//    }
//  });

    $pay.on('click', '.submit-pay', function(){
        var $this = $(this);

        if($this.hasClass('disabled')){
            return false;
        }

        var pwd = $('input', $inputBox).val();

        if(pwd.length < 6){
            alert('请输入完整的交易密码！');
            return false;
        }

        $this.addClass('disabled').text(payText);
        var post = {
            investAmt: payInfo.investAmt,
            userId: userId,
            prodId: payInfo.prodId,
            tradePassword: md5(pwd),
            reback: reback,
            isJoinInvite:isJoinInvite,
            userRateCouponIds:userRate,
            investCouponId:invest
        };
        if(param.noviceId){
            post.couponSumAmt = payInfo.investAmt;
            post.couponList = param.noviceId;
        }
        post.loginToken=sessionStorage.getItem('loginToken');



        $.ajax({
            url: Setting.apiRoot1 + '/u/investPurchaseNew.p2p',
            type: 'post',
            dataType: 'json',
            data: post
        }).done(function(res){
            Common.ajaxDataFilter(res, function(res){
                if(res.code == 1){
                    sessionStorage.setItem('newProd',res.data.newProd);//是否购买过新手标
                    // 新手标购买跳转,新手标页
                    $ui_dialog.removeClass('hide');
                    if(param.noviceId){
                        $btn_default.attr('href',Setting.staticRoot + '/pages/financing/regular.html');
                        $btn_link.attr('href',Setting.staticRoot + '/pages/my-account/myAccount.html');
                        return false;
                    }
                    //周周涨
                    if(param.current){
                        $btn_default.attr('href',Setting.staticRoot + '/pages/financing/regular.html');
                        $btn_link.attr('href',Setting.staticRoot + '/pages/my-account/myAccount.html');
                        return false;
                    }
                    //  我的产品页
                    sessionStorage.removeItem('buy-pro');
                    sessionStorage.setItem('slreValue',0);
                    sessionStorage.setItem('vjr_selectedConpon','');
    //        $btn_link.attr('href',Setting.staticRoot + '/pages/financing/currentbuy.html');
                    //$btn_link.attr('onclick','location.replace(document.referrer);');
                    $btn_default.attr('href',Setting.staticRoot + '/pages/financing/regular.html');
                    $btn_link.attr('href',Setting.staticRoot + '/pages/my-account/myAccount.html');
                }else if(res.code == -3){
                    $ui_dialogFail.removeClass('hide');
                    $this.removeClass('disabled').text(defText);
                    $btn_linkFail.on('click',function(){
                        $('input', $inputBox).val('');
                        console.log($('input', $inputBox).val());
                        $boxs.each(function(index, box){
                            $(this).removeClass('full');
                            $boxs.eq(0).addClass('focus');
                        });
                        $('.backdrop').addClass('hide');

                    });
                    $btn_defaultFail.attr('href',Setting.staticRoot + '/pages/my-account/setting/reset.html');
                    return false;
                }else if(res.code == -2){
                    alert(res.message);
                    return false;

                }else if(res.code == -99){
                    window.location.href = "../account/login.html";
                    return false;
                }else{
                    alert(res.message)
                }
            });
        }).fail(function(){
            alert('支付失败，请重试！');
            $this.removeClass('disabled').text(defText);
            return false;
        });
    });

    $inputBox.on('keydown input focus blur', 'input', function(e){
        var $this = $(this);

        if(e.type == 'keydown'){
            var code = e.keyCode;
            if(code != 8 && (code < 48 || code > 57)){
                return false;
            }
        }
        var val = $.trim( $this.val() );
        pass = val;//parseInt(val);

        isNaN(pass) && ( pass = '' );

        pass = pass + '';
        if(pass.length > 6){
            pass = pass.substring(0, 6);
        }
        $inputBox.find('input').val(pass);

        if(e.type == 'focusout'){
            $boxs.removeClass('focus');
        }
        var len = pass.length;
        if(e.type == 'focusin'){
            len == 0 ? (true) : (len = len - 1);
        }
        $boxs.eq(len).addClass('focus').siblings('.focus').removeClass('focus');
        var passArr = pass.split('');
        $boxs.each(function(index, box){
            var $box = $(box);

            if(!!passArr[index]){
                $box.addClass('full');
            }else{
                $box.removeClass('full');
            }
        });
    });
    $('.close>img').click(function(){
        $('.backdrop').addClass('hide');
    })
});
