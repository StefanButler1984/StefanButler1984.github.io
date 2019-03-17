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
newItem.conditional = splitMulti(q.replace("<<endif>>",'').replace("<<if", ""),["<<else if", "<<else>>"])

}

newItem.header = data.replace(/(\r\n|\n|\r)/gm,".").replace(/\.+/g,'. ').replace('?.','? ').replace('!.','! ').replace(/  /g,' ').replace(/\\\. /g,'');
items.push(newItem)




}
