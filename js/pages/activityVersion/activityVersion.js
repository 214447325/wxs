/**
 * Created by User on 2016/10/20.
 */
$(function() {
    var $returnPage = $('.returnPage');//返回上一页按钮
    var param = Common.getParam();
    //var displayNav = sessionStorage.getItem('displayNav');//0是APP端;
    var version=param.version;
        if(version == null || version == undefined || version == '') {
                $('.messageTitle').show();
        } else {
                $('.messageTitle').hide();
        }
    // if(!(/MicroMessenger/i.test(navigator.userAgent))){
    //     if(version == null || version == undefined || version == '') {
    //         version = sessionStorage.getItem('version');
    //         if(version >= 3.1) {
    //             $('.messageTitle').hide();
    //         } else {
    //             $('.messageTitle').show();
    //         }
    //     } else {
    //         sessionStorage.setItem('version',version);
    //         if(version >= 3.1) {
    //             $('.messageTitle').hide();
    //         } else {
    //             $('.messageTitle').show();
    //         }
    //     }
    // }

    //if (displayNav==0) {
    //    if(version == null || version == undefined || version == '') {
    //        version= sessionStorage.getItem('version');
    //        if(version >= 3.1) {
    //            $('.messageTitle').hide();
    //        } else {
    //            $('.messageTitle').show();
    //        }
    //    } else {
    //        version= sessionStorage.setItem('version',version);
    //        if(version >= 3.1) {
    //            $('.messageTitle').hide();
    //        } else {
    //            $('.messageTitle').show();
    //        }
    //    }
    //}

    //if (version==null || version ==undefined || version=='') {
    //    version= sessionStorage.getItem('version');//APP端版本号,微信端无此标识;version3.1及3.1以上不显示页面顶部title
    //    if (version>=3.1) {
    //        $('.messageTitle').hide();
    //    }
    //} else {
    //    if (version>=3.1) {
    //        $('.messageTitle').hide();
    //        sessionStorage.setItem('version',version);
    //    }
    //}

    $returnPage.click(function() {
        window.location.href = '../../pages/message/messages.html?act=1';
    });
    // 等级说明button
    var $vipButton= $('.vipButton');
    $vipButton.on('click',function(){
        var barListContent = $(this).next();
        var vipbtnImg = $(this).find('span').eq(1);
        var flag = barListContent.css('opacity') ? barListContent.css('opacity') : barListContent.css('filter');
        if(flag == 1){
            barListContent.css({
                'opacity':0,
                'filter':'Alpha(opacity=0)'
            })
            vipbtnImg.removeClass('vipbtn-img-show');
            vipbtnImg.addClass('vipbtn-img-hide');
        }else{
             barListContent.css({
                'opacity':1,
                'filter':'Alpha(opacity=100)'
            })
            vipbtnImg.removeClass('vipbtn-img-hide');
            vipbtnImg.addClass('vipbtn-img-show');
        }
    })
});