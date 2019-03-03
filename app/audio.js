window.audioPlaying = false;
function audioToggle(){
	audioPlaying = !audioPlaying;
	a = document.getElementById("backgroundMusic")
	if(audioPlaying) {
		$('#musicSource').attr('src', startingMusic)

		a.play(); //a.volume=1;
		$('.audio').attr('src', "./app/images/audio-on.png")
		/*setTimeout(function(){
			$('#musicSource').attr('src', './app/sound/Diamond_Hop.mp3')
			a.load();a.play();
		},5000)*/
	}
		else {
			//a.volume=0;
			a.pause();
		$('.audio').attr('src', "./app/images/audio-off.png")

		}
			
}


document.addEventListener("visibilitychange", function() {
  console.log(document.hidden, document.visibilityState);
  	  	a = document.getElementById("backgroundMusic")

  if(document.hidden){
			a.pause();
		audioPlaying=false;
  }
  else{
		a = document.getElementById("backgroundMusic")

		a.play();
		audioPlaying=true;
			t = setInterval(function(){
				if(a.paused){
					a.play();
				}
				else{
					clearInterval(t)
				}
				
			},250)
  	  	
	  
  }
}, false);