
// findPos(obj) comes from https://stackoverflow.com/questions/6735470/get-pixel-color-from-canvas-on-mouseover

// from here: until 		

function findPos(obj, e) {
		var curleft = 0, curtop = 0;
		if (obj.offsetParent) {
				do {
						curleft += obj.offsetLeft;
						curtop += obj.offsetTop;
				} while (obj = obj.offsetParent);
				return { x: e.pageX - curleft, y: e.pageY - curtop };
		}
		return undefined;
	}
		
// change each pixel based on myInputArray
function getColor(inputImageData, x, y) {

	var outputImageData = copyImageData(inputImageData)

	let w = inputImageData.width;
	let pixel = x + y*w;
	let i = pixel*4;

	let r1 = inputImageData.data[i+0];
	let g1 = inputImageData.data[i+1];
	let b1 = inputImageData.data[i+2];
	let a1 = inputImageData.data[i+3];
	
	let pos = {
		x: x,
		y: y,
		r: r1,
		g: g1,
		b: b1,
		a: a1
	}
	return pos;
}