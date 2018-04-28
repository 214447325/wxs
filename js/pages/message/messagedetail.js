/**
 *
 * @author tangsj
 * @return {[type]}       [description]
 */
$(function () {

    var param = Common.getParam();
    var id = param.id;
    var $detailbanner = $('.detailbanner');
    var $wxmessage = $('.wxmessage');

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
                var img = "<img style='height:4rem;width:9rem' src=" + Setting.imgRoot + "images/pages/message/" + data[0].titleIcon + ".png></img>";
                var title = "<h2>" + data[0].title + "</h2>";
                var content = "<p>" + data[0].content + "</p>";
                var url = data[0].content;

                document.getElementById("wxiframe").src = url;

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
