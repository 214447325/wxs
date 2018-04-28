/*
* @Author: User
* @Date:   2016-08-31 17:18:19
* @Last Modified by:   User
* @Last Modified time: 2016-11-09 16:39:03
*/

$(function(){

var isWeiXin = Common.isWeiXin();//微信进来的访问判断，不是跳转到官网下载页
var param = Common.getParam();//param取url参数
var userId = sessionStorage.getItem('uid');//session取uid
var loginToken = sessionStorage.getItem('loginToken');//session取uid
var payChanel = sessionStorage.getItem('payChannel');//session取payChanel

var newUser=param.newUser;//app端用户是否首次登录;
var $account = $('.myAccount');//body
var $investment = $('.investment');
var $totalIncome = $('.totalIncome');
var $accountAmt = $('.accountAmt');
var inUseAmt;//在投总额 queryMyAccountInfo接口
var totalIncome;//累计收益
var accountAmt;//可用余额
var rankVip;//用户等级
var circledata = [{//圆环默认值 自动计算百分比
	value: 100,
	name: '周周涨'
}, {
	value: 100,
	name: '浮动收益'
}, {
	value: 100,
	name: '固定收益'
}];
var currentxAxis = [];
var currentyAxis = [];
var regularxAxis = [];
var regularyAxis = [];
var floatxAxis = [];
var floatyAxis = [];
var regularLength;

//zyx 20160920 begin
var displayNav = sessionStorage.getItem('displayNav');//APP端是否显示导航;
var version= sessionStorage.getItem('version');//APP端版本号;
if (version==null || version ==undefined || version=='') {
    version=param.version;
    if(version!=null){
            sessionStorage.setItem('version',version);
        }
}
if(displayNav==null || displayNav==undefined || displayNav==''){
	displayNav = param.displayNav;
	if(displayNav==0){
		sessionStorage.setItem('displayNav',displayNav);
	}
}
userId = param.userId;//session取uid
loginToken = param.loginToken;//session取uid

if (userId==undefined ||userId==null ||userId=='') {
//    userId=param.userId;
//    loginToken=param.loginToken;
	userId = sessionStorage.getItem('uid');//session取uid
	loginToken = sessionStorage.getItem('loginToken');//session取uid
}
//请求时间戳
var timestamp = Date.parse(new Date());
//zyx 20160920 end 

if (displayNav==0) {
    $('.nav').hide();
    $(".btn-container").css("marginTop","1rem");
    if (version==null || version=='' || version<3.1) {
        $('.top-right').removeClass('top-right').addClass('top-right-past').html('<img src="../../images/pages/my-account3.0/icon3.0.png" class="icon-right">');
    }
    if (version==null || version=='' || version<3.2) {
        $('.top-privilege').hide();
        $('.top-award').hide();
    }
} else {
    $('.btn-container').addClass('container');
    $('.charts').addClass('char');
}


if (newUser==1 || newUser==undefined || newUser==null ||newUser=='') {
    $('.newUser').hide();
}
if (newUser==0) {
    $('.newUser').show();
    $account.on('click', '.new1', function(){
        $('.new1').hide();
    });
    $account.on('click', '.new2', function(){
        $('.new2').hide();
    });
    $account.on('click', '.new3', function(){
        $('.new3').hide();
    });
    $account.on('click', '.new4', function(){
        $('.new4').hide();
    });
}

//alert(userId);
//alert(loginToken);

	if(!userId){
	Common.toLogin();
	return false;
	}
	
	// 我的账户信息总览
	$.ajax({
	url:Setting.apiRoot1 + '/u/queryMyAccountInfo.p2p',
	type:"post",
	async:false,
	dataType:'json',
	data:{
		userId: userId,
		loginToken:loginToken,
		guid:timestamp
		
	}
	}).done(function(res){
	Common.ajaxDataFilter(res,function(){
	  if(res.code==1){
	    var data = res.data;
	    inUseAmt=parseFloat(data.inUseAmt).toFixed(2);//在投总额
	    totalIncome=parseFloat(data.totalIncome).toFixed(2);//累计收益
	    accountAmt=parseFloat(data.accountAmt).toFixed(2);//可用余额
	    circledata[0].value=data.curHoldAmount;//周周涨在投金额
	    circledata[1].value=data.floatHoldAmt;//固收在投金额
	    circledata[2].value=data.regularHoldAmt;//浮动在投金额
                couponCount=data.couponCount;
                inviteNumber=data.inviteNumber;
                rankVip=data.rankVip;
                if (rankVip==0) {
                    $('.privilege').html('普通会员');
                }else{
                    $('.privilege').html('V'+rankVip+'会员');
                }
	      
	  }else{
	    alert(res.message);
	      return false;
	  }
	  
	  //默认显示周周涨 zyx 
	  drawCurrent();
	  
	  
	})
	}).fail(function(){
	alert('网络链接失败');
	return false
	});  
	//渲染圆环  
	var myChart = echarts.init(document.getElementById('main'));
	var option = {
		series: [{
			name: '收益',
			type: 'pie',
			radius: ['55%', '65%'],
	                     center: ['50%', '50%'],
			hoverAnimation: false,
			selectedMode: 'single',
			label: {
				normal: {
					formatter: '{c}\n{b} >',
	                                            textStyle:{
	                                                fontSize:10
	                                            }
				}
			},
	                    labelLine: {
	                        normal: {
	                            smooth: 0,
	                            length: 3,
	                            length2: 60
	                        }
	                    },
			data: circledata
		}],
	                color:['rgb(70,103,236)','rgb(172,188,253)','rgb(255,142,101)'],
	                backgroundColor:'#fff',
	                animationDuration:3000
	};
	myChart.setOption(option);
	
    $("#main").each(function(){  
        $(this).click(function(event){ 
        drawCurrent();            
        });  
    });
	myChart.on('click', function(params) {
		currentxAxis = [];
		currentyAxis = [];
		regularxAxis = [];
		regularyAxis = [];
		floatxAxis = [];
		floatyAxis = [];
		desdroy();
		
		if (params.name=='浮动收益') {
			
			$('#floatChart').show();
			$('#currentChart').hide();
			$('#regularChart').hide();
			$('.check span').html('浮动收益');
                                      $('.check .word').html('收益详情');
	                     $('.check').attr("href",'../../pages/financing/my-float.html');
	         drawFloat();
	
		}
		if (params.name=='周周涨') {
			
			$('#currentChart').show();
			$('#floatChart').hide();
			$('#regularChart').hide();
	                         $('.check span').html('周周涨');
                                      $('.check .word').html('购买、赎回');
			$('.check ').attr('href', '../../pages/my-account/current/current-account.html');
			drawCurrent();
		}
		if (params.name=='固定收益') {
			
			$('#regularChart').show();
			$('#floatChart').hide();
			$('#currentChart').hide();
	                         $('.check span').html('固定收益'); 
                                     $('.check .word').html('持有详情');
			$('.check').attr('href', '../../pages/my-account/my-product.html');
			drawRegular();
		}
	    
	});
   
	//设置页面数据
	$investment.html(Common.comdify(inUseAmt));//圆环内部 在投总额
	$totalIncome.html(Common.comdify(totalIncome));//累计收益
	$accountAmt.html(Common.comdify(accountAmt));//可用余额
	
	var timestamp = Date.parse(new Date()); 
	var freshTime = sessionStorage.getItem('freshTime');
	var fresh = 0;
	if(freshTime==null || freshTime=='' || freshTime==undefined  || timestamp-freshTime>1000*60){
    //TODO *30
    fresh = 1;
    sessionStorage.setItem('freshTime',timestamp);
	}else{

            var cx = sessionStorage.getItem('sscurrentxAxis');
            if(cx!=null && cx.length>1)
                currentxAxis = cx.split(',');
            var cy = sessionStorage.getItem('sscurrentyAxis');
            if(cy!=null && cy.length>1)
                currentyAxis = cy.split(',');
            var rx = sessionStorage.getItem('ssregularxAxis');
            if(rx!=null && rx.length>1)
                regularxAxis = rx.split(',');
            var ry = sessionStorage.getItem('ssregularyAxis');
            if(ry!=null && ry.length>1){
                regularyAxis = [];
                 
            }
                
            
            var fx = sessionStorage.getItem('ssfloatxAxis');
            if(fx!=null && fx.length>1)
                floatxAxis = fx.split(',');
            var fy = sessionStorage.getItem('ssfloatyAxis');
            if(fy!=null && fy.length>1)
                floatyAxis = fy.split(',');

            fresh = 0;
	}

//账户echarts
//周周涨历史收益图表
//if(fresh==1){
//	drawCurrent();
//}
////固收收益详情图表
//if(fresh!=3){
//	drawRegular();
//}
////浮动收益净值图表
//if(fresh!=3){
//	drawFloat();
//}
//TODO
function desdroy(){
	document.getElementById('currentChart').innerHTML = '';
	document.getElementById('regularChart').innerHTML = '';
	document.getElementById('floatChart').innerHTML = '';
	
}

function drawCurrent(){
	
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
          loginToken:loginToken,
          guid:timestamp
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

  var percent=100-7/currentxAxis.length*100;
  var currentmaxY=arraySort(currentyAxis)[currentyAxis.length-1];
    for(var i=0;i<1;i++){
    	 var currentChart = echarts.init(document.getElementById('currentChart'));

         option = {
             tooltip: {
                 trigger: 'axis',
                 show:false
             },
             title: {
                 left: 'left',
                 text: '历史收益',
                 textStyle:{
                 	color:'#bababa',
                 	fontWeight:'normal',
                 	fontFamily:'sans-serif',
                 	fontSize:'0.4rem'
                 }
             },
             legend: {
                 top: 'bottom',
                 data:['意向']
             },
             xAxis: {
                 type: 'category',
                 axisLine:{
                 	show:false
                 },
                 axisTick:{
                 	show:false
                 },	
                 boundaryGap:false,
                 axisLabel : {
         	        interval:(currentxAxis.length>7?1:0),//X轴是否间隔显示
         	        fontSize :6,
         	        textStyle:{
         	        	color:"#bababa"
         	        }
                 },
                    //data:  ['08/01','08/02','08/03','08/04','08/05','08/06','08/07','08/08','08/09','08/10','08/11','08/12','08/13','08/14','08/15','08/16','08/17','08/18','08/19','08/20','08/21','08/22','08/23','08/24','08/25','08/26','08/27','08/28','08/29','08/30']
             	data:currentxAxis
             },
             yAxis: {
                 type: 'value',
                 offset :8,
                 axisLine:{
                 	show:false
                 },
                 axisTick:{
                 	show:false
                 },			        
                 axisLabel : {
                 formatter: '{value}',
                 textStyle:{
                 color:"#bababa"
                 }
                 },
                 boundaryGap: [0, '100%'],
                 splitLine:{
                 	show:false
                 },
                min:0,
                max:currentmaxY,
                interval:Number((currentmaxY/3).toFixed(2))
             },
             grid: {
                 left: '3%',
                 right: '7%',
                 bottom: '0%',
                 containLabel: true
             },
             dataZoom: [{
                 type: 'inside',
                 zoomLock:true,
                 start:(currentxAxis.length>7?percent:0),
                 end: 100//是否分页显示
             }, {
                 show:false
             }],
             series: [
                 {
                     name:'模拟数据',
                     type:'line',
                     label: {
                         normal: {
                             show: true,
                             position: 'top',
                             formatter: '{c}'
                             // formatter: function(data){
                             //     console.log(data);
                             //     var dataIndex=data.dataIndex;                       
                             //     if (dataIndex%2 ==0){
                             //         return '';
                             //     }
                             // }
                         }
                     },			            
                     smooth:false,
                     // symbol: 'none',
                     sampling: 'average',
                     itemStyle: {
                         normal: {
                             label:{
                             		show: true,
                         		position: 'top'
                             },
                             color: 'rgba(79,117,247,0.4)'
                         }
                     },
                     areaStyle: {
                         normal: {
                             color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                                 offset: 0,
                                 color: 'rgba(124,151,252,0.5)'
                             }, {
                                 offset: 1,
                                 color: 'rgba(255, 255, 255,0.2)'
                             }])
                         }
                     },
                     smooth: false,
                     //data: [0.57, 0.57, 0.57,0.62, 0.62, 0.62,0.62, 0.88,0.57, 0.57, 0.57,0.62, 0.62, 0.62,0.62,0.57, 0.57, 0.57,0.62, 0.62, 0.62,0.62, 0.88,0.57, 0.57, 0.57,0.62, 0.62, 0.62,0.62]
                     data:currentyAxis
                 }
             ],
             animationDuration:3000,
             backgroundColor:'#fff'
         };
         currentChart.setOption(option);
//         currentChart.resize();
    }
