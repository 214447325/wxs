/**
 * Created by User on 2016/9/2.
 */
$(function() {
   var $earnings = $('.img1');//点击累计收益按钮
   var $alert = $('.backdrop');//弹出提示
    var $close = $('.close');//点击关闭
    var userId = sessionStorage.getItem('uid');//获取用户id
    var $solidMoney = $('.solidMoney');//浮动收益在投本金
    var $accumulatedMoney = $('.accumulatedMoney');//当前盈亏
    var $principalMoney = $('.principalMoney');//累计收益
    var $returnPage = $('.returnImg');//返回上一页
    var $btn = $('.btn-box1');//点击“我知道了”
    var $headerContent = $('.headerContent');

    var hadShare = 0;

    if(!userId){
        Common.toLogin();
        return false;
    }

    //查看详情
    $earnings.click(function() {
        $alert.removeClass('hide');
    });
    $close.click(function() {
        $alert.addClass('hide');
    });

    //返回上一页
    $returnPage.click(function() {
        window.location.href = '../../pages/my-account/myAccount.html';
    });

    $.ajax({
        url: Setting.apiRoot1 + '/u/queryMyFloat.p2p',
        type: 'post',
        dataType: 'json',
        data:{
            userId:userId,
            loginToken:sessionStorage.getItem('loginToken'),
            type: 4,
            loanType:1
        }
    }).done(function(res){
        Common.ajaxDataFilter(res,function(){
            var _res = res.data;
            if(res.code == 1) {
                hadShare = parseFloat(_res.floatInterestAmtSum).toFixed(2);
                $solidMoney.html(hadShare);
                $principalMoney.html(parseFloat(_res.totalInterest).toFixed(2));
                var curProfit = _res.curProfit ;
                if(curProfit == undefined || curProfit == null || curProfit == '') {
                    $accumulatedMoney.html('0.00');
                } else {
                    $accumulatedMoney.html(parseFloat(curProfit).toFixed(2));
                }
                var floatList = _res.floatList;
                var _html = '';
                 var _list = '';
                if(floatList != null && floatList != ''){
                    for(var i = 0; i < floatList.length; i++) {
                        _html = _html + '<div class="choosing">' +
                        ' <div class="choosingContent">' +
                        ' <div class="choosingworld">' + floatList[i].title + '</div>' +
                        '<div class="portfolio" onclick="floatPortfolio(' +floatList[i].lineId + ',' + hadShare + ')">资产组合</div>' +
                        '</div>' +
                        '</div>' ;
                        _list = floatList[i].data;
                        for(var a = 0; a < _list.length; a++) {
                             if(_list[a].status == 30) {
                                 _html = _html + '<div class="choosingData"><div class="choosingDataRow1">' +
                                                ' <div class="choosingDataCol">最新年化收益率:</div>' +
                                                '<div class="choosingDataCol">投资金额(元):</div>' +
                                                '</div>' +
                                                '<div class="choosingDataRow1">' +
                                                ' <div class="choosingDataCol floatData">' + _list[a].curRate + '</div>' +
                                                '<div class="choosingDataCol floatData">' + _list[a].investAmount + '</div>' +
                                                '</div>' +
                                                '<div class="choosingDataRow1">' +
                                                '<div class="choosingDataCol">认购净值(元):<span class="floatData floatSpan">' + _list[a].investWeight + '</span></div>' +
                                                '<div class="choosingDataCol">最新净值(元):<span class="floatData floatSpan">' + _list[a].currentWeight + '</span></div>' +
                                                '</div>' +
                                                '<div class="choosingDataRow1">' +
                                                '<div class="choosingDataCol date">' + _list[a].investTime + '购买</div>' +
                                                '<div class="choosingDataCol date">' + _list[a].endTime + '到期</div>' +
                                                '</div></div>' ;
                             }
                            if(_list[a].status == 92) {
                                _html = _html + '<div class="choosingData"><div class="choosingDataRow1">' +
                                                ' <div class="choosingDataCol">最终年化收益率:</div>' +
                                                '<div class="choosingDataCol">投资金额(元):</div>' +
                                                '</div>' +
                                                '<div class="choosingDataRow1">' +
                                                ' <div class="choosingDataCol ">' + _list[a].curRate + '</div>' +
                                                '<div class="choosingDataCol ">' + _list[a].investAmount + '</div>' +
                                                '</div>' +
                                                '<div class="choosingDataRow1">' +
                                                '<div class="choosingDataCol">认购净值(元):<span >' + _list[a].investWeight + '</span></div>' +
                                                '<div class="choosingDataCol">最终净值(元):<span >' + _list[a].lastWeight + '</span></div>' +
                                                '</div>' +
                                                '<div class="choosingDataRow1">' +
                                                '<div class="choosingDataCol date">' + _list[a].investTime + '购买</div>' +
                                                '<div class="choosingDataCol date">' + _list[a].endTime + '到期</div>' +
                                                '</div></div>' ;
                            }
                        }
                    }
                $headerContent.html(_html);
                }else {
                    noData();
                }
              }
        });
    });

    function noData() {
        var _noHtml = '';
        _noHtml = _noHtml + '<div class="null">' +
        '<img class="nullImg" src="../../../images/pages/my-account3.0/null3.0.png">' +
        ' <p>暂无记录</p>' +
        '</div>';
        $headerContent.html(_noHtml);
    }

    $btn.click(function() {
        $alert.addClass('hide');
    });
});

//点击资产组合
function floatPortfolio(lineId, floatMoney) {
    window.location.href = '../../pages/my-account/floatPortfolio3.0.html?lineId=' + lineId + '&floatHasmoney=' + floatMoney;
}