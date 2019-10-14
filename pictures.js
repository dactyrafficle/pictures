// change each pixel based on myInputArray
function getColor(inputImageData, x, y) {

	var outputImageData = copyImageData(inputImageData)

	let w = inputImageData.width;
	let pixel = x + y*w;
	let i = pixel*4;

	let r1 = inputImageData.data[i+0];
	let g1 = inputImageData.data[i+1];
	let b1 = inputImageData.data[i+2];
	let a1 = inputImageData.data[i+3];
	
	let pos = {
		x: x,
		y: y,
		r: r1,
		g: g1,
		b: b1,
		a: a1
	}
	return pos;
}
		var t = [
			[0, -1],
			[-1, 0],
			[0, 1],
			[1, 0]
		];
// flood fill: start at x-y, look at up, down, left, right, if within pct%, do again
function floodFill(inputImageData, x, y, pct) {
	
	var outputImageData = copyImageData(inputImageData)
	
	let w = inputImageData.width;
	let h = inputImageData.height;
	let pixel = x + y*w;
	let i = pixel*4;
	
	// pixel i is where our color comparison will come from
		let r0 = inputImageData.data[i+0];
		let g0 = inputImageData.data[i+1];
		let b0 = inputImageData.data[i+2];
		let a0 = inputImageData.data[i+3];
		

		
		// check adjacent pixels
		for (let k = 0; k < t.length; k++) {
			checkAdjacentPixel(inputImageData, outputImageData, x, y, k, t[k][0], t[k][1], w, h, r0, g0, b0, a0, pct);
		}
	

		//outputImageData.data[i+0] = r2+(255-2*r2)*invertPct/100;
		//outputImageData.data[i+1] = g2+(255-2*g2)*invertPct/100;
		//outputImageData.data[i+2] = b2+(255-2*b2)*invertPct/100;
	
	
	return outputImageData;
	
}

function checkAdjacentPixel(inputImageData, outputImageData, x, y, m, dx, dy, w, h, r, g, b, a, pct) {
	let x1 = x + dx;
	// make sure pixel is in image
	if (x1 < 0) {
		x1 = 0;
		return null;
	}
	if (x1 > w) {
		x1 = w;
		return null;
	}
	let y1 = y + dy;
	if (y1 < 0) {
		y1 = 0;
		return null;
	}
	if (y1 > h) {
		y1 = h;
		return null;
	}
	
	let pixel1 = x1 + y1*w;
	let i1 = pixel1*4;
		let r1 = inputImageData.data[i1+0];
		let g1 = inputImageData.data[i1+1];
		let b1 = inputImageData.data[i1+2];
		let a1 = inputImageData.data[i1+3];	
	
	console.log("(" + r1 + ", " + g1 + ", " + b1 + ")");
	
	
	// test similarity
	
	let dr = Math.abs(r - r1);
	let dg = Math.abs(g - g1);
	let db = Math.abs(b - b1);
	let da = Math.abs(a - a1);
	
	if (dr < pct && dg < pct && db < pct) {
		// change color of pixel
		console.log('ok');
		outputImageData.data[i1+0] = 255
		outputImageData.data[i1+1] = 0;
		outputImageData.data[i1+2] = 0;
		outputImageData.data[i1+3] = 255;
		
		// if success, do recursive
		//checkAdjacentPixel(inputImageData, outputImageData, x1, y1, dx, dy, w, h, r, g, b, a, pct);
		
	for (let k = m; k < t.length; k++) {
			checkAdjacentPixel(inputImageData, outputImageData, x1, y1, m, t[k][0], t[k][1], w, h, r, g, b, a, pct);
		}	
		
	//checkAdjacentPixel(inputImageData, outputImageData, x1, y1, 0, -1, w, h, r, g, b, a, pct);
	
	//checkAdjacentPixel(inputImageData, outputImageData, x1, y1, -1, 0, w, h, r, g, b, a, pct);

	//checkAdjacentPixel(inputImageData, outputImageData, x1, y1, 0, 1, w, h, r, g, b, a, pct);

	//checkAdjacentPixel(inputImageData, outputImageData, x1, y1, 1, 0, w, h, r, g, b, a, pct);
		
	}
	
	// works so far
	
	// var q = floodFill(workingImageData, 108, 243, 10);
	// ctx.putImageData(x, 0, 0);
	
}







