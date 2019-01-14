
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


function setCurrentNode(name){
	if(name == null){
		name = "root";
		  window.currentNode = _.find(nodes, function(node){return node.nodeId.toLowerCase() == name.toLowerCase()});
		  $('.pic').attr('src', currentNode.images[0])
		$('.pic2').attr('src', currentNode.images[1])

	}
	
	$('#left').html($("<a></a>").attr("onclick", "").text());
	$('#right').html($("<a></a>").attr("onclick", "").text());
	
    if(name.toLowerCase() == "go back"){
		currentNode = previousNode;
	}
	else{
	  window.currentNode = _.find(nodes, function(node){return node.nodeId.toLowerCase() == name.toLowerCase()});
	  if(currentNode == null || typeof currentNode === 'undefined'){
		 currentNode = _.find(nodes, function(node){return node.nodeId == 'error'})
	  }

	}
	
	$('#header').html(currentNode.header);


	
	
	 fadeNext(function(){
		   
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
			
		$('#left').html($("<a></a>").attr("onclick", "choice(0)").text(desc0));
		$('#right').html($("<a></a>").attr("onclick", "choice(1)").text(desc1));

		  
	 })

    
  
}

$.get( "./data.json", function( data ) {
  window.nodes = data;

  
  setCurrentNode(null)
  

});

fadeTimeout = 2000;
fadeNext = function(callback, i){

	if(typeof i === 'undefined')
		i = 0;
	
	if(typeof currentNode.images[i] !== 'undefined'){
		fade(currentNode.images[i], function(){
			fadeNext(callback, i+1)
		})	
	}
	else{
		callback();
	}
	
}

fade = function(imageSrc, callback){
	
	$('.pic2').attr('src', imageSrc)
	setTimeout(function(){
		$('.pic').addClass('fade');
		setTimeout(function(){
			$('.pic').attr('src', imageSrc)
			setTimeout(function(){
				$('.pic').removeClass('fade')

				setTimeout(function(){
					callback()
				},100)
			},100)
			
		}, fadeTimeout)
	},100)

}

fade2 = function(callback, i){
	

	
		
			$('.pic').removeClass('fade')

		if(typeof i === 'undefined')
		i = 0;

		$('.pic').attr('src', currentNode.images[i])
		
		i++;
		if(typeof currentNode.images[i] !== 'undefined'){
			$('.pic2').attr('src', currentNode.images[i])
			setTimeout(function(){
				$('.pic').addClass('fade')
				setTimeout(function(){
					$('.pic').attr('src', currentNode.images[i])

					setTimeout(function(){
						//$('.pic').removeClass('fade')

		if(typeof currentNode.images[i+1] !== 'undefined'){
						setTimeout(function(){
							fade(callback,i)
						},2)
		}
else{callback();}		
					},5)
				},fadeTimeout)
			},250)
			
		}
		else{
			callback();
		}
		

	



				
	

}


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
  
  setCurrentNode(goto);
  


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
