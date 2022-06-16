
// DECLARE

let my_canvas, myCanvas, c;
let my_ctx, ctx;

let mySideBar;
let myDropZone, myThumbnailImage, myDropZoneText;

let originalImageData, workingImageData;
let myInputArray;
let draw;

let currentColorObj = {};
let selectedColorObj = {};

let selectedColorBox;
let selectedColorBoxInfo;
let currentColorBox;
let currentColorBoxInfo;

let selectMode = false;
let selection = {
  'x0':null,
  'y0':null,
  'x1':null,
  'y1':null
}

let mouseIsPressed = false;
  
// INITIALIZE

(function(){

  window.addEventListener('load', function() {
    
    my_canvas = document.getElementById('myCanvas');
    myCanvas = document.getElementById('myCanvas');
    c = document.getElementById('myCanvas');

    my_ctx = my_canvas.getContext('2d');
    ctx = c.getContext('2d');
    
    mySideBar = document.getElementById('mySideBar');

    selectedColorBox = document.getElementById('selectedColorBox');
    selectedColorBoxInfo = document.getElementById('selectedColorBoxInfo');
    currentColorBox = document.getElementById('currentColorBox');
    currentColorBoxInfo = document.getElementById('currentColorBoxInfo');
    
    // initializing	
    myInputArray = [50, 50, 50, 0, 0, 50, 0, 0, 255, 0, 1, 1, 0];
    myDropZone = document.getElementById('myDropZone');
    myThumbnailImage = document.getElementById('myThumbnailImage');
    myDropZoneText = document.getElementById('myDropZoneText');


  
  }); // closing window.onload
  
})();  // closing anon