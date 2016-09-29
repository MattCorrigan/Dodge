function Vector(x, y, z) {
  this.x = x || 0;
  this.y = y || 0;
  this.z = z || 0;
}
Vector.prototype = {
  random2D: function() {
    return new Vector(random(-1, 1), random(-1, 1), 1);
  },
  negative: function() {
    return new Vector(-this.x, -this.y, -this.z);
  },
  add: function(v) {
    if (v instanceof Vector) return new Vector(this.x + v.x, this.y + v.y, this.z + v.z);
    else return new Vector(this.x + v, this.y + v, this.z + v);
  },
  subtract: function(v) {
    if (v instanceof Vector) return new Vector(this.x - v.x, this.y - v.y, this.z - v.z);
    else return new Vector(this.x - v, this.y - v, this.z - v);
  },
  multiply: function(v) {
    if (v instanceof Vector) return new Vector(this.x * v.x, this.y * v.y, this.z * v.z);
    else return new Vector(this.x * v, this.y * v, this.z * v);
  },
  divide: function(v) {
    if (v instanceof Vector) return new Vector(this.x / v.x, this.y / v.y, this.z / v.z);
    else return new Vector(this.x / v, this.y / v, this.z / v);
  },
  equals: function(v) {
    return this.x == v.x && this.y == v.y && this.z == v.z;
  },
  dot: function(v) {
    return this.x * v.x + this.y * v.y + this.z * v.z;
  },
  cross: function(v) {
    return new Vector(
      this.y * v.z - this.z * v.y,
      this.z * v.x - this.x * v.z,
      this.x * v.y - this.y * v.x
    );
  },
  length: function() {
    return Math.sqrt(this.dot(this));
  },
  unit: function() {
    return this.divide(this.length());
  },
  min: function() {
    return Math.min(Math.min(this.x, this.y), this.z);
  },
  max: function() {
    return Math.max(Math.max(this.x, this.y), this.z);
  },
  toAngles: function() {
    return {
      theta: Math.atan2(this.z, this.x),
      phi: Math.asin(this.y / this.length())
    };
  },
  angleTo: function(a) {
    return Math.acos(this.dot(a) / (this.length() * a.length()));
  },
  toArray: function(n) {
    return [this.x, this.y, this.z].slice(0, n || 3);
  },
  clone: function() {
    return new Vector(this.x, this.y, this.z);
  },
  init: function(x, y, z) {
    this.x = x; this.y = y; this.z = z;
    return this;
  }
};






var c;
var player;
var enemies = [];
var enemiesOffScreen = [];
var isGameOver = false;
var jumping = false;

var date = new Date();
var startTime = 0;
var score;

var bullets = [];
var bulletsOffScreen = [];
var firing = false;
var fireCount = 0;

var powerUp = false;
var powerUpCount = 0;
var powerUpBlock;

var particleSystems = [];

MOVE_SPEED = 6;
GRAVITY = 1;
HIGHSCORE = 0;

function gameOver() {
    textSize(16);
    fill("white");
    text("Game Over!", (width / 2)-55, height / 2);
    text("Click anywhere to try again", (width / 2)-100, 3 * height / 4);
}

function mousePressed() {
  firing = true;
}

function mouseReleased() {
  firing = false;
  fireCount = 30;
}

function fireBullet() {
    // fire bullet
    var bullet = createSprite(player.position.x, player.position.y, 10, 10);
    bullets.push(bullet);
    var angle = new Vector(mouseX - player.position.x, mouseY - player.position.y);
    angle = angle.unit().multiply(30);
    bullet.xvelocity = angle.x;
    bullet.yvelocity = angle.y;
}

function createEnemy() {
    var enemy = createSprite(Math.random() * width, 0, 30, 30);
    enemy.fallspeed = random() * 5 + 5;
    enemies.push(enemy);
}

function setup() {
    c = createCanvas(700, 500);
    player = createSprite(width/2, height-25, 50, 50);
    player.yvelocity = 0;
    createEnemy();
    startTime = date.getTime();
    
    powerUpBlock = createSprite(Math.random() * width, 0, 10, 10);
    powerUpBlock.fallspeed = 1;
}

function reset() {
  player.position.x = width / 2;
  player.position.y = height - 25;
  for (var i = 0; i < enemies.length; i++) {
    enemies[i].remove();
  }
  enemies = [];
  
  for (var i = 0; i < bullets.length; i++) {
    bullets[i].remove();
  }
  bullets = [];
  startTime = date.getTime();
  isGameOver = false;
  
  powerUpBlock.remove();
  powerUpBlock = createSprite(Math.random() * width, 0, 10, 10);
  powerUpBlock.fallspeed = 1;
  
  for (var i = 0; i < particleSystems.length; i++) {
    particleSystems[i].remove();
  }
  particleSystems = [];
}

