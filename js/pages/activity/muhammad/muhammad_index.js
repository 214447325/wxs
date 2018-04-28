/**
 * Created by wangsy on 2017/3/23.
 */
$(function() {
    document.addEventListener('WeixinJSBridgeReady', function onBridgeReady() {
        // 通过下面这个API隐藏右上角按钮
        WeixinJSBridge.call('hideOptionMenu');
    });
    $('.wrapper_buttom ').show();
    var $ruleImg = $('.ruleImg');//用户点击猜拳的规则
    var $ruleNum = $('.ruleNum');//战绩查询
    var $one = $('.one');//我要出拳
    var $ten =  $('.ten');//出十拳
    var $imgleft = $('.imgleft');//擂主
    var $imgright = $('.imgright');
    var param = Common.getParam();
    var $shareLeft = $('.alert_Share_Left');
    var sharePostId = param.sharePostId;
    var userId = '';
    var loginToken = '';
    var version = param.version;
    var success = param.success;
    var postId = param.postId;
    var u = navigator.userAgent;
    //var isAndroid = u.indexOf('Android') > -1 || u.indexOf('Adr') > -1; //android终端
    //判断是不是ios登录
    var isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端
    if(isiOS) {
        if((postId != undefined && postId != null && postId != '') && (version != undefined && version != null && version != '') ) {
            var windom = $(window).height();
            var windomDD = $(".wrapper_buttom").height();
            var fixed = windom - windomDD-64;
            $('.wrapper_buttom').css({'top':fixed});
        }
    }


    userId = sessionStorage.getItem('uid') || param.uid;
    loginToken = sessionStorage.getItem('loginToken') || param.loginToken;
    sessionStorage.setItem('uid', userId);
    sessionStorage.setItem('loginToken', loginToken);
    $.cookie('uid',userId);
    $.cookie('loginToken',loginToken);

    if(success == 1) {
        window.location.href = 'https://open.weixin.qq.com/connect/oauth2/authorize?appid=wxb9292153d3cc8750&redirect_uri=https://web.wdclc.cn/wx/activity/notify/code.p2p&response_type=code&scope=snsapi_userinfo&state=' + userId +'a';
    }

    if(userId) {
        //shareActivity(userId, loginToken);
        var _date = new Date();
        $.ajax({
            url:Setting.apiRoot1 + "/u/boxing/grantRateCoupon.p2p",
            type:"POST",
            data:{
                userId:userId,
                loginToken:loginToken,
                date:_date.getTime()
            },
            dataType:"json"
        }).done(function(res) {
            if(res.code == 1) {
                alertBox(7);
                $("#getCounts").text(res.data.pktotal);
                $('.countToday').html(res.data.coupontotal);
            };

            if(res.code == -99) {
                $('.ranking').hide();
                sessionStorage.clear();
                alertBox(6,res.message);
                return false;
            }
        }).fail(function() {
            alertBox(4,'网络连接错误！')
        });
    }



    //ios交互校验
    var flag = 0;
    if(!(userId == null || userId == '' || userId == '(null)' || userId == undefined)) {
        flag = 1;
    }

    $(document).ready(function(){
        if(flag == 0){
            $('.center').hide();
            $('#opportunity').hide();
            $('#opportunitys').addClass("opportunitys");
            //$('.rank_num_content').html('<ui class="rank_ul"><li style="padding-top: 10px; text-align:center;"><a style="color: #ffffff;letter-spacing:2px;">请登录查看我的战绩</a></li></ui>')
            $('.rank_num_content').html('<div class="login-div01" style="color: #000000;text-align: left"><a href="javascript:;" class="login-div01-a" onclick="jumPage()">登录</a>查看我的战绩</div>');
            rank();
        }else{
            personal();
            rank();
            money();
        }
    });

    //初始页面请求
    //$(document).ready(function  () {
    //个人排行
    function personal() {
        $.ajax({
            type: "POST",
            dataType: 'json',
            url: Setting.apiRoot1 + "/u/boxing/queryRankInfo.p2p",
            data: {
                userId: userId,
                loginToken: loginToken
            },
            success: function (result) {
                if (result.code == 1) {

                    if(null == result.data || undefined == result.data){
                        $('.rank_num_content').html('<ui class="rank_ul"><li style="padding-top: 10px; padding-left: 50px;"><a href="javascript:;" style="color: #000000;">我的战绩：暂无</a></li></ui>');
                        return;
                    }
                    if(result.data.rank ==1){
                        $(".rank_num_content").html('<ui class="rank_ul"><li>我的战绩：第&nbsp;<a href="javascript:;" id="totalRank" style="color: #ff3218"></a>&nbsp;名</li><li>出拳&nbsp;<a id="numberPunches" href="javascript:;" style="color: #ff3218"></a>&nbsp;次，当前排名第一名</ui>');
                        if(null != result.data.rank && undefined != result.data.rank){
                            $("#totalRank").text(result.data.rank);
                        } else {
                            $("#totalRank").html(0);
                        }
                        if(null != result.data.num && undefined != result.data.num){
                            $("#numberPunches").html(result.data.num); //出拳"num"次
                        } else {
                            $("#numberPunches").html(0); //出拳"num"次
                        }
                    }else{
                        $(".rank_num_content").html('<ui class="rank_ul"><li>我的战绩：第&nbsp;<a href="javascript:;" id="totalRank" style="color: #ff3218"></a>&nbsp;名</li><li>出拳&nbsp;<a id="numberPunches" href="javascript:;" style="color: #ff3218"></a>&nbsp;次，距离第&nbsp;<a href="javascript:;" id="lastName" style="color: #ff3218"></a>&nbsp;名还差&nbsp;<a id="beforeNum" style="color: #ff3218"></a>&nbsp;次</li></ui>');
                        var numResult = result.data.beforeNum - result.data.num;//numResult为还差 "numResult"次
                        $("#totalRank").text(result.data.rank);
                        $("#numberPunches").text(result.data.num); //出拳"num"次
                        $("#lastName").text(result.data.rank - 1); //距离第"rank-1"
                        $("#beforeNum").text(numResult); //numResult为还差 "numResult"次
                    }
                } else if(result.code == -1){
                    $(".rank_num_content").html('<ui class="rank_ul"><li id="content1" style="text-align:center;padding-top:12px;">1</li></ui>');
                    $("#content1").text(result.message); //电话号
                }else{
                    if(result.code == -99) {
                        $('.ranking').hide();
                        sessionStorage.clear();
                        alertBox(6,result.message);
                        return false;
                    }
                    $(".rank_num_content").html('<ui class="rank_ul"><li id="content" style="text-align:center;padding-top:12px;"></li></ui>');
                }
            }
        })
    };
    //拳王争霸排行
    function rank() {
        $.ajax({
            type: "POST",
            url: Setting.apiRoot1 + "/boxing/queryRankList.p2p",
            dataType: 'json',
            data: {
                userId: userId
            },
            success: function (result) {
                var iconArray = ["first", "second", "third"];
                if (result.code == 1) {
                    result.data.push({"beforeNum":40,"num":70,"phone":"135****8088","rank":10,"userId":123453});
                    result.data.sort( function(a, b){
                        return parseInt(a["num" ]) < parseInt(b["num" ]) ? 1 : parseInt(a[ "num"]) == parseInt(b[ "num" ]) ? 0 : -1;
                    });

                    //遍历
                    $.each(result.data, function (index, item) {
                        if(index == 10){
                            return false;
                        }
                        //amount序号
                        var amount = index + 1;
                        //校验list为10条数据

                        //截取phoneNum从第三位开始的后四位替换成"****"
                        var strPhone = item.phone;

                        //遍历icon
                        for (var i = 0; i < iconArray.length; i++) {
                            iconColor = "rest";
                            if (index < 3) {
                                var iconColor = iconArray[index]
                            } else {
                                iconColor;
                            }
                        }
                        $(".rankleft").append('<div class="line"><div id="iconColor" class="' + iconColor + '">' + amount + '</div><div class="telPhnumber">' + strPhone + '&nbsp;&nbsp;&nbsp;' + '出拳' + '&nbsp;&nbsp;&nbsp;' + item.num + '次</div></div>')
                    })
                } else {
                    alertBox(4, result.message)
                }
            }
        })
    };

    //已获得现金and可出拳次数借口
    function money(){
        $.ajax({
            type:"POST",
            url:Setting.apiRoot1 + "/u/mainInfo.p2p",
            data:{
                userId:userId,
                loginToken:loginToken
            },
            dataType:"json",
            success:function(result){
                if(result.code == 1){
                    $("#userPhone").text(result.data.phone);//用户电话
                    $("#money").text(result.data.cash);//已获得现金
                    $("#numberPunche").text(result.data.num);//可出拳次数
                    var urlImg = result.data.url;
                    if(urlImg != undefined && urlImg != null && urlImg != '') {
                        $('.userImg2').html('<img src="' + urlImg + '" class="urlImg3" />');
                    }
                }else{
                    if(result.code == -99) {
                        $('.ranking').hide();
                        sessionStorage.clear();
                        alertBox(6,result.message);
                        return false;
                    } else {
                        $('.rank_num_content').html('<ui class="rank_ul"><li style="padding-top: 10px; text-align:center;"><a style="color: #000000;letter-spacing:2px;">请重新<a href="javascript:;" style="color: #ff3218;" onclick="jumPage()">登录</a>查看我的战绩</a></li></ui>')
                        $('.center').hide();
                        $('#opportunity').hide();
                        alertBox(4,result.message);
                    }

                }
            }
        });
    };
    $ruleImg.click(function() {
        alertBox(1);
    });
    $ruleNum.click(function(){
        if(flag == 1) {
            sessionStorage.setItem('uid', userId);
            $.ajax({
                type: "post",
                url: Setting.apiRoot1 + "/u/boxingInfo.p2p",
                data: {
                    loginToken:loginToken,
                    userId: userId
                },
                dataType:"json"
            }).done(function(res){
                if(res.code == 1 && res.data.sum !=0){
                    alertBox(9);
                    var _iCont = 0;
                    var _boxingInfo = res.data.boxingInfo;
                    if(_boxingInfo == undefined || _boxingInfo == '' || _boxingInfo == null) {
                        alertBox(4,'暂无记录');
                        return false;
                    }
                    $.each(res.data['boxingInfo'], function (index, item) {
                        //amount序号
                        var amount = index + 1;
                        _iCont = _iCont + _boxingInfo[index].reward;
                        var sum = res.data.sum;
                        $("#sumMoney").text(_iCont);
                        $("#addCounts").text(res.data.count);
                        var playNum = res.data['boxingInfo'].length;
                        var arryList = res.data['boxingInfo'][index];
                        var reward = arryList.reward;
                        if(arryList.result == 1){
                            var statusGame = "赢";

                        }
                        if(arryList.result == 0){
                            statusGame = "平"
                        }
                        if(arryList.result == -1){
                            statusGame = "输"
                        }
                        $(".ten_box1").append('<p>第<a id="allNum">' + amount +'</a>拳: &nbsp;&nbsp;<a id="gameStatus">'+ statusGame +'</a>了&nbsp;&nbsp; 获得 <a class="font a0" id="getMoney" style="color:#ff0000">'+reward+'</a>&nbsp;&nbsp;元现金</p>')
                    })

                }else {
                    if(res.code != -99 && res.data.sum == 0) {
                        alertBox(4,"您还未获得任何奖励哦~");
                    } else {
                        if(res.code == -99) {
                            $('.ranking').hide();
                            sessionStorage.clear();
                            alertBox(6,result.message);
                            return false;
                        } else {
                            alertBox(4,res.message)//后台异常时候
                        }

                    }
                }
            })
        }else{
           alertBox(6, '请先登录');
            sessionStorage.clear();
            return false;
            //setTimeout(function(){
            //    Common.toLogin();
            //},2000)
        }

    });

    //我要出拳点击
    var time = '';
    $('.one').click(function() {
        var i1 = 1;//擂主
        var i2 = 2;//自己
        if(!userId) {
            sessionStorage.clear();
           alertBox(6,'请先登录！');
            return false;
        }
        if(flag == 1){
            if($('#one').hasClass('isOne')) {
                return false;
            }

            if(!($('.one').hasClass('isclick'))){
                var _number = $('#numberPunche').html();
                if(_number == 0){
                    alertBox(3);
                    return false;
                    //$.ajax({
                    //    type:"post",
                    //    url:Setting.apiRoot1 + '/u/activity/share/count.p2p',
                    //    data: {
                    //        loginToken:loginToken,
                    //        userId: userId,
                    //        activityName:"拳王争霸"
                    //    },
                    //    dataType:"json",
                    //    success:function (result) {
                    //        if(result.code == 1){
                    //            var shareCount = result.data.count;
                    //            if(shareCount == 0){
                    //                alertBox(3);
                    //                return false;
                    //            }else{
                    //                alertBox(10)
                    //            }
                    //        }else{
                    //            alertBox(4,result.message)
                    //        }
                    //
                    //    }
                    //});
                } else {
                    time = setInterval(function(){
                        $imgleft.attr({'src':'../../../images/pages/activity/muhammad/left' + i1 +'.png'},500);
                        $imgright.attr({'src':'../../../images/pages/activity/muhammad/right' + i2 +'.png'},500);
                        ++i1;
                        ++i2;

                        if(i1 == 4) {
                            i1 = 1;
                        }
                        if(i2 == 4) {
                            i2 = 1;
                        }
                    },90);

                    $one.addClass('isclick');
                    $ten.addClass('is_ten');
                }
            }  else {
                return false;
            }
            //点击我要出拳动画自动的结束并且更新数据
            setTimeout(function() {
                clearInterval(time);
                $.ajax({
                    type:"post",
                    url:Setting.apiRoot1 + '/u/boxing/main.p2p',
                    dataType: 'json',
                    data: {
                        loginToken:loginToken,
                        userId: userId,
                        morraType:1
                    },
                    success:function (result) {
                        if(result.code == 1) {
                            var statusResult = result.data['boxingList'][0].type;
                            var  num = 1;
                            if(statusResult == -1) {
                                num = i1 + 1;
                                if(num == 4) {
                                    num = 1;
                                }
                            }

                            if(statusResult == 0) {
                                num = i1;
                            }

                            if(statusResult == 1) {
                                num = i1 - 1 ;
                                if(num == 0) {
                                    num = 3;
                                }
                            }
                            $imgleft.attr({'src':'../../../images/pages/activity/muhammad/left' + i1 +'.png'});
                            $imgright.attr({'src':'../../../images/pages/activity/muhammad/right' + num +'.png'});

                            var amountResult = result.data['boxingList'][0].amount;
                            var counts = result.data.getCounts;
                            if(statusResult == 1){
                                alertBox(5,1);
                                //if(counts){
                                //    alertBox(7);
                                //    $("#getCounts").text(counts);
                                //}
                                $("#win").text(amountResult + '元现金');
                                window.load = money()
                            }else if(statusResult == -1){
                                alertBox(5,3);
                                //if(counts){
                                //    alertBox(7);
                                //    $("#getCounts").text(counts);
                                //}
                                $("#lost").text(amountResult + '元现金');
                                window.load = money()
                            }else {
                                alertBox(5,2);
                                //if(counts){
                                //    alertBox(7);
                                //    $("#getCounts").text(counts);
                                //}
                                $("#draw").text(amountResult + '元现金');
                                window.load = money()
                            }
                        } else {
                            if(result.code == -99) {
                                $('.ranking').hide();
                                sessionStorage.clear();
                                alertBox(6,result.message);
                                return false;
                            }
                            if(result.code != -10 && result.code != -99) {
                                alertBox(4,result.message);
                                return false;
                            }

                        }
                    }
                });
                $one.removeClass('isclick');
                $ten.removeClass('is_ten');
            }, 2000);

        }else{
            alertBox(4,"请登录用户");
            //setTimeout(function(){
            //    Common.toLogin();
            //},2000)
        }
    });
    $ten.click(function(){
        if(userId && loginToken) {
            var _number = $('#numberPunche').html();

            if($('#ten').hasClass('is_ten')) {
                return false;
            }

            if($('#ten').hasClass('is_ten1')) {
                return false;
            }else{
                $('#ten').addClass('is_ten1');
            }

            if(_number <10) {
                alertBox(3,'不足10次');
                $('#ten').removeClass('is_ten1');
                return false;
            }

            $.ajax({
                type: "post",
                url:Setting.apiRoot1 + '/u/boxing/main.p2p',
                data: {
                    loginToken:loginToken,
                    userId: userId,
                    morraType:2
                },
                dataType:"json"
            }).done(function(res){
                if (res.code == 1) {
                    var arryList = res.data;
                    var boxing = res.data['boxingList'];
                    var arrTen = [];
                    $('.one').addClass('isOne');
                    setTenTime(boxing,arryList);
                } else {
                    alertBox(4,res.message);
                }
            });

            $one.removeClass('is_one');
        }else{
            sessionStorage.clear();
            alertBox(6,"请登录用户");
            return false;
        }

    });

    //点击十拳连出的时候动画开始执行
    var a = 0;
    function setTenTime(boxing,arryList) {
        var i1 = 1;
        var i2 = 2;
        time = setInterval(function(){
            $imgleft.attr({'src':'../../../images/pages/activity/muhammad/left' + i1 +'.png'});
            $imgright.attr({'src':'../../../images/pages/activity/muhammad/right' + i2 +'.png'});
            ++i1;
            ++i2;
            if(i1 == 4) {
                i1 = 1;
            }
            if(i2 == 4) {
                i2 = 1;
            }
        },100);

        setTimeout(function() {
            if($('#ten').hasClass('is_ten')) {
                return false;
            }
            var winM = 50;
            var loserL = 10;
            var flat = 20;
            var wm = arryList.win * winM;
            var ll = arryList.loser * loserL;
            var ft = arryList.flat * flat;
            //clearInterval(time);
            /*++a;
             if(a == 1) {*/
            alertBox(8);
            $(".tenAllMoney").text(arryList.cash);
            $("#winTen").text(arryList.win);
            $("#lostTen").text(arryList.loser);
            $("#drawTen").text(arryList.flat);
            $("#winMoeny").text(wm);
            $("#lostMoeny").text(ll);
            $("#drawMoeny").text(ft);
            money();
            $("#ten").removeClass('is_ten1');
            $("#one").removeClass('isOne');
            clearInterval(time);
            return false;
            //}

            var  num = 1;
            var stuRes = boxing[a].type;
            //输
            if(stuRes == -1) {
                num = i1 + 1;
                if(num == 4) {
                    num = 1;
                }
            }
            //赢
            if(stuRes == 0) {
                num = i1;
            }
            //平
            if(stuRes == 1) {
                num = i1 - 1 ;
                if(num == 0) {
                    num = 3;
                }
            }

            $imgleft.attr({'src':'../../../images/pages/activity/muhammad/left' + i1 +'.png'});
            $imgright.attr({'src':'../../../images/pages/activity/muhammad/right' + num +'.png'});

            setTimeout(function () {
                setTenTime(boxing,arryList);
            },1000);
        },3000)
    }

    var $body = $('body');
    var shareTemplate = [
        '<a class="share" href="javascript:;">',
        '<i class="share_pic"></i>',
        '</a>'
    ].join('');

    $('.sharea').click(function() {
        if(!userId){
            sessionStorage.clear();
            alertBox(6,'请先登录！');
            return false;
            //setTimeout(function(){
            //    Common.toLogin();
            //},2000)
        } else {
            if(version != undefined && version != null && version != '') {
                version = true;
            } else {
                version = false;
            }
            window.location.href = Setting.staticRoot+"/pages/active/muhammad/accountuser.html?uid=" + userId + '&loginToken=' + loginToken + '&version=' + version;
        }
    });



    $body.on('click', '.share', function(event) {
        $(this).remove();
    });
});

