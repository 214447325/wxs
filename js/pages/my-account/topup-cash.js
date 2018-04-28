/*
* @Author: User
* @Date:   2016-07-26 14:47:49
* @Last Modified by:   User
* @Last Modified time: 2016-09-19 14:47:05
*/

$(function(){
  var param = Common.getParam();//获取URL参数
  var success = param.success;
  var uid = sessionStorage.getItem("uid");
  var phone_number=sessionStorage.getItem('uname');
  var $topUp = $('.topup-cash');
  var $bankcard = $('input[name=bankcard]');
  // var $bankcardtwo = $('input[name=bankcardtwo]');//银行卡号
  var $limitday =$('.limitday',$topUp);//宝付单日
  var $limitonce =$('.limitonce',$topUp);//宝付单笔
  var $limitdayfy =$('.limitday-fy',$topUp);//富友单日
  var $limitoncefy =$('.limitonce-fy',$topUp);//富友单笔
  var $money = $('input[name=money]');//金额input
  var $submit = $('input[name=submit]');
  var $cancel = $('input[name=cancel]');
  var $submit2 = $('input[name=submit2]');
  var $cancel2 = $('input[name=cancel2]');
  var $check_code = $('input[name=check_code]');
  var $sendSmsAgain = $('input[name=sendSmsAgain]');
  var $topupChannels = $('.topupChannels');
  // var $ulCard = $('.ul-card>li');//有银行卡
  var $ulCard = $('.ul-card');//有银行卡
  var $addCard = $('.addCard');
  var $somebanks = $('.somebanks');
  var $ui_dialog = $('.ui-dialog');
  var $btn_link  = $('.btn-link',$ui_dialog);
  var $btn_default = $('.btn-default',$ui_dialog);
  var formData = {};
  var formAgreeData = {};
  var confirmData = {};
  var bestPayChannel;//最佳渠道
  var bankName;//银行名字
  var bankImgURL;//银行logo
  var cardNum;//银行卡号
  var limitOnce;//单笔
  var limitDay;//单日
  var payChannel;//充值渠道
  var rechargeMin;//起充
  var hashMap = {};//0803

    //充值成功
    //if(success == 1) {
    //    $('.topup_alert').show();
    //}
    //
    //close
    $('.topup_close>img').click(function(){
       $('.topup_alert').hide();
    })

    if(success != undefined && success != null && success != '') {
        var buyForm = sessionStorage.getItem('buyForm');
        if((success.indexOf('1') != -1) && (buyForm != undefined && buyForm != null && buyForm != '' && buyForm != 'null')) {
           sessionStorage.setItem('buyForm','');
            window.location.href = buyForm;
        }
    }


    /**
   * [检测是否登录]
   * @param  {[type]} !uid [description]
   * @return {[type]}      [description]
   */
  if (!uid) {
    Common.toLogin();
    return false;
  }

   $topUp.on('click', '.title', function(){
    window.location.href = Setting.staticRoot + '/pages/my-account/safe-instruction.html';
   });

//总充值goto接口
  var rurl = Setting.apiRoot1 + '/u/findBestPayChannel.p2p';
  var data = {
          userId: uid,
          loginToken:sessionStorage.getItem('loginToken'),
          transType:10//充值
        };
  var storage = {};

  $.ajax({
      url: rurl,
      type: 'post',
      dataType: 'json',
      data: data
    }).done(function(res){

    Common.ajaxDataFilter(res, function(res){
       $ulCard.css('display','none');
        if(res.code == 1){ // 已实名认证
                bestPayChannel = res.data.bestPayChannel;//最佳渠道4为宝付充值渠道，3为富友充值
                bankName=res.data.bankName;//银行名字
                bankImgURL=res.data.bankImgURL;//银行logo
                cardNum=res.data.cardNum;//银行卡号
                bindType=res.data.bindType;//判断充值是否成功 ????
                rechargeMin=res.data.rechargeMin;//起充
                if (bestPayChannel==1) {
                    bestPayChannel=3;// 最佳渠道若为连连则默认为富友
                }

                if (bestPayChannel==4) {
                    bestPayChannel=3;// 最佳渠道若为连连则默认为富友
                }

                if(bestPayChannel==3){
                  // document.getElementById("fyChannel").style.backgroundImage='url(../../images/pages/topup-cash/active.png)';
                  //document.getElementById("bfChannel").style.backgroundImage='url(../../images/pages/topup-cash/no-active.png)';
                }else if(bestPayChannel==4){
                  //document.getElementById("bfChannel").style.backgroundImage='url(../../images/pages/topup-cash/active.png)';
                  // document.getElementById("fyChannel").style.backgroundImage='url(../../images/pages/topup-cash/no-active.png)';
                }
                if (bindType==0 || bindType==null || bindType==undefined) {//充值未成功显示添加卡

                    // $ulCard.addClass('show');
                     $ulCard.css('display','block');
                    // $somebanks.addClass('hide');
                    $topupChannels.addClass('hide');

                        // $addCard.on('click', function(){
                        // $ulCard.removeClass('hide');
                        // $somebanks.removeClass('hide');
                        // })

                }else if(bindType==1){//充值已成功显示银行信息
                    $addCard.removeClass('addCard').addClass('bankinfoList');
                    $('.bankinfoList').html('');
                    $('.bankinfoList').append('<div class="logo" style="width:3rem;top:41%;font-size:0.3733rem;">银行卡','</div>','<div class="bankName" style="width:5rem;color:#666;">','</div>','<div class="cardNum" style="width:5rem;color:#9B9B9B;">','</div>');
                    // $(".logo").css({
                    //      "background-image": "url("+res.data.bankImgURL+")",
                    //      "background-size": "contain"
                    // });
                  
                    var fullcard=res.data.cardNum;//完整卡号
                    var cardLength=fullcard.length;
                    var showcard;
                    var  _hide_number;
                    if (cardLength==16) {
                      _hide_number = fullcard.substr(4,8);
                      // showcard = fullcard.replace(_hide_number,'**********');// 卡号加密
                      showcard = fullcard.substr(-4);

                    }else if(cardLength==17){
                      _hide_number = fullcard.substr(4,9);
                      // showcard = fullcard.replace(_hide_number,'***********');// 卡号加密
                      showcard = fullcard.substr(-4);

                    }else if(cardLength==18){
                      _hide_number = fullcard.substr(4,10);
                      // showcard = fullcard.replace(_hide_number,'************');// 卡号加密
                      showcard = fullcard.substr(-4);

                    }else if(cardLength==19){
                      _hide_number = fullcard.substr(4,11);
                      // showcard = fullcard.replace(_hide_number,'*************');// 卡号加密
                      showcard = fullcard.substr(-4);
                    }
                    $('.bankName').html(res.data.bankName +'（'+ showcard +'）');//显示银行名称
                    // console.log(cardNum)
                    $bankcard.val(cardNum);
                    $ulCard.addClass('hide');
                    // $somebanks.addClass('hide');//已经充值成功的默认不输卡号

                        var cardList = res.data.cardList;//总充值GOTO接口读取的cardList;
                        for(var i=0;i<cardList.length;i++){
                              if(cardList[i].payChannel == 3){
                              limitOnce = cardList[i].limitOnce;
                              limitDay = cardList[i].limitDay;
                                    if ( limitOnce==-1 || limitDay==-1) {
                                        limitOnce=0;
                                        limitDay=0;
                                        cardList[i].limitOnce=0;
                                        cardList[i].limitDay=0;
                                    }
                                        hashMap['3'] = cardList[i]//保存富友的单日和单笔
                                        $limitoncefy.html(limitOnce);
                                        $limitdayfy.html(limitDay);
                              }
                              if(cardList[i].payChannel == 4){
                              limitOnce = cardList[i].limitOnce;
                              limitDay = cardList[i].limitDay;
                                    if ( limitOnce==-1 || limitDay==-1) {
                                        limitOnce=0;
                                        limitDay=0;
                                        cardList[i].limitOnce=0;
                                        cardList[i].limitDay=0;
                                    }
                                        hashMap['4'] = cardList[i]; //保存宝付的单日和单笔
                                        $limitonce.html(limitOnce);
                                        $limitday.html(limitDay);
                              }
                         }
                    $('.cardNum').html('单笔限额¥' + Common.comdify(limitOnce));//银行卡加密显示



                }


        }else if(res.code == -2){ // 未实名认证
          $ui_dialog.removeClass('hide');
           $btn_link.attr('href',Setting.staticRoot + '/pages/my-account/setting/real-name.html');
          $btn_default.attr('href',Setting.staticRoot + '/pages/my-account/myAccount.html');
        }else{
          alert(res.message);
          return false;
        }
    });
    }).fail(function(){
      Common2.toast('网络异常',Setting.staticRoot+'/images/pages/ui/wifi.png');

      return false;
    });



    /**
   * 卡bin查询接口，异步调用
   * @return {[type]} [description]
   */
  function getCardInfo(cardNum, callback){
    if(cardNum=='' || cardNum.length<16){
        alert('请输入正确长度的银行卡号');
        return false;
    }else {

                $.ajax({
                 url: Setting.apiRoot1 + '/u/forAllChannel/cardbin.p2p',
                 // url: Setting.apiRoot1 + '/u/fy/queryCardbin.p2p',//6212261001053985641    6222020111122220000  6217002920121875893
                type: 'post',
                dataType: 'json',
                data: {
                  userId: uid,
                  cardNum: cardNum,
                  loginToken:sessionStorage.getItem('loginToken')
                }
              }).done(function(res){
                console.log(res);
                Common.ajaxDataFilter(res, function(res){
                  if(res.code == 1){
                    callback(res.data);

                       $addCard.removeClass('addCard').addClass('bankinfoList');
                        $('.bankinfoList').html('');
                        $('.bankinfoList').append('<div class="logo">','</div>','<div class="bankName">','</div>','<div class="cardNum" style="width:7rem;font-size；0.32rem;color:#9B9B9B;">','</div>');
                         $(".logo").css({
                             "background-image": "url("+res.data.bankImgURL+")",
                             "background-size": "contain"
                        });

                        bestPayChannel = res.data.bestPayChannel;
                        if (bestPayChannel==1) {
                            bestPayChannel=3;// 最佳渠道若为连连则默认为宝付
                        }
                      if(bestPayChannel == 4) {
                          bestPayChannel = 3
                      }
                        if(bestPayChannel==3){
                          // document.getElementById("fyChannel").style.backgroundImage='url(../../images/pages/topup-cash/active.png)';
                          //document.getElementById("bfChannel").style.backgroundImage='url(../../images/pages/topup-cash/no-active.png)';
                        }else if(bestPayChannel==4){
                          //document.getElementById("bfChannel").style.backgroundImage='url(../../images/pages/topup-cash/active.png)';
                          // document.getElementById("fyChannel").style.backgroundImage='url(../../images/pages/topup-cash/no-active.png)';
                        }
                        // res.data.cardNum = '6222020111122220000'
                        var fullcard=res.data.cardNum;
                        var showcard;
                        var  _hide_number;
                        var cardLength=fullcard.length;
                        if (cardLength==16) {
                          _hide_number = fullcard.substr(4,8);
                          // showcard = fullcard.replace(_hide_number,'**********');// 卡号加密
                          showcard = fullcard.substr(-4);
                        }else if(cardLength==17){
                          _hide_number = fullcard.substr(4,9);
                          // showcard = fullcard.replace(_hide_number,'***********');// 卡号加密
                          showcard = fullcard.substr(-4);
                        }else if(cardLength==18){
                          _hide_number = fullcard.substr(4,10);
                          // showcard = fullcard.replace(_hide_number,'************');// 卡号加密
                          showcard = fullcard.substr(-4);
                        }else if(cardLength==19){
                          _hide_number = fullcard.substr(4,11);
                          // showcard = fullcard.replace(_hide_number,'*************');// 卡号加密
                          showcard = fullcard.substr(-4);
                        }
                        $('.bankName').html(res.data.bankName +'（'+ showcard +'）');
                        $('.cardNum').html('储蓄卡');

                        var cardlist = res.data.cardList;//卡bin查询接口读取的cardList;
                        for(var i=0;i<cardlist.length;i++){
                              if(cardlist[i].payChannel == 3){
                              limitOnce = cardlist[i].limitOnce;
                              limitDay = cardlist[i].limitDay;
                                    if ( limitOnce==-1 || limitDay==-1) {
                                        limitOnce=0;
                                        limitDay=0;
                                        cardlist[i].limitOnce=0;
                                        cardlist[i].limitDay=0;
                                    }
                                  hashMap['3'] = cardlist[i];//保存富友的单日和单笔
                                        $limitoncefy.html(limitOnce);
                                        $limitdayfy.html(limitDay);
                              }
                              if(cardlist[i].payChannel == 4){
                              limitOnce = cardlist[i].limitOnce;
                              limitDay = cardlist[i].limitDay;
                                    if ( limitOnce==-1 || limitDay==-1) {
                                        limitOnce=0;
                                        limitDay=0;
                                        cardlist[i].limitOnce=0;
                                        cardlist[i].limitDay=0;
                                    }
                                  hashMap['4'] = cardlist[i];//保存宝付的单日和单笔
                                        $limitonce.html(limitOnce);
                                        $limitday.html(limitDay);
                              }
                         }


                  }else{
                    alert(res.message);
                  }
                });
              }).fail(function(){
              Common2.toast('网络异常',Setting.staticRoot+'/images/pages/ui/wifi.png');

                  $this.removeClass('disabled');
                  return false;
                });

           }
  }


//卡号输入框失去焦点时自动卡bin查询
  $topUp.on('focusout', 'input[name=bankcard]', function(){
    var $this = $(this);
    var card = $.trim($this.val());
    if(card.length == 0){
      return false;
    }
    getCardInfo(card.replace(/\s/g, ''), function(info){
        if(!!info.bankName){
          //$bank.closest('li').removeClass('hide');
          // $topupChannels.removeClass('hide');
        }
      });
  });

  //切换充值渠道
  function setValue(paychanel){
      bestPayChannel = paychanel;
  }

  $topUp.on('touchend', '#fyChannel', function(){
      setValue(3);
            document.getElementById("fyChannel").style.backgroundImage='url(../../images/pages/topup-cash/active.png)';
            //document.getElementById("bfChannel").style.backgroundImage='url(../../images/pages/topup-cash/no-active.png)';
  });

  $topUp.on('touchend', '#bfChannel', function(){
      setValue(4);
            //document.getElementById("bfChannel").style.backgroundImage='url(../../images/pages/topup-cash/active.png)';
            document.getElementById("fyChannel").style.backgroundImage='url(../../images/pages/topup-cash/no-active.png)';
  });

  //为用户发送短信验证码
  var smsTimer;
  var defText = '重新发送';
  var timeText = '{time}s后重试';

  // 短信发送定时器
  function startSmsTimer(timeOver){
    if(!!smsTimer){
      clearInterval(smsTimer);
    }
    var _i = Common.vars.sendWait;
    smsTimer = setInterval(function(){
      $sendSmsAgain.val(timeText.replace(/{time}/, _i--));
      if(_i < 0){
        clearInterval(smsTimer);
        smsTimer = null;
        timeOver();
      }
    }, 1000);
  }

  /**
   * 表单验证
   * @return {[type]} [description]
   */
function check(){
    var bankcard = $.trim($bankcard.val());//卡号
    var money = $.trim($money.val());//充值金额
    // var bank = $.trim($bank.val());
    // var limit = limitonce;
    // var bankCode = $.trim($bank_code.val());
    // var banktype = $.trim($cardType.val());
    // var agreeno = $.trim($agreeNo.val());
    // var phone_number = $.trim($phone_number.val());
    // var bindType = $.trim($bindType.val());
    if(bankcard.length == 0){
      alert('请添加您的银行卡');
      return false;
    }
    if(money.length == 0){
      alert('请输入您要充值的金额');
      return false;
    }
    if(!Common.reg.money.test(money)){
      $money.val('');
      alert('金额输入有误');
      return false;
    }
    money = parseFloat(money);
    if(money < parseFloat(rechargeMin)){
      alert('充值金额不能低于'+ rechargeMin +'元');
      return false;
    }
    // //未绑卡请求的data参数
    // formData.userId = uid;//4;//uid
    // formData.card_no = bankcard.replace(/\s/g, '');
    // formData.bank_name = bank;
    // formData.total_fee = money;
    // formData.bank_card_type = banktype; // wap
    // formData.bank_code = bankCode;
    // formData.phone_number = phone_number;
    // formData.bind_id = agreeno;

    // //绑卡请求的data参数
    // formAgreeData.userId = uid;
    // formAgreeData.bind_id = agreeno;
    // formAgreeData.total_fee=money;

    return true;
  }

  //金额变化后自动添加小数点
  $money.on('change',function(){
    $(this).val(parseFloat($(this).val()).toFixed(2));
    if($(this).val()){
      $('.next-btn').css('background','#2B6FF9');
    }else{
      $('.next-btn').css('background','#AAC5FC');
    }

  });

  /**
   * 点击充值
   * @return {[type]} [description]
   */
  $topUp.on('click', '.next-btn', function(){
    var $this = $(this);
     if($this.hasClass('disabled')){
      return false;
    }else{
      if(!check()){
        return false;
      }
      console.log(bestPayChannel)
      if(bestPayChannel==3){
        var orderUrl = Setting.apiRoot1 + '/u/fy/rechargeForWeixin.p2p';
        var cardNum = $.trim($bankcard.val());//卡号
        var money = $.trim($money.val());//充值金额

            if (hashMap[bestPayChannel].limitDay==0 || hashMap[bestPayChannel].limitOnce==0) {//0803
              alert('当前支付渠道不支持该银行');
              return false;
            }
           if(parseFloat(money)>parseFloat(hashMap[bestPayChannel].limitOnce)){
               // alert('超过单笔限额，您可以前往V金融官网（www.vfint.com）进行操作');
               $('.limitOnce').show();
               return false;
           }
        $this.addClass('disabled');

          $.ajax({
            url: orderUrl,//富友充值
            type: 'post',
            dataType: 'json',
            data: {
              cardNum: cardNum,
              userId: uid,
              amount:money,
              loginToken:sessionStorage.getItem('loginToken')
            }
          }).done(function(res){
            if(res.code == 1){
              console.log(res)

                 //var url = 'http://www-1.fuiou.com:18670/mobile_pay/timbnew/timb01.pay'; //富友测试地址
                 var url = 'https://mpay.fuiou.com:16128/timbnew/timb01.pay';//富友正式地址
                 // var url = 'http://www-1.fuiou.com:18670/mobile_pay/h5pay/payAction.pay';//富友测试地址


                  var $form = $('<form id="formpay"></form>');
                  $form.attr('action', url);
                  $form.attr('method', 'post');

                  $form.append($('<input>').attr('name', 'mchntCd').val(res.data.mchntCd));
                  $form.append($('<input>').attr('name', 'orderid').val(res.data.orderid));
                  $form.append($('<input>').attr('name', 'ono').val(res.data.ono));
                  $form.append($('<input>').attr('name', 'backurl').val(res.data.backurl));
                  $form.append($('<input>').attr('name', 'reurl').val(res.data.reurl));
                  //$form.append($('<input>').attr('name', 'homeurl').val(res.data.homeurl));
                  $form.append($('<input>').attr('name', 'homeurl').val('https://static.wdclc.cn/wx/pages/my-account/topup-cash.html?success=1'));
                  //$form.append($('<input>').attr('name', 'homeurl').val('http://192.168.12.62:8080/wx3.0/pages/my-account/myAccount.html'));
                  $form.append($('<input>').attr('name', 'name').val(res.data.name));
                  $form.append($('<input>').attr('name', 'sfz').val(res.data.sfz));
                  $form.append($('<input>').attr('name', 'md5').val(res.data.md5));
                  $('body').append($form);
                  // $form.submit();
                  $('#formpay').submit();
                    console.log(JSON.stringify(res.data));
              }
            else if(res.data){
                alert(res.data.result_msg);
            }else{
                alert(res.message);
            }


              $this.removeClass('disabled');
                return false;

          }).fail(function(){
              Common2.toast('网络异常',Setting.staticRoot+'/images/pages/ui/wifi.png');

            $this.removeClass('disabled');
            return false;
          });


      }else if(bestPayChannel==4){
        var orderUrl = Setting.apiRoot1 + '/u/bf/rechargeForBF.p2p';
        var cardNum = $.trim($bankcard.val());//卡号
        var money = $.trim($money.val());//充值金额

                    if (hashMap[bestPayChannel].limitDay==0 || hashMap[bestPayChannel].limitOnce==0) {//0803
                      //alert("limitDay----------"+limitDay);
                      //alert("limitOnce----------------"+limitOnce);
                      alert('当前支付渠道不支持该银行');
                      return false;
                    }

          if(parseFloat(money)>parseFloat(hashMap[bestPayChannel].limitOnce)){
              alert('超过单笔限额，您可以前往V金融官网（www.vfint.com）进行操作');
              return false;
          }
        $this.addClass('disabled');
          $.ajax({
            url: orderUrl,//宝付充值
            type: 'post',
            dataType: 'json',
            data: {
              acc_no: cardNum,
              mobile:phone_number,
              userId: uid,
              txn_amt:money,
              type:3,
              loginToken:sessionStorage.getItem('loginToken')
            }
          }).done(function(res){
              if(res.code == 1){

                   if (hashMap[bestPayChannel].limitDay==0 || hashMap[bestPayChannel].limitOnce==0) {//0803
                      alert('当前支付渠道不支持该银行');
                      return false;
                    }

                  var url = res.data.action;
                  var $form = $('<form></form>');
                  $form.attr('action', url),
                  $form.attr('method', 'post');

                  $form.append($('<input>').attr('name', 'back_url').val(res.data.back_url));
                  $form.append($('<input>').attr('name', 'terminal_id').val(res.data.terminal_id));
                  $form.append($('<input>').attr('name', 'data_type').val(res.data.data_type));
                  $form.append($('<input>').attr('name', 'data_content').val(res.data.data_content));
                  $form.append($('<input>').attr('name', 'input_charset').val(res.data.input_charset));
                  $form.append($('<input>').attr('name', 'language').val(res.data.language));
                  $form.append($('<input>').attr('name', 'txn_type').val(res.data.txn_type));
                  $form.append($('<input>').attr('name', 'version').val(res.data.version));
                  $form.append($('<input>').attr('name', 'member_id').val(res.data.member_id));
                  $form.append($('<input>').attr('name', 'txn_sub_type').val(res.data.txn_sub_type));
                  $form.submit();


              }else if(res.data){
                alert(res.data.result_msg);
              }else{
                alert(res.message);
              }
                $this.removeClass('disabled');
                return false;

          }).fail(function(){
            Common2.toast('网络异常',Setting.staticRoot+'/images/pages/ui/wifi.png');

            $this.removeClass('disabled');
            return false;
          });
      }else{
        Common2.toast('此银行卡不支持或信息输入有误！');
      }

    }
   })
    var $input = $('input[name="money"]');
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

    });
});