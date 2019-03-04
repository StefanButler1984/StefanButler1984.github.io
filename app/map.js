var mapPositions = [];


setTimeout(function(){
	$('.map').show();

})

setTimeout(function(){
	drawCanvas();

	var canvas = document.getElementById("canvas");

//report the mouse position on click
canvas.addEventListener("click", function (evt) {
	var mousePos = getMousePos(canvas, evt);
	var mx = canvas.width + (mousePos.x - canvas.width);
	var my = canvas.height + (mousePos.y - canvas.height);
	alert(mousePos.x + ',' + mousePos.y + "::" + mx + "," + my);
}, false);

//Get Mouse Position
function getMousePos(canvas, evt) {
	var rect = canvas.getBoundingClientRect();
	return {
			x: evt.clientX - rect.left,
			y: evt.clientY - rect.top
	};
}
})

window.onresize = function(event) {
	drawCanvas();
};

window.addEventListener("orientationchange", function(o) {
	
	drawCanvas();

}, false);


function updateCanvasPosition(complete){
	var initialValue = $('#canvasL').is(":visible");
	var updateComplete = false;
	
	var moveCanvasInterval = setInterval(function(){
		updateComplete = initialValue != $('#canvasL').is(":visible");

		if(updateComplete){
			clearInterval(moveCanvasInterval);
			moveCanvasElement();
			if(typeof complete !== 'undefined')
				complete();
		}

	},1)

	//don't keep the interval for more than x milliseconds
	setTimeout(function(){
		clearInterval(moveCanvasInterval);
		if(!updateComplete){
			moveCanvasElement();
			if(typeof complete !== 'undefined')
				complete();
		}
	},100)

}

function moveCanvasElement(){
	if($('#canvasL').is(":visible")){
		$("#canvasGroup").detach().prependTo('#canvasL')
	}
	else{
		$("#canvasGroup").detach().prependTo('#canvasP')
	}
}

function drawCanvas(){
	updateCanvasPosition(function(){
		var canvas = document.getElementById("canvas");
		fitToContainer(canvas);
		var ctx = canvas.getContext("2d");
		ctx.globalAlpha = 0.5

		ctx.fillStyle = "#1923FE";	
		var dim = getMapDimensions();
		var x = canvas.width - dim.x;
		var y = canvas.height - dim.y;
		ctx.fillRect(0, y, canvas.width-x, canvas.height-y);
		canvas.style.left = dim.offsetLeft;



		var canvas = document.getElementById("canvas2");
		fitToContainer(canvas);
		var ctx = canvas.getContext("2d");
		ctx.globalAlpha = 0.5

		ctx.fillStyle = "red";	
		var dim = getMapDimensions();
		var x = canvas.width - dim.x;
		var y = canvas.height - dim.y;
		ctx.fillRect(0, y, canvas.width-x, canvas.height-y);
		canvas.style.left = dim.offsetLeft;
	})

}

function getMapDimensions(){
	var dim = {};
	dim.x = $('.map')[0].clientWidth;
	dim.y = $('.map')[0].clientHeight;
	dim.offsetLeft = $('.map')[0].offsetLeft;

	if(dim.x == 0){
		dim.x = $('.map')[1].clientWidth;
		dim.y = $('.map')[1].clientHeight;
		dim.offsetLeft = $('.map')[1].offsetLeft;
	}

	return dim;

}



function fitToContainer(canvas){
  // Make it visually fill the positioned parent
  canvas.style.width ='100%';
  canvas.style.height='100%';
  // ...then set the internal size to match
  canvas.width  = canvas.offsetWidth;
  canvas.height = canvas.offsetHeight;
}