//活动弹框
/**number:
 * 1、表示活动规则的弹框
 * 2、温馨提示1有一个按钮
 * 3、表示弹出的分享和投资
 * 4、正常的弹框
 * 5、猜拳输赢的结果
 * 6、单个恭喜您的弹框
 * 7、多个恭喜您的弹框
 * 8、十连抽的弹框
 * tex:表示带有谈出的内容（如：请求不成功）
 */
function alertBox(number,tex) {

    var $box = $('.alert_box');
    $('.wrapper').addClass('over');
    $box.show();
    var _html = '';
    var _text = '';
    var _content = '';
    var _btnContent = '';
    _html += '<div class="alert_back"></div>' ;
    switch (number){
        case 1:{
            _text += '<div class="alertBox_rule">' +
            '<img src="../../../images/pages/activity/muhammad/close.png" class="closeBox" onclick="closeClick()">' +
            '<div class="alert_Box_Rule">' +
            '<div class="alert_Rule_title">争霸规则</div>' +
            '<div class="alert_Rule_One">1、活动时间：即日起-2017年8月10日</div>' +
            '<div class="alert_Rule_rest">2、投资来猜拳：<p>用户单笔投资5周及以上定期产品每满1万元，即可获得1次猜拳机会，不足1万元的部分将被舍掉。（例：单笔投资5周定期35000元，可获得3次猜拳机会）</p></div>' +
            '<div class="alert_Rule_rest">3、活动期间，投资5周及以上定期产品，单笔≥1万元：只可使用天数加息券，每笔投资最多使用5张；不可使用全程加息券</div>' +
            '<div class="alert_Rule_rest">4、猜拳奖励：<div class="div_table"><table><tr><td>猜拳结果</td><td>奖励设置</td></tr><tr><td>赢</td><td>50元现金</td></tr><tr><td>平局</td><td>20元现金</td></tr> <tr><td>输</td><td>10元现金</td></tr></table></div></div>' +
            '<div class="alert_Rule_rest">5、额外奖励<p>累计猜拳机会每满5次，可额外获得1张5%天数加息券（3天）</p><p>如：累计猜拳机会有13次，可额外获得2张5%天数加息券（3天）</p></div>' +
            '<div class="alert_Rule_rest">6、分享赢红包：<div class="div_table_six"><table><tr><td>猜赢次数</td><td>红包金额</td></tr><tr><td>50</td><td>30元</td></tr><tr><td>80</td><td>80元</td></tr><tr><td>100</td><td>125元</td></tr></table></div></div>' +
            '<div class="alert_Rule_rest">7、分会场，用户每赢100次，还可获得1颗金星，且奖励进度清零，开始新一轮奖励计算，用户集满相应数量的金星，即可获得额外奖励：<div class="div_table_six"><table><tr><td>金星数量</td><td>额外奖励</td></tr><tr><td>1颗</td><td>1%全程加息券+30元现金</td></tr><tr><td>3颗</td><td>2%全程加息券+50元现金</td></tr><tr><td>5颗</td><td>3%全程加息券+100元现金</td></tr></table></div></div>' +
            '<div class="alert_Rule_rest">8、拳王排行榜前10的用户，可获得相应档次的奖品：<div class="div_table_six"><table><tr><td>排行榜名次</td><td>奖品</td></tr><tr><td>第1名</td><td>7000元京东E卡</td></tr><tr><td>第2名</td><td>3000元京东E卡</td></tr><tr><td>第3名</td><td>1000元京东E卡</td></tr><tr><td>第4名</td><td>500元京东E卡</td></tr><tr><td>第5-10名</td><td>300元京东E卡</td></tr></table></div></div>' +
            //'<div class="alert_Rule_rest">4、额外奖励<p>累计猜拳机会每满5次，可额外获得1张5%天数加息券（3天）</p><p>如：累计猜拳机会有13次，可额外获得2张5%天数加息券（3天）</p></div>' +
            '<div class="alert_Rule_rest">9、奖品发放<p>①天数加息券：发放至“账户-超值礼券”中；</p><p>②现金：发放至“账户-现金奖励”中，可进入查看并提取至余额；</p><p>③投资红包：发放至“账户-超值礼券”中；</p><p>④排行榜前十名奖品：客服将在活动结束后联系中奖用户，并于十五个工作日内安排发放。</p></div>' +
            '<div class="alert_Rule_rest">10、每隔30分钟更新战绩及排行榜。</div>' +
            '<div class="div"></div>' +
            '</div>' +
            '</div>';
            break;
        }

        case 2:{//温馨提示
            /**
             * @type {string}
             * 1、表示不足10次的弹框
             * 2、定期产品我要投资
             */

            if (tex == 1) {
                _content = '可出拳次数不足10次，赶快投资5周及以上定期产品，获取更多猜拳次数';
                _btnContent = ' <a href="../../../pages/financing/regular.html">' +
                '<div class="sweet_buttom">立即投资</div>' +
                ' </a>';
            }

            if(tex == 2) {
                _content = '您的出拳次数为0：<p>投资5周及以上定期产品单笔≥10000元即可获得出拳次数呦~</p>';
                _btnContent = ' <a href="../../../pages/financing/regular.html">' +
                '<div class="sweet_buttom">我要投资</div>' +
                ' </a>';
            }

            _text += '<div class="sweet_alert">' +
            '<img src="../../../images/pages/activity/muhammad/close.png" class="closeBox" onclick="closeClick()">' +
            '<div class="sweet_title">温馨提示</div>' +
            '<div class="sweet_content">'+ _content +'</div>' +
            _btnContent +
            '</div>';
            break;
        }

        case 3: {//1代表弹框又分享；2代表恭喜
            if(tex == undefined || tex == null || tex == '') {
                tex = '为0';
            }
            var _alertTitle = '';
            _alertTitle = '温馨提示';
            _content = '<div style="color: #000000;font-weight: bold">您的出拳次数' + tex + '：</div><br><p style="font-weight: bold">1、投资5周及以上定期产品，单笔≥10000元即可获得出拳次数呦~</p><p style="font-weight: bold">2、分享活动,在分会场赢得一定次数还可拿红包、现金、全程加息券</p>';
            _btnContent = '<div class="alert_Share_Button">' +
            '<a href="javascript:;" class="sharea">' +
            '<div class="alert_Share_Left" onclick="activity()">我要分享</div>' +
            '</a>' +
            '<a href="../../../pages/financing/regular.html">' +
            '<div class="alert_Share_Right">我要投资</div>' +
            '</a>' +
            '</div>';
            _text += '<div class="alert_share">' +
            '<img src="../../../images/pages/activity/muhammad/close.png" class="closeBox" onclick="closeClick()">' +
            '<div class="sweet_title">' + _alertTitle + '</div>' +
            '<div class="alert_share_content">' + _content + '</div>' +
            _btnContent +
            '</div>';
            break;
        }

        //正常的弹框如网络请求不成功
        case 4 :{
            _text += '<div class="play_box">' +
            '<img src="../../../images/pages/activity/muhammad/close.png" class="closeBox" onclick="closeClick()">' +
            '<div class="sweet_title">温馨提示</div>' +
            '<div class="sweet_play_content">' + tex +'</div>' +
            '<div class="play_button" onclick="closeClick()">确定</div>' +
            '</div>';
            break;
        }

        case 5 : {
            var _texContent = '';
            //赢
            if(tex == 1) {
                _texContent = '<p>你的神来之拳瞬间秒杀了擂主</p><p class="texp">送你<a class="font" id="win" style="font-size: 0.43rem"></a>，祝你百战百胜！能否走向人生巅峰就看下一拳了！</p>';
            }

            //平
            if(tex == 2) {
                _texContent = '<p>你和擂主拳逢对手难分胜负</p><p class="texp">送你<a class="font" id="draw" style="font-size: 0.43rem"></a>，去找高人买本《夺擂十八拳》再战吧！</p>';
            }

            //输
            if(tex == 3) {
                _texContent = '<p>只见擂主一个神龙摆尾你就上天了</p><p class="texp">送你<a class="font" id="lost" style="font-size: 0.43rem"></a>，拿去买箱辣条压压惊吧！</p>';
            }

            _text += '<div class="play_box result_box">' +
            '<img src="../../../images/pages/activity/muhammad/close.png" class="closeBox closeBox2" onclick="closeClick()">' +
            '<div class="sweet_title"></div>' +
            '<div class="sweet_play_content sweet_results">' + _texContent +'</div>' +
            '<div class="play_button reward2" onclick="closeClick()">确定</div>' +
            '</div>';
            break;
        }

        case 6 :{
            _text += '<div class="play_box">' +
            '<img src="../../../images/pages/activity/muhammad/close.png" class="closeBox" onclick="closeClick()">' +
            '<div class="sweet_title">温馨提示</div>' +
            '<div class="sweet_play_content">' + tex +'</div>' +
            '<div class="play_button" onclick="closeClick(6)">确定</div>' +
            '</div>';
            break;
        }

        case 7 : {
            var _content = '<p style="text-align: center">累计可出拳次数已达到<a id="getCounts" style="color: #d31019"></a>次</p><p style="text-align: center">累计获得了&nbsp;<a class="countToday" style="color: #d31019">1</a>&nbsp;张&nbsp;5%&nbsp;天数加息券（3天）</p>';
            _text += '<div class="countless_box">' +
            '<img src="../../../images/pages/activity/muhammad/close.png" class="closeBox" onclick="closeClick()">' +
            '<div class="sweet_title">恭喜您</div>' +
            '<div class="sweet_play_content sweet_play_reward countless_content">' + _content + '</div>' +
            '<div class="play_button countless_button" onclick="closeClick()">确定</div>' +
            '</div>';

            break;
        }

        case 8 : {
            _text += ' <div class="ten_smoke1">' +
            '<img src="../../../images/pages/activity/muhammad/close.png" class="closeBox" onclick="closeClick()" />' +
            '<div class="ten_box">' +
            '<p class="ptitle">共<a style="color:#ff0000;font-size:1.1em;">&nbsp;10&nbsp;</a>拳: 共获得&nbsp;&nbsp;<a class="tenAllMoney" style="color:#ff0000;font-size:1.1em;"></a>&nbsp;&nbsp;元现金，共获得<a style="color:#ff0000;font-size:1.1em;">&nbsp;2&nbsp;</a>张加息券</p>' +
            '<p>赢了&nbsp;&nbsp;<a id="winTen" style="color:#ff0000;font-size:1.1em;"></a>&nbsp;&nbsp;拳&nbsp;&nbsp;获得&nbsp;&nbsp;<a id="winMoeny" style="color:#ff0000;font-size:1.1em;"></a>&nbsp;&nbsp;元</p>' +
            '<p>输了&nbsp;&nbsp;<a id="lostTen" style="color:#ff0000;font-size:1.1em;"></a>&nbsp;&nbsp;拳&nbsp;&nbsp;获得&nbsp;&nbsp;<a id="lostMoeny" style="color:#ff0000;font-size:1.1em;"></a>&nbsp;&nbsp;元</p>' +
            '<p>平了&nbsp;&nbsp;<a id="drawTen" style="color:#ff0000;font-size:1.1em;"></a>&nbsp;&nbsp;拳&nbsp;&nbsp;获得&nbsp;&nbsp;<a id="drawMoeny" style="color:#ff0000;font-size:1.1em;"></a>&nbsp;&nbsp;元</p>' +
            '</div>' +
            '<div class="ten_button1 reward2" onclick="closeClick()">确定</div>' +
            '</div>';
            break;
        }

        case 9 : {
            _text += ' <div class="ten_smoke">' +
            '<img src="../../../images/pages/activity/muhammad/close.png" class="closeBox1" onclick="closeClick()" />' +
            '<div class="liStyle"><li class="ptitle9" style="margin-bottom:0.3rem;">共获得<a class="tenAllMoneys" id="sumMoney" style="color:#ff0000;font-size:1.1em;"></a>元现金</li>'+
            '<li class="ptitle10" style="margin-bottom:0.1rem;">共获得<a class="tenAllMoneys" id="addCounts" style="color:#ff0000;font-size:1.1em;"></a>张加息券</li></div>'+
            '<div class="ten_box1" style="text-align:center;font-size:15px;">' +
            '</div>' +
            //'<div class="ten_button" onclick="closeClick()">确定</div>' +
            '</div>';
            break;
        }

        case 10 :{
            _text += '<div class="play_box play_box10">' +
            '<img src="../../../images/pages/activity/muhammad/close.png" class="closeBox" onclick="closeClick()">' +
            '<div class="sweet_title">温馨提示</div>' +
            '<div class="sweet_play_content1">您的出拳次数为0：</div>' +
            '<p class="sweet_play_content2">投资5及以上定期产品单笔≥10000元即可获得出拳次数呦</p>'+
            '<div class="play_button" onclick="closeClick()">确定</div>' +
            '</div>';
            break;
        }
    }
    _html += _text;
    _html += '</div>';

    $box.html(_html);
    if($('.ten_punche').hasClass('isten')) {
        //tenShow();
    }
}


