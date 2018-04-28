/**
 * Created by User on 2018/1/3.
 */

$(function() {

    var param = Common.getParam();
    var pageCount = sessionStorage.getItem('pageCount');
    var userId = sessionStorage.getItem('uid') || param.uid;
    var loginToken = sessionStorage.getItem('loginToken') || param.loginToken;
    var type = param.type;//1.为安卓，2.为ios
    var version = param.version;
    //alert('请等待版本更新或通过微信服务号“V金融投资”参与活动')
    if(type != undefined && type != null && type != '') {
        if(type == 1) {
            var v =  getVersion(version,type);
            if(v <= 3690) {
                alert('请更新版本或通过微信服务号“V金融投资”参与活动');
            }
        }
        if(type == 2) {
            var v =  getVersion(version,type);
            if(v <= 3612) {
                alert('请更新版本或通过微信服务号“V金融投资”参与活动');
            }
        }
    }

    $('.yb-btn').click(function() {
        if(type != undefined && type != null && type != '') {
            if(type == 1) {
                window.AndroidWebView.setRegular();
            }
            if(type == 2) {
                iOS.HtmlJumpFloat();
            }
        } else {
            window.location.href = Setting.staticRoot + '/pages/financing/regular.html';
        }
    });

    $('.ninebtn').click(function() {
        if(userId == undefined || userId == null || userId == '') {
            Common.toLogin();
            return false;
        }
        var $ninebtn = $('.ninebtn');
        if($ninebtn.hasClass('disabled')) {
            return false;
        }
        $ninebtn.addClass('disabled');
        $.post(Setting.apiRoot1 + '/queryInvestPageInfo.p2p',function(res) {
            $ninebtn.removeClass('disabled');
            if(res.code == 1) {
                var regularList = res.data.regularList;
                var regularListDetail = regularList.regularListDetail;
                for(var i = 0; i < regularListDetail.length; i++) {
                    if(regularListDetail[i].loanCycle == 9) {
                        var prodId = regularListDetail[i].prodId;
                        if(type != undefined && type != null && type != '') {
                            if(type == 1) {
                                window.AndroidWebView.setBuy(prodId);
                            }
                            if(type == 2) {
                                iOS.HtmlJumpRegularBuyVCAndProdId(prodId);
                            }
                        } else {
                            window.location.href = Setting.staticRoot + '/pages/financing/buy3.0.html?pid=' + prodId;
                        }
                    }
                }
            }
        },'json');

    });

    function getVersion(version,type) {
        var v = '';
        for(var i = 0; i < version.length; i++) {
            if(version[i] != '.') {
                v = v + version[i];
            }
        }
        if((v.length == 3 || v.length == 4) && type == 1) {
            v = v + '0'
        } else {
            if(v.length == 3 && type == 2) {
                v = v + '0'
            }
        }
        return parseInt(v)
    }

    var shareButton = $(".yshare");
    var imgurl = 'http://106.15.44.101/group1/M00/00/1A/ag8sZVpYEtSAAqZ1AAC_5A30eA0086.jpg';
    var title = '2周年庆典';
    var desc = '相伴的2年里，从破蛋到成长一路有你，未来我们将携手并进！';
    var link = Setting.staticRoot + '/pages/active/celebration/yearcelebration.html';
    share.shareFixed(imgurl, title, desc, link, "888");
    shareButton.click(function() {
        var shareTemplate = [
            '<a class="share" href="javascript:;">',
            '<i class="share_pic"></i>',
            '</a>'
        ].join('');
        (!$('.share').length>0)  && $('body').append(shareTemplate);
        $('body').on('click', '.share', function(event) {
            $(this).remove();
        });
    });

    //点击活动规则按钮
    $('.yrules').click(function() {
        var $rules = $('.p-rules');
        $rules.show();
        getBox($rules);
    });

    $.ajax({
        url:Setting.apiRoot1 + '/allUserActivityChartList.p2p',
        type:'post',
        dataType:'json'
    }).done(function(res) {
        if(res.code == 1) {
            var data = res.data;
            var $table = $('.y-table');
            if(data == undefined || data == null || data == '') {
                $table.closest('div').html('<div class="nodata">战绩空空如也，快去投资参战吧~</div>');
            } else {
                var _html = '';
                for(var i = 0; i < data.length; i++) {
                    _html = _html + '<tr id="' + data[i].userId + '"><td>' + (i+1) + '</td><td>' + data[i].userName + '</td><td>' + data[i].phoneNum + '</td><td>' + getMonery(data[i].investAnnualized) + '万元</td></tr>'
                }
                $table.html(_html);
            }
        } else {
            alert(res.message);
            return false;
        }
    }).fail(function() {
       alert('网络连接失败！');
        return false;
    });

    //今日战绩和个人年化
    var $investAnn = $('.investAnn');//今日年化投资额
    var $redAmt = $('.redAmt');//全民返现红包
    var $extRedAmt = $('.extRedAmt');//额外返现红包
    var $TotalInvestAnn = $('.TotalInvestAnn');//您的累计年化投资额(本活动期间)
    if(userId != undefined && userId != null && userId != '') {
        $.post(
            Setting.apiRoot1 + '/u/allUserActivityUserTotal.p2p',
            {userId:userId,loginToken:loginToken},
            function(res) {
                if(res.code == 1) {
                    var data = res.data;
                    $investAnn.html(data.investAnn);
                    $redAmt.html(data.redAmt);
                    $extRedAmt.html(data.extRedAmt);
                    $TotalInvestAnn.html(getMonery(data.TotalInvestAnn));
                } else {
                    alert(res.message);
                    return false;
                }
        },'json');
    } else {
        $investAnn.html('<a href="javascript:;" class="ylogin">登录可查看</a>');
        $redAmt.html('<a href="javascript:;" class="ylogin">登录可查看</a>');
        $extRedAmt.html('<a href="javascript:;" class="ylogin">登录可查看</a>');
        $TotalInvestAnn.html('<a href="javascript:;" class="ylogin">登录可查看</a>');
    }

    //点击登录查看
    $('.ylogin').click(function() {
        Common.toLogin();
        return false;
    });

    //点击历史查询战绩
    $('.ybtn').click(function() {
        var $ybtn = $('.ybtn');
        if($ybtn.hasClass('disabled')) {
            return false;
        }

        $ybtn.addClass('disabled');

        if(userId == undefined || userId == null || userId == '') {
            Common.toLogin();
            $ybtn.removeClass('disabled');
            return false;
        } else {
            var $list = $('.p-list');
            var $lists = $('.lists');
            var count = 1;
            $lists.dropload({
                scrollArea:$lists,
                loadDownFn:function(me) {
                    $.ajax({
                        url:Setting.apiRoot1 + '/u/allUserActivityUserHisList.p2p',
                        type:'post',
                        dataType:'json',
                        data:{
                            userId:userId,
                            loginToken:loginToken,
                            page:count,
                            rows:10
                        }
                    }).done(function(res) {
                        if(res.code == 1) {
                            $list.show();
                            getBox($list);
                            var data = res.data.rows;
                            if(data == undefined || data == null || data == '') {
                                if(count == 1) {
                                    $lists.html('<div class="yanodata">战绩空空如也，快去投资参战吧~</div>');
                                }
                                // 锁定
                                me.lock();
                                // 无数据
                                me.noData(true);
                                return false;
                            } else {
                                var _html = '';
                                for(var i = 0; i < data.length; i++) {
                                    var _v1 = getMonery(data[i].vInvestTotal);
                                    _html = _html + '' +
                                    '<div class="lists-back" activityId="' + data[i].activityId + '" id="' + data[i].id + '">' +
                                    '<div>' +
                                    '<div>' + data[i].currDate + '</div>' +
                                    '<div>平台当日投资总额：' + _v1 + '万元</div>' +
                                    '<div>个人年化投资额：' + data[i].investAnnualized + '元</div>' +
                                    '<div>全民返现红包金额：' + data[i].redPkgAmount + '元</div>' +
                                    '<div>额外返现红包金额：' + data[i].extRedPkgAmount + '元</div>' +
                                    '</div>' +
                                    '</div>';
                                }
                                if(count == 1) {
                                    $lists.html(_html);
                                } else {
                                    $lists.append(_html);
                                }

                                count++;
                                me.resetload();
                            }
                        } else {
                            alert(res.message);
                            $ybtn.removeClass('disabled');
                            return false;
                        }
                    }).fail(function() {
                        alert('网络连接失败！');
                        $ybtn.removeClass('disabled');
                        return false;
                    });
                }
            });
        }
    });

    function getMonery(vInvestTotal) {
        var _vInvestTotal = vInvestTotal.toString();
        var _v1 = '';
        if(_vInvestTotal != null && _vInvestTotal != undefined && _vInvestTotal != '') {
            if(_vInvestTotal.indexOf('.') != -1) {
                var j = _vInvestTotal.indexOf('.');
                _v1 = _vInvestTotal.substring(0,j - 4);
                if(_v1 == undefined || _v1 == null || _v1 == '') {
                    _v1 = '0';
                }
                var _v2 = _vInvestTotal.substring(j - 4,j - 2);
                if(_v2 == undefined || _v2 == null || _v2 == '') {
                    _v2 = '00';
                }
                _v1 = _v1 + '.';
                _v1 = _v1 + _v2;
            } else {
                _v1 = _vInvestTotal.substring(0,(_vInvestTotal.length) - 4);
                if(_v1 == undefined || _v1 == null || _v1 == '') {
                    _v1 = '0';
                }
                var _v2 = _vInvestTotal.substring((_vInvestTotal.length) - 4,(_vInvestTotal.length) - 2);
                if(_v2 == undefined || _v2 == null || _v2 == '') {
                    _v2 = '00';
                }
                _v1 = _v1 + '.';
                _v1 = _v1 + _v2;
            }
        }
        return _v1;
    }

    //目前返现利率
    $.ajax({
        url:Setting.apiRoot1 + '/allUserActivityCurrentTotal.p2p',
        type:'post',
        dataType:'json'
    }).done(function(res) {
        if(res.code == 1) {
            var data = res.data;
            var $vTotalAmt = $('.vTotalAmt');//今日目前投资总额
            var $rate = $('.rate');//全民返现利率
            var $extRate = $('.extRate');//额外返现利率
            var _vTotalAmt = getMonery(data.vTotalAmt);
            $vTotalAmt.html(_vTotalAmt);
            $rate.html(data.rate + '%');
            $extRate.html(data.extRate + '%');
            var _v = _vTotalAmt;
            if(parseFloat(_v) > 600) {
                _v = 600;
            }

            $('.yshow').width(_v + 'px');
            if(_vTotalAmt < 150) {
                if(_vTotalAmt > 120) {
                    $('.yscroll').css({'marginLeft': parseFloat((150 - _vTotalAmt)) + 'px'});
                } else {
                    $('.yscroll').css({'marginLeft': 0 + 'px'});
                }

            } else {
                $('.yscroll').scrollLeft(_vTotalAmt-150);
            }

            var _arr = [100,150,200,250,300,350,400,450,500,550,600];
            for(var i = 0; i < _arr.length; i++) {
                var $img = $('img[code="' + i + '"]');
                if(_vTotalAmt - _arr[i] > 0) {
                    $img.attr({'src':'../../../images/pages/activity/celebration/icon1.png'});
                    if(_vTotalAmt - _arr[i] < 20) {
                        $img.css({'width':'0.7rem','height':'0.7rem','top':'-0.7rem','left':'-0.1rem'});
                    }
                } else {
                    if(_vTotalAmt - _arr[i] == 0) {
                        $img.attr({'src':'../../../images/pages/activity/celebration/icon1.png'});
                        $img.css({'width':'0.7rem','height':'0.7rem','top':'-0.7rem','left':'-0.1rem'});
                        //window.location.href = '#' + _vTotalAmt;
                    }

                    if(_vTotalAmt - _arr[i] < 0) {
                        //window.location.href = '#' + _arr[i - 1];
                        break;
                    }
                }
            }
        } else {
            alert(res.message);
            return false;
        }
    }).fail(function() {
        alert('网络连接失败');
        return false;
    });

    var _s = false;
    //点击图片按钮
    $('.progress img').click(function() {
        _s = true;
        var rate = $(this).attr('rate');
        var extRate = $(this).attr('extRate');
        $('.t').hide();
        $('.move-div').remove();
        var _html = '';
        _html = _html + '' +
        '<div class="move-div">' +
        '<div>全民返现利率:<span class="rate">' + rate + '%</span></div>' +
        '<div>额外返现利率:<span class="extRate">' + extRate + '%</span></div>' +
        '</div>';
        $(this).closest('a').append(_html);
    });

    function getBox($_1) {
        var $wrapper = $('.wrapper');
        var $_rule = $('.p-rules-window');
        var _winHeight = $(window).height();
        var _p_rules = $_rule.height();
        var _h = (_winHeight - _p_rules) / 2;
        $_rule.css({'top': _h});
        $wrapper.css({'overflow':'hidden'});

        $('.yclose').click(function() {
            $_1.hide();
            $wrapper.css({'overflow-y':'auto','overflow-x':'hidden'});
            $('.ybtn').removeClass('disabled');
        })
    }


    $('.wrapper').scroll( function() {
        if(_s) {
            $('.move-div').remove();
            $('.t').show();
            _s = false;
        }
    } );
});