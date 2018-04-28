/**
 * novice.js
 * @author tangsj
 * @return {[type]}     [description]
 */
$(function(){
	
  /**
   * 微信进来的访问判断，不是跳转到官网下载页
   * 20160226 zyx 
   */
  var isWeiXin = Common.isWeiXin();
  
  var $novice = $('.novice');
  var userId  = sessionStorage.getItem('uid');
  /**
   * 加载新手标数据
   * @return {[type]} [description]
   */
  !function(){

    var $title = $('.title');
    var $min = $('span.min');
    var $max = $('span.max');
    var $tag = $('.tag span');
    var $amount = $('.amount');
    var $info = $('.info');
    var $progerss = $('.progerss');
    var $buyBtn = $('.buy-btn');
    var buy_link = '';
    var data;

    /**
     * 设置页面数据
     */
    function setData(){
      $title.text(data.title);
      $min.text(data.minRate.toFixed(2));
      //$max.text(data.maxRate);
      $tag.text(parseFloat(data.progress * 100).toFixed(2));
      $amount.text(Common.comdify(data.amount));
      //$info.attr('href', 'product-info.html?pid=' + data.productId);
      $info.attr('href', Setting.staticRoot +'/pages/product3_detail.html');
      var _value =  data.progress.toFixed(2);
      if(_value > 0.01){
        _value -= 0.01;
      }
      
      $progerss.on('click',  function(){
    	    
        	//window.location.href = 'product-info.html?pid=' + data.productId;
    	  window.location.href = Setting.staticRoot +'/pages/product3_detail.html';
        });
      $('.outer-circle').circleProgress({
        value: _value,
        startAngle: -Math.PI / 4 * 2,
        size: 290 * lib.flexible.dpr,
        lineCap: 'round',
        fill: {
          gradient: ["#ffd4c4", "#fc7b75"]
        }
      });
    }

    Common.queryProductInfo(2,1, function(res){
      if(res.code != 1){
        alert(res.message);
        return false;
      }
      data = res.data[0];
      setData();
    });
    // 检查是否买过新手标
    function checkBuy(){
      $.ajax({
         url: Setting.apiRoot1 + '/u/investPurchaseGoto.p2p',
         type: 'post',
         dataType: 'json',
         data: {
           userId : userId,
           loanId: data.productId,
           loginToken:sessionStorage.getItem('loginToken')
         }
       }).done(function(res){
        Common.ajaxDataFilter(res,function(res){
          if(res.code == -2){
            alert(res.message);
            $buyBtn.addClass('btn-gray disabled');
            return false;
          }else{
            buy_link = 'buy.html?' + $.param({
              pid: data.productId,
              pname: data.title,
              pmount: data.amount,
              minInterest: data.minInterest,
              minInvestAmount: data.minInvestAmount,
              maxInvestAmount: data.maxInvestAmount,
              type:'novice'
            });

            window.location.href = buy_link;
          }
        });
       }).fail(function(){
         alert('网络链接失败');
       });
    }

   $buyBtn.on('click',function(){
      var $this = $(this);
      if($this.hasClass('disabled')){
        return false;
      }

      if(!userId){
        confirm('请先登录！', function(){
          window.location.href = Setting.staticRoot + '/pages/account/login.html?from=' + encodeURIComponent(location.href);
        });
        return false;
      }

      Common.checkRealName(userId,function(){
        //window.location.href = buy_link;
        checkBuy();
      })
    })
  }();
});
