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
  
  
// hslToRgb
// rgbToHsl
  
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
          outputImageData.data[loc+3] = 255;
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