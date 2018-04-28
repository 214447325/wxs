/**
 * product-info.js
 * @author tangsj
 * @return {[type]}       [description]
 */
$(function(){

var $productInfo = $('.product-info');
var $info = $('.info');
var $safemode = $('.safemode');

    // Event

    
    $info.removeClass('hide');
    $safemode.addClass('hide');
    $productInfo.on('click', '.tab-info a', function(){
      var $this = $(this);
      $this.addClass('active').siblings('.active').removeClass('active');
      var target= $this.data('target');
      $('.' + target).removeClass('hide').siblings('.block-items').addClass('hide');
    });
  });
