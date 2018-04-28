/**
 * Created by User on 2016/9/5.
 */

$(function(){
    var userId = sessionStorage.getItem('uid');//获取用户的ID
    var param = Common.getParam();
    var financeId= param.financeId;
    var title = param.title;
    var loType = param.loType;
    $.ajax({
        url:Setting.apiRoot1 + '/u/investDetailInfo.p2p',
        type:"post",
        dataType:'json',
        data:{
            userId:userId,
            loginToken:sessionStorage.getItem('loginToken'),
            financeId:financeId
        }
    }).done(function(res) {
        if(res.code == 1) {
            var _data = res.data;
            $('title').html(_data.title);
            //var regularList = _data.regularList[0];
            var _createTime = _data.startIncomeTime;
            _createTime = _createTime.replace(/-/,'年');
            _createTime = _createTime.replace(/-/,'月');
            _createTime = _createTime + '日';
            var _map = {};
            var _arr = [];
            var _map1 = {};
            //if(loType != 1) {
            _map.amount = Common.comdify(parseFloat(_data.investAmount).toFixed(2));
            _map.createTime = _createTime;
            _map1.text = '加入时间';
            _map1.data1 = _data.investTime;
            _arr.push(_map1);
            _map1={};

            _map1.text = '期限';
            var cycle = _data.cycle;
            _map1.data1 = cycle + '周';
            _arr.push(_map1);
            _map1={};

            _map1.text = '到期日期';
            _map1.data1 = _data.expireTime;
            _arr.push(_map1);
            _map1={};


            _map1.text = '历史年化收益';
            _map1.data1 = _data.yearRate + '%';
            _arr.push(_map1);
            _map1={};

            var _arrs = [];
            var _map2 = {};
            _map1.text = '平台奖励';
            _map1.data1 = 'rup';//点击展开
            _map2.listText = '平台奖励收益率';
            _map2.listData = _data.rewardRate + '%';
            _arrs.push(_map2);
            _map2 = {};
            _map2.listText = '已获奖励';
            _map2.listData = _data.expectRewardAmount + '元';
            _arrs.push(_map2);
            _map2 = {};
            _map1.mtype = 1;
            _map1.lists = _arrs;
            _arr.push(_map1);

            _map1={};

            _map1.text = '回款方式';
            _map1.data1 = 'rup';
            _map1.mtype = 2;
            var repayType = _data.repayType;
            var typetxt = '';
            switch (parseInt(repayType)) {
                case 1:{
                    typetxt = '等额本息';
                    break;
                }
                case 2:{
                    //付息还本 == 周周派息
                    typetxt = '周周派息';
                    break;
                }
                case 3:{
                    typetxt = '一次性还本付息';
                    break;
                }
                case 4:{
                    typetxt = '送奖品，到期返本';
                    break;
                }
            }

            _map1.dataText = typetxt;

            _arr.push(_map1);

            _map.data = _arr;
            _map.loType = loType;

            _map.type = _data.type;//(1,持有中、2,收益中、3,退出中、4,已退出)

            setHtml(_map,_data);
            //}


        } else {
            Common2.toast(res.message);
        }
    }).fail(function() {
        Common2.toast('网络连接失败');
        return false;
    });

    function setHtml(map,data) {
        var repayList = data.repayList;
        var _data = map.data;
        var _dataHtml = '';
        var _liHtml = '';
        for(var i = 0; i < _data.length; i++) {
            if(_data[i].data1 != 'rup') {
                _dataHtml = _dataHtml + '<div class="r-tr">';
                _dataHtml = _dataHtml + '<div class="r-td">' + _data[i].text + '</div>';
                _dataHtml = _dataHtml + '<div class="r-td">' + _data[i].data1 + '</div>';
                _dataHtml = _dataHtml + '</div>';
            } else {
                if(_data[i].mtype == 1) {
                    var _lists = _data[i].lists;
                    _liHtml = '';
                    for(var j = 0; j < _lists.length; j++) {
                        _liHtml = _liHtml + '<li class="lishow" style="display: none">';
                        _liHtml = _liHtml + '<div>';
                        _liHtml = _liHtml + '<div>' + _lists[j].listText + '</div>';
                        _liHtml = _liHtml + '<div style="color:#4A4A4A;">' + _lists[j].listData + '</div>';
                        _liHtml = _liHtml + '</div>';
                        _liHtml = _liHtml + '</li>';
                    }
                    _dataHtml = _dataHtml + '<div class="r-tr rewardbtn" mtype="' + _data[i].mtype + '" style="width:100%;height: auto;">';
                    _dataHtml = _dataHtml + '<ul>';
                    _dataHtml = _dataHtml + '<li>';
                    _dataHtml = _dataHtml + '<div>';
                    _dataHtml = _dataHtml + '<div class="r-td">' + _data[i].text + '</div>';
                    _dataHtml = _dataHtml + '<div class="r-td">';
                    _dataHtml = _dataHtml + '<img src="../../../images/pages/my-account3.0/rbottom.png" class="r-img rup">';
                    _dataHtml = _dataHtml + '</div>';
                    _dataHtml = _dataHtml + '</div>';
                    _dataHtml = _dataHtml + '</li>';
                    _dataHtml = _dataHtml + _liHtml;
                    _dataHtml = _dataHtml + '</ul>';
                    _dataHtml = _dataHtml + '</div>';
                }

                if(_data[i].mtype == 2) {
                    var totalCycle = data.totalCycle;
                    var awardCycle = data.awardCycle;
                    var _sr ;
                    if(awardCycle == 0) {
                        _sr = 0;
                        _sr = _sr + 'px';
                    } else {
                        _sr = parseFloat(awardCycle/totalCycle) * 100;
                        _sr = _sr +'%'
                    }
                    _dataHtml = _dataHtml + '' +
                    '<div class="r-tr rewardPlan" style="width:100%;height: auto;">' +
                    '<ul>' +
                    '<li>' +
                    '<div>' +
                    '<div class="r-td">' + _data[i].text + '</div>' +
                    '<div class="r-td"><img src="../../../images/pages/my-account3.0/rbottom.png" class="r-img rub"></div>' +
                    '<div class="r-text">' + _data[i].dataText + '</div>' +
                    '</div>' +
                    '</li>' +
                    '<li class="rplan plan-li2" style="display: none">' +
                    '<div class="plan">' +
                    '<div class="plan-left"><div style="width: 100%;height: 0.2rem;background: #EEEEEE;position: absolute;top: 0.4rem;left: 0;right: 0"></div><div class="plan-left-scroll" style="width: ' + _sr + '"></div></div>' +
                    '<div class="plan-left-text2">' + awardCycle + '/'+ totalCycle +  '期</div>' +
                    '</div>' +
                    '</li>' +
                    '' ;


                    if(repayList != undefined && repayList != null && repayList != '') {
                        _dataHtml = _dataHtml +  '<li class="rplan plan-li3" style="display: none">' +
                        '<div class="plan-one">期数</div>' +
                        '<div class="plan-two">日期</div>' +
                        '<div class="plan-three">应收本息</div>' +
                        '</li>';
                        for(var k = 0; k < repayList.length; k++) {
                            _dataHtml =_dataHtml + '' +
                            '<li class="rplan plan-li3" style="display: none">' +
                            '<div class="plan-one" style="color: #4A4A4A;">' + repayList[k].currentNum + '</div>' +
                            '<div class="plan-two" style="color: #4A4A4A;">' + repayList[k].repayTime + '</div>' +
                            '<div class="plan-three" style="color: #4A4A4A;">' + repayList[k].dividend + '元</div>' +
                            '</li>';
                        }
                    }

                    _dataHtml = _dataHtml + '</div>';
                }
            }

        }

        var _html = '';
        _html = _html + '' +
        '<div class="r-top">' +
            '<div>' +
                '<div class="r-top-left">' +
                    '<div style="padding-left: 0.55rem">' +
                        '<span>加入金额（元）</span>' +
                        '<a class="rhave"></a>' +
                    '</div>' +
                '</div>' +
                '<div class="rholdMoney">' + map.amount + '</div>' +
                '<div class="rleftbox">' +
                    '<div class="regularIcon"></div>' +
                    '<div class="createTime">' +
                            + map.createTime + '开始计息' +
                    '</div>' +//getreward
                    '' +
                '</div>' +
            '</div>' +
        '</div>' +
        //'</div>' +
        '<div class="r-center">' +
            '<div class="r-content">计划信息</div>' +
            '<div class="r-table">' + _dataHtml +
            '</div>' +
        '</div>' +

        '<div class="r-rule">' +
            '<div>' +
                '<div>定期产品投资协议</div>' +
                '<img src="../../../images/pages/my-account3.0/rright.png" class="r-img rright">' +
            '</div>' +
        '</div>';
        $('.wrapper').html(_html);

        var type = map.type;
        var earnedIncome = '';
        var expectInterest = '';
        switch (parseInt(type)){
            //持有中
            case 1:{
                $('.rleftbox').html('<div class="regularIcon"></div><div class="createTime">' + map.createTime + '开始计息</div>');
                $('.rhave').html('<div style="border: 1px solid rgb(255, 120, 41);color: rgb(255, 120, 41);">持有中</div>');
                break;
            }
            //收益中
            case 2:{
                expectInterest = parseFloat(data.expectInterest).toFixed(2);
                earnedIncome = parseFloat(data.earnedIncome).toFixed(2);
                $('.rleftbox').html('<div class="leftgetreward">目标收益<span>' + expectInterest + '</span>元</div><div class="getreward">已赚收益<span>' + earnedIncome + '</span>元</div>');
                $('.rhave').html('<div style="border: 1px solid rgb(255, 120, 41);color: rgb(255, 120, 41);">收益中</div>');
                //$('.r-top-right').html('<div style="border: 1px solid rgb(255, 120, 41);color: rgb(255, 120, 41);">收益中</div><div class="getreward">已赚收益<span>' + earnedIncome + '</span>元</div>');
                break;
            }

            //退出中
            case 3:{
                expectInterest = parseFloat(data.expectInterest).toFixed(2);
                earnedIncome = parseFloat(data.earnedIncome).toFixed(2);
                $('.rleftbox').html('<div class="leftgetreward">目标收益<span>' + expectInterest + '</span>元</div><div class="getreward">已赚收益<span>' + earnedIncome + '</span>元</div>');

                //$('.r-top-right').html('<div style="border:1px solid #2B6FF9;color: #2B6FF9;">退出中</div><div class="getreward">已赚收益<span>' + earnedIncome + '</span>元</div>');
                $('.rhave').html('<div style="border:1px solid #2B6FF9;color: #2B6FF9;">退出中</div>');

                break;
            }

            //已退出
            case 4:{
                expectInterest = parseFloat(data.expectInterest).toFixed(2);
                earnedIncome = parseFloat(data.earnedIncome).toFixed(2);
                $('.rleftbox').html('<div class="leftgetreward">目标收益<span>' + expectInterest + '</span>元</div><div class="getreward">已赚收益<span>' + earnedIncome + '</span>元</div>');
                //$('.r-top-right').html('<div style="border: 1px solid #9D9D9D;color: #9D9D9D;">已退出</div><div class="getreward">已赚收益<span>' + earnedIncome + '</span>元</div>');
                $('.rhave').html('<div style="border: 1px solid #9D9D9D;color: #9D9D9D;">已退出</div>');
                break;
            }
        }

        $('.r-rule').click(function() {
            //window.location.href = Setting.staticRoot + '/pages/account/service-agreement.html';
            var fullName = sessionStorage.getItem('realname');
            var showName = "***";
            if(fullName==null || fullName==undefined || fullName.length<1){
                // Common2.toast('姓名错误：'+fullName);
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
                // Common2.toast('手机号错误：'+fullPhone);
            }else{
                var _hide_number = fullPhone.substr(3,4);
                phoneNum = fullPhone.replace(_hide_number,'****');//手机
            }

            var fullCertNo = sessionStorage.getItem('cardNum');
            var cardNum = "***************";
            if(fullCertNo==null || fullCertNo==undefined || fullCertNo.length<15){
                // Common2.toast('身份证号错误：'+cardNum);
            }else{
                var _front_cardnum = fullCertNo.substr(0,3);
                var _last_cardnum = fullCertNo.substr(14,4);
                cardNum = _front_cardnum+'***********'+_last_cardnum;//身份证
            }

            window.location.href = Setting.staticRoot + "/pages/financing/regular-agreement.html?uName="+showName+"&uMobile="+phoneNum+"&uSFZ="+cardNum;
        });

        $('.rewardbtn').click(function() {
            //有就关闭
            if($(this).hasClass('disabled')) {
                $(this).removeClass('disabled');
                $(this).find('.r-img').attr({'src':'../../../images/pages/my-account3.0/rbottom.png'});
                $(this).find('.lishow').css({'display':'none'})
            } else {
                $(this).addClass('disabled');
                $(this).find('.r-img').attr({'src':'../../../images/pages/my-account3.0/rup.png'});
                $(this).find('.lishow').css({'display':'block'});
            }
        });

        $('.rewardPlan').click(function() {
            //有就关闭
            if($(this).hasClass('disabled')) {
                $('.rplan').hide();
                $(this).removeClass('disabled');
                $(this).find('.r-img').attr({'src':'../../../images/pages/my-account3.0/rbottom.png'});
                $(this).find('.lishow').css({'display':'none'})
            } else {
                $('.rplan').show();
                $(this).addClass('disabled');
                $(this).find('.r-img').attr({'src':'../../../images/pages/my-account3.0/rup.png'});
                $(this).find('.lishow').css({'display':'block'});
            }
        })
    }
});
