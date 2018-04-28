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
    var spEvents = 0;
  var buyProduct;
  var _buyProduct;
  var userId = sessionStorage.getItem('uid');
  var swiperIndex = sessionStorage.getItem('swiperIndex');
  var formData;



  var $regular = $('.regular');
  var $circles = $('.circles', $regular);
  var $buyNow = $('.buy-now', $regular);

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
              '<div class="inner">',
                '{{?item.cycle == 4}}',
                '<p class="month">{{=item.cycle}}</p>',
                '<div class="content">',
                  '<p style="font-size: 0.375rem;line-height: 0.1rem;">{{=item.cycle}}{{=item.cycleTypeDesc}}</p>',
                  '{{?item.minRate <= 9.5}}',
                     '<p><span style="font-size:0.435rem;">年化{{=item.minRate.toFixed(2)}}%</span></p>',
                    '{{??item.minRate > 9.5}}',
                     '<p><span style="font-size:0.435rem;">年化9.50% + {{=(item.minRate - 9.5).toFixed(2)}}%</span></p>',
                     '{{?}}',

                    '{{??item.cycle == 8}}',
                    '<p class="month">{{=item.cycle}}</p>',
                    '<div class="content">',
                    '<p style="font-size: 0.375rem;line-height: 0rem">{{=item.cycle}}{{=item.cycleTypeDesc}}</p>',
                    '{{?item.minRate <= 10}}',
                    '<p><span style="font-size:0.435rem;">年化{{=item.minRate.toFixed(2)}}%</span></p>',
                    '{{??item.minRate > 10}}',
                    '<p><span style="font-size:0.435rem;">年化10.00% + {{=(item.minRate - 10).toFixed(2)}}%</span></p>',
                    '{{?}}',

                    '{{??item.cycle == 12}}',
                    '<p class="month">{{=item.cycle}}</p>',
                    '<div class="content">',
                    '<p style="font-size: 0.375rem;line-height: 0rem">{{=item.cycle}}{{=item.cycleTypeDesc}}</p>',
                    '{{?item.minRate <= 10.5}}',
                    '<p><span style="font-size:0.435rem;">年化{{=item.minRate.toFixed(2)}}%</span></p>',
                    '{{??item.minRate > 10.5}}',
                    '<p><span style="font-size:0.435rem;">年化10.50% + {{=(item.minRate - 10.5).toFixed(2)}}%</span></p>',
                    '{{?}}',

                    '{{??item.cycle == 24}}',
                    '<p class="month">{{=item.cycle}}</p>',
                    '<div class="content">',
                    '<p style="font-size: 0.375rem;line-height: 0rem">{{=item.cycle}}{{=item.cycleTypeDesc}}</p>',
                    '<p><span style="font-size:0.375rem;">投资立送</span></p>',
                    '<p><span style="font-size:0.375rem;">iPhone7系列</span></p>',
                    //'{{?item.minRate <= 12.5}}',
                    //'<p><span style="font-size:0.435rem;">年化{{=item.minRate.toFixed(2)}}%</span></p>',
                    //'{{??item.minRate > 12.5}}',
                    //'<p><span style="font-size:0.435rem;">年化12.50% + {{=(item.minRate - 12.5).toFixed(2)}}%</span></p>',
                    //'{{?}}',


                    '{{??item.cycle == 48}}',
                    '<p class="month">{{=item.cycle}}</p>',
                    '<div class="content">',
                    '<p style="font-size: 0.375rem;line-height: 0rem">{{=item.cycle}}{{=item.cycleTypeDesc}}</p>',
                    '<p><span style="font-size:0.375rem;">投资立送</span></p>',
                    '<p><span style="font-size:0.375rem;">iPhone7系列</span></p>',
                    //'{{?item.minRate <= 13.5}}',
                    //'<p><span style="font-size:0.435rem;">年化{{=item.minRate.toFixed(2)}}%</span></p>',
                    //'{{??item.minRate > 13.5}}',
                    //'<p><span style="font-size:0.435rem;">年化13.50% + {{=(item.minRate - 13.5).toFixed(2)}}%</span></p>',
                    //'{{?}}',
                    '{{?}}',

                  '<p class="line"></p>',
                  '<a href="javascript:;">产品详情&gt;</a>',
                '</div>',
              '</div>',
            '</div>',
          '</div>',
          '{{~}}',
        '</div>',
      '</div>'
    ].join(''));
    
      $circles.on('click',  function(){
          if(spEvents == 1) {
              window.location.href = "../product4_detail.html";
          } else {
              window.location.href = "../product2_detail.html";
          }
      });

    Common.queryProductInfo(3,1, function(res){
      if(res.code != 1){
        alert(res.message);
        return false;
      }
      var data = res.data;
        formData = data;
      $.each(data, function(index, item){
        if(item.cycleType==1){
            item.cycleTypeDesc= '天';
          }else if(item.cycleType==2){
            item.cycleTypeDesc= '月';
          }else if(item.cycleType==3){
            item.cycleTypeDesc= '年';
          }else if(item.cycleType==4){
            item.cycleTypeDesc= '周';
          }

        var infoParam = {
          pid: item.productId,
          pname: item.title + "(" + item.cycle + item.cycleTypeDesc +")",
          pmount: item.amount,
          minInterest: item.minInterest,
          minInvestAmount: item.minInvestAmount,
          maxInvestAmount: item.maxInvestAmount,
          yearRate : item.minRate,
          cycle : item.cycle,
          cycleType : item.cycleType
        }
        if(item.timeLine){
          infoParam.timeLine = encodeURIComponent(item.timeLine);
        }

        item.buyParam = $.param(infoParam);

      });


      $circles.html(_html({
        list: data,
        typeText: typeText
      }));

  	  //zyx可以跳转哪个定期产品
	  var initpos = 2;
	  var param = Common.getParam();
	  var timeType = param.timeType;
	  if(timeType==44){
		  initpos = 0;
	  }
	  
      var swiper = new Swiper('.swiper-container', {
          slidesPerView: 3,
          initialSlide: initpos,
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
        spEvents = data[index].spEvents;
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
              if(spEvents == 1) {
                  window.location.href =  Setting.staticRoot + '/pages/financing/buy1.html?'+"jumpId=1&" + buyProduct + '&num= '+res.data.num;
              } else {
                  window.location.href =  Setting.staticRoot + '/pages/financing/buy.html?'+"jumpId=1&" + buyProduct + '&num= '+res.data.num;
              }

            //window.location.href =  Setting.staticRoot + '/pages/financing/buy1.html?'+"jumpId=1&" + buyProduct + '&num= '+res.data.num;
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

  });
});
