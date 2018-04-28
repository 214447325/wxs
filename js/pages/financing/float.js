/**
 * regular.js
 * @author tangsj
 * @return {[type]}       [description]
 */
$(function(){
	
  /**
   * 微信进来的访问判断，不是跳转到官网下载页
   * 20160226 zyx 
   */
  var isWeiXin = Common.isWeiXin();
  
  var buyProduct;
  var _buyProduct;
  var userId = sessionStorage.getItem('uid');
  var swiperIndex = sessionStorage.getItem('swiperIndex');

  var $regular = $('.regular');
  var $circles = $('.circles', $regular);
  var $buyNow = $('.buy-now', $regular);
  var $maomi=$('.maomi', $regular);
  var lineId;
  /**
   * 加载定期产品数据
   * @return {[type]} [description]
   */
  !function(){
    var typeText = ['年', '月', '日','周'];

    var $title = $('.title');
    var $tag = $('.tag span');
    var $amount = $('.amount');

    var _html = doT.template([
      '<div class="swiper-container">',
        '<div class="swiper-wrapper">',
          '{{~it.list :item:index}}',
          '<div class="swiper-slide">',
            '<div class="circle">',
             '<div class="circle-empty">',
              '<div class="inner">',
                '<p class="month">{{=item.cycle}}</p>',
                '<div class="content">',
                  '<p style="font-size: 0.375rem;">{{=item.cycle}}{{=item.cycleTypeDesc}}</p>',
                  '<p  class="annualyield" style="font-size:0.35rem">&nbsp; 年化</p>',
                  '<span class="prev" style="font-size:0.6rem;">{{=item.prevRate}}</span>',
                  '<a href="../../pages/float_detail.html">产品详情&gt;</a>',
                '</div>',
              '</div>',
             '</div>',
            '</div>',
          '</div>',
          '{{~}}',
        '</div>',
      '</div>'
    ].join(''));
    
//    $circles.on('click',  function(){
//        
//      	window.location.href = "product-info.html?pid={{=item.productId}}";
//      });

    Common.queryProductInfo(4,1, function(res){
      if(res.code != 1){
        //alert(res.message);
        return false;
      }
      var data = res.data;

      $.each(data, function(index, item){
        var infoParam = {
          pid: item.productId,
          pname: item.title,
          pmount: item.amount,
          minInterest: item.minInterest,
          minInvestAmount: item.minInvestAmount,
          maxInvestAmount: item.maxInvestAmount,
        }
        if(item.timeLine){
          infoParam.timeLine = encodeURIComponent(item.timeLine);
        }
        if(item.cycleType==1){
        	item.cycleTypeDesc= '天';
        }else if(item.cycleType==2){
        	item.cycleTypeDesc= '月';
        }else if(item.cycleType==3){
        	item.cycleTypeDesc= '年';
        }else if(item.cycleType==4){
        	item.cycleTypeDesc= '周';
        }
        // console.log(infoParam)
        item.buyParam = $.param(infoParam);
        
        item.prevRate= "8%~" + item.minRate +"%";
//        alert(item.minRate);
      });

      $circles.html(_html({
        list: data,
        typeText: typeText
      }));

      var swiper = new Swiper('.swiper-container', {
          slidesPerView: 3,
          initialSlide: 1,
          centeredSlides: true,
          spaceBetween: 0,
          onInit: function(swiper){
            //console.log(swiper.activeIndex);
            setActiveData(swiper.activeIndex);
            //swiper.slideTo(swiperIndex)
          },
          onSlideChangeEnd: function(swiper){
            //console.log(swiper.activeIndex);
            setActiveData(swiper.activeIndex);
          }
      });
      /**
       * 设置选中数据
       */
      function setActiveData(index){
        $title.text(data[index].title);
        $tag.text(parseFloat(data[index].progress * 100).toFixed(2));
        $amount.text(Common.comdify(data[index].amount));
        buyProduct = data[index].buyParam;
        sessionStorage.setItem('swiperIndex',index);
        _buyProduct = data[index];
        $buyNow.attr('type',1);
        if(_buyProduct.buttonStatus == 1){
          $buyNow.text('即将开启').removeClass('disabled btn-gray').addClass('btn-default');
        }else if(_buyProduct.buttonStatus == 2){
          $buyNow.text('立即抢购').removeClass('disabled btn-gray').addClass('btn-default');
        }else if(_buyProduct.buttonStatus == 3){
          buyProduct += '&yuyue=true';
          $buyNow.addClass('disabled btn-gray').removeClass('btn-default').text('敬请期待').attr('type',3);
        }
      }
    });
  }();

  $buyNow.on('click', function(){

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
      $this.addClass('disabled');
      $.ajax({
        url: Setting.apiRoot1 + '/u/investPurchaseGoto.p2p',
        type: 'post',
        dataType: 'json',
        data: {
          userId: userId,
          loanId: _buyProduct.productId,
          loginToken:sessionStorage.getItem('loginToken')
        }
      }).done(function(res){
        Common.ajaxDataFilter(res,function(){
          $this.removeClass('disabled');
          if(res.code == -1){
            alert(res.message);
          }else if(_buyProduct.buttonStatus == 3){
            // 不进行任何操作
          }else{
        	var weightValue = res.data.weightValue;
        	var balanceAccount = res.data.balanceAccount;
            window.location.href =  Setting.staticRoot + '/pages/financing/floatbuy.html?' + buyProduct + '&weightValue= '+weightValue+"&balanceAccount="+balanceAccount;
          }
        })
      }).fail(function(){
        alert('服务器异常');
        $this.removeClass('disabled');
      });
      if($(this).attr('type')  == 3){
        return false;
      }
    })

    // window.location.href = 'buy.html?' + buyProduct;
  });


$.ajax({
    url:Setting.apiRoot1 + '/queryProdInfo.p2p',
    type:"post",
    dataType:'json',
    data:{
     loanType:1,
     type:4
    }
  }).done(function(res){
      if(res.code==1){
var data=res.data;
// alert(data[0].lineId);
lineId=data[0].lineId;
// alert(lineId);


      }else{
        alert(res.message);
          return false;
      }

  }).fail(function(){
    alert('网络链接失败');
    return false
  });

  $maomi.on('click', function(){
    window.location.href = '../financing/float-portfolio.html?lineId='+lineId;
  })

});
