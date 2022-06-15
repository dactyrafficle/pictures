


function return_download_imgdata_as_png_control_module() {
	
  let div = document.createElement('div');
  div.style.border = '1px solid #ddd';
  div.style.margin = '5px';
  div.style.padding = '5px';

/*  
  let my_input = document.createElement('input');
  my_input.type = 'number';
  my_input.min = 0;
  my_input.max = 255;
  my_input.value = 250;

  div.appendChild(my_input);
*/

	let my_button = document.createElement('button');
	my_button.textContent = 'download'

	my_button.addEventListener('click', function() {
		
    // download imgdata
    // workingImageData		
		// ctx.putImageData(x, 0, 0);
    let x = c.toDataURL('image/png'); // 'image/jpg'
    let a = document.createElement('a');
    a.href = x;
    a.download = 'egg.png';
    a.click();
    a.remove();

	});
  
  div.appendChild(my_button);
  
	return div;
};