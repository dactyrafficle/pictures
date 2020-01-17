function removeAlpha(inputImageData, t) {

	var outputImageData = copyImageData(inputImageData)
	
	for (var i = 0; i < inputImageData.data.length; i+=4) {
	
		let r = inputImageData.data[i+0];
		let g = inputImageData.data[i+1];
		let b = inputImageData.data[i+2];
	
		if (r >= t && g >= t && b >=t) {
			outputImageData.data[i+0] = r;
			outputImageData.data[i+1] = g;
			outputImageData.data[i+2] = b;
			outputImageData.data[i+3] = 1; // invisible
		}
	}
	return outputImageData;
}

/*

ctx.putImageData(removeAlpha(workingImageData, 100), 0, 0);
		
*/

function restoreRGB(inputImageData) {

	var outputImageData = copyImageData(inputImageData)
	
	for (var i = 0; i < inputImageData.data.length; i+=4) {
	
		outputImageData.data[i+0] = originalImageData.data[i+0];
		outputImageData.data[i+1] = originalImageData.data[i+1];
		outputImageData.data[i+2] = originalImageData.data[i+2];
		// outputImageData.data[i+3] = 0; // invisible
	}
	return outputImageData;
}
/*

ctx.putImageData(restoreRGB(workingImageData), 0, 0);
		
*/