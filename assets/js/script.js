var app = new Clarifai.App({apiKey: 'bb38e194c7104836a8159309c7b25e3c'});

app.models.predict(Clarifai.GENERAL_MODEL, "https://samples.clarifai.com/metro-north.jpg").then(
  function(response) {
      console.log(response.outputs[0].data.concepts[0].name);
      document.getElementById("test").innerHTML = response.outputs[0].data.concepts[0].name;
  },
  function(err) {
    // there was an error
  }
);

document.addEventListener('DOMContentLoaded', function () {

    // References to all the element we will need.
    var video = document.querySelector('#camera-stream'),
        image = document.querySelector('#snap'),
        start_camera = document.querySelector('#start-camera'),
        controls = document.querySelector('.controls'),
        take_photo_btn = document.querySelector('#take-photo'),
        delete_photo_btn = document.querySelector('#delete-photo'),
        download_photo_btn = document.querySelector('#download-photo'),
        error_message = document.querySelector('#error-message');


    // The getUserMedia interface is used for handling camera input.
    // Some browsers need a prefix so here we're covering all the options
    navigator.getMedia = ( navigator.getUserMedia ||
    navigator.webkitGetUserMedia ||
    navigator.mozGetUserMedia ||
    navigator.msGetUserMedia);

    if(!navigator.getMedia){
        displayErrorMessage("Your browser doesn't have support for the navigator.getUserMedia interface.");
    }
    else{

        // Request the camera.
        navigator.getMedia(
            {
                video: true
            },
            // Success Callback
            function(stream){

                // Create an object URL for the video stream and
                // set it as src of our HTLM video element.
                video.src = window.URL.createObjectURL(stream);

                // Play the video element to start the stream.
                video.play();
                video.onplay = function() {
                    showVideo();
                };
         
            },
            // Error Callback
            function(err){
                displayErrorMessage("There was an error with accessing the camera stream: " + err.name, err);
            }
        );

    }



    // Mobile browsers cannot play video without user input,
    // so here we're using a button to start it manually.
    start_camera.addEventListener("click", function(e){

        e.preventDefault();

        // Start video playback manually.
        video.play();
        showVideo();

    });

    take_photo_btn.addEventListener("click", setInterval(function(e){

//        e.preventDefault();

        var snap = takeSnapshot();

        delete_photo_btn.classList.remove("disabled");
        download_photo_btn.classList.remove("disabled");

        // Set the href attribute of the download button to the snap url.
        download_photo_btn.href = snap;
        app.models.predict(Clarifai.GENERAL_MODEL, snap.substring(22)).then(
  function(response) {
      console.log(response.outputs[0].data.concepts[0].name);
      document.getElementById("test").innerHTML = response.outputs[0].data.concepts[0].name + ", " + 
          response.outputs[0].data.concepts[1].name + ", " + 
          response.outputs[0].data.concepts[2].name;
		  
	  	q = response.outputs[0].data.concepts[2]; // search query
	
	  	request = new XMLHttpRequest;
	  	request.open('GET', 'http://api.giphy.com/v1/gifs/random?api_key=dc6zaTOxFJmzC&tag='+q, true);
	
	  	request.onload = function() {
	  		if (request.status >= 200 && request.status < 400){
	  			data = JSON.parse(request.responseText).data.image_url;
	  			console.log(data);
	  			document.getElementById("giphyme").innerHTML = '<center><img src = "'+data+'"  title="GIF via Giphy"></center>';
	  		} else {
	  			console.log('reached giphy, but API returned an error');
	  		 }
	  	};

	  	request.onerror = function() {
	  		console.log('connection error');
	  	};

	  	request.send();
  },
  function(err) {
    // there was an error
  }
);
    }, 5000));


    delete_photo_btn.addEventListener("click", function(e){

        e.preventDefault();

        // Hide image.
        image.setAttribute('src', "");
        image.classList.remove("visible");

        // Disable delete and save buttons
        delete_photo_btn.classList.add("disabled");
        download_photo_btn.classList.add("disabled");

        // Resume playback of stream.
        video.play();

    });


  
    function showVideo(){
        // Display the video stream and the controls.

        hideUI();
        video.classList.add("visible");
        controls.classList.add("visible");
    }


    function takeSnapshot(){
        // Here we're using a trick that involves a hidden canvas element.  

        var hidden_canvas = document.querySelector('canvas'),
            context = hidden_canvas.getContext('2d');

        var width = video.videoWidth,
            height = video.videoHeight;

        if (width && height) {

            // Setup a canvas with the same dimensions as the video.
            hidden_canvas.width = width;
            hidden_canvas.height = height;

            // Make a copy of the current frame in the video on the canvas.
            context.drawImage(video, 0, 0, width, height);

            // Turn the canvas image into a dataURL that can be used as a src for our photo.
            
            return hidden_canvas.toDataURL();
        }
    }


    function displayErrorMessage(error_msg, error){
        error = error || "";
        if(error){
            console.error(error);
        }

        error_message.innerText = error_msg;

        hideUI();
        error_message.classList.add("visible");
    }

   
    function hideUI(){
        // Helper function for clearing the app UI.

        controls.classList.remove("visible");
        start_camera.classList.remove("visible");
        video.classList.remove("visible");
        snap.classList.remove("visible");
        error_message.classList.remove("visible");
    }
    
    function takePhoto(){
//        e.preventDefault();

        var snap = takeSnapshot();

        // Show image. 
//        image.setAttribute('src', snap);
//        image.classList.add("visible");

        // Enable delete and save buttons
        delete_photo_btn.classList.remove("disabled");
        download_photo_btn.classList.remove("disabled");

        // Set the href attribute of the download button to the snap url.
        download_photo_btn.href = snap;

        // Pause video playback of stream.
//        video.pause();
        
        app.models.predict(Clarifai.GENERAL_MODEL, snap.substring(22)).then(
  function(response) {
      console.log(response.outputs[0].data.concepts[0].name);
      document.getElementById("test").innerHTML = response.outputs[0].data.concepts[0].name + ", " + 
          response.outputs[0].data.concepts[1].name + ", " + 
          response.outputs[0].data.concepts[2].name;
  },
  function(err) {
    // there was an error
  }
);
    }

});
