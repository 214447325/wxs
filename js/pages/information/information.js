function touchLeftRight(htmlName,leftUrl,rightUrl){
	var el = document.querySelector(htmlName);
	var startPosition, endPosition, deltaX, deltaY, moveLength;
	el.addEventListener('touchstart' ,function(e){
		var touch = e.touches[0];
		startPosition = {
			x:touch.pageX,
			y:touch.pageY
		};
	});
	el.addEventListener('touchmove', function(e){
		var touch = e.touches[0];
		endPosition = {
			x:touch.pageX,
			y:touch.pageY
		};
	});
	el.addEventListener('touchend', function(e){
		deltaX = startPosition.x - endPosition.x;
		deltaY = startPosition.y - endPosition.y;
		moveLength = Math.sqrt(Math.pow(Math.abs(deltaX), 2) + Math.pow(Math.abs(deltaY), 2));
		// $(".test").css("left",deltaX);
		if(deltaX>200 && rightUrl != undefined){
			console.log(1)

			location.href = rightUrl;
		}
		if (deltaX< -200 && leftUrl != undefined) {
			location.href = leftUrl;
		}
	})
}