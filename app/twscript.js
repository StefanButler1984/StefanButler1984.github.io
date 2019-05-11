function splitMulti(str, tokens) {
	var tempChar = tokens[0]; // We can use the first token as a temporary join character
	for (var i = 1; i < tokens.length; i++) {
		str = str.split(tokens[i]).join(tempChar);
	}
	str = str.split(tempChar);
	return str;
}

items = []
for (i = 0; i < $('tw-passagedata').length; i++) {
	var elm = $('tw-passagedata')[i];
	var name = elm.attributes.name.textContent;
	var newItem = {};
	newItem.name = name;
	var reg = new RegExp(/\[\[.*/g);
	var data = elm.innerText;
	newItem.raw = data;
	newItem.rawer = elm;
	newItem.decisions = [];
	newItem.init = function () {

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
					this.decisions.push(decisions)
					this.header = this.header.replace(result[j], '');
				}


			}
		}

		this.header = this.header.replace(/(\r\n|\n|\r)/gm, ".").replace(/\.+/g, '. ').replace('?.', '? ').replace('!.', '! ').replace(/  /g, ' ').replace(/\\\. /g, '');

		if (this.header.indexOf("{{set") !== -1) {
			var logic = this.header.match(/{{set.*}}/g)
			this.commands = "";
			if (logic != null) {
				for (m = 0; m < logic.length; m++) {
					var newCommand = logic[m].replace("{{set", "").replace("}}", ";").replace(/to/g, "=").replace(/:/g, ";");
					this.header = this.header.replace(/{{set.*}}/, "");
					this.commands = this.commands + newCommand;
				}

			}
		}

		if (typeof this.commands !== 'undefined') {
			eval(this.commands);
		}
		this.header = this.header.replace(/(\r\n|\n|\r)/gm, ".").replace(/\.+/g, '. ').replace('?.', '? ').replace('!.', '! ').replace(/  /g, ' ').replace(/\\\. /g, '');

	}

	if (data.indexOf("<<set") !== -1) {
		var logic = data.match(/<<set.*>>/g)
		if (logic != null) {
			for (m = 0; m < logic.length; m++) {
				var newCommand = logic[m].replace("<<set", "{{set").replace(">>", "}}")
				data = data.replace(/<<set.*>>/, newCommand);
			}

		}
	}

	if (data.indexOf("<<if") !== -1) {

		var firstBit = data.substr(0, data.indexOf("<<if"));
		data = data.splice(0, data.indexOf("<<if"));

		newItem.conditional = "newItem.conditional = function(){ try{" + data.replace("<<endif>>", "").replace("<<else>>", "`;} else { return `" + firstBit).replace(/<<else if/g, "`; } else if(").replace("<<if", "if(").replace(/>>/g, ") { return `" + firstBit).replace(/ is /g, '==') + "`} }  catch(ex){console.log(ex); return ex.toString();}  } "


	}

	/*

	if (data.indexOf("<<set") !== -1) {
		var logic = data.match(/<<set.*>>/g)
		newItem.commands = "";
		if (logic != null) {
			for (m = 0; m < logic.length; m++) { 
				var newCommand = logic[m].replace("<<set", "").replace(">>", ";").replace(/to/g, "=").replace(/:/g, ";");
				data=data.replace(/<<set.*>>/, newCommand);
				console.log(data)
				console.log(newCommand)
				newItem.commands = newItem.commands + newCommand;
			}

		}
	}
	*/

	items.push(newItem)




}
