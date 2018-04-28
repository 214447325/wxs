/**
 * Created by User on 2017/12/12.
 */
$(function() {
    document.addEventListener('WeixinJSBridgeReady', function onBridgeReady() {
        // 通过下面这个API隐藏右上角按钮
        WeixinJSBridge.call('hideOptionMenu');
    });
    var $mouthtable = $('.mouthtable');
    //标题
    var arr = ['2018年3月','2018年2月','2018年1月'];
    //正文图片
    var as = [8,7,1];
    var _arrs = [{pack:3,count:14,format:'jpg'},{pack:201707,count:16,format:'jpg'},{pack:201801,count:16,format:'jpg'}];
    var _html = '';
    for(var i = 0; i < arr.length; i++ ) {
        _html = _html + '' +
        '<tr mouth=' + arr[i] + ' pack="' + _arrs[i].pack + '" countNumber=' + _arrs[i].count + ' format=' + _arrs[i].format + '>' +
        '<td class="td1">' +
        '<div class="tdlocal"><img src="http://106.15.44.101/group1/M00/00/0C/ag8sZVkZUK6ANX7lAABGRIdWGe8532.jpg"></div>' +
        '<div class="tdtext">V金融资讯前哨站</div>' +
        '</td>' +
        '<td class="td2">V金融' + arr[i] + '月报</td>' +
        '<td class="td3">' +
        '<img src="../../../images/pages/activity/mouths/' + as[i] + '.jpg">' +
        '</td>' +
        '</tr>';
    }

    $('.mtable').append(_html);

    $('tr').click(function() {
        var mouth = $(this).attr('mouth');
        var pack =  $(this).attr('pack');
        var countNumber = $(this).attr('countNumber');
        var format = $(this).attr('format');
        window.location.href = Setting.staticRoot + '/pages/active/mouths/mousewheel.html?mouth=' + mouth + '&pack=' + pack + '&countNumber=' + countNumber + '&format=' + format;
    });

    //
    //    }
    //})
});