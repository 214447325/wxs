/*
* @Author: User
* @Date:   2016-06-27 10:44:26
* @Last Modified by:   User
* @Last Modified time: 2016-06-30 11:32:29
*/

$(function(){
    
  var $tabcon       = $('.float-portfolioList');
  var $floatHasmoney       = $('.floatHasmoney');
  $recordCount= $('.recordCount');
  var param = Common.getParam();
var lineId = param.lineId;
var floatHasmoney=param.floatHasmoney;
//  var userId = sessionStorage.getItem('uid');
//
//  if(!userId){
//    Common.toLogin();
//    return false;
//  }


  //红包模板
  var setListData = doT.template([
    '{{~it :item:index}}',
    '<dl >',

    '<div class="item">',
	    // '<a class="title" href="float-portfolioDetail.html?type=4&code={{=item.purposeCode}}">{{=item.loanPurpose}}',
         '<a class="title" href="floatPortfolioDetails.html?type=4&code={{=item.purposeCode}}&lineId='+lineId+'&floatHasmoney='+floatHasmoney+'">{{=item.loanPurpose}}',
			'<i  >({{=item.count}}个)</i>',    
			'<i class="percent">占比:{{=item.eachPercent}}</i>',
	    '</a>',
      '</div>',
      '</dl>',
    '{{~}}'
  ].join(''));
  

 
  //获取消息列表
  $.ajax({
    url:Setting.apiRoot1 + '/queryDebtInfoForFloat.p2p',
    type:"post",
    dataType:'json',
    data:{
      type:4,
      lineId:lineId
    }
  }).done(function(res){
      if(res.code==1){
    	  var data = res.data;
    	  $tabcon.html(setListData(data));
        $floatHasmoney.text(Common.comdify(floatHasmoney));
        $recordCount.text(res.recordCount);
      }else{
    	  alert(res.message);
          return false;
      }

  }).fail(function(){
    alert('网络链接失败');
    return false
  });
  
  
});