function activity() {
    //var param = Common.getParam();
    //
    //var type = param.type;
    //var $body = $('body');
    //var shareTemplate = [
    //    '<a class="share" href="javascript:;">',
    //    '<i class="share_pic"></i>',
    //    '</a>'
    //].join('');
    //var userId = sessionStorage.getItem('uid');
    //var loginToken = sessionStorage.getItem('loginToken');
    //if(!userId){
    //    var href = Setting.staticRoot+"/pages/active/muhammad/muhammad_index.html";
    //    alert('请先登录');
    //    window.location.replace(Setting.staticRoot + '/pages/account/login.html?from=' + encodeURIComponent(href));
    //}else {
    //    //只有点击分享时候需要提示登录
    //    (!$('.share').length > 0) && $body.append(shareTemplate);
    //    //shareActivity(userId,loginToken);
    //}
};

var url = window.location.href.split("#")[0];//获取地址
var imgurl = 'http://106.15.44.101/group1/M00/00/11/ag8sZVlkMFmAGGwXAACHCYziLKU845.jpg';//获取图片的logo
var info = {
    url:url
};

var one = {
    title: '来拳王争霸，与我大战三百回合！人人有钱！',
    desc: '战胜我！百元现金与最高3%加息券就给你！预备备...一二三，剪拳布！',
    link: url,
    imgUrl: imgurl,
    success: function() {
        successCallBack();
    }
};

