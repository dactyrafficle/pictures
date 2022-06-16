
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

function rgbToHsl(r, g, b){
    r /= 255, g /= 255, b /= 255;
    var max = Math.max(r, g, b), min = Math.min(r, g, b);
    var h, s, l = (max + min) / 2;

    if(max == min){
        h = s = 0; // achromatic
    }else{
        var d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        switch(max){
            case r: h = (g - b) / d + (g < b ? 6 : 0); break;
            case g: h = (b - r) / d + 2; break;
            case b: h = (r - g) / d + 4; break;
        }
        h /= 6;
    }

    return [h, s, l];
}

function hslToRgb(h, s, l){
    var r, g, b;

    if(s == 0){
        r = g = b = l; // achromatic
    }else{
        function hue2rgb(p, q, t){
            if(t < 0) t += 1;
            if(t > 1) t -= 1;
            if(t < 1/6) return p + (q - p) * 6 * t;
            if(t < 1/2) return q;
            if(t < 2/3) return p + (q - p) * (2/3 - t) * 6;
            return p;
        }

        var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
        var p = 2 * l - q;
        r = hue2rgb(p, q, h + 1/3);
        g = hue2rgb(p, q, h);
        b = hue2rgb(p, q, h - 1/3);
    }

    return [r * 255, g * 255, b * 255];
}