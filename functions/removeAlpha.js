

// define the html that the function needs to workingImageData
function addRemoveAlphaModule() {
	
	let btn = document.createElement('button');
	btn.id = 'myRemoveAlphaButton';
	btn.textContent = 'remove alpha!'
	
	// remove alpha event listener
	btn.addEventListener('click', function() {
		var x = removeAlpha(workingImageData, 250);		
		ctx.putImageData(x, 0, 0);
	});	
	
	return btn;
}


// define the function
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


