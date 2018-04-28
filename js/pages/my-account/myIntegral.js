$(function(){
    var param = Common.getParam();
    var type = param.type;
    var userId,loginToken;
    // ios调用h5页面
    if(type == 2){
        userId = param.uid;
        loginToken = param.loginToken;
    }else{
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
	var list = doT.template([
         // href="javascript:window.location.href='+Setting.staticRoot +'/pages/shoppingMall/commodityExchange/gift.html?loanId='+'{{=item.loanId}}'+window.location.search.replace('?','&')+';"
		'{{~it:item:index}}',
        '{{?item.integralType == 4}}',
            ' <a class="list" href="'+Setting.staticRoot+'/pages/shoppingMall/commodityExchange/gift.html?orderId={{=item.loanId}}'+window.location.search.replace('?','&')+'">',
            '<img src="../../images/pages/my-account3.0/exclusive/moreright.png"/>',
        '{{??}}',
		  ' <a class="list" href="javascript:;">',
        '{{?}}',
           '<div class="clearfix">',
               '<div class="list-title float-left">{{=item.title}}','</div>',
               '<div class="list-money float-right">+{{=item.integral}}','</div>',
           '</div>',
           
           '<div class="list-time">{{=item.createTime}}','</div>',
       '</a>',
       '{{~}}'
	].join(''));
	function noData($c) {
        $c.html('<div class="null"><img class="nullImg" src="../../images/pages/my-account3.0/null.png"><p>当前没有持有计划</p></div>')
    }

    function dueHascontent() {
		var pageNum = 1;
        var $listM3 = $('.scroll');
        $listM3.dropload({
            scrollArea:$listM3,
            loadDownFn:function(me) {
                Common2.toast('请求中',Setting.staticRoot+'/images/pages/ui/loading.png',false);
                $.post(Setting.apiRoot1 + '/u/getIntegralList.p2p',
                    {'userId':userId, 'loginToken':loginToken, 'pageNum':pageNum},
                    function(res) {
                        Common.ajaxDataFilter(res,function(res) {
                            if(res.code == 1) {
                                $('#toastMessage').remove();
                            	$('.serverBox').text(res.data.totalIntegral)
                                if(res.data.integralList.length > 0) {
                                    $('.content').append(list(res.data.integralList));
                                    pageNum++;
                                    me.resetload();

                                } else {
                                   if(pageNum == 1) {
                                       // noData($('.dueHascontent'));
                                   }
                                    // 锁定
                                    me.lock();
                                    // 无数据
                                    me.noData(true);
                                    return false;
                                }
                            } else {
                                $('#toastMessage').remove();
                                // noData($('.dueHascontent'));
                                // 锁定
                                me.lock();
                                // 无数据
                                me.noData(true);
                                return false;
                            }
                        })
                    },'json'
                );
            }
        });
        $('.dropload-down').remove();
    }

    dueHascontent();

	$('.btn').click(function(){
		$('.backdrop').addClass('hide')
	})
	$('.dueOngoing').click(function(){
		$('.backdrop').removeClass('hide')
	})
	$('.dueNot').click(function(){
        if(type == 2){
            // ios APP跳转到理财列表页固收
            iOS.HtmlJumpRegular();
        }else{
            window.location.href = '../../pages/financing/regular.html'
        }
		
	});
    $('.question-close').click(function(){
        $('.questionPage').addClass('hide');
    });
    $('.integral').click(function(){
        $('.questionPage').removeClass('hide');
    });
});
var overscroll = function(el){
    el.addEventListener('touchstart',function(){
        var top = el.scrollTop;
        var totalScroll = el.scrollHeight;
        var currentScroll = top + el.offsetHeight;
        if(top === 0){
            el.scrollTop = 1;
        }else if(currentScroll === totalScroll){
            el.scrollTop = top - 1;
        }
    });
    el.addEventListener('touchmove',function(evt){
        if(el.offsetHeight < el.scrollHeight){
            evt._isScroller = true
        }
    });
}
overscroll(document.querySelector('.scroll'));
document.body.addEventListener('touchmove',function(evt){
    if(!evt._isScroller){
        evt.preventDefault();
    }
})