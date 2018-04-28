/**
 * Created by User on 2016/11/1.
 */

$(function() {

    $("ul#ticker02").liScroll({travelocity: 0.1});

    ////选择加息券
    var $rate = $('.rate');//点击加息券
    var $footer = $('.footer');//点击确定按钮
    var _money = 0;
    //点击加息券
    $rate.click(function() {
        $(this).addClass('click');
        var $choose = $(this).find('.choose');//进行打钩
        var $span = $(this).find('.span');//获取打钩里面的金额
       if(!($choose.hasClass('isChoose'))) {
           $choose.show();
           $choose.addClass('isChoose');
           _money = _money + parseFloat($span.text());
       } else {
           $choose.hide();
           $choose.removeClass('isChoose');
           _money = _money - parseFloat($span.text());
       }
    });

    //点击确定按钮
    $footer.click(function() {
        alert(_money)
    });
});


