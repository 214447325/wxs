// 我的产品,定期
$(function(){

  var $my_product = $('.my-product');
  //var $nav_select = $('.nav-select',$my_product);
  var $tabcon       = $('.regularList');
  var $regularAmtSum = $('.regularAmtSum',$my_product); //定义总资产
  var $expectedAmtSum= $('.expectedAmtSum',$my_product);//预期总收益
  var $totalInterest= $('.totalInterest',$my_product);//累计总收益
  var $conent_box    = $('.conent-box',$my_product);
  var $check=$('.check');
  var hadShare;
  var hashMap = {};
  var maps = {};
  var holdMoney = [];
  var holdInterestAmount = [];
  var timeType=[];
  var cycleType =[];
  var percent=[];
  var uid = sessionStorage.getItem("uid");
  if (!uid) {
    Common.toLogin();
    return false;
  }

//我的固收接口（新）
    $.ajax({
      url: Setting.apiRoot1 + '/u/queryMyRegularLoanNew.p2p',
      type: 'post',
      dataType: 'json',
      data: {
        userId: uid,
        type: 3,
        // timeType: time,
        // loanType:loanType,
        loginToken:sessionStorage.getItem('loginToken')
      }
    }).done(function(res){

        Common.ajaxDataFilter(res,function(){
        var data = res.data;
        if(res.code == 1){
          $regularAmtSum.text(/*'￥' + */Common.comdify((data.regularAmtSum).toFixed(2)));
          $expectedAmtSum.text(/*'￥'+*/ (data.expectedAmtSum).toFixed(2));
          $totalInterest.text(/*'￥'+*/ (data.totalInterest).toFixed(2));

           hadShare=data.regularAmtSum;
           //alert(data.myRegularInvestList.length);
           for (var i = 0; i<data.myRegularInvestList.length;i++) {
            holdMoney[i]=data.myRegularInvestList[i].holdMoney;
            holdInterestAmount[i] = data.myRegularInvestList[i].interestTotalAmount;
            hashMap[data.myRegularInvestList[i].loanCycle] = holdMoney[i];//周期与金额对应
            maps[data.myRegularInvestList[i].loanCycle] = holdInterestAmount[i];//周期与预期收益相对应
           }
                  $.ajax({
                  url: Setting.apiRoot1 + '/u/queryMyRegularMenuList.p2p',
                  type: 'post',
                  dataType: 'json',
                  data: {
                    userId: uid,
                    loginToken:sessionStorage.getItem('loginToken')
                  }
                }).done(function(res){
                  Common.ajaxDataFilter(res,function(){
                    if(res.code == 1){
                      var data=res.data;
                       for(var i=0; i<data.length;i++){
                      //data[i].holdMoney = holdMoney[i];
                      data[i].holdMoney = hashMap[data[i].loanCycle];//赋值
                      if(data[i].holdMoney == null){
                         data[i].holdMoney = 0;
                       }


                      if(hashMap[data[i].loanCycle] != null){//说明用户已经投资该类定期
                      timeType[i]=data[i].timeType;
                      cycleType[i]=data[i].cycleType;
                          data[i].interestTotalAmount = maps[data[i].loanCycle];
                      
                       var fullLength =(timeType[i]).toString().length;
                       var time = (timeType[i]).toString().substr(0, fullLength-1);
                   
                       if( cycleType[i]==1){
                        percent[i] = time / 365;
                       }else if(cycleType[i]==2){
                        percent[i] = time*30 /365;
                       }else if(cycleType[i] == 3){
                        percent[i] =time*365 /365;
                       }else if(cycleType[i] == 4){
                        percent[i] = time*7 /365;
                       }
                      
                       data[i].percent = percent[i];
                       }else{
                        data[i].holdMoney = 0;
                        data[i].percent = 0;
                      }

                    }
                        for(var i = 0; i < data.length; i++) {
                            if(data[i].interestTotalAmount == null
                                || data[i].interestTotalAmount == '' ||
                                data[i].interestTotalAmount == undefined) {
                                data[i].interestTotalAmount = 0;
                            }
                        }

                      $tabcon.html(setListData(data));


                    }else{
                      alert(res.message);
                    }
                  })
                }).fail(function(){
                  alert('网络链接失败');
                  return false;
                });

        }else{
          $regularAmtSum.text('￥0.00');
          $expectedAmtSum.text('￥0.00');
          alert(res.message);
        }
    })
    }).fail(function(){
      alert('网络链接失败');
      return false;
    });

// 定期列表查询(新)
 var setListData = doT.template([
    '{{~it :item:index}}',
    '<dl >',
    '<div class="item">',
    '<div class="examine">{{=item.title}}','</div>',
     '<a class="orders" href="regular-orders.html?timeType={{=item.timeType}}&title={{=item.title}}">',
      '<div class="round">{{=item.yearRate}}%','</div>',
      '<div class="floatinfo">',
        '<div class="amount">在投本金(元):{{=(item.holdMoney).toFixed(2)}}','</div>',
        //'{{?item.interestTotalAmount == 0}}',
     '<div class="currentWeight">预期收益(元):{{=(item.interestTotalAmount).toFixed(2)}}','</div>',
     //   '{{??}}',
     //'<div class="currentWeight">预期收益(元):{{=(item.holdMoney*item.percent*(item.yearRate/100)).toFixed(2)}}','</div>',
     //'{{?}}',
     '</div>',
     '<div class="arrow">','</div>',
     '</a>',
    '</div>',
   '</dl>',
    '{{~}}'
  ].join(''));

$check.on('click',  function(){
       window.location.href = "regular/regularPortfolio.html?hadShare="+hadShare;
     });

});
