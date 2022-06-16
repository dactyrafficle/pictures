

// define the html that the function needs to workingImageData
function return_restore_original_rgb_control_module() {
  
  let div = document.createElement('div');
  div.style.border = '1px solid #ddd';
  div.style.margin = '5px';
  div.style.padding = '5px';
  
	let my_button = document.createElement('button');
	my_button.textContent = 'restore original RGB'
  
	my_button.addEventListener('click', function() {
		let x = restore_original_rgb(workingImageData);		
		my_ctx.putImageData(x, 0, 0);
	});
  
  div.appendChild(my_button);
	
	return div;
};

// define the function
function restore_original_rgb(inputImageData) {

	let outputImageData = copyImageData(inputImageData)
	
	for (let i = 0; i < inputImageData.data.length; i+=4) {
	
		outputImageData.data[i+0] = originalImageData.data[i+0];
		outputImageData.data[i+1] = originalImageData.data[i+1];
		outputImageData.data[i+2] = originalImageData.data[i+2];
		// outputImageData.data[i+3] = 0; // invisible
	}
  
	return outputImageData;
};
