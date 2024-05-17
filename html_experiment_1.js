let canvas = document.getElementById("canvas");
let context = canvas.getContext("2d");

let mouseX = null;
let mouseY = null;

let mouse = new Point(mouseX, mouseY);

function Point(x, y) {
    this.x = x;
    this.y = y;
}

canvas.addEventListener('mousemove', (event) => {
    mouseX = event.clientX;
    mouseY = event.clientY;
});

function background(color) {
    context.fillStyle = color;
    context.fillRect(0, 0, canvas.width, canvas.height);
}

function Ball(x, y, r, color) {
    this.x = x;
    this.y = y;
    this.r = r;
    this.color = color;
    
    this.v = 0;
    this.vx = 0;
    this.vy = 0;

    this.distance = function(b) {
	    let dx = b.x-this.x;
	    let dy = b.y-this.y;
	    return Math.sqrt(dx*dx + dy*dy);
    }

    this.collide = function(b) {
        if(this.distance(b) <= this.r + b.r) {
            return true;
        }
        return false;
    }

    /*
    this.follow = function(b, d) { 
        if(distance(this.center, b) > d) {
            this.v = distance(this.center, b) - d;
            this.vx = xComponent(this.center, b)*this.v;
            this.vy = yComponent(this.center, b)*this.v;
        }
        else {
            this.v = 0;
            this.vx = 0;
            this.vy = 0;
        }
    }
    */
   
    this.follow = function(b, d) {
        let a = b.x-this.x;
        let o = b.y-this.y;
        let h = this.distance(b);
        
        if(h > d) {
            this.v = h - d;
            this.vx = (a/h)*this.v;
            this.vy = (o/h)*this.v;
        }
        else {
            this.v = 0;
            this.vx = 0;
            this.vy = 0;
        }

        this.x += this.vx;
        this.y += this.vy;
    }
    
    this.chase = function(b, d, v) {
        let a = b.x-this.x;
	    let o = b.y-this.y;
        let h = this.distance(b);
        
        if(h > d) {
            this.v = v;
            this.vx = (a/h)*this.v;
            this.vy = (o/h)*this.v;
        }

        else {
            this.v = 0;
            this.vx = 0;
            this.vy = 0;
        }
        this.x += this.vx;
        this.y += this.vy;
    }

    this.move = function() {
        this.x += this.vx;
        this.y += this.vy;
    }

    this.spawn = function() {
        this.x = Math.floor(Math.random()*(canvas.width-2*this.r)+this.r);
        this.y = Math.floor(Math.random()*(canvas.height-2*this.r)+this.r);
    }

    this.draw = function() {
        context.beginPath();
        context.arc(this.x, this.y, this.r, 0, Math.PI * 2, true);
        context.fillStyle = this.color;
        context.fill();        
        context.closePath();
    }
}


function Snake (r, l, color) {
    this.r = r;
    this.l = l;
    this.color = color;
    

    this.snake = [];
    this.head = function() { return this.snake[0]; }
    this.tail = function() { return this.snake[this.l-1]; }

    this.create = function() {
        for (let i = 0; i < this.l; i++) {
            if (i == 0) {
                this.snake.push(new Ball(0, 0, this.r, this.color));
            }
            if (i > 0) {
               this.snake.push(new Ball(this.snake[i-1].x, this.snake[i-1].y, this.r, this.color));
            }
        }
    }
    
    this.grow = function() {
        this.temp = this.tail()
        this.l = this.snake.push(new Ball(this.temp.x, this.temp.y, this.r, this.color));
    }

    this.die = function(b) {
         let a = this.collide(b);
         let i = this.snake.indexOf(a);

         this.snake.splice(i, (this.l-1)-i); 
         this.l = this.snake.length;
         
    }

    this.follow = function() {
        for (let i = 0; i < this.l; i++) {
            if (i > 0) {
    	   	   this.snake[i].follow(this.snake[i-1], this.r);
            }
        }
    }
    
    this.collide = function(b) {
        for (let i = 0; i < this.l; i++) {
            if (i > 0) {
    	   	if (this.snake[i].collide(b) == true) {
                    return this.snake[i];
                }
            }
        }
    }

    this.draw = function() {
        for (let i = 0; i < this.l; i++) {
            this.snake[i].draw();
        }
    }
}


let white = new Snake(10, 1, 'rgb(255, 255, 255)');
white.create();

let red = new Snake(10, 1, 'rgb(255, 0, 0)')
red.create();
red.head().spawn();

let blue = new Snake(10, 1, 'rgb(0, 0, 255)')
blue.create();
blue.head().spawn();

let food = new Ball(0, 0, 10, 'rgb(255, 255, 0)')
food.spawn();

function draw() {
    mouse = new Point(mouseX, mouseY);

    background('rgb(0, 0, 0)');

    white.head().follow(mouse, 0);
    white.follow();

    red.head().chase(white.head(), 0, 5); 
    red.follow();

    blue.head().chase(food, 0, 5); 
    blue.follow();

    if (white.head().collide(food) == true) {
        white.grow();
        food.spawn();
    }

    if (red.snake.length < (white.snake.length + blue.snake.length)/2) {
        red.grow();
    }

    if (blue.head().collide(food) == true) {
        blue.grow();
        food.spawn();
    }

    if (white.collide(red.head()) != null) {
        white.die(white.collide(red.head()));
    }

    if (white.collide(blue.head()) != null) {
        white.die(white.collide(blue.head()));
    }

    if (blue.collide(white.head()) != null) {
        blue.die(blue.collide(white.head()));
    }

    if (red.collide(white.head()) != null) {
        red.die(red.collide(white.head()));
    }


    white.draw();
    red.draw();
    blue.draw();
    food.draw();
}

setInterval(draw, 10);