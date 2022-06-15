/* LAST UPDATED : 2022-06-14-1955 EDT */

/*

let b = new Box();
let c = b.RETURN_CANVAS();
container.appendChild(c);

b.CANVAS_SIZE(500, 500);     SETS THE DIMENSIONS OF THE CANVAS IN PIXELS
b.RANGE_X(-1, 11);           SETS THE DIMENSIONS OF THE X AXIS IN UNITS
b.RANGE_Y(-1, 11);           SETS THE DIMENSIONS OF THE Y AXIS IN UNITS

*/

function Box() {

  this.c = document.createElement('canvas');
  this.ctx = this.c.getContext('2d');

  this.container = document.createElement('div');
  this.container.style.position = 'relative';
  this.container.appendChild(this.c); 
  
  this.data = {
    'dimension':{
      'w':100,
      'h':100
    },
    'zoom':{
      'x':0,
      'y':0
    },
    'translate':{
      'x':0,
      'y':0
    },
    'range':{
      'x':{
        'min':0,
        'max':0,
        'avg':0,
        'span':0
      },
      'y':{
        'min':0,
        'max':0,
        'avg':0,
        'span':0
      }
    }
  };

  this.current = {
    'click':{
      'value':null,
      'pixel':null
    },
    'mousemove':{
      'value':null,
      'pixel':null
    }
  }

  this.RANGE_X(0, 100);
  this.RANGE_Y(0, 100);
  this.CANVAS_SIZE(100, 100);

  this.ctx.radius = 3;
}


Box.prototype.ADD_CLICK = function() {
  this.c.addEventListener('click', function(e) {
    let pixel = {'x':e.offsetX,'y':e.offsetY};
    let value = this.PIXEL2VALUE(pixel);
    this.current.click.value = value;
    this.current.click.pixel = pixel;
  }.bind(this));
};


Box.prototype.ADD_MOUSEMOVE = function() {
  this.c.addEventListener('mousemove', function(e) {
    let pixel = {'x':e.offsetX,'y':e.offsetY};
    let value = this.PIXEL2VALUE(pixel);
    this.current.mousemove.value = value;
    this.current.mousemove.pixel = pixel;
  }.bind(this));
};


Box.prototype.SHOW_AXES = function() {
  
  this.CONNECT_VALUES([
    {'x':0,'y':this.data.range.y.min},
    {'x':0,'y':this.data.range.y.max}
  ]);
  
  this.CONNECT_VALUES([
    {'x':this.data.range.x.min,'y':0},
    {'x':this.data.range.x.max,'y':0}
  ]);
  
}


Box.prototype.showAxes = function(fontSize) {

 this.ctx.strokeStyle = '#333';
 
 this.ctx.beginPath();
 this.ctx.moveTo((0+this.data.translate.x)*this.data.zoom.x, 0);
 this.ctx.lineTo((0+this.data.translate.x)*this.data.zoom.x, this.data.dimension.h);
 this.ctx.stroke();
 
 // X AXIS LABEL
 this.ctx.fillStyle = '#333';
 this.ctx.font = (fontSize || this.data.dimension.w/100*3.5) + 'px Monospace';
 this.ctx.textAlign = "right";
 this.ctx.fillText(this.data.label.y, this.data.translate.x*this.data.zoom.x-this.data.dimension.w/100, this.data.translate.x*this.data.zoom.x);

 // X AXIS
 this.ctx.beginPath();
 this.ctx.moveTo(0, this.data.dimension.h-(0+this.data.translate.y)*this.data.zoom.y);
 this.ctx.lineTo(this.data.dimension.w, this.data.dimension.h-(0+this.data.translate.y)*this.data.zoom.y);
 this.ctx.stroke();
 
 // X AXIS LABEL
 this.ctx.fillStyle = '#333';
 this.ctx.font = (fontSize || this.data.dimension.w/100*3.5) + 'px Monospace';
 this.ctx.fillText(this.data.label.x, this.data.dimension.w-(0+this.data.translate.x)*this.data.zoom.x, this.data.dimension.h-(0+this.data.translate.y)*this.data.zoom.y + this.data.dimension.w/100*3.5);
 
 if (this.data.range.x.min > 0 || this.data.range.y.min > 0) {
    
   let s0 = 20;
   let s1 = 30;
   let c = {'x':s0, 'y':this.data.dimension.h - s0};

   let o = this.PIXEL2VALUE(c);
   console.log(o);
   console.log(this.data.range);
   
   let cx = {'x':s0+s1, 'y':this.data.dimension.h - s0};
   let ox = this.PIXEL2VALUE(cx);
   
   let cy = {'x':s0, 'y':this.data.dimension.h - (s0 + s1)};
   
    this.ctx.lineWidth = 1;
    this.ctx.strokeStyle = '#333';
    this.ctx.beginPath();
    this.ctx.moveTo(cy.x, cy.y);
    this.ctx.lineTo(c.x, c.y);
    this.ctx.lineTo(cx.x, cx.y);
    this.ctx.stroke();
    
    this.ctx.textAlign = 'start';
    this.ctx.textBaseline = 'top';
    this.ctx.fillText(this.data.label.x, c.x, c.y+2);
    
    
 }
 
}


Box.prototype.SHOW_FLOATING_X_AXIS = function(n, y_val) {

 //let n = 9;
 let sh;
 if (arguments[1] !== null) {
   let v3 = {'x':0,'y':y_val};
   //console.log(v3);
   let p3 = this.VALUE2PIXEL(v3);
   //console.log(p3);
   sh = p3.y;
 } else {
  sh = this.data.dimension.h - this.data.dimension.h/n;
 }
 let sw = this.data.dimension.w/n;
 
 let n1 = 1;
 let n2 = n-n1;
 
 let p0 = {'x':sw*n1,'y':sh};
 let p1 = {'x':sw*n2,'y':sh};

 let v0 = this.PIXEL2VALUE(p0);
 let v1 = this.PIXEL2VALUE(p1);
 
 this.CONNECTVALUES(v0, v1, '#333', 0.5);

 let dsh = 5;
 for (let i = n1; i <= n2; i++) {
  let p0 = {'x':sw*i,'y':sh+dsh};
  let p1 = {'x':sw*i,'y':sh-dsh};
  let v0 = this.PIXEL2VALUE(p0);
  let v1 = this.PIXEL2VALUE(p1);
  this.ctx.fillStyle = '#333';
  this.ctx.textAlign = 'center';
  this.ctx.textBaseline = 'top';
  this.ctx.fillText(v0.x.toFixed(0), p0.x, p0.y+1*dsh);
  this.ctx.stroke();
  this.CONNECTVALUES(v0, v1, '#333', 0.5); 
 }

 this.ctx.textAlign = 'right';
 this.ctx.textBaseline = 'middle';
 // this.ctx.fillText((this.data.label.x).toUpperCase(), sw*(n1-0.25), sh);

};

Box.prototype.SHOW_FLOATING_Y_AXIS = function(n) {

 let sh = this.data.dimension.h/n;
 let sw = this.data.dimension.w/n;
 
 let n1 = 2;
 let n2 = n-n1;
 
 let p0 = {'x':sw,'y':sh*n1};
 let p1 = {'x':sw,'y':sh*n2};

 let v0 = this.PIXEL2VALUE(p0);
 let v1 = this.PIXEL2VALUE(p1);
 
 this.CONNECTVALUES(v0, v1, '#333', 0.5);
 
 let dsw = 5;
 for (let i = n1; i <= n2; i++) {
  let p0 = {'x':sw-dsw,'y':sh*i};
  let p1 = {'x':sw+dsw,'y':sh*i};
  let v0 = this.PIXEL2VALUE(p0);
  let v1 = this.PIXEL2VALUE(p1);
  this.ctx.fillStyle = '#333';
  this.ctx.textAlign = 'left';
  this.ctx.textBaseline = 'middle';
  this.ctx.fillText((v0.y).toFixed(0), p0.x+2*dsw, p0.y);
  this.ctx.stroke();
  this.CONNECTVALUES(v0, v1, '#333', 0.5); 
 }
 
 this.ctx.textAlign = 'center';
 this.ctx.textBaseline = 'top';
 // this.ctx.fillText((this.data.label.y), sw, sh*(n2+0.25));
};
Box.prototype.SHOW_FLOATING_LOG_X_AXIS = function(obj) {

  
  let x_0 = this.data.dimension.w/5;
  let x_1 = this.data.dimension.w - x_0;
  let y = this.data.dimension.h*4.25/5;
  
  let val_0 = this.PIXEL2VALUE({'x':x_0,'y':y});
  let val_1 = this.PIXEL2VALUE({'x':x_1,'y':y});
  
  this.CONNECT_VALUES({
    'vals':[val_0, val_1]
  })



  
};



