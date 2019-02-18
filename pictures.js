// change each pixel based on myInputArray
function modify(inputImageData, myInputArray) {

	var redPct = myInputArray[0];
	var greenPct = myInputArray[1];
	var bluePct = myInputArray[2];
	var grayPct = myInputArray[3];
	var invertPct = myInputArray[4];
	
	for (var i = 0; i < inputImageData.data.length; i+=4) {
		// modify rgb
		let r1 = abc(inputImageData.data[i+0], redPct/100);
		let g1 = abc(inputImageData.data[i+1], greenPct/100);
		let b1 = abc(inputImageData.data[i+2], bluePct/100);
		// apply gray
		let x = r1 + g1 + b1;
		x = x/3;
		let r2 = r1-(grayPct/100)*(r1-x);
		let g2 = g1-(grayPct/100)*(g1-x);
		let b2 = b1-(grayPct/100)*(b1-x);
		// apply inversion
		inputImageData.data[i+0] = r2+(255-2*r2)*invertPct/100;
		inputImageData.data[i+1] = g2+(255-2*g2)*invertPct/100;
		inputImageData.data[i+2] = b2+(255-2*b2)*invertPct/100;
		inputImageData.data[i+3] = 255; 
	}
	
	return inputImageData;
}

// it always assumes pct is 50. that why when i rest on 70-70-30 for example, it warps the colors
function abc(val, pct) {
	if (pct > 0.5) {
	  return val + (255-val)*(pct-0.5)*2;
	} else if (pct < 0.5) {
	  return val - (val-0)*(0.5-pct)*2;
	} else {
	  return val;
	}
}

// this function applies a 3x3 linear blur to a javascript imgData object
function applyBlur(inputImageData, outputImageData) {

	var w = inputImageData.width;
	var h = inputImageData.height;

	var matrixSize = 3;
	var v = 1/9;
	var matrix = [[v*1, v*1, v*1], [v*1, v*1, v*1], [v*1, v*1, v*1]];
	var offset = Math.floor(matrixSize/2);
	
	for (var i = 0; i < inputImageData.data.length; i+=4) {
	
		// for each element, get the x-y coordinates
		var pixel = Math.floor(i/4);
		var y = Math.floor(pixel/w);
		var x = pixel - y*w;
		
		var rTotal = 0;
		var gTotal = 0;
		var bTotal = 0;
		
		// loop over the surrounding pixels
		for (var j = 0; j < matrix.length; j++) {
			for (var k = 0; k < matrix[j].length; k++) {
      
				// i need to offset x and y
				var x1 = x + j - offset;
				x1 = Math.min(Math.max(x1, 0), w-1);  // constrain x1 between 0 and w
				var y1 = y + k - offset;
				y1 = Math.min(Math.max(y1, 0), h-1);
				var loc = x1 + y1*w;
				loc = Math.min(Math.max(loc, 0), w*h-1);
				
				rTotal += inputImageData.data[4*loc+0]*matrix[j][k];
				gTotal += inputImageData.data[4*loc+1]*matrix[j][k];
				bTotal += inputImageData.data[4*loc+2]*matrix[j][k];
			}
		}
		
		// write over the elements
		outputImageData.data[i+0] = rTotal;  
		outputImageData.data[i+1] = gTotal;
		outputImageData.data[i+2] = bTotal;
		outputImageData.data[i+3] = 255;
	}
	return outputImageData;	
}

// this function tests pixels against a threshold

