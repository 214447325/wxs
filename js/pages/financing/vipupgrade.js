/**
 * Created by User on 2018/3/20.
 * 会员升级页面（兼容ios）
 */

var Common4 = {};
$.extend(Common4,{
    /**
     * 判断返回结果是不是为-99，如果是从新登录或者刷新
     * @param data
     * @param callback
     */
    ajaxDataFilter: function(data, callback){
        var param = Common.getParam();
        var type = param.type;
        // 获取uuid 判断是否有uuid
        if(data.code == -99){
            if(type == 2) {
                iOS.HtmlJumpLogin();
            } else {
                var weixin = sessionStorage.getItem("uuid");
                if(weixin!=undefined && weixin!=null && weixin.length>10){
                    Common.weixinLogin(weixin);
                }else{
                    sessionStorage.clear();
                    Common.toLogin();
                }
            }
        }
        callback(data);
    }
});
$(function() {
    var param = Common.getParam();
    var type = param.type;
    var userId;
    var loginToken;
    //type为2说明是ios，从地址栏获取用户的uid和loginToken
    if(type == 2) {
        userId = param.uid;
        loginToken = param.loginToken;
    } else {
        userId = sessionStorage.getItem('uid');
        loginToken = sessionStorage.getItem('loginToken');
    }
    if(!userId){
        // ios APP跳转到登录
        if(type == 2){
            iOS.HtmlJumpLogin();
        }else{
            Common.toLogin();
            return false;
        }
    }


    var pid;
    //定义全局
    var pmount;//可投余额(标的余额)
    var maxInvestAmount;//最大投资金额
    var minInvestAmount;//最小起投金额
    var maxRate;//最大利率
    var minRate;//最小利率
    var addRate;//加息
    var cycle;//周期时长
    var cycleType;//周期类型
    var annualizedAssets;//用户投资任意定期的投资年化
    var maxPrivilege;//最大特权
    var haveuse;//已经勾选
    var clicktype;//类型
    var accountAmt;//账户余额
    var money;//用户投资输入框的金额值
    var expect;//每月收益的值
    var percent;
    var regularRate;
    var addInterestRate;//投资加息
    var maxInvestTotal;//用户距离下个等级的投资额
    var cp_data;//{pid,amount,expect}
    var indata = {};
    var activityRate;
    var investTerm;
    var $balanceAccount = $('.balanceAccount');
    var maxAnnualizedAssets;//距离下个等级的投资年化额
    var jxspan;
    var vipList;//获取会员等级的列表
    var vipRank;//当前的等级
    var investTotal;//该用户目前的投资额
    var $vip_scroll_text011 = $('.vip_scroll_text011');
    var $vip_scroll_text012 = $('.vip_scroll_text012');
    var $vip_card = $('.vip_card');//加息券会员弹框
    var userCard = [];//该用户选择使用的加息券列表
    var $vip_card_box1 = $('.vip_card_box1');//加息券弹框的内容部分
    var couponData;
    var interest = 0;
    var $payMoney = $('.vip_button');
    var size;

    var $input = $('.input');
    //输入框默认的值为1000元
    $input.val(1000);

    //根据用户的ID和loginToken获取改产品的产品ID、
    // 会员等级、投资额以及需要升到下个等级的投资额和投资年化列表
    $.ajax({
        url: Setting.apiRoot1 + '/u/vipUpgradeBuyLoan.p2p',
        type:"post",
        dataType:'json',
        async:false,
        data: {
            userId:userId,
            loginToken:loginToken
        }
    }).done(function(res) {
        Common4.ajaxDataFilter(res, function(data) {
            if(data.code == 1) {
                var _data = data.data;
                pid = _data.prodId;//产品ID
                vipList = _data.vipList;//会员列表
                vipRank = _data.vipRank;//当前的等级
                investTotal = _data.investTotal;//该用户的投资额
                annualizedAssets = _data.annualizedAssets;//用户投资任意定期的投资年化

                /**
                 * 如果会员等级不为最高等级4级（也就是钻石会员）页面的默认显示
                 * vipRank：该用户当前的会员等级
                 * maxAnnualizedAssets[全局变量] ：升级下个等级需要的投资年化额
                 * $vip_scroll_text011[全局变量]：进度条左边的文案，当前的会员等级
                 * $vip_scroll_text012[全局变量]：进度条右边的文案，下个会员的等级
                 */

                if(vipRank != 4) {
                    //距离下个等级的年化额
                     maxAnnualizedAssets = vipList[(parseInt(vipRank))].maxAnnualizedAssets;
                    $vip_scroll_text011.html(vipList[vipRank].remark);
                    $vip_scroll_text012.html(vipList[(parseInt(vipRank) + 1)].remark)
                } else {
                    $('.vip_box6').html('恭喜您已是钻石会员，继续投资享更多惊喜！');
                    $vip_scroll_text011.html(vipList[(parseInt(vipRank) - 1)].remark);
                    $vip_scroll_text012.html(vipList[vipRank].remark)
                }
            } else {
                Common2.toast(res.message);
                return false;
            }
        })
    }).fail(function() {
        Common2.toast('网络异常',Setting.staticRoot+'/images/pages/ui/wifi.png');
        return false
    });


    /**
     * 根据该产品的ID、用户的ID和loginToken获取该产品的详细信息
     * loanId: pid（从接口vipUpgradeBuyLoan.p2p中获取）
     */
    $.ajax({
        url: Setting.apiRoot1 + '/u/queryMyProductActions.p2p',
        type:"post",
        dataType:'json',
        async:false,
        data: {
            userId:userId,
            loginToken:loginToken,
            loanId: pid
        }
    }).done(function(res) {
        Common4.ajaxDataFilter(res, function(data){
            if(data.code == 1){
                /**
                 * 如果请求成功获取该产品的详细信息
                 * pmount[全局变量]：标的余额
                 * maxInvestAmount[全局变量]：最大投资金额
                 * minInvestAmount[全局变量]：最小起投金额
                 * maxRate[全局变量]：最大利率
                 * minRate[全局变量]：最小利率
                 * addRate[全局变量]：加息
                 * cycle[全局变量]：周期时长
                 * cycleType[全局变量]：周期类型
                 *
                 */
                var data = res.data;
                pmount = parseFloat(data.canBuyAmt);//可投余额(标的余额)
                maxInvestAmount = parseFloat(data.maxBuyAmt);//最大投资金额
                minInvestAmount =parseFloat(data.minBuyAmt);//最小起投金额
                maxRate = data.maxRate;//最大利率
                minRate = data.minRate;//最小利率
                addRate = data.addRate;//加息
                cycle = data.loanCycle;//周期时长
                cycleType = data.cycleType;//周期类型
                maxPrivilege = data.maxPrivilege;//当前去除已参加的其他活动后的总权重
                activityRate = data.activityRate;//尊享加息标
                $('.investTerm').html(data.investTerm);
            } else {
                Common2.toast(res.message);
                return false;
            }
        });
    }).fail(function() {
        Common2.toast('网络异常',Setting.staticRoot+'/images/pages/ui/wifi.png');
        return false
    });

    $.ajax({
        url:Setting.apiRoot1 + '/queryAction1.p2p',
        type:"post",
        dataType:'json',
        async:false,
        data: {
            loanId:pid
        }
    }).done(function(res) {
        Common4.ajaxDataFilter(res,function() {
            if(res.code==1){
                indata = res.data;
                if(indata.length > 0) {
                    for (var i = 0; i < indata.length; i++) {
                        if( Number(indata[i].minAmt) <= Number(money) && Number(money) < Number(indata[i].maxAmt) ) {
                            addInterestRate = indata[i].addRate;
                            break;
                        }else{
                            addInterestRate = 0;
                        }
                    }
                    regularRate=parseFloat(minRate)+parseFloat(addRate)+parseFloat(addInterestRate);
                } else {
                    regularRate=parseFloat(minRate)+parseFloat(addRate);
                }
                regularRate=parseFloat(minRate);
                $('.regularRate').html(parseFloat(regularRate).toFixed(2) + '%');
            }else{
                Common2.toast(res.message);
                return false;
            }
        })
    }).fail(function() {
        Common2.toast('网络异常',Setting.staticRoot+'/images/pages/ui/wifi.png');
        return false
    });

    /**
     * 根据用户的信息等到用户购买的余额信息
     *accountAmt[全局变量]：用户的账户余额
     *
     */
    $.ajax({
        url:Setting.apiRoot1 + '/u/queryMyAccountInfo.p2p',
        type:"post",
        async:false,
        dataType:'json',
        data:{
            userId: userId,
            loginToken:loginToken
        }
    }).done(function(res){
        Common4.ajaxDataFilter(res,function(){
            if(res.code==1){
                var data = res.data;
                accountAmt = data.accountAmt;//账户余额
                $balanceAccount.text((Common.comdify(pmount)));//标的余额

            }else{
                Common2.toast(res.message);
                return false;
            }
        })
    }).fail(function(){
        Common2.toast('网络异常',Setting.staticRoot+'/images/pages/ui/wifi.png');
        return false
    });


    $input.keyup(function() {
        jxspan = 0;
        var $add = $('.add');

        if($add.hasClass('adddisable')) {
            $add.removeClass('adddisable');
        }
        donetyp()
    });

    //点击加号
    $('.add').click(function() {
        if($('.add').hasClass('adddisable')) {
            return false;
        }
        var input_val = $input.val();
        if(input_val == undefined || input_val == null || input_val == '') {
            input_val = 0;
        } else {
            input_val = parseFloat(input_val);
        }
        //点击加号只能100相加
        input_val = input_val + 100;
        $input.val(parseFloat(input_val).toFixed(0));
        donetyp();
    });
    $('.jian').click(function() {
        var input_val = parseFloat($input.val());

        var m = input_val - 100;
        if(m <= 100 ) {
            $input.val(100);
            $('.jian').addClass('jiandisable');
            return false;
        } else {
            $input.val(parseFloat(m).toFixed(0));
        }

        var $add = $('.add');
        if($add.hasClass('adddisable')) {
            $add.removeClass('adddisable');
        }
        donetyp();
    });

    var _inputVal = $input.val();
    if(_inputVal != null && _inputVal != '' && _inputVal != undefined) {
        donetyp();
    }

    $input.focusout(function() {
        if((money.length > 1 && money <= 0 )|| money.length <=0) {
            $input.val('');
        }
    });

    function donetyp() {
        var $add = $('.add');
        var pmounts = parseInt(pmount/100 + '')*100;
        var maxInvestAmounts = parseInt(maxInvestAmount/100 + '')*100;
        var accountAmts = parseInt(accountAmt/100 + '')*100;
        money = $.trim($input.val());//输入金额

        if(money == undefined || money == null || money == '') {
            $('.jian').addClass('jiandisable');
        }

        // 第一个数字为0时
        if(!Common.reg.money.test(money)) {
            $input.val('');
        }

        if(money.length > 1 && money != 0) {
            if(/\./.test(money)){
                Common2.toast(minInvestAmount +'元起投，递增金额100');
                $input.blur();
                $input.val('');
            }
        }


        if (money>pmounts && accountAmts > pmounts) {//输入金额>标的余额
            Common2.toast('当前已超出剩余可投金额');
            $input.val(pmount);
            $add.addClass('adddisable');
            money = pmount;
        }


        if (money>pmounts && accountAmts <= pmounts) {//输入金额>标的余额
            Common2.toast('当前已超出剩余可投金额');
            $add.addClass('adddisable');
            $input.val(pmount);
            money = pmount;
        }
        if(money>maxInvestAmounts){//输入金额>最大投资金额
            Common2.toast('当前已超出剩余可投金额');
            $add.addClass('adddisable');
            $input.val(maxInvestAmounts);
            money = maxInvestAmounts;
        }

        if(money > 0) {
            $('.jian').removeClass('jiandisable')
        }


        if( cycleType==1){
            percent = cycle / 365;//日
        }else if(cycleType==2){
            percent = cycle*30 /365;//月
        }else if(cycleType == 3){
            percent =cycle*365 /365;//年
        }else if(cycleType == 4){
            percent = cycle*7 /365;//周
        }
        ifAddInterest();

        expect =parseFloat(percent*money*regularRate/100);
        sessionStorage.setItem('_expect',expect);

        //输入投资金额的同时改变{pid,amount,expect,interest礼券收益}
        cp_data={
            pid:pid,
            amount:money,
            expect:expect,
            cycle:cycle,
            interest:interest,
            regularRate:regularRate,
            pagebuy:0,
            justforuse:maxPrivilege
        };

        viewCoupon();
    }

    function  ifAddInterest(){
        if (indata.length>0) {
            for (var i = 0; i < indata.length; i++) {
                if( Number(indata[i].minAmt) <= Number(money) && Number(money) < Number(indata[i].maxAmt) ) {
                    addInterestRate = indata[i].addRate;
                    break;
                }else{
                    addInterestRate = 0;
                }
            }
            regularRate=parseFloat(minRate)+parseFloat(addRate)+parseFloat(addInterestRate);
        }else{
            regularRate=parseFloat(minRate)+parseFloat(addRate);
        }
        if(activityRate != 0 && (investTerm == 8 || investTerm == 12)){
            regularRate=parseFloat(minRate);
        }
    }

    //输入金额>起投金额之后
    //查找可用加息券 可用投资红包 可用体验金

    function viewCoupon(){
        if (money>=minInvestAmount) {
            $('.addcoupon').addClass('canclick').find('span').removeClass('used');//.html('全程加息券不可和其他奖励同时使用')加息券一栏字体变黑
            $.ajax({
                url:Setting.apiRoot1 + '/u/checkUsefulRateCoupon.p2p',
                type:"post",
                async:false,
                dataType:'json',
                data:{
                    userId: userId,
                    loginToken:loginToken,
                    prodId:pid,
                    amount:money
                }
            }).done(function(res){
                Common4.ajaxDataFilter(res,function(){
                    if(res.code==1){
                        var data=res.data;
                        size=data.size;
                        sessionStorage.setItem('_size',size);
                        if (size>0) {
                            $vip_card.addClass('visible');
                            $vip_card_box1.html('<div class="vip_card_box01"></div>');
                            removegift();
                            $(".user_card").html('选择使用优惠券');
                        } else {
                            $(".user_card").html('无可用优惠券');
                            $vip_card.removeClass('visible');
                            removegift();
                            return false;
                        }
                    }else{
                        return false;
                    }
                })
            }).fail(function(){
                Common2.toast('网络异常',Setting.staticRoot+'/images/pages/ui/wifi.png');
                return false
            });
        }else{
            $(".user_card").removeClass('used').html('无可用优惠券');
            $vip_card.removeClass('visible');
        }
    }

    /*清除礼券收益*/
    function removegift(){
        //$('#jxspan').html('0.00');
        jxspan = 0;
        sessionStorage.removeItem('vjr_selectedConpon_id');
        sessionStorage.removeItem('vjr_selectedConpon');
        sessionStorage.removeItem('slreValue');
        sessionStorage.removeItem('haveuse');
        sessionStorage.removeItem('clicktype');
        sessionStorage.removeItem('vjr_couponIds');
    }

    //点击加息券按钮
    $('.user_card').click(function() {
        if($vip_card.hasClass('visible')) {
            $vip_card.show();
            getCard();
        } else {
            $vip_card.show();
            var _cardHtml = '';
            _cardHtml += '<div class="vip_card_box1_no">';
            _cardHtml += '<div class="vip_card_box1_no1"></div>';
            _cardHtml += '<div class="vip_card_box1_no2">暂无可使用优惠券</div>';
            _cardHtml += '</div>';
            $vip_card_box1.html(_cardHtml)
        }
    });

    $('.vip_banner_div2').click(function() {
        if(type == 2) {
            window.location.href = Setting.staticRoot + '/pages/my-account/privilege/rule.html?uid=' + userId + '&loginToken=' + loginToken+'&type=2';
        } else {
            window.location.href = Setting.staticRoot + '/pages/my-account/privilege/rule.html';

        }
    });

    //点击加息券弹框的取消按钮
    $('.vip_close').click(function() {
        $vip_card.hide();
    });

    function getCard() {
        Common2.toast('请求中',Setting.staticRoot+'/images/pages/ui/loading.png',false);
        $.ajax({
            url:Setting.apiRoot1 + '/u/usefulRateCoupon.p2p',
            type:'post',
            dataType:'json',
            data:{
                userId : userId,
                prodId:pid,
                loginToken:loginToken
            }
        }).done(function(res) {
            $('#toastMessage').remove();
            Common4.ajaxDataFilter(res,function() {
                couponData = res.data.coupons;
                var _prDataValue = '';
                if (couponData.length>0) {
                    for(var i = 0; i < couponData.length; i++) {
                        _prDataValue = '';
                        //天数加息
                        if(couponData[i].type == 1) {
                            _prDataValue = parseFloat(parseFloat(parseFloat(money) * parseFloat(couponData[i].privilege) * couponData[i].cycleTime / 36500).toString().match(/^\d+(?:\.\d{0,2})?/)).toFixed(2);
                            couponData[i].couponId = _prDataValue;
                        }
                        //全程加息
                        if(couponData[i].type == 2) {
                            _prDataValue = parseFloat(parseFloat(parseFloat(money) * parseFloat(couponData[i].privilege) * parseFloat(cycle*7) / 36500).toString().match(/^\d+(?:\.\d{0,2})?/)).toFixed(2);
                            couponData[i].couponId = _prDataValue;
                        }
                        //体验金
                        if(couponData[i].type == 3) {
                            _prDataValue = parseFloat(parseFloat(parseFloat(money) * _regularRate * couponData[i].cycleTime / 36500).toString().match(/^\d+(?:\.\d{0,2})?/)).toFixed(2);
                            couponData[i].couponId = _prDataValue;
                        }
                        //投资红包
                        if(couponData[i].type == 5) {
                            _prDataValue = parseFloat(parseFloat(couponData[i].privilege).toString().match(/^\d+(?:\.\d{0,2})?/)).toFixed(2);
                            couponData[i].couponId = _prDataValue;
                        }
                    }
                    for(var i = 0; i < couponData.length; i++) {
                        for(var j = i + 1; j < couponData.length;j++) {
                            if(couponData[i].couponId < couponData[j].couponId) {
                                var tmp = couponData[i];
                                couponData[i] = couponData[j];
                                couponData[j] = tmp;
                            }
                        }
                    }
                    var _cardhtml = '';
                    for(var i = 0; i < couponData.length; i++) {
                        if(couponData[i].type == 1 || couponData[i].type == 2) {
                            _cardhtml += '<div class="vip_card_box11 card1">';
                            _cardhtml += '<div class="vip_card_box111">';
                            _cardhtml += '<div class="vip_card_box1111">' + couponData[i].privilege + '<a>%</a></div>';
                            if(couponData[i].type == 1) {
                                _cardhtml += '<div class="vip_card_box1112">天数加息券</div>';
                            }

                            if(couponData[i].type == 2) {
                                _cardhtml += '<div class="vip_card_box1112">全程加息券</div>';
                            }
                            _cardhtml += '</div>';
                        } else {
                            _cardhtml += '<div class="vip_card_box11 card2">';
                            _cardhtml += '<div class="vip_card_box111">';
                            _cardhtml += '<div class="vip_card_box1111">' + couponData[i].privilege + '</div>';
                            if(couponData[i].type == 3) {
                                _cardhtml += '<div class="vip_card_box1112">体验金</div>';
                            }

                            if(couponData[i].type == 5) {
                                _cardhtml += '<div class="vip_card_box1112">投资红包</div>';
                            }
                            _cardhtml += '</div>';
                        }
                        _cardhtml += '<div class="vip_card_box112">';
                        _cardhtml += '<div class="vip_card_box1121">';
                        _cardhtml += '<div class="vip_card_box11211">加入' + Common.comdify(couponData[i].minUseAmount) + '元可使用</div>';
                        _cardhtml += '<div class="vip_card_box11212">限' + $('.investTerm').html() + '定期产品使用</div>';
                        _cardhtml += '</div>';
                        _cardhtml += '<div class="vip_card_box1122">';
                        _cardhtml += '<a class="vip_card_box11221 useCard" weight="' + couponData[i].weight + '" cpid="' + couponData[i].id + '" href="javascript:;"></a>';
                        _cardhtml += '</div>';
                        _cardhtml += '</div>';
                        _cardhtml += '</div>';
                        }
                    $('.vip_card_box01').html(_cardhtml);
                    var _useArrayID = JSON.parse(sessionStorage.getItem('vjr_selectedConpon'));
                    if(_useArrayID != undefined && _useArrayID != null && _useArrayID != '') {
                        $('a[cpid=' + _useArrayID[0].id + ']').addClass('vipCardTrue');
                    }


                    $('.vip_card_box11').click(function() {
                        var _vipid = $(this).find('.useCard').attr('cpid');
                        var $vipid = $('a[cpid=' + _vipid + ']');
                        if($vipid.hasClass('vipCardTrue')) {
                            $vipid.removeClass('vipCardTrue');
                            if (size>0) {
                                $vip_card.addClass('visible');
                                $vip_card_box1.html('<div class="vip_card_box01"></div>');
                                $(".user_card").html('选择使用优惠券');
                            } else {
                                $(".user_card").html('无可用优惠券');
                                $vip_card.removeClass('visible');
                            }
                            $('.vip_box5').css({'color':'#9B9B9B'});
                            $vip_card.hide();
                            removegift();
                            return false;
                        }
                        for(var i = 0;i < couponData.length; i++) {
                            if(couponData[i].id == _vipid) {
                                userCard = couponData[i];
                            }
                        }

                        var _useArray = [];
                        var vjr_couponIds = [];
                        _useArray.push((userCard.id).toString());
                        vjr_couponIds.push(userCard.id);
                        var cards = [];
                        cards.push(userCard);
                        var selectedConpon = JSON.stringify(cards);
                        sessionStorage.setItem('vjr_selectedConpon_id',JSON.stringify(_useArray));
                        sessionStorage.setItem('vjr_selectedConpon',selectedConpon);
                        sessionStorage.setItem('slreValue', (userCard.couponId));
                        sessionStorage.setItem('haveuse',userCard.weight);
                        sessionStorage.setItem('clicktype',1);
                        sessionStorage.setItem('vjr_couponIds',JSON.stringify(vjr_couponIds));
                        if(userCard.length == 0) {
                            sessionStorage.setItem('vjr_selectedConpon_id',0);
                        }
                        getCardHtml();
                        $vip_card.hide();
                    })

                }else{
                    var _cardHtml = '';
                    _cardHtml += '<div class="vip_card_box1_no">';
                    _cardHtml += '<div class="vip_card_box1_no1"></div>';
                    _cardHtml += '<div class="vip_card_box1_no2">暂无可使用优惠券</div>';
                    _cardHtml += '</div>';
                    $vip_card_box1.html(_cardHtml)
                }
            })
        }).fail(function() {
            $('#toastMessage').remove();
            Common2.toast('网络连接失败！');
            return false;
        })
    }
    getCardHtml();
    function getCardHtml() {
       var vjr_selectedConpon = JSON.parse(sessionStorage.getItem('vjr_selectedConpon'));
        if(vjr_selectedConpon != undefined && vjr_selectedConpon != null && vjr_selectedConpon != '') {
            var vjr_type = vjr_selectedConpon[0].type;
            var vjr_privilege = vjr_selectedConpon[0].privilege;
            var $user_card = $('.user_card');
            var _text = '天数加息券';
            if(vjr_type == 1) {
                _text = vjr_privilege + '%天数加息券';
            }

            if(vjr_type == 2) {
                _text = vjr_privilege + '%全程加息券';
            }

            if(vjr_type == 3) {
                _text =  vjr_privilege + '元体验金';
            }
            if(vjr_type == 5) {
                _text = vjr_privilege + '元投资红包';
            }

            $user_card.html(_text).css({'color':'#D7BB88'});
        }
    }

    //点击立即加入按钮
    $payMoney.click(function() {
        var $this = $(this);
        if ($this.hasClass('disabled')) {
            return false;
        }
        money = $.trim($input.val());
        if (money <= 0) {
            Common2.toast('输入的金额需大于0元');
            return false;
        }

        if(money.length >= 3  && money != 0 && /\./.test(money/100)) {
            Common2.toast(minInvestAmount +'元起投，递增金额100');
            return false;
        }

        if(money % 100 != 0) {
            Common2.toast(minInvestAmount +'元起投，递增金额100');
            $input.blur();
            $input.val(1000);
        }

        if (!Common.reg.money.test(money)) {
            Common2.toast('输入金额无效！');
            return false;
        }
        if (money < minInvestAmount) {
            Common2.toast('投资金额不能小于起投金额'+minInvestAmount+'元');
            return false;
        }
        if (money >accountAmt) {
            //Common2.toast('当前可用余额不足');
            confirm('当前可用余额不足',function() {
                window.location.href = Setting.staticRoot + '/pages/my-account/topup-cash.html'
            });
            $('.btn-box2').html('<a href="javascript:;" class="btn btn-border btn-sm cancel">取消</a><a href="javascript:;" class="btn btn-default btn-sm submit">前往充值</a>')
            return false;
        }
        if(parseFloat(money) >pmount.toFixed(2)) {
            Common2.toast('当前已超出剩余可投金额');
            $input.val(parseInt(maxInvestAmount/100 + '')*100);
            return false;
        }
        if (parseFloat(money) <minInvestAmount.toFixed(2)) {
            Common2.toast('投资金额不能小于最小可投金额');
            return false;
        }
        if (parseFloat(money) >maxInvestAmount.toFixed(2)) {
            Common2.toast('当前已超出剩余可投金额');
            $input.val(maxInvestAmount);
            return false;
        }
        if (!($('.vip_rules_01_img').hasClass('vip_img'))) {
            Common2.toast('请先勾选并同意平台服务协议');
            return false;
        }

        var _useArrayID = JSON.parse(sessionStorage.getItem('vjr_selectedConpon'));
        if(_useArrayID != undefined && _useArrayID != null && _useArrayID != '') {
            if(_useArrayID.minUseAmount > money) {
                Common2.toast('投资额大于' + _useArrayID.minUseAmount + '可使用该加息券');
                return false;
            }
        }

        var post = {
            investAmt : money,
            prodId : pid
        };
        sessionStorage.setItem('buy-pro', JSON.stringify(post));
        if(parseFloat(money) <= parseFloat(maxInvestAmount)) {
            payHtml();
        } else {
            Common2.toast('不能大于上限' + maxInvestAmount + '元');
            $input.val(maxInvestAmount);
        }
    });

    /*输入密码页面*/
    function payHtml(){
        sessionStorage.setItem('cycle',cycle);
        var _ctycpe = JSON.parse(sessionStorage.getItem('vjr_selectedConpon'));
        var ctype = 0;
        if(_ctycpe != undefined && _ctycpe != null && _ctycpe != '') {
            ctype = _ctycpe.type;
        }
        sessionStorage.setItem('clicktype',ctype);
        if(type == 2) {
            var url = './pay3.html';
            $.ajax({
                url:url,
                dataType:'html',
                async:false,
                success:function(e){
                    $('.wrapper').append(e);
					var pay3Map = {
						userId:userId,
						loginToken:loginToken
					};
                    pay3(pay3Map);
                }
            })
        } else {
            $.ajax({
                url:'./pay2.html',
                dataType:'html',
                async:false,
                success:function(e){
                    $('.wrapper').append(e)
                }
            })
        }
    }


    //点击定期投资协议
    $('.vip_rules_011').click(function() {
        if(type == 2) {
            iOS.HtmlJumpRegularBasisVCNew();
        } else {
        var fullName = sessionStorage.getItem('realname');
        var showName = "***";
        if(fullName==null || fullName==undefined || fullName.length<1){
        }else{
            var fisrtName = fullName.substr(0,1);
            if (fullName.length==2) {
                showName = fisrtName+'*';
            }else if(fullName.length==3){
                showName = fisrtName+'**';
            }else if(fullName.length==4){
                showName = fisrtName+'***';
            }//名字
        }
        var fullPhone = sessionStorage.getItem('uname');
        var phoneNum = "***********";
        if(fullPhone==null || fullPhone==undefined || fullPhone.length<11){
        }else{
            var _hide_number = fullPhone.substr(3,4);
            phoneNum = fullPhone.replace(_hide_number,'****');//手机
        }

        var fullCertNo = sessionStorage.getItem('cardNum');
        var cardNum = "***************";
        if(fullCertNo==null || fullCertNo==undefined || fullCertNo.length<15){

        }else{
            var _front_cardnum = fullCertNo.substr(0,3);
            var _last_cardnum = fullCertNo.substr(14,4);
            cardNum = _front_cardnum+'***********'+_last_cardnum;//身份证
        }
        window.location.href = "regular-agreement.html?uName="+showName+"&uMobile="+phoneNum+"&uSFZ="+cardNum;
        }
    });

    //点击风险提示
    $('.vip_rules_012').click(function() {
        if(type == 2) {
            window.location.href = 'risk.html';
        } else {
            window.location.href = 'risk.html?uid=' + userId + '&loginToken=' + loginToken+'&type=2';
        }

    });

    //点击同意之前的按钮
    $('.vip_rules_01_img').click(function() {
        var $this = $(this);
        if($this.hasClass('vip_img')) {
            $this.removeClass('vip_img');
        } else {
            $this.addClass('vip_img');
        }
    });

    var picker = new mui.PopPicker();
    var arrayList = [];
    var vip_list; //用户当前的Vip等级的一个集合
    var _vipRank;
    for(var i = 0; i < vipList.length; i++) {
        if(vipRank <= vipList[i].rank) {
            var list = {};
            list.maxAnnualizedAssets = vipList[i].maxAnnualizedAssets;
            list.maxInvestTotal = vipList[i].maxInvestTotal;
            list.minAnnualizedAssets = vipList[i].minAnnualizedAssets;
            list.minInvestTotal = vipList[i].minInvestTotal;
            list.rank = vipList[i].rank;
            list.remark = vipList[i].remark;
            list.value = i;
            list.text = vipList[i].remark;
            arrayList.push(list);
            if(vipList[i].rank == vipRank) {
                _vipRank = i;
                vip_list = list;//用户当前的Vip等级的一个集合
            }
        }
    }
    //用来控制标题上的小LOG
    $('.vip_img_icon').attr({'src':'../../images/pages/financing/vip/' + vip_list.rank + '.png'});
    //用来控制标题
    $('.vip_banner_div12').html(vip_list.remark);
    vipShow(0);
    if(vipRank != 4) {
        arrayList.splice(0,1);
        picker.setData(arrayList);
        $('.mui-poppicker-btn-ok').html('完成');
        $('.mui-poppicker-btn-cancel').remove();
        var showUserPickerButton = document.getElementById('showUserPicker');
        var userResult = document.getElementById('userResult');
        showUserPickerButton.addEventListener('tap', function(event) {
            picker.pickers[0].setSelectedIndex(_vipRank);
            picker.show(function(items) {
                vip_list = items[0];
                if(vip_list.rank != vipRank) {
                    vipShow(1);
                }
            });
        }, false);
    }


    //页面显示
    function vipShow(number) {
        var i;
        if(number == 0) {
            i = parseInt((vip_list.rank)) + 1;
        } else {
            i = parseInt((vip_list.rank));
        }

        if(vipRank == 4) {
            $('.vip_box11').html(vipList[4].remark);
            $('.vip_box12').remove();
            //minInvestTotal = vip_list.minInvestTotal;
        } else {
            //minInvestTotal = vipList[i].minInvestTotal;
        }

        var _investTotal;
        var progressValue;
        var _vip_left;

        if(vipRank != 4) {
            var _vip = vip_list.rank;
            if(number == 0) {
                //根据年化额计算投资额
                maxAnnualizedAssets = vip_list.maxAnnualizedAssets;
                //距离下个等级需要的投资额
                maxInvestTotal = vip_list.maxInvestTotal;
            } else {
                //根据年化额计算投资额
                maxAnnualizedAssets = vipList[_vip].minAnnualizedAssets;
                //距离下个等级需要的投资额
                maxInvestTotal = vipList[_vip].minInvestTotal;
            }

            var _annualizedAssets = 0;
            //用户的投资年华额
            if(annualizedAssets >= 0) {
                //距离用户升级为下个会员等级需要的年华额
                _annualizedAssets = maxAnnualizedAssets - annualizedAssets;
            }

            /**
             * investTotal：用户的投资额
             * maxInvestTotal：距离升级的投资额
             */
            //判断投资额是否满足升级投资额
            if(investTotal < maxInvestTotal) {
                //判断用户已有的投资年化额是否大于升级需要的年化额如果annualizedAssets大，就判断升级需要的投资额
                if(maxAnnualizedAssets < annualizedAssets ) {
                    //距离升到下个等级需要的投资额
                    _investTotal = maxInvestTotal - investTotal;
                } else {
                    //如果maxAnnualizedAssets大，根据年化额得到距离下个等级需要的投资额
                    _investTotal = _annualizedAssets * 365 / (cycle * 7);
                    //升级的最大投资额减去用户已经投资的金额和根据升级需要的投资年化额得到的，投资额作比较
                    if((maxInvestTotal - investTotal) > _investTotal) {
                        //如果条件成立，说明用户还没有达到升级的权利，取差值
                        _investTotal = maxInvestTotal - investTotal;
                    }
                }
                //progressValue = parseFloat((258 / maxInvestTotal * investTotal) + 16).toFixed(2);
                //_vip_left = parseFloat((258 / maxInvestTotal * investTotal) + 16 - 19).toFixed(2);
            } else {
                //如果投资额大于升级需要的投资额，计算投资年化额
                _investTotal = _annualizedAssets * 365 / (cycle * 7);
            }
            progressValue = parseFloat(258 * (investTotal / (_investTotal + investTotal)) + 16).toFixed(2);
            _vip_left = parseFloat(258 * (investTotal / (_investTotal + investTotal)) + 16 -19).toFixed(2);
            _investTotal = parseFloat(_investTotal).toFixed(2);

            if(_investTotal > 0) {
                $('.vip_box61').html(Common.comdify(_investTotal));
            } else {
                $('.vip_box61').html(0);
            }
            $('.vip_box11').html('升级至' + vipList[i].remark);
            $vip_scroll_text011.html(vipList[vipRank].remark);
            $vip_scroll_text012.html(vipList[i].remark);
        } else {
            $vip_scroll_text011.html(vipList[vipRank-1].remark);
            $vip_scroll_text012.html(vipList[vipRank].remark);
        }

        /**
         * 投资额进度条
         * maxInvestTotal:距离下一个等需要的最大投资额，后台返的
         * investTotal:该用户的目前已经投资的金额
         *
         */

        if(investTotal > 0) {
            //根据公式计算进度条的进度
            if(_vip_left >= 226) {
                _vip_left = 226
            }

            if(progressValue >= 274) {
                progressValue = 290;
                _vip_left = 253;
                $('.vip_scroll_03 ').addClass('vip_icon');
            } else {
                $('.vip_scroll_03 ').removeClass('vip_icon');
            }

            if(vipRank == 4) {
                progressValue = 290;
                _vip_left = 253;
                $('.vip_scroll_03 ').addClass('vip_icon');
            }

            var $process = $('.process');
            var $vipsan = $('.vip_san');
            var $vips02 = $('.vip_scroll_02 ');

            var _w = $('html').width();
            if(_w > 500) {
                _vip_left = _vip_left - 10;
            }
            $process.width(progressValue + 'px');
            $vipsan.css({'left':_vip_left + 'px'});
            $vips02.addClass('vip_icon');
            if(progressValue < 0 && _vip_left < 0 && _investTotal < 0 ) {
                $process.width('290px');
                $vipsan.css({'left': '253px'});
                $vips02.addClass('vip_icon');
                $('.vip_scroll_03 ').addClass('vip_icon');
            }
        } else {
            $('.process').width('20px');
            $('.vip_san').css({'left':'2px'});
            $('.vip_scroll_02 ').addClass('vip_icon');
        }
    }
});