//      sessionStorage.setItem('sscurrentxAxis',currentxAxis);
//      sessionStorage.setItem('sscurrentyAxis',currentyAxis);
      
}


function drawRegular(){

    $.ajax({
    	url: Setting.apiRoot1 + '/u/queryInterestByProdType.p2p',
    	type: 'post',
    	dataType: 'json',
    	async:false,
    	data:{
    	userId:userId,
          	prodType:3,
          	pageNum:1,
          	pageSize:30,
          	loginToken:loginToken,
          	guid:timestamp
    	}
    }).done(function(res){
    	Common.ajaxDataFilter(res,function(){
    	var data=res.data;
//    	console.log(data);
    	if(data!=null && data.length>0){
	    	regularLength=data.length;//固收图表柱状图的个数
	    	// alert(regularLength);
               for(var i=0; i<data.length;i++){
               var dateStr = data[i].dateStr;
               regularxAxis[i]=dateStr;
               //alert(currentxAxis[i]);
               var interestAmount = data[i].interestAmount;
               regularyAxis[i]=interestAmount;
             
               //alert(currentyAxis[i]);
               }
    	}
    	if(res.code == -1){
    	alert('查询失败');
    	return false;
    	}
    	})

    }).fail(function(){
    alert('网络链接失败');
    });
//    sessionStorage.setItem('ssregularxAxis',regularxAxis);
//    sessionStorage.setItem('ssregularyAxis',regularyAxis);
  var regular_percent=100-15/regularLength*100;
    for(var i=0;i<1;i++){
    	var regularChart = echarts.init(document.getElementById('regularChart'));

        option = {
            color: ['#3398DB'],
            title: {
                left: 'left',
                text: '收益详情',
                textStyle:{
                	color:'#bababa',
                	fontWeight:'normal',
                	fontFamily:'sans-serif',
                	fontSize:'0.4rem'
                }
            },
            grid: {
                top:'20%',
                left: '3%',
                right: '4%',
                bottom: '12%',
                containLabel: true
            },
            dataZoom: [{
                type: 'inside',
                zoomLock:true,
                 start:(regularLength>15?regular_percent:0),
                 end: 100//是否分页显示
            }, {
                show:false
            }],
            xAxis : [{
                    type : 'category',
               	 axisLine:{
                		show:false
               	 },
                	axisTick:{
                		show:false,
                		alignWithLabel: true
               	 },	

                  splitNumber:5,
                  axisLabel : {
                  		interval:1,
                		textStyle:{
               			color:"#bababa"
                		}
                  },
                 splitLine:{
                		show:false
                  },
                  //data : ['08/01','08/02','08/02','08/02','08/02','08/02','08/02','08/02','08/02','08/02','08/02','08/02','08/02','08/02','08/02','08/02'],
                  data:regularxAxis
                }
            ],
            yAxis : [
                {
                    type : 'value',
                    offset :8,
                    axisLine:{
                    	show:false
                    },
                    axisTick:{
                    	show:false
                    },	
                    boundaryGap: false,
                    axisLabel : {
                    textStyle:{
                    color:"#bababa"
                    }
                    },
                splitLine:{
                	show:false
                },
                }
            ],
            series : [
                {
                    name:'直接访问',
                    type:'bar',
                    barMaxWidth: 5,
                    itemStyle:{
                    	normal:{
                    		// color: new echarts.graphic.LinearGradient(0,0,0,1,[{
                    		// 	offset:0,
                    		// 	color:'#9ab0fe'
                    		// },{
                    		// 	offset:1,
                    		// 	color:'#ff92ba'
                    		// }])
                                        color:'rgb(255,162,128)'
                    	}

                    },
                    label: {
                        normal: {
                            show: true,
                            position: 'top',
                             // formatter: '{c}'
                             formatter: function(data){
                                 var dataIndex=data.dataIndex;                       
                                 if (dataIndex%2 ==0){
                                     return '';
                                 }
                             }
                        }
                    },
                    //data:[0.66, 0.57, 0.57, 0.57, 0.57, 0.57, 0.57, 0.57, 0.57, 0.57, 0.57, 0.57, 0.57, 0.57, 0.57, 0.57, 0.57, 0.57, 0.57, 0.57, 0.57]
                    data:regularyAxis
                }
            ],
            backgroundColor:'#fff',
            animationDuration:3000
        };

        regularChart.setOption(option);
//        regularChart.resize();
    }
    
}




