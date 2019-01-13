
window.audioPlaying = false;
function audioToggle(){
	audioPlaying = !audioPlaying;
	a = document.getElementById("backgroundMusic")
	if(audioPlaying) {
		
		a.play(); //a.volume=1;
		$('.audio').attr('src', "./images/audio-on.png")
		setTimeout(function(){
			$('#musicSource').attr('src', '/sound/Diamond_Hop.mp3')
			a.load();a.play();
		},5000)
	}
		else {
			//a.volume=0;
			a.pause();
		$('.audio').attr('src', "./images/audio-off.png")

		}
			
}
var nodes = [];
var root = null;
var universe = getURLParam('universe',location.search)
var currentNode = getURLParam('node',location.search)
if(universe == null)
  universe = 'ad7cbr'

$.get( "./data.json", function( data ) {
  window.nodes = data;
/*
  _.each(data[1].data.children, function(c){

    try{
      c.data.body = c.data.body.replaceAll('&amp;#x200B;','')
      var obj = JSON.parse(c.data.body);
      //if(typeof c.data.replies.data !== 'undefined')
        //obj.replies = c.data.replies.data.children;
    nodes.push(obj);
    } catch(ex){}
    });
  */
  if(currentNode == null){
    currentNode = "root"
  }
    
  currentNodeId = currentNode;
  //console.log(JSON.stringify(nodes));
   currentNode = decodeURI(currentNode);
   currentNode = _.find(nodes, function(node){return node.nodeId.toLowerCase() == currentNode.toLowerCase()});
  
  if(currentNode == null || typeof currentNode === 'undefined'){
    currentNode = _.find(nodes, function(node){return node.nodeId == 'error'})
  }
  else{
    currentNode.nodeId = currentNodeId;

  }
  
  
  currentNode.topChild = null;
  
  /*
  _.each(currentNode.replies, function(child){
child=child.data;
    try{
        if(currentNode.topChild==null) currentNode.topChild = child;
else if (currentNode.topChild.score < child.score) currentNode.topChild = child
      
      currentNode.topChild = JSON.parse(currentNode.topChild.body)

    } catch(ex){}
    });
  
  */
$('.pic').attr('src', currentNode.images[0])
$('.pic2').attr('src', currentNode.images[1])

  
  $('#header').html(currentNode.header);
  
      var desc0 = "";
  if(typeof currentNode.decisions[0] == "string")
    desc0 = currentNode.decisions[0];
  else
    desc0 = currentNode.decisions[0].description
  
        var desc1 = "";

  if(typeof currentNode.decisions[1] == "string")
    desc1 = currentNode.decisions[1];
  else
    desc1 = currentNode.decisions[1].description
    
        $('#left').html($("<a></a>").attr("onclickd", "choice(0)").text(desc0));
        $('#right').html($("<a></a>").attr("onclickd", "choice(1)").text(desc1));

    
  //  $('#left').wrapInner('<a onclick="choice(0)">' + currentNode.decisions[0] + '</a>');
  //  $('#right').wrapInner('<a onclick="choice(1)">' + currentNode.decisions[1] + '</a>');

  setTimeout(function(){
    $('#background').show();

  },200)

});

fadeTimeout = 2000;
fade = function(i){
	

		$('.pic').attr('src', currentNode.images[i])
		if(typeof currentNode.images[i+1] !== 'undefined'){
			$('.pic2').attr('src', currentNode.images[i+1])
			setTimeout(function(){
				$('.pic').addClass('fade')
				setTimeout(function(){
					$('.pic').attr('src', currentNode.images[i+1])

					setTimeout(function(){
						$('.pic').removeClass('fade')

						setTimeout(function(){
							fade(i+1)
						},2)					
					},2)
				},fadeTimeout)
			},250)
			
		}



				
	

}
setTimeout(function(){
	fade(0);

})

String.prototype.replaceAll = function(search, replacement) {
    var target = this;
    return target.replace(new RegExp(search, 'g'), replacement);
};

function choice(c){
  var goto = "";
   if(typeof currentNode.decisions[c] == "string")
    goto = currentNode.decisions[c];
  else
    goto = currentNode.decisions[c].goto
  
  if(currentNode.nodeId.toLowerCase() == "error" || goto.toLowerCase() == "go back")
    location.href = "http://"+location.host + "/?universe=" + universe + "&node=" +getURLParam('p',location.search) ;
else
location.href = "http://"+location.host + "/?universe=" + universe + "&node=" + goto + "&p=" + currentNode.nodeId;

}

function getURLParam(key,target){
    var values = [];
    if (!target) target = location.href;

    key = key.replace(/[\[]/, "\\\[").replace(/[\]]/, "\\\]");

    var pattern = key + '=([^&#]+)';
    var o_reg = new RegExp(pattern,'ig');
    while (true){
        var matches = o_reg.exec(target);
        if (matches && matches[1]){
            values.push(matches[1]);
        } else {
            break;
        }
    }

    if (!values.length){
        return null;   
    } else {
        return values.length == 1 ? values[0] : values;
    }
}