function applyThreshold(inputImageData, outputImageData, threshold) {

	var w = inputImageData.width;
	var h = inputImageData.height;
	if (!arguments[2]) {
		threshold = 50;
	}
	for (var i = 0; i < inputImageData.data.length; i+=4) {
	
		// if any of r,g or b is greater than threshold, then we set all of them to black, else, white
		let r1 = inputImageData.data[i+0];  
		let g1 = inputImageData.data[i+1];
		let b1 = inputImageData.data[i+2];
		if (r1 < threshold || g1 < threshold || b1 < threshold) {
			outputImageData.data[i+0] = 0;  
			outputImageData.data[i+1] = 0;
			outputImageData.data[i+2] = 0;
			outputImageData.data[i+3] = 255;		
		} else {
			outputImageData.data[i+0] = 255;  
			outputImageData.data[i+1] = 255;
			outputImageData.data[i+2] = 255;
			outputImageData.data[i+3] = 255;			
		}
	}
	return outputImageData;
}

// this function reassigns the color of any non-255 pixel

function restoreColors(inputImageData, originalImageData) {

	// reassign, not copy, the image data object
	var imgData = inputImageData;
	var w = imgData.width;
	var h = imgData.height;

	var	threshold = 250;

	for (var i = 0; i < imgData.data.length; i+=4) {
	
		// if any of r,g or b is greater than threshold, then we set all of them to black, else, white
		let r1 = imgData.data[i+0];  
		let g1 = imgData.data[i+1];
		let b1 = imgData.data[i+2];
		if (r1 > threshold && g1 > threshold && b1 > threshold) {
			// do nothing
		} else {
			imgData.data[i+0] = originalImageData.data[i+0];  
			imgData.data[i+1] = originalImageData.data[i+1];
			imgData.data[i+2] = originalImageData.data[i+2];
			imgData.data[i+3] = 255;			
		}
	}
	return imgData;
}

// this function uses inputImageData, does a 3x3 matrix, scales the sum of absolute diff to those 9 cells, and then returns a value to outputImageData
// if I output directly to inputImageData, I'm changing the imgData thats being used as an argument before im done with it, skewing the results

function applyContrast(inputImageData, outputImageData) {
	
	// reassign, not copy, the image data object
	var imgData = inputImageData;
	var w = imgData.width;
	var h = imgData.height;

	var matrixSize = 3;
	var offset = Math.floor(matrixSize/2);
	
	for (var i = 0; i < imgData.data.length; i+=4) {
	
		// for each element, get the x-y coordinates
		var pixel = Math.floor(i/4);
		var y = Math.floor(pixel/w);
		var x = pixel - y*w;
		
		var rTotal = 0;
		var gTotal = 0;
		var bTotal = 0;
		
		// loop over the surrounding pixels
		for (var j = 0; j < matrixSize; j++) {
			for (var k = 0; k < matrixSize; k++) {
      
				// i need to offset x and y
				var x1 = x + j - offset;
				x1 = Math.min(Math.max(x1, 0), w-1);  // constrain x1 between 0 and w
				var y1 = y + k - offset;
				y1 = Math.min(Math.max(y1, 0), h-1);
				var loc = x1 + y1*w;
				loc = Math.min(Math.max(loc, 0), w*h-1);
				
				rTotal += Math.abs(imgData.data[4*loc+0]-imgData.data[i+0]);
				gTotal += Math.abs(imgData.data[4*loc+1]-imgData.data[i+1]);
				bTotal += Math.abs(imgData.data[4*loc+2]-imgData.data[i+2]);
			}
		}
		
		rTotal = rTotal/8;
		gTotal = gTotal/8;
		bTotal = bTotal/8;
		
		var threshold = 20;
		if (rTotal > threshold || gTotal > threshold || bTotal > threshold) {
			var r1 = imgData.data[i+0];
			var g1 = imgData.data[i+1];
			var b1 = imgData.data[i+2];
			let w = r1 + g1 + b1;
			w = Math.floor(w/3);
			outputImageData.data[i+0] = w;  
			outputImageData.data[i+1] = w;
			outputImageData.data[i+2] = w;
		} else {
			outputImageData.data[i+0] = 255;  
			outputImageData.data[i+1] = 255;
			outputImageData.data[i+2] = 255;			

		}	

		outputImageData.data[i+3] = 255;
	}
	return outputImageData;	
}


