$(function() {
          sessionStorage.removeItem('buy-pro');
          var $activeSelect = $('.active-select');//控制活动
          var $rowActive= $('.row-active');//活动奖励
          //var $amountShow = $('.amount');
          var $buy = $('.page-buy');//body
          var $back=$('.back');//返回上一页按钮
          var $regularTitle = $('.regularTitle', $buy);
          var $amount = $('.amount', $buy);//可投余额(标的余额)
          var $balanceAccount = $('.balanceAccount');//账户余额
          var $input = $('.input', $buy);//用户输入金额
          var $agreement = $('.agreement');//投资协议
          var $expectmoney = $('.expectmoney');//预期收益
          var $full= $('.full');//全额按钮 
          var $rowActive=$('.row-active');//活动奖励一栏
          // var $detail=$('.detail');//活动文字 
          var $selfExtra = $('.selfExtra');//活动奖励
          $selfExtra.text(0);//奖励默认显示0
          var $payMoney = $('.pay-money', $buy);//确定按钮
          var userId = sessionStorage.getItem('uid');//userid
          var loginToken = sessionStorage.getItem('loginToken');
          //param
          var param = Common.getParam();
          var jumpId= param.jumpId;//jump
          var pid=param.pid;//产品ID
          var pname=param.pname;//title
          var pmount=parseFloat(param.pmount);//可投余额(标的余额)
          var maxInvestAmount = parseFloat(param.maxInvestAmount);//最大投资金额
          var minInvestAmount =parseFloat(param.minInvestAmount);//最小起投金额
          var maxRate=param.maxRate;//最大利率
          var minRate=param.minRate;//最小利率
          var addRate=param.addRate;//加息
          var cycle=param.cycle;//周期时长
          var cycleType=param.cycleType;//周期类型
          var act10=param.act10;//是否参加iPhone活动
          var act11=param.act11;//是否参加投资立返活动

          //定义全局
          var accountAmt;//账户余额
          var money;//用户投资输入框的金额值
          var expect;//每月收益的值
          var percent;
          var selfExtra;
          var _data;

          //根据act11为1显示活动奖励 为0不显示 
          if (act11==0) {
            $rowActive.hide();
            // $detail.hide();
          }
          if (act11>0) {
            $rowActive.show();
          }

          //送iphone活动
          $input.attr({'disabled': 'true'}).css({'background': 'white'});//投资金额输入框设置为不可选
          var countMoney = 0;
          var _html = '';
          var htmlHeight = 0;
    
          if(!param.pid || !param.pname || !param.pmount || !param.minInvestAmount || !param.maxInvestAmount){
          alert('参数有误！！');
          window.location.href = Setting.staticRoot + '/pages/index.html';
          return false;
          }
          if(!userId){
          Common.toLogin();
          return false;
          }
    
    
    $.post(
    		Setting.apiRoot1 + '/u/getInvestReward.p2p', 
    		{productId: pid, userId: userId, loginToken: loginToken},
    		function(datas) {
                _data = datas.data;
                if(datas.code == 1) {
                          for (var a = 0; a < _data.length; a++) {
                              var investAmount = _data[a].investAmount;
                              //根据后台返回的数据循环迭代活动购买按钮
                              _html = _html + '<div class="active-select1 activeSelect ac ac'+ a +'">' +
                                              '<div class="active-select1-img3">' +
                                              '<img src="../../images/pages/financing/jian2.png" class="sub jian'+ a +'">' +
                                              '</div>' +
                                              '<div class="active-select1-img4 select'+ a +'">' + investAmount +
                                              '</div>' +
                                              '<div class="active-select1-img3">' +
                                              '<img src="../../images/pages/financing/jia2.png" class="add jia'+ a +'">' +
                                              '</div>' +
                                              '<div class="active2">' +
                                              '投资<span class="span1"><span class="s'+ a +'">'+ parseFloat(investAmount / 10000).toFixed(2) +'</span>万</span>送<span class="span1"><span class="span3 sp'+ a +'">1</span>台</span>' + _data[a].name +
                                              '</div>' +
                                              '</div>';

                              htmlHeight = htmlHeight + 1.3;
                          }

                $('.active-select').height(htmlHeight + 'rem').html(_html);
                }

                getDisabledSub();
                $input.val('请点击加号选择购买金额');

                var $select0 = $('.select0');//改变金额框；
                var $select1 = $('.select1');//改变金额框；
                var $select2 = $('.select2');//改变金额框;

                var addCount0 = 0;
                var addCount1 = 0;
                var addCount2 = 0;

                var $add0 = $('.jia0');//送iPhone7的加号
                var $add1 = $('.jia1');//送iPhone7 Plus的加号
                var $add2 = $('.jia2');//送iPhone7 Pro的加号

                var $sp0 = $('.sp0');//送iPhone7的数量
                var $sp1 = $('.sp1');//控制iPhone7 Plus的数量
                var $sp2 = $('.sp2');//控制iPhone7 Pro的数量


                //点击送iPhone前面的加号
                $add0.click(function() {
                    getAddData(0, _data[0].investAmount, $sp0, $('.s0'));
                    subDisabled(0, 0);
                });
                //点击送iPhone7 Plus前面的加号
                $add1.click(function() {
                    getAddData(1, _data[1].investAmount, $sp1, $('.s1'));
                    subDisabled(1, 1);
                });
                //点击送iPhone7 Pro前面的加号
                $add2.click(function() {
                    getAddData(2, _data[2].investAmount, $sp2, $('.s2'));
                    subDisabled(2, 2);
                });


                function subDisabled(i, j) {
                    if (countMoney > 0) {
                            $('.jian' + i).attr({'src': '../../images/pages/financing/jian2.png'});
                            $('.select' + j).removeClass('imgs').addClass('active-select1-img2');
                    }
                }


      //点击加号的方法
      function getAddData(moneyCount, amount, $sp, $s0){
           var val =  $input.val();
           //判断输入框里面有没有值
           if (val != 0 && val != '' && val != null &&  val != undefined) {
               countMoney = parseInt(val);
           }
           /**
            * addCount0 控制点击第一个活动的参数
            * addCount1 控制点击第二个活动的参数
            * addCount2 控制点击第三个活动的参数
            */
           countMoney = parseInt(countMoney);
           countMoney = countMoney + parseInt(amount);
           var c = 0;
           var s = '';
           var moneyLength = 0;
           var mon = '';
           if(moneyCount == 0) {
               addCount0 = addCount0 + parseInt(amount);
               c = addCount0 / parseInt(amount);
               s = addCount0.toString();
           }

           if(moneyCount == 1) {
               addCount1 = addCount1 + parseInt(amount);
               c = addCount1 / parseInt(amount);
               s = addCount1.toString();
           }

           if(moneyCount == 2) {
               addCount2 = addCount2 + parseInt(amount);
               c = addCount2 / parseInt(amount);
               s = addCount2.toString();
           }

           moneyLength = s.length;
           $sp.html(c);
           mon = s.substring(0, moneyLength-4);
           $s0.html(mon);
           $input.val(countMoney);

           getActive(cycleType);
      }

        /**
         * 用户点击减小按钮
         * @type {*|jQuery|HTMLElement}
         */
        var $subtract0 = $('.jian0');//送iPhone7的减号
        var $subtract1 = $('.jian1');//送iPhone7 Plus的减号
        var $subtract2 = $('.jian2');//送iPhone7 Pro的减号

        //点击送iPhone前面的减号
        $subtract0.click(function() {
            if(addCount0 > 0) {
                getSubStr(_data[0].investAmount, 0,  $sp0, $('.s0'));
            } else {
                getDisabledSub();
                $subtract0.attr({'src': '../../images/pages/financing/jian1.png'});
                $select0.removeClass('active-select1-img2').addClass('imgs');
            }

        });

        $subtract1.click(function() {
            if(addCount1 > 0) {
                getSubStr(_data[1].investAmount, 1, $sp1, $('.s1'));
            } else {
                getDisabledSub();
                $subtract1.attr({'src': '../../images/pages/financing/jian1.png'});
                $select1.removeClass('active-select1-img2').addClass('imgs');
            }
        });

        $subtract2.click(function() {
            if(addCount2 > 0) {
                getSubStr(_data[2].investAmount, 2, $sp2, $('.s2'));
            } else {
                getDisabledSub();
                $subtract2.attr({'src': '../../images/pages/financing/jian1.png'});
                $select2.removeClass('active-select1-img2').addClass('imgs');
            }
        });

    //通过循环迭代来改变金额提示框
   function getDisabledSub() {
       if (countMoney == 0) {
           for(var i = 0; i < _data.length; i++) {
               $('.jian' + i).attr({'src': '../../images/pages/financing/jian1.png'});
               $('.select' + i).removeClass('active-select1-img2').addClass('imgs');
           }
       }
   }

   //控制商品的减少方法
  function getSubStr(amount, acount, $sp, $so) {
      var count = 0;
      if(countMoney > 0) {
          countMoney = parseInt(countMoney);
          countMoney = countMoney - parseInt(amount);
          if (acount == 0) {
              addCount0 = addCount0 - parseInt(amount);
              count = addCount0;
              if(addCount0 == 0) {
                  $subtract0.attr({'src': '../../images/pages/financing/jian1.png'});
                  $select0.removeClass('active-select1-img2').addClass('imgs');
              }
          }

          if (acount == 1) {
              addCount1 = addCount1 - parseInt(amount);
              count = addCount1;
              if(addCount1 == 0) {
                  $subtract1.attr({'src': '../../images/pages/financing/jian1.png'});
                  $select1.removeClass('active-select1-img2').addClass('imgs');
              }

          }

          if (acount == 2) {
              addCount2 = addCount2 - parseInt(amount);
              count = addCount2;
              if(addCount2 == 0) {
                  $subtract2.attr({'src': '../../images/pages/financing/jian1.png'});
                  $select2.removeClass('active-select1-img2').addClass('imgs');
              }
          }

          if(countMoney <= 0) {
              $input.val('请点击加号选择购买金额');
              countMoney = 0;
              for(var i = 0; i < _data.length; i++) {
                  $('.jian' + i).attr({'src': '../../images/pages/financing/jian1.png'});
                  $('.select' + i).removeClass('active-select1-img2').addClass('imgs');
              }
          } else {
              $input.val(countMoney);
          }
      }
      var c = count / parseInt(amount);
      if(count <= 0) {
          $sp.html(0);
      } else {
          $sp.html(c);
      }
      var s = count.toString();
      var moneyLength = s.length;
      var mon = s.substring(0, moneyLength-4);
      if(count <= 0) {
          $so.html(0);
          count = 0;
      } else {
          $so.html(mon);
      }
      getActive(cycleType);
  }


           //检查是否设置交易密码
          !function() {
            $.ajax({
              url : Setting.apiRoot1 + '/u/checkUserInfo.p2p',
              type : 'post',
              dataType : 'json',
              data : {
                userId : userId,
                type : 2,
                loginToken : sessionStorage.getItem('loginToken')

              }
            }).done(
                function(res) {
                  Common.ajaxDataFilter(res, function(data) {
                    if (data.code == -3) {
                      alert(data.message);
                      $('.pay-money').addClass('disabled btn-gray').removeClass('btn-default');
                      return false;
                    }
                  });
                }).fail(function() {
              alert('网络链接失败，请刷新重试！');
              return false;
            });
          }();
          // 我的账户信息总览 获取账户余额
          !function() {
            $.ajax({
            url:Setting.apiRoot1 + '/u/queryMyAccountInfo.p2p',
            type:"post",
            async:false,
            dataType:'json',
            data:{
              userId: userId,
              loginToken:sessionStorage.getItem('loginToken')
            }
            }).done(function(res){
            Common.ajaxDataFilter(res,function(){
              if(res.code==1){
                var data = res.data;
                accountAmt=data.accountAmt;//账户余额
              }else{
                alert(res.message);
                  return false;
              }
            })
            }).fail(function(){
            alert('网络链接失败');
            return false
            });  
          }();

          //设置页面显示数据
          !function() {
            document.title="购买"+cycle+"周定期";
            $amount.text(Common.comdify(pmount.toFixed(2)));//设置页面可投余额(标的余额)
            $balanceAccount.text(Common.comdify(accountAmt));//显示账户余额
            $input.attr('placeholder', '起投金额' +minInvestAmount+'元');//投资输入框起投金额
          }();

          function getActive(cycleType) {
              money = $.trim($input.val());//输入金额
              if(money != null && money != ''&& money != null) {
                  // var  selfExtr = 0;
                  // $.post(Setting.apiRoot1 + '/investGetCoupon.p2p',function(res) {
                  //     var _data = res.data.regular.regularList;
                  //     for (var i = 0; i < _data.length; i++) {
                  //         if(parseInt(money) >= parseInt(_data[i].paramKey)) {
                  //             selfExtr = _data[i].spare2;
                  //         }
                  //     }
                  //     $selfExtra.html(selfExtr);
                  // });
                  selfExtra=(money*act11/100).toFixed(2);
                  $selfExtra.text(selfExtra);   
              } 
          }


    $buy.on('click', '.pay-money', function(){
                var $this = $(this);
                if ($this.hasClass('disabled')) {
                  return false;
                }
                money = $.trim($input.val());
                if (money <= 0) {
                  alert('输入的金额需大于0元');
                  $input.val('');
                  return false;
                }
                if (!Common.reg.money.test(money)) {
                  alert('输入金额无效！');
                  $input.val('');
                  return false;
                }
                if (money < minInvestAmount) {
                  alert('投资金额不能小于起投金额'+minInvestAmount+'元');
                  $input.val('');
                  return false;
                }
                if (parseFloat(money) >accountAmt) {
                  var layer=document.createElement("div");
                  var layerHtml= '<div class="ui-alert backdrop"><div class="dialog-content"><h3 class="dialog-title">温馨提示</h3><div class="dialog-article"><p class="alert-message">余额不足前往充值</p></div><div class="tc btn-box2 full-btn "><a href="../my-account/topup-cash.html" class="btn btn-default btn-sm submit">前往充值</a></div></div></div>';
                  layer.innerHTML=layerHtml;
                  document.body.appendChild(layer);
                  return false;
                }
                if (parseFloat(money) >pmount.toFixed(2)) {
                  alert('投资金额不能大于剩余可购余额');
                  $input.val('');
                  return false;
                }
                if (parseFloat(money) <minInvestAmount.toFixed(2)) {
                  alert('投资金额不能小于最小可投金额');
                  $input.val('');
                  return false;
                }
                if (parseFloat(money) >maxInvestAmount.toFixed(2)) {
                  alert('投资金额不能大于单笔最大投资额' +maxInvestAmount);
                  $input.val('');
                  return false;
                }
                var formData = [];
                var post = {};
                var aCount = 0;
                if(addCount0 != 0) {
                    aCount = 0;
                    aCount = $.trim($sp0.html());
                    post= {"pid": _data[0].id,"num": parseInt(aCount)};
                    formData.push(post);
                }
                if(addCount1 != 0) {
                    aCount = 0;
                    aCount = $.trim($sp1.html());
                    post= {"pid": _data[1].id,"num": parseInt(aCount)};
                    formData.push(post);
                }
                if(addCount2 != 0) {
                    aCount = 0;
                    aCount = $.trim($sp2.html());
                    post= {"pid": _data[2].id,"num": parseInt(aCount)};
                    formData.push(post);
                }
                var _payFormData = JSON.stringify(formData);
                sessionStorage.setItem('payData', _payFormData);

                money = $.trim($input.val());

                post = {
                    investAmt: money,
                    prodId: param.pid
                };
                sessionStorage.setItem('buy-pro', JSON.stringify(post));
                window.location.href = 'pay-actve.html?cycle='+cycle;
    }).on('click', '.recharge', function(){
        var $this = $(this);
        if($this.hasClass('disabled')){
            return false;
        }

    });

    //查看细则点击弹出显示
    $('.Bonusrules').click(function(event) {
        $('.maskLayer').css('display','block');
        $('#center').removeClass('center').addClass('centerOpen');
        $('.close').click(function(event) {
            $('.maskLayer').css('display','none');
            $('#center').removeClass('centerOpen').addClass('center');
        })
    });

    //购买协议点击跳转
    $agreement.on('click',  function(){
        var fullName = sessionStorage.getItem('realname');
        var showName = "***";
        if(fullName==null || fullName==undefined || fullName.length<1){
            alert('姓名错误：'+fullName);
        }else{
            var fisrtName = fullName.substr(0,1);
            if (fullName.length==2) {
                showName = fisrtName+'*';
            }else if(fullName.length==3){
                showName = fisrtName+'**';
            }else if(fullName.length==4){
                showName = fisrtName+'***';
            }//名字
        }
        var fullPhone = sessionStorage.getItem('uname');
        var phoneNum = "***********";
        if(fullPhone==null || fullPhone==undefined || fullPhone.length<11){
            alert('手机号错误：'+fullPhone);
        }else{
            var _hide_number = fullPhone.substr(3,4);
            phoneNum = fullPhone.replace(_hide_number,'****');//手机
        }

        var fullCertNo = sessionStorage.getItem('cardNum');
        var cardNum = "***************";
        if(fullCertNo==null || fullCertNo==undefined || fullCertNo.length<15){
            alert('身份证号错误：'+cardNum);
        }else{
            var _front_cardnum = fullCertNo.substr(0,3);
            var _last_cardnum = fullCertNo.substr(14,4);
            cardNum = _front_cardnum+'***********'+_last_cardnum;//身份证
        }

        window.location.href = "regular-agreement.html?uName="+showName+"&uMobile="+phoneNum+"&uSFZ="+cardNum;
    });

    $back.on('click',  function(){
        if (jumpId==1) {
            window.location.href = "../financing/regular.html";
        }
    });


    //隐藏显示活动细则
    $('.content-Img0').click(function(data) {
        $('.juzhong').hide();
        $('.maskLayer').css({'display': 'none'});
    });

    $('#Bonusrules').click(function(data) {
        $('.juzhong').show();
    });

    },'json');
});
