function splitMulti(str, tokens){
	var tempChar = tokens[0]; // We can use the first token as a temporary join character
	for(var i = 1; i < tokens.length; i++){
		str = str.split(tokens[i]).join(tempChar);
	}
	str = str.split(tempChar);
	return str;
}

items = []
for(i = 0; i< $('tw-passagedata').length; i++){
var elm = $('tw-passagedata')[i];
var name = elm.attributes.name.textContent;
var newItem = {};
newItem.name = name;
var reg = new RegExp(/\[\[.*/g);
var data = elm.innerText;
newItem.raw = data;
newItem.rawer = elm;
newItem.decisions = []
if(data.indexOf("[[") != -1){
var result = data.match(reg);
if (result !== null){

for(j = 0; j<result.length; j++){
var decisions = "[" + result[j].replace('[[[[','[[').replace(']]]]',']]').replace(/\[\[/g, '{"').replace(/\]\]/g, '"},').replace(/\|/g, '":"') + "]";
	decisions = decisions.replace(",]", "]")
	decisions = JSON.parse(decisions);
	newItem.decisions.push(decisions)
	data = data.replace(result[j], '');
}
	
	
}
}

if(data.indexOf("<<if") !== -1){
newItem.conditional = "newItem.conditional = function(){" + data.replace("<<endif>>", "`}").replace("<<else>>", "`;} else { return `").replace(/<<else if/g, "`; } else if(").replace("<<if", "if(").replace(/>>/g, ") { return `").replace(/ is /g, '==') + "}"

}

if(data.indexOf("<<set") !== -1){
var logic = data.match(/<<.*>>/g)
newItem.commands = "";
if(logic != null){
	for(m=0; m<logic.length; m++){
	 newItem.commands = newItem.commands +  logic[m].replace("<<set", "").replace(">>", ";").replace("to", "=")

}
}


}

newItem.header = data.replace(/(\r\n|\n|\r)/gm,".").replace(/\.+/g,'. ').replace('?.','? ').replace('!.','! ').replace(/  /g,' ').replace(/\\\. /g,'');
items.push(newItem)




}
