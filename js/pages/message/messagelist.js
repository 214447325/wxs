/**
 *
 * @author tangsj
 * @return {[type]}       [description]
 */
$(function () {

    var $tabcon = $('.messageList');


    //红包模板
    var setListData = doT.template([
        '{{~it :item:index}}',
        '<dl >',
        '<li class="messageOne"   style="height:2.525rem">',
        '<a href="' + Setting.staticRoot + '{{=item.url}}">',
        // '<img  class="messagebg" style="height:2.575rem;width:3.475rem" src="'+Setting.imgRoot+'wx/images/pages/message/{{=item.titleIcon}}.png"></img>',
        '<span class="messageInfo messageFirst">',
        '<h2  >{{=item.title}}</h2>',
        '<nobr><p  class="detail">{{=item.keydesc}}</p></nobr>',
        '<p  class="time">{{=item.createTime.split(" ")[0]}}</p>',
        '</span>',
        '</a>',
        '</li>',
        '</dl>',
        '{{~}}'
    ].join(''));

    //获取消息列表
    $.ajax({
        url: Setting.apiRoot1 + '/getPublicMessage.p2p',
        type: "post",
        dataType: 'json',
        data: {
            type: 1,
            flag: 1
        }
    }).done(function (res) {
        if (res.code == 1) {
            var data = res.data.fileList;

            if (data.length > 0) {
                $tabcon.html(setListData(data));
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
