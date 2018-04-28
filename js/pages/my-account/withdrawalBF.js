/**
 * withdrawal.js
 * @author tangsj
 * @return {[type]}       [description]
 */

function limitInput() {

  var $money = $('input[name=money]');
  var money = $.trim($money.val());
  var value = parseFloat(money);
  var max = 100000;
  var temp=value.toFixed(2);
  max = max + 0.01;
  if (temp > max) {
    alert('最大提现金额为10万');
    $money.val('');
    return false;
  }
  
}

function formatInput() {
  var $money = $('input[name=money]');
  var money = $.trim($money.val());
  var value = parseFloat(money);
  var max = 100000;
  var temp=value.toFixed(2);
  
  if (temp > max) {
    alert('最大提现金额为' + max);
    $money.val('');
    return false;
  }
  $money.val(temp);
}



$(function(){

  var param = Common.getParam();

  param.amount = parseFloat(param.amount || 0);
  param.fee = parseFloat(param.fee || 0);
  param.extractMin = parseFloat(param.extractMin || 0);

  var $withdrawal = $('.withdrawal');
  var $bgrTitle = $('.bgr-title');
  var $bankcard = $('input[name=bankcard]');
  var $province = $('select[name=province]');
  var $city = $('select[name=city]');
  var $provinceName = $('input[name=provinceName]');
  var $cityName = $('input[name=cityName]');
  var $bankname = $('input[name=bankname]');
  var $braBankName = $('input[name=braBankName]');
  var $money = $('input[name=money]');
  var $fee = $('.fee');
  var bindType = 0;
  var $btnnext = $('.btn-next');
  
  var formData = {};

  var uid = sessionStorage.getItem("uid");
  /**
   * [检测是否登录]
   * @param  {[type]} !uid [description]
   * @return {[type]}      [description]
   */
  if (!uid) {
    Common.toLogin();
    return false;
  }
  
  //共同用
  function setValue(data){
	  $bankcard.val(data.cardNo);
	  $bankname.val(data.bankName);
      $provinceName.val(data.provinceCode);
      $cityName.val(data.cityCode);
      $braBankName.val(data.braBankName);
      
      if($provinceName.val()!=''){
		  $province.add($city).add($braBankName).closest('li').addClass('hide');
	  }else{
		  $province.add($city).add($braBankName).closest('li').removeClass('hide');
	  }
  }
  
  //默认初始样式
  document.getElementById("fybind").innerHTML='未绑卡';
  document.getElementById("bfbind").innerHTML='未绑卡';
  
  //查询各个渠道的卡信息
  var rurl = Setting.apiRoot1 + '/u/findTransChanel.p2p';
  var data = {
          userId: uid,
          loginToken:sessionStorage.getItem('loginToken'),
          transType:20
        };
  var storage = {};
  var fee=0.00;
  var curCanExtractAmt=0.00;
  var withdrawChanel;
  
  $.ajax({
      url: rurl,
      type: 'post',
      dataType: 'json',
      data: data
    }).done(function(res){
      Common.ajaxDataFilter(res, function(res){
    	//1 成功
        if(res.code == 1){
          fee = res.data.fee;
          curCanExtractAmt = res.data.curCanExtractAmt;
          //账户余额和今天可提现限制比较，取小的一个
          if(param.amount < curCanExtractAmt){
          	curCanExtractAmt = param.amount;
          }
          
//    	  $fee.find('span').html(Common.comdify(fee.toFixed(2)));
    	  $fee.find('span').html(Common.comdify(fee));
    	  
          $bgrTitle.find('span').html(Common.comdify(curCanExtractAmt.toFixed(2)));
          //微信没有连连，如果是连连则默认为宝付
          withdrawChanel = res.data.withdrawChanel;
          if(withdrawChanel==1)withdrawChanel=4;
          
          var cardlist = res.data.cardList;
          storage = res.data.cardList;
          
          var isHaveBindCard = 0;
          for(var i=0;i<cardlist.length;i++){
        	  var pc = cardlist[i].payChannel;
        	  if(pc==1){
        		  continue;
        	  }
        	  if(pc==withdrawChanel){
                  setValue(cardlist[i]);
                  bindType = cardlist[i].bindType;
        	  }
        	  //设置各个渠道是否已绑卡
        	  var thisBind = cardlist[i].bindType;
        	  if(thisBind==1){
    		    if(pc==3){
                  document.getElementById("fybind").style.backgroundImage='url(../../images/pages/top-up/bg-select-small.png)';
                  document.getElementById("fybind").innerHTML='已绑卡';
                }
                if(pc==4){
                  document.getElementById("bfbind").style.backgroundImage='url(../../images/pages/top-up/bg-select-small.png)';
                  document.getElementById("bfbind").innerHTML='已绑卡';
                }
        		isHaveBindCard = 1;
        	  }
        	  
          }
          //默认选中判断
          if(withdrawChanel==3){
              document.getElementById("fyChanel").style.backgroundImage='url(../../images/pages/top-up/bg-select.png)';
              document.getElementById("fyright").style.display='block'; 
          }else if(withdrawChanel==4){
              document.getElementById("bfChanel").style.backgroundImage='url(../../images/pages/top-up/bg-select.png)'; 
              document.getElementById("bfright").style.display='block';
          }
          
          if(isHaveBindCard!=1){
        	  alert('请先充值绑定银行卡再提现');
    		  $btnnext.addClass('disabled').text("请选择充过值的支付渠道");
              function  jumurl(){
             	 window.location.href=Setting.staticRoot+'/pages/my-account/myAccount.html';
              }
              setTimeout(jumurl,1000);
    	  }
		  
          
        }else if(res.code == -2){ 
        // 未实名认证
          confirm('您还未完成实名认证，请先完成实名认证！', function(){
            window.location.href = Setting.staticRoot + '/pages/my-account/setting/real-name.html';
          });
        }else{	
          alert(res.message);
          return false;
        }
      });
    }).fail(function(){
      alert('网络链接失败');
      return false;
    });
  
  var areaTpl = doT.template([
    '<option value="|">{{=it.txt}}</option>',
    '{{~it.list :item:index}}',
      '<option value="{{=item.id}}">{{=item.name}}-{{=item.no}}</option>',
    '{{~}}'
  ].join(''));
  
//初始化页面数据
  $bankcard.val(param.card);
  $bankname.val(param.bankName);
  $braBankName.val(param.braBankName);
  
  $bgrTitle.find('span').html(Common.comdify(param.amount.toFixed(2)));
  $fee.find('span').html(Common.comdify(param.fee.toFixed(2)));
  $money.attr('placeholder', '输入金额至少'+ param.extractMin +'元');
  
  var provinceName = param.provinceName;
  if(provinceName=='' || provinceName==null || provinceName==undefined){
	  getAreaData("1", function(data){
		    $province.html(areaTpl({
		      txt: '请选择省',
		      list: data
		    }));
	  });
  }else{
	  $provinceName.val(param.provinceName);
	  $cityName.val(param.cityName);
	  $province.add($city).add($braBankName).closest('li').addClass('hide');
	  $bankcard.val(param.card).attr('readonly', 'readonly');
  }
  
  console.log(param);

  /**
   * 获取地区信息 如果查询省份，parentId=1   查询城市，则传该省的id
   * @param  {[type]} pid [description]
   * @return {[type]}     [description]
   */
  function getAreaData(parentId, callback){
	var paramid = '';
	if(parentId!=''){
		paramid = parentId;
		$.ajax({
	      url: Setting.apiRoot1 + '/getProvinceAndCity.p2p',
	      type: 'post',
	      dataType: 'json',
	      data: {
	        parentId: paramid,
	        payChannelId:3
	      }
	    }).done(function(res){
	      if(res.code != 1){
	        alert(res.message);
	        return false;
	      }
	      callback(res.data);
	    }).fail(function(){
	      alert('网络链接失败，请刷新重试！');
	      return false;
	    });
	}
  }

  /**
   * 渲染City列表
   * @return {[type]} [description]
   */
  function renderCity(parentId){
    getAreaData(parentId, function(data){
      $city.html(areaTpl({
        txt: '请选择市',
        list: data
      })).siblings('span.text').addClass('gray').html('请选择市');
    });
  }


  /**
   * 表单验证
   * @return {[type]} [description]
   */
  function check(){
    var bankcard = $.trim($bankcard.val());
    var province, city, braBankName
    if(bankcard.length == 0){
      alert('请输入您的银行卡号');
      return false;
    }
	province = $provinceName.val();
	city = $cityName.val();
	if (city.indexOf('-') !== 0) {
		var index =  city.indexOf('-') ;
	  	city = city.substring(index+1);
	}
	  
	braBankName = $.trim($braBankName.val());
	  
	if(province=='' || province.length < 1){
		alert('请选择省份');
	    return false;
	}
	
	if(city=='' || city.length < 1){
		alert('请选择城市');
	    return false;
	}
	
	if(braBankName.length == 0){
	    alert('请输入支行名称');
	    return false;
	}
    
    var money = $.trim($money.val());
    if(money.length == 0){
      alert('请输入提现金额');
      return false;
    }
    money = parseFloat(money);
    if(money < param.extractMin){
      alert('提现金额不能小于' + param.extractMin + '元');
      return false;
    }
    
    if(money > curCanExtractAmt){
        alert('提现金额不能大于' + curCanExtractAmt + '元');
        return false;
     }

	var pp = province.indexOf("-");
	if(pp>0){
		province = province.substring(0,pp);
	}
	var cp = city.indexOf("-");
	if(cp>0){
		city = city.substring(0,cp);
	}
	alert(pp+':'+cp);
	
    //确认支付传入参数
    formData.provinceCode = province;
    formData.cityCode = city;
    formData.braBankName = braBankName;
    formData.cardNum = bankcard.replace(/\s/g, '');
    formData.amount = money;
    formData.prcptcd = param.prcptcd;
    return true;
  }
  
  /**
   * 去支付页面输入密码 
   * @return {[type]} [description]
   */
  function gotoPay(){
    sessionStorage.setItem('withdrawal-pay', JSON.stringify(formData));
    if(withdrawChanel==4){
        window.location.href = 'withdrawal-payBF.html';
    }else if(withdrawChanel==3){
    	window.location.href = 'withdrawal-payFY.html';
    }

  }

  //选择下拉框
  $withdrawal.on('change', '.select-ui select', function(){
    var $this = $(this);
    var _txt = $this.find('option:selected').text();
    
    $this.siblings('span.text').html(_txt).removeClass('gray');
    if(this.name == 'province'){
      $provinceName.val(_txt);
      renderCity(this.value);
    }else{
      $cityName.val(_txt);
    }
  }).on('input change blur', 'input[name=bankcard]', function(e){
    var $this = $(this);
    var card = $.trim($this.val());
    if(card.length == 0){
      return false;
    }
    card = card.replace(/\s/g,'').replace(/(\d{4})(?=\d)/g,"$1 ");
    $this.val(card);
  }).on('click', '.btn-next', function(){
    var $this = $(this);
    if($this.hasClass('disabled')){
      return false;
    }
    if(check()){
    	gotoPay();
    }
  });
  
//【富友】 渠道点击选中，改变选中的渠道，以及卡信息赋值 3
  $withdrawal.on('click', '#fyChanel', function(){
      for(var i=0;i<storage.length;i++){
    	  var pc = storage[i].payChannel;
    	  if(pc==3){
    		  if(storage[i].bindType!=1){
        		  alert('本通道需要充值绑定后才可提现！');
        		  $btnnext.addClass('disabled').text("请点击其他支付渠道");
        		  return false;
        	  }
    		  withdrawChanel = pc;
    		  bindType = storage[i].bindType;
    		  $btnnext.removeClass('disabled').text("下一步");
    		  setValue(storage[i]);
    		  //$money.val('');
              // document.getElementById("fyChanel").style.backgroundColor="#FF0000";
              document.getElementById("fyChanel").style.backgroundImage='url(../../images/pages/top-up/bg-select.png)';
              document.getElementById("bfChanel").style.backgroundImage='url(../../images/pages/top-up/bg-gray.jpg)';
              document.getElementById("bfright").style.display='none';
              document.getElementById("fyright").style.display='block';
              break;
    	  }
      }
  });
  
  //【宝付】 渠道点击选中，改变选中的渠道，以及卡信息赋值 4
  $withdrawal.on('click', '#bfChanel', function(){
      for(var i=0;i<storage.length;i++){
    	  var pc = storage[i].payChannel;
    	  if(pc==4){
    		  if(storage[i].bindType!=1){
        
        		  alert('本通道需要充值绑定后才可提现！');
        		  $btnnext.addClass('disabled').text("请点击其他支付渠道");
        		  return false;
        	  }
    		  withdrawChanel = pc;
    		  bindType = storage[i].bindType;
    		  $btnnext.removeClass('disabled').text("下一步");
    		  setValue(storage[i]);
    		  //$money.val('');
              document.getElementById("fyChanel").style.backgroundImage='url(../../images/pages/top-up/bg-gray.jpg)';
              document.getElementById("bfChanel").style.backgroundImage='url(../../images/pages/top-up/bg-select.png)';
              document.getElementById("fyright").style.display='none';
              document.getElementById("bfright").style.display='block';      
              break;
    	  }
      }
  });
  
});