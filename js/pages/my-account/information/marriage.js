$(function(){
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
	newData = [
	// {
	// 	value:0,
	// 	text:'请选择',
	// 	children:[]
	// },
	{
		value:1,
		text:'大专及以下',
		children:[]
	},
	{
		value:2,
		text:'本科',
		children:[]
	},
	{
		value:3,
		text:'硕士',
		children:[]
	},
	{
		value:4,
		text:'博士',
		children:[]
	}
	]
	newData2 = [
	// {
	// 	value:0,
	// 	text:'请选择',
	// 	children:[]
	// },
	{
		value:1,
		text:'企业白领',
		children:[]
	},
	{
		value:2,
		text:'公司高管',
		children:[]
	},
	{
		value:3,
		text:'私营业主',
		children:[]
	},
	{
		value:4,
		text:'专业人士',
		children:[]
	},
	{
		value:5,
		text:'企事业单位',
		children:[]
	},
	{
		value:6,
		text:'专职投资人士',
		children:[]
	},
	{
		value:7,
		text:'家庭主妇',
		children:[]
	},
	{
		value:8,
		text:'退休人士',
		children:[]
	},
	{
		value:9,
		text:'自由职业者',
		children:[]
	},
	{
		value:10,
		text:'文体明星和艺术家',
		children:[]
	}
	];
	information = {
         "edcation": {
		        "name": "",
		        "value": ""
		    },
		 "job": {
		        "name": "",
		        "value": ""
		    }
	}
	for(var i = 0; i < document.getElementsByClassName('marriagesss').length; i++){
		document.getElementsByClassName('marriagesss')[i].addEventListener('tap', function(event) { 
			var newPicker = new mui.PopPicker();
			$('.mui-poppicker-btn-ok').html('完成');
			var className = event.target.classList[1]
			switch(className) {
				case 'marriage-education': newPicker.setData(newData);break;
				case 'marriage-occupation': newPicker.setData(newData2);;break;
			}
			var that = $(this);
		  	newPicker.show(function(items) { 
		  		console.log(items)
			    that.html(items[0].text);
			    switch(className) {
					case 'marriage-education': 
						information.edcation.name = items[0].text;
						information.edcation.value = items[0].value;
						break;
					case 'marriage-occupation': 
						information.job.name = items[0].text;
						information.job.value = items[0].value;
						break;
				}
			    newPicker.dispose();
		  	})  
		})
	}

	$('.marriage-button').on('click',function(){
		if(information.edcation.name.length == 0){
			Common2.toast('请选择教育背景');
			return false;
		}
		if(information.job.name.length == 0){
			Common2.toast('请选择职业');
			return false;
		}
		/*基本信息*/
		$.ajax({
			url:Setting.apiRoot1 + '/u/doIntegralTask.p2p',
			type:'POST',
			dataType:'json',
			data:{
				userId:userId,
				loginToken:loginToken,
				type:1,
				jsonObj:JSON.stringify(information),
			}
		}).done(function(res){
			Common.ajaxDataFilter(res,function(res){
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