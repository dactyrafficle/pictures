

// define the html that the function needs to workingImageData
function addRestoreRgbButton() {
	
	let btn = document.createElement('button');
	btn.id = 'myRestoreRgbButton';
	btn.textContent = 'restore RGB!'
	
	// remove alpha event listener
	btn.addEventListener('click', function() {
		var x = restoreRGB(workingImageData);		
		ctx.putImageData(x, 0, 0);
	});	
	
	return btn;
}

// define the function
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
