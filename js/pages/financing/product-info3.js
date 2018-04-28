/*
* @Author: User
* @Date:   2016-06-27 14:52:22
* @Last Modified by:   User
* @Last Modified time: 2016-06-27 14:52:40
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
