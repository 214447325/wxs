 $(function(){
      var param = Common.getParam();
      var currentCycle = 0;
      var differenceOfCurrentCycle = 0;
      var rankingListList = $('.rankingListList');//排名列表
      var visiturl = location.search; //获取url中"?"符后的字串
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
      // var myVideo=document.getElementById("videoMp4");
      // myVideo.play();
       // 排名
      var rankingList = doT.template([
          '{{~it :item:index}}',
            '<tr>',
              '<td>第{{=item.rank}}名</td>',
              '<td>{{=item.name}}</td>',
              '<td>{{=item.phoneNum}}</td>',
             ' <td>{{=item.drawNum}}张</td>',
            '</tr>',
          '{{~}}',
        ].join(''));
      $.ajax({
        url:Setting.apiRoot1 + '/luckyDraw/currentCycleDrawRankInfo.p2p',
        dataType:'json',
        type:'GET',
       }).done(function(res){
          if(res.code == 1){
            rankingListList.html(rankingList(res.data));
          }
      });
      // 周期基本信息
      $.ajax({
        url:Setting.apiRoot1 + '/luckyDraw/currentCycleInfo.p2p',
        dataType:'json',
        type:'GET',
       }).done(function(res){
          if(res.code == 1){
            currentCycle = res.data.currentCycle;
            differenceOfCurrentCycle = res.data.differenceOfCurrentCycle;
            $('.runingTitle').text('第'+res.data.currentCycle+'期');
            $('.text>span').text(res.data.differenceOfCurrentCycle);
            // 效果
            if(res.data.differenceOfCurrentCycle < 80 && res.data.differenceOfCurrentCycle > 0){
               var percentage = (80-res.data.differenceOfCurrentCycle)/80*100;
               $('.waterspout-con').animate({'width':percentage+'%'},1000);
               if(percentage > 10){
                $('.percentage').animate({'width':percentage+'%'},1000);
               }
               var num = 0;
               var time = setInterval(function(){
                num+=1;
                if(num >= percentage){
                  num = percentage;
                  clearInterval(time);
                  $('.percentage').text((80-res.data.differenceOfCurrentCycle)+'张');
                }
               },10);
            }
          }
      });
       // 用户本期抽奖次数名次
       if(!!userId){
        $('.rankingListLogin').html('您当前暂无排名，快去投资，榜上留名吧');
         $.ajax({
          url:Setting.apiRoot1 + '/luckyDraw/u/userCurrentCycleDrawRankInfo.p2p',
          type:'post',
          dataType:'json',
          data:{
            userId:userId,
            loginToken:loginToken
          }
         }).done(function(res){
          console.log(res)
          if(res.code == 1){
            if(res.data.rank == 1){//1.“您当前排名为第1名，秒杀众生”   // 2.“您当前排名为第2~100名，向冠军进发吧”  // 3.“您当前暂无排名，快去投资，榜上留名吧”
              $('.rankingListLogin').html('您当前排名为第1名，秒杀众生');
            }else if(res.data.rank > 1){
              $('.rankingListLogin').html('您当前排名为第'+res.data.rank+'名，向冠军进发吧');
            }else{
              $('.rankingListLogin').html('您当前暂无排名，快去投资，榜上留名吧');
            }
          }else if(res.code == -99){
            $('.rankingListLogin').html('<span class="login">登录后</span>可查看您的排名');
          }
        });
       }
     
      // 历史榜单及奖励
      var paimingList = doT.template([
        '{{~it :item:index}}',
        '<div class="fflineBigBox">',
            '<div class="fflinebox">',
              '<div class="ffline"></div>',
              '<div class="fflineTitle">第{{=item.cycle}}期</div>',
              '<div class="ffline"></div>',
           ' </div>',
           '{{?item.rank == 0}}',
              '<div style="font-size:0.32rem;text-align:center;margin-top:0.2rem;">您此期无排名</div>',
           '{{??}}',
              '<div style="font-size:0.32rem;text-align:center;margin-top:0.2rem;">您此期排名为第<span>{{=item.rank}}</span>名</div>',
            '{{?}}',
            '<div style="font-size:0.2933rem;"><span style="display:inline-block;width:50%;text-align:right;">最佳投资奖：</span><span style="display:inline-block;width:50%">{{=item.investorName}} {{=item.investorPhoneNum}}</span></div>',
            '<div style="font-size:0.2933rem;"><span style="display:inline-block;width:50%;text-align:right;">最佳幸运奖：</span><span style="display:inline-block;width:50%">{{=item.luckyName}} {{=item.luckyPhoneNum}}</span></div>',
         '</div>',
         '{{~}}',
      ].join(''));

       // 分享
      var imgurl = 'http://106.15.44.101/group1/M00/00/16/ag8sZVoFWMKASrtvAAFDVV4bz0Q067.png';
      var title = '幸运V榜单';
      var desc = '投资加息还抽现金，现在才告诉我？！';
      var link = Setting.staticRoot + '/pages/activity/luckyV/luckyV.html';
      share.shareFixed(imgurl, title, desc, link, "888");
      var shareButton = $("#share");
      Common.share(shareButton,'/pages/invite/luckyVfenxiang.html');

      $('body').on('click', '.share', function(event) {
          $(this).remove();
      });
      // 活动规则
      $('#guizeButton').on('click',function(){
        $('.guize').css('display','block')
      })
      $('.closeguize').on('click',function(){
        $('.guize').css('display','none');
        $('.bangdan').css('display','none');
      })
      // 立即投资参赛
      $('#button1').on('click',function(){
          if(!userId){
            var href = window.location.href;
            window.location.replace(Setting.staticRoot + '/pages/account/login.html?from=' + encodeURIComponent(href));
          }else{
            window.location.href = Setting.staticRoot + '/pages/financing/regular.html'
          }
      });
      // 登录
      $('.login').on('click',function(){
          var href = Setting.staticRoot + '/pages/activity/luckyV/luckyV.html';
          window.location.replace(Setting.staticRoot + '/pages/account/login.html?from=' + encodeURIComponent(href));
      });
      // 往期获奖名单
      $('#button2').on('click',function(){
          if(!userId){
            var href = window.location.href;
            window.location.replace(Setting.staticRoot + '/pages/account/login.html?from=' + encodeURIComponent(href));
          }else{
            if(currentCycle > 1){
                $.ajax({
                  url:Setting.apiRoot1 + '/luckyDraw/u/historicalReward.p2p',
                  type:'post',
                  dataType:'json',
                  data:{
                    userId:userId,
                    loginToken:loginToken
                  }
                 }).done(function(res){
                  console.log(res)
                  console.log(res.code )
                  Common.ajaxDataFilter(res,function(){
                    if(res.code == 1){
                      var data = res.data;
                      $('#paimingList').html(paimingList(data));
                      $(".bangdan").css('display','block');
                    }
                  })
                });
            }else{
              alert('第一期未满标，暂无法查看');
            }
          }
      });
      // 抽奖直播
      $('#button3').on('click',function(){
          if(currentCycle > 1){
            window.location.href = 'https://www.yizhibo.com/l/AvjdJaYe6jLs3fdT.html';
          // window.location.replace(Setting.staticRoot + '/pages/account/login.html?from=' + encodeURIComponent(href));
          }else{
            alert('第一期抽奖未开始，请耐心等待');
          }
      });
        

    });