function pay3(map) {
    var payInfo = sessionStorage.getItem('buy-pro');
    var userId = map.userId;
    var param = Common.getParam();
    var reback = param.reback;
    var cycle = sessionStorage.getItem("cycle");
    var clicktype = sessionStorage.getItem('clicktype');
    var isJoinInvite = param.isJoinInvite;
    var userRateCouponIds='';//加息券、体验金id
    var userRate = '';
    var investCouponId='';//投资红包id
    var invest = '';
    var vjr_selectedConpon =  [];
    vjr_selectedConpon =  sessionStorage.getItem('vjr_selectedConpon');
    if(vjr_selectedConpon != undefined && vjr_selectedConpon != null && vjr_selectedConpon != '') {
        vjr_selectedConpon = JSON.parse(sessionStorage.getItem('vjr_selectedConpon'));
        for(var i = 0; i < vjr_selectedConpon.length; i++) {
            if (vjr_selectedConpon[i].type == 1 || vjr_selectedConpon[i].type == 2) {
                userRateCouponIds = userRateCouponIds + vjr_selectedConpon[i].id + ',';
            }

            if (vjr_selectedConpon[i].type == 3) {
                userRateCouponIds = userRateCouponIds + vjr_selectedConpon[i].id + ',';
            }

            if (vjr_selectedConpon[i].type == 5) {
                investCouponId = investCouponId + vjr_selectedConpon[i].id + ',';
            }
        }

        if(userRateCouponIds != undefined && userRateCouponIds != null && userRateCouponIds != '') {
            userRate = userRateCouponIds.substr(0,userRateCouponIds.length-1);
            userRate.toString();
        }

        if(investCouponId != undefined && investCouponId != null && investCouponId != '') {
            invest = investCouponId.substr(0,investCouponId.length-1);
            invest.toString();
        }
    }


    var $ui_dialog = $('.ui-dialog');
    var $ui_dialogFail = $('.ui-dialogFail');
    var $btn_link  = $('.btn-link',$ui_dialog);
    var $btn_default = $('.btn-default-two',$ui_dialog);
    var $btn_linkFail  = $('.btn-link',$ui_dialogFail);//重新输入
    var $btn_defaultFail = $('.btn-default-two',$ui_dialogFail);//忘记密码



    var $inputBox = $('.input-box');
    var $boxs = $('.box', $inputBox);
    var pass = '';

    if(!userId){
        iOS.HtmlJumpLogin();
        return false;
    }
    if(!payInfo){
        return false;
    }

    payInfo = JSON.parse(payInfo);

    var $pay = $('.page-pay');
    var $money = $('.money');

    $money.text('￥'+parseFloat(payInfo.investAmt).toFixed(2));
    function pay(){
        var pwd = $('input', $inputBox).val();
        var post = {
            investAmt: payInfo.investAmt,
            userId: userId,
            prodId: payInfo.prodId,
            tradePassword: md5(pwd),
            reback: reback,
            isJoinInvite:isJoinInvite,
            userRateCouponIds:userRate,
            investCouponId:invest
        };
        if(param.noviceId){
            post.couponSumAmt = payInfo.investAmt;
            post.couponList = param.noviceId;
        }
        post.loginToken = map.loginToken;



        $.ajax({
            url: Setting.apiRoot1 + '/u/investPurchaseNew.p2p',
            type: 'post',
            dataType: 'json',
            data: post
        }).done(function(res){
            Common4.ajaxDataFilter(res, function(res){
                if(res.code == 1){
                    var payCode = res.code;
                    var bearingTime = res.data.bearingTime;
                    var endTime = res.data.endTime;
                    var newProd = res.data.newProd;
                    var giftCarCoupons = '';
                    if(res.data.giftCarCoupons != null){
                        giftCarCoupons ='&giftCarCoupons=' + res.data.giftCarCoupons;
                    }
                    window.location.href='./payResult.html?payCode=' + payCode + '&bearingTime=' + bearingTime + '&endTime=' + endTime + '&newProd=' + newProd + giftCarCoupons;
                }else if(res.code == -3){
                    Common2.toast('交易密码错误，请重试');
                    $('.ui-alert .dialog-content .btn-box2').css({
                        'margin':'0'
                    });
                    $('.btn-sm').css({
                        'width':'100%',
                        'height':'1rem',
                        'lineHeight':'1rem',
                        'background':'#fff',
                        'fontSize':'0.4533rem',
                        'color':'#0076FF',
                        'margin':'0',
                        'borderTopWidth':'0.0266rem',
                        'borderTopStyle':'solid',
                        'borderColor':'#D8D8D8',
                        'borderRadius':'0 0 0.325rem 0.325rem'

                    })
                    $('.btn-sm').text('重试');
                    $('.btn-sm').click(function(){
                        $('#pay2').show();
                    })
                    $boxs.each(function(index, box){
                        $(this).removeClass('full');
                    });
                    $('#pay2').hide();
                    return false;
                }else if(res.code == -2){
                    Common2.toast(res.message);
                    $('.ui-alert .dialog-content .btn-box2').css({
                        'margin':'0'
                    });
                    $('.btn-sm').css({
                        'width':'100%',
                        'height':'1rem',
                        'lineHeight':'1rem',
                        'background':'#fff',
                        'fontSize':'0.4533rem',
                        'color':'#0076FF',
                        'margin':'0',
                        'borderTopWidth':'0.0266rem',
                        'borderTopStyle':'solid',
                        'borderColor':'#D8D8D8',
                        'borderRadius':'0 0 0.325rem 0.325rem'
                    });
                    $('.btn-sm').text('确定');
                    $('#pay2').remove();
                    return false;

                }else if(res.code == -20){
                    Common2.toast(res.message);
                    $('#pay2').remove();
                    $('.submit').click(function(){
                        window.location.href = "../my-account/setting/problem/problemdetails.html";
                        return false;
                    })
                }else if(res.code == -99){
                    iOS.HtmlJumpLogin();
                    return false;
                }else{
                    sessionStorage.setItem('payCode',res.code);
                    Common2.toast(res.message);
                    $('#pay2').remove();
                }
            });
        }).fail(function(){
            Common2.toast('支付失败，请重试！');
            $('#pay2').remove();
            return false;
        });
    }
    var flag = 0;
    $inputBox.on('keydown input focus blur', 'input', function(e){
        flag = flag + 1;
        var $this = $(this);

        if(e.type == 'keydown'){
            var code = e.keyCode;
            if(code != 8 && (code < 48 || code > 57)){
                return false;
            }
        }
        var val = $.trim( $this.val() );
        pass = val;//parseInt(val);

        isNaN(pass) && ( pass = '' );

        pass = pass + '';
        if(pass.length > 6){
            pass = pass.substring(0, 6);
        }
        if(pass.length < 6){
            flag = 0;
        }
        $inputBox.find('input').val(pass);

        if(e.type == 'focusout'){
            $boxs.removeClass('focus');
        }
        var len = pass.length;
        if(e.type == 'focusin'){
            len == 0 ? (true) : (len = len - 1);
        }
        $boxs.eq(len).addClass('focus').siblings('.focus').removeClass('focus');
        var passArr = pass.split('');
        $boxs.each(function(index, box){
            var $box = $(box);

            if(!!passArr[index]){
                $box.addClass('full');
            }else{
                $box.removeClass('full');
            }
        });
        if(pass.length == 6 && flag == 1){//密码输入完毕
            pay();

        }
    });
    $('.close>img').click(function(){
        $('.backdrop').addClass('hide');
    });

    $('.page-pay img').click(function(){
        $('#pay2').remove();
    })
}
