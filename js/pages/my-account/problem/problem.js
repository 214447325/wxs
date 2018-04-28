/**
 * Created by User on 2018/1/17.
 */
$(function() {
    //$.cookie('parrays','')
    var param = Common.getParam();
    var userId = sessionStorage.getItem('uid')||param.uid;
    var loginToken = sessionStorage.getItem('loginToken')||param.loginToken;
    var type = param.type;
    if(userId == undefined || userId == null || userId == '') {
        Common.toLogin();
        return false;
    }

    var _arr = [];
    $.ajax({
        url: Setting.apiRoot1 + '/riskTitleList.p2p',
        type:'post',
        dataType:'json'
    }).done(function(res) {
        if(res.code == 1) {
            var data = res.data;
            var count = 0;
            var _arrsJSON = [];
            var _json = $.cookie('parrays');//获取答过的题
            //判断有没有答过题如果没有则重新开始，如果之前答过的话接着后面继续
            if(_json != undefined && _json != null && _json != '' && _json.length > 0) {
                _arrsJSON = JSON.parse(_json);
                count = (_arrsJSON.length);
                if(count >= 10) {
                    count = 10;
                }
                if(count == 10 ) {
                    var $psubmit = $('.psubmit');
                    $psubmit.show();
                    $psubmit.click(function() {
                        clickSub(_arr);
                    })
                }
                setProblem(data,count);
            } else {
                setProblem(data,count);
            }

        } else {
            Common2.toast(res.message);
        }
    }).fail(function() {
        Common2.toast('网络连接失败！');
        return false;
    });

    function setProblem(data,count) {
        if(count > 10) {
            return false;
        }
        var answerList = data[count].answerList;
        var _li = '';
        for(var i = 0; i < answerList.length; i++) {
            _li = _li + '<li class="pselet" questionId="' + data[count].questionId + '">';
            _li = _li + '<span>' + answerList[i].answer + '</span>';
            _li = _li + '<a class="pselected" href="javascript:;" score="' + answerList[i].score + '" answerId="' + answerList[i].answerId + '"></a>';
            _li = _li + '</li>';
        }
        var _html = '';
        _html = _html + '<ul>';
        _html = _html + '<li questionId="' + data[count].questionId + '">' + data[count].title + '</li>';
        _html = _html + _li;
        _html = _html + '</ul>';
        $('.p-box').html(_html);
        var _puptxt = '';
        if(count > 0) {
            _puptxt = '<a class="pup" href="javascript:;">上一题</a>';
        }
        $('.pcount').html(_puptxt + '<span>' + (count + 1) + '/11</span>');

        var _json = $.cookie('parrays');//获取答过的题
        //判断有没有答过题如果没有则重新开始，如果之前答过的话接着后面继续
        if(_json == undefined || _json == null || _json == '' || _json.length == 0) {
            _arr = [];
        } else {
            _arr = JSON.parse(_json);
            if(_arr[count] != undefined && _arr[count] != null && _arr[count] != '') {
                var _s = _arr[count].score;
                $('a[score=' + _s + ']').addClass('selected');
            }
        }


        $('.pselet').click(function() {
            var $pselected = $(this).find('.pselected');
            var $$pselected = $('.pselected');
            if($$pselected.hasClass('selected')) {
                $$pselected.removeClass('selected');
            }
            $pselected.addClass('selected');

            var questionid = $(this).attr('questionid');//获取该命题的ID
            var answerid = $(this).find('.selected').attr('answerid');//获取选中的答案的ID
            var score = $(this).find('.selected').attr('score');//获取选中命题的分数

            var map = {};

            map.questionid = questionid;
            map.answerid = answerid;
            map.score = score;

            if(_arr.length > 0) {
                if((_arr[count] != undefined &&  _arr[count] != null && _arr[count] != '') && _arr[count].questionid == questionid) {
                    _arr[count] = map;
                } else {
                    _arr.push(map);
                }
            } else {
                _arr.push(map);
            }
            $.cookie('parrays',JSON.stringify(_arr),{expires: 365});
            if(count >= 10) {
                return false
            } else {
                count = count + 1;
                setTimeout(function() {
                    if(count == 10 ) {
                        var $psubmit = $('.psubmit');
                        $psubmit.show();
                        $psubmit.click(function() {
                            clickSub(_arr);
                        })
                    }
                    setProblem(data,count);
                },1000);
            }
        });

        $('.pup').click(function() {
            count = count - 1;
            setProblem(data,count);
        })
    }

    function clickSub(_arr) {
        if(userId == undefined || userId == null || userId == '') {
            Common.toLogin();
            return false;
        }
        var $psubmit = $('.psubmit');
        if($psubmit.hasClass('disabled')) {
            return false;
        }
        $psubmit.addClass('disabled');
        var _l = _arr.length;
        if(_l < 11) {
            Common2.toast('请先答完题在提交');
            $psubmit.removeClass('disabled');
            return false;
        }
        var s = 0;
        for(var i = 0; i < _l; i++) {
            s = s + parseInt(_arr[i].score);
        }
        if(s < 30) {
            s = 0
        }
        if(s >= 120) {
            s = 110
        }
        $.ajax({
            url:Setting.apiRoot1 + '/u/userRiskScore.p2p',
            type:'post',
            dataType:'json',
            data:{
                userId:userId,
                loginToken:loginToken,
                totalScore:s
            }
        }).done(function(res) {
            if(res.code == 1) {
                var _data = res.data;
                setAlertHtml(_data);
                $psubmit.removeClass('disabled');
            } else {
                Common2.toast(res.message);
                $psubmit.removeClass('disabled');
            }
        }).fail(function() {
            Common2.toast('网络连接失败！');
            $psubmit.removeClass('disabled');
            return false;
        })
    }

    function setAlertHtml(data) {
        var _html = '';
        _html = _html + '' +
        '<div class="pa-box">' +
            '<div></div>' +
            '<div class="pacontent">' +
                '<div>' +
                    '<div>本次评估结果<span>' + data.riskType + '</span></div>' +
                    '<div>本人保证以上所填全部信息为本人真实的意思表示，并接受贵行评估意见，点击确认视为签名确认</div>' +
                '</div>' +
                '<div>' +
                    '<a class="preload" href="javascript:;">重新评测</a>' +
                    '<a class="pconfirm" href="javascript:;">确认</a>' +
                '</div>' +
            '</div>' +
        '</div>';

        $('body').append(_html);
        var _wheight = $(window).height();
        var $pacontent = $('.pacontent');
        var _pac = $pacontent.height();
        $pacontent.css({'top':((_wheight - _pac) / 2) + 'px'});

        //点击重新评测
        $('.preload').click(function() {
            var type = param.type;
            $.cookie('parrays','');
            if(type != undefined && type != null && type != '') {
                if(type == 1) {
                    window.AndroidWebView.setresh();
                }

                if(type == 2) {
                    iOS.HtmlReloadVC();
                }
            } else {
                window.location.reload();
            }
        });

        //prolemsuccess

        $('.pconfirm').click(function() {
            if(type != undefined && type != null && type != '') {
                if(type == 1) {
                    window.AndroidWebView.setLoadNewUrl(Setting.staticRoot + '/pages/my-account/setting/problem/prolemsuccess.html?riskType=' + data.riskType + '&riskLevel=' + data.riskLevel + '&score=' + data.score,'风险评估');
                }
                if(type == 2) {
                    iOS.htmlTest(Setting.staticRoot + '/pages/my-account/setting/problem/prolemsuccess.html?riskType=' + data.riskType + '&riskLevel=' + data.riskLevel + '&score=' + data.score);
                }
            } else {
                window.location.href = Setting.staticRoot + '/pages/my-account/setting/problem/prolemsuccess.html?riskType=' + data.riskType + '&riskLevel=' + data.riskLevel + '&score=' + data.score + '&uid=' + userId + '&loginToken=' + loginToken;
            }
        })
    }

});