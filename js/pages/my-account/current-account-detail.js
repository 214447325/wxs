/**
 * 7天乐详情 currentad.js
 * @author zyx 
 * @return {[type]}       [description]
 */

$(function(){
   var $earnings_detail = $('.earnings-detail');
   var $tag             = $('.currentList',$earnings_detail);
   var $table_box       = $('.table-box',$earnings_detail);
   var year             = new Date().getFullYear();
   var month            = new Date().getMonth() + 1;
   var day              = new Date().getDate();
   var userId           = sessionStorage.getItem('uid');
   var hash             = location.hash.replace('#','');
   if(!userId){
     Common.toLogin();
     return false;
   }
  
   var type ='1';// $(this).data('type');
   var dateType = '1';
   var pageNum = 1;
   var pageSize = 30;
   
   $('.navList').on('click',function(){
	  
     var index = $(this).index();
    
     /*组装请求类型参数*/
     $tag.removeClass('active').eq(index).addClass('active');
    
      $.ajax({
         url: Setting.apiRoot1 + '/u/queryCurrentList.p2p',
         type: 'post',
         dataType: 'json',
         data: {
           userId : userId,
           financeDetailType: type,
           dateType:dateType,
           pageNum:pageNum,
           pageSize:pageSize,
           loginToken:sessionStorage.getItem('loginToken')
         }
       }).done(function(res){
    	  
         Common.ajaxDataFilter(res,function(){
           if(res.code == -1){
             alert('查询失败');
             return false;
           }
           var _sort = res.data.sort(function(a,b){
             return new Date(b.dateStr).getTime() - new Date(a.dateStr).getTime();
           });
           $table_box.html(order_list(res.data));
          
          
         })
       }).fail(function(){
         alert('网络链接失败');
       });
   }).eq(hash).click();

   var order_list = doT.template([
         " <table width=\"100%\" cellspacing=\"0\">",
//             " <tr>",
//                  "<th>类型</th>",
//               /*   "<th>周周涨在投金额</th>",*/
//                  "<th>金额（元）</th>",
//             "</tr>",
             "{{~it :item:index}}",
             "<tr>",
                  "<td align='left' width='50%'>{{=item.title}}<br>{{=item.dateStr}} </td>",
                  "{{? item.type}}",
                    /* "<td>{{=item.amount}} </td>",
                  "{{?? !item.type}}",
                     "<td>—</td>",*/
                  "{{?}}",
                  "{{? item.interestAmount}}",
                     "<td >{{=item.interestAmount}}</td>",
                  "{{?? !item.interestAmount}}",
                     "<td>0.00</td>",
                  "{{?}}",
               "</tr>",
               "{{~}}",
         " </table>"
     ].join(''));

   $(document).ready(function(){
		
		$('.navMenu').find("li").on('click', function () {
           var currentid = $(this).attr("namevalue");
           var openclose = $(this).find(".nmIcon").attr("iconvalue");
       
           if (openclose == "open"){//现在是打开，下一步是关闭
           	$(this).find(".nmIcon").attr("iconvalue", "close").find(".iconfont").html("&#xe600;");
           	$(this).find(".nmIcon").css("background-image","url(../../../images/pages/sevenday/down.png)");
           	$(".navList").find("ul[namevalue='"+currentid+"']").hide();
           	$(".navList").find("li.current").removeClass("current");
           }else{
           	var firstObj = $(".navList").find("ul[namevalue='"+currentid+"'] li:first-child");
           	var textvalue = $(firstObj).find(".nlTitle").text();

           	$(this).find(".nmIcon").attr("iconvalue", "open").find(".iconfont").html("&#xe601;");
           	$(this).siblings().find(".nmIcon").attr("iconvalue", "close").find(".iconfont").html("&#xe600;");
           	$(this).find(".nmIcon").css("background-image","url(../../../images/pages/sevenday/up.png)");

           	$(".navList").find("ul[namevalue='"+currentid+"']").show().siblings().hide();
           	$(".navList").find("li.current").removeClass("current");
           	
           	$(this).find(".nmTitle").text(textvalue);
           	$(firstObj).addClass("current");

//           	$(".contentBody").html("menu:" + currentid + ",item:" + textvalue + ",对应链接");
           }
           
       });
		
		$('.navList').find("li").on('click', function () {
           var currentid = $(this).parent().attr("namevalue");
           var textvalue = $(this).find(".nlTitle").text();
           $(this).find(".nlIcon").removeClass('nlIcon').addClass('nlIconafter');
           $(this).siblings().find(".nlIconafter").removeClass('nlIconafter').addClass('nlIcon');
           
           $(".navList").find("li.current").removeClass("current");
           $(this).addClass("current");
           var tarObj = $(".navMenu").find("li[namevalue='"+currentid+"']");
           $(tarObj).find(".nmTitle").text(textvalue);

//           $(".contentBody").html("menu:" + currentid + ",item:" + textvalue + ",对应链接");
           if(textvalue=='购买'){
        	   type=1;
           }else if(textvalue=='赎回'){
        	   type=2;
           }else if(textvalue=='收益'){
        	   type=3;
           }else if(textvalue=='一周内'){
        	   dateType=1;
           }else if(textvalue=='一月内'){
        	   dateType=2;
           }
           
           $('.navMenu').find(".nmIcon").attr("iconvalue", "open")
           $('.navMenu').find("li").trigger('click');
          
       });
       
       
	});
   
});
