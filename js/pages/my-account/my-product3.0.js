/**
 * Created by User on 2016/9/2.
 */
    var _noList = [];
    var userRateCouponCount = '';
    var _expiredList = [];//已到期
$(function() {

    var _dHeight = $(document).height();
    var _headerHeight = $('.header').height();
    $('#scroll').height((_dHeight - _headerHeight) + 'px');

    var $details = $('.img1');//点击历史收益查看详情
    var $backdrop = $('.backdrop');
    var $close = $('.close');//点击关闭按钮
    var $returnPage = $('.returnImg');//返回上一页按钮
    var $expired = $('.dueHas');//点击已到期按钮
    var $maturity = $('.dueNot');//点击未到期按钮
    var userId = sessionStorage.getItem('uid');//获取用户的ID
    var $solidMoney = $('.solidMoney');//再投本金
    //var $accumulatedMoney = $('.accumulatedMoney');//在投预期总收益
    //var $principalMoney = $('.principalMoney');//历史收益
    var $world = $('.world');//点击固收资产组合按钮
    var $btn = $('.btn-box1');//点击“我知道了按钮”
    var $dueOngoing = $('.dueOngoing');//点击退出中
    //var $contentCenter=$('.contentCenter');

    var cycle;//周期时长
    var cycleType;//周期类型
    var percent;
    var rate;
    var money;

    var code = '';


    if(!userId){
        Common.toLogin();
        return false;
    }
    var hadShare = 0;

    //持有中
    $maturity.click(function() {
        $('.square').removeClass('blue');
        $(this).find('.square').addClass('blue');
        $('#scroll').html('<div class="listM listM1"><div class="content"></div></div>');
        dueNot();
    });

    //点击推出中
    $dueOngoing.click(function() {
        $('.square').removeClass('blue');
        $(this).find('.square').addClass('blue');
        $maturity.removeClass('blue');
        $('.dueOng').show();
        $('#scroll').html('<div class="listM listM2"><div class="dueOng"></div></div>');
        dueOng();

    });

    //已退出
    $expired.click(function() {
        $('.square').removeClass('blue');
        $(this).find('.square').addClass('blue');
        $maturity.removeClass('blue');
        $('#scroll').html('<div class="listM listM3"><div class="dueHascontent"></div></div>');
        dueHascontent();
    });

    $details.click(function() {
        $backdrop.removeClass('hide');
    });

    //点击关闭按钮
    $close.click(function() {
        $backdrop.addClass('hide');
    });

    $btn.click(function() {
        $backdrop.addClass('hide');
    });

    //点击返回上一页按钮
    $returnPage.click(function() {
        window.location.href = '../my-account/myAccount.html';
    });

    function maturity(_noList,count) {
        //未过期
        var _html = '';
        //var _productText = '';
        for(var i = 0; i < _noList.length; i++) {
            //_productText = '';
            //var _restWeightText = '';
            //var _couponListText = '';
            //
            //if(_noList[i].product_type == 5) {
            //    _productText = _productText + '<span class="loanCycle">新手标</span>';
            //}else if(_noList[i].product_type == 6){
            //    if(_noList[i].loanCycle == 2){
            //        _productText = _productText + '<span class="loanCycle">新手标A</span>';
            //    }
            //    if(_noList[i].loanCycle == 4){
            //        _productText = _productText + '<span class="loanCycle">新手标B</span>';
            //    }
            //} else {
            //    _productText = _productText + '<span class="loanCycle">' + _noList[i].loanCycle + '周定期</span>';
            //}
            //
            //var couponConut = _noList[i].couponConut;
            //var _fcDays = 0;
            //if(couponConut != undefined && couponConut != null && couponConut != '') {
            //    for(var j = 0; j < couponConut.length; j++) {
            //        if(couponConut[j].couponType == 1) {
            //            _fcDays = couponConut[j].count;
            //        }
            //        if(couponConut[j].count == 1) {
            //            _couponListText = _couponListText + '<span class="sli">' + couponConut[j].couponTitle + '</span>';
            //        } else {
            //            _couponListText = _couponListText + '<span class="sli" >' + couponConut[j].couponTitle + '</span><span class="slicount">x' + couponConut[j].count + '</span>';
            //        }
            //    }
            //}

            _html = _html + '' +
            '<div class="setitem" onClick="jumpAsset(0,' + _noList[i].financeId + ')">' +
                '<div class="single">' +
                    '<div class="single-left">' +
                        '<div class="first" >' + _noList[i].prodTitleNew + '</div>' +
                        '<div class="first-text">' +
                            '<div>加入金额<span class="holdMoney" id=' +  _noList[i].financeId + '>' + parseFloat(_noList[i].amount).toFixed(2) + '</span></div>' +
                            '<div>目标收益<span class="interestTotalAmount">' +  parseFloat((parseFloat(_noList[i].totalIncomeAmount)).toString().match(/^\d+(?:\.\d{0,2})?/)).toFixed(2) + '</span></div>' +
                        '</div>' +
                    '</div>' +
                    '<div class="single-right">' +
                        '<div class="single-right-box">' +
                            '<div>到期日</div>' +
                            '<div>' + _noList[i].endtime + '</div>' +
                        '</div>' +
                    '</div>' +
                '</div>' +
            '</div>';
        }

        if(count == 1) {
            $('.content').html(_html);
        } else {
            $('.content').append(_html);
        }

    }

    //已到期的方法
    function expired(_expiredList,count){
        //已过期
        var _html = '';
        //var _productText = '';
        for(var i = 0; i < _expiredList.length; i++) {
            //_productText = '';
            //var _restWeightText = '';
            //var _couponListText = '';
            //if(_expiredList[i].product_type == 5) {
            //    _productText = _productText + '<span class="loanCycle">新手标</span>';
            //}else if(_expiredList[i].product_type == 6){
            //     if(_expiredList[i].loanCycle == 2){
            //        _productText = _productText + '<span class="loanCycle">新手标A</span>';
            //     }
            //     if(_expiredList[i].loanCycle == 4){
            //        _productText = _productText + '<span class="loanCycle">新手标B</span>';
            //     }
            //} else {
            //    _productText = _productText + '<span class="loanCycle">' + _expiredList[i].loanCycle + '周定期</span>';
            //}
            //var couponConut = _expiredList[i].couponConut;
            //var _fcDays = 0;
            //if(couponConut != undefined && couponConut != null && couponConut != '') {
            //    for(var j = 0; j < couponConut.length; j++) {
            //        if(couponConut[j].couponType == 1) {
            //            _fcDays = couponConut[j].count;
            //        }
            //        if(couponConut[j].count == 1) {
            //            _couponListText = _couponListText + '<span class="sli sligray" style="border: 1px solid rgb(181,181,181)!important;">' + couponConut[j].couponTitle + '</span>';
            //        } else {
            //            _couponListText = _couponListText + '<span class="sli sligray" style="border: 1px solid rgb(181,181,181)!important;">' + couponConut[j].couponTitle + '</span><span class="slicount">x' + couponConut[j].count + '</span>';
            //        }
            //    }
            //}
            _html = _html + '' +
                '<div class="setitem" onClick="jumpAsset(1,' + _expiredList[i].financeId + ')">' +
                    '<div class="single">' +
                        '<div class="single-left">' +
                            '<div class="first" >' +  _expiredList[i].prodTitleNew + '</div>' +
                            '<div class="first-text">' +
                                '<div>加入金额<span class="holdMoney" id=' +  _expiredList[i].financeId + '>' + parseFloat(_expiredList[i].amount).toFixed(2) + '</span></div>' +
                                '<div>目标收益<span class="interestTotalAmount">' +  parseFloat((parseFloat(_expiredList[i].totalIncomeAmount)).toString().match(/^\d+(?:\.\d{0,2})?/)).toFixed(2) + '</span></div>' +
                            '</div>' +
                        '</div>' +
                        '<div class="single-right">' +
                            '<div class="single-right-box">' +
                                '<div>退出日</div>' +
                                '<div>' + _expiredList[i].endtime + '</div>' +
                            '</div>' +
                        '</div>' +
                    '</div>' +
                '</div>';
        }
        if(count == 1) {
            $('.dueHascontent').html(_html);
        } else {
            $('.dueHascontent').append(_html);
        }
    }

    $world.click(function() {
        window.location.href = '../../pages/my-account/regular/regularPortfolio3.0.html?hadShare='+ hadShare;
    });

    $.ajax({
        url: Setting.apiRoot1 + '/u/userRegularInvestInfo.p2p',
        type: 'post',
        async:false,
        dataType: 'json',
        data:{
            userId:userId,
            loginToken:sessionStorage.getItem('loginToken')
        }
    }).done(function(res) {
        Common.ajaxDataFilter(res,function() {
            if(res.code == 1) {
                var _data = res.data;
                var currentInvestAmount = _data.currentInvestAmount;
                if(currentInvestAmount > 0) {
                    $solidMoney.html(Common.comdify(parseFloat(currentInvestAmount).toFixed(2)));//持有本金(元)
                } else {
                    $solidMoney.html('0.00');//持有本金(元)
                }

            } else {
              Common2.toast(res.message);
            }
        })
    }).fail(function() {
        Common2.toast('网络连接失败！');
        return false;
    });


    dueNot();//默认
    function dueNot() {
        var count = 1;
        var $listM1 = $('.listM1');
        $listM1.dropload({
            scrollArea:$listM1,
            loadDownFn:function(me) {
                Common2.toast('请求中',Setting.staticRoot+'/images/pages/ui/loading.png',false);
                $.post(Setting.apiRoot1 + '/u/userInvestmentProductList.p2p',
                    {'userId':userId, 'loginToken':sessionStorage.getItem('loginToken'), 'pageNum':count},
                    function(res) {
                        $('#toastMessage').remove();
                        Common.ajaxDataFilter(res,function(res) {
                            if(res.code == 1) {
                                if(res.data.investList.length > 0) {
                                    for(var j = 0;j < res.data.investList.length;j++){
                                    //    //var interestTotalAmount=res.data.myRegularInvestList[j].interestTotalAmount;
                                    //    //var cycle=res.data.myRegularInvestList[j].loanCycle;//周期
                                    //    //var cycleType=res.data.myRegularInvestList[j].cycleType;//周期类型
                                    //    //var rate=res.data.myRegularInvestList[j].rate;//年化收益率
                                    //    //var money=res.data.myRegularInvestList[j].holdMoney;//每种产品购买的金额
                                    //    //if( cycleType==1){
                                    //    //    percent = cycle / 365;//日
                                    //    //}else if(cycleType==2){
                                    //    //    percent = cycle*30 /365;//月
                                    //    //}else if(cycleType == 3){
                                    //    //    percent =cycle*365 /365;//年
                                    //    //}else if(cycleType == 4){
                                    //    //    percent = cycle*7 /365;//周
                                    //    //}
                                    //    //if (interestTotalAmount==0) {
                                    //    //    interestTotalAmount=parseFloat(percent*money*rate/100).toFixed(2);
                                    //    //}
                                    //
                                    //    var interestTotalAmount=res.data.investList[j].totalIncomeAmount;
                                    //    var cycle=res.data.investList[j].loanCycle;//周期
                                    //    var cycleType=res.data.investList[j].cycleType;//周期类型
                                    //    var rate=res.data.investList[j].rate;//年化收益率
                                    //    var money=res.data.investList[j].amount;//每种产品购买的金额
                                    //    if( cycleType==1){
                                    //        percent = cycle / 365;//日
                                    //    }else if(cycleType==2){
                                    //        percent = cycle*30 /365;//月
                                    //    }else if(cycleType == 3){
                                    //        percent =cycle*365 /365;//年
                                    //    }else if(cycleType == 4){
                                    //        percent = cycle*7 /365;//周
                                    //    }
                                    //    if (interestTotalAmount==0) {
                                    //        interestTotalAmount=parseFloat(percent*money*rate/100).toFixed(2);
                                    //    }
                                    //
                                    //    res.data.investList[j].totalIncomeAmount=interestTotalAmount;
                                        _noList.push(res.data.investList[j]);//未到期
                                    }
                                    maturity(res.data.investList,count);
                                    count++;
                                    me.unlock();
                                    me.noData(false);
                                    me.resetload();
                                } else {
                                    if(count == 1) {
                                        noData($('.content'));
                                    }
                                    // 锁定
                                    me.lock();
                                    // 无数据
                                    me.noData(true);
                                    return false;
                                }
                            } else {
                                noData($('.content'));
                                // 锁定
                                me.lock();
                                // 无数据
                                me.noData(true);
                                return false;
                            }
                        })
                    },'json'
                );
            }
        });
        $('.dropload-down').remove();
    }

    function dueOng(){
        $('.dropload-down').remove();
        noData($('.dueOng'));
    }

    function noData($c) {
        $c.html('<div class="null"><img class="nullImg" src="../../images/pages/my-account3.0/null.png"><p>当前没有持有计划</p></div>')
    }

    function dueHascontent() {
        var count = 1;
        var $listM3 = $('.listM3');
        $listM3.dropload({
            scrollArea:$listM3,
            loadDownFn:function(me) {
                Common2.toast('请求中',Setting.staticRoot+'/images/pages/ui/loading.png',false);
                $.post(Setting.apiRoot1 + '/u/userExpiredPoductList.p2p',
                    {'userId':userId, 'loginToken':sessionStorage.getItem('loginToken'), 'pageNum':count},
                    function(res) {
                        $('#toastMessage').remove();
                        Common.ajaxDataFilter(res,function(res) {
                            if(res.code == 1) {
                                if(res.data.investList.length > 0) {
                                    for(var i = 0;i < res.data.investList.length;i++){
                                        _expiredList.push(res.data.investList[i]);//已退出
                                    }
                                    expired(res.data.investList,count);
                                    count++;
                                    me.resetload();
                                } else {
                                   if(count == 1) {
                                       noData($('.dueHascontent'));
                                   }
                                    // 锁定
                                    me.lock();
                                    // 无数据
                                    me.noData(true);
                                    return false;
                                }
                            } else {
                                noData($('.dueHascontent'));
                                // 锁定
                                me.lock();
                                // 无数据
                                me.noData(true);
                                return false;
                            }
                        })
                    },'json'
                );
            }
        });
        $('.dropload-down').remove();
    }
});

