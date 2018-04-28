/**
 * Created by User on 2016/9/6.
 */
/**
 *
 * @author tangsj
 * @return {[type]}       [description]
 */
$(function () {
    var param = Common.getParam();
    var id = param.id;
    var $returnPage = $('.returnPage');//返回上一页按钮
    var version = sessionStorage.getItem('version');//APP端版本号,微信端无此标识;version3.1及3.1以上不显示页面顶部title
    if (version == null || version == undefined || version == '') {
        version = param.version;
        if (version != null) {
            sessionStorage.setItem('version', version);
        }
    }
    if (version >= 3.1) {
        $('.messageTitle').hide();
    }

    $returnPage.click(function () {
        window.location.href = '../../pages/message/messages.html?act=1';
    });

    //获取消息列表
    $.ajax({
        url: Setting.apiRoot1 + '/getPublicMessage.p2p',
        type: "post",
        dataType: 'json',
        data: {
            type: 1,
            id: id
        }
    }).done(function (res) {
        if (res.code == 1) {
            var data = res.data.fileList;
            if (data.length > 0) {
                if (data[0].paramTye == 1) {
                    var img = "<img style='height:4rem;width:9rem' src=" + Setting.imgRoot + "images/pages/message/" + data[0].titleIcon + ".png></img>";
                    var url = data[0].content;
                    $('#detailbanner').html('<iframe width="100%" height="100%" id="wxiframe" src="' + url + '" class="wxmessage" ></iframe>');
                }

                if (data[0].paramTye == 5) {
                    $('#detailbanner').html('<div class="detailbox">' +
                    '<div class="details">' +
                    '<div class="detailtitle"><h2>' + data[0].title + '</h2></div>' +
                    '<div class="detailcreateTime">' + data[0].createTime + '<a class="detailem">V金融投资</a></div>' +
                    '<div class="detailcontent">' + data[0].content + '</div>' +
                    '</div>' +
                    ' </div>');
                }

            }
        } else {
            alert(res.message);
            return false;
        }

    }).fail(function () {
        alert('网络链接失败');
        return false
    });

});
