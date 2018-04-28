/**
 * Common.js
 * @author  tangsj
 * @return {[type]}       [description]
 */
$(function(){
  var $win = $(window);
  var $body = $('body');

  var userId = sessionStorage.getItem('uid');
  /**
   * render nav
   * @return {[type]} [description]
   */
  !function(){
    var $nav = $('body>.nav');

    if($nav.length > 0){
      var target = $body.data('target') || 'home';
      var _tpl = [
        '<a href="javascript:;" data-href="'+ Setting.staticRoot +'/pages/index.html" class="home{{?it == "home"}} active{{?}}">首页</a>',
        '<a href="javascript:;" data-href="'+ Setting.staticRoot +'/pages/financing/regular.html" class="money{{?it == "money"}} active{{?}}">理财</a>',
        '<a href="javascript:;" data-login="true" data-href="'+ Setting.staticRoot +'/pages/my-account/myAccount.html" class="account{{?it == "account"}} active{{?}}">账户</a>'
      ].join('');
      $nav.html(doT.template(_tpl)(target));

      $nav.on('click', 'a', function(){
        var $this = $(this);

        var needLogin = $this.data('login');
        var href = $this.data('href');

        if(!!needLogin){
          if(!userId){
            window.location.replace(Setting.staticRoot + '/pages/account/login.html?from=' + encodeURIComponent(location.href));
            return false;
          }
        }
        window.location.href = href;
      });
    }
  }();

  /**
   * system common
   * @type {Object}
   */
  var Common = {}
  // 公用变量
  $.extend(Common, {
    vars: {
      // 短信发送等待时间
      sendWait: 60,
    }
  });

  // 正则
  $.extend(Common, {
    reg: {
      mobile: /^((\+86)|(\(\+86\)))?-?(13|14|15|18|17)[0-9]{9}$/, // 验证手机号码
      pwd: /^[a-zA-Z0-9]{6,20}$/, // 登录密码 6-16位字符
      payPwd: /^[0-9]{6}$/, // 交易密码 6-16位字符
      isNum: /^[0-9]*$/,
      money: /^\d{1,12}(?:\.\d{1,2})?$/, // money
      idCard: /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/ // 身份证
    }
  });

  // Function
  $.extend(Common, {
    /**
     * 为数字添加千分位逗号
     * @param  {[type]} num [description]
     * @return {[type]}     [description]
     */
    comdify: function(num){
      var num = num + '';
      var re = /\d{1,3}(?=(\d{3})+$)/g;
      return num.replace(/^(\d+)((\.\d+)?)$/, function(s, s1, s2){
        return s1.replace(re,"$&,") + s2;
      });
    },
    /**
     * 解析URL参数
     */
    getParam : function() {
      var url = location.search; //获取url中"?"符后的字串
       var param = {};
       if (url.indexOf("?") != -1) {
          var str = url.substr(1);
          strs = str.split("&");
          for(var i = 0; i < strs.length; i ++) {
             param[strs[i].split("=")[0]] = decodeURIComponent(strs[i].split("=")[1]);
          }
       }
       return param;
    },
    /**
     * 到登录页面
     * @param {url} 登录成功后回调页面
     * @return {[type]} [description]
     */
    toLogin: function(href){
      href = href || window.location.href;
      alert('请先登录！', function(){
        window.location.replace(Setting.staticRoot + '/pages/account/login.html?from=' + encodeURIComponent(href));
      });
    },
    /**
     * ajax 数据状态过滤
     * Ajax  返回状态码为  -99   表示用户未登录
     * @param  {[type]}   data     [数据]
     * @param  {Function} callback [回调]
     */
    ajaxDataFilter: function(data, callback){
      switch(data.code){
        case -99:
          Common.toLogin();
          return false;
        break;
        default:
        break;
      }

      callback(data);
    },
    /**
     * 短信验证码发送
     * @param {number} [phone] [手机号码 ]
     * @param {number} [type] [1：找回密码短信 2：注册验证码 3：找回交易密码验证码]
     * @param {function} [callback] [发送状态回调]
     * @return {[type]} [description]
     */
    sendMsgCode: function(phone, type, callback){
      $.ajax({
        url: Setting.apiRoot1 + '/sms/send.p2p',
        type: 'post',
        dataType: 'json',
        data: {
          phoneNum: phone,
          type: type
        }
      }).done(function(res){
        callback(res);
      }).fail(function(){
        callback({
          code: -1,
          message: '网络链接失败！'
        });
      });
    },
    /**
     * 验证短信验证码正确性
     * @param  {[type]}   phone    [手机号码 ]
     * @param  {[type]}   code     [验证码]
     * @param  {[type]}   type     [1：找回密码短信 2：注册验证码]
     * @param  {Function} callback [验证回调]
     */
    validMsgCode: function(phone, code, type, callback){
      $.ajax({
        url: Setting.apiRoot1 + '/sms/validate.p2p',
        type: 'post',
        dataType: 'json',
        data: {
          phoneNum: phone,
          identifyCode: code,
          type: type
        }
      }).done(function(res){
        callback(res);
      }).fail(function(){
        callback({
          code: -1,
          message: '网络链接失败！'
        });
      });
    },
    /**
     * 查询产品信息
     * @param  {[type]}   type     [产品类型： 1：周周涨产品 2：新手标 3：定期]
     * @param  {Function} callback [description]
     * @return {[type]}            [description]
     */
    queryProductInfo: function(type,loanType, callback){
      $.ajax({
        url: Setting.apiRoot1 + '/queryProdInfo.p2p',
        type: 'post',
        dataType: 'json',
        data: {
          type: type,
          loanType:loanType
        }
      }).done(function(res){
        callback(res);
      }).fail(function(){
        callback({
          code: -1,
          message: '数据加载失败，请刷新重试！'
        });
      });
    },

    // 检查实名认证
    checkRealName : function(uid,callback){
      if(!uid){
        Common.toLogin();
        return false;
      }
      $.ajax({
        url: Setting.apiRoot1 + '/u/checkUserInfo.p2p',
        type: 'post',
        dataType: 'json',
        data : {
          type : 1,
          userId : uid,
          loginToken:sessionStorage.getItem('loginToken')
        }
      }).done(function(res){
        Common.ajaxDataFilter(res,function(){
          if(res.code == -2){
            confirm('尚未实名认证,是否去实名认证',
              function(){
                window.location.href = Setting.staticRoot + '/pages/my-account/setting/real-name.html'
              });
            return false;
          }
          callback();
        });
      }).fail(function(){

      });
    },
    
    
    /**
     * 微信code自动登录 zyx 20160504
     * @param  {[type]}  
     * @param  
     * @return 
     */
    weixinLogin : function (weixin){
        $.ajax({
            url: Setting.apiRoot2 + '/weixinLogin.p2p',
            type: 'post',
            dataType: 'json',
            data : {
              weixin : weixin,
            }
          }).done(function(res){
    	    if(res.code == 1){

              sessionStorage.clear();
              sessionStorage.setItem('uname', res.data.phoneNum);
              sessionStorage.setItem('uid', res.data.id);
              sessionStorage.setItem('ucode', res.data.code);
              sessionStorage.setItem('loginToken',res.token);
              sessionStorage.setItem('payChannel',res.data.payChannel);
              sessionStorage.setItem('relation',res.data.relation);
              sessionStorage.setItem('realname',res.data.name);//zyx add
              sessionStorage.setItem('relation',res.data.relation);//zyx add
            }else{
            	alert(res.code);
            	return false;
            }    	  
          }).fail(function(){
        	  alert("网络错误");
          });
        
      },
    
    /**
     * 判断是否微信登录
     * @param  {[type]}  
     * @param  
     * @return 
     */
    isWeiXin : function (url){
        var ua = window.navigator.userAgent.toLowerCase();
        if(ua.match(/MicroMessenger/i) == 'micromessenger'){
            return true;
        }else{
        	//alert("关注微信服务号wodecailicai");
//        	if(url==undefined || url==''){
//        		window.location.href = 'http://www.wdclc.cn/download/appdown.html';
//        	}else{
//        		window.location.href = url;
//        	}
        	return true;
        }
      }
  });
  window.Common = Common;

  // Default System UI
  !function(){
    window._alert = alert;
    window._confirm = confirm;

    var _dialogTpl = doT.template([
      '<div class="ui-alert backdrop">',
        '<div class="dialog-content"> ',
          //'<a href="javascript:;" class="close"></a>',
           '<h3 class="dialog-title">温馨提示</h3>',
           '<div class="dialog-article">',
             '<p class="alert-message">{{=it.message}}</p>',
           '</div>',
           '<div class="tc btn-box2 full-btn "><!-- 按钮 -->',
             '<a href="javascript:;" class="btn btn-default btn-sm submit">确定</a>',
             '{{?it.type == "confirm"}}',
             '<a href="javascript:;" class="btn btn-border btn-sm cancel">取消</a>',
             '{{?}}',
           '</div>',
        '</div>',
      '</div>'
    ].join(''));

    $.extend(window, {
      alert: function(str, cb){
        var $alert = $(_dialogTpl({
          type: 'alert',
          message: str
        }));
        $alert.on('click', '.close', function(){
          $alert.remove();
        }).on('click', '.submit', function(){
          $alert.remove();
          cb && cb();
        });
        $body.append($alert);
      },
      confirm: function(str, sb, cl){
        var $alert = $(_dialogTpl({
          type: 'confirm',
          message: str
        }));
        $alert.on('click', '.close', function(){
          $alert.remove();
        }).on('click', '.submit', function(){
          $alert.remove();
          sb && sb();
        }).on('click', '.cancel', function(){
          $alert.remove();
          cl && cl();
        });;
        $body.append($alert);
      }
    });
  }();
});


