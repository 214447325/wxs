/**
 * Created by User on 2016/9/6.
 */
/**
 * zyx
 * 赎回
 **/
$(function(){

    var $redemption  = $('.redemption');
    var $curHadShare = $('.curHadShare',$redemption);//持有份额
    var $curLockShare = $('.curLockShare',$redemption);//持有份额

    var $next        = $('.next',$redemption);//下一步
    var $input       = $('input',$redemption);
    var $ui_dialog   = $('.ui-dialog');
    var $tips        = $('.tips span');
    var curHadShare  = 0;//持有份额
    var curLockShare = 0;

    var uid = sessionStorage.getItem("uid");
    var dayRate = 0;
    var data;
    var data;
    var redeemAmount = 0;//当日可赎回金额

    if (!uid) {
        Common.toLogin();
        return false;
    }

    function init(){
        $.ajax({
            url: Setting.apiRoot1 + '/u/redeemCal.p2p',
            type: 'post',
            dataType:'json',
            data: {
                userId: uid,
                loginToken:sessionStorage.getItem('loginToken')
            }
        }).done(function(res){
            Common.ajaxDataFilter(res,function(){
                if(res.code != 1){
                    alert(res.message);
                    return false;
                }

                data = res.data;
                if(data.redeemAmount == undefined || data.redeemAmount == null || data.redeemAmount == '' || data.redeemAmount == 0){
                    data.redeemAmount = '0.00';
                }
                redeemAmount = data.redeemAmount 
                // $('.pr20').html("当日可赎回额度"+data.redeemAmount+"元");
                dayRate = data.dayRate;
                render();
            });
        }).fail(function(){
            alert('网络链接失败');
        });
    }

    function render(){
        //$tips.text(data.dayRate);
        $curHadShare.text(data.curUserfulShare);
        curHadShare = data.curUserfulShare;
        if(data.curLockShare == 0) {
            $('.lockShare').hide();
        } else {
            // $('.lockShare').show();
            $curLockShare.text(data.curLockShare);
        }

        curLockShare = data.curLockShare;

    }

    init();

    $next.on('click',function(){
        var $this = $(this);
        var count = $('.txt',$redemption).val();//赎回份额
        if(!count){
            alert('请填写赎回份额');
            return false;
        }
        if(curHadShare == 0){
            alert('未持有周周涨份额');
            return false;
        }
        if(count == 0 ){
            alert('赎回金额须大于零');
            return false;
        }
        if(count > curHadShare){
            alert('输入赎回金额大于周周涨持有份额');
            return false;
        }
        // if(count > redeemAmount){
        //     alert('赎回金额不能大于当日可赎回额度');
        //     return false;
        // }

        $this.attr('disabled',true);
        var data1 = {};
        data1.userId=uid;
        data1.redeemAmt=count;
        data1.loginToken=sessionStorage.getItem('loginToken');
        $.ajax({
            url: Setting.apiRoot1 + '/u/redeem.p2p',
            type: 'post',
            dataType:'json',
            data:data1
        }).done(function(res){
            if(res.code==1){
                alert('恭喜赎回成功！');
                window.location.href = Setting.staticRoot + '/pages/my-account/myAccount.html';
            }else{
                alert(res.message);
                return false;
            }
        }).fail(function(){
            alert('网络链接失败');
        });

    });

    $ui_dialog.on('click','.close,.btn-link',function(event) {
        $(this).closest('.ui-dialog').addClass('hide');
    });

    $input.on('input change',function(e){
        var $this = $(this);
        var money = $.trim($this.val());
        money = parseFloat(money);

        if(isNaN(money)){
            $this.val('');
            return false;
        }

        if(e.type == 'change'){
            $this.val(parseFloat($this.val()).toFixed(2));
        }

        $tips.text((dayRate * 7 * $this.val()).toFixed(2));
    });
});
