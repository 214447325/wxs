/**
 * appDial.js
 * @author tangsj
 * @return {[type]}       [description]
 */
$(function(){


  var param = Common.getParam();

  var pro24app ={};
  var pro24h5 ={};
  
  var pro48app ={};
  var pro48h5 ={};
  
  var userId =  param.uid;
  if(userId==null || userId==undefined){
	  userId = sessionStorage.getItem('uid');
  }
  
  var loginToken =  param.loginToken;
  if(loginToken==null || loginToken==undefined){
	  loginToken = sessionStorage.getItem('loginToken');
  }
  
  Common.queryProductInfo(3,1, function(res){
      if(res.code != 1){
        alert(res.message);
        return false;
      }
      var data = res.data;

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
        
        if(item.cycleType==4){
        	if(item.cycle==24){
        		pro24h5 = {
        		          pid: item.productId,
        		          pname: item.title + "(" + item.cycle + item.cycleTypeDesc +")",
        		          pmount: item.amount,
        		          minInterest: item.minInterest,
        		          minInvestAmount: item.minInvestAmount,
        		          maxInvestAmount: item.maxInvestAmount,
        		          yearRate : item.minRate,
        		          cycle : item.cycle,
        		          cycleType : item.cycleType,
          		          spEvents : 1
        		          
        		        };
        		
        		//$.param(pro24h5);
        		
        		pro24app = {
        			  productId: item.productId,
        			  title: item.title + "(" + item.cycle + item.cycleTypeDesc +")",
        			  amount: item.amount,
        			  minInterest: item.minInterest,
        			  minInvestAmount: item.minInvestAmount,
        			  maxInvestAmount: item.maxInvestAmount,
        			  minRate : item.minRate,
        			  cycle : item.cycle,
        			  cycleType : item.cycleType,
      		          spEvents : 1
        			  
        		}
        		
        	}
        	if(item.cycle==48){
        		pro48h5 = {
      		          pid: item.productId,
      		          pname: item.title + "(" + item.cycle + item.cycleTypeDesc +")",
      		          pmount: item.amount,
      		          minInterest: item.minInterest,
      		          minInvestAmount: item.minInvestAmount,
      		          maxInvestAmount: item.maxInvestAmount,
      		          yearRate : item.minRate,
      		          cycle : item.cycle,
      		          cycleType : item.cycleType,
      		          spEvents : 1
      		        };
      		
	      		//$.param(pro24h5);
	      		
	      		pro48app = {
	      			  productId: item.productId,
	      			  title: item.title + "(" + item.cycle + item.cycleTypeDesc +")",
	      			  amount: item.amount,
	      			  minInterest: item.minInterest,
	      			  minInvestAmount: item.minInvestAmount,
	      			  maxInvestAmount: item.maxInvestAmount,
	      			  minRate : item.minRate,
	      			  cycle : item.cycle,
	      			  cycleType : item.cycleType,
      		          spEvents : 1
	      		}
        	}
        	
        }
        
//        if(item.timeLine){
//          infoParam.timeLine = encodeURIComponent(item.timeLine);
//        }
        
        // console.log(infoParam)

      });

//      item.buyParam = $.param(pro24);
      
    });

  function  jumurl(buyProduct){
//  	if(userId==null || userId==undefined){
//  		window.location.href = Setting.staticRoot + '/pages/financing/regular.html'; 
//  	}else{
  	  	window.location.href =  Setting.staticRoot + '/pages/financing/buy1.html?'+"jumpId=1&" + buyProduct;
//  	}

  } 

	var messagingIframe;
	messagingIframe = document.createElement('iframe');
	messagingIframe.style.display = 'none';
	document.documentElement.appendChild(messagingIframe);
	function IOSJS(jsonStr, url){
	    messagingIframe.src = "jumpRegular://"+url+"?jsonStr=" + jsonStr;
	}
	
  var $body = $('body');

  var deviceType = param.type;
  $('.regist-img2').click(function(event) {
	    
	    
//	    if(deviceType==1 || deviceType==2){
//	    	IOSJS(JSON.stringify(pro24app), "regularbuyiphone");
//	    }else{
//	    	var buyProduct = $.param(pro24h5);
//		    alert('正在前往购买24周产品');
//	        setTimeout(jumurl(buyProduct),1000);
//	    }
	    
		
    });
  
  $('.regist-img1').click(function(event) {
	 
//	  if(deviceType==1 || deviceType==2){
//		  IOSJS(JSON.stringify(pro48app), "regularbuyiphone");
//	  }else{
//		  var buyProduct = $.param(pro48h5);
//		  alert('正在前往购买48周产品');
//		  setTimeout(jumurl(buyProduct),1000);
//	  }
		
    });
  
  
});
