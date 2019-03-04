var mapPositions = [
	{x: 39, y:76, color: "black"},
	{x: 39, y:69, color: "black"},
	{x: 39, y:48, color: "black"},
	{x: 39, y:40, color: "black"},
	{x: 39, y:27, color: "black"},
	{x: 51, y:69, color: "black"},
	{x: 51, y:62, color: "black"},
	{x: 51, y:55, color: "black"},
	{x: 51, y:47, color: "black"},
	{x: 51, y:40, color: "yellow"},
	/*{x: 51, y:34, color: "black"},
	{x: 51, y:27, color: "black"},
	{x: 64, y:62, color: "black"},
	{x: 64, y:47, color: "black"},
	{x: 64, y:27, color: "black"},
	{x: 27, y:48, color: "black"},
	{x: 27, y:27, color: "black"},
	{x: 27, y:19, color: "black"},*/

];


setTimeout(function(){
	$('.map').show();
	drawCanvas();

})

setTimeout(function(){
return;
	var canvas = document.getElementById("canvas");

//report the mouse position on click
canvas.addEventListener("click", function (evt) {
	var mousePos = getMousePos(canvas, evt);
	// var mx = canvas.width + (mousePos.x - canvas.width);
	// var my = canvas.height + (mousePos.y - canvas.height);
	// alert(mousePos.x + ',' + mousePos.y + "::" + mx + "," + my);

	var dim = getMapDimensions();
	var x = mousePos.x / canvas.width + .065;
	var y = mousePos.y / canvas.height;
	alert(x + ',' + y);


}, false);

//Get Mouse Position
function getMousePos(canvas, evt) {
	var rect = canvas.getBoundingClientRect();
	return {
			x: evt.clientX - rect.left,
			y: evt.clientY - rect.top
	};
}
},1000)

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
	$('.canvas').remove()

	updateCanvasPosition(function(){
		var canvas = document.createElement('canvas');
		canvas.id = "canvas";
		canvas.className = "canvas";		
		$('#canvasGroup').prepend(canvas).ready(function () {

			fitToContainer(canvas);
			var ctx = canvas.getContext("2d");
			ctx.globalAlpha = 1
	
			ctx.fillStyle = "#1923FE";	
			var dim = getMapDimensions();
			ctx.fillRect(0, 0, dim.x, dim.y);
			canvas.style.left = dim.offsetLeft;
			canvas.style.zIndex = -5;
		});




		/*var canvas = document.getElementById("canvas2");
		fitToContainer(canvas);
		var ctx = canvas.getContext("2d");
		ctx.globalAlpha = 0.5

		ctx.fillStyle = "red";	
		var dim = getMapDimensions();
		ctx.fillRect(dim.x*.39, dim.y*.69 ,dim.x*.09, dim.x*.09);
		canvas.style.left = dim.offsetLeft;*/

		addPositions();
	})

}

function addPositions(){
	var j = mapPositions.length;
	for(var i = 0; i< mapPositions.length; i++){
		var mapPosition = mapPositions[i];
		var canvas = document.createElement('canvas');
		canvas.id = i;
		canvas.className = "canvas";

		$('#canvasGroup').prepend(canvas).ready(function () {
			j--;
			if(j ==0){
				addPositionColors();
			}
		});
	}
}

function addPositionColors(){
	for(var i = 0; i< mapPositions.length; i++){
		var mapPosition = mapPositions[i];
		var canvas = document.getElementById(i);

		fitToContainer(canvas);
		var ctx = canvas.getContext("2d");
		ctx.globalAlpha = 1;
	
		ctx.fillStyle = mapPosition.color;	
		var dim = getMapDimensions();
		ctx.fillRect(dim.x*mapPosition.x/100, dim.y*mapPosition.y/100 ,dim.x*.09, dim.x*.09);
		canvas.style.left = dim.offsetLeft;	
		canvas.style.zIndex = -1;

	}			
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
