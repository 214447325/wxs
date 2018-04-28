/*
 * @Author: User
 * @Date:   2016-08-31 17:18:19
 * @Last Modified by:   User
 * @Last Modified time: 2017-01-13 14:19:26
 */

$(function(){
    var isWeiXin = Common.isWeiXin();//微信进来的访问判断，不是跳转到官网下载页
    var param = Common.getParam();//param取url参数
    var userId = sessionStorage.getItem('uid');//session取uid
    var loginToken = sessionStorage.getItem('loginToken');//session取uid
    var $incomeAll = $('.incomeAll');
    var $csnubox = $('.csnubox');
    var _wheight = $(window).height();
    var $mouth = $('.mouth');
    var _mheight = $mouth.height();
    $incomeAll.height((_wheight - _mheight) + 'px');
    $csnubox.height((_wheight - _mheight) + 'px');
    var date = new Date();
    var _date = date.getFullYear() + '年' + (date.getMonth() + 1) + '月';
    $mouth.html(_date);

    if(!userId){
        Common.toLogin();
        return false;
    }

    var $canfloat = $('.canfloat');
    var $cantable = $('#cantable');
    var $atxt = $('.atxt');
    $('.screening').click(function() {
        var _canHeight = $cantable.height();
        $cantable.animate({
            'bottom':_canHeight + 'px'
        },'slow');
        $canfloat.show();
    });

    $atxt.click(function() {
        $atxt.removeClass('atext');
        $(this).addClass('atext');
        var scroll = $('.atext').attr('scroll');
        $incomeAll.height((_wheight - _mheight) + 'px');
        $csnubox.html('<div class="incomeAll ' + scroll + '"></div>');
        $canfloat.hide();
        detail(1);
    });

    $('.canclose').click(function() {
        $canfloat.hide();
    });

    //detail($('.call'));
    // (30-全部 10-入账 11-充值 12-回款 13-收益 14-奖励 20-出账 21-提现 22-加入计划 40-其它)
    detail(1);
    function detail(page) {
        var $atext = $('.atext');
        var type = $atext.attr('type');
        var scroll = $atext.attr('scroll');
        var $scroll = $('.' + scroll);
        $scroll.dropload({
            scrollArea : $scroll,
            loadDownFn : function(me) {
                Common2.toast('请求中',Setting.staticRoot+'/images/pages/ui/loading.png',false);
                $.ajax({
                    url:Setting.apiRoot1 + '/u/getAccountDetail.p2p',
                    type:'post',
                    dataType:'json',
                    data:{
                        userId : userId,
                        type: type,
                        pageNum: page,
                        loginToken:loginToken
                    }
                }).done(function(res) {
                    $('#toastMessage').remove();
                    Common.ajaxDataFilter(res,function() {
                        if(res.code == 1) {
                            var dataList = res.data.dataList;
                            if(dataList.length > 0) {
                                text(dataList,$scroll,page);
                                page++;
                                me.resetload();
                            } else {
                                if(page == 1) {
                                    $('.incomeAll').html(' <div class="cunnodata"><div class="cunnodata-img"></div><div class="cunnodata-txt">暂无数据</div></div>');
                                    var $cunnodata = $('.cunnodata');
                                    var _dataHeight = $cunnodata.height();
                                    var _allHeight = $incomeAll.height();
                                    $cunnodata.css({'marginTop':((_allHeight - _dataHeight) / 2) + 'px'})
                                }
                                me.lock();
                                me.noData(true);
                                return false;
                            }
                        } else {
                            Common2.toast(res.message);
                            me.lock();
                            me.noData(true);
                            return false;
                        }
                    });
                }).fail(function() {
                    $('#toastMessage').remove();
                    Common2.toast('网络连接失败！');
                    return false;
                })
            }
        })
    }

    //交易类型(不填默认30)

    function text(data,$html,page) {
        var _html = '';
        for(var i = 0; i < data.length; i++) {
            if(data[i].remark.indexOf('活期') > -1){
                data[i].remark = data[i].remark.replace('活期','周周涨');
            }
            _html = _html + '<div class="item">' +
            '<div class="left">' +
            '<span>' + data[i].remark + '</span>' +
            '<span>' + data[i].time +'</span>' +
            '</div>' +
            '<div class="right">' +
            '<span>' + data[i].operation +(data[i].amount).toFixed(2) + '</span>' +
            '<span>' + parseFloat(data[i].accountAmount).toFixed(2) + '</span>' +
            '</div>' +
            '</div>';
        }
        if(page == 1) {
            $html.html(_html);
        } else {
            $html.append(_html);
        }
    }
});