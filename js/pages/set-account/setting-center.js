/**
 * 用户设置中心
 * zyx
**/
$(function(){
    $('form').attr({'action':Setting.root + '/pic/upload.do'});
    var $win = $(window);
    var $body = $('body');
    var uid = sessionStorage.getItem("uid");
    var nickName = sessionStorage.getItem("nickName");
    var avatar = sessionStorage.getItem("avatar");
    var code = sessionStorage.getItem('ucode');//自己的推荐码
    var relation = sessionStorage.getItem('relation');//1是绑定  0是没有绑定
    var realname =sessionStorage.getItem('realname');
    var phone=sessionStorage.getItem('uname');
    var $uinfo = $('.uinfo');
    var _hide_number,phoneNum;
    if(realname != undefined && realname != null && realname != '' && realname != 'undefined') {
        if(phone != undefined && phone != null && phone != '') {
            _hide_number = phone.substr(3,4);
            phoneNum = phone.replace(_hide_number,'****');//手机
            $uinfo.html('<div class="uname">' + realname + '</div><div class="uname">' + phoneNum + '</div>');
        }
    } else {
        if(phone != undefined && phone != null && phone != '') {
            _hide_number = phone.substr(3,4);
            phoneNum = phone.replace(_hide_number,'****');//手机
            $uinfo.html('<div class="uphone">' + phoneNum + '</div>');
        }
    }



    var param = Common.getParam();//解析地址栏中的信息
    var rankVip=param.rankVip;
    if (rankVip==0) {
        $('.vip').html('普通会员');
    }else{
        $('.vip').html('V'+rankVip+'会员');
    }
    var inviteNumber=param.inviteNumber;
    var couponCount=param.couponCount;
    $('.inviteNumber').html(inviteNumber);
    $('.couponCount').html(couponCount);
    $inviteCode = $('.inviteCode');
    $inviteCode.html(code);
    $bindInvitation = $('.bindInvitation');
    if(relation=='1'){
        $bindInvitation.html('已绑定');

    }else{
	  $bindInvitation.html('未绑定');
    }
    $body.on('click', '.bindInvitation_url', function(event) {
        if(relation=='1'){
            $.ajax({
	            url: Setting.apiRoot1 + '/u/getMasterByUserId.p2p',
	            type: 'post',
	            dataType: 'json',
	            data: {
	        	    userId : uid,
	                loginToken:sessionStorage.getItem('loginToken')
	            }
	        }).done(function(res) {
                if(res.code==1){
                    var param = {
                        phone:res.data.phoneNum,
                        name:res.data.userName,
                        code:res.data.code
                    };
                    window.location.href=Setting.staticRoot+'/pages/my-account/setting/binding-success.html?'+ $.param(param);
                }else{
                    Common2.toast(res.message);
                }
            }).fail(function() {
                Common2.toast('网络链接失败');
                $this.removeClass('disabled').html('确认');
            })

        }else{
            window.location.href = Setting.staticRoot+'/pages/my-account/setting/binding-invitation.html';
        }
    });
  

    var _data = {
        type : 2,  //1:查看是否进行过实名认证 2:查看是否设置过交易密码
        userId : uid,
        loginToken:sessionStorage.getItem('loginToken')
    }
    var _data2 = {
        type : 1,
        userId : uid,
        loginToken:sessionStorage.getItem('loginToken')
    }

    if(!uid){
        Common.toLogin();
        return false;
    }
    $.ajax({
        url: Setting.root + '/u/query.do',
        type:"GET",
        dataType:'json',
        data: {
            userId:uid
        }
    }).done(function(res){
        if(res.code == 1) {
            //var nickName = res.data.nickName;
            var avatar = res.data.avatar;
            if(avatar == null || avatar =='' || avatar == undefined) {
                avatar = '../../../images/pages/message/tou@3x.png';
            }
            $(".userImg").attr("src",avatar);
            //$('.userName').html(nickName);
        } else {
            Common2.toast(res.message)
        }
    }).fail(function() {
        Common2.toast('连接失败！')
    });

    $body.on('click', '.change-dealpassword', function(event) {
    //查看是否设置过交易密码
        $.ajax({
            url: Setting.apiRoot1 +'/u/checkUserInfo.p2p',
            type: 'post',
            dataType: 'json',
            data: _data
        }).done(function(data) {
            Common.ajaxDataFilter(data.code,function(){
                switch(data.code){
                    case 1:
                        window.location.href=Setting.staticRoot+'/pages/my-account/setting/trade-password.html';
                        break;
                    case -3:
                        window.location.href=Setting.staticRoot+'/pages/my-account/setting/trade-password.html';
                        break;
                    default:
                       Common2.toast(data.message);
                        break;
                }
            })
        }).fail(function() {
            Common2.toast('网络链接失败')
        })
    });
  /**
   * [url 实名认证]
   * @type {[type]}
   */
    var $realNmae = $('.real-name');
    var _msg;
    var _code;
    $.ajax({
        url: Setting.apiRoot1 +'/u/checkUserInfo.p2p',
        type: 'post',
        dataType: 'json',
        data: _data2
    }).done(function(data) {
        Common.ajaxDataFilter(data.code,function(){
            switch(data.code){
                case -2:
                    $realNmae.click(function(event) {
                        window.location.href = Setting.staticRoot+'/pages/my-account/setting/real-name.html'
                    });
                    break;
                case 1:
                    _code = data.code;
                    $('span',$realNmae).text('已认证');
                    break;
                default:
                    _msg = data.message;
                    break;
            }
        })
    }).fail(function() {
        Common2.toast('网络链接失败');
    });

    $body.on('click', '.real-name', function(event) {
        !!_msg && Common2.toast(_msg);
        _code == 1 && Common2.toast('已认证');
        return false;
    });

    $body.on('click', '.Sign_out', function(event) {
        sessionStorage.clear() ;
        window.location.href=Setting.staticRoot +'/pages/my-account/myAccount.html';
    });

    $('.left').on('click',function(event) {
        window.location.href=Setting.staticRoot +'/pages/my-account/myPrivilege.html';
    });
    $('.right').on('click',function(event) {
        window.location.href=Setting.staticRoot +'/pages/my-account/myinvite/myinvite-index.html';
    });

    $('.vip').on('click',function(event) {
        window.location.href=Setting.staticRoot +'/pages/my-account/myPrivilege.html';
    });


    //该用户是否做过风险评估
    $.ajax({
        url: Setting.apiRoot1 +'/u/userHasRisk.p2p',
        type: 'post',
        dataType: 'json',
        data: {
            userId : uid,
            loginToken:sessionStorage.getItem('loginToken')
        }
    }).done(function(res) {
        if(res.code == 0) {
            $('.setting-risk').html('尚未评测');
        } else {
           if(res.code == 1) {
               var riskType = res.data.riskType;
               if(riskType != undefined && riskType != null && riskType != '') {
                   $('#setting-risk').html(riskType);
               }
           } else {
               Common2.toast(res.message);
           }
        }
    }).fail(function() {
        Common2.toast('网络连接失败!');
        return false;
    });

    $('form').submit(function() {
        return saveReport();
    });

    $("#inputImg").change(function(e) {
        $('form').submit();
    });
});

function saveReport() {
    $("#imageForm").ajaxSubmit(function(res) {
        if(res.code == 1 && res.url != "" && res.url != "undefined"){
            var imgUrl = res.url;
            $.ajax({
                type:"GET",
                url:Setting.root + "/u/update.do",
                data:{
                    userId:sessionStorage.getItem("uid"),
                    avatar:imgUrl
                }
            }).done(function(res){
                sessionStorage.setItem('avatar',imgUrl);
                $(".userImg").attr("src",imgUrl);
                window.location.reload();
            })
        }else{
            Common2.toast(res.message)
        }
    });
    return false;
}
