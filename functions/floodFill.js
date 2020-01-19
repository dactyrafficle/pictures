

// define the html that the function needs to workingImageData
function addFloodFillModule() {
	
	let btn = document.createElement('button');
	btn.id = 'myFloodFillButton';
	btn.textContent = 'flood fill!'
	
	// remove alpha event listener
	btn.addEventListener('click', function() {
		let x = floodFill(workingImageData, selectedColorObj.x, selectedColorObj.y, 1);		
		ctx.putImageData(x, 0, 0);
	});	
	
	return btn;
}

// i wonder that if instead of modifying the workingImageData, floodFill simply drew over the canvas in real time, and if it was good, we apply it save whats on the canvas?



// define the function

// flood fill: start at x-y, look at up, down, left, right, if within pct%, do again
function floodFill(inputImageData, x, y, pct) {
	
	var outputImageData = copyImageData(inputImageData)
	
	let w = inputImageData.width;
	let h = inputImageData.height;
	let pixel = x + y*w;
	//let i = pixel*4;
	
	let c = getColor(inputImageData, x, y);

	// let us try the flood filling now
	
	// we will only visit pixels that meet our criteria
	let visited = [];
	
	// stack contains pixels we will visit, but have not yet visited
	let stack = [];
	
	let obj = {
		x: x,
		y: y
	}
	
	visited.push(obj);
	console.log('visited: ' + visited.length);
	
	// loop over stack while it's length is > 0 until there are no more items in stack
	// bc stack is the array of things we will consider candidates to add to visited
	
	
	
	// visited has 1 pixel
	// initiate the stack
	
	// look at the first pixel in stack
	// add it to visited
	// get its neighbors, add to stack IFF they are not in visited and not already in stack
	// in this way, stack will grow
	
	// in the end, stack = [], and visited contains all the pixels we want
	
	
	// initiate stack
	stack = getArrayOfNeighbors(inputImageData, x, y, w, h, c.r, c.g, c.b, pct);
	console.log('initial stack: ' + stack.length);
	
	while (stack.length >= 1 && stack.length < 1000) {
		
		console.log(stack.length);
		// look at stack[0] and add to visited
		visited.push(stack[0]);
		
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
		
		outputImageData.data[i_+0] = 255
		outputImageData.data[i_+1] = 0;
		outputImageData.data[i_+2] = 0;
		outputImageData.data[i_+3] = 255;		
		
		
	}
	
	

	
	return outputImageData;
	
}

function getArrayOfNeighbors(inputImageData, x, y, w, h, r, g, b, pct) {
	
	let m = [];
	let arr = [];
	for (let i = -1; i < 2; i++) {
		for (let j = -1; j < 2; j++) {
			let x_ = i;
			let y_ = j;
			let obj = {
				x: x_,
				y: y_
			}
			if (x_ === 0 && y_ == 0) {
				// do nothing
			} else {
				m.push(obj);
			}
		}
	}
	//console.log(m);
	
	for (let i = 0; i < m.length; i++) {
		let x1 = x + m[i].x;
		let y1 = y + m[i].y;
		if (x1 >= 0 && x1 <= w && y1 >= 0 && y1 <= h) {
			let obj = {
				x: x1,
				y: y1
			}
			// does the pixel (x1, y1) have the color r, g, b? if yes, add; else, no
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
	//console.log(arr);
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
		outputImageData.data[i1+0] = 255
		outputImageData.data[i1+1] = 0;
		outputImageData.data[i1+2] = 0;
		outputImageData.data[i1+3] = 255;
		
		// if success, do recursive
		//checkAdjacentPixel(inputImageData, outputImageData, x1, y1, dx, dy, w, h, r, g, b, a, pct);
		
	for (let k = m; k < t.length; k++) {
			checkAdjacentPixel(inputImageData, outputImageData, x1, y1, m, t[k][0], t[k][1], w, h, r, g, b, a, pct);
		}	
		
	//checkAdjacentPixel(inputImageData, outputImageData, x1, y1, 0, -1, w, h, r, g, b, a, pct);
	
	//checkAdjacentPixel(inputImageData, outputImageData, x1, y1, -1, 0, w, h, r, g, b, a, pct);

	//checkAdjacentPixel(inputImageData, outputImageData, x1, y1, 0, 1, w, h, r, g, b, a, pct);

	//checkAdjacentPixel(inputImageData, outputImageData, x1, y1, 1, 0, w, h, r, g, b, a, pct);
		
	}
	
	// works so far
	
	// var q = floodFill(workingImageData, 108, 243, 10);
	// ctx.putImageData(x, 0, 0);
	
}