function jumpAsset(index,financeId){
    var data = '';
    if(index == 1){
        data = _expiredList; //已到期
    }else{
        data = _noList;  //未到期
    }
    for(var i=0;i<data.length;i++){
        if(data[i].financeId==financeId){
            window.location.href = '../../pages/my-account/regular/regularAsset.html?financeId='+ financeId;
        }
    }
}

function jumpcoupon(financeId,userId,redays){

    var $Id = $('#use' + userId);
     for(var i=0;i<_noList.length;i++){
            if(_noList[i].financeId==financeId){
                var restWeight=_noList[i].restWeight;
                var maxWeight=_noList[i].maxWeight;
                var _amount = $('#' + financeId).html();
                var _endtime = _noList[i].endtime;
                var _end = new Date(_endtime);
                var _nowtime = new Date();
                var _now = (_end.getTime()-_nowtime.getTime())/1000;
                var day = parseInt(_now / (24*60*60));
                window.location.href = '../../pages/my-account/account-coupon.html?financeId='+ financeId+'&restWeight='+restWeight+'&maxWeight='+maxWeight + '&amount=' + _amount + '&rate=' + _noList[i].rate + '&day=' + day + '&redundantDay=' + (day-redays) ;
            }
    }
    
     event.stopPropagation(); 
}
