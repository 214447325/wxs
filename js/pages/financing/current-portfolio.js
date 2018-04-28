/*
* @Author: User
* @Date:   2016-06-13 14:09:05
* @Last Modified by:   User
* @Last Modified time: 2016-09-18 11:23:19
*/

$(function(){
    
  var $tabcon       = $('.current-portfolioList');
  var $tabcon2    = $('.captionNav');


//  var userId = sessionStorage.getItem('uid');
//
//  if(!userId){
//    Common.toLogin();
//    return false;
//  }

  var param = Common.getParam();  
  var hadShare = param.hadShare;
  var jumpNo = param.jumpNo;
  var displayTitle=param.displayTitle;
  //红包模板
  if (displayTitle==0) {
  var setListData = doT.template([
    '{{~it :item:index}}',
    '<dl >',

    '<div class="item">',
	    //'<a class="title" href="current-portfolioDetail.html?type=1&code={{=item.purposeCode}}">{{=item.loanPurpose}}',
         '<a class="title" href="current-portfolioDetail.html?type=1&code={{=item.purposeCode}}&jumpNo='+jumpNo+'&displayTitle='+displayTitle+'">{{=item.loanPurpose}}',
			'<i  >({{=item.count}}个)</i>', 
      '<img src="../../images/pages/my-account3.0/regularDetailLink.png" alt="" style="float: right;width: 0.181rem;height: 0.328rem;margin-top:0.49rem;">',  
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
         '<a class="title" href="current-portfolioDetail.html?type=1&code={{=item.purposeCode}}&jumpNo='+jumpNo+'">{{=item.loanPurpose}}',
      '<i  >({{=item.count}}个)</i>',  
       '<img src="../../images/pages/my-account3.0/regularDetailLink.png" alt="" style="float: right;width: 0.181rem;height: 0.328rem;margin-top:0.49rem;">',    
      '<i class="percent">占比:{{=item.eachPercent}}</i>',
      '</a>',
      '</div>',
      '</dl>',
    '{{~}}'
  ].join(''));  
}

  if(param.jumpNo==2){
  var setListData2 = doT.template([  
  '<div class="caption">',
  '<a href="../../pages/financing/current.html" class="back"></a>七天乐资产组合',
  '</div>'
  ].join(''));
  }else{
    var setListData2 = doT.template([  
  '<div class="caption">',
  '<a href="../../pages/index.html" class="back"></a>七天乐资产组合',
  '</div>'
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
      type:1
    }
  }).done(function(res){
      if(res.code==1){
    	  var data = res.data;
    	  $tabcon.html(setListData(data));
       $tabcon2.html(setListData2());

      }else{
    	  alert(res.message);
          return false;
      }

  }).fail(function(){
    alert('网络链接失败');
    return false
  });
  
  
});
