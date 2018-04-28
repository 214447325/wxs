//周周涨收益明细
$(function(){
  var $earnings_detail = $('.earnings-detail');
  var $tag             = $('.tag',$earnings_detail);
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
  $tag.on('click',function(){
    var index = $(this).index();
    var type = $(this).data('type');
    $tag.removeClass('active').eq(index).addClass('active');
     $.ajax({
        url: Setting.apiRoot1 + '/u/queryMyCurrentIncomeList.p2p',
        type: 'post',
        dataType: 'json',
        data: {
          userId : userId,
          type: type,
          endDate: year + '/' + month + '/' + day,
          pageSize: 1000,
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
          $table_box.html(order_list(_sort));
        })
      }).fail(function(){
        alert('网络链接失败');
      });
  }).eq(hash).click();

  var order_list = doT.template([
        " <table width=\"100%\" cellspacing=\"0\">",
            " <tr>",
                 "<th>日期</th>",
              /*   "<th>周周涨在投金额</th>",*/
                 "<th>收益（元）</th>",
            "</tr>",
            "{{~it :item:index}}",
            "<tr>",
                 "<td>{{=item.dateStr}} </td>",
                 "{{? item.type}}",
                   /* "<td>{{=item.amount}} </td>",
                 "{{?? !item.type}}",
                    "<td>—</td>",*/
                 "{{?}}",
                 "{{? item.interestAmount}}",
                    "<td>{{=item.interestAmount}}</td>",
                 "{{?? !item.interestAmount}}",
                    "<td>0.00</td>",
                 "{{?}}",
              "</tr>",
              "{{~}}",
        " </table>"
    ].join(''));

  function getData(){
    
  }
});
