var mapPositions = [
  { name: 'start', x: 39, y: 76, color: 'yellow' }, //start
  { name: 'pax', x: 39, y: 69, color: 'red' }, //pax
  { name: 'oldwoman', x: 51, y: 69, color: '#1923FE' }, //old woman
  { name: 'firstdoor', x: 51, y: 62, color: '#1923FE' }, //first door
  { name: 'firstdoorkey', x: 64, y: 62, color: '#1923FE' }, //first door -> key
  { name: 'rat', x: 51, y: 55, color: '#1923FE' }, //rat
  { name: 'nestarea', x: 51, y: 47, color: '#1923FE' }, //nest area
  { name: 'nestareaboardeddoor', x: 64, y: 47, color: '#1923FE' }, //nest area -> boarded door

  { name: 'crossroads1', x: 39, y: 48, color: '#1923FE' }, //crossroads
  { name: 'crossroads1map', x: 27, y: 48, color: '#1923FE' }, //crossroads code and map

  { name: 'ratnext', x: 39, y: 40, color: '#1923FE' }, //rat nest
  { name: 'chainedman', x: 51, y: 40, color: '#1923FE' }, //chained man & pax 2

  { name: 'spareoom', x: 51, y: 34, color: '#1923FE' }, //spare oom

  { name: 'crossroads2', x: 64, y: 27, color: '#1923FE' }, //cross road
  { name: 'crossroads2crypthole', x: 51, y: 27, color: '#1923FE' }, //cross road -> crypt hole
  { name: 'worm', x: 39, y: 27, color: '#1923FE' }, //worm
  { name: 'stonesdoor', x: 27, y: 27, color: '#1923FE' }, //stones door
  { name: 'wormholedoor', x: 27, y: 19, color: '#1923FE' } //wormhole door
];

var getMapPositionByName = function(name) {
  return mapPositions.filter(function(pos) {
    return pos.name === name;
  })[0];
};

var visited = [];

var positionVisited = function(node) {
  if (visited.indexOf(node.nodeId) == -1) {
    visited.push(node.nodeId);
  }
  nodes.forEach(function(node) {
    if (visited.indexOf(node.nodeId) >= 0) node.map.color = 'black';
  });

  node.map.color = 'yellow';
};

setTimeout(function() {
  return;
  var canvas = document.getElementById('canvas');

  //report the mouse position on click
  canvas.addEventListener(
    'click',
    function(evt) {
      var mousePos = getMousePos(canvas, evt);
      // var mx = canvas.width + (mousePos.x - canvas.width);
      // var my = canvas.height + (mousePos.y - canvas.height);
      // alert(mousePos.x + ',' + mousePos.y + "::" + mx + "," + my);

      var dim = getMapDimensions();
      var x = mousePos.x / canvas.width + 0.065;
      var y = mousePos.y / canvas.height;
      alert(x + ',' + y);
    },
    false
  );

  //Get Mouse Position
  function getMousePos(canvas, evt) {
    var rect = canvas.getBoundingClientRect();
    return {
      x: evt.clientX - rect.left,
      y: evt.clientY - rect.top
    };
  }
}, 1000);

window.onresize = function(event) {
  drawCanvas();
};

window.addEventListener(
  'orientationchange',
  function(o) {
    drawCanvas();
  },
  false
);

function updateCanvasPosition(complete) {
  var initialValue = $('#canvasL').is(':visible');
  var updateComplete = false;

  var moveCanvasInterval = setInterval(function() {
    updateComplete = initialValue != $('#canvasL').is(':visible');

    if (updateComplete) {
      clearInterval(moveCanvasInterval);
      moveCanvasElement();
      if (typeof complete !== 'undefined') complete();
    }
  }, 1);

  //don't keep the interval for more than x milliseconds
  setTimeout(function() {
    clearInterval(moveCanvasInterval);
    if (!updateComplete) {
      moveCanvasElement();
      if (typeof complete !== 'undefined') complete();
    }
  }, 100);
}

function moveCanvasElement() {
  if ($('#canvasL').is(':visible')) {
    $('#canvasGroup')
      .detach()
      .prependTo('#canvasL');
  } else {
    $('#canvasGroup')
      .detach()
      .prependTo('#canvasP');
  }
}

function drawCanvas() {
  $('.canvas').remove();
  var map = $('.map');
  map.css('background-color', backgroundColor);
  updateCanvasPosition(function() {
    var canvas = document.createElement('canvas');
    canvas.id = 'canvas';
    canvas.className = 'canvas';
    $('#canvasGroup')
      .prepend(canvas)
      .ready(function() {
        fitToContainer(canvas);
        var ctx = canvas.getContext('2d');
        ctx.globalAlpha = 1;

        ctx.fillStyle = backgroundColor;
        var dim = getMapDimensions();
        ctx.fillRect(0, 0, dim.x, dim.y);
        canvas.style.left = dim.offsetLeft;
        canvas.style.zIndex = -5;
        map.css('background-color', 'transparent');
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
  });
}

function addPositions() {
  var j = window.nodes.length;
  for (var i = 0; i < window.nodes.length; i++) {
    var mapPosition = window.nodes[i].map;
    var canvas = document.createElement('canvas');
    canvas.id = i;
    canvas.className = 'canvas';

    $('#canvasGroup')
      .prepend(canvas)
      .ready(function() {
        j--;
        if (j == 0) {
          addPositionColors();
        }
      });
  }
}

function addPositionColors() {
  for (var i = 0; i < window.nodes.length; i++) {
    var mapPosition = window.nodes[i].map;
    var canvas = document.getElementById(i);

    fitToContainer(canvas);
    var ctx = canvas.getContext('2d');
    ctx.globalAlpha = 1;

    if (typeof mapPosition.color !== 'undefined')
      ctx.fillStyle = mapPosition.color;
    else ctx.fillStyle = 'transparent';

    var dim = getMapDimensions();
    ctx.fillRect(
      (dim.x * mapPosition.x) / 100,
      (dim.y * mapPosition.y) / 100,
      dim.x * 0.09,
      dim.x * 0.09
    );
    canvas.style.left = dim.offsetLeft;
    canvas.style.zIndex = -1;
  }
}

function getMapDimensions() {
  var dim = {};
  dim.x = $('.map')[0].clientWidth;
  dim.y = $('.map')[0].clientHeight;
  dim.offsetLeft = $('.map')[0].offsetLeft;

  if (dim.x == 0) {
    dim.x = $('.map')[1].clientWidth;
    dim.y = $('.map')[1].clientHeight;
    dim.offsetLeft = $('.map')[1].offsetLeft;
  }

  return dim;
}

function fitToContainer(canvas) {
  // Make it visually fill the positioned parent
  canvas.style.width = '100%';
  canvas.style.height = '100%';
  // ...then set the internal size to match
  canvas.width = canvas.offsetWidth;
  canvas.height = canvas.offsetHeight;
}
