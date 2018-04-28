/**
 * current.js
 * @author tangsj
 * @return {[type]}       [description]
 */
$(function(){

  /**
   * 微信进来的访问判断，不是跳转到官网下载页
   * 20160226 zyx 
   */
  var isWeiXin = Common.isWeiXin();
	  
  var $current = $('.current');
  var userId  = sessionStorage.getItem('uid');


  /**
   * 加载周周涨数据
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
    var $maomi  = $('.maomi');
    var buy_link = '';
    
    /**
     * 设置页面数据
     * @param {json} data datasource
     * @param {[type]} data [description]
     */
    function setData(data){
      $title.text(data.title);
      $min.html(data.minRate.toString().replace(/(\d*)(\.\d*)$/, function($1, $2, $3){ return '<i>'+ $2 +'</i>' + $3 }));
      $max.html(data.maxRate.toString().replace(/(\d*)(\.\d*)$/, function($1, $2, $3){ return '<i>'+ $2 +'</i>' + $3 }));
      $tag.text(parseFloat(data.progress * 100).toFixed(2));
      $amount.text(Common.comdify(data.amount));
      $info.attr('href', 'product-info.html?pid=' + data.productId);
      // $maomi.attr('href', Setting.staticRoot+'/pages/financing/current-portfolio.html');
      $maomi.attr('href', Setting.staticRoot+'/pages/financing/current-portfolio.html?jumpNo=2');
      var _data = {
        pid: data.productId,
        pname: data.title,
        pmount: data.amount,
        minInterest: data.minInterest,
        minInvestAmount: data.minInvestAmount,
        maxInvestAmount: data.maxInvestAmount,
        current :1,
        type:'current'
      };

      if(data.buttonStatus == 1){
        $buyBtn.text('即将开启');
        buy_link = 'currentbuy.html?' + $.param(_data);//周周涨有自动续投
      }else if(data.buttonStatus == 2){
        $buyBtn.text('立即抢购');
        _data.timeLine = data.timeLine;
        buy_link = 'currentbuy.html?'+"jumpId=1&"+ $.param(_data);//周周涨有自动续投
      }else if(data.buttonStatus == 3){
        $buyBtn.text('敬请期待').addClass('disabled btn-gray').removeClass('btn-default');
        return false;
      }
      var _value =  data.progress.toFixed(2);
      if(_value > 0.01){
        _value -= 0.01;
      }
      
      
      $progerss.on('click',  function(){
    
      	window.location.href =  'product-info.html?pid=' + data.productId;
      });
      $('.outer-circle').circleProgress({
        value: _value,
        startAngle: -Math.PI / 4 * 2,
        size:290* lib.flexible.dpr,
        lineCap: 'round',
        fill: {
          gradient: ["#ffd4c4", "#fc7b75"]
        }
      });
    }
    
    
 

    Common.queryProductInfo(1,1, function(res){
      if(res.code != 1){
        alert(res.message);
        return false;
      }
      setData(res.data[0]);
    });

    // 进行实名认证
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
        window.location.href = buy_link;
      });
    })
  }();


});
