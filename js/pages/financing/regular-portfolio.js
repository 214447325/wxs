/*
* @Author: User
* @Date:   2016-06-13 18:19:58
* @Last Modified by:   User
* @Last Modified time: 2016-10-21 17:17:35
*/

$(function(){
    
  var $tabcon       = $('.regular-portfolioList');
  var param = Common.getParam();  
  var displayTitle=sessionStorage.getItem('displayTitle');
  var cycle=param.cycle;
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
	    '<a class="title" href="regular-portfolioDetail.html?type=3&code={{=item.purposeCode}}&displayTitle='+displayTitle+'&cycle='+cycle+'">{{=item.loanPurpose}}',
			'<i  >({{=item.count}}个)</i>', 
      '<img src="../../images/pages/my-account3.0/regularDetailLink.png" alt="" style="float: right;width: 0.181rem;height: 0.328rem;margin-top:0.49rem;" />',
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
      '<a class="title" href="regular-portfolioDetail.html?type=3&code={{=item.purposeCode}}&cycle='+cycle+'">{{=item.loanPurpose}}',
      '<i  >({{=item.count}}个)</i>',    
      '<img src="../../images/pages/my-account3.0/regularDetailLink.png" alt="" style="float: right;width: 0.181rem;height: 0.328rem;margin-top:0.49rem;" />',
      '<i class="percent">占比:{{=item.eachPercent}}</i>',
      '</a>',
      '</div>',
      '</dl>',
    '{{~}}'
  ].join(''));  
}
// function GetQueryString(name)
// {
//      var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
//      var r = window.location.search.substr(1).match(reg);
//      if(r!=null)return  unescape(r[2]); return null;var jumpNo = GetQueryString("jumpNo");
// alert(GetQueryString( jumpNo));
  
// }
 
  //获取消息列表
  $.ajax({
    url:Setting.apiRoot1 + '/queryDebtInfo.p2p',
    type:"post",
    dataType:'json',
    data:{
      type:3
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