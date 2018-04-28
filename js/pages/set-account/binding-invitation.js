/**
 * zyx 
 * 绑定上家邀请关系
**/
$(function(){
	
  var $win = $(window);
  var $body = $('body');
  var uid = sessionStorage.getItem("uid")
  var $invitationcode = $(".invitationcode");
  
  if(!uid){
    Common.toLogin();
    return false;
  }

  var formData = {};
  
  function checkForm(){
	
    var invitationcode = $.trim($invitationcode.val());

    if (!invitationcode.length>0) {
      alert("请输入推荐码")
      return false
    };
    
    if (!invitationcode.length>6) {
        alert("推荐码不正确")
        return false
      };
    
    formData.code =  invitationcode ;
    formData.userId = uid ;
    formData.loginToken = sessionStorage.getItem('loginToken');
    return true;
  }
  
  /**
   * yaoqing
   */
  $body.on('click', '.next-btn', function(event) {
    var $this = $(this);
    
    if (checkForm()) {
//      $this.addClass('disabled').html('实名认证中...');
      $.ajax({
        url: Setting.apiRoot1 + '/getUserByInviteCode.p2p',
        type: 'post',
        dataType: 'json',
        data: {
        	inviteCode:formData.code
        }
      })
      .done(function(res) {
    	  if(res.code==1){
    		  var param = {
				  phone:res.data.phone,
				  name:res.data.name,
				  code:formData.code
	          };
    		  window.location.href=Setting.staticRoot+'/pages/my-account/setting/info-confirm.html?'+ $.param(param);
    	  }else{
    		  alert('未查询到该推荐码的人');
    	  }
      })
      .fail(function() {
        alert('网络链接失败');
        $this.removeClass('disabled').html('确认');
      })
    };

  });
});