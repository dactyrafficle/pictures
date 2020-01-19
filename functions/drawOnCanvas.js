
function fill(r, g, b, a) {
	
	if (arguments.length === 1) {
		r = arguments[0];
		g = arguments[0];
		b = arguments[0];
	}
	
	if (r < 0) {
		r = 0;
	}
	if (g < 0) {
		g = 0;
	}
	if (b < 0) {
		b = 0;
	}
	if (a < 0 ) {
		a = 0;
	}
	if (r > 255) {
		r = 255;
	}
	if (g > 255) {
		g = 255;
	}
	if (b > 255) {
		b = 255
	}
	if (a > 255) {
		a = 255;
	}
	
	let r1 = r.toString(16);
	let g1 = g.toString(16);
	let b1 = b.toString(16);
	let a1 = a.toString(16);
	
	if (r1.length < 2) {
		r1 = '0' + r1;
	}
	if (g1.length < 2) {
		g1 = '0' + g1;
	}	
	if (b1.length < 2) {
		b1 = '0' + b1;
	}	
	if (a1.length < 2) {
		a1 = '0' + a1;
	}	
	
	let hexString = '#' + r1 + g1 + b1 + a1;
	//console.log(hexString);
	
	ctx.fillStyle = hexString; 
};

// woefully inadequate i know
function rect(x, y, w, h) {
	ctx.fillRect(x, y, w, h);
};

// mousepressed and mousemoved to do draw
function line(x, y, dx, dy) {
	ctx.beginPath();
	ctx.moveTo(x-dx, y-dy);
	ctx.lineTo(x, y);
	ctx.stroke();
}

function ellipse(x, y, rx) {
	ctx.beginPath();
	ctx.arc(x, y, rx, 0, 2*Math.PI);
	ctx.fill()	
}