/*** ^^^^ working above ^^^^^ *******/

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
	
	n = parseInt(n);
	if (n < 3) {
		n = 3;
	}
	if (n%2 === 0) {
		n = n - 1;
	}
	if (arguments.length < 1) {
		n = 5;
		sd = 0.84089642;
	}
	if (arguments.length < 2) {
		sd = 0.84089642;
	}
	if (sd == 0) {  // cannot use === because sd is a float
		return outputImageData;
	}
	console.log('blur @ n=' + n + ', sd=' + sd);
	
	var k = (n-1)/2;
	var matrix = []; // the kernel
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
	//console.log(matrix);
	
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

// https://web.stanford.edu/class/cs448f/lectures/2.1/Sharpening.pdf
function applySharpen(inputImageData, n, sd, threshold) {
	
	var outputImageData = copyImageData(inputImageData);
 	var blurredImageData = applyBlur(inputImageData, n, sd);  // G * Input
	
	if (arguments.length < 3) {
		threshold = 30;
	} else {
		threshold = parseInt(threshold);
	}
	
	var k = 1;
	// compare input to blurredImageData
	for (var i = 0; i < inputImageData.data.length; i+=4) {
		fine_r = inputImageData.data[i+0]-blurredImageData.data[i+0];  
		fine_g = inputImageData.data[i+1]-blurredImageData.data[i+1];
		fine_b = inputImageData.data[i+2]-blurredImageData.data[i+2];

		outputImageData.data[i+0] = inputImageData.data[i+0] + fine_r*k;
		outputImageData.data[i+1] = inputImageData.data[i+1] + fine_g*k;
		outputImageData.data[i+2] = inputImageData.data[i+2] + fine_b*k;
	}
	return outputImageData;
}

function applyThreshold(inputImageData, threshold, filter) {
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
		// filter white
		if (filter) {
			if (r1 < threshold || g1 < threshold || b1 < threshold) { // only removes the pixel if ALL rgb are above thresh
				outputImageData.data[i+0] = inputImageData.data[i+0];  
				outputImageData.data[i+1] = inputImageData.data[i+1];
				outputImageData.data[i+2] = inputImageData.data[i+2];		
			} else {
				outputImageData.data[i+0] = 255;  
				outputImageData.data[i+1] = 255;
				outputImageData.data[i+2] = 255;			
			}
		} else { // filter black: only removes if ALL rgb are below the thresh
			if (r1 > threshold || g1 > threshold || b1 > threshold) {
				outputImageData.data[i+0] = inputImageData.data[i+0];  
				outputImageData.data[i+1] = inputImageData.data[i+1];
				outputImageData.data[i+2] = inputImageData.data[i+2];		
			} else {
				outputImageData.data[i+0] = 255;  
				outputImageData.data[i+1] = 255;
				outputImageData.data[i+2] = 255;			
			}
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
function applySobel(inputImageData) {
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

function applyBrightness(inputImageData, pct) {
  var outputImageData = copyImageData(inputImageData)
	
	// convert the rgb of each pixel from inputImageData and return the hsl color
	// increase lightness (l is already from 0 to 100) - how shall i do this?
	// convert back to rgb
	
	
	
	return outputImageData;
}


// https://stackoverflow.com/questions/2353211/hsl-to-rgb-color-conversion

// these 2 equations comes from the link above: I may use them

function hslToRgb(h, s, l){
    var r, g, b;

    if(s == 0){
        r = g = b = l; // achromatic
    }else{
        var hue2rgb = function hue2rgb(p, q, t){
            if(t < 0) t += 1;
            if(t > 1) t -= 1;
            if(t < 1/6) return p + (q - p) * 6 * t;
            if(t < 1/2) return q;
            if(t < 2/3) return p + (q - p) * (2/3 - t) * 6;
            return p;
        }

        var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
        var p = 2 * l - q;
        r = hue2rgb(p, q, h + 1/3);
        g = hue2rgb(p, q, h);
        b = hue2rgb(p, q, h - 1/3);
    }

    return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
}
function rgbToHsl(r, g, b){
    r /= 255, g /= 255, b /= 255;
    var max = Math.max(r, g, b), min = Math.min(r, g, b);
    var h, s, l = (max + min) / 2;

    if(max == min){
        h = s = 0; // achromatic
    }else{
        var d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        switch(max){
            case r: h = (g - b) / d + (g < b ? 6 : 0); break;
            case g: h = (b - r) / d + 2; break;
            case b: h = (r - g) / d + 4; break;
        }
        h /= 6;
    }

    return [h, s, l];
}