/*
* @Author: User
* @Date:   2016-06-27 10:44:26
* @Last Modified by:   User
* @Last Modified time: 2016-09-18 11:38:20
*/

$(function(){
    
  var $tabcon = $('.float-portfolioList');
  var param = Common.getParam();
  var loanId = param.pid;
  var displayTitle=param.displayTitle;

//  var userId = sessionStorage.getItem('uid');
//
//  if(!userId){
//    Common.toLogin();
//    return false;
//  }

  //红包模板
  if (displayTitle==0) {
  var setListData = doT.template([
    '{{~it :item:index}}',
    '<dl >',

    '<div class="item">',
	    // '<a class="title" href="float-portfolioDetail.html?type=4&code={{=item.purposeCode}}">{{=item.loanPurpose}}',
         '<a class="title" href="float-portfolioDetail.html?type=4&code={{=item.purposeCode}}&loanId='+loanId+'&displayTitle='+displayTitle+'">{{=item.loanPurpose}}',
      '<img src="../../images/pages/my-account3.0/regularDetailLink.png" alt="" style="float: right;width: 0.181rem;height: 0.328rem;margin-top:0.49rem;">', 
      '<i  >({{=item.count}}个)</i>',  
			'<i class="percent">占比:{{=item.eachPercent}}</i>',
	    '</a>',
      '</div>',
      '</dl>',
    '{{~}}'
  ].join(''));
}else{
  var setListData = doT.template([
    '{{~it :item:index}}',
    '<dl >',

    '<div class="item">',
      // '<a class="title" href="float-portfolioDetail.html?type=4&code={{=item.purposeCode}}">{{=item.loanPurpose}}',
         '<a class="title" href="float-portfolioDetail.html?type=4&code={{=item.purposeCode}}&loanId='+loanId+'">{{=item.loanPurpose}}',
      '<i  >({{=item.count}}个)</i>',    
      '<img src="../../images/pages/my-account3.0/regularDetailLink.png" alt="" style="float: right;width: 0.181rem;height: 0.328rem;margin-top:0.49rem;">', 
      '<i class="percent">占比:{{=item.eachPercent}}</i>',
      '</a>',
      '</div>',
      '</dl>',
    '{{~}}'
  ].join(''));  
}
  

//alert(loanId)
  //获取消息列表
  $.ajax({
    url:Setting.apiRoot1 + '/queryDebtInfoForFloatByLoanId.p2p',
    type:"post",
    dataType:'json',
    data:{
      type:4,
      loanId:loanId
    }
  }).done(function(res){
      if(res.code==1){
    	  var data = res.data;
    	  $tabcon.html(setListData(data));
      }else{
    	  alert(res.message);
          return false;
      }

  }).fail(function(){
    alert('网络链接失败');
    return false
  });
  
  
});