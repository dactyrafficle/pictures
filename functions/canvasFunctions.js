
function fill(r, g, b, a) {
	
	if (arguments.length === 1) {
		r = arguments[0];
		g = arguments[0];
		b = arguments[0];
		a = 255;
	}
	
	let hexString = '#';
	for (let i = 0; i < arguments.length; i++) {
		let c = Math.floor(arguments[i]);
		if (c < 0) {c = 0;}
    if (c > 255) {c = 255;}
		c = c.toString(16);
		if (c.length < 2) {c = '0' + c;}
		hexString += c;
	}
	
	ctx.fillStyle = hexString; 
};


// to add a lot of rectangles
function addRect(w, h, n) {
	let x = ctx.canvas.width;
	let y = ctx.canvas.height;
  for (let i = 0; i < n; i++) {
		rect(Math.random()*x, Math.random()*y, Math.random()*w, Math.random()*h);	
	}
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