Box.prototype.SHOW_FLOATING_LOG_Y_AXIS = function(n) {

 let sh = this.data.dimension.h/n;
 let sw = this.data.dimension.w/n;
 
 let n1 = 2;
 let n2 = n-n1;
 
 let p0 = {'x':sw,'y':sh*n1};
 let p1 = {'x':sw,'y':sh*n2};

 let v0 = this.PIXEL2VALUE(p0);
 let v1 = this.PIXEL2VALUE(p1);
 
 this.CONNECTVALUES(v0, v1, '#333', 0.5);
 
 let dsw = 5;
 for (let i = n1; i <= n2; i++) {
  let p0 = {'x':sw-dsw,'y':sh*i};
  let p1 = {'x':sw+dsw,'y':sh*i};
  let v0 = this.PIXEL2VALUE(p0);
  let v1 = this.PIXEL2VALUE(p1);
  this.ctx.fillStyle = '#333';
  this.ctx.textAlign = 'left';
  this.ctx.textBaseline = 'middle';
  this.ctx.fillText((v0.y).toFixed(2), p0.x+2*dsw, p0.y);
  this.ctx.stroke();
  this.CONNECTVALUES(v0, v1, '#333', 0.5); 
 }
 
 this.ctx.textAlign = 'center';
 this.ctx.textBaseline = 'top';
 this.ctx.fillText((this.data.label.y), sw, sh*(n2+0.25));
};
function abc(x, arr) {

 if (arr[0] === 'get') {
   if (arr[1] === 'x') {
     return x;
   } else {
     return eval(arr[1]);        /* why do ppl hate eval so much? why should i not use it? */
   }
 }
 if (arr%arr===0) {
   return arr;
 }
 
 if (arr[0] === '**') {
   return abc(x, arr[1])**abc(x, arr[2]);
 }
 
 if (arr[0] === '/') {
   return abc(x, arr[1]) / abc(x, arr[2]);
 }
 if (arr[0] === '*') {
   return abc(x, arr[1]) * abc(x, arr[2]);
 }
 if (arr[0] === '-') {
   return abc(x, arr[1]) - abc(x, arr[2]);
 }
 
}

Box.prototype.CANVAS_SIZE = function(w, h) {
  this.data.dimension.w = w;
  this.data.dimension.h = h; 
  this.c.width = this.data.dimension.w;
  this.c.height = this.data.dimension.h;
 
  // RESET ZOOM AND XLATE BY REAPPLYING THE RANGES
  this.RANGE_X(this.data.range.x.min, this.data.range.x.max);
  this.RANGE_Y(this.data.range.y.min, this.data.range.y.max);
};

Box.prototype.CLEAR_CANVAS = function(color_string) {
  
  // maybe i need to delete everything from the canvas, then paint this. because if i want a background that is transparent, i cant paint transparent. the previous thing will show.
  
  this.ctx.fillStyle = (color_string || '#ffff');
  this.ctx.beginPath();
  this.ctx.rect(0, 0, this.data.dimension.w, this.data.dimension.h);
  this.ctx.fill();
}
Box.prototype.DRAW_HISTOGRAM = function(obj) {
  
  // obj.data is what i need
  let n_bins = obj.k;
  let bin_width = this.data.range.x.span / n_bins;
  console.log(obj);
  for (let i = 0; i < n_bins; i++) {
    //console.log('this');
    this.RECT_OUTLINE({'x':i*bin_width,'y':0}, bin_width, -obj.data[i].count, '#aaa', 1); 
  }
  
}
Box.prototype.RANGE_X = function(min, max) {
  this.data.range.x.min = min;
  this.data.range.x.max = max;
  this.data.range.x.avg = (max + min) / 2;
  this.data.range.x.span = max - min;
  this.data.zoom.x = this.data.dimension.w / this.data.range.x.span;
  this.data.translate.x = -this.data.range.x.min;
}

Box.prototype.RANGE_Y = function(min, max) {
  this.data.range.y.min = min;
  this.data.range.y.max = max;
  this.data.range.y.avg = (max + min) / 2;
  this.data.range.y.span = max - min;
  this.data.zoom.y = this.data.dimension.h / this.data.range.y.span;
  this.data.translate.y = -this.data.range.y.min;
}

/*
let obj = {
  'points':[
    {'x':0,'y':0},
    {'x':0,'y':0},
    {'x':0,'y':0}
  ]
}
*/
Box.prototype.RESCALE_BASED_ON_CENTROID = function(obj) {

  console.log(obj);
  let a = obj.points[0];
  let b = obj.points[1];
  let c = obj.points[2];

  let cx = (a.x + b.x + c.x)/3;
  let cy = (a.y + b.y + c.y)/3;
  
  let ra = ((a.x - cx)**2 + (a.y - cy)**2)**0.5;
  let rb = ((b.x - cx)**2 + (b.y - cy)**2)**0.5;
  let rc = ((c.x - cx)**2 + (c.y - cy)**2)**0.5;

  let r = 0;
  if (ra > rb) {
    r = ra;
  } else {
    r = rb;
  }
  if (rc > r) {
    r = rc;
  }
  
  if (a.x == b.x && b.x == c.x &&  a.y == b.y && b.y == c.y) {
    r = 0.1;
  }
  
  let z = r*3;
  if (z < 0.5) {
    z = 0.5;
  }

 // RESCALE
 this.rangex(cx-z, cx+z);
 this.rangey(cy-z, cy+z);
  
}

/*
let obj = {
  'points':[
    {'x':0,'y':0},
    {'x':0,'y':0},
    {'x':0,'y':0}
  ]
}
*/
Box.prototype.RESCALE_BASED_ON_CM = function(obj) {

  console.log(obj);

  let cx = 0;
  let cy = 0;
  
  let x_min = +(9**5);
  let x_max = -(9**5);
  let y_min = +(9**5);
  let y_max = -(9**5);

  for (let i = 0; i < obj.points.length; i++) {
    cx += obj.points[i].x;
    cy += obj.points[i].y; 
    
    if (obj.points[i].x > x_max) {
      x_max = obj.points[i].x;
    }
    if (obj.points[i].x < x_min) {
      x_min = obj.points[i].x;
    }
    if (obj.points[i].y > y_max) {
      y_max = obj.points[i].y;
    }
    if (obj.points[i].y < y_min) {
      y_min = obj.points[i].y;
    }

  }

  let dx = x_max - x_min;
  let dy = y_max - y_min;

  this.RANGE_X(0, x_max*5/4);
  this.RANGE_Y(0, y_max*5/4);

  return {
    'cx':cx,
    'cy':cy,
    'dx':dx,
    'dy':dy,
    'x_min':x_min,
    'x_max':x_max,
    'y_min':y_min,
    'y_max':y_max
  }

}
Box.prototype.RETURN_CANVAS = function() {
  return this.c;
}
Box.prototype.RETURN_CONTAINER = function() {
  return this.container;
};
Box.prototype.SHOW_GRID_X = function(dx_) {

  let dx = 1;
  if (arguments[0]) {
    dx = dx_;
  }

  let x_start = Math.floor(this.data.range.x.min/dx)*dx;
  
  let y0 = this.data.range.y.min;
  let y1 = this.data.range.y.max;

  for (let x = x_start; x <= this.data.range.x.max; x += dx) {

    let v0 = {'x':x,'y':y0};
    let v1 = {'x':x,'y':y1};

    let p0 = this.VALUE2PIXEL(v0);
    let p1 = this.VALUE2PIXEL(v1);
    
    this.ctx.beginPath();
    this.ctx.moveTo(p0.x, p0.y);
    this.ctx.lineTo(p1.x, p1.y);
    this.ctx.stroke();   
  }
};


Box.prototype.SHOW_GRID_Y = function(dy_) {

  let dy = 1;
  if (arguments[0]) {
    dy = dy_;
  }
  
  let y_start = Math.floor(this.data.range.y.min/dy)*dy;
  
  let x0 = this.data.range.x.min;
  let x1 = this.data.range.x.max;

  for (let y = y_start; y <= this.data.range.y.max; y += dy) {

    let v0 = {'x':x0,'y':y};
    let v1 = {'x':x1,'y':y};

    let p0 = this.VALUE2PIXEL(v0);
    let p1 = this.VALUE2PIXEL(v1);
    
    this.ctx.beginPath();
    this.ctx.moveTo(p0.x, p0.y);
    this.ctx.lineTo(p1.x, p1.y);
    this.ctx.stroke();   
  }
};
Box.prototype.STROKE_STYLE = function(x) {
  this.ctx.strokeStyle = x; 
}

