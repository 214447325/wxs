/**
 * Created by User on 2018/1/10.
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

    var imgurl = 'http://106.15.44.101/group1/M00/00/1D/ag8sZVp__0CAQ75ZAADWmu0CowM260.jpg';
    var title = '拥抱合规，活期存量转化';
    var desc = '短期高收益，更多福利等你拿~';
    var link = Setting.staticRoot + '/pages/active/currentstock.html';
    share.shareFixed(imgurl, title, desc, link, "888");

    var $currentRedeemAmount = $('.currentRedeemAmount');
    var $currentInTheVoteAmount = $('.currentInTheVoteAmount');
    //var $inTheVoteAmount = $('.inTheVoteAmount');
    var $voteAmount = $('.voteAmount');
    var $caddbtn = $('.caddbtn');
    if(userId != undefined && userId != null && userId != '') {
        $.ajax({
            url:Setting.apiRoot1 + '/u/userCurrentStockInfo.p2p',
            dataType:'json',
            type:'post',
            data:{
                userId:userId,
                loginToken:loginToken
            }
        }).done(function(res) {
            if(res.code == 1) {
                var data = res.data;
                $currentRedeemAmount.html(data.currentRedeemAmount);
                $currentInTheVoteAmount.html(data.currentInTheVoteAmount);
                //$inTheVoteAmount.html(data.inTheVoteAmount );
                $voteAmount.html(data.voteAmount);
                currentStockValidator(data.currentInTheVoteAmount);
            } else {
                if(res.code == -99) {
                    alert(res.message);
                    $('.submit').click(function() {
                        Common.toLogin();
                        return false;
                    });
                    return false;
                } else {
                    alert(res.message);
                    return false;
                }
            }
        }).fail(function() {
            alert('网络连接失败！');
            return false;
        })
    } else {
        $currentRedeemAmount.html('<a href="javascript:;" class="clogin">登录后查看 </a>');
        $currentInTheVoteAmount.html('<a href="javascript:;" class="clogin">登录后查看 </a>');
        //$inTheVoteAmount.html('<a href="javascript:;" class="clogin">登录后查看 </a>');
        $voteAmount.html('<a href="javascript:;" class="clogin">登录后查看 </a>');
        $caddbtn.html('<div class="button1">赎回活期</div><div class="button2">投资3周定期</div>');
    }

    $('.clogin').click(function() {
        Common.toLogin();
        return false;
    });


    //判断能否买3周的
    function currentStockValidator(_d) {
        $.post(Setting.apiRoot1 + '/u/currentStockValidator.p2p',{userId:userId,loginToken:loginToken},function(res) {
            if(res.code == 1) {
                //alert(_d)
                var data = res.data;
                //var data = 0;
                if(data == 1) {
                    if(_d == 0) {
                        $caddbtn.html('<div class="bt button2 vcenter">投资3周定期</div>');
                    } else {
                        $caddbtn.html('<div class="button1">赎回活期</div><div class="bt button2">投资3周定期</div>');
                    }
                } else {
                    if(_d == 0) {
                        $caddbtn.html('<div class="bt button3 vcenter">投资3周定期</div>');
                    } else {
                        $caddbtn.html('<div class="button1">赎回活期</div><div class="bt button3">投资3周定期</div>');
                    }

                }
                click();
            } else {
                alert(res.message);
                return false;
            }
        },'json')
    }
    click();
    function click() {
        $('.button1').click(function() {
            if(userId == undefined || userId == null || userId == '') {
                Common.toLogin();
                return false
            } else {
                if(type != undefined && type != null && type != '') {
                    if(type == 1) {
                        window.AndroidWebView.setRecordActivity();
                    }
                    if(type == 2) {
                        iOS.HtmlJumpMyCurrentVCNew();
                    }
                } else {
                    window.location.href = Setting.staticRoot + '/pages/my-account/current/redemption3.0.html';
                }
            }
        });

        $('.button2').click(function() {
            if(userId == undefined || userId == null || userId == '') {
                Common.toLogin();
                return false
            } else {
                $.post(Setting.apiRoot1 + '/queryInvestPageInfo.p2p',function(res) {
                    if(res.code == 1) {
                        var _data = res.data;
                        var _regularList = _data.regularList.regularListDetail;
                        for(var i = 0; i < _regularList.length; i++) {
                            if(_regularList[i].loanCycle == 3) {
                                if((_regularList[i].addRate + _regularList[i].minRate) == 14) {
                                    var prodId = _regularList[i].prodId;
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
                    } else {
                        alert(res.message);
                        return false;
                    }
                },'json');
            }
        });

        $('.button3').click(function() {
            alert('先赎回活期产品方可投资3周');
            return false;
        })
    }
});