function drawFloat(){

    $.ajax({
    	url: Setting.apiRoot1 + '/u/queryInterestByProdType.p2p',
    	type: 'post',
    	dataType: 'json',
    	async:false,
    	data:{
    	userId:userId,
          	prodType:4,
          	pageNum:1,
          	pageSize:30,
          	loginToken:loginToken,
          	guid:timestamp
    	}
    }).done(function(res){
    	Common.ajaxDataFilter(res,function(){
    	var data=res.data;
//    	console.log(data);
    	if(data!=null && data.length>0){
    		for(var i=0; i<data.length;i++){
 		       var dateStr = data[i].currentWeight;
 		       floatxAxis[i]=dateStr;
 		       var interestAmount = data[i].name;
 		       floatyAxis[i]=interestAmount;
 	       }
    	}
	        
    	if(res.code == -1){
	    	alert('查询失败');
	    	return false;
    	}
     })

    }).fail(function(){
    alert('网络链接失败');
    });
//    sessionStorage.setItem('ssfloatxAxis',floatxAxis);
//    sessionStorage.setItem('ssfloatyAxis',floatyAxis);

    for(var i=0;i<1;i++){
    	var floatChart = echarts.init(document.getElementById('floatChart'));
        option = {
            title: {
                x: 'left',
                text: '净值走势',
                textStyle:{
                	color:'#bababa',
                	fontWeight:'normal',
                	fontFamily:'sans-serif',
                	fontSize:'0.375rem'
                },
            },
            calculable: true,
            grid: {
                borderWidth: 0,
                y: 80,
                y2: 60
            },
            xAxis: [
                {
                    type: 'value',
                    show: true,
                    min:0.80,
                    max:1.30,
                	 axisLine:{
                		 show:false
                	 },
                	 axisTick:{
                		 show:false
                	 },
        	 axisLabel : {
        		 textStyle:{
        		 color:"#bababa"
        		 }
        	 },
                	 splitLine:{
                		 show:false
                	 },	
                }
            ],
            yAxis: [
                {
                    type: 'category',
                    show: true,
                	 axisLine:{
                		 show:false
                	 },
                	 axisTick:{
                		 show:false
                	 },
        	 axisLabel : {
        		 textStyle:{
        		 color:"#bababa"
        		 }
        	 },
                	 splitLine:{
                		 show:false
                	 },			   
                    //data: ['三期', '二期', '一期',]
                    data:floatyAxis
                }
            ],
            grid:{
            	top:'10%'
            },
            series: [
                {
                    name: '净值走势',
                    type: 'bar',
                    // barWidth: '15%',
                    barMaxWidth: 8,
                    itemStyle: {
                        normal: {
                            color: function(params) {
                                // build a color map as your need.
                                var colorList = [
                                  ' rgb(172,188,253)'
                                ];
                                return colorList[params.dataIndex]
                            },
                            label: {
                                show: true,
                                position: 'right',
                                // formatter: function(value,index){
                                // 	var month=['八月收益','九月收益','十月收益'];
                                // 	var fmtVlue=month[value.dataIndex]+ value.data;
                                // 	return  fmtVlue;			                        
                                // }
                                textStyle:{
                                color:"rgb(51,51,51)"
                                },                        
                                formatter:'{b}净值:{c}'
                            }
                        }
                    },
                    //data: [1.02,1.18,1.09],
                    data:floatxAxis,
                    markPoint: {
                        tooltip: {
                            trigger: 'item',
                            backgroundColor: 'rgba(0,0,0,0)',
                        }
                    }
                }
            ],
                         backgroundColor:'#fff',
                         animationDuration:3000
        };
        floatChart.setOption(option);
        
//        floatChart.resize();
    }
    
}