Box.prototype.FILL_STYLE = function(x) {
  this.ctx.fillStyle = x; 
}

Box.prototype.LINE_WIDTH = function(x) {
  this.ctx.lineWidth = x; 
}
Box.prototype.RADIUS = function(rx) {
  this.ctx.radius = rx;
}
Box.prototype.TEXT = function(str, val, color_string, font_size, font_family) {
 let pixel = this.VALUE2PIXEL(val);
 //console.log(pixel);
 font_size = (font_size || 15);
 font_family = (font_family || 'Arial');
 this.ctx.font = font_size + 'px ' + font_family;
 this.ctx.strokeStyle = (color_string || '#fff');
 this.ctx.fillText(str, pixel.x, pixel.y);
}

Box.prototype.VALUE2PIXEL = function(val) {  // val : (0,0) is bottom-left (Cartesian)
 return {
  'x':(val.x+this.data.translate.x)*this.data.zoom.x,
  'y':this.data.dimension.h - (val.y+this.data.translate.y)*this.data.zoom.y
 }
}

Box.prototype.PIXEL2VALUE = function(pixel) { // pixel : (0,0) is top-left (standard computer/matrix grid)
 return {
  'x':(pixel.x/this.data.zoom.x)-this.data.translate.x,
  'y':(this.data.dimension.h-pixel.y)/this.data.zoom.y-this.data.translate.y
 }
}
/* val = {'x':x,'y':y} */
Box.prototype.VALUE_IN_RANGE = function(val) {

  let x = val.x;
  let y = val.y;
  let x_min = this.data.range.x.min;
  let x_max = this.data.range.x.max; 
  let y_min = this.data.range.y.min;
  let y_max = this.data.range.y.max;
  
  if (x >= x_min && x <= x_max && y >= y_min && y <= y_max) {
    return true;
  } else {
    return false;
  }

}

Box.prototype.CIRCLE = function(obj) {

 /*

 b.CIRCLE({
  'val':val
  'r':r,
  'line_width':null,
  'stroke_style':null,
  'fill_style':null
 });

 */

 let p = this.VALUE2PIXEL(obj.val);
 let r = this.VALUE2PIXEL({'x':obj.r + this.data.range.x.min,'y':0});

 this.ctx.lineWidth = (obj.line_width || 1);
 this.ctx.strokeStyle = (obj.stroke_style || '#3333');
 this.ctx.fillStyle = (obj.fill_style || '#fff0');

 this.ctx.beginPath();
 this.ctx.arc(p.x, p.y, r.x, 0, 2*Math.PI);
 this.ctx.fill();
 this.ctx.stroke();
 
}
/* let vals = [val, val,...] */
/* b.LINE_WIDTH(1); */
/* b.STROKE_STYLE('#ddd'); */

Box.prototype.CONNECT_VALUES = function(vals) {

  for (let i = 0; i < vals.length-1; i++) {

    let pixel_0 = this.VALUE2PIXEL(vals[i+0]);
    let pixel_1 = this.VALUE2PIXEL(vals[i+1]);

    this.ctx.beginPath();
    this.ctx.moveTo(pixel_0.x, pixel_0.y);
    this.ctx.lineTo(pixel_1.x, pixel_1.y);
    this.ctx.stroke();
  }
}
Box.prototype.CONNECT_POINTS = function(vals) {

  for (let i = 0; i < vals.length-1; i++) {

    let pixel_0 = this.VALUE2PIXEL(vals[i+0]);
    let pixel_1 = this.VALUE2PIXEL(vals[i+1]);

    this.ctx.beginPath();
    this.ctx.moveTo(pixel_0.x, pixel_0.y);
    this.ctx.lineTo(pixel_1.x, pixel_1.y);
    this.ctx.stroke();
  }
}

Box.prototype.CONNECTVALUES = function(val0, val1, color_string, line_width) {

 let pixel0 = this.VALUE2PIXEL(val0);
 let pixel1 = this.VALUE2PIXEL(val1);

 this.ctx.lineWidth = (line_width || 1);
 
 this.ctx.strokeStyle = color_string;
 this.ctx.fillStyle = color_string;
 this.ctx.beginPath();
 this.ctx.moveTo(pixel0.x, pixel0.y);
 this.ctx.lineTo(pixel1.x, pixel1.y);
 this.ctx.stroke();
}

/*

arr = [{},{}]

*/
Box.prototype.CONNECTVALUES2 = function(arr, color_string, line_width) {

  for (let i = 0; i < arr.length-1; i++) {

    let pixel0 = this.VALUE2PIXEL(arr[i+0]);
    let pixel1 = this.VALUE2PIXEL(arr[i+1]);

    this.ctx.lineWidth = (line_width || 1);
    this.ctx.strokeStyle = color_string;
    this.ctx.beginPath();
    this.ctx.moveTo(pixel0.x, pixel0.y);
    this.ctx.lineTo(pixel1.x, pixel1.y);
    this.ctx.stroke();

  }
}

Box.prototype.SHOW_VALUE = function(val) {

 /* val = {'x':x,'y':y} */
 /* this.RADIUS(rx) */
 
 let p = this.VALUE2PIXEL(val);
 let r = this.ctx.radius;

 this.ctx.beginPath();
 this.ctx.arc(p.x, p.y, r*2, 0, 2*Math.PI);
 this.ctx.fill();
}
Box.prototype.POINT = function(val) {

 /* val = {'x':x,'y':y} */
 /* this.RADIUS(rx) */

 let p = this.VALUE2PIXEL(val);
 let r = this.ctx.radius;

 this.ctx.beginPath();
 this.ctx.arc(p.x, p.y, r*2, 0, 2*Math.PI);
 this.ctx.fill();
}

Box.prototype.SHOWVALUE = function(val, colorstring, rx) {

 let pixel = this.VALUE2PIXEL(val);
 this.ctx.fillStyle = colorstring;
 this.ctx.beginPath();
 this.ctx.arc(pixel.x, pixel.y, rx, 0, 2*Math.PI);
 this.ctx.fill();

}

/*
  let obj = {
    'val':val,
    'color_string':'#999',
    'rx':3
  }
*/
Box.prototype.DRAW_POINT = function(obj) {

  let color_string = '#999';
  let rx = 3;
  if (obj.color_string) {color_string = obj.color_string}
  if (obj.rx) {rx = obj.rx}

  let pixel = this.VALUE2PIXEL(obj.val);
  this.ctx.fillStyle = color_string;
  this.ctx.beginPath();
  this.ctx.arc(pixel.x, pixel.y, rx, 0, 2*Math.PI);
  this.ctx.fill();
}

/*
  let obj = {
    'val':val,
    'color_string':'#000',
    'rx':1
  }
*/
Box.prototype.DRAW_VALUE = function(obj) {
 let pixel = this.VALUE2PIXEL(obj.val);
 this.ctx.fillStyle = obj.colorstring;
 this.ctx.beginPath();
 this.ctx.arc(pixel.x, pixel.y, obj.rx, 0, 2*Math.PI);
 this.ctx.fill();
}
/* let vals = [val, val,...] */
Box.prototype.RECT = function(vals) {

  let pixels = [];
  pixels[0] = this.VALUE2PIXEL(vals[0]);
  pixels[1] = this.VALUE2PIXEL(vals[1]);
  pixels[2] = this.VALUE2PIXEL(vals[2]);
  pixels[3] = this.VALUE2PIXEL(vals[3]);

  this.ctx.beginPath();
  this.ctx.moveTo(pixels[0].x, pixels[0].y);
  this.ctx.lineTo(pixels[1].x, pixels[1].y);
  this.ctx.lineTo(pixels[2].x, pixels[2].y);
  this.ctx.lineTo(pixels[3].x, pixels[3].y);
  this.ctx.lineTo(pixels[0].x, pixels[0].y);
  this.ctx.stroke();
  this.ctx.fill();
}
/* let vals = [val, val,...] */
Box.prototype.SHAPE = function(vals) {
  
  let p0 = this.VALUE2PIXEL(vals[0]);
  this.ctx.beginPath();
  this.ctx.moveTo(p0.x, p0.y);
    
  for (let i = 1; i < vals.length; i++) {
    let pixel = this.VALUE2PIXEL(vals[i]);
    this.ctx.lineTo(pixel.x, pixel.y);
  }
  this.ctx.lineTo(p0.x, p0.y);

  this.ctx.stroke();
  this.ctx.fill();
}


