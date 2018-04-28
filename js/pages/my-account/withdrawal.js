/**
 * withdrawal.js
 * @author tangsj
 * @return {[type]}       [description]
 */
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
  
  var areaTpl = doT.template([
    '<option value="|">{{=it.txt}}</option>',
    '{{~it.list :item:index}}',
      '<option value="{{=item.id}}">{{=item.name}}</option>',
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
	        parentId: paramid
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
    window.location.href = 'withdrawal-pay.html';
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
  
});