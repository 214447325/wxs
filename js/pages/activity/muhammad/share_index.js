/**
 * Created by User on 2017/3/2.
 */
var _random; // 随机数
var uuid = $.cookie('uuid');//获取uuid
var openId = $.cookie('openId');//获取openId
var championId = $.cookie('championId');//擂主ID
var arr = [];
//openId = 111111;
//uuid = 111111;
$(function() {
    window.location.href = '../../../pages/active/muhammad/muhammad_index.html';
    var param = Common.getParam();
    var shareIn = param.shareIn;
    if(shareIn) {
        championId = param.championId;
        if(uuid == undefined || uuid == null || uuid =='') {
            uuid = param.uuid;
        }
        if(openId == undefined || openId == null || openId == '') {
            openId = param.openId;
        }
    } else {
        championId = $.cookie('championId');//擂主ID
    }

    //championId = param.championId;

    var challengerId = param.challengerId;//挑战者
    var $rules = $('.share_ruleImg');//争霸赛的规则
    var $button = $('.share_button_divRight');//我要出拳按钮
    var $imgleft = $('.share_leftImg');
    var $imgright = $('.share_rightImg');

    //challengerId = 55933

	var challengerType = param.challengerType;
    if(championId == challengerId) {
	 alertBox(4,'擂主和挑战者不能是同一个用户');
    }
    $('.share_most').hide();
    var formData = {};
    formData.challengerId = challengerId;//挑战者
    formData.uuid = uuid;
    formData.openId = openId;
    formData.championId = championId;//擂主
    if(uuid != undefined && uuid != null && uuid != '') {
        sessionStorage.setItem('uuid',uuid);
    } else {
        window.location.href = '../../../pages/active/muhammad/muhammad_index.html';
    }

    if(openId != undefined && openId != null && openId != '') {
        sessionStorage.setItem('openId',openId);
    } else {
        window.location.href = '../../../pages/active/muhammad/muhammad_index.html';
    }


    if(championId == undefined || championId == null || championId == '' || championId == 'undefined') {
        window.location.href = '../../../pages/active/muhammad/muhammad_index.html';
    }

    if(challengerId != undefined && challengerId != null && challengerId != '') {
        $('.share_bottom').show();
    }

    var $punches = $('.punches');
    var $participate = $('.participate');//点击立即参与按钮
    var $championInfo = $('.championInfo');//擂主争霸的次数
    var $championWin = $('.championWin');//擂主赢的
    var $championFlat = $('.championFlat');//擂主平的
    var $championLoser = $('.championLoser');//擂主输的
    var $championPhone = $('.share_lcontent');//擂主的手机号
    var $challengerInfo = $('.challengerInfo');//挑战者争霸的次数
    var $challengerWin = $('.challengerWin');//挑战者赢的
    var $challengerFlat = $('.challengerFlat');//挑战者赢的
    var $challengerLoser = $('.challengerLoser');//挑战者赢的
    var $challengerPhone = $('.share_rcontent');//挑战者的手机号
    var $receive = $('.receive');//领取现金

    var $leftImg = $('.left_img');//擂主的头像信息
    var $rightImg = $('.right_img');//挑战者的头像的信息
    var $sumReward = $('.sumReward');//挑战者已获现金

    var $number = $('.numbers');//挑战者剩余的次数
    var _branchData = '';
    var _sumReward = 0;

    $participate.click(function() {
        alertBox(7)
    });


    $receive.click(function() {
        if(($('.share_button_divRight').hasClass('isclick'))) {
            return false;
        }
        var reward = sessionStorage.getItem('sumReward');//金额小于等于0无法进行页面的跳转
        if(reward > 0) {
            if(reward < 50) {
                alertBox(3)
            } else {
                window.location.href = '../../../pages/active/muhammad/muhammad_log.html?challengerId='+challengerId+'&challengerType='+challengerType;
            }
        } else {
         alertBox(4,'您还没有奖励金额无法进行领取');
          return false;
        }
    });

    userInfo();
    //页面加载
    function userInfo() {
        $.ajax({
            url:Setting.apiRoot1 + '/userInfo.p2p',
            type:"post",
            async:false,
            dataType:'json',
            data:formData
        }).done(function(res) {
            if(res.code == 1) {
                var _championInfo = res.data.championInfo;//擂主信息
                var _challengerInfo = res.data.challengerInfo;//挑战者信息
                if(_championInfo != undefined && _championInfo != null && _championInfo != '') {
                    $championPhone.html(_championInfo.phoneNum);
                    $championInfo.html(_championInfo.boxed);//争霸的次数
                    $championWin.html(_championInfo.win);//赢的
                    $championFlat.html(_championInfo.flat);//平的
                    $championLoser.html(_championInfo.loser);//输的
                    $leftImg.attr({'src': _championInfo.headUrl});//擂主的头像
                } else {
                    alertBox(4, res.message)
                }

                if(_challengerInfo != undefined && _challengerInfo != null && _challengerInfo != '') {
                    $challengerPhone.html(_challengerInfo.phoneNum);
                    $challengerInfo.html(_challengerInfo.boxed);//挑战者争霸的次数
                    $challengerWin.html(_challengerInfo.win);//挑战者赢的次数
                    $challengerFlat.html(_challengerInfo.flat);//挑战者平的次数
                    $challengerLoser.html(_challengerInfo.loser);//挑战者输的信息
                    $rightImg.attr({'src': _challengerInfo.headUrl});//挑战者的头像信息

                    $punches.html('我要出拳 X<a class="numbers"> ' +  _challengerInfo.currentCount + ' </a>');//挑战者的次数
                    _sumReward = _challengerInfo.sumReward;
                    sessionStorage.setItem('sumReward', _sumReward);//获取金钱
                    sessionStorage.setItem('challengerPhone', _challengerInfo.phoneNum);
                    $sumReward.html(_sumReward);//挑战者金钱
                } else {
                    //$('.share_cash').html('累计最高可获得50元现金');
                    $('.challenger').html(' ');
                    $('.part').html('尚未胜负记录');
                    $('.share_ring_right').addClass('noRecord');
                    $('.btnTwo').hide();
                    $('.btnOne').show();
                }
            } else {
                alertBox(4, res.message);
            }
        }).fail(function(){
            alertBox(4,'网络链接失败');
            return false
        });
    }

    var isbranch = false;
    //获取猜拳的信息
    var message = '';
    function branch() {
        $.ajax({
            url:Setting.apiRoot1 + '/boxing/branch.p2p',
            type:"post",
            async:false,
            dataType:'json',
            data:formData
        }).done(function(res) {
            if(res.code == 1) {
                _branchData = res;
                isbranch = true;
            } else {
                alertBox(4,res.message);
                isbranch = false;
                $button.addClass('end');
                message = res.message;
                return false;
            }
        }).fail(function(){
            alertBox(4,'网络链接失败');
            isbranch = false;
            $button.addClass('end');
            return false
        });
    }

    //点击我要出拳
    $('.share_button_divRight, .share_rightImg').click(function() {
        if(challengerId == undefined || challengerId == null || challengerId == '') {
            alertBox(7);
            return false;
        }
        if(_sumReward >= 50) {
            alertBox(6);
            return false;
        }
        var i1 = 1;//擂主
        var i2 = 2;//自己
        if(!($button.hasClass('end'))) {//判断是否还有机会猜拳
            if(!($button.hasClass('start'))) {//用来控制请求
                branch();
                $button.addClass('start');
            }
        }

        if(($('.share_button_divRight').hasClass('isclick'))) {
            return false;
        }

        if(!($('.share_button_divRight').hasClass('isclick'))){
            time = setInterval(function(){
                if(isbranch) {
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
                }
            },100);
           if(!($button.hasClass('end'))) {
               //var _count =  $number.html();
               //$number.html(_count - 1);
               $button.addClass('isclick');
           } else {
               alertBox(4, message);
               return false;
           }
        }
        setTimeout(function() {
            clearInterval(time);
            $button.removeClass('start');
            if(_branchData.code == 1) {
                var _type = _branchData.data;
                //var _amount = _branchData.data.amount;
                var _amount = '';
                var _full = _branchData.data.full;
                //表示最后一次抽奖接近50
                if(_full != undefined && _full != '' &&  _full != null) {
                    _type = _full;
                }
                /**
                 * -1输
                 * 0平
                 * 1赢
                 */
                var  num = 1;
                //输的
                if(_type == -1) {
                    num = i1 + 1;
                    if(num == 4) {
                        num = 1;
                    }
                }

                //平的
                if(_type == 0) {
                    num = i1;
                }

                //赢的
                if(_type == 1) {
                    num = i1 - 1 ;
                    if(num == 0) {
                        num = 3;
                    }
                }

                $imgleft.attr({'src':'../../../images/pages/activity/muhammad/left' + i1 +'.png'});
                $imgright.attr({'src':'../../../images/pages/activity/muhammad/right' + num +'.png'});
                setTimeout(function() {
                    if(_full != undefined && _full != '' && _full != null) {
                        alertBox(4,'您的现金奖励已满50元，请前往领取!')
                    } else {
                        alertBox(5,_type, _amount);
                    }

                    $button.removeClass('isclick');
                    //更新数据
                    userInfo();
                },600);
            }
        },2000)
    });

    $rules.click(function() {
        alertBox(1)
    });

    //点击查看按钮
    $('.look').click(function() {
        window.location.href = '../../../pages/active/muhammad/accountuser.html?uid=' + challengerId ;
    });


    //分享
    var url = window.location.href.split("#")[0];//获取地址
    var imgurl = 'http://106.15.44.101/group1/M00/00/11/ag8sZVlkMFmAGGwXAACHCYziLKU845.jpg';//获取图片的logo

    var info = {
        url:url
    };

    var one = {
        title: '来拳王争霸，与我大战三百回合！人人有钱！',
        desc: '战胜我！百元现金与最高3%加息券就给你！预备备...一二三，剪拳布！',
        link: 'https://static.wdclc.cn/wx/pages/active/muhammad/muhammad_index.html',
        imgUrl: imgurl

    };

    var all = {
        title: '来拳王争霸，与我大战三百回合！人人有钱！',
        desc: '战胜我！百元现金与最高3%加息券就给你！预备备...一二三，剪拳布！',
        link: 'https://static.wdclc.cn/wx/pages/active/muhammad/muhammad_index.html',
        imgUrl: imgurl
    };
    wxshare();

    function wxshare(){
        $.ajax({
            url: Setting.apiRoot1 + '/wx/jsInfo.p2p',
            type: 'GET',
            dataType: 'json',
            data: {"param": JSON.stringify(info)},
            async: true
        }).done(function(res) {

            if (res.code == 1) {
                var data = res;

                wx.config({
                    debug: false,
                    appId: data.appId,
                    timestamp: data.timestamp,
                    nonceStr: data.nonceStr,
                    signature: data.signature,
                    jsApiList: [
                        // 所有要调用的 API 都要加到这个列表中
                        'checkJsApi',
                        'onMenuShareTimeline',
                        'onMenuShareAppMessage',
                        'onMenuShareQQ',
                        'onMenuShareWeibo',
                        'hideMenuItems',
                        'showMenuItems',
                        'hideAllNonBaseMenuItem',
                        'showAllNonBaseMenuItem',
                        'getNetworkType',
                        'openLocation',
                        'getLocation',
                        'hideOptionMenu',
                        'showOptionMenu',
                        'closeWindow'
                    ]
                });

                wx.ready(function () {
                    wx.onMenuShareAppMessage(one);
                    wx.onMenuShareTimeline(all);
                    wx.onMenuShareQQ(one);
                    wx.onMenuShareWeibo(one);
                });

            }else{
                /*alert(res.code);*/
            }

        }).fail(function() {
            alert('网络链接失败，请刷新重试！');
            //return false;
        });
    }
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
 * tex:表示带有谈出的内容（如：请求不成功）
 */


function alertBox(number,tex,monery) {
    var $box = $('.alert_box');
    $('.wrapper').addClass('over');
    $box.show();
    var _html = '';
    var _text = '';
    var _content = '';
    var _btnContent = '';
    _html += '<div class="alert_back"></div>' ;

    var param = Common.getParam();
    var challengerId = param.challengerId;//擂主ID
    var challengerType = param.challengerType;
    switch (number){
        case 1:{
            _text += '<div class="alertBox_rule">' +
            '<img src="../../../images/pages/activity/muhammad/close.png" class="closeBox" onclick="closeClick()">' +
            '<div class="alert_Box_Rule">' +
            '<div class="alert_Rule_title">活动细则</div>' +
            '<div class="alert_Rule_One">1、即日起-2017年8月10日，参与活动猜拳拿奖励，每天可挑战同一个用户3次；</div>' +
            '<div class="alert_Rule_rest">2、根据用户猜拳赢的相应次数，可获得相应投资红包奖励：<div class="div_table"><table><tr><td>猜赢次数</td><td>红包金额</td></tr><tr><td>50</td><td>30元</td></tr><tr><td>80</td><td>80元</td></tr> <tr><td>100</td><td>125元</td></tr></table></div></div>' +
            '<div class="alert_Rule_rest">3、用户每赢100次，即可获得1颗金星，且奖励进度清零，开始新一轮奖励计算；</div>' +
            '<div class="alert_Rule_rest">4、用户集满相应数量的金星，即可获得额外奖励：<div class="div_table_six"><table><tr><td>金星数量</td><td>额外奖励</td></tr><tr><td>1颗</td><td>1%全程加息券+30元现金</td></tr><tr><td>3颗</td><td>2%全程加息券+50元现金</td></tr> <tr><td>5颗</td><td>3%全程加息券+100元现金</td></tr></table></div></div>' +
            '<div class="alert_Rule_rest">5、奖品发放<p>①全程加息券：发放至“账户-超值礼券”中；</p><p>②现金：发放至“账户-现金奖励”中，可进入查看并提取至余额；</p><p>③投资红包：发放至“账户-超值礼券”中，可进入查看；</p></div>' +
            '</div>' +
            '</div>';
            break;
        }

        case 3 :{
            var _alertTitle = '';
            _alertTitle = '温馨提示';
            _content = '<div style="color: #000000;height:1.5rem;font-weight: bold">红包还没攒够，你确定现在就要领取吗？听说养肥了变成50元大红包再领效果会更棒哦~';
            _btnContent = '<div class="alert_Share_Button">' +
            '<a href="../../../pages/active/muhammad/muhammad_log.html?challengerId=' + challengerId+ '&challengerType='+challengerType+'">' +
            '<div class="alert_Share_Left">我偏要领</div>' +
            '</a>' +
            '<div class="alert_Share_Right" onclick="closeClick()">我再等等</div>' +
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
                _texContent = '<p>你的神来之拳瞬间秒杀了擂主</p><p class="texp">祝你百战百胜！能否走向人生巅峰就看下一拳了！</p>';
            }

            //平
            if(tex == 0) {
                _texContent = '<p>你和擂主拳逢对手难分胜负</p><p class="texp">快去找高人买本《夺擂十八拳》再战吧！</p>';
            }

            //输
            if(tex == -1) {
                _texContent = '<p>只见擂主一个神龙摆尾你就上天了</p><p class="texp">快去买箱辣条压压惊吧！</p>';
            }

            _text += '<div class="play_box result_box">' +
            '<img src="../../../images/pages/activity/muhammad/close.png" class="closeBox closeBox2" onclick="closeClick()">' +
            //'<img src="../../../images/pages/activity/muhammad/hand.png" class="hand" >' +
            '<div class="sweet_title"></div>' +
            '<div class="sweet_play_content sweet_results">' + _texContent +'</div>' +
            '<div class="play_button ruselut" onclick="closeClick()">确定</div>' +
            '</div>';
            break;
        }

        case 6 : {
            _text += '<div class="play_box">' +
            '<img src="../../../images/pages/activity/muhammad/close.png" class="closeBox" onclick="closeClick()">' +
            '<div class="sweet_title">赢了</div>' +
            '<div class="sweet_play_content sweet_play_reward">您的获奖金额已满50元，赶快领取现金吧~</div>' +
            '<div class="play_button" onclick="closeClick()">确定</div>' +
            '</div>';
            break;
        }

        case 7 : {
            _random = new Date().getTime();//生成任意的随机数
            var _content = '<form>' +
                '<input type="text" class="phone_text" name="phone" placeholder="请输入您的手机号码"/>' +
                '<input type="text" class="imgcode" name="vcode" placeholder="请输入验证码" /> ' +
                '<div class="codeImg Verification-code registernumber"><img src="' + Setting.apiRoot1 + '/code.p2p?type=1&divnceId=' + _random + ' " class="code_img" onclick="changeCode()"/></div>' +
                '<div class="alertser"></div>'+
                '</form>';
            _text += '<div class="countless_box">' +
            '<img src="../../../images/pages/activity/muhammad/close.png" class="closeBox" onclick="closeClick()">' +
            '<div class="sweet_title">报名挑战擂主</div>' +
            '<div class="share_describe">手机号将作为领取奖品的唯一凭证</div>' +
            '<div class="phone_input">' + _content + '</div>' +
            '<div class="play_button countless_button" onclick="closeClick(7)">确定</div>' +
            '</div>';

            break;
        }
    }
    _html += _text;
    _html += '</div>';
    $box.html(_html);
}


function closeClick(number) {
    var $alertser = $('.alertser');//提示的内容
	var result = 0;
    if(number == 7) {
        var param = Common.getParam();
        var $phone = $('input[name="phone"]');
        var $vcode = $('input[name="vcode"]');
        var phone = $.trim($phone.val());
        var vcode = $.trim($vcode.val());
        if(checkForm(phone,vcode)) {
            $.ajax({
                url: Setting.apiRoot1 + '/applyForBoxing.p2p',
                type: 'post',
                dataType: 'json',
                data: {
                    phoneNum:phone,
                    uuid:uuid,
                    openId:openId,
                    championId:championId,
                    code:vcode,
                    divnceId:_random
                }
            }).done(function(res) {
                if(res.code == 1) {
                    window.location.href = '../../../pages/active/muhammad/share_index.html?challengerId='+res.data.challengerId+'&challengerType='+res.data.challengerType + '&championId=' + championId;
                } else {
                    alertBox(4,res.message);
                }
            }).fail(function() {
                alertBox(4,'网络链接失败');
                return false;
            });
        }
    } else {
        $('.wrapper').removeClass('over');
        $('.alert_box').hide();
    }
}

function checkForm(phone, vcode){

    var $alertser = $('.alertser');//提示的内容
    if(phone.length == 0){
        alertBox(4,'请输入手机号码！');
        return false;
    }

    if(!Common.reg.mobile.test(phone)){
        alertBox(4,'请输入正确的手机号码！');
        return false;
    }

    if(vcode.length == 0){
        alertBox(4,'请输入验证码！');
        return false;
    }
    $alertser.html(' ');
    return true;
}

function changeCode() {
    _random = new Date().getTime();//生成任意的随机数
    $('.code_img').attr({'src': Setting.apiRoot1 + '/code.p2p?type=1&divnceId=' + _random});
}