function Gear(obj) {

/* 
g = new Gear({
  'val':val,
  'n':n,
  'r_inner':r_inner,

  'r_outer':null,
  'theta':null,
  'd_theta':null,
  'omega':null,

  'line_width':null,
  'stroke_style':null,
  'fill_style':null
})

*/ 
 

  this.cx = obj.val.x;
  this.cy = obj.val.y;
  this.n = obj.n;                 // THE NUMBER OF TEETH
  this.r_inner = obj.r_inner;     // ROOT RADIUS
  
  
  // INNER RADIUS + DEPTH OF TEETH = OUTER RADIUS 
  this.r_outer = (obj.r_outer || obj.r_inner * 1.07);
  this.theta = (obj.theta || 0); // angular position
  this.d_theta = (obj.d_theta || 0);;   // initial shift in angular position
  
  // ANGULAR VELOCITY
  this.omega = (Math.random() > 0.5) ? (0.5) : (-0.5);
  if (obj.omega && obj.omega !== null) {
    this.omega = obj.omega;
  }
  
  this.frame_count = 0;
  
  this.line_width = (obj.line_width || 1);
  this.stroke_style = (obj.stroke_style || '#3339');
  this.fill_style = (obj.fill_style || '#fff0');
 

  // EVERYTHING IN RADIANS
  this.theta_tranche_rad = (360/this.n)*(Math.PI/180);  // THE ANGLE IN RADIANS OF EACH SLICE OR TRANCHE OF THE GEAR
  this.d_theta_rad =  this.d_theta*(Math.PI/180);      // THE SHIFT IN RADIANS AWAY FROM THE ORIGINAL THETA
  this.omega_rad = this.omega*(Math.PI/180);

  // this.cx_rel = this.cx / this.box.data.range.x.span;

};

Gear.prototype.update = function() {
  
  // TO PREVENT SLIPPING
  this.frame_count++;
  this.d_theta_rad = this.omega_rad * this.frame_count;
  
  // this.d_theta_rad += this.omega_rad;
}

Box.prototype.GEAR = function(Gear) {

  this.FILL_STYLE(Gear.stroke_style);
  this.RADIUS(1);
  this.POINT({'x':Gear.cx,'y':Gear.cy});

  this.LINE_WIDTH(Gear.line_width);
  this.STROKE_STYLE(Gear.stroke_style);
  
  for (let i = 0; i < Gear.n; i++) {
    
    let a0 = Gear.theta_tranche_rad*i + Gear.d_theta_rad;    // SET THE ANGLE OF THE MAIN TRANCHE
    let a1 = a0 + Gear.theta_tranche_rad*(1/2)*(1/3);
    let a2 = a0 + Gear.theta_tranche_rad*(1/2)*(2/3);
    let a3 = a0 + Gear.theta_tranche_rad*(1/2)*(3/3);
    let a4 = a0 + Gear.theta_tranche_rad;
    
    this.CONNECT_POINTS([
      {'x':Gear.cx + Math.cos(a0)*Gear.r_inner,'y':Gear.cy + Math.sin(a0)*Gear.r_inner},
      {'x':Gear.cx + Math.cos(a1)*Gear.r_outer,'y':Gear.cy + Math.sin(a1)*Gear.r_outer},
      {'x':Gear.cx + Math.cos(a2)*Gear.r_outer,'y':Gear.cy + Math.sin(a2)*Gear.r_outer},
      {'x':Gear.cx + Math.cos(a3)*Gear.r_inner,'y':Gear.cy + Math.sin(a3)*Gear.r_inner},
      {'x':Gear.cx + Math.cos(a4)*Gear.r_inner,'y':Gear.cy + Math.sin(a4)*Gear.r_inner},
    ]);

  }

};


/*
  let obj = {
    'arr':arr,  required
    'key':'x',
    'bins':8,
    'min':-3,
    'max':3
  }
*/


// 2022-04-07 : right now, only the minimal version works. the minimal version
// let hist_x = new Histogram({'arr':arr});
// container.appendChild(hist_x.RETURN_CANVAS());

function Histogram(obj) {
  
  this.arr;
  
  // IF THE INPUT DATA IS JUST A SIMPLE ARRAY
  if (!obj.hasOwnProperty('key')) {
    this.arr = obj.arr;
  }
  // console.log(this.arr);
 
  
  // GET THE UPPER AND LOWER BOUNDS OF THE DATA
  this.global_lower_bound = 999999;
  this.global_upper_bound = -999999;
  for (let i = 0; i < this.arr.length; i++) {
    if (this.arr[i] > this.global_upper_bound) {this.global_upper_bound = this.arr[i];}
    if (this.arr[i] < this.global_lower_bound) {this.global_lower_bound = this.arr[i];}
  }
  
  
  // DEFAULT : STURGES FORMULA k = CEIL(log_2(n)) + 1
  this.number_of_bins = Math.ceil(Math.log(this.arr.length) / Math.log(2)) + 1;
  
  // IF THE PROPERTY EXISTS, OVERWRITE THE DEFAULT
  if (obj.hasOwnProperty('number_of_bins')) {
    this.number_of_bins = obj.number_of_bins;
  }
  // console.log(this);
  
  

  this.global_range = (this.global_upper_bound - this.global_lower_bound);
  this.bin_width = this.global_range / this.number_of_bins;


  // DEFINE WHAT IS A BIN
  function Bin(bin_index, bin_lower_bound, bin_upper_bound) {
    this.bin_index = bin_index;
    this.bin_lower_bound = bin_lower_bound;
    this.bin_upper_bound = bin_upper_bound;
    this.bin_count = 0;
    this.bin_arr = [];
  }


  // MAKE THE BINS
  this.bins = [];
  for (let i = 0; i < this.number_of_bins; i++) {
    this.bins.push({
     'bin_index':i,
     'bin_lower_bound':this.global_lower_bound + i*this.bin_width,
     'bin_upper_bound':this.global_lower_bound + (i+1)*this.bin_width,
     'bin_count':0,
     'bin_arr':[]
    });
  }


  // SORT THE DATA INTO THE BINS
  for (let i = 0; i < this.arr.length; i++) {
    
    let val = this.arr[i];
    let index = 0;
    
    if (val === this.global_upper_bound) {
      index = this.number_of_bins - 1;
    }
    
    if (val !== this.global_upper_bound) {
      index = Math.floor((val - this.global_lower_bound) / this.bin_width);
    }

    let bin = this.bins[index];
    bin.bin_count++;
    bin.bin_arr.push(val);
    
  }
  // console.log(this);

};


Histogram.prototype.RETURN_CANVAS = function() {
  
 let b = new Box();


  b.CANVAS_SIZE(500, 400);
  b.RANGE_X(-this.bin_width + this.global_lower_bound, this.global_upper_bound + this.bin_width);          
  b.RANGE_Y(-5, 100 + 5);

  b.CLEAR_CANVAS();

  // GRIDLINES 
  b.LINE_WIDTH(1);
  b.STROKE_STYLE('#ddd');
  b.SHOW_GRID_X(this.bin_width);
  b.SHOW_GRID_Y(10);

  // AXES 
  b.LINE_WIDTH(2);
  b.STROKE_STYLE('#999');
  b.SHOW_AXES();
  

  this.max_bin_count = 0;
  
  for (let i = 0; i < this.bins.length; i++) {
    if (this.bins[i].bin_count > this.max_bin_count) {this.max_bin_count = this.bins[i].bin_count};
  }
  
  // DRAW A RECTANGLE
  b.LINE_WIDTH(2);
  b.STROKE_STYLE('#99B3E6');
  b.FILL_STYLE('#D6E0F5aa');
  
  for (let i = 0; i < this.bins.length; i++) {
  
    b.RECT([
      {'x':this.bins[i].bin_lower_bound,'y':0},
      {'x':this.bins[i].bin_lower_bound,'y': 100 * this.bins[i].bin_count / this.max_bin_count},
      {'x':this.bins[i].bin_upper_bound,'y': 100 * this.bins[i].bin_count /  this.max_bin_count},
      {'x':this.bins[i].bin_upper_bound,'y':0}
    ]);
    
  }

  return b.RETURN_CANVAS();
};




