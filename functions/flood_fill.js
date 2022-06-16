
let flood_fill_mode = false;

function return_flood_fill_control_module() {
  
  let div = document.createElement('div');
  div.style.border = '1px solid #ddd';
  div.style.margin = '5px';
  div.style.padding = '5px';
  
	let my_button = document.createElement('button');
	my_button.textContent = 'flood fill!'
	
  let flood_fill_indicator = document.createElement('div');
  flood_fill_indicator.style.border = '1px solid #ddd';
  flood_fill_indicator.style.borderRadius = '50%';
  flood_fill_indicator.style.width = '30px';
  flood_fill_indicator.style.height = '30px';
  flood_fill_indicator.style.backgroundColor = '#f00a';
  
  let table = document.createElement('table');
  let row = document.createElement('tr');
  let cell_A1 = document.createElement('td');
  let cell_B1 = document.createElement('td');
  
	my_button.addEventListener('click', function() {
    
    if (flood_fill_mode) {
      flood_fill_mode = false;
      flood_fill_indicator.style.backgroundColor = '#f00a';
      return;
    }
    
    if (!flood_fill_mode) {
      flood_fill_mode = true;
      flood_fill_indicator.style.backgroundColor = '#5c5e';
      return;
    }
    
	});
  
  cell_A1.appendChild(my_button);
  cell_B1.appendChild(flood_fill_indicator);
  
  row.appendChild(cell_A1);
  row.appendChild(cell_B1);
  
  table.appendChild(row);
  div.appendChild(table);
  
  return div;
};

window.addEventListener('load', function() {
  


c.addEventListener('click', function(e) {
  
  		let g = findPos(this, e);  // p = {'x':x,'y':y}
    //console.log(g);
  
	if (flood_fill_mode) {
		
		
		const w = ctx.canvas.width, h = ctx.canvas.height; // ok so far so good
    
		const imgData = ctx.getImageData(0, 0, w, h);  // imgData.data is an ArrayBuffer already
		const p32 = new Uint32Array(imgData.data.buffer); // ArrayBuffer.buffer returns the source ArrayBuffer. and we're using it to return an array of 32-bit unsigned integers
		
    console.log(imgData.data.buffer);
    
		let p = findPos(this, e);  // p = {'x':x,'y':y}
    console.log(p);
    
    let loc = p.x + p.y * w;
    
		let targetColor = p32[loc];  // targetColor will be ABGR; for reference, 0xFFF = 2^32 -1 = 4294967295
		console.log(targetColor);  // might return 4290869566 for example (a shade a blue)
    
    // targetColor / 2**24 = y, int(y) = color, targetColor -= int(y)*2**24 etc etc...
    
    
		//let newColor = rgba2Uint32(255, 204, 255, 255);  // newcolor is ABGR number
		//console.log(newColor);
    let newColor = 255*16777216 + 0*65536 + 204*256 + 255;
    
    console.log(newColor);

		let x = floodFill2(p.x, p.y, targetColor, newColor);	// getting the hang of Uint32 integers
		ctx.putImageData(x, 0, 0);
	}
});

  
}); // closing window.onload



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
	const channelMask = 0x00E0E0E0;
 
  // mask the alpha
  // F8 = 11111000
  // F0 = 11110000
  // E0 = 11100000
  
  // THERE HAS TO BE A WAY TO GET A HSL CONVERSION, SO I CAN APPLY CHANNELS THERE TOO

   //const channelMask = 00FFFF00; // Masks out Alpha  NOTE order of channels is ABGR, because this is really like 0x00FFFFFF, remember '0x' just means hex number
	//const cInvMask = 0x000000FF; // Mask out BGR	
  
  
  
  // what if i want to mask out only the lower digits of each, say += 8 for each one?
  // what corresponds to 11111000 ?
     
     // canFill : make sure the pixel is the target color
     // canFill2 : make sure the prospective pixel is not already the new color
     

	const canFill = (idx, targetColor) => (p32[idx] & channelMask) === (targetColor & channelMask);
	//const canFill = idx => p32[idx] === targetColor;
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
	const stack = [x + y * w]; // add starting pos to stack. locations

  // first, stack.length === 1
	while (stack.length) {
		 let idx = stack.pop();  // idx is now equal to the last element of stack, but also removes the last element of stack
		 
     // stack.pop() returns the last element of stack, while removing it. so it splits it into 2 arrays
     
		 // let arr = [1, 2, 3, 4]; let x = arr.pop(); x = 4, arr = [1, 2, 3]
		 
		 // changes the pixel idx (which refers to an index of the p32 array
     let newTarget = p32[idx] & channelMask;
		 setPixel(idx, newColor);
     // p32[location_of_idx] = newColor
    
		 // remember that canFill returns a boolean

		 // for each direction check if that pixel can be filled and if so add it to the stack
		 // if (idx +/- x) returns true, then we add it to the stack
		 
     // now we add to the stack, to keep it going
     
     // canFill : make sure the pixel is the target color
     // canFill2 : make sure the prospective pixel is not already the new color
		   
       // by changing the target, we're making the decision to color based on the CURRENT color, not the initial target
       
      canFill(idx - 1, newTarget) && canFill2(idx - 1) && stack.push(idx - 1); // check left
      canFill(idx + 1, newTarget) && canFill2(idx + 1) && stack.push(idx + 1); // check right
      canFill(idx - w, newTarget) && canFill2(idx - w) && stack.push(idx - w); // check Up
      canFill(idx + w, newTarget) && canFill2(idx + w) && stack.push(idx + w); // check down
    /*
       canFill2(idx - 1) && stack.push(idx - 1); // check left
       canFill2(idx + 1) && stack.push(idx + 1); // check right
       canFill2(idx - w) && stack.push(idx - w); // check Up
       canFill2(idx + w) && stack.push(idx + w); // check down
    */
	}
	// all done when stack is empty so put pixels back to canvas and return
	//ctx.putImageData(imgData,0, 0);	
	return imgData;
	
}

