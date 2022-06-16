
(function() {


  window.addEventListener('load', function() {
    
      mySelectButton.addEventListener('click', function() {
        if (selectMode) {
          selectMode = false;
          mySelectButton.style.backgroundColor = '#eee'; //'#c2d1f0';
          mySelectButton.style.border = '2px solid transparent';
        } else {
          selectMode = true;
          mySelectButton.style.backgroundColor = '#c2d1f0';
          mySelectButton.style.border = '2px solid #3366cc';
        }
        // console.log(selectMode);
      });

  });
  
  window.addEventListener('load', function() {
    
    // click on thumbnail to set canvas image as thumbnail image
    document.getElementById('myThumbnailImage').addEventListener('click', function(e){
      console.log(e);
      let tempImage = document.createElement('img');
      tempImage.src = this.src;
      tempImage.onload = function() {
      
        let originalImageWidth = tempImage.width;
        let originalImageHeight = tempImage.height;
        // initializes the canvas: clear and resize dropzone + canvas, set thumbnail and capture original image data
        placeImageOnCanvasAndSetOriginalImgData(my_drop_zone, c, ctx, myThumbnailImage, tempImage, originalImageWidth, originalImageHeight);
        restoreMyInputs();
          
      }
    });
    
  });
      


  window.addEventListener('load', function() {

    // get selected color
    myCanvas.addEventListener('click', function(e) {
    let p = findPos(this, e);
    selectedColorObj = getColor(workingImageData, p.x, p.y);

    let c = getColor(workingImageData, p.x, p.y);
    // console.log(selectMode);

    selected_color_box.style.backgroundColor = "rgb(" + c.r + ", " + c.g + ", " + c.b + ", " + c.a + ")";
    selectedColorBoxInfo.innerHTML = "<div>selected color</div><div>(x,y) = (" + c.x + ", " + c.y + ")" + '</div><div>' + " (r,g,b,a) = ("+ c.r + ", " + c.g + ", " + c.b + ", " + c.a + ")</div>";


    // console.log(c);

    // if select mode is true, draw a box
    });
  });
      
   window.addEventListener('load', function() {
     
			myCanvas.addEventListener('mousedown', function(e) {
				let p = findPos(this, e);
				selectedColorObj = getColor(workingImageData, p.x, p.y);
				
				let c = getColor(workingImageData, p.x, p.y);
        // console.log(c);
        if (selectMode) {
          selection.x0 = c.x;
          selection.y0 = c.y;
        }
      });        
			
			myCanvas.addEventListener('mouseup', function(e) {
				let p = findPos(this, e);
				selectedColorObj = getColor(workingImageData, p.x, p.y);
				
				let c = getColor(workingImageData, p.x, p.y);
			  // console.log(c);
        if (selectMode) {
          selection.x1 = c.x;
          selection.y1 = c.y;
          console.log(selection);
          
          
          let w = selection.x1 - selection.x0;
          let h = selection.y1 - selection.y0;
          
          // draw box where selection is
          ctx.beginPath();
          ctx.rect(selection.x0, selection.y0, w, h);
          ctx.stroke();
        }
      
      
      
      });  

      
      
			// get current color
			myCanvas.addEventListener('mousemove', function(e) {
				let p = findPos(this, e);
				currentColorObj = getColor(workingImageData, p.x, p.y);
				let c = getColor(workingImageData, p.x, p.y);
				
				current_color_box.style.backgroundColor = "rgb("+ c.r + ", " + c.g + ", " + c.b + ", " + c.a + ")";
				currentColorBoxInfo.innerHTML = "<div>current color</div><div>(x,y) = (" + c.x + ", " + c.y + ")" + '</div><div>' + " (r,g,b,a) = ("+ c.r + ", " + c.g + ", " + c.b + ", " + c.a + ")</div>";

			});



      

	

	
  my_drop_zone.addEventListener('dragenter', function(e) {
    e.stopPropagation();
    e.preventDefault();
    this.style.border = '2px solid #999';
  }, false);	
  my_drop_zone.addEventListener('dragover', function(e) {
    e.stopPropagation();
    e.preventDefault();
    this.style.border = '2px solid #999';
  }, false);
  my_drop_zone.addEventListener('dragleave', function(e) {
    e.stopPropagation();
    e.preventDefault();
    this.style.border = '2px solid #ddd';
  }, false);
  my_drop_zone.addEventListener('drop', function(e) {
  
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
					placeImageOnCanvasAndSetOriginalImgData(my_drop_zone, c, ctx, myThumbnailImage, tempImage, originalImageWidth, originalImageHeight);
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
    let r_min = parseInt(document.getElementById('pointilize_r_min').value);
    let r_max = parseInt(document.getElementById('pointilize_r_max').value);
    let a_min = parseInt(document.getElementById('pointilize_a_min').value);
    let a_max = parseInt(document.getElementById('pointilize_a_max').value);
		pointillize(c, ctx, r_min, r_max, a_min, a_max);
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
  
  }); // closing window.onload
	
}());  // closing initialization



// prepare the canvas after dropping image file
function placeImageOnCanvasAndSetOriginalImgData(container, canvas, context, myThumbnailImage, tempImage, originalImageWidth, originalImageHeight) {
	
	// clear the contents of dropZone
	my_drop_zone_text_box.style.display = 'none';
	
	
	
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
function pointillize(canvas, context, rad_min, rad_max, a_min, a_max) {
  
   let frameCount = 0;
   let count = 0;
  let maxFrameCount = 1600;
  
  let dots_per_frame = 100;
  
  let rad_pow = 1;
  let rad_range = rad_max - rad_min;
  let a_range = a_max - a_min;
  
  if (draw) {
		clearInterval(draw);
	}
	// this function is special, so we're getting the imgdata right from the canvas
	var imgData = context.getImageData(0, 0, canvas.width, canvas.height);
	
	ctx.beginPath();
	ctx.rect(0, 0, c.width, c.height);
	ctx.fillStyle = 'rgba(255, 255, 255, 255)'; // by setting alpha=1, or 0, it makes the background transparent
	ctx.fill();
	
	draw = setInterval(function() {
    
    if (frameCount > maxFrameCount) {
      dots_per_frame = 150;
    }
    
	for (var i = 0; i < dots_per_frame; i++) {

		// pick random integers x and y
		let y = Math.floor(Math.random()*c.height);
		let x = Math.floor(Math.random()*c.width);

		// get its position in the array
		var loc = (y*c.width + x)*4;
    
		// alpha in rgba goes from 0 to 1
		var r = imgData.data[loc];
		var g = imgData.data[loc+1];
		var b = imgData.data[loc+2];

		
    // by frame 2400, there should only be rad_min left
    let rad;
    
    if (frameCount < maxFrameCount) {
      rad = Math.floor(rad_min + Math.random() * (rad_max*(1-frameCount/maxFrameCount) - rad_min));
      
    } else {
      // frameCount > maxFrameCount
      rad = Math.floor(rad_min + Math.random() * 2);
      
    }
    
    
    //let rad = Math.floor(rad_min + Math.random() * (rad_max - rad_min));
    let drad = rad - rad_min;
    let drad_pct = drad / rad_range;
    let a = a_max - drad_pct*a_range;

    // calculate the greyscale of each color
    let f0 = (r + g + b)/3;
    let f1 = (r - f0)**2;
    let f2 = (g - f0)**2;
    let f3 = (b - f0)**2;
    let f = (f1 + f2 + f3)/3;
  
    /*
    // shadow
    if (f < 50 && r < 250 && Math.random() > 0.5) {
		 //fill(50, 100, 205, 1); // a in (0,255), where 0=transparent; 255=opaque
		 fill(255, 0, 0, 1); // a in (0,255), where 0=transparent; 255=opaque
		 ellipse(x, y, radius*(1+Math.random()*2));
    }
    */

    // regular dots
		fill(r, g, b, a); // a in (0,255), where 0=transparent; 255=opaque
		ellipse(x, y, rad);
    
	}
  
  
  // capture frames
  if (false && frameCount%2===0 && count < 60) {
    
    // console.log(frameCount);
    
    let MIME_TYPE = "image/png";
    let a = document.createElement('a');
    let imgURL = canvas.toDataURL(MIME_TYPE); // canvas is already defined as funtion parameter
    
    //a.href = 'data:,' + encodeURI(imgURL); // this really is key
    
    
    if (count < 10) {
      a.download = 'x-0' + count + '.png';
    } else {
      a.download = 'x-' + count + '.png';
    }
    count++;
    
    a.href = imgURL;
    a.dataset.downloadurl = [MIME_TYPE,a.download, a.href].join(':');
    
    document.body.appendChild(a);
    a.target = '_blank';
    a.click();
    a.remove(); 
  
  }
  frameCount++;
  
	}, 16);  // closing setInterval()
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


