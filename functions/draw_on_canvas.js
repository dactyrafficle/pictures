
let draw_on_canvas_mode = false;

function return_draw_on_canvas_control_module() {
  
  let div = document.createElement('div');
  div.style.border = '1px solid #ddd';
  div.style.margin = '5px';
  div.style.padding = '5px';
  
	let my_button = document.createElement('button');
	my_button.textContent = 'draw mode'
	
  let draw_mode_indicator = document.createElement('div');
  draw_mode_indicator.style.border = '1px solid #ddd';
  draw_mode_indicator.style.borderRadius = '50%';
  draw_mode_indicator.style.width = '30px';
  draw_mode_indicator.style.height = '30px';
  draw_mode_indicator.style.backgroundColor = '#f00a';
  
  let table = document.createElement('table');
  let row = document.createElement('tr');
  let cell_A1 = document.createElement('td');
  let cell_B1 = document.createElement('td');
  
  
	my_button.addEventListener('click', function() {
    
    if (draw_on_canvas_mode) {
      draw_on_canvas_mode = false;
      draw_mode_indicator.style.backgroundColor = '#f00a';
      return;
    }
    
    if (!draw_on_canvas_mode) {
      draw_on_canvas_mode = true;
      draw_mode_indicator.style.backgroundColor = '#5c5e';
      return;
    }
    
	});
  
  cell_A1.appendChild(my_button);
  cell_B1.appendChild(draw_mode_indicator);
  
  row.appendChild(cell_A1);
  row.appendChild(cell_B1);
  
  table.appendChild(row);
  div.appendChild(table);
  
  return div;
};

window.addEventListener('load', function(){
  
  my_canvas.addEventListener('mousedown', function(e) {
    mouseIsPressed = true;
    let p = findPos(this, e);
    if (mouseIsPressed && draw_on_canvas_mode) {
      line(p.x, p.y, e.movementX, e.movementY)
    }
  });

  my_canvas.addEventListener('mousemove', function(e) {
    let p = findPos(this, e);
    if (mouseIsPressed && draw_on_canvas_mode) {
      line(p.x, p.y, e.movementX, e.movementY)
    }
  });				

  my_canvas.addEventListener('mouseup', function() {
    mouseIsPressed = false;
  });
  
  my_canvas.addEventListener('mouseleave', function() {
    mouseIsPressed = false;
  });

});

		

		
	
