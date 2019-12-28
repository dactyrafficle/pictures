
// the hardest part is the js modulus operator; always remember that you should know how it behaves for negative numbers before you use it
// https://stackoverflow.com/questions/4467539/javascript-modulo-gives-a-negative-result-for-negative-numbers

let img;
let squares = [];
let S = 2*160;	// size of the canvas and image
let n = 8;		// number of squares per row/column -> so there will be nxn squares
let leaps = 3; // size of leaps
let s = S/n;	// size of each square
let shiftArr = [];
let shiftFwd = 1;
let steps = 10;

let ordered = {
	'state': true,
	'index': Math.floor(Math.random()*n*n),
	'count': 0
};

function preload() {
  // this is from the vm website
  img = loadImage('https://jd48p16uwhl2mry6ox17qsj-wpengine.netdna-ssl.com/wp-content/uploads/2017/04/voortman-logo-en.png')         
}

// better to give each image a number, and have ething calc from there 

function setup() {

  let c = createCanvas(S, S);
  img.resize(S, S);
  c.parent('logo');
	
	for (let i = 0; i < n*n; i++) {
		let x = (i*s)%S;
		let y = Math.floor(i/n)*s;
		let img_ = new Square(img.get(x,y,s,s), i);
		squares.push(img_);		
	}

  //console.log(squares);
  frameRate(3);
	background(51, 51, 51);
	for (let i = 0; i < squares.length; i++) {
		squares[i].update();
		squares[i].display();
	}

}

var count = 0;

function draw() {
	
	
	
	// if ordered, scatter
	if (ordered.state && (frameCount-ordered.count) > 5) {
		
		
		ordered.state = false;
		console.log(ordered);
		for (let i = 0; i < squares.length; i++) {
			squares[i].scatter();
		};
		squares.sort(function(a,b) {
			return a.index - b.index;
		});
		for (let i = 0; i < squares.length; i++) {
			squares[i].index = i;
		};
		for (let i = 0; i < squares.length; i++) {
			squares[i].recalcRowCol();
		};		
	}
	
	if (!ordered.state) {
		
		background(51, 51, 51);
		
		// lets make a new array of all the cells that are wrong
		let arr = [];
		for (var i = 0; i < squares.length; i++) {
			if (squares[i].index !== squares[i].index_0) {
				arr.push(squares[i]);
			}
		}
		//console.log(arr);
		
		// now let us pick a square at random
		// this is one we're going to correct
		ordered.index = arr[Math.floor(Math.random()*arr.length)].index;
		//console.log(arr[Math.floor(Math.random()*arr.length)].index);
		
		let rightImage;
		let wrongImage = squares[ordered.index].img;
		let rightIndex;
		let wrongIndex = ordered.index;
		// swap images and indexes
		
		// you have to set their index and index_0 !!!!!!!!!!!!!
		
		
		for (var i = 0; i < squares.length; i++) {
			if (squares[i].index_0 === ordered.index) {
				rightImage = squares[i].img;
				rightIndex = squares[i].index_0;
				squares[i].img = wrongImage;
				squares[i].index = wrongIndex;
				squares[i].index_0 = squares[ordered.index].index_0; // this line; the absence of it, caused me a lot of pain
				break;
			}
		}
		
		squares[ordered.index].img = rightImage;
		squares[ordered.index].index = rightIndex;
		squares[ordered.index].index_0 = rightIndex; // this line too, it's not straightforward (or at least it wasnt for me) - had to think a lot
		
		
		for (let i = 0; i < squares.length; i++) {
			squares[i].update();
			squares[i].display();
			
			// is scattered, id the mismatched cells
			if (squares[i].index !== squares[i].index_0) {
				squares[i].showOrange();
			} else {
				
			}
		}			
		
		
		
		

		
		count++;
		if (count%steps === 0) {
			shiftFwd *= -1;
		}
		
		let a = true;
		for (let i = 0; i < squares.length; i++) {
			if (squares[i].index !== squares[i].index_0) {
				a = false;
			}
		}
		if (a) {
			ordered.state = true;
			ordered.count = frameCount;
			//noLoop();
			//delayTime(1);
		}
	}
	

		
}

// i know what it is, the col is always maintained, don't use the mod to fix the col or row, 
// if at zero, keep in row/col; zoidberg says 

Square.prototype.rearrange = function(shiftArr, shiftFwd) {

	if (shiftFwd === 1) {
		if (this.row === shiftArr[count%steps].row) {
			this.col = getmod(this.col + shiftFwd*shiftArr[count%steps].size,n);
		}
		if (this.col === shiftArr[count%steps].col) {
			this.row = getmod(this.row +shiftFwd*shiftArr[count%steps].size,n);
		}		
	}
	if (shiftFwd === -1) {
		if (this.row === shiftArr[steps-(count%steps)-1].row) {
			this.col = getmod(this.col + shiftFwd*shiftArr[steps-(count%steps)-1].size,n);

		}
		if (this.col === shiftArr[steps-(count%steps)-1].col) {
			this.row = getmod(this.row +shiftFwd*shiftArr[steps-(count%steps)-1].size,n);
		}
	}
	
	this.index = this.col + this.row*n;
}

function sortSquares(arr) {
	arr.sort(function(a,b) {
		if (a.index < b.index) {
			return -1;
		} else {
			return 1;
		}
	});
	arr.forEach(function(val, index) {
		val.index = index;
	});
}

function pickRow(n) {
	return row = Math.floor(Math.random()*n);
}

// index will go from 0 to n*n-1
function Square(img_, index_) {
	this.img = img_;
	this.index_0 = index_;
	this.index = index_;
	this.rightImage = true;
	this.row = Math.floor(this.index/n);
	this.col = this.index%n;
}
// calculations will operate on the column and row, so these should not feature in update
Square.prototype.update = function() {
	// based on the new row and col, update index, x & y
	this.index = this.row*n+this.col;
	this.x = this.col*s;
	this.y = this.row*s;
	
	if (this.index_0 === this.index) {
		this.rightImage = true;
	} else {
		this.rightImage = false;
	}
	
}
Square.prototype.recalcRowCol = function() {
	this.row = Math.floor(this.index/n);
	this.col = this.index%n;
	//console.log(this);
}
Square.prototype.scatter = function() {
	this.index = Math.random();
	//console.log(this);
}
Square.prototype.display = function() {
	
	// draw the square
	image(this.img, this.x, this.y, s, s);
	//fill(0, 0, 255, 120/(this.row*this.col));
	//rect(this.x, this.y, s, s);

	// draw a border around the square
	stroke(150, 150, 150);
	strokeWeight(1);
	line(this.x, this.y, this.x+s, this.y);
	line(this.x+s, this.y, this.x+s, this.y+s);
	line(this.x, this.y+s, this.s+s, this.y+s);
	line(this.x, this.y, this.x, this.y+s)
	
	//rect(this.x, this.y, s, s);
	// noStroke();
	// fill(255, 205, 0, 120);
	// rect(this.x, this.y, this.w, this.h);
}
Square.prototype.showOrange = function() {
	fill(255, 205, 0, 30);
	rect(this.x, this.y, s, s);	
}

function getmod(a,b) {
	// a=15, b=4, mod=
	//return a - int(a/b)*b;
	return ((a%b)+b)%n;
}



 