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
            type: 4,
            loanType:1,
            loginToken:sessionStorage.getItem('loginToken')
        }
    }).done(function(res){
        Common.ajaxDataFilter(res,function(){
            var _res = res.data;
            if(res.code == 1) {
                hadShare = Common.comdify(parseFloat(_res.floatInterestAmtSum).toFixed(2));
                $solidMoney.html(hadShare);
                $principalMoney.html(Common.comdify(parseFloat(_res.totalInterest).toFixed(2)));
                var curProfit = _res.curProfit ;
                if(curProfit == undefined || curProfit == null || curProfit == '' || curProfit < 0) {
                    $accumulatedMoney.html('0.00');
                } else {
                    $accumulatedMoney.html(Common.comdify(parseFloat(curProfit).toFixed(2)));
                }
                
                var floatList = _res.floatList;

                var _html = '';
                 var _list = '';
                if(floatList.length != 0){
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
                                 var monery1 = '0.00';
                                 var mun = parseFloat((_list[a].investAmount)/(_list[a].investWeight)*((_list[a].currentWeight)-(_list[a].investWeight))).toFixed(2);
                                if(mun != undefined && mun != null && mun != '' && mun > 0) {
                                    monery1 = mun;
                                }

                                 var cur = _list[a].curRate;
                                 if(cur == undefined || cur == null || cur == '' || cur < 8) {
                                     cur = 8;
                                 }
                                 _html = _html + '<div class="choosingData">' +
                                         '<div class="choosingDataRow1">' +
                                         '<div class="choosingDataCol">当前盈利(元):<span class="floatSpan fontColor" id="money1">' + monery1 + '</span></div>' +
                                         '<div class="choosingDataCol">最新年化:<span class=" floatSpan fontColor">' + cur.toFixed(2) + '%</span></div>' +
                                         '</div>' +
                                         '<div class="choosingDataRow1">' +
                                         '<div class="choosingDataCol">购买份额(份):<span class=" floatSpan">' + _list[a].investShare + '</span></div>' +
                                         '<div class="choosingDataCol">投资金额(元):<span class=" floatSpan">' + Common.comdify(parseFloat(_list[a].investAmount).toFixed(2)) + '</span></div>' +
                                         '</div>' +
                                         '<div class="choosingDataRow1">' +
                                         '<div class="choosingDataCol">认购净值(元):<span class=" floatSpan">' + Common.comdify(parseFloat(_list[a].investWeight).toFixed(2)) + '</span></div>' +
                                         '<div class="choosingDataCol">最新净值(元):<span class=" floatSpan">' + Common.comdify(parseFloat(_list[a].currentWeight).toFixed(2)) + '</span></div>' +
                                         '</div>' +
                                         '<div class="choosingDataRow1">' +
                                         '<div class="choosingDataCol date">' + _list[a].investTime + '购买</div>' +
                                         '<div class="choosingDataCol date">' + _list[a].endTime + '到期</div>' +
                                         '</div>' +
                                         '</div>';

                             }
                            if(_list[a].status == 92) {
                                var cur = 0;
                                var profit = 0;
                                if(_list[a].curRate == undefined || (_list[a].curRate).length == 0 ) {
                                    cur = 0;
                                } else {
                                    cur = (_list[a].curRate).toFixed(2);
                                }
                                if (_list[a].investAmount == undefined || _list[a].investAmount == '') {
                                    profit = 0;
                                }
                                else {
                                    profit = parseFloat((_list[a].investAmount)/(_list[a].investWeight)*((_list[a].lastWeight)-(_list[a].investWeight))).toFixed(2)
                                }
                                var worth = 0;
                                if(_list[a].lastWeight == undefined || _list[a].lastWeight == '' || $.isEmptyObject(_list[a].lastWeight)) {
                                    worth = 0;
                                } else {
                                    worth = Common.comdify(parseFloat(_list[a].lastWeight).toFixed(2))
                                }

                                _html = _html + '<div class="choosingData">' +
                                            '<div class="choosingDataRow1">' +
                                            '<div class="choosingDataCol">当前盈利(元):<span class=" floatSpan fontColor">' + profit + '</span></div>' +
                                            '<div class="choosingDataCol">最终年化:<span class=" floatSpan fontColor">' + cur + '%' + '</span></div>' +
                                            '</div>' +
                                            '<div class="choosingDataRow1">' +
                                            '<div class="choosingDataCol">购买份额(份):<span class=" floatSpan">' + _list[a].investShare + '</span></div>' +
                                            '<div class="choosingDataCol">投资金额(元):<span class=" floatSpan">' + Common.comdify(parseFloat(_list[a].investAmount).toFixed(2)) + '</span></div>' +
                                            '</div>' +
                                            '<div class="choosingDataRow1">' +
                                            '<div class="choosingDataCol">认购净值(元):<span class=" floatSpan">' + Common.comdify(parseFloat(_list[a].investWeight).toFixed(2)) + '</span></div>' +
                                            '<div class="choosingDataCol">最终净值(元):<span class=" floatSpan">' + worth + '</span></div>' +
                                            '</div>' +
                                            '<div class="choosingDataRow1">' +
                                            '<div class="choosingDataCol date">' + _list[a].investTime + '购买</div>' +
                                            '<div class="choosingDataCol date">' + _list[a].endTime + '到期</div>' +
                                            '</div>' +
                                            '</div>';
                            }
                        }
                    }
                    $headerContent.html(_html);
                }  else {
                    noData();
                }
            } else {
                alert(res.message);
                return false;
            }
        });
    });
    
    var $portfolio = $('.portfolio');//点击资产组合
    $portfolio.click(function() {

    });

    $btn.click(function() {
        $alert.addClass('hide');
    });

    function noData() {
        var _noHtml = '';
        _noHtml = _noHtml + '<div class="null">' +
        '<img class="nullImg" src="../../images/pages/my-account3.0/null3.0.png">' +
        ' <p>暂无记录</p>' +
        '</div>';
        $headerContent.html(_noHtml);
    }
});

//点击资产组合
function floatPortfolio(lineId, floatMoney) {
    window.location.href = '../../pages/my-account/floatPortfolio3.0.html?lineId=' + lineId + '&floatHasmoney=' + floatMoney;
}