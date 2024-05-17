let canvas = document.getElementById("canvas");
let ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

function background(color) {
    ctx.fillStyle = color;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}

//Mouse
let mouseX = null;
let mouseY = null;

let mouse = new Point(mouseX, mouseY);

canvas.addEventListener('mousemove', (event) => {
    mouseX = event.clientX;
    mouseY = event.clientY;
});

//Math
function distance(a, b) {
    let dx = b.x-a.x;
    let dy = b.y-a.y;
    return Math.sqrt(dx*dx + dy*dy);
}

function xComponent(a, b) {
    let dx = b.x-a.x;
    let d = this.distance(a, b);
    return (dx/d);
}

function yComponent(a, b) {
    let dy = b.y-a.y;
    let d = distance(a, b);
    return (dy/d);
}

//Objects
function Point(x, y) {
    this.x = x;
    this.y = y;
    
    this.sum = function(b) {
        return new Point(this.x + b.x, this.y + b.y);
    }
    this.product = function(b) {
        return new Point(this.x * b.x, this.y * b.y);
    }
    this.rotate = function(bearing) {
        //voddo:
        let newX = this.x*bearing.x-this.y*bearing.y;
        let newY = this.y*bearing.x+this.x*bearing.y; 
        return new Point(newX, newY);
    }
    
    this.toScreenPoint = function(coordinate, bearing){
        return this.rotate(bearing).sum(coordinate);
    }

}

function Ball(center, r, color) {
    this.center = center;
    this.r = r;
    this.color = color;

    this.draw = function(coordinate, bearing) {
        let newCenter = this.center.toScreenPoint(coordinate, bearing);

        ctx.beginPath();
        ctx.arc(newCenter.x, newCenter.y, this.r, 0, Math.PI * 2, true);
        ctx.fillStyle = this.color;
        ctx.fill();        
        ctx.closePath();
    }
}

function Bone(x, y, v) {
    this.x = x;
    this.y = y;
    this.coordinate = new Point(x, y);

    this.v = v;
    this.vx = 0;
    this.vy = 0;

    this.moveX = function() {this.coordinate.x += this.vx;}
    this.moveY = function() {this.coordinate.y += this.vy;}
    this.move = function() {
        this.moveX();
        this.moveY();
    }

    this.bearing = new Point(0, 0);

    this.steer = function(target) {
        if(Math.trunc(distance(this.coordinate, target)) > 0) {
            this.bearing.x = xComponent(this.coordinate, target);
            this.bearing.y = yComponent(this.coordinate, target);

            this.vx = this.bearing.x*this.v;
            this.vy = this.bearing.y*this.v;
        }
        else {
            this.vx = 0;
            this.vy = 0;
        } 
    }

    this.follow = function(target, d) {
        if(Math.trunc(distance(this.coordinate, target)) > d) {
            this.bearing.x = xComponent(this.coordinate, target);
            this.bearing.y = yComponent(this.coordinate, target);

            this.v = distance(this.coordinate, target)-d
            this.vx = this.bearing.x*this.v;
            this.vy = this.bearing.y*this.v;
        }
        else {
            this.vx = 0;
            this.vy = 0;
        } 
    }
}


function Head(start, end, r, color) {
    this.start = start;
    this.end = end;
    this.r = r;
    this.color = color;

    this.points = [new Point(this.start.x-this.r, this.start.y-this.r),
                   new Point(this.start.x-this.r, this.start.y+this.r),
                   new Point(this.end.x+this.r, this.end.y+this.r),
                   new Point(this.end.x+this.r, this.end.y-this.r)];

    this.draw = function(coordinate, bearing) {
        let newPoints = [];
        for(let i = 0; i < this.points.length; i++) {
            newPoints.push(this.points[i].toScreenPoint(coordinate, bearing));
        }
        ctx.beginPath();
        ctx.moveTo(newPoints[0].x, newPoints[0].y);
        ctx.lineTo(newPoints[1].x, newPoints[1].y);
        ctx.lineTo(newPoints[2].x, newPoints[2].y);
        ctx.lineTo(newPoints[3].x, newPoints[3].y);
        ctx.fillStyle = this.color;
        ctx.fill();        
        ctx.closePath();
    }

}
function Leg(center, r, color) {
    this.center = center;
    this.r = r;
    this.color = color;

    this.points = [new Point(this.center.x-this.r, this.center.y-this.r),
                   new Point(this.center.x-this.r, this.center.y+this.r),
                   new Point(this.center.x+this.r, this.center.y+2*this.r),
                   new Point(this.center.x+this.r, this.center.y-this.r)];

    this.draw = function(coordinate, bearing) {
        let newPoints = [];
        for(let i = 0; i < this.points.length; i++) {
            newPoints.push(this.points[i].toScreenPoint(coordinate, bearing));
        }
        ctx.beginPath();
        ctx.moveTo(newPoints[0].x, newPoints[0].y);
        ctx.lineTo(newPoints[1].x, newPoints[1].y);
        ctx.lineTo(newPoints[2].x, newPoints[2].y);
        ctx.lineTo(newPoints[3].x, newPoints[3].y);
        ctx.fillStyle = this.color;
        ctx.fill();        
        ctx.closePath();
    }
}

