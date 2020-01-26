
// myCanvas is a global variable
// getPos(obj, event) is a fn
// getColor() is a fn

var floodFillMode = false;

// define the html that the function needs to workingImageData
function addFloodFillModule() {
	
	let btn = document.createElement('button');
	btn.id = 'myFloodFillButton';
	btn.textContent = 'flood fill!'
	
	btn.addEventListener('click', function() {
		floodFillMode = true;
	});	
	
	return btn;
}

			
myCanvas.addEventListener('click', function(e) {
	if (floodFillMode) {
		
		
		const w = ctx.canvas.width, h = ctx.canvas.height;
		const imgData = ctx.getImageData(0, 0, w, h);  // imgData.data is an ArrayBuffer already
		const p32 = new Uint32Array(imgData.data.buffer); // ArrayBuffer.buffer returns the source ArrayBuffer
		
		let p = findPos(this, e);
		
		let targetColor = p32[p.x + p.y*w];  // targetColor will be ABGR; for reference, 0xFFF = 2^32 -1 = 4294967295
		
		let newColor = rgba2Uint32(255, 204, 255, 255);  // newcolor is ABGR number
		

		let x = floodFill2(p.x, p.y, targetColor, newColor);	// getting the hang of Uint32 integers
		ctx.putImageData(x, 0, 0);
	}
});


// this code is from Blindman67 on stackoverflow who answered my question
// https://stackoverflow.com/questions/59833738/how-can-i-avoid-exceeding-the-max-call-stack-size-during-a-flood-fill-algorithm/59837150#comment105842287_59837150
// this person also mentioned all kinds of inefficiencies with this code too, so i keep studying

// this wont be recursive, but will use an array to act like a callstack
function floodFill2(x, y, targetColor, newColor) {
	
	// learned about arrow notation
	// learned about ArrayBuffer object types and typed arrays
	// learned about the folly of recursion
	
	const w = ctx.canvas.width, h = ctx.canvas.height;
	const imgData = ctx.getImageData(0, 0, w, h);  // imgData.data is an ArrayBuffer already
	const p32 = new Uint32Array(imgData.data.buffer); // ArrayBuffer.buffer returns the source ArrayBuffer
	
	// a Uint32Array is an array of unsigned (all +ve) 32-bit numbers, so each element is a sequence of 32 1s and/or 0s
	// each element of p32 is a pixel in the images
	
	// each 32-bit sequence is i cant remember which endian, but the bits of the byte are left2Right, but the bytes (8bits) within the 4byte sequence are right2Left
	//const channelMask = 0xFFFFFF00; // Masks out Alpha  NOTE order of channels is ABGR, because this is really like 0x00FFFFFF, remember '0x' just means hex number
	//const cInvMask = 0x000000FF; // Mask out BGR	
	
	//const canFill = idx => (p32[idx] & channelMask) === targetColor;
	const canFill = idx => p32[idx] === targetColor;
	const canFill2 = idx => p32[idx] !== newColor;  // if you don't have this, and accidentally click on targetColor, and is next to targetColor, it loops forever
	/* can be rewritten for me, the layman
	function canFill(idx) {
		if (p32[idx] & channelMask === targetColor) {  // bitwise operators, abgr & 0xFFFFFF gives 0bgr, which is just bgr, masks out alpha
			return true;
		} else {
			return false;
		}
	}
	*/
	
	//const setPixel = (idx, newColor) => p32[idx] = (p32[idx] & cInvMask) | newColor;
	const setPixel = (idx, newColor) => p32[idx] = newColor;
	/*
	function setPixel(idx, newColor) {
		p32[idx] = (p32[idx] & cInvMask) | newColor;  // this is keep the original alpha, and use the bgr of the new color
	}
	
	
	*/
	
	// the initial position xy is the first pixel in the stack, very good
	const stack = [x + y * w]; // add starting pos to stack

  // first, stack.length === 1
	while (stack.length) {
		 let idx = stack.pop();  // idx is now equal to the last element of stack, but also removes the last element of stack
		 
		 // var arr = [1, 2, 3, 4]; var x = arr.pop(); x = 4, arr = [1, 2, 3]
		 
		 // changes the pixel idx (which refers to an index of the p32 array
		 setPixel(idx, newColor);
		 
		 // remember that canFill returns a boolean

		 // for each direction check if that pixel can be filled and if so add it to the stack
		 // if (idx +/- x) returns true, then we add it to the stack
		 
		 canFill(idx - 1) && canFill2(idx - 1) && stack.push(idx - 1); // check left
		 canFill(idx + 1) && canFill2(idx + 1) && stack.push(idx + 1); // check right
		 canFill(idx - w) && canFill2(idx - w) && stack.push(idx - w); // check Up
		 canFill(idx + w) && canFill2(idx + w) && stack.push(idx + w); // check down
	}
	// all done when stack is empty so put pixels back to canvas and return
	//ctx.putImageData(imgData,0, 0);	
	return imgData;
	
}

function rgba2Uint32(r,g,b,a) {
  let r1 = r.toString(2);
  while (r1.length < 8) {
    r1 = '0' + r1;
  }

  let g1 = g.toString(2);
  while (g1.length < 8) {
    g1 = '0' + g1;
  }

  let b1 = b.toString(2);
  while (b1.length < 8) {
    b1 = '0' + b1;
  }

  let a1 = a.toString(2);
  while (a1.length < 8) {
    a1 = '0' + a1;
  }

  let bin = a1 + b1 + g1 + r1;

  return parseInt(bin , 2);
}
