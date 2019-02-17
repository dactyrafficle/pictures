// setup variables
var myDropZone, myThumbnailImage, myDropZoneText;
var c, ctx;
var originalImageData, workingImageData;
var myInputArray;
var draw;
	
(function() {
	
	// initializing	
	myInputArray = [50, 50, 50, 0, 0];
	myDropZone = document.getElementById('myDropZone');
	myThumbnailImage = document.getElementById('myThumbnailImage');
	myDropZoneText = document.getElementById('myDropZoneText');
 	 c = document.getElementById('myCanvas');
 	 ctx = c.getContext('2d');
  myDropZone.addEventListener('dragenter', function(e) {
    e.stopPropagation();
    e.preventDefault();
    this.style.border = '2px solid #999';
  }, false);	
  myDropZone.addEventListener('dragover', function(e) {
    e.stopPropagation();
    e.preventDefault();
    this.style.border = '2px solid #999';
  }, false);
  myDropZone.addEventListener('dragleave', function(e) {
    e.stopPropagation();
    e.preventDefault();
    this.style.border = '2px solid #ddd';
  }, false);
  myDropZone.addEventListener('drop', function(e) {
  
		// 1. stop the default behavior of drop
	e.stopPropagation();
    	e.preventDefault();
    	this.style.border = '2px solid #ddd';
		// 2. capture the file
		var file = e.dataTransfer.files[0];
		console.log('info about the drop event:');
		console.log(file);
	
		// 3. capture the file type and see if it is a valid file type
		fileType = file.name.split('.')[file.name.split('.').length-1];
		var validImage = isValidImageFileType(fileType);
	
		if (validImage) {
			
			// 4.0 check if fileReader exists				
			if (!window.FileReader) {
				alert('You need to update your browser.');
				return;
			}
				
			// 4.1 make a fileReader object
			var reader = new FileReader();
			
			// 5.0 define the fileReader load event
			reader.addEventListener('load', function(e) {
			
				console.log('info about the filereader reading the file:');
				console.log(e);
				
				// load the image into a new src tag to get the original image attributes
				var tempImage = document.createElement('img');
				tempImage.src = e.target.result;
				tempImage.onload = function() {
				
					// tempImage is where myThumbnailImage and myCanvas get their data
					
					var originalImageWidth = tempImage.width;
					var originalImageHeight = tempImage.height;
					// initializes the canvas: clear and resize dropzone + canvas, set thumbnail and capture original image data
					placeImageOnCanvasAndSetOriginalImgData(myDropZone, c, ctx, myThumbnailImage, tempImage, originalImageWidth, originalImageHeight);
					restoreMyInputs();
					
					// make a copy of workingImageData
					//var x = ctx.createImageData(workingImageData);
					//x.data.set(workingImageData.data);
					
					// feed it thru the meat grinder
					//var y = modify(x, myInputArray);
					//ctx.putImageData(y, 0, 0);
					
					
				}
			}, false);
			// 6 pass file to reader which triggers what we defined in step 5
			reader.readAsDataURL(file);
		} // closing the if statement
		
  }, false); // closing the drop callback
	
	// restore canvas event listener
	document.getElementById('restore').addEventListener('click', function() {
		stopPointillization();
		restoreCanvas(ctx);
		restoreMyInputs();
	});
	
	
	// basic mods event listener
	var myInputs = document.getElementsByClassName('myInputs');
	for (var i = 0; i < myInputs.length; i++) {
		myInputs[i].addEventListener('change', function() {
			updateInputArray();
			// make a copy of workingImageData
			var x = ctx.createImageData(workingImageData);
			x.data.set(workingImageData.data);
			// feed it thru the meat grinder
			var y = modify(x, myInputArray);
			ctx.putImageData(y, 0, 0);
		});
	}
	
	// adding event listeners for the pointillization buttons
	document.getElementById('pointillizeStart').addEventListener('click', function() {
		pointillize(c, ctx);
	});
	document.getElementById('pointillizeStop').addEventListener('click', function() {
		stopPointillization();
		
		// updating workingImageData
		var x = returnCanvasImageData(c, ctx);
		workingImageData.data.set(x.data);	
		restoreMyInputs();
	});
	
	// triangulate snorpey function
	document.getElementById('triangulate').addEventListener('click', function() {
		// https://github.com/snorpey/triangulate-image#fromimagedata
		
		var x = returnCanvasImageData(c, ctx);
		workingImageData.data.set(x.data);
		
		triangulate()
			.fromImageData(workingImageData)  // the data comes from workingImageData
			.toImageData()
			.then( function (x) {  // and gets written to workingImageData
				ctx.putImageData(x, 0, 0 );
				//workingImageData.data.set(workingImageData.data); // in this case, i'm copying the local workingImageData to the global one
			});
	});
	
	// blur event listener
	document.getElementById('myBlurButton').addEventListener('click', function() {
		var x = returnCanvasImageData(c, ctx); // return an imgdata object
		var z = ctx.createImageData(x);
		z.data.set(x.data);
		var y = applyBlur(x, z); 									// accepts and imgdata object and returns an imgdata object
		ctx.putImageData(y, 0, 0);
		
		// updating workingImageData
		var s = returnCanvasImageData(c, ctx);
		workingImageData.data.set(s.data);
		restoreMyInputs();
	});
	
	// threshold event listener
	document.getElementById('myThresholdButton').addEventListener('click', function() {
		var x = returnCanvasImageData(c, ctx);	// return an imgdata object
		var z = ctx.createImageData(x);
		z.data.set(x.data);
		var y = applyThreshold(x, z); 								// accepts and imgdata object and returns an imgdata object
		ctx.putImageData(y, 0, 0);
		
		// updating workingImageData
		var s = returnCanvasImageData(c, ctx);
		workingImageData.data.set(s.data);	
		restoreMyInputs();
	});
	
	// restore colors event listener
	document.getElementById('myRestoreColorsButton').addEventListener('click', function() {
		var x = returnCanvasImageData(c, ctx);	// return an imgdata object
		var y = restoreColors(x, originalImageData); 						// accepts and imgdata object and returns an imgdata object
		ctx.putImageData(y, 0, 0);
		restoreMyInputs();
	});
	
	// contrast, this one is hard
	document.getElementById('myContrastButton').addEventListener('click', function() {
		var x = returnCanvasImageData(c, ctx);	// return an imgdata object
		var z = ctx.createImageData(x);
		z.data.set(x.data);
		var y = applyContrast(x, z); 						// accepts and imgdata object and returns an imgdata object
		//restoreMyInputs();
		ctx.putImageData(y, 0, 0);
		
		// updating workingImageData
		var s = returnCanvasImageData(c, ctx);
		workingImageData.data.set(s.data);
		restoreMyInputs();
	});
	
	// intensity gradient event listener
	document.getElementById('mySobelButton').addEventListener('click', function() {
		var x = returnCanvasImageData(c, ctx); // return an imgdata object
		var z = ctx.createImageData(x);
		z.data.set(x.data);
		var y = applySobel(x, z);		// accepts and imgdata object and returns an imgdata object
		ctx.putImageData(y, 0, 0);
		
		// updating workingImageData
		var s = returnCanvasImageData(c, ctx);
		workingImageData.data.set(s.data);
		restoreMyInputs();
	});
	
 	// intensity gradient event listener
	document.getElementById('myPixelationButton').addEventListener('click', function() {
		var x = returnCanvasImageData(c, ctx); // return an imgdata object
		var z = ctx.createImageData(x);
		z.data.set(x.data);
		var y = applyPixelation(x, z);		// accepts and imgdata object and returns an imgdata object
		ctx.putImageData(y, 0, 0);
		
		// updating workingImageData
		var s = returnCanvasImageData(c, ctx);
		workingImageData.data.set(s.data);
		restoreMyInputs();
	});
	
}());  // closing initialization
// prepare the canvas after dropping image file
function placeImageOnCanvasAndSetOriginalImgData(container, canvas, context, myThumbnailImage, tempImage, originalImageWidth, originalImageHeight) {
	
	// clear the contents of dropZone
	myDropZoneText.style.display = 'none';
	
	console.log('original size: ' + originalImageWidth + ' x ' + originalImageHeight);
	var imageWidth = originalImageWidth;
	var imageHeight = originalImageHeight;
	
	// resizing the container (myDropZone)
	var maxDimension = 700;
	if (imageWidth > maxDimension) {
	  imageHeight *= maxDimension/imageWidth;
		imageWidth = maxDimension;
	}
	if (imageHeight > maxDimension) {
	  imageWidth *= maxDimension/imageHeight;
		imageHeight = maxDimension;
	}
	container.style.width = imageWidth + 'px';
	container.style.height = imageHeight + 'px';
	
	
	// set the thumbnail version of the image
	myThumbnailImage.src = tempImage.src;
	
	if (imageWidth >= imageHeight) {
		myThumbnailImage.width = 100;
		myThumbnailImage.height = imageHeight/imageWidth*100;
	} else {
		myThumbnailImage.height = 100;
		myThumbnailImage.width = imageWidth/imageHeight*100;
	}
	
	// resizing the canvas (myCanvas)
	canvas.width = imageWidth;
	canvas.height = imageHeight;
	
	// drawing the tempImage onto the canvas
	context.drawImage(tempImage, 0, 0, canvas.width, canvas.height);
	
	// sets both original and working
	originalImageData = context.getImageData(0, 0, canvas.width, canvas.height);
	workingImageData = context.getImageData(0, 0, canvas.width, canvas.height);
}
// basic validation
function isValidImageFileType(fileType) {
  let allowableFileTypes = ['png', 'jpg', 'jpeg', 'jfif', 'gif', 'bmp'];
  let validImageFileType = false;
  if (allowableFileTypes.indexOf(fileType) !== -1) {
    validImageFileType = true;
  } else {
    console.log('You can only use the following file types right now: ' + allowableFileTypes);
  }
  return validImageFileType;
}
// updates slider values and myInputArray values
function updateInputArray() {
  var inputs = document.getElementsByClassName('myInputs');
	for (var i = 0; i < inputs.length; i++) {
		inputs[i].nextElementSibling.textContent = inputs[i].value;
		myInputArray[i] = inputs[i].value;
	}
	console.log(myInputArray);
}
function restoreCanvas(context) {
	workingImageData.data.set(originalImageData.data);
	context.putImageData(workingImageData, 0, 0);	
}
function restoreMyInputs() {
  var inputs = document.getElementsByClassName('myInputs');
	for (var i = 0; i < inputs.length; i++) {
		if (i < 3) {
			inputs[i].value = 50;
		} else {
			inputs[i].value = 0;
		}
		inputs[i].nextElementSibling.textContent = inputs[i].value;
		myInputArray[i] = inputs[i].value;
	}
	console.log(myInputArray);
}
// pointillization functions
function pointillize(canvas, context) {
  if (draw) {
		clearInterval(draw);
	}
	// this function is special, so we're getting the imgdata right from the canvas
	var imgData = context.getImageData(0, 0, canvas.width, canvas.height);
	
	ctx.beginPath();
	ctx.rect(0, 0, c.width, c.height);
	ctx.fillStyle = 'rgba(255, 255, 255, 1)';
	ctx.fill();
	
	draw = setInterval(function() {  
	for (var i = 0; i < 100; i++) {
		// pick random integers x and y
		var y = Math.floor(Math.random()*c.height);
		var x = Math.floor(Math.random()*c.width);
		// get its position in the array
		var loc = (y*c.width + x)*4;
		// alpha in rgba goes from 0 to 1
		var r = imgData.data[loc];
		var g = imgData.data[loc+1];
		var b = imgData.data[loc+2];
		var a = 0.5;
		var radius = Math.floor(2+Math.random()*3);
		//radius = 1;
		
		ctx.beginPath();
		ctx.arc(x, y, radius, 0, 2*Math.PI);
		ctx.fillStyle = 'rgb(' + r + ',' + g + ', ' + b + ',' + a + ')';
		ctx.fill()
	}
	}, 50);  // closing setInterval()
}
function stopPointillization() {
  clearInterval(draw);
	
	//i need to save the canvas data as an imgData object
	
	workingImageData = ctx.getImageData(0, 0, c.width, c.height); // very interesting!!!
}
// blur function returns an image data object
function returnCanvasImageData(canvas, context) {
	x = context.getImageData(0, 0, canvas.width, canvas.height);
	return x;
}