var allData={};

// 去充值
$account.on('click', '.topup-btn', function(){
	var $this = $(this);
	if($this.hasClass('disabled')){//充值按钮是否禁用
	  return false;
	}
	// var data = {//用户Data
	// 	userId: userId,
	//         	loginToken:loginToken
	// };
	$this.addClass('disabled');
	window.location.href = Setting.staticRoot + '/pages/my-account/topup-cash.html';
	$this.removeClass('disabled');

});

//去提现
$account.on('click', '.withdraw-btn', function(){
	var $this = $(this);
	if($this.hasClass('disabled')){//提现按钮是否禁用
	  return false;
	}
	$this.addClass('disabled');
	
if (displayNav==null || displayNav==undefined || displayNav=='') {
        
           $.post(Setting.apiRoot1 + '/u/findTransChanel.p2p', {userId:userId,
            loginToken: loginToken, transType:20,guid:timestamp }, function(res) {
            console.log(JSON.stringify(res));
            if(res.code == -2 ) {
                confirm(res.message, function() {
                    window.location.href = Setting.staticRoot + '/pages/my-account/setting/real-name.html';
                });
                return false;
            }

            var withdrawChanel  = res.data.withdrawChanel;
            var isBind = true;
            var cardList = res.data.cardList;
            for (var i = 0; i < cardList.length; i++) {
                if(cardList[i].bindType == 1) {
                    isBind = false;
                    sessionStorage.setItem('resaction', JSON.stringify(res));
                    window.location.href = Setting.staticRoot + '/pages/my-account/withdrawal-cash.html?amount='+accountAmt;
                }
            }

            if (isBind) {
                alert('请先充值再提现');
            }
        }, 'json');
}  
if (displayNav==0) {
	window.location.href = Setting.staticRoot + '/pages/my-account/withdrawal-cash.html?amount='+accountAmt;    
}  
	$this.removeClass('disabled');
});

//账户信息
$account.on('click', '.top-left', function(){
    window.location.href = Setting.staticRoot + '/pages/my-account/setting/setting-center.html?rankVip='+rankVip+'&couponCount='+couponCount+'&inviteNumber='+inviteNumber;
});
$account.on('click', '.top-right', function(){
    window.location.href = Setting.staticRoot + '/pages/my-account/reward/red-envelope.html';
});
$account.on('click', '.top-right-past', function(){
    window.location.href = Setting.staticRoot + '/pages/my-account/transaction-records.html';
});

//默认显示周周涨 zyx 
$('#currentChart').show();
});

