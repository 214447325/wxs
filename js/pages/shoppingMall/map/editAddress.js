	var formData = {
		"name": "",
        "phoneNum": "",
        "address": {
            "pro": {
				// "id":"1111",
				"name":""
			},
			"city":{
				// "id":"1111",
				"name":""
			},
			"dis":{
				// "id":"1111",
				"name":""
			}
      	},
        "detailAddress": "",
        "postcode":"",
        "isDefault":0
	};
$(function(){
	var	param = Common.getParam();
	var type = param.type;
	var pidFlag = param.addressId;
	var integralPage = param.integralPage;
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
	if(pidFlag != null){
		$('title').html('修改地址');
		getAddressDetail(pidFlag)
	}else{
		$('title').html('添加地址');
	}

	document.querySelector('.map2').addEventListener('tap',function(e){
		var dtPicker = new mui.PopPicker({
			'layer': 3
		});
		$('.mui-poppicker-btn-ok').html('完成')
	    dtPicker.setData(cityData);
            dtPicker.show(function(selectItems){
            	var adressStr = '';
                //将选择的省、市、区显示到屏幕上
                for(var i=0;i<selectItems.length;i++){
                	if(selectItems[i].text == undefined){
                    	selectItems[i].text = '';
                	}
                	adressStr+=selectItems[i].text;
                }
                 formData.address = {
	                  "pro": {
					// "id":"1111",
						"name":selectItems[0].text
					},
				"city":{
					// "id":"1111",
					"name":selectItems[1].text
					},
				"dis":{
					// "id":"1111",
					"name":selectItems[2].text
					}
		          }
                // document.getElementById('showAddress').innerHTML=adressStr;
                $('#address').val(adressStr);
            });
	})
 
	
	// 添加地址、修改地址
	$('.add').on('click',function(){
		if(checknull()){
			 formData.name = $('#name').val();
			 formData.phoneNum = $('#phoneNum').val();
			 formData.detailAddress = $('#detailAddress').val();
			 formData.postcode = $('#postcode').val();
			 var isActive = document.getElementById("mySwitch").classList.contains("mui-active");
			if(isActive){
			  formData.isDefault = 1;
			}else{  
			  formData.isDefault = 0;
			}
			if(pidFlag != null){
				formData.no = pidFlag;
				var concatAddress = JSON.stringify(formData);
				editAddress(concatAddress);
			}else{
				var concatAddress = JSON.stringify(formData);
				addAddress(concatAddress);
			}
		}
	});

	/*数据验证*/
	function checknull(){
		var phone = $('#phoneNum').val();
		if($('#name').val().length == 0){
			Common2.toast('联系人不能为空')
			return false;
		}

		if(phone.length == 0){
	      	Common2.toast('请输入手机号码！');
	      	return false;
	    }

	    if(!Common.reg.mobile.test(phone)){
		      Common2.toast('请输入正确的手机号码！');
		      return false;
	    }
	    if($('#address').val().length == 0){
			Common2.toast('请选择地区')
			return false;
		}

		if($('#detailAddress').val().length == 0){
			Common2.toast('请输入详细地址')
			return false;
		}

		return true;
	}

	/*添加地址*/
	function addAddress(concatAddress){
		$.ajax({
			url:Setting.apiRoot1 + '/u/addAddress.p2p',
			type:'POST',
			dataType:'json',
			data:{
				userId:userId,
				loginToken:loginToken,
				concatAddress:concatAddress
			}
		}).done(function(res){
			Common.ajaxDataFilter(res,function(res){
				if(res.code == 1){
					window.history.back(-1);
					 // if(param.from!=null && param.from!=undefined){
				 	// 	window.location.href = decodeURIComponent(param.from); 
      //               }else{
						// window.location.href = '../../../pages/my-account/integral/list.html'+ window.location.search;
      //               }
				}else{
					Common2.toast(res.message);
				}
			})
		})
	};

	/*修改地址*/
	function editAddress(concatAddress){
		$.ajax({
			url:Setting.apiRoot1 + '/u/updateAddress.p2p',
			type:'POST',
			dataType:'json',
			data:{
				userId:userId,
				loginToken:loginToken,
				addressId:pidFlag,
				concatAddress:concatAddress
			}
		}).done(function(res){
			Common.ajaxDataFilter(res,function(res){
				if(res.code == 1){
					if(param.from!=null && param.from!=undefined){
                        window.location.href = decodeURIComponent(param.from);
                    }else{
						window.location.href = '../../../pages/shoppingMall/map/myAddress.html'+ window.location.search;
                    }

				}else{
					Common2.toast(res.message);
				}
			})
		})
	};

	//通过id查询地址信息
	function getAddressDetail(addressId){
		$.ajax({
			url:Setting.apiRoot1 + '/u/addressDetail.p2p',
			type:'POST',
			dataType:'json',
			async:false,
			data:{
				userId:userId,
				addressId:addressId,
				loginToken:loginToken
			}
		}).done(function(res){
			Common.ajaxDataFilter(res,function(res){
				if(res.code == 1){
					var data = res.data;
					$('#phoneNum').val(data.phoneNum);
					$('#name').val(data.name);
				    $('#address').val(data.address.pro.name + data.address.city.name + data.address.dis.name);
					$('#detailAddress').val(data.detailAddress);
					$('#postcode').val(data.postcode);
					if(data.isDefault){
						$('#mySwitch').addClass('mui-active');
					}
				 	formData.address = {
		                "pro": {
							"name":data.address.pro.name
						},
						"city":{
						"name":data.address.city.name
						},
						"dis":{
						"name":data.address.dis.name
						}
		          }
				}
			})
		})
	}

	
})