function Body(center, r, color) {
    this.center = center;
    this.r = r;
    this.color = color;

    this.points = [new Point(this.center.x-this.r, this.center.y-this.r),
                   new Point(this.center.x-this.r, this.center.y+this.r),
                   new Point(this.center.x+this.r, this.center.y+this.r),
                   new Point(this.center.x+this.r, this.center.y-this.r)];

    this.draw = function(coordinate, bearing) {
        let newPoints = [];
        for(let i = 0; i < this.points.length; i++) {
            newPoints.push(this.points[i].toScreenPoint(coordinate, bearing));
        }
        ctx.beginPath();
        ctx.moveTo(newPoints[0].x, newPoints[0].y);
        ctx.lineTo(newPoints[1].x, newPoints[1].y);
        ctx.lineTo(newPoints[2].x, newPoints[2].y);
        ctx.lineTo(newPoints[3].x, newPoints[3].y);
        ctx.fillStyle = this.color;
        ctx.fill();        
        ctx.closePath();
    }
}

function Tail(center,type, r, color) {
    this.center = center;
    this.type = type;
    this.r = function() {
        switch (this.type) {
            case 'a': return r;
            case 'b': return r*9/10;
            case 'c': return r*4/5;
            case 'd': return r*7/10;
            case 'e': return r*3/5;
        }    
    };
    this.color = color;

    this.points = [new Point(this.center.x-this.r(), this.center.y-this.r()),
                   new Point(this.center.x-this.r(), this.center.y+this.r()),
                   new Point(this.center.x+this.r(), this.center.y+this.r()),
                   new Point(this.center.x+this.r(), this.center.y-this.r())];

    this.draw = function(coordinate, bearing) {
        let newPoints = [];
        for(let i = 0; i < this.points.length; i++) {
            newPoints.push(this.points[i].toScreenPoint(coordinate, bearing));
        }
        ctx.beginPath();
        ctx.moveTo(newPoints[0].x, newPoints[0].y);
        ctx.lineTo(newPoints[1].x, newPoints[1].y);
        ctx.lineTo(newPoints[2].x, newPoints[2].y);
        ctx.lineTo(newPoints[3].x, newPoints[3].y);
        ctx.fillStyle = this.color;
        ctx.fill();        
        ctx.closePath();
    }
}

function Dragon(v, scale, length, color) {
    this.v = v;
    this.scale = scale;
    this.length = length;
    this.color = color;
    
    this.skeleton = [new Bone(0, 0, this.v)]
    this.dragon = [new Head(new Point(0, 0), new Point(this.scale, 0), this.scale*5/4, this.color)];

    this.move = function() {
        for(let i = 0; i < this.length; i++) {
            this.skeleton[i].move();
        }
    }

    this.create = function() {
        for(let i = 1; i < this.length; i++) {
            this.skeleton.push(new Bone(0, 0, this.v));
        }
        for(let i = 1; i < this.length; i++) {
            if((i == (this.length/4 - 1)) || (i == this.length/2 - 1)) {
                this.dragon.push(new Leg(new Point(0, 0), this.scale, this.color));
                continue;
            }

            if(i > this.length/2 - 1) {
                if(i<this.length*6/10){
                    this.dragon.push(new Tail(new Point(0, 0), 'a', this.scale, this.color));
                    continue;
                }
                if(i<this.length*7/10){
                    this.dragon.push(new Tail(new Point(0, 0), 'b', this.scale, this.color));
                    continue;
                }
                if(i<this.length*8/10){
                    this.dragon.push(new Tail(new Point(0, 0), 'c', this.scale, this.color));
                    continue;
                }
                if(i<this.length*9/10){
                    this.dragon.push(new Tail(new Point(0, 0), 'd', this.scale, this.color));
                    continue;
                }
                this.dragon.push(new Tail(new Point(0, 0), 'e', this.scale, this.color));
                continue;
            }

            this.dragon.push(new Body(new Point(0, 0), this.scale, this.color));
        }
        
    }

    this.steer = function(b) {
        this.skeleton[0].steer(b);
        for(let i = 1; i < this.length; i++) {
            this.skeleton[i].follow(this.skeleton[i-1].coordinate, this.scale);
        }
    }

    this.draw = function() {
        for(let i = this.length-1; i >= 0; i--) {
            this.dragon[i].draw(this.skeleton[i].coordinate, this.skeleton[i].bearing);
        }
    }
}

let dragon = new Dragon(3, 20, 20, 'rgb(0, 255, 255)')
dragon.create();

//Drawing
function draw() {
    background('rgb(0, 0, 0)');
    mouse = new Point(mouseX, mouseY);
   
    dragon.steer(mouse);
    dragon.move();

    dragon.draw() 
}

setInterval(draw, 10);