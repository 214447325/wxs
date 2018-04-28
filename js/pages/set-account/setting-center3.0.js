/*
* @Author: User
* @Date:   2016-09-12 10:00:52
* @Last Modified by:   User
* @Last Modified time: 2016-09-12 11:03:03
*/
$(function(){
  var $win = $(window);
  var $body = $('body');
  var uid = sessionStorage.getItem("uid");

  var code = sessionStorage.getItem('ucode');//自己的推荐码
  var relation = sessionStorage.getItem('relation');//1是绑定  0是没有绑定
  alert(code);
  alert(relation);

  $body.on('click', '.Sign_out', function(event) {
    sessionStorage.clear() ;
    window.location.href=Setting.staticRoot +'/pages/my-account/myAccount.html';
  });

});
