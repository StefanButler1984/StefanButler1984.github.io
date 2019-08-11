function splitMulti(str, tokens) {
  var tempChar = tokens[0]; // We can use the first token as a temporary join character
  for (var i = 1; i < tokens.length; i++) {
    str = str.split(tokens[i]).join(tempChar);
  }
  str = str.split(tempChar);
  return str;
}

items = [];
for (i = 0; i < $('tw-passagedata').length; i++) {
  var elm = $('tw-passagedata')[i];
  var newItem = {};
  newItem.nodeId = elm.attributes.name.textContent;
  newItem.map = { name: 'start', x: 39, y: 76, color: 'yellow' } //start;
  /*newItem.images = [
		"./app/images/corridor/2_far.png",
		"./app/images/corridor/2_close.png"
	];*/
  newItem.images = [];
  var data = elm.innerText;
  newItem.raw = data;
  newItem.rawer = elm;
  newItem.decisions = [];
  var image_re = /\n.*?\.png/g;
  var image_match = data.match(image_re);
  if (typeof image_match !== 'undefined' && image_match !== null) {
    newItem.images = image_match.map(function(j) {
	  newItem.raw = newItem.raw.replace(j, '');
	  j=j.replace(/\n/g, '');

      return './app/PNG/'+j;
    });
  }

  var map_re = /\n.*?\.map/g;
  var map_match = data.match(map_re);
  if (typeof map_match !== 'undefined' && image_match !== null) {
    newItem.mapname = map_match.map(
      function(j) {
        newItem.raw = newItem.raw.replace(j, '');
		return j.replace(/\n/g, '').replace('.map', '');
	}
    );
  }

  if (data.indexOf('<<set') !== -1) {
    var logic = data.match(/<<set.*>>/g);
    if (logic != null) {
      for (m = 0; m < logic.length; m++) {
        var newCommand = logic[m].replace('<<set', '{{set').replace('>>', '}}');
        data = data.replace(/<<set.*>>/, newCommand);
      }
    }
  }

  if (data.indexOf('<<if') !== -1) {
    var firstBit = data.substr(0, data.indexOf('<<if'));
    data = data.splice(0, data.indexOf('<<if'));

    newItem.conditional =
      'this.conditional = function(){ try{' +
      data
        .replace('<<endif>>', '')
        .replace('<<else>>', '`;} else { return `' + firstBit)
        .replace(/<<else if/g, '`; } else if(')
        .replace('<<if', 'if(')
        .replace(/>>/g, ') { return `' + firstBit)
        .replace(/ is /g, '==') +
      '`} }  catch(ex){console.log(ex); return ex.toString();}  } ';
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

 
  items.push(newItem);
}

//to test copy the entire init function from app.js and paste it here
//so you have newItem.init = function(){ ... }
//you can then loop over all the nodes and execute init to see if any errors occur
//since init depends on map you need to paste that into the console
/*

for(q=0; q<items.length; q++){
console.log(q)
items[q].init()
}

*/

k = JSON.stringify(items);
