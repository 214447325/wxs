/**
 * transaction-records.js
 * @param  {Object} ){               var data  var _data [description]
 * @return {[type]}     [description]
 */
$(function(){
  var recordsData;
  var _data = {};
  var uid = sessionStorage.getItem("uid");
  var $dataTable = $('.data-table');
  var $items = $('.nav-select');

  /**
   * [检测是否登录]
   * @param  {[type]} !uid [description]
   * @return {[type]}      [description]
   */
  if (!uid) {
    Common.toLogin();
    return false;
  }

  /**
   * 我的交易记录查询接口
   * @param  {[type]}   txntype  [交易类型 0：全部 1：购买 2：充值 3：赎回 4：提现]
   * @param  {Function} callback [回调]
   * @return {[type]}            [description]
   * 20数量
   */
  var pageSizes=10;
  function myTradeRecord(txntype,cut,adds) {
	  if(cut=='cut'){
		  pageSizes = 10;
	  }else{
		  pageSizes = pageSizes + adds;
	  }
    _data ={
      userId:uid,
      txntype:txntype,
      pageNum:'',
      pageSize:pageSizes,
      loginToken:sessionStorage.getItem('loginToken')
    };
    
    $.ajax({
      url: Setting.apiRoot1+'/u/MyTradeRecord.p2p',
      type: 'post',
      dataType: 'json',
      data: _data,
      beforeSend:function() {
        $dataTable.html('<div class="tc pt20">数据获取中...</div>')
      }
    })
    .done(function(data) {
      recordsData = data
      Common.ajaxDataFilter(data.code,function(){
        if (!!recordsData.data) {
          for (var i = 0;i < recordsData.data.length;i++) {
            if(recordsData.data[i].title.indexOf('活期') > -1){
              recordsData.data[i].title = recordsData.data[i].title.replace('活期','周周涨');
            }
          }
          $dataTable.html(_html_city(recordsData.data))
        }else{
          $dataTable.html('<div class="tc pt20">暂无记录</div>')
        }
      })
    })
    .fail(function() {
      alert('网络链接失败');
    })
  }

  _html_city =  doT.template([
      '<table width="100%" cellspacing="0">',
        '{{~it :item:index}}',
        '<tr>',
          '<td align="left">',
            '{{? item.type == 1}}',
              '<span>{{=item.title}}</span>',
            '{{?? item.type == 2}}',
             '<span>充值</span>',
            '{{?? item.type == 3}}',
              '<span>赎回</span>',
            '{{??}}',
              '<span>提现</span>',
            '{{?}}',
            '<p>{{=item.dateStr}}</p>',
          '</td>',
          '<td align="right">',
            '{{? item.type == 1 || item.type == 4}}',
              '<span>-{{=item.amount.toFixed(2)}}</span>',
            '{{??}}',
              '<span>+{{=item.amount.toFixed(2)}}</span>',
            '{{?}}',
            '<p>可用余额：{{=item.useAmount.toFixed(2)}}</p>',
          '</td>',
          '<td align="right">',
            '{{? item.status == 10 }}',
              '<span>成功</span>',
            '{{?? item.status == 20}}',
              '<span class="yellowbg">处理中</span>',
            '{{??}}',  
              '<span class="redbg">失败</span>',
            '{{?}}',
          '</td>',
        '</tr>',
        '{{~}}',
      '</table>',
      '<div class="tc pt20  downLoad" id="load" style="font-size: 24px; cursor:pointer">加载更多</div>'
    ].join(''))

  // 全部
  myTradeRecord(0,'',0);
  var selectType=0;
  $items.on('click', '.item', function(event) {
    //console.log(recordsData.data);
    var _this = $(this)
    var _index = _this.index();
    selectType = _index;
    _this.addClass('active').siblings().removeClass('active');
    myTradeRecord(_index,'cut',0)
  });
  
  $("div").on('click', "#load", function(event) {
	    myTradeRecord(selectType,'',10)
  });
  
}); 