var all = {
    title: '来拳王争霸，与我大战三百回合！人人有钱！',
    desc: '战胜我！百元现金与最高3%加息券就给你！预备备...一二三，剪拳布！',
    link: url,
    imgUrl: imgurl,
    success: function() {
        successCallBack();
    }

};

var  activityName = document.title;
var data = {
    userId:0,
    postId:2001,
    loginToken:0
};

//function shareActivity(userId, loginToken) {
//    data.userId = userId ;
//    data.loginToken = loginToken;
//    $.ajax({
//        url: Setting.root + '/post/share/sharePost.do',
//        type: 'get',
//        dataType: 'json',
//        data:data,
//        async: true
//    }).done(function(res) {
//        var _data = res.data;
//        if (res.code == 1) {
//    //        one.link =  'https://teststatic.wdclc.cn/wx/pages/active/muhammad/share_index.html?championId=' + userId;
//    //        all.link =  'https://teststatic.wdclc.cn/wx/pages/active/muhammad/share_index.html?championId=' + userId;
//            one.link =  "https://static.wdclc.cn/wx/pages/active/muhammad/muhammad_index.html?success=1&uid=" + userId;
//            all.link =  "https://static.wdclc.cn/wx/pages/active/muhammad/muhammad_index.html?success=1&uid=" + userId;
//            sessionStorage.setItem('htmlUrl', _data.url);
//            wxshare();
//        }
//    }).fail(function() {
//        alert('网络链接失败，请刷新重试！');
//        return false;
//    });
//}


