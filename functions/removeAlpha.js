function removeAlpha(inputImageData) {

	var outputImageData = copyImageData(inputImageData)
	
	let r = outputImageData.data[i+0];
	let g = outputImageData.data[i+1];
	let b = outputImageData.data[i+2];
	
	for (var i = 0; i < inputImageData.data.length; i+=4) {
		if (r === 255 && g === 255 && b === 255) {
			outputImageData.data[i+0] = r;
			outputImageData.data[i+1] = g;
			outputImageData.data[i+2] = b;
			outputImageData.data[i+3] = 0;
		}
	}
	return outputImageData;
}
