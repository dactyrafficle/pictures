

function MY_TABLE(obj) {
  /*
    obj = {
      'n_rows':n_rows,
      'n_cols':n_cols
    };
  */
  
  let table = document.createElement('table');
  table.style.borderCollapse = 'collapse';
  
  for (let y = 0; y < obj.n_rows; y++) {
    let tr = document.createElement('tr');
    table.appendChild(tr);
    for (let x = 0; x < obj.n_cols; x++) {
      let td = document.createElement('td');
      td.style.border = '1px solid #ddd';
      td.style.padding = '5px';
      tr.appendChild(td);
    }
  }
  
  this.table = table;
  
  this.return_table = function() {
    return this.table;
  };
  
  this.return_cell = function(n_rows, n_cols) {
    return this.table.children[n_rows-1].children[n_cols-1];
  };
  
};


function return_Gaussian_blur_module(obj) {

  /*
    obj = {
      'input_img_data':
      'n':5,
      'sd':1
    }
  */

  let div = document.createElement('div');
  div.style.border = '1px solid #ddd';
  div.style.margin = '5px';
  div.style.padding = '5px';
  
  div.innerHTML = "<div style='border: 1px solid #ddd; padding: 5px; margin: 5px;'><div> applique <span class='blue'>un flou Gaussien</span> </div><div>flouter</div><div> chaque pixel devient une moyenne des pixels autour de lui </div></div>";
  
  let table = new MY_TABLE({'n_rows':2,'n_cols':3});
  div.appendChild(table.return_table());
  table.table.style.margin = '5px';
  
  let my_input_n = document.createElement('input');
  my_input_n.type = 'number';
  my_input_n.min = 1;
  my_input_n.max = 9;
  my_input_n.step = 1;
  my_input_n.value = 5;
  
  table.return_cell(1,1).innerHTML = 'n';
  table.return_cell(1,2).appendChild(my_input_n);
  table.return_cell(1,3).innerHTML = "combien de voisins de chaque côté";
  
  let my_input_sd = document.createElement('input');
  my_input_sd.type = 'number';
  my_input_sd.min = 0;
  my_input_sd.max = 10;
  my_input_sd.step = 0.25;
  my_input_sd.value = 0;
  
  my_input_n.style.width = '5em';
  my_input_sd.style.width = '5em';
  my_input_n.style.height = '1.5em';
  my_input_sd.style.height = '1.5em';
  
  table.return_cell(2,1).innerHTML = 'sd';
  table.return_cell(2,2).appendChild(my_input_sd);
  table.return_cell(2,3).innerHTML = "l'influence des pixels voisins";
  
  my_input_n.addEventListener('input', apply);
  my_input_sd.addEventListener('input', apply);
  
  function apply() {
    // console.log(Math.random());
    
    let n = parseFloat(my_input_n.value);
    let sd = parseFloat(my_input_sd.value);
    
    my_input_n.value = n.toFixed(2);
    my_input_sd.value = sd.toFixed(2);
    
		let x = apply_Gaussian_blur({
      'input_imgdata':workingImageData,
      'n':n,
      'sd':sd
    });	
		my_ctx.putImageData(x, 0, 0);
  };

	return div;

};



function apply_Gaussian_blur(obj) {

  let inputImageData = obj.input_imgdata;
  let n = obj.n
  let sd = obj.sd;

	var outputImageData = copyImageData(inputImageData);
	var w = inputImageData.width;
	var h = inputImageData.height;
	

	if (sd === 0) {  // cannot use === because sd is a float
		return outputImageData;
	}
	console.log('blur @ n=' + n + ', sd=' + sd);
	
	var k = (n-1)/2;
	var matrix = []; // the kernel
	var matrixSum = 0;
	var offset = Math.floor(n/2);
	
	// establish values for the matrix
	for (var j = 0; j < n; j++) {
		var row = [];
		for (var i = 0; i < n; i++) {
			let a = 1/(2*Math.PI*Math.pow(sd,2));
			let b = Math.pow(j-k,2) + Math.pow(i-k,2);
			let c = 2*Math.pow(sd,2);
			let d = a*Math.exp(-b/c);
			matrixSum += d;
			row.push(d);
		}
		matrix.push(row);
	}
	
	// standardize the matrix so the sum of its elements equals 1
	for (var j = 0; j < n; j++) {
		for (var i = 0; i < n; i++) {
			matrix[i][j] /= matrixSum;
		}
	}
	//console.log(matrix);
	
	for (var i = 0; i < inputImageData.data.length; i+=4) {
	
		// for each element, get the x-y coordinates
		var pixel = Math.floor(i/4);
		var y = Math.floor(pixel/w);
		var x = pixel - y*w;
		
		var rTotal = 0;
		var gTotal = 0;
		var bTotal = 0;
		
		// loop over surrounding pixels
		for (var j = 0; j < matrix.length; j++) {
			for (var k = 0; k < matrix[j].length; k++) {
      
				// offset x and y
				var x1 = x + j - offset;
				x1 = Math.min(Math.max(x1, 0), w-1);  // constrain x1 between 0 and w
				var y1 = y + k - offset;
				y1 = Math.min(Math.max(y1, 0), h-1);
				var loc = x1 + y1*w;
				loc = Math.min(Math.max(loc, 0), w*h-1);
				
				rTotal += inputImageData.data[4*loc+0]*matrix[j][k];
				gTotal += inputImageData.data[4*loc+1]*matrix[j][k];
				bTotal += inputImageData.data[4*loc+2]*matrix[j][k];
			}
		}
		outputImageData.data[i+0] = rTotal;  
		outputImageData.data[i+1] = gTotal;
		outputImageData.data[i+2] = bTotal;
	}
	return outputImageData;	

};
