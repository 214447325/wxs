$(function(){
	var newPicker = new mui.PopPicker();
	var	param = Common.getParam();
	var type = param.type;
	var userId,loginToken;
	// ios调用h5页面
	if(type == 2){
		userId = param.uid;
		loginToken = param.loginToken;
	}else{
		userId = sessionStorage.getItem('uid');
		loginToken = sessionStorage.getItem('loginToken');
	}
	if(!userId){
		// ios APP跳转到登录
		if(type == 2){
			iOS.HtmlJumpLogin();
		}else{
			Common.toLogin();
			return false;
		}
	}
	marryData = [
		// {
		// 	value:0,
		// 	text:'请选择',
		// 	children:[]
		// },
		{
			value:1,
			text:'未婚',
			children:[]
		},
		{
			value:2,
			text:'已婚',
			children:[]
		}
	];
	childrenData = [
		{
			value:0,
			text:'0',
			children:[]
		},
		{
			value:1,
			text:'1',
			children:[]
		},
		{
			value:2,
			text:'2',
			children:[]
		},
		{
			value:3,
			text:'3',
			children:[]
		},
		{
			value:4,
			text:'4',
			children:[]
		},
		{
			value:5,
			text:'5',
			children:[]
		}
	];
	var family ={
	   "marriageStatus": {
	        "name": "",
	        "value": ""
	    },
	    "couple": "",
	   "children": {
	        "count": '',
	        "birthday": []
	   }
	}
	var children = doT.template([
			'{{for(var i = 1; i <= it;i++){}}',
			'<div class="clearfix children margin-bottom">',
					'<div class="border-bottom">子女{{=i}}</div>',
					'<div class="fl">出生年份</div>',
					'<img class="fr family-downImg" src="../../../images/pages/my-account3.0/information/down.png">',
					'<div class="fr marriage-children">请选择</div>',
				'</div>',
			'{{ } }}',
		].join(''));
	for(var i = 0; i < document.getElementsByClassName('marriagesss').length; i++){
		document.getElementsByClassName('marriagesss')[i].addEventListener('tap', function(event) { 
			$('.mui-poppicker-btn-ok').html('完成');
			var className = event.target.classList[1];
			switch(className) {
				case 'marriage-Marriage': newPicker.setData(marryData);break;
				case 'marriage-childrenNum':newPicker.setData(childrenData);break;
			}         
			var that = $(this)  
		  	newPicker.show(function(items) { 
			    that.html(items[0].text);
			    if(className == 'marriage-Marriage'){
			    	family.marriageStatus.name = items[0].text;
		    		family.marriageStatus.value = items[0].value;
			    	if(items[0].text == '已婚' ){
			    		
				    	$('.spouse').css('display','block');
				    	 	document.getElementsByClassName('marriage-spouse')[0].addEventListener('tap', function(event) { 
								var className = event.target.classList[1];
								var that = $(this);
								var dtPicker = new mui.DtPicker({
							　　　　"type":"month",
							 	 	'beginDate': new Date(1900, 01, 01),//设置开始日期
							    	'endDate': new Date(),//设置结束日期
							　　});
							    dtPicker.show(function (selectItems) {
							    	that.html(selectItems.y.text);
			    					family.couple = selectItems.y.text;
							    	dtPicker.dispose();

								  /* console.log(selectItems.y);//{text: "2016",value: 2016}
								   console.log(selectItems.m);//{text: "05",value: "05"}*/
							    })
							})
				    }else{
				    	$('.spouse').css('display','none');
				    	family.couple = '';
				    }
			    };
			    if(className == 'marriage-childrenNum'){
		    		family.children.count = items[0].text;
			    	 if(items[0].text != '0'){
				    	$('.children-list').html(children(items[0].text * 1));
						for(var i = 0; i < document.getElementsByClassName('marriage-children').length; i++){
					    	document.getElementsByClassName('marriage-children')[i].addEventListener('tap', function(event) { 
								var className = event.target.classList[1];
								var that = $(this);
								var dtPicker = new mui.DtPicker({
							　　　　"type":"month",
							 	 	'beginDate': new Date(1900, 01, 01),//设置开始日期
							    	'endDate': new Date(),//设置结束日期
							　　});
							    dtPicker.show(function (selectItems) {
							    	that.html(selectItems.y.text);
							    	var flag = true;
							    	for (var i = 0; i < family.children.birthday.length; i++) {
							    		if(family.children.birthday[i].no == selectItems.y.value){
							    			family.children.birthday[i].date = selectItems.y.text;
							    			flag = false;
							    		}
							    	}
							    	if(flag){
							    		family.children.birthday.push('{ "no": '+ selectItems.y.value +', "date": '+ selectItems.y.text +'}');
							    	}
							    	dtPicker.dispose();

								  /* console.log(selectItems.y);//{text: "2016",value: 2016}
								   console.log(selectItems.m);//{text: "05",value: "05"}*/
							    })
							})
						}
				    }else{
				    	$('.children').css('display','none');
				    	family.children.birthday = [];
				    }
			    }
		  	})  
		})
	}

	$('.marriage-button').on('click',function(){
		if(family.marriageStatus.value == ''){
			Common2.toast('请选择婚姻状况');
			return false;
		}
		if(family.marriageStatus.name == '已婚' && family.couple == ''){
			Common2.toast('请选择子配偶的出生日期');
			return false;
		}
		if(family.children.count == ''){
			Common2.toast('请选择子女个数');
			return false;
		}
		if(family.children.count > family.children.birthday.length ){
			Common2.toast('请选择子女的出生日期');
			return false;
		}
		$.ajax({
			url:Setting.apiRoot1 + '/u/doIntegralTask.p2p',
			type:'POST',
			dataType:'json',
			data:{
				userId:userId,
				loginToken:loginToken,
				type:2,
				jsonObj:JSON.stringify(family)
			}
		}).done(function(res){
			Common.ajaxDataFilter(res,function(){
				if(res.code == 1){
					window.location.href  = '../../../pages/my-account/integral/list.html'+ window.location.search;
				}else{
					Common2.toast(res.message);
				}
			})
		}).fail(function(res){
			Common2.toast('网络连接失败！');
		});
	})
})