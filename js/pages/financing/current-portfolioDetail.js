/*
* @Author: User
* @Date:   2016-06-13 15:47:14
* @Last Modified by:   User
* @Last Modified time: 2016-09-20 16:57:14
*/

$(function(){
    
var $tabcon       = $('.current-portfolioDetailList');
var $tabcon2    = $('.purposeCode');


//  var userId = sessionStorage.getItem('uid');
//
//  if(!userId){
//    Common.toLogin();
//    return false;
//  }
var param = Common.getParam();  
var purposeCode = param.code;
var displayTitle=param.displayTitle;
if (displayTitle==0) {
    $('.purposeCode').hide();
}
var temp;
if(purposeCode==1){
  temp = '购车详情';
}else if(purposeCode==2){
  temp = '扩大经营详情';
}else if(purposeCode==3){
  temp = '备货详情';
}else if(purposeCode==4){
  temp = '购设备详情';
}else if(purposeCode==5){
  temp = '个人资金周转详情';
}else if(purposeCode==6){
  temp = '企业资金周转详情';
}else if(purposeCode==7){
  temp = '还债详情';
}else if(purposeCode==8){
  temp = '企业工人发工资详情';
}else if(purposeCode==9){
  temp = '其他个人消费详情';
}else if(purposeCode==10){
  temp = '购买原材料详情';
}else if(purposeCode==11){
  temp = '购买机器设备装修厂房等详情';
}else if(purposeCode==12){
  temp = '购房详情';
}else if(purposeCode==13){
  temp = '新公司开业投资详情';
}else if(purposeCode==14){
  temp = '购家电详情';
}else if(purposeCode==15){
  temp = '教育培训详情';
}else if(purposeCode==16){
  temp = '综合消费详情';
}else if(purposeCode==17){
  temp = '结婚详情';
}else if(purposeCode==18){
  temp = '装修详情';
}else if(purposeCode==19){
  temp = '做生意详情';
}else if(purposeCode==20){
  temp = '创业详情';
}else if(purposeCode==21){
  temp = '小微信贷详情';
}else if(purposeCode==22){
  temp = '资产管理计划01资产详情';
}else if(purposeCode==23){
  temp = '资产管理计划02资产详情';
}else if(purposeCode==24){
  temp = '资产管理计划03资产详情';
}else if(purposeCode==25){
  temp = '医疗';
}else if(purposeCode==26){
  temp = '其他';
}else if(purposeCode==27){
  temp = '购物';
}else if(purposeCode==28){
  temp = '旅游';
}

document.title = temp;
var setListData2 = doT.template([
    '<dl >',
  //'<div class="caption">'+temp+'<a href="../../pages/financing/current-portfolio.html" class="back"></a>',
  // '<div class="caption">'+temp+'<a href="../../pages/financing/current-portfolio.html?jumpNo='+param.jumpNo+'" class="back"></a>',
  //'<div class="caption">'+temp+'<a href="../../pages/financing/currentDetail.html" class="back"></a>',
  //'</div>',
     '</dl>'
  ].join(''));


  //红包模板
  var setListData = doT.template([
    '{{~it :item:index}}',
    '<dl >',
    '<div class="item">',
      '<div class="title">',
          '<div class="user">{{=item.loanContractNo}}', '</div>',
      '借款人:<i  > {{=item.loanName}}</i>',    
      '<i class="money"><span>借款金额</span>{{=item.loanAmount}}元</i>',
      '</div>',
      '</div>',
      '</dl>',
    '{{~}}'
  ].join(''));
  
  

  //获取消息列表
  $.ajax({
    url:Setting.apiRoot1 + '/queryDebtDetailByProdType.p2p?pageNum=1&pageSize=20',
    type:"post",
    dataType:'json',
    data:{
      type:1,
      purposeCode: purposeCode
    }
  }).done(function(res){
      if(res.code==1){
        var data = res.data;
      $tabcon2.html(setListData2());
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
