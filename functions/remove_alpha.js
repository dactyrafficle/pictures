

// define the html that the function needs to workingImageData
function return_remove_alpha_control_module() {
	
  let div = document.createElement('div');
  div.style.border = '1px solid #ddd';
  div.style.margin = '5px';
  div.style.padding = '5px';
  
  let my_input = document.createElement('input');
  my_input.type = 'number';
  my_input.min = 0;
  my_input.max = 255;
  my_input.value = 250;

  div.appendChild(my_input);
  
	let my_button = document.createElement('button');
	my_button.textContent = 'remove alpha!'
	
	// remove alpha event listener
	my_button.addEventListener('click', function() {
    let t = my_input.value;
		let x = remove_alpha(workingImageData, t);		
		ctx.putImageData(x, 0, 0);
	});
  
  div.appendChild(my_button);
  
	return div;
}


// define the function
function remove_alpha(inputImageData, t) {

	let outputImageData = copyImageData(inputImageData);

	for (let i = 0; i < inputImageData.data.length; i+=4) {
	
		let r = inputImageData.data[i+0];
		let g = inputImageData.data[i+1];
		let b = inputImageData.data[i+2];
	
		if (r >= t && g >= t && b >= t) {
			outputImageData.data[i+0] = r;
			outputImageData.data[i+1] = g;
			outputImageData.data[i+2] = b;
			outputImageData.data[i+3] = 1; // invisible
		}
	}
  
	return outputImageData;
};


