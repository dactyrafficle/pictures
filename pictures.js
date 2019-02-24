// change each pixel based on myInputArray
function modify(inputImageData, myInputArray) {

	var outputImageData = copyImageData(inputImageData)
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
		let x = 0.2126*r1 + 0.7152*g1 + 0.0722*b1;
		let r2 = r1-(grayPct/100)*(r1-x);
		let g2 = g1-(grayPct/100)*(g1-x);
		let b2 = b1-(grayPct/100)*(b1-x);
		// apply inversion
		outputImageData.data[i+0] = r2+(255-2*r2)*invertPct/100;
		outputImageData.data[i+1] = g2+(255-2*g2)*invertPct/100;
		outputImageData.data[i+2] = b2+(255-2*b2)*invertPct/100;
	}
	return outputImageData;
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

function applyBlur(inputImageData, n, sd) {

	var outputImageData = copyImageData(inputImageData);
	var w = inputImageData.width;
	var h = inputImageData.height;
	var k = (n-1)/2;
	
	if (!arguments[1]) {
		n = 5;
	}
	if (arguments.length < 3) { // if sd === 0, then that triggers !arguments[2] to be true, how odd!
		sd = 0.84089642;
	}
	if (sd == 0) {  // cannot use === because i need to keep sd a float
		return outputImageData;
	}
	
	var matrix = [];
	var matrixSum = 0;
	var offset = Math.floor(n/2);
	
	// establish values for the matrix
	for (var j = 0; j < n; j++) {
		var row = [];
		for (var i = 0; i < n; i++) {
			let a = 1/(2*Math.PI*Math.pow(sd,2));
			let b = Math.pow(j-k,2) + Math.pow(i-k,2);
			let c = 2*Math.pow(sd,2);
			let d = a*Math.exp(-b/c);
			matrixSum += d;
			row.push(d);
		}
		matrix.push(row);
	}
	
	// standardize the matrix so the sum of its elements equals 1
	for (var j = 0; j < n; j++) {
		for (var i = 0; i < n; i++) {
			matrix[i][j] /= matrixSum;
		}
	}
	console.log(matrix);
	
	for (var i = 0; i < inputImageData.data.length; i+=4) {
	
		// for each element, get the x-y coordinates
		var pixel = Math.floor(i/4);
		var y = Math.floor(pixel/w);
		var x = pixel - y*w;
		
		var rTotal = 0;
		var gTotal = 0;
		var bTotal = 0;
		
		// loop over surrounding pixels
		for (var j = 0; j < matrix.length; j++) {
			for (var k = 0; k < matrix[j].length; k++) {
      
				// offset x and y
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
		outputImageData.data[i+0] = rTotal;  
		outputImageData.data[i+1] = gTotal;
		outputImageData.data[i+2] = bTotal;
	}
	return outputImageData;	
}

function applySharpen(inputImageData, n, sd, threshold) {
	
	var outputImageData = copyImageData(inputImageData);
	var blurredImageData = applyBlur(inputImageData, n, sd);
	
	if (!arguments[3]) {
		threshold = 30;
	}
	
	// compare input to blurredImageData
	for (var i = 0; i < inputImageData.data.length; i+=4) {
		dr = inputImageData.data[i+0]-blurredImageData.data[i+0];  
		dg = inputImageData.data[i+1]-blurredImageData.data[i+1];
		db = inputImageData.data[i+2]-blurredImageData.data[i+2];
		
		//if (dr > threshold || dg > threshold || db > threshold) {
			outputImageData.data[i+0] = dr;
			outputImageData.data[i+1] = dg;
			outputImageData.data[i+2] = db;
		//}
	}
	
	return outputImageData;
}

function applyThreshold(inputImageData, threshold) {
	var outputImageData = copyImageData(inputImageData);
	var w = inputImageData.width;
	var h = inputImageData.height;
	if (!arguments[1]) {
		threshold = 50;
	}
	for (var i = 0; i < inputImageData.data.length; i+=4) {
		// if any of r,g or b is less than threshold, then we keep them, else, get rid of them
		let r1 = inputImageData.data[i+0];  
		let g1 = inputImageData.data[i+1];
		let b1 = inputImageData.data[i+2];
		if (r1 < threshold || g1 < threshold || b1 < threshold) {
			outputImageData.data[i+0] = inputImageData.data[i+0];  
			outputImageData.data[i+1] = inputImageData.data[i+1];
			outputImageData.data[i+2] = inputImageData.data[i+2];		
		} else {
			outputImageData.data[i+0] = 255;  
			outputImageData.data[i+1] = 255;
			outputImageData.data[i+2] = 255;			
		}
	}
	return outputImageData;
}

function applyContrast(inputImageData, threshold) {
	var outputImageData = copyImageData(inputImageData);
	var w = inputImageData.width;
	var h = inputImageData.height;

	var matrixSize = 3;
	var offset = Math.floor(matrixSize/2);
	
	threshold = parseInt(threshold);
	if (arguments.length < 1 || threshold === 0) {
		return outputImageData;
	}
	
	for (var i = 0; i < inputImageData.data.length; i+=4) {
	
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
				
				rTotal += Math.abs(inputImageData.data[4*loc+0]-inputImageData.data[i+0]);
				gTotal += Math.abs(inputImageData.data[4*loc+1]-inputImageData.data[i+1]);
				bTotal += Math.abs(inputImageData.data[4*loc+2]-inputImageData.data[i+2]);
			}
		}
		
		rTotal = rTotal/8;
		gTotal = gTotal/8;
		bTotal = bTotal/8;
		
		if (rTotal > threshold || gTotal > threshold || bTotal > threshold) {
			outputImageData.data[i+0] = 0;  
			outputImageData.data[i+1] = 0;
			outputImageData.data[i+2] = 0;
		} else {
			outputImageData.data[i+0] = 255;  
			outputImageData.data[i+1] = 255;
			outputImageData.data[i+2] = 255;			
		}	
	}
	return outputImageData;	
}

