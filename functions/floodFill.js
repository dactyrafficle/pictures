

// define the html that the function needs to workingImageData
function addFloodFillModule() {
	
	let btn = document.createElement('button');
	btn.id = 'myFloodFillButton';
	btn.textContent = 'flood fill!'
		
	
	btn.addEventListener('click', function() {
		
		let targetColor = new Uint8ClampedArray(4);
		targetColor[0] = selectedColorObj.r;
		targetColor[1] = selectedColorObj.g;
		targetColor[2] = selectedColorObj.b;
		targetColor[3] = selectedColorObj.a;

		let newColor = new Uint8ClampedArray(4);
		newColor[0] = 255;
		newColor[1] = 201;
		newColor[2] = 255;
		newColor[3] = 255;
		
		let id = ctx.createImageData(1,1); // only do this once per page
		let d  = id.data;                        // only do this once per page
		d[0]   = newColor[0];
		d[1]   = newColor[1];
		d[2]   = newColor[2];
		d[3]   = newColor[3];
		  
		
		//let x = floodFill(workingImageData, selectedColorObj.x, selectedColorObj.y, 1);
		floodFill2(selectedColorObj.x, selectedColorObj.y, targetColor, newColor, id)
		//ctx.putImageData(x, 0, 0);
		
	});	
	
	return btn;
}

// i wonder that if instead of modifying the workingImageData, floodFill simply drew over the canvas in real time, and if it was good, we apply it save whats on the canvas?


// should be an extremely easy one
// this function will work off the canvas data only, not image data
function floodFill2(x, y, targetColor, newColor, id) {
	
	// to get the image data of the point x, y -> need to convert x and y to the img data array
	let c = ctx.getImageData(x, y, 1, 1).data;
	
	//console.log(c);
	//console.log(targetColor);
	//console.log(newColor);
	
	
	// if the pixel doesnt match the target color, end function
	if (c[0] !== targetColor[0] || c[1] !== targetColor[1] || c[2] !== targetColor[2]) {
		return;
	}
	
	// if the pixel is already the newcolor, exit function
	if (c[0] === newColor[0] || c[1] === newColor[1] || c[2] === newColor[2]) {
		// this means we've already been here, so we should ignore it
		return;
	}
	
	
	// change the color of the pixel
	ctx.putImageData(id, x, y);
	
	
	
	// check neighbors
	floodFill2(x-1, y, targetColor, newColor, id);
	floodFill2(x+1, y, targetColor, newColor, id);
	floodFill2(x, y-1, targetColor, newColor, id);
	floodFill2(x, y+1, targetColor, newColor, id);
   
  return;
	
	
	
}


// define the function

// flood fill: start at x-y, look at up, down, left, right, if within pct%, do again
function floodFill(inputImageData, x, y, pct) {
	
	ctx.fillStyle = '#fcf';
	
	//let outputImageData = copyImageData(inputImageData)
	
	let w = inputImageData.width;
	let h = inputImageData.height;
	let pixel = x + y*w;
	
	let c = getColor(inputImageData, x, y);

	// we will only visit pixels that meet our criteria
	let visited = [];
	
	// stack contains pixels we will visit, but have not yet visited
	let stack = [];

	// the pixel we clicked on is the first one added to the visited array
	visited.push({
		x: x,
		y: y
	});
	console.log('visited: ' + visited.length);

	// we need to see which of the current pixels neighbors meet our criteria
	// and we add those to the stack
	// but we dont change their color until we visit them
	// once we visit them, we change their color, AND we look to see if any of THEIR neighbors meet our criteria - so we can add them to the stack
	
	// our operation is done when stack.length === 0
	// that means that we have no more pixels that meet the criteria worth checking for possible neighbors
	
	
	
	
	// visited has 1 pixel
	// initiate the stack  // stack is an array of objects
	
	// look at the first pixel in stack
	// add it to visited
	// get its neighbors, add to stack IFF they are not in visited and not already in stack
	// in this way, stack will grow
	
	// in the end, stack = [], and visited contains all the pixels we want
	
	
	// initiate stack
	stack = getArrayOfNeighbors(inputImageData, x, y, w, h, c.r, c.g, c.b, pct);
	console.log('initial stack: ' + stack.length);
	
	// maybe it has to do with the uninterruptability of a while loop - should I switch to a for loop?
	
	while (stack.length >= 1 && stack.length < 200) {
	//for (let a = stack.length; a >= 1; a--) {
		
		console.log(stack.length);
		// look at stack[0] and add to visited
		
		let obj3 = stack[0];
		
		visited.push(obj3);
		
		//
		console.log(obj3);

		ctx.fillRect(obj3.x, obj3.y, 1, 1);
		
		// for the first element of stack, get its neighbors
		
		let tempX = stack[0].x;
		let tempY = stack[0].y;
		
		// the original colors are c.r, c.g, c.b/c
		// but i can get stack[0]'s color too
		
		let c2 = getColor(inputImageData, tempX, tempY);
		
		
		let arr2 = getArrayOfNeighbors(inputImageData, tempX, tempY, w, h, c2.r, c2.g, c2.b, pct);

		for (let k = 0; k < arr2.length; k++) {
			
			// the coords of the new pixel we might want to add
			let x_ = arr2[k].x;
			let y_ = arr2[k].y;

			// if not in visited
		
			let isInVisited = false;
			for (let i = 0; i < visited.length; i++) {
				
				if (x_ === visited[i].x && y_ === visited[i].y) {
					isInVisited = true;
				} else {
					// do nothing
				}	
			}

			// and not in stack already		
			let isInStack = false;
			for (let i = 0; i < stack.length; i++) {
				
				if (x_ === stack[i].x && y_ === stack[i].y) {
					isInStack = true;
				} else {
					// do nothing
				}	
			}
			
			if (!isInVisited && !isInStack) {
				stack.push(arr2[k]);
			}
			
		}


		// even if we added nothing new to stack, we still delete stack[0]
		stack.splice(0, 1);
		
	}
	
	console.log('visited: ' + visited.length);
	console.log(visited);
	
	// now change the color of all the cells in visited
	
	for (let i = 0; i < visited.length; i++) {
		
		let x_ = visited[i].x;
		let y_ = visited[i].y;
		
		//console.log(x_ + ', ' + y_);
		let pixel2 = x_ + y_*w;
		let i_ = pixel2*4;
		
		
		
		//outputImageData.data[i_+0] = 255
		//outputImageData.data[i_+1] = 0;
		//outputImageData.data[i_+2] = 0;
		//outputImageData.data[i_+3] = 255;		
		
		/*
		ctx.fillStyle = '#fcf';
		console.log(x_ + ": " + y_);
		ctx.fillRect(x_, y_, 1, 1);
		*/
	}
	
	

	
	return outputImageData;
	
}

