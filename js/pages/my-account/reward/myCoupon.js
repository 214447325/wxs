/**
 * Created by User on 2016/11/1.
 */
var couponData;//我的加息券查看列表
var maxPrivilege;//用户能获得的最大权重
var monery;
$(function() {
    var _slreValue = 0;
	$("ul#ticker02").liScroll({travelocity: 0.1});//滚动消息
	var userId = sessionStorage.getItem('uid');//userid
	var loginToken = sessionStorage.getItem('loginToken');
	var param = Common.getParam();
    //var interest = param.interest;
    var interest = parseFloat((sessionStorage.getItem('slreValue'))).toFixed(2);
	var prodId=param.pid;
	var pname=param.pname;
	var amount=param.amount;
    monery = parseFloat(amount);
	var expect=param.expect;
	var justforuse=param.justforuse;
    maxPrivilege = justforuse;
	var $content=$('.content');
	var $footer = $('.footer');//确定按钮
    var _regularRate = param.regularRate;
	var last_conpon=sessionStorage.getItem('vjr_selectedConpon_id')==undefined?[]:JSON.parse(sessionStorage.getItem('vjr_selectedConpon_id'));
    var cycle = param.cycle;
	var tempChooseConpon=[];
	var tempChooseConponObj=[];
    var _proArray = [];
	var tempWeightSum=0;
	var residualWeight;//用户可选择的剩余最大权重
	/*var setCoupon = doT.template([
	//这里判断之前选中的加息券id数组，加上这个class selectTrue
	'{{~it :item:index}}',	
		'{{?item.weight <maxPrivilege || item.weight ==maxPrivilege }}',//单张加息券权重小于或等于最大权重
		'{{?item.minUseAmount <= monery}}',
        '<div class="singleConpon" couponType="{{=item.type}}">' +
        '{{??}}',
        '<div class="singleSetgray" couponType="{{=item.type}}">',
        '{{?}}',
        '<div class="singleConponBox">+<span class="slre">{{=item.couponId}}</span>元</div>',
				'{{?item.type ==1}}',
					'<div class="cpamount" weight="{{=item.weight}}" cpid="{{=item.id}}">',
						'<span>{{=item.privilege}}%','</span>',
						'<span>天数加息券','</span>',
					'</div>',
				'{{?}}',
				'{{?item.type ==2}}',
					'<div class="cpamount" weight="{{=item.weight}}" cpid="{{=item.id}}">',
						'<span>{{=item.privilege}}%','</span>',
						'<span>全程加息券','</span>',
					'</div>',
				'{{?}}',
				'{{?item.type ==3}}',
					'<div class="cpamount" weight="{{=item.weight}}" cpid="{{=item.id}}">',
						'<span>{{=item.privilege}}','</span>',
						'<span>体验金','</span>',
					'</div>',
				'{{?}}',
				'{{?item.type ==5}}',
					'<div class="cpamount" weight="{{=item.weight}}" cpid="{{=item.id}}">',
						'<span>{{=item.privilege}}','</span>',
						'<span>投资红包','</span>',
					'</div>',
				'{{?}}',
				'<div class="cpinfo">',
					'{{?item.type ==1}}',
						'<span><span>加息天数：</span>{{=item.cycleTime}}天','</span>',
					'{{?}}',
					'{{?item.type ==2}}',
						'<span><span>加息天数：</span>全程','</span>',
					'{{?}}',
                    '<span><span>使用规则：</span>{{=item.rule}}','</span>',
					'<span><span>有效期：</span>{{=item.lifeTimeFrom}}~{{=item.lifeTimeEnd}}','</span>',
				'</div>',
				'<div class="cpselect">',
					'<img src="../../../images/pages/my-account3.0/unselected.png" class="ifselect">',
				'</div>',
			'</div>',
		'{{??item.weight >maxPrivilege}}',//单张加息券权重大于最大权重
			'{{?item.type ==1}}',//天数
				'<div class="singleSetgray" couponType="{{=item.type}}">',
                '<div class="singleConponBox">+<span class="slre">{{=item.couponId}}</span>元</div>',
					'<div class="cpamount" weight="{{=item.weight}}" cpid="{{=item.id}}">',
						'<span>{{=item.privilege}}%','</span>',			
						'<span>天数加息券','</span>',
					'</div>',
					'<div class="cpinfo">',
						'<span><span>加息天数：</span>{{=item.cycleTime}}天','</span>',
                        '<span><span>使用规则：</span>{{=item.rule}}','</span>',
                        '<span><span>有效期：</span>{{=item.lifeTimeFrom}}~{{=item.lifeTimeEnd}}','</span>',
					'</div>',
					'<div class="cpselect">',					
						'<img src="../../../images/pages/my-account3.0/unselected.png" >',					
					'</div>',
				'</div>',	
			'{{?}}',
			'{{?item.type ==2}}',//全称
				'<div class="singleSetgray" couponType="{{=item.type}}">',
                 '<div class="singleConponBox">+<span class="slre">{{=item.couponId}}</span>元</div>',
					'<div class="cpamount" weight="{{=item.weight}}" cpid="{{=item.id}}">',
						'<span>{{=item.privilege}}%','</span>',			
						'<span>全程加息券','</span>',
					'</div>',
					'<div class="cpinfo">',
						'<span><span>加息天数：</span>全程','</span>',
                        '<span><span>使用规则：</span>{{=item.rule}}','</span>',
						'<span><span>有效期：</span>{{=item.lifeTimeFrom}}~{{=item.lifeTimeEnd}}','</span>',
					'</div>',
					'<div class="cpselect">',					
						'<img src="../../../images/pages/my-account3.0/unselected.png" >',					
					'</div>',
				'</div>',		
			'{{?}}',
			'{{?item.type ==3}}',//全称
				'<div class="singleSetgray" couponType="{{=item.type}}">',
                '<div class="singleConponBox">+<span class="slre">{{=item.couponId}}</span>元</div>',
					'<div class="cpamount" weight="{{=item.weight}}" cpid="{{=item.id}}">',
						'<span>{{=item.privilege}}%','</span>',			
						'<span>体验金','</span>',
					'</div>',
					'<div class="cpinfo">',
						'<span><span>使用规则：</span>{{=item.rule}}','</span>',
						'<span><span>有效期：</span>{{=item.lifeTimeFrom}}~{{=item.lifeTimeEnd}}','</span>',
					'</div>',
					'<div class="cpselect">',					
						'<img src="../../../images/pages/my-account3.0/unselected.png" >',					
					'</div>',
				'</div>',		
			'{{?}}',
			'{{?item.type ==5}}',//全称
				'<div class="singleSetgray" couponType="{{=item.type}}">',
                '<div class="singleConponBox">+<span class="slre">{{=item.couponId}}</span>元</div>',
					'<div class="cpamount" weight="{{=item.weight}}" cpid="{{=item.id}}">',
						'<span>{{=item.privilege}}%','</span>',			
						'<span>投资红包','</span>',
					'</div>',
					'<div class="cpinfo">',
						'<span><span>使用规则：</span>{{=item.rule}}','</span>',
						'<span><span>有效期：</span>{{=item.lifeTimeFrom}}~{{=item.lifeTimeEnd}}','</span>',
					'</div>',
					'<div class="cpselect">',					
						'<img src="../../../images/pages/my-account3.0/unselected.png" >',					
					'</div>',
				'</div>',		
			'{{?}}',	
		'{{?}}',
	'{{~}}'
	].join(''));*/

	var setCoupon = doT.template([
	//这里判断之前选中的加息券id数组，加上这个class selectTrue
	'{{~it :item:index}}',	
		'{{?item.weight <maxPrivilege || item.weight ==maxPrivilege }}',//单张加息券权重小于或等于最大权重
		'{{?item.minUseAmount <= monery}}',
        '<div class="singleConpon" couponType="{{=item.type}}">' +
        '{{??}}',
        '<div class="singleSetgray" couponType="{{=item.type}}">',
        '{{?}}',
        '<div class="singleConponBox">+<span class="slre">{{=item.couponId}}</span>元</div>',

				'{{?item.type ==1}}',
					'<div class="cpamount" weight="{{=item.weight}}" cpid="{{=item.id}}">',
						'<span>{{=item.privilege}}%','</span>',
						'<span>天数加息券','</span>',
					'</div>',
				'{{?}}',
				'{{?item.type ==2}}',
					'<div class="cpamount" weight="{{=item.weight}}" cpid="{{=item.id}}">',
						'<span>{{=item.privilege}}%','</span>',
						'<span>全程加息券','</span>',
					'</div>',
				'{{?}}',
				'{{?item.type ==3}}',
					'<div class="cpamount" weight="{{=item.weight}}" cpid="{{=item.id}}">',
						'<span>{{=item.privilege}}','</span>',
						'<span>体验金','</span>',
					'</div>',
				'{{?}}',
				'{{?item.type ==5}}',
					'<div class="cpamount" weight="{{=item.weight}}" cpid="{{=item.id}}">',
						'<span>{{=item.privilege}}','</span>',
						'<span>投资红包','</span>',
					'</div>',
				'{{?}}',
				'<div class="cpinfo">有效期至{{=item.lifeTimeEnd}}</div>',
				'<div class="cpselect">',
					'<img src="../../../images/pages/my-account3.0/unselected.png" class="ifselect">',
				'</div>',
			'</div>',
		'{{??item.weight >maxPrivilege}}',//单张加息券权重大于最大权重
			'{{?item.type ==1}}',//天数
				'<div class="singleSetgray" couponType="{{=item.type}}">',
                '<div class="singleConponBox">+<span class="slre">{{=item.couponId}}</span>元</div>',

					'<div class="cpamount" weight="{{=item.weight}}" cpid="{{=item.id}}">',
						'<span>{{=item.privilege}}%','</span>',			
						'<span>天数加息券','</span>',
					'</div>',
					'<div class="cpinfo">有效期至{{=item.lifeTimeEnd}}</div>',
					
					'<div class="cpselect">',					
						'<img src="../../../images/pages/my-account3.0/unselected.png" >',					
					'</div>',
				'</div>',	
			'{{?}}',
			'{{?item.type ==2}}',//全称
				'<div class="singleSetgray" couponType="{{=item.type}}">',
                '<div class="singleConponBox">+<span class="slre">{{=item.couponId}}</span>元</div>',

					'<div class="cpamount" weight="{{=item.weight}}" cpid="{{=item.id}}">',
						'<span>{{=item.privilege}}%','</span>',			
						'<span>全程加息券','</span>',
					'</div>',
					'<div class="cpinfo">有效期至{{=item.lifeTimeEnd}}</div>',
					'<div class="cpselect">',					
						'<img src="../../../images/pages/my-account3.0/unselected.png" >',					
					'</div>',
				'</div>',		
			'{{?}}',
			'{{?item.type ==3}}',//全称
				'<div class="singleSetgray" couponType="{{=item.type}}">',
                '<div class="singleConponBox">+<span class="slre">{{=item.couponId}}</span>元</div>',

					'<div class="cpamount" weight="{{=item.weight}}" cpid="{{=item.id}}">',
						'<span>{{=item.privilege}}%','</span>',			
						'<span>体验金','</span>',
					'</div>',
					'<div class="cpinfo">有效期至{{=item.lifeTimeEnd}}</div>',
					'<div class="cpselect">',					
						'<img src="../../../images/pages/my-account3.0/unselected.png" >',					
					'</div>',
				'</div>',		
			'{{?}}',
			'{{?item.type ==5}}',//全称
				'<div class="singleSetgray" couponType="{{=item.type}}">',
                '<div class="singleConponBox">+<span class="slre">{{=item.couponId}}</span>元</div>',
				
					'<div class="cpamount" weight="{{=item.weight}}" cpid="{{=item.id}}">',
						'<span>{{=item.privilege}}%','</span>',			
						'<span>投资红包','</span>',
					'</div>',
					'<div class="cpinfo">有效期至{{=item.lifeTimeEnd}}</div>',
					'<div class="cpselect">',					
						'<img src="../../../images/pages/my-account3.0/unselected.png" >',					
					'</div>',
				'</div>',		
			'{{?}}',	
		'{{?}}',
	'{{~}}'
	].join(''));

	$.ajax({
	url:Setting.apiRoot1 + '/u/usefulRateCoupon.p2p',
	type:"post",
	async:false,
	dataType:'json',
	data:{
		userId: userId,
		loginToken:sessionStorage.getItem('loginToken'),
		prodId:prodId
	}
	}).done(function(res){
	Common.ajaxDataFilter(res,function(){
	  if(res.code==1){
	  	couponData=res.data.coupons;
	  	
          var _prDataValue = '';
          var _arr = [];
	  	maxPrivilege=sessionStorage.getItem('justforuse');
		if (couponData.length>0) {
            var couponId = '';
            for(var i = 0; i < couponData.length; i++) {
                _prDataValue = '';
                //天数加息
                if(couponData[i].type == 1) {
                    _prDataValue = parseFloat(parseFloat(parseFloat(amount) * parseFloat(couponData[i].privilege) * couponData[i].cycleTime / 36500).toString().match(/^\d+(?:\.\d{0,2})?/)).toFixed(2);
                    // _prDataValue = parseFloat(parseFloat(amount) * parseFloat(couponData[i].privilege) * couponData[i].cycleTime / 36500).toFixed(2);
                    couponData[i].couponId = _prDataValue;
                }
                //全程加息
                if(couponData[i].type == 2) {
                    // _prDataValue = parseFloat(parseFloat(amount) * parseFloat(couponData[i].privilege) * parseFloat(cycle*7) / 36500).toFixed(2);
                    _prDataValue = parseFloat(parseFloat(parseFloat(amount) * parseFloat(couponData[i].privilege) * parseFloat(cycle*7) / 36500).toString().match(/^\d+(?:\.\d{0,2})?/)).toFixed(2);
                    couponData[i].couponId = _prDataValue;
                }
                //体验金
                if(couponData[i].type == 3) {
                    _prDataValue = parseFloat(parseFloat(parseFloat(amount) * _regularRate * couponData[i].cycleTime / 36500).toString().match(/^\d+(?:\.\d{0,2})?/)).toFixed(2);
                    couponData[i].couponId = _prDataValue;
                }
                //投资红包
                if(couponData[i].type == 5) {
                    _prDataValue = parseFloat(parseFloat(couponData[i].privilege).toString().match(/^\d+(?:\.\d{0,2})?/)).toFixed(2);
                    couponData[i].couponId = _prDataValue;
                }
                //if(i != 0) {
                //    if(couponData[i - 1].couponId < couponData[i].couponId) {
                //        _arr
                //    }
                //}
            }

            for(var i = 0; i < couponData.length; i++) {
                for(var j = i + 1; j < couponData.length;j++) {
                    if(couponData[i].couponId < couponData[j].couponId) {
                        var tmp = couponData[i];
                        couponData[i] = couponData[j];
                        couponData[j] = tmp;
                    }
                }
            }

	  		$content.html(setCoupon(couponData));
		}else{
			$content.html('<img src="../../../images/pages/my-account3.0/kk.png" class="kk"/>');	
		}


          var _sValue = 0;
          var _dCycle = cycle * 7;
          var _todays = 0;
	  	$('.singleConpon').on('click', function() {
	  		var $ifselect = $(this).find('.ifselect');//是否选中，选中打钩
			var chooseWeight=$(this).children('.cpamount').attr('weight');//当前点击的加息券的权重
			var chooseConponId=$(this).children('.cpamount').attr('cpid');//当前点击的加息券的id
            var $slre = $(this).find('.slre');
            _sValue = $slre.html();
            //alert(_sValue);
			if ($(this).hasClass('selectTrue')) {//取消选中
				tempWeightSum=tempWeightSum-Number(chooseWeight);
				residualWeight=maxPrivilege-tempWeightSum;//剩余总权重
				$ifselect.attr("src","../../../images/pages/my-account3.0/unselected.png");
				$ifselect.css('display','none');
                for(var i=0;i< tempChooseConpon.length;i++){
					if(tempChooseConpon[i]==chooseConponId){
						tempChooseConpon.splice(i,1);
					}
				}
                for(var i=0;i<tempChooseConponObj.length;i++){
					if(tempChooseConponObj[i].id==chooseConponId){
                        if(tempChooseConponObj[i].type == 1) {
                            _todays = _todays - tempChooseConponObj[i].cycleTime;
                        }
						tempChooseConponObj.splice(i,1);
					}
				}
				$(this).toggleClass('selectTrue');
			}else{
				if(Number(chooseWeight)+tempWeightSum>maxPrivilege){
	  				return false;
	  			}
				if(tempWeightSum>=maxPrivilege){
					$(this).removeClass('selectTrue');
					//return false;
				}else{
					tempWeightSum+=Number(chooseWeight);
					residualWeight=maxPrivilege-tempWeightSum;//剩余总权重
				}
				for(var i=0;i<couponData.length;i++){
					if(couponData[i].id==chooseConponId){
                        if(couponData[i].type == 1) {
                            _todays = _todays + couponData[i].cycleTime;
                            if(_todays > _dCycle) {
                                _todays = _todays - couponData[i].cycleTime;
                                alert('用券天数不得超过产品期限');
                                return false;
                            } else {
                            	couponData[i].title = $(this).find('.cpamount').text();
                                tempChooseConponObj.push(couponData[i]);
                                tempChooseConpon.push(chooseConponId);
                                $ifselect.attr("src","../../../images/pages/my-account3.0/selected.png");
                                $ifselect.css('display','block');
                                $(this).toggleClass('selectTrue');
                            }
                        } else {
                            couponData[i].title = $(this).find('.cpamount').text();
                            tempChooseConponObj.push(couponData[i]);
                            tempChooseConpon.push(chooseConponId);
                            $ifselect.attr("src","../../../images/pages/my-account3.0/selected.png");
                            $ifselect.css('display','block');
                            $(this).toggleClass('selectTrue');
                        }
					}
				}

			}
            var _pro= 0;
            var _prData = 0;
            if(($(this).hasClass('selectTrue'))) {
                //选定某张券
                _sValue = $slre.html();
                console.log(_slreValue,_sValue)
                _slreValue =parseFloat(_slreValue) + parseFloat(_sValue);
                for(var i = 0; i < tempChooseConpon.length; i++) {
                    //天数加息
                    if(tempChooseConponObj[i].type == 1) {
                        _prData = parseFloat(parseFloat(amount) * parseFloat(tempChooseConponObj[i].privilege) * tempChooseConponObj[i].cycleTime / 36500).toFixed(3);
                        //_prData = parseFloat(parseFloat(parseFloat(amount) * parseFloat(tempChooseConponObj[i].privilege) * tempChooseConponObj[i].cycleTime / 36500).toString().match(/^\d+(?:\.\d{0,2})?/)).toFixed(2);
                       //console.log(JSON.stringify(_prData));
                        _pro +=  parseFloat(_prData);

                    }
                    //全程加息
                    if(tempChooseConponObj[i].type == 2) {
                        _prData = parseFloat(parseFloat(amount) * parseFloat(tempChooseConponObj[i].privilege) * parseFloat(cycle*7) / 36500).toFixed(3);
                        //_prData = parseFloat(parseFloat(parseFloat(amount) * parseFloat(tempChooseConponObj[i].privilege) * parseFloat(cycle*7) / 36500).toString().match(/^\d+(?:\.\d{0,2})?/)).toFixed(2);
                        _pro +=  parseFloat(_prData) ;
                    }
                    //体验金
                    if(tempChooseConponObj[i].type == 3) {
                        _prData = parseFloat(parseFloat(amount) * _regularRate * tempChooseConponObj[i].cycleTime / 36500).toFixed(3);
                        //_prData = parseFloat(parseFloat(parseFloat(amount) * _regularRate * tempChooseConponObj[i].cycleTime / 36500).toString().match(/^\d+(?:\.\d{0,2})?/)).toFixed(2);
                        _pro +=  parseFloat(_prData);
                    }
                    //投资红包
                    if(tempChooseConponObj[i].type == 5) {
                        _prData = parseFloat(tempChooseConponObj[i].privilege).toFixed(3);
                        //_prData = parseFloat(parseFloat(tempChooseConponObj[i].privilege).toString().match(/^\d+(?:\.\d{0,2})?/)).toFixed(2);
                        _pro +=  parseFloat(_prData);
                    }
                }
            } else {
                //取消某张券
                _sValue = $slre.html();
                _slreValue =parseFloat(_slreValue) - parseFloat(_sValue);
                for(var i = 0; i < tempChooseConponObj.length; i++) {
                    //天数加息
                    if(tempChooseConponObj[i].type == 1) {
                        _prData = parseFloat(parseFloat(amount) * parseFloat(tempChooseConponObj[i].privilege) * tempChooseConponObj[i].cycleTime / 36500).toFixed(3);
                        //_prData = parseFloat(parseFloat(parseFloat(amount) * parseFloat(tempChooseConponObj[i].privilege) * tempChooseConponObj[i].cycleTime / 36500).toString().match(/^\d+(?:\.\d{0,2})?/)).toFixed(2);
                        _pro +=  parseFloat(_prData) ;
                    }
                    //全程加息
                    if(tempChooseConponObj[i].type == 2) {
                        _prData = parseFloat(parseFloat(amount) * parseFloat(tempChooseConponObj[i].privilege) * parseFloat(cycle*7) / 36500).toFixed(3);
                        //_prData = parseFloat(parseFloat(parseFloat(amount) * parseFloat(tempChooseConponObj[i].privilege) * parseFloat(cycle*7) / 36500).toString().match(/^\d+(?:\.\d{0,2})?/)).toFixed(2);
                        _pro +=  parseFloat(_prData);
                    }
                    //体验金
                    if(tempChooseConponObj[i].type == 3) {
                        _prData = parseFloat(parseFloat(amount) * _regularRate * tempChooseConponObj[i].cycleTime / 36500).toFixed(3);
                        //_prData = parseFloat(parseFloat(parseFloat(amount) * _regularRate * tempChooseConponObj[i].cycleTime / 36500).toString().match(/^\d+(?:\.\d{0,2})?/)).toFixed(2);
                        _pro +=  parseFloat(_prData);
                    }
                    //投资红包
                    if(tempChooseConponObj[i].type == 5) {
                        _prData = parseFloat(parseFloat(tempChooseConponObj[i].privilege)).toFixed(3);
                        //_prData = parseFloat(parseFloat(tempChooseConponObj[i].privilege).toString().match(/^\d+(?:\.\d{0,2})?/)).toFixed(2);
                        _pro +=  parseFloat(_prData);
                    }
                }
            }
                if(_slreValue != null && _slreValue != '' && _slreValue != undefined && _slreValue > 0) {
                    _pro = _pro.toString();
                    $('.span_expect').html(_slreValue.toFixed(2) + '元');
                } else {
                    $('.span_expect').html(parseFloat(0).toFixed(0) + '元');
                }
			//根据剩余权重判断剩余加息券是否可选
			if (residualWeight==0) {//剩余总权重为0 不能选择其他任何加息券
				if (chooseWeight==3) {
                    $('[couponType=2]').addClass('singleSetgray');
                    $('[couponType=3]').addClass('singleSetgray');
                    $('[couponType=5]').addClass('singleSetgray');
                    $('.singleConpon[couponType=1]').removeClass('singleSetgray');
					//$(this).siblings().addClass('singleSetgray');
				}
				if (chooseWeight==1) {
					$('[couponType=2]').addClass('singleSetgray');
					$('[couponType=3]').addClass('singleSetgray');
					$('[couponType=5]').addClass('singleSetgray');
                    $('.singleConpon[couponType=1]').removeClass('singleSetgray');
					//$('[couponType=1]:not([class="singleConpon selectTrue"])').addClass('singleSetgray');
				}

			}else if(residualWeight>0 && residualWeight<maxPrivilege){//剩余总权重大于0小于maxPrivilege 只能选择天数加息券不可以选择全程
				$('.singleConpon[couponType=1]').removeClass('singleSetgray');
				$('[couponType=2]').addClass('singleSetgray');
				$('[couponType=3]').addClass('singleSetgray');
				$('[couponType=5]').addClass('singleSetgray');
			}else{//剩余总权重为maxPrivilege 可选择任意加息券
				$('.singleConpon[couponType=1]').removeClass('singleSetgray');
				$('.singleConpon[couponType=2]').removeClass('singleSetgray');
				$('.singleConpon[couponType=3]').removeClass('singleSetgray');
				$('.singleConpon[couponType=5]').removeClass('singleSetgray');
			}
		});

		//更改加息券样式
		if(last_conpon!=[]){
			$('.singleConpon').each(function(index, el) {
				var tempThisId=$(this).children('.cpamount').attr('cpid');
				if(last_conpon.indexOf(tempThisId)>=0){
					//var $ifselect = $(this).find('.ifselect');
					//$ifselect.attr("src","../../../images/pages/my-account3.0/selected.png");
					$(this).trigger('click');
				}
			});		
		}

	    
	  }
	})

	}).fail(function(){
	alert('网络链接失败');
	return false
	});


	//点击确定按钮
	$footer.click(function() {
        var _interest = 0;
        _interest = $('.span_expect').html();
        if(_interest == undefined || _interest == '' || _interest ==null) {
            _interest = 0;
        }
		var selectedConpon=JSON.stringify(tempChooseConponObj);
		sessionStorage.setItem('vjr_selectedConpon_id',JSON.stringify(tempChooseConpon));
		sessionStorage.setItem('vjr_selectedConpon',selectedConpon);
        sessionStorage.setItem('slreValue',_slreValue.toFixed(2));
		//var preUrl=sessionStorage.getItem('currentUrl_buy3.0');当前wx/pages/financing/buy3.0.html?pid=1655&{pid: "1655", amount: "100000", regularRate: 13.5, expect: "6731.51"}
		sessionStorage.setItem('haveuse',tempWeightSum);
		sessionStorage.setItem('clicktype',1);
        if(tempChooseConpon.length == 0) {
            sessionStorage.setItem('vjr_selectedConpon_id',0);
        }

	    	window.location.href='../../../pages/financing/buy3.0.html?pid='+prodId+'&amount='+amount+'&expect='+expect+'&pagebuy=1&interest=' + _interest;

	    	
	});

    ////页面加载根据session选定券
    var vjrId = JSON.parse(sessionStorage.getItem('vjr_selectedConpon_id'));
    if(vjrId == null || vjrId == '') {
        $('.span_expect').html(parseFloat(0).toFixed(0) + '元');
    } else {
        $('.span_expect').html(interest + '元');
    }

});