function draw() {
    if (firing) {
      fireCount++;
      if (fireCount > 10 || (powerUp && fireCount > 5)) {
      if (isGameOver) {
        reset();
      } else {
          fireBullet();
      }
      fireCount = 0;
      }
    }
    
    powerUpBlock.position.y += powerUpBlock.fallspeed;
    if (powerUpBlock > height + 2000) {
      powerUpBlock.position.y = 0;
      powerUpBlock.position.x = Math.random() * width;
    }
  
    if (powerUpBlock.overlap(player)) {
      powerUpBlock.position.y = height + 100;
      powerUpCount = 0;
      powerUp = true;
    } else {
      if (powerUp) {
        powerUpCount++;
        if (powerUpCount > 500) {
          powerUpCount = 0;
          powerUp = false;
        }
      }
    }
  
    c.size(window.innerWidth, window.innerHeight-20);
    var canvasElement = document.getElementsByTagName("canvas")[0];
    canvasElement.width = window.innerWidth;
    canvasElement.height = window.innerHeight-20;
    
    canvasElement.getContext("2d").clearRect(0, 0, canvasElement.width, canvasElement.height);
    
    if (floor(random() * 50) == 1) {
        createEnemy();
    }
    
    if (isGameOver) {
        gameOver();
        return;
    } else {
      background(0, 0, 0);
    }
    
    
    if (keyDown(65)) {
        //a
        player.position.x -= MOVE_SPEED;
    } else if (keyDown(68)) {
        //d
        player.position.x += MOVE_SPEED;
    }
    
    if (keyDown(32) && !jumping) {
        player.yvelocity = -18;
        jumping = true;
    }
    
    // collision detection
    if (player.position.x - 25 < 0) {
        player.position.x = 25;
    } else if (player.position.x + 75 > width) {
        player.position.x = width-75;
    }
    
    player.yvelocity += GRAVITY;
    
    if (player.position.y + 25 + player.yvelocity > height) {
        player.yvelocity = 0;
        player.y = height - 25;
        jumping = false;
    } else {
        player.position.y += player.yvelocity;
    }
    
    for (var i = 0; i < enemies.length; i++) {
        var e = enemies[i];
        e.position.y += e.fallspeed;
        if (e.position.y > height+150) {
            enemiesOffScreen.push(e);
            createEnemy();
        }
        for (var j = 0; j < bullets.length; j++) {
            if (bullets[j].overlap(e)) {
                enemiesOffScreen.push(e);
                createEnemy();
                bulletsOffScreen.push(bullets[j]);
                particleSystems.push(new ParticleSystem(e));
            }
        }
    }
    
    for (var i = 0; i < enemiesOffScreen.length; i++) {
        var e = enemiesOffScreen[i];
        enemies.splice(enemies.indexOf(e), 1);
        e.remove();
    }
    enemiesOffScreen = [];
    
    for (var i = 0; i < bullets.length; i++) {
        var b = bullets[i];
        b.position.x += bullets[i].xvelocity;
        b.position.y += bullets[i].yvelocity;
        if (b.position.x < -100 || b.position.x > width + 100 || b.position.y < -100 || b.position.y > height + 100) {
          bulletsOffScreen.push(b);
        }
      }
    
    for (var i = 0; i < bulletsOffScreen.length; i++) {
        var e = bulletsOffScreen[i];
        bullets.splice(bullets.indexOf(e), 1);
        e.remove();
    }
    bulletsOffScreen = [];
    
    done = [];
    for (var i = 0; i < particleSystems.length; i++) {
      particleSystem = particleSystems[i];
      particleSystem.update();
      if (particleSystem.done) {
        particleSystem.remove();
        done.push(i);
      }
    }
    
    for (var i = 0; i < done.length; i++) {
      particleSystems.splice(done[i], 1);
    }
    
    drawSprites();
    
    // check for losing
    for (var i = 0; i < enemies.length; i++) {
        if (enemies[i].overlap(player)) {
            gameOver();
            isGameOver = true;
            if (score > HIGHSCORE) {
                HIGHSCORE = score;
            }
        }
    }
    fill("white");
    textSize(16);
    date = new Date();
    var time = date.getTime() - startTime;
    score = time / 1000;
    text("Score: " + score, 10, 20);
    if (score > HIGHSCORE) {
        HIGHSCORE = score;
    }
    text("Highscore: " + HIGHSCORE, width - 200, 20);
    
}

var ParticleSystem = function(parent) {
  
  this.done = false;
  
  this.particles = [];
  for (var i = 0; i < 20; i++) {
    sprite = createSprite(parent.position.x, parent.position.y, 5, 5);
    sprite.shapeColor = parent.shapeColor;
    sprite.vel = (new Vector()).random2D().multiply(3);
    sprite.alpha = 255;
    this.particles.push(sprite);
  }
  
  this.update = function() {
    for (var i = 0; i < this.particles.length; i++) {
      particle = this.particles[i];
      particle.vel.y += 0.1;
      particle.position.x += particle.vel.x;
      particle.position.y += particle.vel.y;
      particle.alpha-=10;
      if (particle.alpha <= 0) {
        this.done = true;
      } else {
        particle.shapeColor = color("rgba(255, 0, 0, " + (particle.alpha/255) + ")");
      }
    }
  }
  
  this.remove = function() {
    for (var i = 0; i < this.particles.length; i++) {
      this.particles[i].remove();
    }
  }
  
}