var Common2 = {};
var $body = $('body');

var Toast = function(config){
	this.context = config.context == null ? $('body') : config.context;
	this.message = config.message;
	this.time = config.time == null ? 3000 : config.time;
	this.left = config.left;
	this.top = config.top;
	this['border-radius'] = config['border-radius'] == null ? '10px' : config['border-radius'];
	this.imgsrc = config.imgsrc == undefined ? null : config.imgsrc;
	this.fadeOut = config.fadeOut == undefined ? true : config.fadeOut;
	this.init();
}
var msgEntity;
Toast.prototype = {
	init:function(){
		$('#toastMessage').remove();
		var msgDIV = new Array();
		msgDIV.push('<div id="toastMessage">');
		msgDIV.push('<span style="color:#fff;font-size:0.3733rem;">' + this.message + '</span>');
		msgDIV.push('</div>');
		msgEntity = $(msgDIV.join('')).appendTo(this.context);
		var left = this.left == null ? this.context.width()/2 - msgEntity.find('span').width()/2 - 20 : this.left;
		var top = this.top == null ? '20px' : this.top;
		var radius = this['border-radius'];
		msgEntity.css({
			'position':'absolute',
			'top':top,
			'z-index':'99',
			'left':left,
			'background':'rgba(0, 0, 0, .6)',
			'color':'white',
			'fong-size':'18px',
			'padding':'0.2rem 0.3rem',
			'border-radius':radius
		});
		if(this.imgsrc != null){
			this.img();
		}
		this.fadeIns();
		if(this.fadeOut){
			this.wearOff();
		}
	},
	fadeIns: function(){
		msgEntity.fadeIn(this.time/2);
	},
	wearOff: function(){
		msgEntity.fadeOut(this.time);
	},
	img: function(){
		$('#toastMessage').find('span').before($('<img src="'+this.imgsrc+'" style="width:0.7rem;display:block;margin:auto;margin-bottom:0.1rem;"/>'));
	}
}

$.extend(Common2, {
	toast: function(message,img,fadeOut){
		new Toast({
	        'context':$('body'),
	        'message':message,
	        'top':'45%',
	        'border-radius':'0.2rem',
	        'imgsrc':img,
	        'fadeOut':fadeOut
	    }); 
	}
})