function GET_HISTOGRAM_FROM_ARR_OF_OBJS(obj) {
  
  let bins = {};
  
  let arr = obj.arr;
  let key = obj.key;
  let n = obj.arr.length;
  
  // DEFAULT VALUES FOR K, X_MIN, X_MAX, DX

  let k = Math.ceil(Math.log(n)/Math.log(2)) + 1;
  
  arr.sort(function(a,b) {
    return a[key] - b[key];
  });
  
  let x_min = parseFloat(arr[0][key]);
  let x_max = parseFloat(arr[n-1][key]);
  
  let dx = (x_max - x_min) / k;
  
  /*** ***/
  
  if (obj.x_min === 0) {
    x_min = parseFloat(obj.x_min);
  }
  if (obj.x_max && obj.x_max !== null) {
    x_max = parseFloat(obj.x_max);
  }
  if (parseFloat(obj.k) > 0) {
    k = parseFloat(obj.k);
    dx = (x_max - x_min) / k;
  }
  if (parseFloat(obj.dx) > 0) {
    dx = parseFloat(obj.dx);
    k = null;
  }

  

  // THIS WILL STORE THE VALUE OF THE BIN WITH THE HIGHEST FREQUENCY
  let f_max = 0;
  
  // STORE VALUES IN THE HISTOGRAM
  arr.forEach(function(row, i) {
    
    let x = parseFloat(row[key]);             // GET THE VALUE OF THE ROW
    let bin = Math.floor((x - x_min)/dx);     // WHAT BIN DOES IT GO INTO ?
    
    bins[bin] = (bins[bin] + 1 || 1);   // PUT IT IN THAT BIN BY INCREMENTING THE BIN
    
    if (bins[bin] > f_max) {
      f_max = bins[bin];
    }
  });
  
  // HISTOGRAM OBJECT
  return {
    'bins':bins,
    'x_min':x_min,
    'x_max':x_max,
    'k':k,
    'n':n,
    'f_max':f_max,
    'dx':dx,
    'n':arr.length
  };
  
}

/*
  let obj = {
    'budget':budget,
    'px':px,
    'py':py
  }
*/
Box.prototype.DRAW_BUDGET_LINE = function(obj) {

  let budget = obj.budget;
  let px = obj.px;
  let py = obj.py;

  let line_width = 2;
  let color_string = '#000';

  if (obj.color_string) {color_string = obj.color_string};
  if (obj.line_width) {line_width = obj.line_width};
  
  let x_int = {'x':budget/px,'y':0};
  let y_int = {'x':0,'y':budget/py};

  let pixel0 = this.VALUE2PIXEL(x_int);
  let pixel1 = this.VALUE2PIXEL(y_int);

  this.ctx.lineWidth = line_width;
 
  this.ctx.strokeStyle = color_string;
  this.ctx.fillStyle = color_string;
  this.ctx.beginPath();
  this.ctx.moveTo(pixel0.x, pixel0.y);
  this.ctx.lineTo(pixel1.x, pixel1.y);
  this.ctx.stroke();
};


/*
  obj = {
    'alpha':[alpha0, alpha1],
    'budget':[budget0, budget1],
    'px':[px0, px1],
    'py':[py0, py1],
    'marshallian':true,
    'hicksian':true,
    'log':false,
    'color_string':'#000',
    'line_width':2
    'rx':4
  }
*/

