/*
* @Author: User
* @Date:   2016-06-28 13:47:34
* @Last Modified by:   User
* @Last Modified time: 2016-07-26 09:59:31
*/

function drawLine(series,createTime){
	$('#container').highcharts({
        chart: {
            type: 'line',
            marginLeft: 50

        },
        // title: {
        //     text: '净值趋势'
        // },
        // subtitle: {
        //     text: 'Source: WorldClimate.com'
        // },
        xAxis: {
            // categories: ['16/08', '16/09', '16/10', '16/11', '16/12', '17/01', '17/02']
            categories: createTime,


        },
        yAxis: {
             title: {
                 text: '单位净值'
             }
        },
        plotOptions: {
            line: {
                dataLabels: {
                    enabled: true
                },
                enableMouseTracking: false
            }
        },
        series:series
    });
}

$(function () {
 var param = Common.getParam();
 var lineId=param.lineId;  

    $.ajax({
    url:Setting.apiRoot1 + '/queryNetValueLine.p2p',
    type:"post",
    dataType:'json',
    data:{
      // userId:userId,
      // loginToken:sessionStorage.getItem('loginToken')
      lineId:lineId
    }
  }).done(function(res){
      if(res.code==1){
        var data = res.data;
        var createTime =[];
        var stockIndexLine = [];
        var weightValueLine = [];

        for(var i=0;i<data.length;i++){
        	var lineData = data[i];
           var TIME =(lineData.createTime).toString().substr(2, 5);
           createTime[i] = TIME;
        	//createTime[i] = lineData.createTime;
        	stockIndexLine[i] =  lineData.stockIndex;
        	weightValueLine[i] =  lineData.weightValue;       	
	}

  var series =  [{
            name: '上证指数 ',
            data:stockIndexLine
            }, {
            name: '择时稳赢',
            data:weightValueLine
            }];

           drawLine(series,createTime);

      }else{
        alert(res.message);
          return false;
      }

  }).fail(function(){
    alert('网络链接失败');
    return false
  });
});