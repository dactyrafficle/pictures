function blurImage(inputImageData) {

	// reassign, not copy, the image data object
	var imgData = inputImageData;
	console.log(imgData);
	console.log(imgData.data.length);
	var w = imgData.width;
	var h = imgData.height;
	console.log(w + " x " + h);

	var matrixSize = 3;
	var v = 1/9;
	var matrix = [[v*1, v*1, v*1], [v*1, v*1, v*1], [v*1, v*1, v*1]];
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
		for (var j = 0; j < matrix.length; j++) {
			for (var k = 0; k < matrix[j].length; k++) {
      
				// i need to offset x and y
				var x1 = x + j - offset;
				x1 = Math.min(Math.max(x1, 0), w-1);  // constrain x1 between 0 and w
				var y1 = y + k - offset;
				y1 = Math.min(Math.max(y1, 0), h-1);
				var loc = x1 + y1*w;
				loc = Math.min(Math.max(loc, 0), w*h-1);
				
				rTotal += imgData.data[4*loc+0]*matrix[j][k];
				gTotal += imgData.data[4*loc+1]*matrix[j][k];
				bTotal += imgData.data[4*loc+2]*matrix[j][k];
			}
		}
		
		// write over the elements
		imgData.data[i+0] = rTotal;  
		imgData.data[i+1] = gTotal;
		imgData.data[i+2] = bTotal;
		imgData.data[i+3] = 255;
	}
	return imgData;	
}
