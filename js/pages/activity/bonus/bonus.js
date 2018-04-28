 $(function(){
      var param = Common.getParam();
      var userId = sessionStorage.getItem('uid');
      var loginToken = sessionStorage.getItem('loginToken');
      var type = param.type;
      if(type != null && type != undefined && type > 0){
        if(param.uid != null && param.uid != undefined && param.uid != 'null' && param.uid.length>0){
          userId = param.uid;
          sessionStorage.setItem('uid',param.uid);
        }
        if(param.loginToken != null && param.loginToken != undefined && param.loginToken != 'null' && param.loginToken.length>0){
          loginToken = param.loginToken;
          sessionStorage.setItem('loginToken',param.loginToken);
        }
      }

       // 分享
      var imgurl = 'http://106.15.44.101/group1/M00/00/1E/ag8sZVqfuzSAX32CAAEKk97DsMs468.png';
      var title = '狗年旺旺 步步高升';
      var desc = 'V金融三月理财季，限时加息，高额返现等你来！';
      var link = Setting.staticRoot + '/pages/activity/bonus/index.html';
      share.shareFixed(imgurl, title, desc, link, "888");
      // var shareButton = $("#share");
      // Common.share(shareButton,'/pages/invite/luckyVfenxiang.html');
      $('.close').on('click',function(){
        $('.ui-alert').addClass('hide');
      });
      $('.listimg').on('click',function(){
        var index = $(this).attr('src').substr(43);
        switch(index){
          case 'jiaxi.png':$('.jiaxi').removeClass('hide');break;
          case 'hongli.png':$('.hongli').removeClass('hide');break;
          case 'fanxian.png':$('.fanxian').removeClass('hide');break;
        }
      });
      // 滑动
      var el = document.querySelector('.Slide');
      var startPosition,endPosition,deltaX,deltaY,moveLength;
      var num = 1;
      var juli = 0;
      el.addEventListener('touchstart', function(e){
        var touch = e.touches[0];
        startPosition = {
          x:touch.pageX,
          y:touch.pageY
        }
      });
      el.addEventListener('touchmove', function(e){
        var touch = e.touches[0];
        endPosition = {
          x:touch.pageX,
          y:touch.pageY,
        };
        deltaX = endPosition.x - startPosition.x;
        deltaY = endPosition.y - startPosition.y;
        moveLength = Math.sqrt(Math.pow(Math.abs(deltaX),2) + Math.pow(Math.abs(deltaY),2))
      })
      el.addEventListener('touchend', function(e){
        var touch = e.touches[0];
        if(deltaX > 1){
          juli  = juli + 2.49;
          num = num - 1;
          if(juli <= 2.48){
            el.style.transform = 'translatex('+juli+'rem)';
          }else{
            juli = 0;
            num = 1;
          }
          $('.rate').html(num/10);
        }
        if(deltaX < 1){
            juli  = juli -2.49;
            num = num + 1;
          if(juli >= -22.42){
            el.style.transform = 'translatex('+juli+'rem)';
          }else{
            juli = -22.41;
            num = 10;
          }
          $('.rate').html(num/10);
        }

      });
      $('.zhuanxiang').on('click',function(){
        var weekNum = 8;
        var week = $(this).index();
        switch(week){
          case 0: weekNum = 8;break;
          case 1: weekNum = 12;break;
        }
        $.ajax({
            url:Setting.apiRoot1 + '/getCurrentRegularIdByLoanCycle.p2p',
            type:'GET',
            data:{
                loanCycle:weekNum
            }
        }).done(function(res){
            if(res.code == 1){
              if(userId == null || userId == '' || loginToken == null || loginToken == ''){
                  if(type == 1){
                    window.AndroidWebView.IsLogin();
                  }else if(type == 2){
                    iOS.HtmlJumpLogin();
                  }else{
                    var href = window.location.href;
                    window.location.href = '../../../pages/account/login.html?from=' + encodeURIComponent(href);
                  }
              }else{
                  if(type == 1){
                    window.AndroidWebView.setBuy(res.data);
                  }else if(type == 2){
                    iOS.HtmlJumpRegularBuyVCAndProdId(res.data)
                  }else{
                    window.location.href = '../../../pages/financing/buy3.0.html?pid='+ res.data;
                  }
             }
            }else{
                alert(res.message);
            }
        }).fail(function(){
             alert('网络连接失败')
        });
    })
    });