Box.prototype.DRAW_DEMAND_CURVE = function(obj) {

  let line_width = 2;
  let rx = 4;
  
  let line_color = {
    'marshallian':{
      'initial':{
        'x':'#ffe6b3', // CASE 0
        'y':'#ffe6b3'  // CASE 1
      },
      'final':{
        'x':'#d1e0e0',  // CASE 2
        'y':'#d1e0e0'   // CASE 3
      }
    },
    'hicksian':{
      'initial':{
        'x':'#f937',  // CASE 4 : INITIAL HICKSIAN X
        'y':'#ffc266'   // CASE 5 : INITIAL HICKSIAN Y
      },
      'final':{
        'x':'#c2d1f0',  // CASE 6 : FINAL HICKSIAN X
        'y':'#c2d1f0'   // CASE 7
      }
    }
  }


  // CORE PARAMETERS

  let alpha_0 = (obj.alpha) ? (obj.alpha[0]) : (null); // BE CAREFUL WITH NULL, NULL**NULL = 1
  let alpha_1 = (obj.alpha) ? (obj.alpha[1]) : (null);
  
  let beta_0 = (obj.beta) ? (obj.beta[0]) : (null);
  let beta_1 = (obj.beta) ? (obj.beta[1]) : (null);
  
  let budget_0 = (obj.budget) ? (obj.budget[0]) : (null);
  let budget_1 = (obj.budget) ? (obj.budget[1]) : (null);

  let px_0 = (obj.px) ? (obj.px[0]) : (null);
  let px_1 = (obj.px) ? (obj.px[1]) : (null);
  
  let py_0 = (obj.py) ? (obj.py[0]) : (null);
  let py_1 = (obj.py) ? (obj.py[1]) : (null);


  // THE RESULTING ALLOCATIONS

  // MARSHALLIAN
  let x_0 = ((alpha_0 * budget_0 / px_0) || null); // BE CAREFUL WITH NULL, NULL**NULL = 1
  let y_0 = ((beta_0 * budget_0 / py_0) || null);
  let u_0 = (x_0 === null || y_0 === null) ? (null) : (x_0**alpha_0*y_0**beta_0);

  let x_1 = ((alpha_1 * budget_1 / px_1) || null);
  let y_1 = ((beta_1 * budget_1 / py_1) || null);
  let u_1 = (x_1 === null || y_1 === null) ? (null) : (x_1**alpha_1*y_1**beta_1);
  
  // HICKSIAN; COMPENSATED
  let xc_0 = (u_0*(py_0/px_0*alpha_0/beta_0)**beta_0);
  let yc_0 = (u_0*(px_0/py_0*beta_0/alpha_0)**alpha_0);
  
  let xc_1 = (!(u_0*(py_1/px_1*alpha_1/beta_1)) || !beta_1) ? (null) : (u_0*(py_1/px_1*alpha_1/beta_1)**beta_1);
  let yc_1 = (!(u_0*(px_1/py_1*beta_1/alpha_1)) || !alpha_1) ? (null) : (u_0*(px_1/py_1*beta_1/alpha_1)**alpha_1);

  
  // PREP FOR LOOP

  let dx_pixel = 2; // if dx_pixel = 2, then we calculate x-y every 2nd pixel
  let dx = dx_pixel * (this.data.range.x.span / this.data.dimension.w );
  
  let temp = new Array(8);
  temp[0] = {'x':0,'y':alpha_0 * budget_0 / (dx/1000)};   // INITIAL MARSHALLIAN X
  temp[1] = {'x':0,'y':beta_0 * budget_0 / (dx/1000)};    // INITIAL MARSHALLIAN Y
  
  temp[2] = {'x':0,'y':alpha_1 * budget_1 / (dx/1000)};   // INITIAL HICKSIAN X
  temp[3] = {'x':0,'y':beta_1 * budget_1 / (dx/1000)};    // INITIAL HICKSIAN Y
 
  temp[4] = {'x':0,'y':u_0*(py_0/(dx/1000)*alpha_0/beta_0)**beta_0}; // MARSHALLIAN RESPONSE X
  temp[5] = {'x':0,'y':u_0*(px_0/(dx/1000)*beta_0/alpha_0)**alpha_0}; // MARSHALLIAN RESPONSE Y
  
  temp[6] = {'x':0,'y':u_0*(py_1/(dx/1000)*alpha_1/beta_1)**beta_1}; // HICKSIAN RESPONSE X
  temp[7] = {'x':0,'y':u_0*(px_1/(dx/1000)*beta_1/alpha_1)**alpha_1}; // HICKSIAN RESPONSE Y

  let initial_marshallian_x = (obj.x[0] && obj.marshallian);
  let initial_marshallian_y = (obj.y[0] && obj.marshallian);
  let final_marshallian_x = (obj.x[1] && obj.marshallian);
  let final_marshallian_y = (obj.y[1] && obj.marshallian);
  let initial_hicksian_x = (obj.x[0] && obj.hicksian);
  let initial_hicksian_y = (obj.y[0] && obj.hicksian);
  let final_hicksian_x = (obj.x[1] && obj.hicksian);
  let final_hicksian_y = (obj.y[1] && obj.hicksian);


  // DRAW IN LOOP
  for (let x = dx; x < this.data.range.x.max+dx; x += dx) {

    // CASE 6 : FINAL HICKSIAN X
    if (final_hicksian_x) {
      
      /*
      let price = x;
      let qty = u_0*(py_1/x*alpha_1/beta_1)**beta_1;
      
      if (obj.log) {
        let ln_price = Math.log(price);
        let ln_qty = Math.log(qty);
      }
      */
      
      if (obj.log) {
        
        let lnpx_1 = Math.log(px_1);
        let lnxc_1 = Math.log(u_0) + beta_1 * Math.log(py_1*alpha_1/beta_1) - beta_1 * lnpx_1;
        
        this.DRAW_LINE({
          'val':{'x':lnpx_1,'y':lnxc_1},
          'slope':-beta_1,
          'color_string':line_color.hicksian.final.x,
          'line_width':line_width
        });
        
        this.DRAW_POINT({
          'val':{'x':lnpx_1,'y':lnxc_1},
          'color_string':line_color.hicksian.final.x,
          'rx':rx
        });
      
      } else {
        
        let price = x;
        let qty = u_0*(py_1/x*alpha_1/beta_1)**beta_1;
        let val = {'x':price,'y':qty};
        
        this.CONNECT_VALUES({
          'vals':[temp[6], val],
          'color_string':line_color.hicksian.final.x,
          'line_width':line_color
        });
        
        this.DRAW_POINT({
          'val':{'x':px_1,'y':xc_1},
          'color_string':line_color.hicksian.final.x,
          'rx':rx
        });
        
        temp[6] = val;
        
      }
    }
    
    // CASE 7 : FINAL HICKSIAN Y
    if (final_hicksian_y) {
      
      if (obj.log) {
        
        let lnpy_1 = Math.log(py_1);
        let lnyc_1 = Math.log(u_0) + alpha_1 * Math.log(px_1*beta_1/alpha_1) - alpha_1 * lnpy_1;
        
        this.DRAW_LINE({
          'val':{'x':lnpy_1,'y':lnyc_1},
          'slope':-alpha_1,
          'color_string':line_color.hicksian.final.y,
          'line_width':line_width
        });
        
        this.DRAW_POINT({
          'val':{'x':lnpy_1,'y':lnyc_1},
          'color_string':line_color.hicksian.final.y,
          'rx':rx
        });
      
      } else {
      
        let y = u_0*(px_1/x*beta_1/alpha_1)**alpha_1;
        let val = {'x':x,'y':y};
        this.CONNECTVALUES(temp[7], val, line_color.hicksian.final.y, line_width);
        temp[7] = val;
        
        let pixel = this.VALUE2PIXEL({'x':py_1,'y':yc_1});
        this.ctx.fillStyle = line_color.hicksian.final.y;
        this.ctx.beginPath();
        this.ctx.arc(pixel.x, pixel.y, rx, 0, 2*Math.PI);
        this.ctx.fill();
      
      }
    }


    // CASE 4
    if (initial_hicksian_x) {
      
      if (obj.log) {
        
        let lnpx_0 = Math.log(px_0);
        let lnxc_0 = Math.log(u_0) + beta_0 * Math.log(py_0*alpha_0/beta_0) - beta_0 * lnpx_0;
        
        let pixel = this.VALUE2PIXEL({'x':lnpx_0,'y':lnxc_0});
        this.ctx.fillStyle = line_color.hicksian.initial.x;
        this.ctx.beginPath();
        this.ctx.arc(pixel.x, pixel.y, rx, 0, 2*Math.PI);
        this.ctx.fill();
        
        this.DRAW_LINE({
          'val':{'x':lnpx_0,'y':lnxc_0},
          'slope':-beta_0,
          'color_string':line_color.hicksian.initial.x,
          'line_width':line_width
        });
        
      } else {
      
        let y = u_0*(py_0/x*alpha_0/beta_0)**beta_0;
        let val = {'x':x,'y':y};
        this.CONNECTVALUES(temp[4], val, line_color.hicksian.initial.x, line_width);
        temp[4] = val;
        
        let pixel = this.VALUE2PIXEL({'x':px_0,'y':u_0*(py_0/px_0*alpha_0/beta_0)**beta_0});
        this.ctx.fillStyle = line_color.hicksian.initial.x;
        this.ctx.beginPath();
        this.ctx.arc(pixel.x, pixel.y, rx, 0, 2*Math.PI); // THIS POINT WILL ACTUALLY NOT BE SEEN
        this.ctx.fill();
        
      }
    }

    // CASE 5
    if (initial_hicksian_y) {
      
      if (obj.log) {
        
        let lnpy_0 = Math.log(py_0);
        let lnyc_0 = Math.log(u_0) + alpha_0 * Math.log(px_0*beta_0/alpha_0) - alpha_0 * lnpy_0;
        
        this.DRAW_LINE({
          'val':{'x':lnpy_0,'y':lnyc_0},
          'slope':-alpha_0,
          'color_string':line_color.hicksian.initial.y,
          'line_width':line_width
        });
        
        this.DRAW_POINT({
          'val':{'x':lnpy_0,'y':lnyc_0},
          'color_string':line_color.hicksian.initial.y,
          'rx':rx
        });
      
      } else {
      
        let y = u_0*(px_0/x*beta_0/alpha_0)**alpha_0;
        let val = {'x':x,'y':y};
        this.CONNECTVALUES(temp[5], val, line_color.hicksian.initial.y, line_width);
        temp[5] = val;
        
        let pixel = this.VALUE2PIXEL({'x':py_0,'y':u_0*(px_0/py_0*beta_0/alpha_0)**alpha_0});
        this.ctx.fillStyle = line_color.hicksian.initial.y;
        this.ctx.beginPath();
        this.ctx.arc(pixel.x, pixel.y, rx, 0, 2*Math.PI); // THIS POINT WILL ACTUALLY NOT BE SEEN
        this.ctx.fill();
      
      }
    }

    // CASE 3 : FINAL MARSHALLIAN Y
    if (final_marshallian_y) {
      
      if (obj.log) {
        
        let lnpy_1 = Math.log(py_1);
        let lny_1 = Math.log(beta_1*budget_1) - lnpy_1;
        
        this.DRAW_LINE({
          'val':{'x':lnpy_1,'y':lny_1},
          'slope':-1,
          'color_string':line_color.marshallian.final.y,
          'line_width':line_width
        });
        
        this.DRAW_POINT({
          'val':{'x':lnpy_1,'y':lny_1},
          'color_string':line_color.marshallian.final.y,
          'rx':rx
        });
      
      } else {
      
        let y = beta_1 * budget_1 / x;
        let val = {'x':x,'y':y};
        this.CONNECTVALUES(temp[3], val, line_color.marshallian.final.y, line_width);
        temp[3] = val;
        
        let pixel = this.VALUE2PIXEL({'x':py_1,'y':(beta_1 * budget_1 / py_1)});
        this.ctx.fillStyle = line_color.marshallian.final.y;
        this.ctx.beginPath();
        this.ctx.arc(pixel.x, pixel.y, rx, 0, 2*Math.PI);
        this.ctx.fill();
      
      }
    }

    // CASE 2 : FINAL MARSHALLIAN X
    if (final_marshallian_x) {
      
      if (obj.log) {
        
        // need x, but we have px, alpha, M
        
        let lnpx_1 = Math.log(px_1);
        let lnx_1 = Math.log(alpha_1*budget_1) - lnpx_1;
        
        let pixel = this.VALUE2PIXEL({'x':lnpx_1,'y':lnx_1});
        this.ctx.fillStyle = line_color.marshallian.final.x;
        this.ctx.beginPath();
        this.ctx.arc(pixel.x, pixel.y, rx, 0, 2*Math.PI);
        this.ctx.fill();
        
        this.DRAW_LINE({
          'val':{'x':lnpx_1,'y':lnx_1},
          'slope':-1,
          'color_string':line_color.marshallian.final.x,
          'line_width':line_width
        });
        
      } else {
      
        let y = alpha_1 * budget_1 / x;
        let val = {'x':x,'y':y};
        this.CONNECTVALUES(temp[2], val, line_color.marshallian.final.x, line_width);
        temp[2] = val;
        
        let pixel = this.VALUE2PIXEL({'x':px_1,'y':(alpha_1 * budget_1 / px_1)});
        this.ctx.fillStyle = line_color.marshallian.final.x;
        this.ctx.beginPath();
        this.ctx.arc(pixel.x, pixel.y, rx, 0, 2*Math.PI);
        this.ctx.fill();
      
      }
    }
    
    // CASE 1 : INITIAL MARSHALLIAN Y
    if (initial_marshallian_y) {
      
      if (obj.log) {
        
        let lnpy_0 = Math.log(py_0);
        let lny_0 = Math.log(beta_0*budget_0) - lnpy_0;
        
        this.DRAW_LINE({
          'val':{'x':lnpy_0,'y':lny_0},
          'slope':-1,
          'color_string':line_color.marshallian.initial.y,
          'line_width':line_width
        });
        
        this.DRAW_POINT({
          'val':{'x':lnpy_0,'y':lny_0},
          'color_string':line_color.marshallian.initial.y,
          'rx':rx
        });
      
      } else {
      
        let y = beta_0 * budget_0 / x;
        let val = {'x':x,'y':y};
        this.CONNECTVALUES(temp[1], val, line_color.marshallian.initial.y, line_width);
        temp[1] = val;
        
        let pixel = this.VALUE2PIXEL({'x':py_0,'y':(beta_0 * budget_0 / py_0)});
        this.ctx.fillStyle = line_color.marshallian.initial.y;
        this.ctx.beginPath();
        this.ctx.arc(pixel.x, pixel.y, rx, 0, 2*Math.PI);
        this.ctx.fill();
      
      }
    }
    
    // CASE 0 : INITIAL MARSHALLIAN X
    if (initial_marshallian_x) {
      
      if (obj.log) {
        
        // need x, but we have px, alpha, M
        
        let lnpx_0 = Math.log(px_0);
        let lnx_0 = Math.log(alpha_0*budget_0) - lnpx_0;
        
        let pixel = this.VALUE2PIXEL({'x':lnpx_0,'y':lnx_0});
        this.ctx.fillStyle = line_color.marshallian.initial.x;
        this.ctx.beginPath();
        this.ctx.arc(pixel.x, pixel.y, rx, 0, 2*Math.PI);
        this.ctx.fill();

        this.DRAW_LINE({
          'val':{'x':lnpx_0,'y':lnx_0},
          'slope':-1,
          'color_string':line_color.marshallian.initial.x,
          'line_width':line_width
        });

      } else {
      
        let y = alpha_0 * budget_0 / x;
        let val = {'x':x,'y':y};
        this.CONNECTVALUES(temp[0], val, line_color.marshallian.initial.x, line_width);
        temp[0] = val;
        
        let pixel = this.VALUE2PIXEL({'x':px_0,'y':(alpha_0 * budget_0 / px_0)});
        this.ctx.fillStyle = line_color.marshallian.initial.x;
        this.ctx.beginPath();
        this.ctx.arc(pixel.x, pixel.y, rx, 0, 2*Math.PI);
        this.ctx.fill();
      
      }
    }

  } // closing the loop

  return {
    'initial':{
      'marshallian':{'x':x_0,'y':y_0,'u':u_0},
      'hicksian':{'x':xc_0,'y':yc_0,'u':u_0}
    },
    'final':{
      'marshallian':{'x':x_1,'y':y_1,'u':u_1},
      'hicksian':{'x':xc_1,'y':yc_1,'u':u_0}
    }
  };
  
}