//function wxshare(){
//    $.ajax({
//        url: Setting.apiRoot1 + '/wx/jsInfo.p2p',
//        type: 'GET',
//        dataType: 'json',
//        data: {"param": JSON.stringify(info)},
//        async: true
//    }).done(function(res) {
//
//        if (res.code == 1) {
//            var data = res;
//            wx.config({
//                debug: false,
//                appId: data.appId,
//                timestamp: data.timestamp,
//                nonceStr: data.nonceStr,
//                signature: data.signature,
//                jsApiList: [
//                    // 所有要调用的 API 都要加到这个列表中
//                    'checkJsApi',
//                    'onMenuShareTimeline',
//                    'onMenuShareAppMessage',
//                    'onMenuShareQQ',
//                    'onMenuShareWeibo',
//                    'hideMenuItems',
//                    'showMenuItems',
//                    'hideAllNonBaseMenuItem',
//                    'showAllNonBaseMenuItem',
//                    'getNetworkType',
//                    'openLocation',
//                    'getLocation',
//                    'hideOptionMenu',
//                    'showOptionMenu',
//                    'closeWindow'
//                ]
//            });
//
//            wx.ready(function () {
//                wx.onMenuShareAppMessage(one);
//                wx.onMenuShareTimeline(all);
//                wx.onMenuShareQQ(one);
//                wx.onMenuShareWeibo(one);
//            });
//
//        }else{
//            /*alert(res.code);*/
//        }
//
//    }).fail(function() {
//        alert('网络链接失败，请刷新重试！');
//        //return false;
//    });
//}

//function successCallBack() {
//    var  activityName = document.title;
//    $.ajax({
//        url: Setting.apiRoot1 + '/u/activity/share/successCallBack.p2p',
//        type: 'post',
//        dataType: 'json',
//        contentType : "application/x-www-form-urlencoded; charset=UTF-8",
//        data: {
//            activityName:activityName,
//            userId:sessionStorage.getItem('uid'),
//            url:sessionStorage.getItem('htmlUrl'),
//            loginToken:sessionStorage.getItem('loginToken')
//        },
//        async: true
//    }).done(function(res) {
//        if(res.code != 1) {
//            alert(res.message)
//        }
//
//    }).fail(function() {
//        alert('网络链接失败，请刷新重试！');
//        //return false;
//    });
//}

function jumPage() {
    sessionStorage.clear();
    Common.toLogin();
}

function closeClick(number) {
    if(number == 6) {
        Common.toLogin();
    }
    $('.wrapper').removeClass('over');
    $('.alert_box').hide();
}
