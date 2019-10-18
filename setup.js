// setup variables
var myCanvas = document.getElementById('myCanvas');
var myDropZone, myThumbnailImage, myDropZoneText;
var c, ctx;
var originalImageData, workingImageData;
var myInputArray;
var draw;

var aaa = document.createElement('div');
var bbb = document.createElement('div');
aaa.style.width = '50px';
aaa.style.height = '50px';
document.getElementById('myMain').appendChild(aaa);
document.getElementById('myMain').appendChild(bbb);





	
(function() {
	
	// nonsense testing
	
				// findPos(obj) comes from https://stackoverflow.com/questions/6735470/get-pixel-color-from-canvas-on-mouseover

				// from here: until 
			
			myCanvas.addEventListener('click', function(e) {
				var pos = findPos(this);
				var x = e.pageX - pos.x;
				var y = e.pageY - pos.y;
				
				var coord = "x=" + x + ", y=" + y; 
				let c = getColor(workingImageData, x, y);
				
				console.log(c);
				aaa.style.backgroundColor = "rgb("+ c.r + ", " + c.g + ", " + c.b + ")";
				bbb.textContent = "("+ c.r + ", " + c.g + ", " + c.b + ")";

			});
			
			// id color
			myCanvas.addEventListener('mousemove', function(e) {
				var pos = findPos(this);
				var x = e.pageX - pos.x;
				var y = e.pageY - pos.y;
				
				var coord = "x=" + x + ", y=" + y;
				let c = getColor(workingImageData, x, y);
				aaa.style.backgroundColor = "rgb("+ c.r + ", " + c.g + ", " + c.b + ")";
				bbb.textContent = "("+ c.r + ", " + c.g + ", " + c.b + ")";

			});

			function findPos(obj) {
				var curleft = 0, curtop = 0;
				if (obj.offsetParent) {
						do {
								curleft += obj.offsetLeft;
								curtop += obj.offsetTop;
						} while (obj = obj.offsetParent);
						return { x: curleft, y: curtop };
				}
				return undefined;
			}
			
				// here
	
	// ^^ nonsense testing
	
	
	
	
	
	
	
	
	
	// initializing	
	myInputArray = [50, 50, 50, 0, 0, 50, 0, 0, 255, 0, 1, 1, 0];
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
						
				}
			}, false);
			// 6 pass file to reader which triggers what we defined in step 5
			reader.readAsDataURL(file);
		} // closing the if statement
		
  }, false); // closing the drop callback
	
	// this button saves the current canvas to workingImageData
	document.getElementById('myApplyChangesButton').addEventListener('click', function() {
		stopPointillization();
		workingImageData = returnCanvasImageData(c, ctx);
		restoreMyInputs();
	});
	
	// this button will restore the workingImageData
	document.getElementById('myUndoChangesButton').addEventListener('click', function() {
		stopPointillization();
		ctx.putImageData(workingImageData, 0, 0);
		restoreMyInputs();
	});
	
	// restore canvas event listener
	document.getElementById('myRestoreButton').addEventListener('click', function() {
		stopPointillization();
		workingImageData = copyImageData(originalImageData);
		ctx.putImageData(workingImageData, 0, 0);
		restoreMyInputs();
	});	
	
	
	var myInputs = document.getElementsByClassName('myInputs');
	
	// basic mods event listener
	for (var i = 0; i < 5; i++) {
		myInputs[i].addEventListener('change', function() {
			updateInputArray();
			var x = modify(workingImageData, myInputArray);
			ctx.putImageData(x, 0, 0);
		});
	}
	
	// brightness [0 to 100]
	var myBrightnessInput = document.getElementById('myBrightnessInput');
	myBrightnessInput.addEventListener('change', function() {
		var value = this.value;
		this.nextElementSibling.textContent = value;
		var x = applyBrightness(workingImageData, value);
		ctx.putImageData(x, 0, 0);
		console.log(value);
	});

	// blur event listener
	myInputs[6].addEventListener('change', function() {
		updateInputArray();
		let n = 5;
		let sd = this.value/10;
		var x = applyBlur(workingImageData, n, sd);
		ctx.putImageData(x, 0, 0);	
	});

	// sharpen event listener
	myInputs[7].addEventListener('change', function() {
		updateInputArray();
		let n = 5;
		let sd = this.value/10;
		var x = applySharpen(workingImageData, n, sd);
		ctx.putImageData(x, 0, 0);	
	});	
	
	// threshold1 event listener
	myInputs[8].addEventListener('change', function() {
		updateInputArray();
		let thresh = this.value;
		var x = applyThreshold(workingImageData, thresh, true);
		ctx.putImageData(x, 0, 0);	
	});
	
	// threshold2 event listener
	myInputs[9].addEventListener('change', function() {
		updateInputArray();
		let thresh = this.value;
		var x = applyThreshold(workingImageData, thresh, false);
		ctx.putImageData(x, 0, 0);	
	});
	
	// truncate event listener
	myInputs[10].addEventListener('change', function() {
		updateInputArray();
		let n = this.value;
		var x = applyTruncate(workingImageData, n);
		ctx.putImageData(x, 0, 0);	
	});
	
	// pixelate event listener
	myInputs[11].addEventListener('change', function() {
		updateInputArray();
		let s = myInputArray[11];
		var x = applyPixelation(workingImageData, s);
		ctx.putImageData(x, 0, 0);	
	});
	
	// tmask (contrast) event listener
	myInputs[12].addEventListener('change', function() {
		updateInputArray();
		let thresh = myInputArray[12];
		var x = applyContrast(workingImageData, thresh);
		ctx.putImageData(x, 0, 0);	
	});
	
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
	
	// edge detection event listener
	document.getElementById('mySobelButton').addEventListener('click', function() {
		var x = applySobel(workingImageData);		
		ctx.putImageData(x, 0, 0);
	});	
	
	// floodfill event listener
	document.getElementById('myFloodFillButton').addEventListener('click', function() {
		var x = floodFill(workingImageData, 65, 88, 20);		
		ctx.putImageData(x, 0, 0);
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
	
	console.log(originalImageData);
	
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
	//console.log(myInputArray);
}

function restoreMyInputs() {
  var inputs = document.getElementsByClassName('myInputs');
	inputs[0].value = 50;
	inputs[1].value = 50;
	inputs[2].value = 50;
	inputs[3].value = 0;
	inputs[4].value = 0;
	inputs[5].value = 50;
	inputs[6].value = 0;	
	inputs[7].value = 0;
	inputs[8].value = 255;
	inputs[9].value = 0;
	inputs[10].value = 1;
	inputs[11].value = 1;
	inputs[12].value = 0;
	
	for (var i = 0; i < inputs.length; i++) {
		inputs[i].nextElementSibling.textContent = inputs[i].value;
		myInputArray[i] = inputs[i].value;
	}
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
		var a = (imgData.data[loc+3]/255)*0.5;  // this way, if alpha = 0, it will stay zero
		var radius = Math.floor(2+Math.random()*3);
		
		fill(ctx, r, g, b, a);
		ellipse(ctx, x, y, radius);

	}
	}, 50);  // closing setInterval()
}
function stopPointillization() {
  clearInterval(draw);
	
	//i need to save the canvas data as an imgData object
	
	//workingImageData = ctx.getImageData(0, 0, c.width, c.height); // very interesting!!!
}
// blur function returns an image data object
function returnCanvasImageData(canvas, context) {
	x = context.getImageData(0, 0, canvas.width, canvas.height);
	return x;
}

function fill(ctx, r, g, b, a) {
	ctx.fillStyle = 'rgb(' + r + ',' + g + ', ' + b + ',' + a + ')';
}

function ellipse(ctx, x, y, rx) {
	ctx.beginPath();
	ctx.arc(x, y, rx, 0, 2*Math.PI);
	ctx.fill()	
}