/**
 * Created by User on 2017/11/28.
 */
$(function() {

    var vcion = {};
    var $slide = $('.slide');
    var count = 0;
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


    if(pageCount != undefined && pageCount != null && pageCount != '') {
        count = parseInt(pageCount);
    }
    var _vcoin = {};
    vcionInit(count);
    $.extend(vcion,{
        vcoinOneRules:function(_data) {
            $('.swiper1').removeClass('swiperSlide');
            var code = parseInt(_data.code);
            var _html={};
            switch (code) {
                case 1:{
                    _html.text = '恭喜您！！获得<a>15元现金红包</a>一个 已放入您的“账户-现金奖励”中';
                    _html.t = '15';
                    _html.icon = '元';
                    _html.iconText = '现金红包';
                    _html.clas = 'actIcon1';
                    break;
                }

                case 2:{
                    _html.text = '恭喜您！！获得<a>2%天数加息券（1天）</a>一张 已放入您的“账户-超值礼券”中';
                    _html.t = '2';
                    _html.icon = '%';
                    _html.iconText = '天数加息券';
                    _html.clas = 'actIcon2';
                    break;
                }

                case 3:{
                    _html.text = '恭喜您！！获得<a>38888元体验金（1天）</a>一张 已放入您的“账户-超值礼券”中';
                    _html.t = '38888';
                    _html.icon = ' ';
                    _html.iconText = '体验金';
                    _html.clas = 'actIcon3';
                    break;
                }
            }
            var areacontent = '';
            var t = '';
            if(parseInt(_vcoin.number) < 3) {
                t = '投资赚V币';
            } else {
                t = '再来一次';
            }
            areacontent = areacontent + '<div class="area1title">' + _html.text +'</div>' +
            '<div class="actIcon ' + _html.clas + '"><a>' + _html.t + '<a class="a1">' + _html.icon +'</a></a>' +  _html.iconText + '</div>' +
            '<div class="act1bottom">' +
            '<div class="act1leftdiv">立即查看</div>' +
            '<a class="act1left disabled" href="javascript:;"></a>' +
            '<div class="act1rightdiv">' + t + '</div>' +
            '<a class="act1right disabled" href="javascript:;"></a>' +
            '</div>';
            $('#act1area').removeClass('area1').html(' <canvas class="canvas" id="canvas"></canvas>' +
            '<div id="areacontent">' + areacontent + '</div>');
                var ctx;
                var canvas = document.querySelector('canvas');
                var offsetX = canvas.offsetLeft;
                var offsetY = canvas.offsetTop;
                var mousedown = false;
                ctx=canvas.getContext('2d');
                ctx.fillStyle='transparent';
                ctx.fillRect(0, 0, 400, 200);
                layer(ctx);
                ctx.globalCompositeOperation = 'destination-out';
                canvas.addEventListener('touchstart', eventDown);
                canvas.addEventListener('touchend', eventUp);
                canvas.addEventListener('touchmove', eventMove);
                canvas.addEventListener('mousedown', eventDown);
                canvas.addEventListener('mouseup', eventUp);
                canvas.addEventListener('mousemove', eventMove);
                function layer(ctx) {
                    mui('.mui-slider').slider().setStopped(false);
                    //var img = new Image();
                    //img.src="../../../images/pages/activity/coin/act1back.png";
                    //var pattern = ctx.createPattern(img, "no-repeat");
                    //ctx.fillStyle=pattern;
                    //ctx.drawImage(img, 0, 0, 400, 200);
                    ctx.fillStyle = '#919191';
                    ctx.fillRect(0, 0, 400, 200);
                }

                function eventDown(e){
                    mui('.mui-slider').slider().setStopped(false);
                    e.preventDefault();
                    mousedown=true;
                }

                function eventUp(e){
                    mui('.mui-slider').slider().setStopped(false);
                    e.preventDefault();
                    mousedown=false;
                }

                function eventMove(e){
                    mui('.mui-slider').slider().setStopped(true);
                    e.preventDefault();
                    var $act1left = $('.act1left');
                    var $act1right = $('.act1right');
                    if($act1left.hasClass('disabled')) {
                        $act1left.removeClass('disabled');
                    }

                    if($act1right.hasClass('disabled')) {
                        $act1right.removeClass('disabled');
                    }
                    if(mousedown) {
                        if(e.changedTouches){
                            e=e.changedTouches[e.changedTouches.length-1];
                        }

                        //var x = (e.clientX + document.body.scrollLeft || e.pageX) - offsetX || 0,
                        //    y = (e.clientY + document.body.scrollTop + 100 || e.pageY) - offsetY || 0;
                        var c = document.getElementById("canvas");
                        var rect = c.getBoundingClientRect();
                        var x = e.clientX - rect.left * (c.width / rect.width) || 0,
                            y = e.clientY - rect.top * (c.height / rect.height) || 0;
                        with(ctx) {
                            beginPath();
                            //arc(x, y - 430, 15, 0, Math.PI * 2);
                            arc(x, y-100, 15, 0, Math.PI * 2);
                            fill();
                        }
                    }
                }

            //点击立即查看按钮
            $('.act1left').click(function() {
                if($(this).hasClass('disabled')) {
                    return false;
                }

                if(code == 1) {
                    if(type != undefined && type != null && type != '') {
                        if(type == 1) {
                            window.AndroidWebView.setMyreward();
                        }
                        if(type == 2) {
                            iOS.HtmlJumpRewardCenterVC();
                        }
                    } else {
                        window.location.href = Setting.staticRoot + '/pages/my-account/rewardCenter.html?uid=' + userId + '&loginToken=' + loginToken;
                    }

                } else {
                    if(type != undefined && type != null && type != '') {
                        if(type == 1) {
                            window.AndroidWebView.setCenterreward();
                        }
                        if(type == 2) {
                            iOS.HtmlJumpMyRewardVC();
                        }
                    } else {
                        window.location.href = Setting.staticRoot + '/pages/my-account/reward/red-envelope.html?uid=' + userId + '&loginToken=' + loginToken;
                    }
                }
            });

            //点击再来一次
            $('.act1right').click(function() {
                if($(this).hasClass('disabled')) {
                    return false;
                }
                if(parseInt(_vcoin.number) < 3) {
                    if(type != undefined && type != null && type != '') {
                        if(type == 1) {
                            window.AndroidWebView.setRegular();
                        }
                        if(type == 2) {
                            iOS.HtmlJumpRegular();
                        }
                    } else {
                        window.location.href = Setting.staticRoot + '/pages/financing/regular.html?uid=' + userId + '&loginToken=' + loginToken;
                    }
                } else {
                    if(type != undefined && type != null && type != '') {
                        if(type == 1) {
                            window.AndroidWebView.setresh();
                        }
                        if(type == 2) {
                            iOS.HtmlReloadVC();
                        }
                        //window.location.href = Setting.staticRoot + '/pages/active/coin/vcoin.html?uid=' + userId + '&loginToken=' + loginToken;
                    } else {
                        window.location.href = Setting.staticRoot + '/pages/active/coin/vcoin.html?uid=' + userId + '&loginToken=' + loginToken;
                        //window.location.reload();
                    }
                }


            })


        },
        //活动规则
        activeRules:function() {
            var $uivicon = $('.ui-vcoin');
            var text = '<div class="ui-vcoin-back"></div>' +
                '<div class="rules">' +
                '<div class="rules-box">' +
                '<div class="rules-text">' +
                '<div class="rules-text-title">活动规则</div>' +
                '<div class="rulestext">1.活动时间:2017.12.07~2017.12.25；</div>' +
                '<div class="rulestext">2、投资相应产品单笔每满1万元即可获得相应数量的V币（详情参见活动页面）；</div>' +
                '<div class="rulestext">3.相应数量的V币可参加对应游戏，赢取奖励（详情参见活动页面游戏规则）；</div>' +
                '<div class="rulestext">4、活动结束后V币失效；</div>' +
                '<div class="rulestext">5、活动期间可以使用投资红包、全程加息券、天数加息券。</div>' +
                '</div>' +
                '</div>' +
                '<div class="closediv1">' +
                '<a class="colserules" href="javascript:;"></a>' +
                '</div>' +
                '</div>';
            $uivicon.html(text);
            var $uiBox = $('.rules');
            $uiBox.animate({'right':'0'},1000);
            $('.wrapper').addClass('_scro');
            var height = $(window).height();
            var uiHeight = $uiBox.height();
            $uiBox.css({'top': ((height -uiHeight ) / 2)});
            $('.colserules').click(function() {
                $uiBox.animate({'right':'-8.3rem'},1000,function() {
                    $uivicon.html('');
                    $('.wrapper').removeClass('_scro');
                });

            })
        },
        vcoinAlert:function(t,a) {
            var $uivicon = $('.ui-vcoin');
            var text = '<div class="ui-vcoin-back"></div>' +
                '<div class="ui-vcoin-box">' +
                '<div class="closediv"><a class="closea" href="javascript:;" ></a></div>' +
                '<div class="ui-content">' +
                '<div class="uitext">' + t + '</div>' +
                '<a class="aclose1" href="javascript:;">' + a + '</a>' +
                '</div>' +
                '</div>';
            $uivicon.html(text);
            $('.wrapper').addClass('_scro');
            var height = $(window).height();
            var $uiBox = $('.ui-vcoin-box');
            var uiHeight = $uiBox.height();
            $uiBox.css({'top': ((height -uiHeight ) / 2)});
            $('.closediv').click(function() {
                $uivicon.html('');
                $('.wrapper').removeClass('_scro');
            })
        },
        //猜点数
        vcoinTwoChange: function() {
            var $uivicon = $('.ui-vcoin');
            var text = '<div class="ui-vcoin-back"></div>' +
                '<div class="actback2-div">' +
                '<div class="closediv"><a class="closea" href="javascript:;" ></a></div>' +
                '<div class="ui2-content">' +
                '<div class="ui2-content-title">请选择大小:</div>' +
                '<div class="ui2-content-box">' +
                '<a class="act2left" href="javascript:;">' +
                '<div class="g" text="2"></div>' +
                '</a>' +
                '<a class="act2right" href="javascript:;">' +
                '<div class="g" text="1"></div>' +
                '</a>' +
                '</div>' +
                '<a class="act2button" href="javascript:;">提交竞猜</a>' +
                '</div>' +
                '</div>';
            $uivicon.html(text);
            $('.wrapper').addClass('_scro');
            var $uiBox = $('.actback2-div');
            var height = $(window).height();
            var uiHeight = $uiBox.height();
            $uiBox.css({'top': ((height -uiHeight ) / 2)});
            $('.closediv').click(function() {
                $('.abutton2').removeClass('disabled');
                $('.wrapper').removeClass('_scro');
                $uivicon.html('');
            });

            var dice = $("#act2dice");

            $('.g').click(function() {
                $('.g').removeClass('isg');
                $(this).addClass('isg');
            });

            $('.act2button').click(function() {
                var choose = $('.isg').attr('text');
                $('.wrapper').removeClass('_scro');
                $('.ui-vcoin').html('');
                if(parseInt(choose) > 0) {
                    $.ajax({
                        url:Setting.apiRoot1 + '/u/vcoinbiglotto/dice.p2p',
                        dataType:'json',
                        type:'post',
                        data:{
                            userId:userId,
                            loginToken:loginToken,
                            choose:choose
                        }
                    }).done(function (res) {
                        if(res.code == 1) {
                            getCount();
                            var _data = res.data;
                            var _point = _data.point;
                            $(".act2wrap").append("<div id='dice_mask'></div>");//加遮罩
                            dice.attr("class","act2dice");//清除上次动画后的点数
                            dice.css('cursor','default');
                            //var num = Math.floor(Math.random()*6+1);//产生随机数1-6
                            var num = parseInt(_point);
                            dice.animate({left: '+2px'}, 200,function(){
                                dice.addClass("dice_t");
                            }).delay(200).animate({top:'-2px'},200,function(){
                                dice.removeClass("dice_t").addClass("dice_s");
                            }).delay(200).animate({opacity: 'show'},600,function(){
                                dice.removeClass("dice_s").addClass("dice_e");
                            }).delay(100).animate({left:'-2px',top:'2px'},200,function(){
                                dice.removeClass("dice_e").addClass("dice_"+num);

                                var _d = {};
                                _d.class1 = 'ui2icon1';
                                _d.href = Setting.staticRoot + '/pages/my-account/rewardCenter.html?uid=' + userId + '&loginToken=' + loginToken;
                                if(parseInt(num) > 3) {
                                    _d.ntext = num + '点，大！';
                                    if(parseInt(choose) == 1) {
                                        _d.ctext = '恭喜您！！获得<a>25元现金</a>红包，已放入您的“账户-现金奖励”中';
                                        _d.ctext1 = '<a>25<a class="a2">元</a></a>现金红包';

                                    }
                                    if(parseInt(choose) == 2) {
                                        _d.ctext = '别灰心，送您<a>5元现金</a>红包加油打气，已放入您的“账户-现金奖励”中';
                                        _d.ctext1 = '<a>5<a class="a2">元</a></a>现金红包'
                                    }
                                }
                                if(parseInt(num) <= 3) {
                                    _d.ntext = num + '点，小！';
                                    if(parseInt(choose) == 1) {
                                        _d.ctext = '别灰心，送您<a>5元现金</a>红包加油打气，已放入您的“账户-现金奖励”中';
                                        _d.ctext1 = '<a>5<a class="a2">元</a></a>现金红包'
                                    }

                                    if(parseInt(choose) == 2) {
                                        _d.ctext = '恭喜您！！获得<a>25元现金</a>红包，已放入您的“账户-现金奖励”中';
                                        _d.ctext1 = '<a>25<a class="a2">元</a></a>现金红包'
                                    }
                                }
                                dice.css('cursor','pointer');
                                $("#dice_mask").remove();//移除遮罩
                                var c =  setInterval(function() {
                                    $('.abutton2').removeClass('disabled');
                                    vcion.vcoinTwoResult(_d);
                                    clearInterval(c);
                                },1000);
                            });
                        } else {
                            alert(res.message);
                            $('.abutton2').removeClass('disabled');
                            return false;
                        }
                    }).fail(function () {
                        alert('网络连接失败');
                        $('.abutton2').removeClass('disabled');
                        return false;
                    })
                } else {
                    alert('请选择大小');
                    $('.abutton2').removeClass('disabled');
                    $('.submit').click(function() {
                        vcion.vcoinTwoChange();
                    });
                    return false;
                }

            });

        },
        vcoinTwoResult:function(data) {
            var $uivicon = $('.ui-vcoin');
            var text = '<div class="ui-vcoin-back"></div>' +
                '<div class="actback2-div">' +
                '<div class="closediv"><a class="closea" href="javascript:;" ></a></div>' +
                '<div class="ui2-content ui2-content1">' +
                '<div class="ui2-showcontent-title">' + data.ntext + '</div>' +
                '<div class="ui2-content-text">' +
                '<div class="ui2-text">' + data.ctext + '</div>' +
                '<div class="ui2icon ' + data.class1 + '">'+ data.ctext1 +
                '</div>' +
                '<a class="act2button looka" href="javascript:;">立即查看</a>' +
                '</div>' +
                '</div>';
            $uivicon.html(text);
            $('.wrapper').addClass('_scro');
            var $uiBox = $('.actback2-div');
            var height = $(window).height();
            var uiHeight = $uiBox.height();
            $uiBox.css({'top': ((height -uiHeight ) / 2)});
            $('.closediv').click(function() {
                $('.wrapper').removeClass('_scro');
                $uivicon.html('');
            });

            $('.looka').click(function() {
                if(type != undefined && type != null && type != '') {
                    if(type == 1) {
                        window.AndroidWebView.setMyreward();
                    }
                    if(type == 2) {
                        iOS.HtmlJumpRewardCenterVC();
                    }
                } else {
                    window.location.href = data.href;
                }
            })
        },
        vcoinThreeResult:function(res) {
            var data = {};
            data.ntext = '';
            if(res.code == 1 || res.code == 2 || res.code == 3 || res.code == 6 || res.code == 7) {
                data.class1 = 'ui2icon1';
               if(res.code == 1) {
                   data.ctext = '恭喜您！！获得<a style="color: rgb(255,132,0)">50元现金</a>红包一个，已放入您的“账户-现金奖励”中';
                   data.ctext1 = '<a>50<a class="a2">元</a></a>现金红包';
               }
                if(res.code == 2) {
                    data.ctext = '恭喜您！！获得<a style="color: rgb(255,132,0)">15元现金</a>红包一个，已放入您的“账户-现金奖励”中';
                    data.ctext1 = '<a>15<a class="a2">元</a></a>现金红包';
                }

                if(res.code == 3) {
                    data.ctext = '恭喜您！！获得<a style="color: rgb(255,132,0)">20元现金</a>红包一个，已放入您的“账户-现金奖励”中';
                    data.ctext1 = '<a>20<a class="a2">元</a></a>现金红包';
                }

                if(res.code == 6) {
                    data.ctext = '恭喜您！！获得<a style="color: rgb(255,132,0)">100元现金</a>红包一个，已放入您的“账户-现金奖励”中';
                    data.ctext1 = '<a>100<a class="a2">元</a></a>现金红包';
                }

                if(res.code == 7) {
                    data.ctext = '恭喜您！！获得<a style="color: rgb(255,132,0)">80元现金</a>红包一个，已放入您的“账户-现金奖励”中';
                    data.ctext1 = '<a>80<a class="a2">元</a></a>现金红包';
                }

            }

            if(res.code == 8) {
                data.class1 = 'ui2icon2';
                data.ctext = '恭喜您！！获得<a style="color: rgb(255,132,0)">5%天数加息券（1天）</a>一张，已放入您的“账户-超值礼券”中';
                data.ctext1 = '<a>5<a class="a2">%</a></a>天数加息券';
            }
            if(res.code == 4) {
                data.class1 = 'ui2icon3';
                data.ctext = '恭喜您！！获得<a style="color: rgb(255,132,0)">98888元体验金（1天）</a>一张，已放入您的“账户-超值礼券”中';
                data.ctext1 = '<a>98888<a class="a2"></a></a>体验金';
            }
            var $uivicon = $('.ui-vcoin');
            var text = '<div class="ui-vcoin-back"></div>' +
                '<div class="actback2-div">' +
                '<div class="closediv"><a class="closea" href="javascript:;" ></a></div>' +
                '<div class="ui2-content ui2-content1">' +
                '<div class="ui2-showcontent-title" style="height: 0.5rem">' + data.ntext + '</div>' +
                '<div class="ui2-content-text">' +
                '<div class="ui2-text">' + data.ctext + '</div>' +
                '<div class="ui2icon ' + data.class1 + '">'+ data.ctext1 +
                '</div>' +
                '<a class="act2button looka" href="javascript:;">立即查看</a>' +
                '</div>' +
                '</div>';
            $uivicon.html(text);
            $('.wrapper').addClass('_scro');
            var $uiBox = $('.actback2-div');
            var height = $(window).height();
            var uiHeight = $uiBox.height();
            $uiBox.css({'top': ((height -uiHeight ) / 2)});
            $('.closediv').click(function() {
                $('.wrapper').removeClass('_scro');
                $uivicon.html('');
            });

            $('.looka').click(function() {
                if (res.code == 1 || res.code == 2 || res.code == 3 || res.code == 6 || res.code == 7) {
                    if(type != undefined && type != null && type != '') {
                        if(type == 1) {
                            window.AndroidWebView.setMyreward();
                        }
                        if(type == 2) {
                            iOS.HtmlJumpRewardCenterVC();
                        }
                    } else {
                        window.location.href = Setting.staticRoot + '/pages/my-account/rewardCenter.html?uid=' + userId + '&loginToken=' + loginToken;
                    }
                } else {
                    if(type != undefined && type != null && type != '') {
                        if(type == 1) {
                            window.AndroidWebView.setCenterreward();
                        }

                        if(type == 2) {
                            iOS.HtmlJumpMyRewardVC();
                        }
                    } else {
                        window.location.href = Setting.staticRoot + '/pages/my-account/reward/red-envelope.html?uid=' + userId + '&loginToken=' + loginToken;
                    }
                }
            })
        },
        //九宫格获取的是V币
        vcionThreeGetV: function() {
            var $uivicon = $('.ui-vcoin');
            var text = '<div class="ui-vcoin-back"></div>' +
                '<div class="actback2-div">' +
                '<div class="closediv"><a class="closea" href="javascript:;" ></a></div>' +
                '<div class="ui2-content ui2-content1">' +
                '<div class="ui2-content-text">' +
                '<div class="ui2-text activem">恭喜您！！<a>获得20个V币</a></div>' +
                '<div class="activemdiv">' +
                '<div class="activemdivleft">' +
                '<div class="activemdivlefticon"></div>' +
                '</div>' +
                '<div class="activemdivright">+20</div>' +
                '</div>'+
                '<a class="act2button looka" href="javascript:;">立即查看</a>' +
                '</div>' +
                '</div>';
            $uivicon.html(text);
            var $wrapper = $('.wrapper');
            $wrapper.addClass('_scro');
            var $uiBox = $('.actback2-div');
            var height = $(window).height();
            var uiHeight = $uiBox.height();
            $uiBox.css({'top': ((height -uiHeight ) / 2)});
            $('.closediv').click(function() {
                $('.wrapper').removeClass('_scro');
                $uivicon.html('');
            });

            $('.looka').click(function() {
                $wrapper.removeClass('_scro').scrollTop( $('.wrapper')[0].scrollHeight );
                $uivicon.html('');
            })
        },
        //九宫格活动
        vcionThreeFun:function(data) {
            var lottery = {
                index: -1,    //当前转动到哪个位置，起点位置
                count: 0,     //总共有多少个位置
                timer: 0,     //setTimeout的ID，用clearTimeout清除
                speed: 20,    //初始转动速度
                times: 0,     //转动次数
                cycle: 50,    //转动基本次数：即至少需要转动多少次再进入抽奖环节
                prize: -1,    //中奖位置
                init: function(id) {
                    if ($('#' + id).find('.lottery-unit').length > 0) {
                        $lottery = $('#' + id);
                        $units = $lottery.find('.lottery-unit');
                        this.obj = $lottery;
                        this.count = $units.length;
                        $lottery.find('.lottery-unit.lottery-unit-' + this.index).addClass('active');
                    };
                },
                roll: function() {
                    var index = this.index;
                    var count = this.count;
                    var lottery = this.obj;
                    $(lottery).find('.lottery-unit.lottery-unit-' + index).removeClass('active');
                    index += 1;
                    if (index > count - 1) {
                        index = 0;
                    };
                    $(lottery).find('.lottery-unit.lottery-unit-' + index).addClass('active');
                    this.index = index;
                    return false;
                },
                stop: function(index) {
                    this.prize = index;
                    return false;
                }
            };

            function roll() {
                lottery.times += 1;
                lottery.roll(); //转动过程调用的是lottery的roll方法，这里是第一次调用初始化
                if (lottery.times > lottery.cycle + 10 && lottery.prize == lottery.index) {
                    clearTimeout(lottery.timer);
                    lottery.prize = -1;
                    lottery.times = 0;
                    var c =  setInterval(function() {
                        $('.draw-btn').removeClass('disabled');
                        if(data.code == 5) {
                            vcion.vcionThreeGetV(data);
                        } else {
                            vcion.vcoinThreeResult(data);
                        }
                        clearInterval(c);
                    },1000);
                    click = false;
                } else {
                    if (lottery.times < lottery.cycle) {
                        lottery.speed -= 10;
                    } else if (lottery.times == lottery.cycle) {
                        //var index = Math.random() * (lottery.count) | 0; //静态演示，随机产生一个奖品序号，实际需请求接口产生
                        var index = parseInt(data.code) - 1;
                        lottery.prize = index;
                    } else {
                        if (lottery.times > lottery.cycle + 10 && ((lottery.prize == 0 && lottery.index == 7) || lottery.prize == lottery.index + 1)) {
                            lottery.speed += 110;
                        } else {
                            lottery.speed += 20;
                        }
                    }
                    if (lottery.speed < 40) {
                        lottery.speed = 40;
                    };
                    lottery.timer = setTimeout(roll, lottery.speed); //循环调用
                }
                return false;
            }
            var click = false;
            lottery.init('lottery');
            if (click) { //click控制一次抽奖过程中不能重复点击抽奖按钮，后面的点击不响应
                return false;
            } else {
                lottery.speed = 100;
                roll(); //转圈过程不响应click事件，会将click置为false
                click = true; //一次抽奖完成后，设置click为true，可继续抽奖
                return false;
            }
        }
    });

    //$('.aslide').click(function() {
    //    var slide = $(this).attr('slide');
    //    if($slide.hasClass(slide)) {
    //        return false;
    //    }
    //    var coun = $(this).attr('count');
    //    count = parseInt(coun);
    //    sessionStorage.setItem('pageCount',count);
    //    window.location.reload();
    //    //window.location.href = Setting.staticRoot + '/pages/active/coin/vcoin.html?pageCount=' + count + '&uid=' + userId + '&loginToken=' + loginToken;
    //    //$slide.removeClass().addClass(slide);
    //    //init(count);
    //});


    getCount();
    //获得该用户V币
    function getCount(c,d) {
        if(userId != undefined && userId != null && userId != '') {
            $.ajax({
                url:Setting.apiRoot1 + '/u/vcoinbiglotto/getVCoinNumber.p2p',
                type: 'post',
                dataType: 'json',
                async:false,
                data : {
                    userId : userId,
                    loginToken:loginToken
                }
            }).done(function(res) {
                if(res.code == 1) {
                    var data = res.data;
                    _vcoin.number = data.number;
                    $('.text11').html(_vcoin.number);
                    if(c == 1) {
                        vcion.vcoinOneRules(d);
                    }
                } else {
                    alert(res.message);
                    return false;
                }
            }).fail(function() {
                alert('网络连接失败！');
                return false;
            });
        }
    }
    //点击活动规则按钮；
    $('.core').click(function() {
        vcion.activeRules();
    });

    //点击分享按钮
    var shareButton = $(".shareActive");
    var imgurl = 'http://106.15.44.101/group1/M00/00/17/ag8sZVog0Q-AIi-1AADHLvFsUTM113.jpg';
    var title = 'V币大乐透';
    var desc = '有一个玩游戏还挣钱的机会我想送给你...';
    var link = Setting.staticRoot + '/pages/active/coin/vcoin.html';
    //if(type != undefined && type != null && type != '') {
    //    if(type == 1) {
    //        window.AndroidWebView.setH5Share("888");
    //    }
    //    if(type == 2) {
    //        iOS.HtmlShare("888")
    //    }
    //} else {
        share.shareFixed(imgurl, title, desc, link, "888");
    //}
    shareButton.click(function() {
        if(type != undefined && type != null && type != '') {
            if(type == 1) {
                window.AndroidWebView.setH5Share("888");
            }
            if(type == 2) {
                iOS.HtmlShare("888")
            }
        } else {
            Common.newShareButton(Setting.staticRoot + '/pages/active/coin/vcoin.html');
        }
    })

    function vcionInit(count) {
        //$('.swiper1').addClass('swiperSlide');
        //var mySwiper = new Swiper('.swiper-container', {
        //    initialSlide:count,
        //    swipeHandler : '.swiperSlide',
        //    slidesPerView : 1,
        //    slidesPerGroup : 1,
        //    grabCursor : true,
        //    parallax : true,
        //    followFinger : false,
        //    paginationClickable :true,
        //    effect : 'fade',
        //    preventLinksPropagation : false,
        //    onTransitionEnd: function(swiper){
        //        count = swiper.activeIndex;
        //        $slide.removeClass().addClass('slide' + ((swiper.activeIndex) + 1));
        //        getVcionText(count);
        //    }
        //});
        for(var i = 0 ; i < 3; i++) {
            getVcionText(i) ;
        }
        //getVcionText(count)
    }

    //点击投资赚V币
    $('.button').click(function() {
        if(type != undefined && type != null && type != '') {
            if(type == 1) {
                window.AndroidWebView.setRegular();
            }
            if(type == 2) {
                iOS.HtmlJumpRegular();
            }
        } else {
            window.location.href = Setting.staticRoot + '/pages/financing/regular.html?uid=' + userId + '&loginToken=' + loginToken;
        }
    });

    function getVcionText(count) {
        var coun = parseInt(count + 1);
        $('.swiper-slide').html('');
        var text = '';
        switch (parseInt(count)) {
            case 0: {
                text = text + '<div class="content1">' +
                '<div class="act1">' +
                '<div class="act1area area1" id="act1area">' +
                '<a class="abutton1" href="javascript:;">立即刮奖</a>' +
                '</div>' +
                '</div>' +
                '<div class="act1Text">' +
                '<p>游戏规则：</p>' +
                '<p>1.消耗<a>3个V币</a>即可参与游戏；</p>' +
                '<p>2.点击“立即刮奖”，有机会获得以下奖品中的任意一个：2%天数加息券（1天）、38888元体验金（1天）、15元现金红包。</p>' +
                '</div>' +
                '</div>';
                break;
            }
            case 1: {
                text = '<div class="content1">' +
                '<div class="act2">' +
                '<div class="act2main">' +
                '<div class="act2demo">' +
                '<div class="act2wrap">' +
                '<div id="act2dice" class="act2dice dice_1"></div>' +
                '</div>' +
                '</div>' +
                '</div>' +
                '<a class="abutton2" href="javascript:;"></a>' +
                '</div>' +
                '<div class="act1Text">' +
                '<p>游戏规则：</p>' +
                '<p>1.消耗<a>5个V币</a>即可参与游戏；</p>' +
                '<p>2.点击“一掷千金”，选择大小后，系统掷骰子（1~3点为小，4~6点为大），猜中大小即有机会赢得25元现金红包，猜错则获5元现金红包。</p>' +
                '</div>' +
                '</div>';
                break;
            }

            case 2: {
                text = '<div class="content1">' +
                '<div class="act3">' +
                '<div class="draw" id="lottery">' +
                '<table>' +
                '<tr>' +
                '<td class="item lottery-unit lottery-unit-0"><div class="img"><img src="../../../images/pages/activity/coin/1@3x.png" alt=""></div></td>' +
                '<td class="item lottery-unit lottery-unit-1"><div class="img"><img src="../../../images/pages/activity/coin/2@3x.png" alt=""></div></td>' +
                '<td class="item lottery-unit lottery-unit-2"><div class="img"><img src="../../../images/pages/activity/coin/3@3x.png" alt=""></div></td>' +
                '</tr>' +
                '<tr>' +
                '<td class="item lottery-unit lottery-unit-7"><div class="img"><img src="../../../images/pages/activity/coin/4@3x.png" alt=""></div></td>' +
                '<td class="item lottery-unit"><a class="draw-btn" href="javascript:"><img src="../../../images/pages/activity/coin/5@3x.png" alt=""></a></td>' +
                '<td class="item lottery-unit lottery-unit-3"><div class="img"><img src="../../../images/pages/activity/coin/6@3x.png" alt=""></div></td>' +
                '</tr>' +
                '<tr>' +
                '<td class="item lottery-unit lottery-unit-6"><div class="img"><img src="../../../images/pages/activity/coin/7@3x.png" alt=""></div></td>' +
                '<td class="item lottery-unit lottery-unit-5"><div class="img"><img src="../../../images/pages/activity/coin/8@3x.png" alt=""></div></td>' +
                '<td class="item lottery-unit lottery-unit-4"><div class="img"><img src="../../../images/pages/activity/coin/9@3x.png" alt=""></div></td>' +
                '</tr>' +
                '</table>' +
                '</div>' +
                '</div>' +
                '<div class="act1Text">' +
                '<p>游戏规则：</p>' +
                '<p>1.消耗<a>10个V币</a>即可参与游戏；</p>' +
                '<p>2.点击“立即抽奖”，即有机会赢得上图九宫格中任意奖品。</p>' +
                '</div>' +
                '</div>';
                break;
            }
        }

        $('.swiper' + coun).html(text);
        //活动2
        var $abutton2 = $('.abutton2');
        $('.abutton2, #act2dice').click(function(){
            if(userId == undefined || userId == null || undefined == '') {
                if(type != undefined && type != null && type != '') {
                    if(type == 1) {
                        window.AndroidWebView.setLogin();
                    }
                    if(type == 2) {
                        iOS.HtmlJumpLogin();
                    }
                } else {
                    Common.toLogin();
                }

                return false;
            }
            if($abutton2.hasClass('disabled')) {
                return false;
            }
            $abutton2.addClass('disabled');
            if(parseInt(_vcoin.number) < 5) {
                vcion.vcoinAlert('可用V币数量不足，您可以','投资赚V币');
                $('.abutton2').removeClass('disabled');
                $('.aclose1').click(function() {
                    if(type != undefined && type != null && type != '') {
                        if(type == 1) {
                            window.AndroidWebView.setRegular();
                        }
                        if(type == 2) {
                            iOS.HtmlJumpRegular();
                        }
                    } else {
                        window.location.href = Setting.staticRoot + '/pages/financing/regular.html?uid=' + userId + '&loginToken=' + loginToken;
                    }
                    $('.wrapper').removeClass('_scro');
                    $('.ui-vcoin').html('');
                });
                return false;
            } else {
                vcion.vcoinTwoChange();
            }

        });
        //点击立即刮奖按钮
        $('.abutton1').click(function() {
            var $abutton1 = $('.abutton1');
            if($abutton1.hasClass('disabled')) {
                return false;
            }
            $abutton1.addClass('disabled');
            if(userId == undefined || userId == null || undefined == '') {
                if(type != undefined && type != null && type != '') {
                    if(type == 1) {
                        window.AndroidWebView.setLogin();
                    }
                    if(type == 2) {
                        iOS.HtmlJumpLogin();
                    }
                } else {
                    Common.toLogin();
                }
                return false;
            } else {
                if(parseInt(_vcoin.number) < 3) {
                    vcion.vcoinAlert('可用V币数量不足，您可以','投资赚V币');
                    $abutton1.removeClass('disabled');
                    $('.aclose1').click(function() {
                        if(type != undefined && type != null && type != '') {
                            if(type == 1) {
                                window.AndroidWebView.setRegular();
                            }
                            if(type == 2) {
                                iOS.HtmlJumpRegular();
                            }
                        } else {
                            window.location.href = Setting.staticRoot + '/pages/financing/regular.html?uid=' + userId + '&loginToken=' + loginToken;
                        }
                        $('.wrapper').removeClass('_scro');
                        $('.ui-vcoin').html('');
                    });
                    return false;
                } else {
                    $.ajax({
                        url:Setting.apiRoot1 + '/u/vcoinbiglotto/scratcherTicket.p2p',
                        dataType:'json',
                        type:'post',
                        data:{
                            userId:userId,
                            loginToken:loginToken
                        }
                    }).done(function(res) {
                        if(parseInt(res.code) > 0) {
                            getCount(1,res);
                        } else {
                            alert(res.message);
                            $abutton1.removeClass('disabled');
                            return false;
                        }
                    }).fail(function() {
                        alert('网络连接失败！');
                        $abutton1.removeClass('disabled');
                        return false;
                    })
                }

            }
            //mui('.mui-slider').slider().setStopped(true);
        });
        //活动3
       $('.draw-btn').click(function() {
           if(userId == undefined || userId == null || undefined == '') {
               if(type != undefined && type != null && type != '') {
                   if(type == 1) {
                       window.AndroidWebView.setLogin();
                   }
                   if(type == 2) {
                       iOS.HtmlJumpLogin();
                   }
               } else {
                   Common.toLogin();
               }
               return false;
           }
           if($(this).hasClass('disabled')) {
               return false;
           }
           $(this).addClass('disabled');
           if(parseInt(_vcoin.number) < 10) {
               vcion.vcoinAlert('可用V币数量不足，您可以','投资赚V币');
               $('.draw-btn').removeClass('disabled');
               $('.aclose1').click(function() {
                   if(type != undefined && type != null && type != '') {
                       if(type == 1) {
                           window.AndroidWebView.setRegular();
                       }
                       if(type == 2) {
                           iOS.HtmlJumpRegular();
                       }
                   } else {
                       window.location.href = Setting.staticRoot + '/pages/financing/regular.html?uid=' + userId + '&loginToken=' + loginToken;
                   }
                   $('.wrapper').removeClass('_scro');
                   $('.ui-vcoin').html('');
               });
               return false;
           }

           $.ajax({
               url:Setting.apiRoot1 + '/u/vcoinbiglotto/speedDial.p2p',
               dataType:'json',
               type:'post',
               data:{
                   userId:userId,
                   loginToken:loginToken
               }
           }).done(function(res) {
                if(parseInt(res.code) > 0) {
                    getCount();
                    vcion.vcionThreeFun(res);
                } else {
                    alert(res.message);
                    $('.draw-btn').removeClass('disabled');
                    return false;
                }
           }).fail(function() {
               alert('网络连接失败！');
               $('.draw-btn').removeClass('disabled');
               return false;
           })
       })
    }

    mui('.mui-content').on('tap','.mui-control-item',function() {
        mui('.mui-slider').slider().setStopped(false);
    })
});

