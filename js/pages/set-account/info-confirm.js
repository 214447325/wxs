/**
 * zyx 
 * 确认绑定
**/
$(function(){
	
  var param = Common.getParam();
  var $win = $(window);
  var $body = $('body');
  var uid = sessionStorage.getItem("uid");
  var loginToken = sessionStorage.getItem('loginToken');
  var $phone = $(".phone");
  var $name = $(".name");
  var $code = $(".code");
  
  var phone = param.phone;
  var name = param.name;
  var code = param.code;
  
  $phone.html(phone);
  $name.html(name);
  $code.html(code);
  
  if(!uid){
    Common.toLogin();
    return false;
  }

  
  /**
   * yaoqing
   */
  $body.on('click', '.next-btn', function(event) {
    var $this = $(this);
//      $this.addClass('disabled').html('实名认证中...');
    
      $.ajax({
        url: Setting.apiRoot1 + '/u/userBindInvite.p2p',
        type: 'post',
        dataType: 'json',
        data: {
        	userId:uid,
        	code:code,
        	loginToken:loginToken
        }
      })
      .done(function(res) {
    	  if(res.code==1){
    		  var param = {
    			  phone:res.data.phoneNum,
				  name:res.data.name,
				  code:code
	          };
    		  sessionStorage.setItem('relation', 1);
    		  alert("绑定成功");
              function  jumurl(){
            	  window.location.href = Setting.staticRoot+'/pages/my-account/setting/binding-success.html?'+ $.param(param);
              }
              setTimeout(jumurl,1000);
    	  }else{
    		  alert(res.message);
    	  }
      })
      .fail(function() {
        alert('网络链接失败');
        $this.removeClass('disabled').html('确认');
      })
  });

   $('.topup_close>img').click(function(){
       $('.maskLayer').hide();
    })
});