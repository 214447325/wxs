/**
 * Created by User on 2016/7/26.
 */
$(function() {
    var payInfo = sessionStorage.getItem('payInfo');
    var detailsPay = JSON.parse(sessionStorage.getItem('withdrawal-pay'));
    var pay = JSON.parse(payInfo);
    var resaction = JSON.parse(sessionStorage.getItem('resaction'));

     var withdrawChanel = resaction.data.withdrawChanel;
    var $amount = $('.details-center-span');//修改提现金额
    var $amount1 = $('.details-center-span2');//修改实际到账金额
    var $detailsImg1 = $('.details-successful-img1');//修改成功或者失败的图片
    var $detailsTxt = $('.details-successful-txt');//修改图片下面的文字
    var $text =  $('.details-successful-content');//替换内容
    var $detailsImg2 = $('.details-successful-img2');//替换银行标志
    var $bankCard = $('.details-center-span5');//替换银行尾号
    var $fee = $('.details-center-span1');//提现手续费

    if (pay.code == 1) {
        $detailsImg1.attr({src: '../../images/pages/my-account/width-successful.png'});
        $detailsTxt.html('提现提交成功');
        if (withdrawChanel == 3 || withdrawChanel == 4 ) {
            $text.addClass('details-span1').html('<span class="span1">预计5分钟到帐最迟3个小时</span>')
        } else {
            $text.addClass('details-span').html('工作日15:30之前提现，资金当日到账，其余时间'+
                '提现资金下一个工作日到账，双休日及节假日提现' +
                '资金将于下一个工作日到账。');
        }
        $amount1.html("￥" + detailsPay.amount);

    } else {
        $detailsImg1.attr({src: '../../images/pages/my-account/width-failure.png'});
        $detailsTxt.html('<div class="div-pay-default">' + pay.message + '</div>');
        $('.div-pay-default').css({'width': '8rem', 'margin': '0 auto'});
        $text.addClass('details-span1').html('<span class="span1">联系客服：<span class="span2">4000-'+
             '521-388</span></span>');
        $amount1.html("￥" + 0 );
    }
    $amount.html("￥" + detailsPay.amount);
    $detailsImg2.attr({src: detailsPay.bankImgURL});
    $bankCard.html(detailsPay.braBankName +'（'+detailsPay.bankCard +'）');
    if (detailsPay.fee != 0) {
        $fee.addClass('fe').html("￥" + detailsPay.fee);
        $amount1.html("￥" + (detailsPay.amount - 2).toFixed(2));
    }
});