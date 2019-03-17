var nodes = [];
var root = null;



var newGame = function () {
	$('.inventory').show();
	audioToggle();
	//	$.get("https://jsonblob.com/api/jsonBlob/0d6a5349-48d0-11e9-8a1d-43726a64651a", function (data) {

	$.get("./app/data/data.json", function (data) {
		window.nodes = data;


		setCurrentNode("start")

		$('.map').show();
		drawCanvas();

	});

}


function setCurrentNode(name) {
	if (name == "root") {
		window.currentNode = _.find(nodes, function (node) { return node.nodeId.toLowerCase() == name.toLowerCase() });
		$('.pic').attr('src', currentNode.images[0])
		$('.pic2').attr('src', currentNode.images[0])
	}

	$('.left-control').html($("<a></a>").attr("onclick", "").text());
	$('.right-control').html($("<a></a>").attr("onclick", "").text("Moving..."));

	if (name.toLowerCase() == "go back") {
		currentNode = previousNode;
	}
	else {
		window.currentNode = _.find(nodes, function (node) { return node.nodeId.toLowerCase() == name.toLowerCase() });
		if (currentNode == null || typeof currentNode === 'undefined') {
			currentNode = _.find(nodes, function (node) { return node.nodeId == 'error' })
		}

	}
	positionVisited(currentNode);
	drawCanvas();

	$('.header').html(currentNode.header);

	if (name == "root") {

		setTimeout(function () {
			setTimeout(function () {
				$('.pic2').removeClass('hidden');

			}, 10)

			fade();

		}, 1000)
	}
	else {
		fade();
	}

}




var fade = function () {
	fadeNext(function () {

		var desc0 = "";

		if (typeof currentNode.decisions[0] !== "undefined") {
			if (typeof currentNode.decisions[0] == "string")
				desc0 = currentNode.decisions[0];
			else
				desc0 = currentNode.decisions[0].description
		}
		var desc1 = "";
		if (typeof currentNode.decisions[1] !== "undefined") {
			if (typeof currentNode.decisions[1] == "string")
				desc1 = currentNode.decisions[1];
			else
				desc1 = currentNode.decisions[1].description
		}


		$('.left-control').html($("<a></a>").attr("onclick", "choice(0)").text(desc0));
		$('.right-control').html($("<a></a>").attr("onclick", "choice(1)").text(desc1));


	})

}

fadeTimeout = 300;
fadeNext = function (callback, i) {

	if (typeof i === 'undefined')
		i = 0;

	if (typeof currentNode.images[i] !== 'undefined') {
		fadeSingleImage(currentNode.images[i], function () {
			fadeNext(callback, i + 1)
		})
	}
	else {
		callback();
	}

}

fadeSingleImage = function (imageSrc, callback) {

	var handler = function () {
		$(".pic").unbind('load', handler);
		$('.pic').removeClass('fade')

		setTimeout(function () {

			callback()
		}, 500)

	}



	$(".pic").on('load', handler);
	$('.pic2').attr('src', imageSrc + "?rand=" + Math.random().toString().replace('0.', ''))
	$('.pic').addClass('fade');
	setTimeout(function () {

		$('.pic').attr('src', imageSrc + "?rand=" + Math.random().toString().replace('0.', ''))

	}, fadeTimeout)

}

function choice(c) {
	var goto = "";
	if (typeof currentNode.decisions[c] == "string")
		goto = currentNode.decisions[c];
	else
		goto = currentNode.decisions[c].goto

	setCurrentNode(goto);

}