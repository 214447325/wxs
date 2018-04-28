/**
 * invite.js
 * @author tangsj
 * @return {[type]}       [description]
 */
$(function () {

    var $invite = $('.invite');
    var param = Common.getParam();
    var userId = sessionStorage.getItem('uid') || param.uid;
    var type = param.type;
    if (userId) {
        sessionStorage.setItem('uid', userId);
    }

    /**
     * 加载邀请码
     * @return {[type]} [description]
     */
    !function () {

        var $qrcode = $('.qrcode', $invite);
        var $code = $('.code', $invite);

        if (!userId) {
            Common.toLogin();
            return false;
        }

        $.ajax({
            url: Setting.apiRoot1 + '/u/getInviteCode.p2p',
            type: 'post',
            dataType: 'json',
            data: {
                type: 1,
                userId: userId,
                loginToken: sessionStorage.getItem('loginToken')
            }
        }).done(function (res) {
            Common.ajaxDataFilter(res, function (data) {
                if (data.code == 1) {
                    $qrcode.html('<img src="' + Setting.imgRoot + '/' + data.data.inviteCodeUrl + '" alt="" />')
                    $code.find('p:last-child').text(data.data.code);
                    _share_link += data.data.code;
                } else {
                    alert(data.message);
                    return false;
                }
            });
        }).fail(function () {
            alert('数据拉取失败，请刷新重试!');
            return false;
        });
    }();

    //分享
    !function () {
        var $body = $('body')
        var shareTemplate = [
            '<div class="share">',
            '<i class="share_pic"></i>',
            '</div>'
        ].join('');

        var messagingIframe;
        messagingIframe = document.createElement('iframe');
        messagingIframe.style.display = 'none';
        document.documentElement.appendChild(messagingIframe);
        function IOSJS(jsonStr, url) {
            messagingIframe.src = "ios://" + url + "?jsonStr=" + jsonStr;
        }

        $body.on('click', '.invite-btn', function (event) {
            event.stopPropagation();
            if (type == 1) {
                var c = getVersion(version, type);
                if (c <= 3690) {
                    window.homepage.sendDivice('10001', 'userId', userId);
                } else {
                    window.AndroidWebView.setH5Share('888');
                }
            } else {
                var obj = {
                    functionId: "",
                    key: "",
                    value: ""
                };
                obj.functionId = '10001';
                obj.key = 'userId';
                obj.value = userId;

                IOSJS(JSON.stringify(obj), "sendDivice");
            }


        });

        function getVersion(version, type) {
            var v = '';
            for (var i = 0; i < version.length; i++) {
                if (version[i] != '.') {
                    v = v + version[i];
                }
            }
            if ((v.length == 3 || v.length == 4) && type == 1) {
                v = v + '0'
            } else {
                if (v.length == 3 && type == 2) {
                    v = v + '0'
                }
            }
            return parseInt(v)
        }

        $body.on('click', '.share', function (event) {
            $(this).remove();
        });
    }()
});
