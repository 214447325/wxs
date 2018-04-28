/*
* @Author: User
* @Date:   2016-09-09 09:52:55
* @Last Modified by:   User
* @Last Modified time: 2017-03-09 14:52:33
*/
$(function(){
    var isWeiXin = Common.isWeiXin();//微信进来的访问判断，不是跳转到官网下载页
    var param = Common.getParam();
    var userId =sessionStorage.getItem('uid');
    var loginToken = sessionStorage.getItem('loginToken');
    var accumulate = param.accumulate;
    $.ajax({
        url:Setting.apiRoot1 + '/u/myIncomeDetail.p2p',
        type:"post",
        dataType:'json',
        data:{
            userId: userId,
            loginToken: loginToken
        }
    }).done(function(res) {
        //Common.ajaxDataFilter(res, function() {
        if(res.code == 1) {
            var _data = res.data;
            var arry = [];
            var pro = 0;
            var template = '';
            template  += templateLegend('周周涨总收益',_data.currentIncome,'rgb(255,142,101)');
            template  += templateLegend('固收总收益',_data.regularIncome,'rgb(70,103,236)')
            // template  += templateLegend('累计总收益',_data.totalIncome,'rgb(249,232,52)');
            template  += templateLegend('浮动总收益',_data.floatInterestIncome,'rgb(255,238,61)');
            template  += templateLegend('活动总奖励',_data.otherInterestIncome,'rgb(100,193,200)');
            $('#chartLegend').html(template);
            if(_data.regularIncome != 0 && _data.regularIncome != '' && _data.regularIncome != undefined) {
                arry.push({y:_data.regularIncome,color:'rgb(70,103,236)'})
                pro += _data.regularIncome;
            }
            // if(_data.totalIncome != 0 && _data.totalIncome != '' && _data.totalIncome != undefined) {
            //     arry.push({y:_data.totalIncome,color:'rgb(249,232,52)'})
            //     pro += _data.totalIncome;
            // }
            if(_data.currentIncome != 0 && _data.currentIncome != '' && _data.currentIncome != undefined) {
                arry.push({y:_data.currentIncome,color:'rgb(255,142,101)'})
                pro += _data.currentIncome;
            }
            if(_data.floatInterestIncome != 0 && _data.floatInterestIncome != '' && _data.floatInterestIncome != undefined) {
                arry.push({y:_data.floatInterestIncome,color:'rgb(255,238,61)'})
                pro += _data.floatInterestIncome;
            }
            if(_data.otherInterestIncome != 0 && _data.otherInterestIncome != '' && _data.otherInterestIncome != undefined) {
                arry.push({y:_data.otherInterestIncome,color:'rgb(100,193,200)'})
                pro += _data.otherInterestIncome;
            }

            $('.p2').html(accumulate);
            //资产组合圆环配比highcharts
            //var arry = [{//圆环默认值 自动计算百分比
            //    y: 1,
            //    name: '个人资金周转'
            //}, {
            //    y: 2,
            //    name: '个人消费'
            //}, {
            //    y: 3,
            //    name: '扩大经营'
            //}, {
            //    y: 4,
            //    name: '装修'
            //}, {
            //    y: 5,
            //    name: '其他'
            //}];

            $('#portfolioChart').highcharts({
                chart: {
                    plotBackgroundColor: null,
                    plotBorderWidth: null,
                    plotShadow: false,
                    marginRight: 100,
                    marginLeft:100
                },
                colors:[
                    'rgb(70,103,236)',//第一个颜色
                    'rgb(249,232,52)',//第二个颜色
                    'rgb(255,142,101)',//第三个颜色
                    'rgb(100,193,200)',
                    'rgb(145,48,57)'
                ],
                title: {
                    text: ''
                },
                tooltip: {
                    pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>',
                    percentageDecimals: 1,
                    enabled: false
                },
                credits: {
                    enabled: false
                },
                plotOptions: {
                    pie: {
                        size:'130%',
                        innerSize: '50%',
                        borderWidth: 0,
                        allowPointSelect: false,
                        cursor: 'pointer',
                        dataLabels: {
                            distance: -20,
                            style: {
                                color: '#fff',
                                fontSize:'0.213rem'
                            },
                             format:'{point.percentage:.1f} %',
                            startAngle: -90,
                            endAngle: 90,
                            center: ['50%', '75%'],
                            enabled: true
                        },
                        point : {
                            events : {
                                legendItemClick: function() {
                                    return false;
                                }
                            }
                        },
                        showInLegend: false
                    }
                },
                legend: {
                    layout: 'vertical',
                    backgroundColor: '#FFFFFF',
                    //floating: true,
                    align: 'center',
                    //verticalAlign: 'middle',
                    labelFormatter: function () {
                        return point.percentage;
                    }
                    //itemMarginTop: 6,
                    //itemMarginBottom: 6,
                    //x: -120, // = marginLeft - default spacingLeft
                },
                series: [{
                    type: 'pie',
                    states: {
                        hover: {
                            enabled: false
                        }
                    },
                    data:arry,
                }]
            });
        } else {
            alert(res.message);
            return false;
        }
        //});
    }).fail(function() {
        alert('网络链接失败');
        return false;
    });
    function templateLegend(title,number,color){
        var _html = '';
        if(number == 0 && number == '' && number == undefined){
            number = 0;
        }
        number = parseFloat(number).toFixed(2);
        _html = '<div class="legendStyle">'+
                '<div style="float:left;"><span style="background:'+color+'"></span>'+title+'</div>'+
                '<div style="float:right;">'+number+'</div>'+
            '</div>';
        return _html;

    }

            //资产组合圆环配比highcharts
            //var arry = [{//圆环默认值 自动计算百分比
            //    y: 1,
            //    name: '个人资金周转'
            //}, {
            //    y: 2,
            //    name: '个人消费'
            //}, {
            //    y: 3,
            //    name: '扩大经营'
            //}, {
            //    y: 4,
            //    name: '装修'
            //}];

});