
// https://web.stanford.edu/class/cs448f/lectures/2.1/Sharpening.pdf
function applySharpen(inputImageData, n, sd, threshold) {
	
	let outputImageData = copyImageData(inputImageData);
 	let blurredImageData = apply_Gaussian_blur({
    'input_imgdata':inputImageData,
    'n':n,
    'sd':sd
  });  // G * Input
	
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
};