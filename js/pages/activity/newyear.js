/**
 * Created by User on 2017/12/8.
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

    if(userId != undefined && userId != null && userId != '') {
        $.ajax({
            url:Setting.apiRoot1 + '/u/queryUser14Week.p2p',
            type:'post',
            dataType:'json',
            data:{
                userId:userId,
                loginToken:loginToken
            }
        }).done(function(res) {
            if(res.code == 1) {
                var _data = res.data;
                $('.abutton').attr({'levelRate':_data.levelRate,'purchasedAmt':_data.purchasedAmt,'maxPurchasedAmt':_data.maxPurchasedAmt});
                if(parseInt(_data.purchasedAmt) != 0) {
                    $('.abutton img').attr({'src':'../../images/pages/activity/newyear/button2.png'});
                }
            } else {
              if(res.code == -99) {
                Common.toLogin();
              } else {
                  alert(res.message);
                  return false
              }
            }
        }).fail(function() {
            alert('网络连接失败');
            return false;
        })
    }

    //点击分享按钮
    var shareButton = $(".nshare");
    var imgurl = 'http://106.15.44.101/group1/M00/00/18/ag8sZVovLw-AApxZAACmBy9yQsY193.jpg';
    var title = '跨年加薪总动员';
    var desc = '这次跨年，我想给您点不一样的，比如一份加薪计划...';
    var link = Setting.staticRoot + '/pages/active/newyear.html';
    share.shareFixed(imgurl, title, desc, link, "888");
    shareButton.click(function() {
        if(type != undefined && type != null && type != '') {
            if(type == 1) {
                window.AndroidWebView.setH5Share("888");
            }
            if(type == 2) {
                iOS.HtmlShare("888")
            }
        } else {
            Common.newShareButton(Setting.staticRoot + '/pages/active/newyear.html');
        }
    });

    //点击规则按钮
    $('.nrules').click(function() {
        var $newAlert = $('.newAlert');
        var _htmlText = '';
        _htmlText = _htmlText + '' +
        '<div class="newAlertBack"></div>' +
        '<div class="newAlertBox">' +
        '<a class="nclose" href="javascript:;"></a>' +
        '<div class="nAlertText">' +
        '<div class="ntextTitle">活动规则</div>' +
        '<p>1.活动时间：2017.12.20~2018.01.15；</p>' +
        '<p>2.活动期间V金融数据系统会根据用户在2017.01.01~12.19间投资定期产品的最长期限，为用户定制一份专属14周定期产品加薪计划（详情见活动页面）；</p>' +
        '<p>3.15.5%、17.0%两档收益率需投资相应期限产品满一万元方可享受；</p>' +
        '<p>4.活动期间投资的产品不参与投资产品期限的统计； </p>' +
        '<p>5.不同等级用户享受不同的14周定期产品购买额度,活动期间升降级的V粉，可投额度随等级升降而变动；</p>' +
        '<p>6.活动期间可以使用投资红包、全程加息券、天数加息券；</p>' +
        '<p>7.如有疑问可咨询4000-521-388(工作日9:00~18:00)。</p>' +
        '<div class="ntextTitle2">小V案例</div>' +
        '<p>截至2017.12.19，王先生在V金融共投资两笔产品，一笔4周(28天)定期，一笔52周(364天)定期且金额大于一万元，则其投资产品最长期限为364天>182天，可享受14周定期产品17%的预期收益率。</p>' +
        '</div>' +
        '</div>';
        $newAlert.html(_htmlText);
        var $newAlertBox = $('.newAlertBox');
        var _winHeight = $(window).height();
        var _newAlertBox = $newAlertBox.height();
        $newAlertBox.css({'top': ((_winHeight - _newAlertBox) / 2)});
        $('.nclose').click(function() {
            $newAlert.html('');
        })
    });

    $('.abutton').click(function() {
        var $abutton = $('.abutton');
        var purchasedAmt = $(this).attr('purchasedAmt');
        var maxPurchasedAmt = $(this).attr('maxPurchasedAmt');
        if(userId == undefined || userId == null || userId == '') {
            Common.toLogin();
        }
        if(parseFloat(purchasedAmt) > 0) {
            if($abutton.hasClass('disabled')) {
                return false;
            }

            if(parseFloat(maxPurchasedAmt) <= parseFloat(purchasedAmt)) {
                alert('可投额度不足');
                return false;
            } else {
                $abutton.addClass('disabled');
                getQueryInvestPageInfo();
            }
        } else {
            var levelrate = $abutton.attr('levelrate');
            var $newAlert = $('.newAlert');
            var _htmlText = '';
            _htmlText = _htmlText + '' +
            '<div class="newAlertBack"></div>' +
            '<div class="niconBox">' +
            '<a class="nclose" href="javascript:;"></a>' +
            '<div class="niconhtml">' +
            '<div class="niconhtmlText">恭喜您领取了年化收益率<a>' + levelrate +'%</a> 的专属14周定期产品加薪计划！</div>' +
            '</div>' +
            '<a class="nIcButton" href="javascript:;"></a>' +
            '</div>';
            $newAlert.html(_htmlText);
            var $newAlertBox = $('.niconBox');
            var _winHeight = $(window).height();
            var _newAlertBox = $newAlertBox.height();
            $newAlertBox.css({'top': ((_winHeight - _newAlertBox) / 2)});
            $('.nclose').click(function() {
                $newAlert.html('');
            });

            //点击立即加薪
            $('.nIcButton').click(function() {
                var $abutton = $('.abutton');
                if($abutton.hasClass('disabled')) {
                    return false;
                }
                $abutton.addClass('disabled');
                getQueryInvestPageInfo();
            })
        }
    });

    function getQueryInvestPageInfo() {
        var $abutton = $('.abutton');
        var levelrate = parseFloat($abutton.attr('levelrate'));
        $.ajax({
            url: Setting.apiRoot1 + '/queryInvestPageInfo.p2p',
            type: 'post',
            dataType: 'json'
        }).done(function(res) {
            if(res.code == 1) {
                $abutton.removeClass('disabled');
                var _data = res.data.regularList.regularListDetail;
                for(var i = 0; i < _data.length; i++) {
                    if(_data[i].loanCycle == 14) {
                        var _levelRate = parseFloat(_data[i].maxRate) + parseFloat(_data[i].addRate);
                        if(_levelRate == levelrate) {
                            var prodId = _data[i].prodId;
                            if(type != undefined && type != null && type != '') {
                                if(type == 1) {
                                    window.AndroidWebView.setBuy(prodId);
                                }

                                if(type == 2) {
                                    iOS.HtmlJumpRegularBuyVCAndProdId(prodId)
                                }
                            } else {
                                window.location.href = Setting.staticRoot + '/pages/financing/buy3.0.html?pid=' + prodId;
                            }

                        }
                    }
                }
            } else {
                if(res.code == -99) {
                    Common.toLogin();
                    return false;
                } else {
                    alert(res.message);
                    $abutton.removeClass('disabled');
                    return false;
                }
            }
        }).fail(function() {
            alert('网络连接失败');
            $abutton.removeClass('disabled');
            return false;
        })
    }
});