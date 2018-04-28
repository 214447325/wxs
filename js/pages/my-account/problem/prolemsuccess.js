/**
 * Created by User on 2018/1/18.
 */
$(function() {
    var param = Common.getParam();
    var riskLevel = param.riskLevel;//风险等级；
    var riskType = param.riskType;
    var type = param.type;
    var _html = '';
    _html = _html + '' +
    '<div class="psuccess-box">' +
        '<div>您的风险评估结果</div>' +
        '<div></div>' +
        '<div><h1>' + riskType + '</h1></div>' +
        '<div>市场有风险,出借需谨慎</div>' +
    '</div>' +
    '<div class="ps-bottom">' +
        '<a class="pslook" href="javascript:;">查看适合产品</a>' +
        '<a class="psload" href="javascript:;">重新评估</a>' +
    '</div>';
    $('.wrapper').html(_html);
    $('.pslook').click(function() {
        if(type != undefined && type != null && type != '') {
            if(type == 1) {
                window.AndroidWebView.setRegular();
            }

            if(type == 2) {
                iOS.HtmlJumpRegular();
            }
        } else {
            window.location.href = Setting.staticRoot + '/pages/financing/regular.html';
        }
    });

    $('.psload').click(function() {
        $.cookie('parrays','');

        if(type != undefined && type != null && type != '') {
            if(type == 1) {
                window.AndroidWebView.setLoadNewUrl(Setting.staticRoot + '/pages/my-account/setting/problem/problem.html','风险评估');
            }
            if(type == 2) {
                iOS.htmlTest(Setting.staticRoot + '/pages/my-account/setting/problem/problem.html');
            }
        } else {
            window.location.href = Setting.staticRoot + '/pages/my-account/setting/problem/problem.html?uid=' + sessionStorage.getItem('uid') + '&loginToken=' + sessionStorage.getItem('loginToken');
        }

    })
});