/*
let obj = {
  'val':val,
  'slope':slope,
  'color_string':'#999',
  'line_width':2
}
*/
Box.prototype.DRAW_LINE = function(obj) {


  let line_width = obj.line_width;
  let color_string = obj.color_string;

  // console.log(val);
  let val0 = {
    'x':this.data.range.x.min,
    'y':obj.val.y - (obj.val.x - this.data.range.x.min)*obj.slope
  };
  // console.log(val0);
  let val1 = {
    'x':this.data.range.x.max,
    'y':val0.y + this.data.range.x.span*obj.slope
  };
  
 let pixel0 = this.VALUE2PIXEL(val0);
 let pixel1 = this.VALUE2PIXEL(val1);

 this.ctx.lineWidth = line_width;
 
 this.ctx.strokeStyle = color_string;
 this.ctx.fillStyle = color_string;
 this.ctx.beginPath();
 this.ctx.moveTo(pixel0.x, pixel0.y);
 this.ctx.lineTo(pixel1.x, pixel1.y);
 this.ctx.stroke();

}

/*

  obj = {
    'delta':delta,
    'alpha':alpha,
    'beta':beta,
    'px':px,
    'py':py,
    'budget':budget
  }
  
*/

Box.prototype.GET_CES_MARSHALLIAN_ALLOCATION = function(obj) {

  let delta = obj.delta;
  let delta_inv = 1/delta;
  let alpha = obj.alpha;
  let beta = obj.beta;
  let px = obj.px;
  let py = obj.py;
  let budget = obj.budget;
  
  let A = (alpha * py) / (beta * px);
  let B = (1 / (delta - 1));
  let C = A**B;
  let C_INV = 1/ C;
  
  let x = null;
  let y = null;
  let u = null;

  let output = {
    'delta':delta,
    'alpha':alpha,
    'beta':beta,
    'px':px,
    'py':py,
    'budget':budget,
    'A':A,
    'B':B,
    'C':C
  }
  
  // SET THE TYPE
  output.type = "ELSE";
  output.delta = delta;
  if (delta === 1) {output.type = "LINEAR"}
  if (delta === 0) {output.type = "LOG"}
  if (delta < -100) {output.type = "LEONTIEFF"}

  if (output.type === "LINEAR") {
    
    if (alpha/px > beta/py) {
     x = budget / px;
     y = 0;
    }
    if (alpha/px < beta/py) {
     x = 0;
     y = budget / py;
    }
    if (alpha/px === beta/py) {
     x = 0.5 * budget / px;
     y = 0.5 * budget / py;
    }
    u = alpha*x + beta*y;

    output.expenditure = px*x + py*y; 
    output.u = u;
    output.x = x;
    output.y = y;
    return output;
  }
 
  if (output.type === "LOG") {
    
    x = alpha/(alpha + beta) * budget / px;
    y = beta/(alpha + beta) * budget / py;
    u = x**alpha*y**beta;
    
    // i should find a way to add both log utilities, because sometimes we use cobb douglas, other times the log version
    
    output.expenditure = px*x + py*y; 
    output.u = u;
    output.x = x;
    output.y = y;
    return output;
  } 
  
  if (output.type === "LEONTIEFF") {
    
    x = budget / (px + py);
    y = budget / (px + py);
    u = x;
    
    output.expenditure = px*x + py*y; 
    output.u = u;
    output.x = x;
    output.y = y;
    return output;
  } 
  

  // GENERAL CES : THE ELSE CASE
  x = budget / (px + py * C);
  y = budget / (px * C_INV + py);
  u = (alpha * x ** delta + beta * y ** delta)**delta_inv;

  output.expenditure = px*x + py*y; 
  output.u = u;
  output.x = x;
  output.y = y;
  return output;

}
/*

 u = (alpha/delta)*x**delta + (beta/delta)*y**delta

 b.LINE_WIDTH(2);
 b.STROKE_STYLE('#fc0a');
 b.SHOW_INDIFFERENCE_CURVE({
  'delta':delta,    // must
  'alpha':alpha,    // must
  'beta':beta,      // must
  'u':u,            // SUFFICIENT, BUT NOT A GOOD CHOICE
  'x':x,            // PREFERABLE
  'y':y,            // PREFERABLE
  'budget':budget,
  'px':px,
  'py':py
 }

  FUNCTIONAL DEPENDENCIES
  1. this.CONNECT_VALUES(arr)
  
  ** verifiy when delta = -145
  ** verify when delta = 0.90 to 1.00
  ** when does it hit 0 ?
  ** how arr is sorted

*/


