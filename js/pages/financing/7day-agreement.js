/*
* @Author: User
* @Date:   2016-06-15 18:47:15
* @Last Modified by:   User
* @Last Modified time: 2016-06-21 11:39:21
*/

$(function(){
  var $name= $('.name'); //名
  var $cardnum    = $('.cardnum');//身份证
  var $phonenum       = $('.phonenum'); //手机

  var param = Common.getParam();
	  name = param.uName;
	  phoneNum = param.uMobile;
	  cardNum = param.uSFZ;
       
       $name.html(name);
       $phonenum.html(phoneNum);
       $cardnum.html(cardNum);
  
});