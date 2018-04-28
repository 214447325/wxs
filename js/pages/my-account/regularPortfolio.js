/*
* @Author: User
* @Date:   2016-06-14 17:50:06
* @Last Modified by:   User
* @Last Modified time: 2016-06-21 19:11:54
*/

$(function(){
  var $currentPortfolio = $('.currentPortfolio');// 投资后资产组合
  var $tabcon       = $('.current-portfolioList');
  var $hadShare= $('.hadShare',$currentPortfolio); //周周涨持有份额
  var $recordCount=$('.recordCount');//资产个数
  var param = Common.getParam();  
  var hadShare= param.hadShare;

if(hadShare==0){
 document.getElementById("bgred").style.display='none';
 document.getElementById('current-portfolioList').innerHTML='<img class="null" src="../../../images/pages/cry.png"/><p class="nullword">空空如也，赶快投资吧</p>';
}else{
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
	    '<a class="title" href="regularPortfolioDetails.html?hadShare='+hadShare+'&type=1&code={{=item.purposeCode}}">{{=item.loanPurpose}}',
			'<i  >({{=item.count}}个)</i>',    
			'<i class="percent">占比:{{=item.eachPercent}}</i>',
	    '</a>',
      '</div>',
      '</dl>',
    '{{~}}'
  ].join(''));
  

  //获取消息列表
  $.ajax({
    url:Setting.apiRoot1 + '/queryDebtInfo.p2p',
    type:"post",
    dataType:'json',
    data:{
      type:1

    }
  }).done(function(res){
      if(res.code==1){
    	  var data = res.data;
    	  $tabcon.html(setListData(data));

    	  $hadShare.text(Common.comdify(hadShare));
    	  $recordCount.text(res.recordCount);
      }else{
    	  alert(res.message);
          return false;
      }

  }).fail(function(){
    alert('网络链接失败');
    return false
  });

}
  
  
});
