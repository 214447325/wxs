/**
 * Common.js
 * @author  tangsj
 * @return {[type]}       [description]
 */
$(function(){
  var $win = $(window);
  var $body = $('body');
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
        '<a href="javascript:;" data-href="'+ Setting.staticRoot +'/pages/message/messages.html" class="explore{{?it == "explore"}} active{{?}}" style="position:relative;">社区<div href="javascript:;" class="newInfo">999</div></a>',
        '<a href="javascript:;" data-login="true" data-href="'+ Setting.staticRoot +'/pages/my-account/myAccount.html" class="account{{?it == "account"}} active{{?}}">我的</a>'
      ].join('');
      $nav.html(doT.template(_tpl)(target));
      var tarbarShow = sessionStorage.getItem('tarbarShow');
      if(tarbarShow == 2){
        $('.nav a').css({
          "background-position": "center .053rem",
        });
        $('.nav a.home').css({
          "backgroundImage": "url("+ Setting.staticRoot+"/images/pages/indexPage/index2.png)",
          "backgroundSize": ".93rem .853rem",
        });
        $('.nav a.home.active').css({
          "backgroundImage": "url("+ Setting.staticRoot+"/images/pages/indexPage/index3.png)",
          "backgroundSize": ".93rem .853rem",
        });

         $('.nav a.money').css({
          "backgroundImage": "url("+ Setting.staticRoot+"/images/pages/indexPage/money2.png)",
          "backgroundSize": ".93rem .853rem",
        });
        $('.nav a.money.active').css({
          "backgroundImage": "url("+ Setting.staticRoot+"/images/pages/indexPage/money3.png)",
          "backgroundSize": ".93rem .853rem",
        });

         $('.nav a.explore').css({
          "backgroundImage": "url("+ Setting.staticRoot+"/images/pages/indexPage/explore2.png)",
          "backgroundSize": ".93rem .853rem",
        });
        $('.nav a.explore.active').css({
          "backgroundImage": "url("+ Setting.staticRoot+"/images/pages/indexPage/explore3.png)",
          "backgroundSize": ".93rem .853rem",
        });

         $('.nav a.account').css({
          "backgroundImage": "url("+ Setting.staticRoot+"/images/pages/indexPage/account2.png)",
          "backgroundSize": ".93rem .853rem",
        });
        $('.nav a.account.active').css({
          "backgroundImage": "url("+ Setting.staticRoot+"/images/pages/indexPage/account3.png)",
          "backgroundSize": ".93rem .853rem",
        });
      }


      $nav.on('click', 'a', function(){
        var userId = sessionStorage.getItem('uid');
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
      window.location.replace(Setting.staticRoot + '/pages/account/login.html?from=' + encodeURIComponent(href));
    },
    /**
     * ajax 数据状态过滤
     * Ajax  返回状态码为  -99   表示用户未登录
     * @param  {[type]}   data     [数据]
     * @param  {Function} callback [回调]
     */
    ajaxDataFilter: function(data, callback){

      // 获取uuid 判断是否有uuid
      if(data.code == -99){
          var weixin = sessionStorage.getItem("uuid");
          if(weixin!=undefined && weixin!=null && weixin.length>10){
            Common.weixinLogin(weixin);
          }else{
            sessionStorage.clear();
            Common.toLogin();
          }
      }

        // switch(data.code){
        //   case -99:
        //     sessionStorage.clear();
        //     Common.toLogin();
        //     return false;
        //   break;
        //   default:
        //   break;
        // }

      callback(data);
    },
    /**
     * 短信验证码发送
     * @param {number} [phone] [手机号码 ]
     * @param {number} [type] [1：找回密码短信 2：注册验证码 3：找回交易密码验证码]
     * @param {function} [callback] [发送状态回调]
     * @return {[type]} [description]
     */
    sendMsgCode: function(phone, type, code, divnceId, callback){
        var _date = new Date();
      $.ajax({
        url: Setting.apiRoot1 + '/sms/send.p2p?divnceId=' + divnceId,
        type: 'post',
        dataType: 'json',
        data: {
          phoneNum: phone,
          type: type,
          code: code,
          date:_date.getTime()
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
            async:false,
            data : {
              weixin : weixin,
            }
          }).done(function(res){
    	    if(res.code == 1){
                    var downloadStatus = sessionStorage.getItem('status');//获取首页下载APP的按钮的状态
                    sessionStorage.clear();
                    sessionStorage.setItem('uname', res.data.phoneNum);
                    sessionStorage.setItem('nickName',res.data.nickName);
                    sessionStorage.setItem('avatar',res.data.avatar);
                    sessionStorage.setItem('uid', res.data.id);
                    sessionStorage.setItem('uuid', res.data.weixin);
                    sessionStorage.setItem('ucode', res.data.code);
                    sessionStorage.setItem('loginToken',res.token);
                    sessionStorage.setItem('payChannel',res.data.payChannel);
                    sessionStorage.setItem('realname',res.data.name);//zyx add
                    sessionStorage.setItem('relation',res.data.relation);//zyx add
                    sessionStorage.setItem('cardNum',res.data.cardNum);//身份证
                    sessionStorage.setItem('validTrade',res.data.validTrade);//是否设置交易密码
                    sessionStorage.setItem('validName',res.data.validName);//是否设置实名认证
                    sessionStorage.setItem('status',downloadStatus);
                    sessionStorage.setItem('newProd',res.data.newProd);//是否购买过新手标
                    sessionStorage.setItem('isBirthday',res.data.isBirthday);//是否购买过新手标
                    sessionStorage.setItem('gifts20171111',res.data.gifts20171111);//是否购买过新手标
                    if(res.data.gifts20171111 == 0){
                        var list = JSON.stringify(res.data.giftsList20171111)
                        sessionStorage.setItem('giftsList',list);
                        sessionStorage.setItem('gifts20171111Flag',1);
                    }
                    if(res.data.isBirthday == 1){
                        var list = JSON.stringify(res.data.resList)
                        sessionStorage.setItem('resList',list);
                        sessionStorage.setItem('birthdayFlag',1);
                    }
            }else{
            	// alert(res.code);
              sessionStorage.clear();
            	return false;
            }    	  
          }).fail(function(){
        	  alert("网络错误");
          });
        
      },


    /**
     * @phone  {[type]} phone    [description]
     * @password  {[type]} password [description]
     */
    login:function(phone,password){
      $.post(Setting.apiRoot2 + '/login.p2p',{loginName: phone, password: password}, function(res) {
          console.log(JSON.stringify(res));
          var downloadStatus = sessionStorage.getItem('status');
          sessionStorage.clear();
          sessionStorage.setItem('uname', res.data.phoneNum);
          sessionStorage.setItem('nickName',res.data.nickName);
          sessionStorage.setItem('avatar',res.data.avatar);
          sessionStorage.setItem('uid', res.data.id);
          sessionStorage.setItem('uuid', res.data.weixin);
          sessionStorage.setItem('ucode', res.data.code);
          sessionStorage.setItem('loginToken',res.token);
          sessionStorage.setItem('payChannel',res.data.payChannel);
          sessionStorage.setItem('realname',res.data.name);//zyx add
          sessionStorage.setItem('relation',res.data.relation);//zyx add
          sessionStorage.setItem('cardNum',res.data.cardNum);//身份证
          sessionStorage.setItem('validTrade',res.data.validTrade);//是否设置交易密码
          sessionStorage.setItem('validName',res.data.validName);//是否设置实名认证
          sessionStorage.setItem('status',downloadStatus);
          sessionStorage.setItem('newProd',res.data.newProd);//是否购买过新手标
          sessionStorage.setItem('isBirthday',res.data.isBirthday);//是否购买过新手标
          sessionStorage.setItem('gifts20171111',res.data.gifts20171111);//是否购买过新手标
          if(res.data.gifts20171111 == 0){
              var list = JSON.stringify(res.data.giftsList20171111)
              sessionStorage.setItem('giftsList',list);
              sessionStorage.setItem('gifts20171111Flag',1);
          }
          if(res.data.isBirthday == 1){
              var list = JSON.stringify(res.data.resList)
              sessionStorage.setItem('resList',list);
              sessionStorage.setItem('birthdayFlag',1);
          }
          var newCouple = /\/wx\/pages\/activity\/newCouple\//;
          var newCouple2 = /\/wx\/pages\/activity\/wangyi\//;
          var newCouple3 = /\/wx\/pages\/activity\/xinshu\//;
          var toutiao = /\/wx\/pages\/activity\/toutiao\//;
          var toutiaoT = /\/wx\/pages\/activity\/toutiaoT\//;
          var wangyiT = /\/wx\/pages\/activity\/wangyiT\//;//网易有道
          var xinshuT = /\/wx\/pages\/activity\/xinshuT\//;//新数
          var jingdD = /\/wx\/pages\/activity\/jingdD\//;//景多多
          var xingshi = /\/wx\/pages\/activity\/xingshi\//;//星拾
          var momo = /\/wx\/pages\/activity\/momo\//;//陌陌
          if(Common.getParam.from!=null && Common.getParam.from!=undefined){
              window.location.href = decodeURIComponent(Common.getParam.from);
          }else if(newCouple.test(window.location.pathname) == true){
             window.location.href =  window.location.origin+'/wx/pages/activity/newCouple/newCoupleHD.html';//跳到活动页
          }else if(newCouple2.test(window.location.pathname) == true || wangyiT.test(window.location.pathname)){
            window.location.href =  window.location.origin+'/wx/pages/activity/newCouple/newCoupleHD.html';//跳到活动页
          }else if(newCouple3.test(window.location.pathname) == true || xinshuT.test(window.location.pathname)){
            var win = '<script type="text/javascript" src="https://aw.kejet.net/t?p=Mxb&c=99"></script>';
            $('body').append(win);
            window.location.href =  window.location.origin+'/wx/pages/activity/newCouple/newCoupleHD.html';//跳到活动页
          }else if(toutiao.test(window.location.pathname) == true || toutiaoT.test(window.location.pathname)){
            _taq.push({convert_id:"75723775853", event_type:"form"});
            window.location.href =  window.location.origin+'/wx/pages/activity/newCouple/newCoupleHD.html';//跳到活动页
          }else if(jingdD.test(window.location.pathname) == true || xingshi.test(window.location.pathname) == true || momo.test(window.location.pathname) == true){
             window.location.href =  window.location.origin+'/wx/pages/activity/newCouple/newCoupleHD.html';//跳到活动页
          }else{
              window.location.href = window.location.origin+'/wx/pages/my-account/myAccount.html';
          }
      },'json');
    },

    
     /**
     * 分享
     * @param  {[type]}  
     * @button  分享的按钮
     * @appUrl  针对app重定向的地址 
     */
    share:function(button,appUrl){
      var param = Common.getParam();
      var userId = sessionStorage.getItem('uid');
      var type = param.type;
      if(type != null && type != undefined && type > 0){
        if(param.uid!=null && param.uid!=undefined && param.uid!='null' && param.uid.length>0){
          userId = param.uid;
        }
      }
     button.on('click',function(){
            var isWeiXin = Common.isWeiXin();
            var version = param.version;
            var type = param.type;
            var shareTemplate = [
            '<a class="share" href="javascript:;">',
              '<i class="share_pic"></i>',
            '</a>'
            ].join('');
            if(!userId){
             var href = window.location.href;
             window.location.replace(Setting.staticRoot + '/pages/account/login.html?from=' + encodeURIComponent(href));
            }else{
                if(version != null && version != undefined && version > 0){
                window.location.href =  Setting.staticRoot + appUrl;
              } else if(type != null && type != undefined && type > 0) {
                window.location.href =  Setting.staticRoot + appUrl;
              }else{
                //只有点击分享时候需要提示登录
                (!$('.share').length>0)  && $('body').append(shareTemplate);
              }
            }
        });
        $('body').on('click', '.share', function(event) {
            $(this).remove();
        });
    },

      newShareButton:function(appUrl) {
          var param = Common.getParam();
          var userId = sessionStorage.getItem('uid');
          var type = param.type;
          if(type != null && type != undefined && type > 0){
              if(param.uid!=null && param.uid!=undefined && param.uid!='null' && param.uid.length>0){
                  userId = param.uid;
              }
          }
          //button.on('click',function(){
              var isWeiXin = Common.isWeiXin();
              var version = param.version;
              var type = param.type;
              var shareTemplate = [
                  '<a class="share" href="javascript:;">',
                  '<i class="share_pic"></i>',
                  '</a>'
              ].join('');
              if(!userId){
                  var href = window.location.href;
                  window.location.replace(Setting.staticRoot + '/pages/account/login.html?from=' + encodeURIComponent(href));
              }else{
                  if(version != null && version != undefined && version > 0){
                      window.location.href =  Setting.staticRoot + appUrl;
                  } else if(type != null && type != undefined && type > 0) {
                      window.location.href =  Setting.staticRoot + appUrl;
                  }else{
                      //只有点击分享时候需要提示登录
                      (!$('.share').length>0)  && $('body').append(shareTemplate);
                  }
              }
          //});
          $('body').on('click', '.share', function(event) {
              $(this).remove();
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
      },

      removeHtml:function(id){
        $('#regular').remove();
      },
      /**
       * 判断是否有购买活期
       * @userId  {[number]}  用户id 
       * @loginToken {[type]}  loginToken 
       * @return 15000861539
     */
      currentStock:function(userId,loginToken){
        var _html = doT.template([
            '<div class="ui-alert backdrop" id="regular">',
              '<div class="dialog-content" style="padding:0.68rem 0.64rem 0.68rem 0.64rem;font-size:0.3733rem;line-height:0.6266rem;margin-top: -4.34375rem;">',
                  '<img src="'+Setting.staticRoot+'/images/pages/close.png" style="width:0.8533rem;height:0.8533rem;position:absolute;top:-1rem;right:0;" onClick="Common.removeHtml()"/>',
                  '<div>尊敬的V粉，您好：</div>',
                  '<div style="text-indent:0.9rem;">因合规要求，平台接入银行存管后需对活期在投资金进行调整，特推出',
                  '<span style="color:#ff791f;">3周定期（14%年化收益）</span>',
                  '产品，用户在活期产品赎回后即可购买。</div>',
                  '<div style="text-align:center;margin:0.4666rem 0 0.6266rem 0;line-height:0;">',
                    '<a href="'+Setting.staticRoot+'/pages/active/currentstock.html" style="color:blue;text-decoration:underline;text-align:center;">查看规则</a>',
                  '</div>',
                  '<a href="'+Setting.staticRoot+'/pages/my-account/current/redemption3.0.html" style="display:block;background:#ff791f;border-radius:0.1333rem;color:#fff;font-size:0.5333rem;text-align:center;line-height:1.09333rem;">活期赎回</a>',
              '<div>',
            '<div>',
            '</div>'
          ].join(""))
        $.ajax({
          url:Setting.apiRoot1 + '/u/userCurrentTip.p2p',
          dataType:'json',
          type:'POST',
          data:{
            userId:userId,
            loginToken:loginToken,
          }
        }).done(function(res){
          if(res.code == 1){
            if(res.data == 1){
              $('body').append(_html());
            }
          }
        }).fail(function(){
          alert('网络链接失败！')
        })
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

  !function(){

     //双11礼包
     var _gifts20171111Data = [
     '<div class="gifts" style="background: rgba(0, 0, 0, .6);position: fixed;left: 0;top: 0;z-index: 99999;width: 100%;height: 100%;font-size:0.4266rem;color:#333;overflow:auto;display:none;">',
     '<div class="giftsContent" style="width:8rem;height:11rem;position:absolute;left:0;right:0;top:0;bottom:0;margin:auto;text-align:center;">',
        '<div class="closegift" style="width:0.6666rem;height:0.6666rem;background:url('+Setting.staticRoot+'/images/pages/activity/coupon11/close.png);background-size:100% 100%;margin-left:7rem;"></div>',
        '<div style="width:100%;height:8rem;background:url('+Setting.staticRoot+'/images/pages/activity/coupon11/one.png);background-size:100% 100%;margin-bottom:0.8rem;"></div>',
        '<div class="giftsBtn" style="width:4.8933rem;height:1.16rem;margin:auto;background:url('+Setting.staticRoot+'/images/pages/activity/coupon11/button.png);background-size:100% 100%;"></div>',
      '</div>',
        '<div class="giftsCoupon" style="width:8.3466rem;height:12rem;position:absolute;left:0;right:0;top:0;bottom:0;margin:auto;display:none;background:url('+Setting.staticRoot+'/images/pages/activity/coupon11/bck.png);background-size:100% 100%;">',
        '<div class="closegift" style="width:0.6666rem;height:0.6666rem;background:url('+Setting.staticRoot+'/images/pages/activity/coupon11/close.png);background-size:100% 100%;margin-left:7rem;margin-top:-0.85rem;"></div>',
          '<div style="margin-top:2.8rem;padding:0 1.1rem;font-size:0.3733rem;padding-bottom:1rem;">',
            '{{~it :item:index}}',
            '{{?item.couponType == 2}}',
              '<div class="couponOne fluid" style="width:6.0933rem;height:1.5733rem;line-height:1.5733rem;background:url('+Setting.staticRoot+'/images/pages/activity/coupon11/coupon.png);background-size:100% 100%;text-align:center;margin-bottom:0.5rem;">',
              '<div style="float:left;width:70%;margin-left:2%;">{{=item.voucherAmt}}元体验金({{=item.enjoyDays}})','</div>',
              '<div style="float:right;width:28%;color:#fff;">1张','</div>',
              '</div>',
            '{{?}}',
            '{{?item.couponType == 1}}',
                '<div class="couponOne fluid" style="width:6.0933rem;height:1.5733rem;line-height:1.5733rem;background:url('+Setting.staticRoot+'/images/pages/activity/coupon11/coupon.png);background-size:100% 100%;text-align:center;margin-bottom:0.5rem;">',
                '<div style="float:left;width:70%;margin-left:2%;">{{=item.addRate}}%天数加息券({{=item.addDays}})','</div>',
                '<div style="float:right;width:28%;color:#fff;">1张','</div>',
                '</div>',
            '{{?}}',
            '{{?item.couponType == 5}}',
                '<div class="couponOne fluid" style="width:6.0933rem;height:1.5733rem;line-height:1.5733rem;background:url('+Setting.staticRoot+'/images/pages/activity/coupon11/coupon.png);background-size:100% 100%;text-align:center;margin-bottom:0.5rem;">',
                '<div style="float:left;width:70%;margin-left:2%;">{{=item.investCouponAmt}}元投资红包','</div>',
                '<div style="float:right;width:28%;color:#fff;">1个','</div>',
                '</div>',
            '{{?}}',
            '{{~}}',
            '<div class="birPour fluid" style="color:#323232;line-height: 0.4933rem;">',
              '<div style="font-weight:bold;font-size:0.3733rem;">使用规则','</div>',
              '<div style="font-size:0.2933rem;">1.所获礼包奖励您可以前往“账户-超值礼券”中查看；','</div>',
              '<div style="font-size:0.2933rem;">2.礼包奖励适用于任意定期产品（新手标除外），100元起投；','</div>',
              '<div style="font-size:0.2933rem;">3.礼包奖励有效期1周，需在到期前使用。','</div>',
            '</div>',
          '</div>',
        '</div>',
        '</div>',
    ].join('');
    var gifts20171111 = sessionStorage.getItem('gifts20171111');
    var gifts20171111Flag = sessionStorage.getItem('gifts20171111Flag');
    var isBirthday = sessionStorage.getItem('isBirthday');
    var birthdayFlag = sessionStorage.getItem('birthdayFlag');
    var pathName = window.location.pathname;
    if(gifts20171111 == 0 && gifts20171111Flag == 1 && (birthdayFlag == 0 || pathName != '/wx/pages/index.html')){
      var list = JSON.parse(sessionStorage.getItem('giftsList'));
      console.log(list)
      $body.append(doT.template(_gifts20171111Data)(list));
      var $gifts = $('.gifts');
      $gifts.css('display','block');
      var gifts = document.getElementsByClassName('gifts')[0];
      console.log(gifts)
      $gifts.click(function(e){
        var e = e ? e : window.event;
        var tar = e.target || e.srcElement;
        if(tar.className == 'giftsBtn'){
          $('.giftsContent').css('display','none');
          $('.giftsCoupon').css('display','block');
          sessionStorage.setItem('gifts20171111Flag',0);
        }else if(tar.className == 'gifts' || tar.className == 'closegift'){
           $gifts.css('display','none');
          sessionStorage.setItem('gifts20171111Flag',0);
        }
      })
    }
    if(pathName == '/wx/pages/index.html'){
      var list = JSON.parse(sessionStorage.getItem('giftsList'));
      console.log(list)
      $body.append(doT.template(_gifts20171111Data)(list));
      var $gifts = $('.gifts');
      var gifts = document.getElementsByClassName('gifts')[0];
      $gifts.click(function(e){
        var e = e ? e : window.event;
        var tar = e.target || e.srcElement;
        if(tar.className == 'giftsBtn'){
          $('.giftsContent').css('display','none');
          $('.giftsCoupon').css('display','block');
        }else if(tar.className == 'gifts' || tar.className == 'closegift'){
           $gifts.css('display','none');
          sessionStorage.setItem('gifts20171111Flag',0);
        }
      })
    }
  }();
});


