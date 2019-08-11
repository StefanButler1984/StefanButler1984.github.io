var nodes = [];
var root = null;


document.addEventListener('deviceready', function(){
        screen.orientation.lock('landscape');


        }, false);
var newGame = function () {
	$('.inventory').show();
	audioToggle();
	//	$.get("https://jsonblob.com/api/jsonBlob/0d6a5349-48d0-11e9-8a1d-43726a64651a", function (data) {

	$.get("./app/data/data.json", function (data) {
		window.nodes = data;

		try{
			window.nodes = JSON.parse(data);

		}
		catch(ex){
		}

		var initilize = "";

		for (i = 0; i < nodes.length; i++) {
			var match = nodes[i].raw.match(/<<set.*>>/)

			if (match !== null && match.length > 0) {
				match = match[0].replace(/:/g, ';');

				match = match.replace(/ to.*;/, ' = null;')
				match = match.replace(/ to.*>>/, ' = null;')
				match = match.replace('<<set', '')
				console.log(match)
				initilize = initilize + match + ";"
			}
		}

		eval(initilize)

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

	currentNode.init = function () {
		if(typeof this.mapname !== 'undefined' && this.mapname.length > 0){
			this.map = getMapPositionByName(this.mapname[0]);
		  }
		var reg = new RegExp(/\[\[.*/g);

		/*if (typeof this.commands !== 'undefined') {
			eval(this.commands);
		}*/
		if (typeof this.conditional !== 'undefined') {
			this.conditionalFunction = eval(this.conditional);
			this.header = this.conditionalFunction();
		}
		else {
			this.header = this.raw;
		}

		if (this.header.indexOf("[[") != -1) {
			var result = this.header.match(reg);
			if (result !== null) {

				for (j = 0; j < result.length; j++) {
					var decisions = "[" + result[j].replace('[[[[', '[[').replace(']]]]', ']]').replace(/\[\[/g, '{"').replace(/\]\]/g, '"},').replace(/\|/g, '":"') + "]";
					decisions = decisions.replace(",]", "]")
					decisions = JSON.parse(decisions);
					for (d = 0; d < decisions.length; d++) {
						var decision = decisions[d];
						for (var property in decision) {
							if (decision.hasOwnProperty(property)) {
								var description = property;
								var goto = decision[property];
								this.decisions.push({ description: description, goto: goto })
							}
						}

					}
					//this.decisions.push(decisions)
					this.header = this.header.replace(result[j], '');
				}


			}
		}

		this.header = this.header.replace(/(\r\n|\n|\r)/gm, ".").replace(/\.+/g, '. ').replace('?.', '? ').replace('!.', '! ').replace(/  /g, ' ').replace(/\\\. /g, '').replace("<>", '');
		this.commands = "";

		if (this.header.indexOf("{{set") !== -1) {
			var logic = this.header.match(/{{set.*}}/g)
			if (logic != null) {
				for (m = 0; m < logic.length; m++) {
					var newCommand = logic[m].replace("{{set", "").replace("}}", ";").replace(/to/g, "=").replace(/:/g, ";");
					this.header = this.header.replace(/{{set.*}}/, "");
					this.commands = this.commands + newCommand;
				}

			}
		}

		if (this.header.indexOf("<<set") !== -1) {
			var logic = this.header.match(/<<set.*>>/g)
			if (logic != null) {
				for (m = 0; m < logic.length; m++) {
					var newCommand = logic[m].replace("<<set", "").replace(">>", ";").replace(/to/g, "=").replace(/:/g, ";");
					this.header = this.header.replace(/<<set.*>>/, "");
					this.commands = this.commands + newCommand;
				}

			}
		}

		if (typeof this.commands !== 'undefined') {
			eval(this.commands);
		}
		this.header = this.header.replace(/\. *\./, '.')
	}

	currentNode.init();

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