// CES UTILITY
Box.prototype.SHOW_CES_INDIFFERENCE_CURVE = function(obj) {
  
  // must have delta, alpha and beta
  // and we must either have utility, or have what we need to make utility
 
  // case 1 : u
  // case 2 : u=f(x,y)
  // case 3 : x=f(M,px) : y=f(M,py) : u=f(x,y)
  
  
  // I CAN ACTUALLY SET DELTA = -INFINITY HERE, SO I SHOULD DO THAT, IF DELTA IS BIG ENOUGH
  
  
  let output = {
    'delta':null,
    'alpha':null,
    'beta':null,
    'u':null,
    'x':null,            
    'y':null,
    'type':null,
    'procedure':null,
    'x_c':null,
    'y_c':null
  }

  let alpha, alpha_inv, beta, beta_inv, delta, delta_inv;
  let u;
  let x, y;

  alpha = obj.alpha;
  alpha_inv = 1/alpha;
  beta = obj.beta;
  beta_inv = 1/beta;
  
  delta = obj.delta;
  delta_inv = (1/delta || null);
  
  // SET THE TYPE
  output.type = "ELSE";
  output.delta = delta;
  if (delta === 1) {output.type = "LINEAR"}
  if (delta === 0) {output.type = "LOG"}
  if (delta < -100) {output.type = "LEONTIEFF"}

  output.alpha = alpha;
  output.beta = beta;



  // FIRST CASE :
  if (obj.u) {
    output.procedure = 'FIRST : UTILITY SUPPLIED';
    u = obj.u;
    output.u = u;
  }

  // SECOND CASE : u = u(x, y)
  if (!obj.u && (obj.x && obj.y)) {
    output.procedure = 'SECOND : UTILITY CALCULATED';

    x = obj.x;
    y = obj.y;
    
    output.x = x;
    output.y = y;
    
    if (output.type === "LINEAR") {u = alpha*x + beta*y};
    if (output.type === "LOG") {u = x**alpha*y**beta};
    if (output.type === "LEONTIEFF") {u = 1};
    if (output.type === "ELSE") {u = (alpha*x**delta + beta*y**delta)**delta_inv};
    
    output.u = u;
  }

  // THE DOMAIN AND RANGE
  output.x_c = null;
  output.y_c = null;
  if (delta !== 0) {
    output.x_c = (u**delta / alpha)**(1/delta);
    output.y_c = (u**delta / beta)**(1/delta);
  }
  

  // LINEAR
  if (output.type === "LINEAR") {
    this.CONNECT_VALUES([{'x':0,'y':u/beta},{'x':u/alpha,'y':0}]);
    return output;
  }
  
  // LEONTIEFF
  if (output.type === "LEONTIEFF") {

    return output;
  }
  
  // FOR LOG AND ELSE, WE LOOP
  
  // LOG
  if (output.type === "LOG") {
    
    let dx = this.data.range.x.max / 50;
    let dy = this.data.range.y.max / 50;
    let x_index = 0, y_index = 0;
    let arr = [];

    for (let i = 0; i <= 50; i++) {

      arr[2*i+0] = {'x':x_index,'y':(u/x_index**alpha)**beta_inv};
      arr[2*i+1] = {'x':(u/x_index**beta)**alpha_inv,'y':y_index};
      x_index += dx;
      y_index += dy;
    }
    
    arr.sort(function(a,b) {
      return a.x - b.x;
    }); 

    
    this.CONNECT_VALUES(arr);
    return output;
  }

  



  // THIS IS THE ELSE CASE

  let dx = this.data.range.x.max / 50;
  let dy = this.data.range.y.max / 50;
  
  let x_index = 0, y_index = 0;
  let arr = [];

  for (let i = 0; i <= 50; i++) {
  
    // THE ELSE CASES **
    if (u**delta >= alpha*x_index**delta) {
      arr.push({
        'x':x_index,
        'y':((u**delta - alpha*x_index**delta)/beta)**delta_inv
      });
    }
    if (u**delta >= beta*y_index**delta) {
      arr.push({
        'x':((u**delta - beta*y_index**delta)/alpha)**delta_inv,
        'y':y_index
      });
    }

    x_index += dx;
    y_index += dy;
    
  } // closing for loop

  // ** WE USE X AND Y TO GET U
  // WHEN WE LOOP OVER X, WE TRY TO FIND THE Y THAT MAKES THAT U POSSIBLE
  // BUT WHEN DELTA < 0, THERE MAY NOT EXIST SUCH A Y
  // AND IF WE DONT ACCOUNT FOR THAT, WELL GET WACKY VALUES PLOTTED ON THE GRAPH
  
  // WHEN 0 < DELTA < 1, WE CAN FIND AN X OR Y TO MEET U GIVEN AND OTHER Y OR X, RESPECTIVELY 

  // SORT ARR : IF it's almost leontieff, ie. delta = -140, then i need to sort by x, from lowest to smallest
  // then if 2 points have the same x, from largest to smallest
  arr.sort(function(a,b) {
    return a.x - b.x;
  });
  // console.log(arr);
  // once its sorted, it might make sense to do a while loop to remove the points at the beginning and end that are not on the grid
  
  this.CONNECT_VALUES(arr);
  
  return output;
}





Box.prototype.rnorm = function() {
  let u = 0, v = 0;
  while(u === 0) u = Math.random(); //Converting [0,1) to (0,1)
  while(v === 0) v = Math.random();
  return Math.sqrt( -2.0 * Math.log( u ) ) * Math.cos( 2.0 * Math.PI * v );
};

// takes one argument: df[required]
Box.prototype.chisq = function(df) {
  let w = 0;
  for (let i = 0; i < df; i++) {
    w += Math.pow(this.rnorm(), 2);
  }
  return w;
};



  let raf = (function() {
  
    // a local variable
    let s = 10;
  
    // object stored in r
    return {
      sum: function(arr) {
        let a = 0;
        for (let i = 0; i < arr.length; i++) {
          a += arr[i];
        }
        return a;
      },
      count: function(arr) {
        return arr.length;
      },
      mean: function(arr) {
        return this.sum(arr) / this.count(arr);
      },
      rnorm: function() {
        let u = 0, v = 0;
        while(u === 0) u = Math.random(); //Converting [0,1) to (0,1)
        while(v === 0) v = Math.random();
        return Math.sqrt( -2.0 * Math.log( u ) ) * Math.cos( 2.0 * Math.PI * v );
      },
      rchisq: function(df) {
        let w = 0;
        for (let i = 0; i < df; i++) {
          w += Math.pow(rnorm(), 2);
        }
        return w;
      },
      gen: function(n) {
        let arr = [];
        for (let i = 0; i < n; i++) {
          arr.push(this.rnorm());
        }
        return arr;
      },
      variance: function(arr) {
        
        let mean = this.mean(arr);
        let a = 0;
        for (let i = 0; i < arr.length; i++) {
          a += Math.pow((arr[i] - mean), 2);
        }
        return a / arr.length;
        
      },
      covariance: function(arr1, arr2) {
        
        let mean1 = this.mean(arr1);
        let mean2 = this.mean(arr2);
        
        let a = 0;
        for (let i = 0; i < arr1.length; i++) {
          a += (arr1[i] - mean1) * (arr2[i] - mean2);
        }
        return a / arr1.length;
        
      },
      add: function(x) {
        return s += x;
      }
    }
  })();
  
  




  function TextBox(obj) {
  
    /*
    obj = {
      'str':str,
      'x':x,
      'y':y,
      'alignment':'alignment'
    };
    */
  
    // BASIC VARIABLES
    this.str = obj.str;
    this.x = obj.x;
    this.y = obj.y;
    this.alignment = obj.alignment;

    // CREATE THE ELEMENT
    this.el = document.createElement('div');
    this.el.style.position = 'absolute';
    this.el.style.zIndex = '99';
    this.el.style.border = '1px solid black';
  
    // THE TEXT IT CONTAINS
    this.el.innerHTML = '<div style="margin: 5px;">' + this.str + '</div>';

  };

  Box.prototype.ADD_TEXT = function(TextBox) {

    // APPEND TO CONTAINER
    this.container.appendChild(TextBox.el);
  
    // ITS LOCATION : top-left is the default
    let pixel = this.VALUE2PIXEL({'x':TextBox.x,'y':TextBox.y});
  
    // default
    if (TextBox.alignment === 'top-left') {
      TextBox.el.style.top = pixel.y + 'px';
      TextBox.el.style.left = pixel.x + 'px';
    }
  
    if (TextBox.alignment === 'center-right') {
      let h = TextBox.el.getBoundingClientRect().height;
      let w = TextBox.el.getBoundingClientRect().width;
      TextBox.el.style.top = (pixel.y - 0.5*h) + 'px';
      TextBox.el.style.left = (pixel.x - w) + 'px';
    }

    if (TextBox.alignment === 'top-center') {
      let h = TextBox.el.getBoundingClientRect().height;
      let w = TextBox.el.getBoundingClientRect().width;
      TextBox.el.style.top = pixel.y + 'px';
      TextBox.el.style.left = (pixel.x - 0.5*w) + 'px';
    }
    
    if (TextBox.alignment === 'top-right') {
      let h = TextBox.el.getBoundingClientRect().height;
      let w = TextBox.el.getBoundingClientRect().width;
      TextBox.el.style.top = pixel.y + 'px';
      TextBox.el.style.left = (pixel.x - w) + 'px';
    }
  
  };