// sorbel on compterphile:  https://www.youtube.com/watch?v=uihBwtPIBxM
// sobel on wikipedia:			https://en.wikipedia.org/wiki/Sobel_operator
function applySobel(inputImageData, outputImageData) {
	var outputImageData = copyImageData(inputImageData);	
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
		outputImageData.data[i+0] = G;  
		outputImageData.data[i+1] = G;
		outputImageData.data[i+2] = G;
	}
	return outputImageData;	
}

function applyTruncate(inputImageData, n) {
	var outputImageData = copyImageData(inputImageData);
	var w = inputImageData.width;
	var h = inputImageData.height;
	n = parseInt(n);
	if (!arguments[1] || n === 1) {
		return outputImageData;
	}
	for (var i = 0; i < inputImageData.data.length; i+=4) {
		outputImageData.data[i+0] = Math.floor(inputImageData.data[i+0]/n)*n;
		outputImageData.data[i+1] = Math.floor(inputImageData.data[i+1]/n)*n;
		outputImageData.data[i+2] = Math.floor(inputImageData.data[i+2]/n)*n;
	}
	return outputImageData;
}

function applyPixelation(inputImageData, s) {
	var outputImageData = copyImageData(inputImageData);
	var w = inputImageData.width;
	var h = inputImageData.height;
	s = parseInt(s);
	if (!arguments[1] || s === 1) {
		return outputImageData;
	}
	for (var j = 0; j < h; j += s) {
		for (var i = 0; i < w; i += s) {
			var rTotal = 0;
			var gTotal = 0;
			var bTotal = 0;
			// calculate the values
			for (var k = 0; k < s; k++) {
				for (var f = 0; f < s; f++) {
					var x = i + k;
					x = Math.min(Math.max(x, 0), w-1);  // constrain x
					var y = j + f;
					y = Math.min(Math.max(y, 0), h-1);
					var pixel = x + y*w;
					var loc = 4*pixel;
					rTotal += inputImageData.data[loc+0];
					gTotal += inputImageData.data[loc+1];
					bTotal += inputImageData.data[loc+2];
				}
			}
			rTotal = rTotal / (s*s);
			gTotal = gTotal / (s*s);
			bTotal = bTotal / (s*s);
			// set the pixels
			for (var k = 0; k < s; k++) {
				for (var f = 0; f < s; f++) {
					var x = i + k; 
					x = Math.min(Math.max(x, 0), w-1);
					var y = j + f;
					y = Math.min(Math.max(y, 0), h-1);
					var pixel = x + y*w;
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

function applyCrayonEffect(inputImageData) {

	var outputImageData = copyImageData(inputImageData)
	
	for (var i = 0; i < inputImageData.data.length; i+=4) {
		if (inputImageData.data[i+2] > 100) {
			outputImageData.data[i+0] = 255;
			outputImageData.data[i+1] = 255;
			outputImageData.data[i+2] = 255;
			outputImageData.data[i+3] = 255;
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