// returns an array of pixels which may be added to the stack - checks color criters, but not previous inclusion in stack or visited
function getArrayOfNeighbors(inputImageData, x, y, w, h, r, g, b, pct) {

  let m = [];
  let arr = [];
  for (let y_ = -1; y_ < 2; y_++) {
    for (let x_ = -1; x_ < 2; x_++) {
      if (x_ === 0 && y_ == 0) {
        // do nothing
      } else {
        m.push({
          x: x_,
          y: y_
        });
      }
    }
  }
	
	for (let i = 0; i < m.length; i++) {
		let x1 = x + m[i].x;
		let y1 = y + m[i].y;
		if (x1 >= 0 && x1 <= w && y1 >= 0 && y1 <= h) {

			let c = getColor(inputImageData, x1, y1);
			let dr = Math.abs(c.r - r);
			let dg = Math.abs(c.g - g);
			let db = Math.abs(c.b - b);
			
			if (dr < pct && dg < pct && db < pct) {
				arr.push(c);
			} else {
				// do nothing
			}
		}
	}
	return arr;
}

function checkAdjacentPixel(inputImageData, outputImageData, x, y, m, dx, dy, w, h, r, g, b, a, pct) {
	let x1 = x + dx;
	// make sure pixel is in image
	if (x1 < 0) {
		x1 = 0;
		return null;
	}
	if (x1 > w) {
		x1 = w;
		return null;
	}
	let y1 = y + dy;
	if (y1 < 0) {
		y1 = 0;
		return null;
	}
	if (y1 > h) {
		y1 = h;
		return null;
	}
	
	let pixel1 = x1 + y1*w;
	let i1 = pixel1*4;
		let r1 = inputImageData.data[i1+0];
		let g1 = inputImageData.data[i1+1];
		let b1 = inputImageData.data[i1+2];
		let a1 = inputImageData.data[i1+3];	
	
	console.log("(" + r1 + ", " + g1 + ", " + b1 + ")");
	
	
	// test similarity
	
	let dr = Math.abs(r - r1);
	let dg = Math.abs(g - g1);
	let db = Math.abs(b - b1);
	let da = Math.abs(a - a1);
	
	if (dr < pct && dg < pct && db < pct) {
		// change color of pixel
		console.log('ok');
		
		
		//outputImageData.data[i1+0] = 255
		//outputImageData.data[i1+1] = 0;
		//outputImageData.data[i1+2] = 0;
		//outputImageData.data[i1+3] = 255;
		
		// if success, do recursive
		//checkAdjacentPixel(inputImageData, outputImageData, x1, y1, dx, dy, w, h, r, g, b, a, pct);
		
	for (let k = m; k < t.length; k++) {
			checkAdjacentPixel(inputImageData, outputImageData, x1, y1, m, t[k][0], t[k][1], w, h, r, g, b, a, pct);
		}	
			
	}
	

	
}
