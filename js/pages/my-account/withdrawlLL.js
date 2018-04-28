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
  var $bank = $('input[name=bank]');
  var $province = $('select[name=province]');
  var $city = $('select[name=city]');
  var $bankname = $('input[name=bankname]');
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

  console.log(param);

  var areaTpl = doT.template([
    '<option value="">{{=it.txt}}</option>',
    '{{~it.list :item:index}}',
      '<option value="{{=item.id}}">{{=item.name}}</option>',
    '{{~}}'
  ].join(''));

  /**
   * 获取地区信息 如果查询省份，parentId=1   查询城市，则传该省的id
   * @param  {[type]} pid [description]
   * @return {[type]}     [description]
   */
  function getAreaData(parentId, callback){
    $.ajax({
      url: Setting.apiRoot1 + '/getProvinceAndCity.p2p',
      type: 'post',
      dataType: 'json',
      data: {
        parentId: parentId
      }
    }).done(function(res){
      if(res.code != 1){
        alert(res.message);
        return false;
      }

      callback(res.data);
    }).fail(function(){
      alert('服务器异常，请刷新重试！');
      return false;
    });
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
   * 获取银行卡名称
   * @return {[type]} [description]
   */
  function getCardInfo(cardNum, callback){
    $.ajax({
      url: Setting.apiRoot1 + '/u/bankcard/cardbin.p2p',
      type: 'post',
      dataType: 'json',
      data: {
        cardNum: cardNum,
        userId: uid
      }
    }).done(function(res){
      Common.ajaxDataFilter(res, function(res){
        if(res.code == 1){
          callback(res.data);
        }
      });
    });
  }

  /**
   * 表单验证
   * @return {[type]} [description]
   */
  function check(){
    var bankcard = $.trim($bankcard.val());

    var province, city, bankname

    if(bankcard.length == 0){
      alert('请输入您的银行卡号');
      return false;
    }
    if(!param.prcptcd){
      province = $province.val();
      city = $city.val();
      bankname = $.trim($bankname.val());
      if(province.length == 0){
        alert('请选择省份');
        return false;
      }

      if(city.length == 0){
        alert('请选择城市');
        return false;
      }

      if(bankname.length == 0){
        alert('请输入支行名称');
        return false;
      }
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

    formData.provinceCode = province || param.provinceCode;
    formData.cityCode = city || param.cityCode;
    formData.braBankName = bankname || param.braBankName;
    formData.cardNum = bankcard.replace(/\s/g, '');
    formData.amount = money;
    return true;
  }
  /**
   * 去支付
   * @return {[type]} [description]
   */
  function gotoPay(){
    sessionStorage.setItem('withdrawal-payLL', JSON.stringify(formData));
    window.location.href = 'withdrawal-payLL.html';
  }

  // Event
  $withdrawal.on('change', '.select-ui select', function(){
    var $this = $(this);
    var _txt = $this.find('option:selected').text();
    $this.siblings('span.text').html(_txt).removeClass('gray');

    if(this.name == 'province'){
      renderCity(this.value);
    }
  }).on('input change blur', 'input[name=bankcard]', function(e){
    var $this = $(this);

    $bank.closest('li').addClass('hide');

    var card = $.trim($this.val());

    if(card.length == 0){
      return false;
    }

    if(e.type == 'focusout'){
      getCardInfo(card.replace(/\s/g, ''), function(info){
        if(!!info.bankName){
          $bank.closest('li').removeClass('hide');
          $bank.val(info.bankName);
        }
      });
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
      $this.addClass('disabled');
      if(!param.prcptcd){
        // 请求大额行号查询 接口
        $.ajax({
          url: Setting.apiRoot1 + '/u/bankcard/cnaps.p2p',
          type: 'post',
          dataType: 'json',
          data: {
            userId :uid,
            cardNum: formData.cardNum,
            cityCode: formData.cityCode,
            braBankName: formData.braBankName
          }
        }).done(function(res){
          Common.ajaxDataFilter(res, function(res){
            if(res.code != 1){
              alert(res.message);
              $this.removeClass('disabled');
              return false;
            }
            formData.prcptcd = res.data.prcptcd;
            gotoPay();
          });
        }).fail(function(){
          alert('服务器异常，请刷新重试！');
          $this.removeClass('disabled');
          return false;
        });
      }else{
        formData.prcptcd = param.prcptcd;
        gotoPay();
      }
      return false;
    }
  });

  // 初始化页面数据
  $bgrTitle.find('span').html(Common.comdify(param.amount.toFixed(2)));
  $fee.find('span').html(Common.comdify(param.fee.toFixed(2)));
  $money.attr('placeholder', '输入金额至少'+ param.extractMin +'元');
  getAreaData(1, function(data){
    $province.html(areaTpl({
      txt: '请选择省',
      list: data
    }));
  });
  if(!!param.card){
    $bankcard.val(param.card).trigger('change').trigger('blur').attr('readonly', 'readonly');
  }
  if(!!param.prcptcd){
    $province.add($city).add($bankname).closest('li').addClass('hide');
  }
});