// this one is interesting. i like it. but it needs an 'edge thinner'
function applySobel(inputImageData, outputImageData) {
	
	// sorbel on compterphile:  https://www.youtube.com/watch?v=uihBwtPIBxM

	// sobel on wikipedia:			https://en.wikipedia.org/wiki/Sobel_operator
	
	var w = inputImageData.width;
	var h = inputImageData.height;
		
	var matrixSize = 3;		
	var Gx = [[-1, 0, 1],[-2, 0, 2],[-1, 0, 1]];
	var Gy = [[-1, -2, -1],[0, 0, 0],[1, 2, 1]];
	var offset = Math.floor(matrixSize/2);


	for (var i = 0; i < inputImageData.data.length; i+=4) {
	
		// for each element, get the x-y coordinates
		var pixel = Math.floor(i/4);
		var y = Math.floor(pixel/w);
		var x = pixel - y*w;
		
		var gx = 0;
		var gy = 0;
		var G = 0;
		
		// loop over the surrounding pixels
		for (var j = 0; j < matrixSize; j++) {
			for (var k = 0; k < matrixSize; k++) {
      
				// i need to offset x and y
				var x1 = x + j - offset;
				x1 = Math.min(Math.max(x1, 0), w-1);  // constrain x1 between 0 and w
				var y1 = y + k - offset;
				y1 = Math.min(Math.max(y1, 0), h-1);
				var loc = x1 + y1*w;
				loc = Math.min(Math.max(loc, 0), w*h-1);
				
				let r = inputImageData.data[4*loc+0];
				let g = inputImageData.data[4*loc+1];
				let b = inputImageData.data[4*loc+2];
			
				let intensity = 0.2126*r + 0.7152*g + 0.0722*b;
				
				gx += intensity*Gx[j][k];
				gy += intensity*Gy[j][k];
				
			}
		}
		
		G = Math.sqrt(Math.pow(gx, 2) + Math.pow(gy, 2));
		
		// write over the elements
		outputImageData.data[i+0] = G;  
		outputImageData.data[i+1] = G;
		outputImageData.data[i+2] = G;
		outputImageData.data[i+3] = 255;
	}
	return outputImageData;	
}

// there has to be a better way for me to do this; and there are some quirks, ie. the edges
function applyPixelation(inputImageData, outputImageData) {
	
	var w = inputImageData.width;
	var h = inputImageData.height;
	
	var s = 15;
	
	// easier to start with x-y in this one
	for (var j = 0; j < h; j += s) {
		for (var i = 0; i < w; i += s) {
			
			var rTotal = 0;
			var gTotal = 0;
			var bTotal = 0;
			
			for (var k = 0; k < s; k++) {
				for (var f = 0; f < s; f++) {
					var x = i + k;  // x-y is the position of this pixel relative to the image
					var y = j + f;
					var pixel = x + y*w;  // pixel is the pixels number
					var loc = 4*pixel;
					
					rTotal = inputImageData.data[loc+0];
					gTotal = inputImageData.data[loc+1];
					bTotal = inputImageData.data[loc+2];
					
				}
			}
			
			for (var k = 0; k < s; k++) {
				for (var f = 0; f < s; f++) {
					var x = i + k;  // x-y is the position of this pixel relative to the image
					var y = j + f;
					var pixel = x + y*w;  // pixel is the pixels number
					var loc = 4*pixel;
					
					outputImageData.data[loc+0] = rTotal;
					outputImageData.data[loc+1] = gTotal;
					outputImageData.data[loc+2] = bTotal;
					
				}
			}			
			
		}
	}
	return outputImageData;	
}

function copyImageData(inputImageData) {
  var x = document.createElement('canvas');
  x.width = inputImageData.width;
  x.height = inputImageData.height;
  var y = x.getContext('2d');
  y.putImageData(inputImageData, 0, 0);
  var outputImageData = y.getImageData(0, 0, inputImageData.width, inputImageData.height);
  return outputImageData;
}
