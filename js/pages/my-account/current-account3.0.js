/**
 * Created by User on 2016/9/5.
 */
$(function() {
    var param = Common.getParam();//解析url参数
    var $todayData = $('.todayData');//昨日收益
    var userId = sessionStorage.getItem('uid');//获取用户id
    var validName =sessionStorage.getItem('validName');//获取用户实名
    var validTrade =sessionStorage.getItem('validTrade');//获取用户交易密码
    var $accumulatedMoney = $('.accumulatedMoney');//累计收益
    var $hadShare = $('.principalMoney');//在投本金
    var $totalRate = $('.annualData');//昨日综合年化收益率
    var $tb_title1=$('.todayMoneycontent');//昨日资金表title
    var $tb_title2=$('.couponUselist');//加息券使用表title
    var $todayTableContent = $('.todayTableContent');//昨日资金收益明细表
    var $couponContent=$('.couponContent');//加息券使用明细表
    var $returnPage = $('.returnImg');//返回上一页
    var $cortfolioContent = $('.cortfolioContent');//点击七天乐组合
    var $redemption = $('.redemption');//点击赎回按钮
    var $buy = $('.buy');//7天乐购买界面
    var $ui_dialog_name = $('.ui-dialog-name');
    var $btn_link_name  = $('.btn-link-name',$ui_dialog_name);
    var $btn_default_name = $('.btn-default-name',$ui_dialog_name); 

    var $ui_dialog_trade = $('.ui-dialog-trade');
    var $btn_link_trade  = $('.btn-link',$ui_dialog_trade);
    var $btn_default_trade = $('.btn-default',$ui_dialog_trade); 

    var $world = $('.world');
    var currentSwitch;
    var hadShare = 0;
    var currentxAxis = [];
    var currentyAxis = [];

    // 是否可以购买周周涨
    var currentEndTime;//结束时间
    var currentStartTime;//开始时间
    var currentTime;//服务器当前时间
    var currentStartTimeAlert;
    var cAmount;

    if(!userId){
        Common.toLogin();
        return false;
    }


    $.ajax({
        url: Setting.apiRoot1 + '/u/queryMyCurrentDetail.p2p',
        type: 'post',
        async:false,
        dataType: 'json',
        data:{
            userId:userId,
            loginToken:sessionStorage.getItem('loginToken')
        }
    }).done(function(res){
        Common.ajaxDataFilter(res,function(){
            if(res.code == 1) {
                currentSwitch=res.data.currentSwitch;
                var _data = res.data;
                $todayData.html(Common.comdify(parseFloat(_data.yesterdayIncome).toFixed(2)));//昨日收益
                $accumulatedMoney.html(Common.comdify(parseFloat(_data.totalInterest).toFixed(2)));//累计收益
                hadShare = _data.hadShare;
                $hadShare.html(Common.comdify(parseFloat(hadShare).toFixed(2)));//在投本金
                $totalRate.html((_data.totalRate).toFixed(2) + '%');

                var money = parseFloat(hadShare).toFixed(2);
                if(money == 0.00) {
                    $redemption.removeClass('blue');
                }

                var incomelist = _data.Incomelist;
                var _html = '';
                if(incomelist != null && incomelist != '') {
                    for (var i = 0; i < incomelist.length; i++) {
                        _html = _html + '<div class="contentTr">' +
                                        '<div class="contentTc1">' + Common.comdify(parseFloat(incomelist[i].amount).toFixed(2)) + '</div>' +
                                        '<div class="contentTc2">' + incomelist[i].rate  + '%</div>' +
                                        '<div class="contentTc3">' + parseFloat(incomelist[i].tradeAmount).toFixed(2) + '</div>' +
                                        '</div>';
                    }
                    $todayTableContent.html(_html);
                } else {
                    noData();
                }

                $.ajax({
                    url:Setting.apiRoot1 + '/checkHuoQiBuyStatus.p2p',
                    type: 'post',
                    async:false,
                }).done(function(res){
                    if(res.code == 1){
                        var dataCurrent = res.data;
                        var date = new Date();
                        var fullYear= date.getFullYear();
                        var month= date.getMonth() + 1;
                        var day= date.getDate();
                        currentStartTimeAlert = dataCurrent.currentStartTime;
                        currentEndTime = new Date(fullYear +'/'+ month +'/'+day+' '+dataCurrent.currentEndTime).getTime();//结束时间
                        currentStartTime = new Date(fullYear +'/'+ month +'/'+day+' '+dataCurrent.currentStartTime).getTime();//开始时间
                        currentTime = new Date(fullYear +'/'+ month +'/'+day+' '+dataCurrent.currentTime).getTime();//服务器当前时间
                        cAmount = dataCurrent.currentVoteAmt;//可投余额
                        // 抢购倒计时（暂时取消）
                        // setInterval(function(){
                        //     currentTime += 1000;
                        //     var btnClolor = $('.buy_btn').css('background');
                        //     var btnText = $('.buy_btn').text();
                        //     // 可以购买的情况
                        //     if (currentStartTime <= currentTime &&  currentTime <= currentEndTime) {
                        //         if(parseFloat(cAmount) > 0){
                        //             if(btnClolor != '#3E50B3'){
                        //                 $('.buy>button').css('color','#3E50B3');
                        //             }
                        //             if(btnText != '购买'){
                        //                 $('.buy>button').text('购买');
                        //             }
                        //         }else{
                        //             if(btnClolor != '#CBCBCB'){
                        //                 $('.buy>button').css('color','#CBCBCB');
                        //             }
                        //             if(btnText != '今日已售罄'){
                        //                 $('.buy>button').text('今日已售罄');
                        //             }
                        //         }
                                    
                        //     }else {
                        //         if(currentStartTime > currentTime){//未开始
                        //             if(btnClolor != '#CBCBCB'){
                        //                 $('.buy>button').css('color','#CBCBCB');
                        //             }
                        //             if(btnText != '购买'){
                        //                 $('.buy>button').text('购买');
                        //             }
                        //         }else if(currentEndTime < currentTime){//已结束
                        //             if(btnClolor != '#CBCBCB'){
                        //                 $('.buy>button').css('color','#CBCBCB');
                        //             } 
                        //             if(btnText != '今日已结束'){
                        //                 $('.buy>button').text('今日已结束');
                        //             }
                        //         }
                        //     }
                        // },1000);
                    }
                })
            }
        });
    });


    $.ajax({
        url: Setting.apiRoot1 + '/u/getMyCurrentCoupon.p2p',
        type: 'post',
        async:false,
        dataType: 'json',
        data:{
            userId:userId,
            loginToken:sessionStorage.getItem('loginToken')
        }
    }).done(function(res){
        Common.ajaxDataFilter(res,function(){
            if(res.code == 1) {
                var  coupondata=res.data;
                var couponhtml = '';
                if(coupondata != null && coupondata != '') {
                    for (var i = 0; i < coupondata.length; i++) {
                        couponhtml = couponhtml + '<div class="contentTr">' +
                                        '<div class="contentTc1">' + coupondata[i].addRate + '%</div>' +
                                        '<div class="contentTc2">' + coupondata[i].addDays  + '</div>' +
                                        '<div class="contentTc3">' + coupondata[i].useTime + '</div>' +
                                        '</div>';
                    }
                    console.log(couponhtml);
                    $couponContent.html(couponhtml);
                }
            }
        });
    });


    function noData() {
        var _noHtml = '';
        _noHtml = _noHtml + '<div class="null">' +
                    '<img class="nullImg" src="../../../images/pages/my-account3.0/null3.0.png">' +
                    ' <p>暂无记录</p>' +
                    '</div>';
        $todayTableContent.html(_noHtml);
    }

        //开关为0不显示切换
        if (currentSwitch==0) {
            $('.todayTable').show();
            $('.addrateTable').hide();  
            $('.line').hide();   
            $('.couponUselist').hide();
            $('.usecoupon').hide();            
        }else{
                //点击$tb_title1  切换到资金明细
                $tb_title1.click(function() {
                    $('.todayTable').show();
                    $('.addrateTable').hide();
                    $('.todayMoneycontent').addClass('active');
                    $('.couponUselist').removeClass('active');
                });
                //点击$tb_title2  切换到加息券使用明细
                $tb_title2.click(function() {
                    $('.addrateTable').show();
                    $('.todayTable').hide();
                    $('.couponUselist').addClass('active');
                    $('.todayMoneycontent').removeClass('active');
                });      
        }


    //7天乐资产组合
    $cortfolioContent.click(function() {
        window.location.href = '../../my-account/current/currentPortfolio3.0.html?hadShare='+ hadShare;
    });

    //7天乐的详情界面
    $world.click(function() {
        window.location.href = '../../my-account/current/current-account-detail3.0.html';
    });

    //页面返回上一页按钮
    $returnPage.click(function() {
        window.location.href = '../../../pages/my-account/myAccount.html';
    });

    $('.usecoupon').click(function() {
        window.location.href = '../../../pages/my-account/account-current-coupon.html';
    });

    //7天乐赎回
    $redemption.click(function() {
        // if($(this).hasClass('blue')) {
            window.location.href = '../../my-account/current/redemption3.0.html';
        // }

    });
    //7天乐购买
    $buy.click(function() {
        alert('产品已下架');
     /*   if(!userId){
            Common.toLogin();
            return false;
        }
        if(currentStartTime <= currentTime &&  currentTime <= currentEndTime){//可以抢购
            if(parseFloat(cAmount) > 0){
                if (validName!=1) {
                  $ui_dialog_name.removeClass('hide');
                   $btn_link_name.attr('href',Setting.staticRoot + '/pages/my-account/setting/real-name.html');
                  $btn_default_name.attr('href',Setting.staticRoot + '/pages/my-account/current/current-account.html');
                  return false;
                }
                if (validTrade!=1) {
                  $ui_dialog_trade.removeClass('hide');
                   $btn_link_trade.attr('href',Setting.staticRoot + '/pages/my-account/setting/dealPassword-setting.html');
                  $btn_default_trade.attr('href',Setting.staticRoot + '/pages/my-account/current/current-account.html');  
                  return false;          
                }
                if (validTrade==1 && validName==1) {
                    Common.queryProductInfo(1,1, function(res){
                        if(res.code != 1){
                            alert(res.message);
                            return false;
                        }
                        var data = res.data[0];
                        var _data = {
                            pid: data.productId,
                            pname: data.title,
                            pmount: data.amount,
                            minInterest: data.minInterest,
                            minInvestAmount: data.minInvestAmount,
                            maxInvestAmount: data.maxInvestAmount,
                            type:'current'
                        };
                        window.location.href = Setting.staticRoot+'/pages/financing/currentbuy3.0.html?' +"jumpId=2&"+ $.param(_data);
                    });            
                }
            }else{
                alert('今日已售罄，明天再来吧')
            }
        }else{
            if(currentStartTime > currentTime){//未开始
                alert('客官，抢购'+ currentStartTimeAlert +'开始哦');
            }else if(currentEndTime < currentTime){//已结束
               alert('今日已结束，明天再来吧');
            }
        }*/
    });


            $.ajax({
              url: Setting.apiRoot1 + '/u/queryInterestByProdType.p2p',
              type: 'post',
              dataType: 'json',
              async:false,
              data:{
                  userId:userId,
                  prodType:1,
                  pageNum:1,
                  pageSize:30,
                  loginToken:sessionStorage.getItem('loginToken')
              }
          }).done(function(res){
              Common.ajaxDataFilter(res,function(){
                  if(res.code == -1){
                      alert('查询失败');
                      return false;
                  }
                  var data=res.data;
                  if(data!=null && data.length>0){
                     for(var i=0; i<data.length;i++){
                         var dateStr = data[i].dateStr;
                         currentxAxis[i]=dateStr;
                         //alert(currentxAxis[i]);
                         var interestAmount = data[i].interestAmount;
                         currentyAxis[i]=interestAmount;
                         //alert(currentyAxis[i]);
                     }    
                  }
              })

          }).fail(function(){
          alert('网络链接失败');
          });

          /**
           * [arraySort description] 数组排序
           * @param  {[type]} array [description]
           * @return {[type]}       [description]
           */
          function arraySort(array){
            for(var i=0;i<array.length;i++){
                for(var j = i + 1;j<array.length;j++){
                    if(array[i]>array[j]){
                        var tmp = array[i];
                        array[i] = array[j];
                        array[j] = tmp;
                    }
                }
            }
            return array;
          }
         var currentmaxY=arraySort(currentyAxis)[currentyAxis.length-1];
    //图表
    if (currentxAxis.length>0) {
                            // Highcharts.chart('container', {
                            //     chart: {
                            //         type: 'line'
                            //     },
                            //     title: {
                            //         align:'left',
                            //         text: '历史收益',
                            //         style: {
                            //             color: 'rgb(200,200,200)',
                            //             fontWeight: 'bold',
                            //             fontSize:'0.35rem'
                            //         }
                            //     },
                            //     credits: {
                            //     enabled: false
                            //     },
                            //     xAxis: {
                            //         //categories:  ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
                            //         categories:  currentxAxis,
                            //         tickWidth: 0,
                            //         labels: {
                            //                 style: {
                            //                 // color: '#19a0f5',//颜色
                            //                 fontSize:'0.35rem'  //字体
                            //                 }
                            //         },
                            //     },
                            //     yAxis: {
                            //         title: {
                            //             text: ''
                            //         },
                            //         labels: {
                            //                 style: {
                            //                 // color: '#19a0f5',//颜色
                            //                 fontSize:'0.35rem'  //字体
                            //                 }
                            //         },
                            //         // gridLineWidth: 0
                            //     },
                            //     tooltip: {
                            //          backgroundColor: 'rgb(255,255,255)',
                            //          borderColor: 'rgb(78,115,255)',
                            //          shadow: false,
                            //          hideDelay: 0,
                            //         // dateTimeLabelFormats: {
                            //         //     second: '%H:%M:%S',
                            //         //     minute: '%H:%M',
                            //         //     hour: '%H:%M',
                            //         //     day: '%Y-%m-%d',
                            //         //     week: '%m-%d',
                            //         //     month: '%Y-%m',
                            //         //     year: '%Y'
                            //         // },
                            //         pointFormat: '{point.y}',
                            //         fontColor:'rgb(78,115,255)',
                            //     },
                            //      legend: {
                            //         enabled: false
                            //     },
                            //     plotOptions: {
                            //         area: {
                            //             fillColor: {
                            //              linearGradient: {
                            //                 x1: 0,
                            //                 y1: 0,
                            //                 x2: 0,
                            //                 y2: 1
                            //             },
                            //             stops: [  
                            //                         [0, 'rgba(124,151,252,0.5)'],  
                            //                         [1, 'rgba(255, 255, 255,0.5)']  
                            //                     ]  
                            //             },
                            //             marker: {
                            //                 radius: 2
                            //             },
                            //             lineWidth: 1,
                            //             states: {
                            //                 hover: {
                            //                     lineWidth: 1
                            //                 }
                            //             },
                            //             threshold: null
                            //         }
                            //     },
                            //     series: [{
                            //         type: 'area',
                            //         name: '周周涨',
                            //         //data: [7.0, 6.9, 9.5, 14.5, 18.4, 21.5, 25.2, 26.5, 23.3, 18.3, 13.9, 9.6]
                            //         data:currentyAxis,
                            //     },]
                            // }); 
                            Highcharts.chart('container', {
                                chart: {
                                    type: 'line'
                                },
                                title: {
                                    align:'left',
                                    text: '历史收益',
                                    y:18, //x轴刻度往下移动20px
                                    style: {
                                        color: 'rgb(200,200,200)',
                                        fontWeight: 'bold',
                                        fontSize:'0.25rem'
                                    }
                                },
                                credits: {
                                enabled: false
                                },
                                xAxis: {
                                    categories: currentxAxis,
                                    tickInterval: 5,
                                    tickWidth: 0,
                                    labels: {
                                    y: 40, //x轴刻度往下移动20px
                                    style: {
                                        fontSize:'0.3rem'  //字体
                                    }
                                    },
                                },
                                yAxis: {
                                    max: currentmaxY,
                                    title: {
                                        text: ''
                                    },
                                    labels: {
                                    y: 3, //x轴刻度往下移动20px
                                    style: {
                                        fontSize:'0.3rem'  //字体
                                    }
                                    },
                                    // gridLineWidth: 0
                                },
                                // tooltip: {
                                //      backgroundColor: 'rgb(255,255,255)',
                                //      borderColor: 'rgb(78,115,255)',
                                //      shadow: false,
                                //      hideDelay: 0,
                                //     // dateTimeLabelFormats: {
                                //     //     second: '%H:%M:%S',
                                //     //     minute: '%H:%M',
                                //     //     hour: '%H:%M',
                                //     //     day: '%Y-%m-%d',
                                //     //     week: '%m-%d',
                                //     //     month: '%Y-%m',
                                //     //     year: '%Y'
                                //     // },
                                //     pointFormat: '{point.y}',
                                //     fontColor:'rgb(78,115,255)',
                                // },
                                tooltip: {
                                enabled: true,
                                backgroundColor: 'rgb(78,115,255)',
                                fontColor:'rgb(78,115,255)',
                                pointFormat: '{point.y}',
                                // pointFormatter: function() {
                                // return '<span style="font-size: 0.3rem">'+this.y+'</span>'
                                // },
                                style: {                      // 文字内容相关样式
                                color: "rgb(255,255,255)",
                                fontWeight: "blod",
                                }
                                
                                },
                                 legend: {
                                    enabled: false
                                },
                                plotOptions: {
                                    line: {
                                        dataLabels: {
                                            enabled: true
                                        },
                                        enableMouseTracking: false
                                    }
                                },
                                series: [{
                                    type: 'area',
                                    name: '周周涨',
                                    data: currentyAxis,
                                    color: {  
                                         linearGradient: {
                                            x1: 0,
                                            y1: 0,
                                            x2: 0,
                                            y2: 1
                                        },
                                        stops: [  
                                                    [0, 'rgb(124,151,252)'],  
                                                    [1, 'rgba(255, 255, 255,0.5)']  
                                                ]    
                                    } 


                                }]
                            });
       
    } else {
                $('#container').html('暂无数据');
    }

                            // $('#container').highcharts({
                            //     chart: {
                            //         zoomType: 'x'
                            //     },
                            //     title: {
                            //         align:'left',
                            //         text: '历史收益'
                            //     },
                            //     credits: {
                            //     enabled: false
                            //     },
                            //     xAxis: {
                            //         type: 'datetime',
                            //         dateTimeLabelFormats: {
                            //             // millisecond: '%H:%M:%S.%L',
                            //             // second: '%H:%M:%S',
                            //             // minute: '%H:%M',
                            //             // hour: '%H:%M',
                            //             // day: '%m-%d',
                            //             // week: '%m-%d',
                            //             // month: '%Y-%m',
                            //             // year: '%Y'
                            //             day: '%e of %b'
                            //         },
                            //         //categories:currentxAxis,
                            //         tickWidth: 0
                            //     },
                            //     tooltip: {
                            //          backgroundColor: 'rgb(78,115,255)',
                            //          borderColor: 'rgb(78,115,255)',
                            //          shadow: false,
                            //          hideDelay: 0,
                            //         dateTimeLabelFormats: {
                            //             second: '%H:%M:%S',
                            //             minute: '%H:%M',
                            //             hour: '%H:%M',
                            //             day: '%Y-%m-%d',
                            //             week: '%m-%d',
                            //             month: '%Y-%m',
                            //             year: '%Y'
                            //         },
                            //         pointFormat: '{point.y}',
                            //         fontColor:'#fff',
                            //     },
                            //     yAxis: {
                            //         title: {
                            //             text: ''
                            //         },
                            //         //data:currentyAxis,
                            //         gridLineWidth: 0
                            //     },
                            //     legend: {
                            //         enabled: false
                            //     },
                            //     plotOptions: {
                            //         area: {
                            //             fillColor: {
                            //                 linearGradient: {
                            //                     x1: 0,
                            //                     y1: 0,
                            //                     x2: 0,
                            //                     y2: 1
                            //                 },
                            //                 stops: [
                            //                     [0, Highcharts.getOptions().colors[0]],
                            //                     [1, Highcharts.Color(Highcharts.getOptions().colors[0]).setOpacity(0).get('rgba')]
                            //                 ]
                            //             },
                            //             marker: {
                            //                 radius: 2
                            //             },
                            //             lineWidth: 1,
                            //             states: {
                            //                 hover: {
                            //                     lineWidth: 1
                            //                 }
                            //             },
                            //             threshold: null
                            //         }
                            //     },
                            //     series: [{
                            //         type: 'area',
                            //         name: '收益',
                            //         data: [1,6,8,2,9,8,7]
                            //     }]
                            // });
});