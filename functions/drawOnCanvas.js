			
	var drawOnCanvasMode = false;

// define the html that the function needs to workingImageData
function addDrawOnCanvasModule() {
	
	let btn = document.createElement('button');
	btn.id = 'myDrawOnCanvasButton';
	btn.textContent = 'draw!'
	
	btn.addEventListener('click', function() {
		drawOnCanvasMode = true;
	});	
	
	return btn;
}		
			
myCanvas.addEventListener('mousedown', function(e) {
	mouseIsPressed = true;
	let p = findPos(this, e);
	if (mouseIsPressed && drawOnCanvasMode) {
		line(p.x, p.y, e.movementX, e.movementY)
	}
});
myCanvas.addEventListener('mousemove', function(e) {
	let p = findPos(this, e);
	if (mouseIsPressed && drawOnCanvasMode) {
		line(p.x, p.y, e.movementX, e.movementY)
	}
});				

myCanvas.addEventListener('mouseup', function() {
	mouseIsPressed = false;
});
myCanvas.addEventListener('mouseleave', function() {
	mouseIsPressed = false;
});
		
	
