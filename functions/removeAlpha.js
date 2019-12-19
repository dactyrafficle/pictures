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
			outputImageData.data[i+3] = 120;
		}
	}
	return outputImageData;
}

/*

ctx.putImageData(removeAlpha(workingImageData, 100), 0, 0);
		
*/
