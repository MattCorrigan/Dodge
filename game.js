function Vector(x, y, z) {
  this.x = x || 0;
  this.y = y || 0;
  this.z = z || 0;
}
Vector.prototype = {
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







var player;
var enemies = [];
var enemiesOffScreen = [];
var isGameOver = false;
var jumping = false;

var date = new Date();
var startTime = 0;
var score;

var bullets = [];

MOVE_SPEED = 6;
GRAVITY = 1;
HIGHSCORE = 0;

function gameOver() {
    fill("white");
    text("Game Over!", (width / 2)-75, height / 2);
    text("Click anywhere to try again", (width / 2)-100, 3 * height / 4);
}

function mouseClicked() {
    if (isGameOver) {
        isGameOver = false;
        player.position.x = width/2;
        player.position.y = height-25;
        for (var i = 0; i < enemies.length; i++) {
            enemies[i].remove();
        }
        enemies = [];
        
        date = new Date();
        var time = date.getTime();
        startTime = time;
        score = 0;
    } else {
        fireBullet();
    }
}

function fireBullet() {
    // fire bullet
    var bullet = createSprite(player.position.x, player.position.y, 10, 10);
    bullets.push(bullet);
    var angle = new Vector(mouseX - player.position.x, mouseY - player.position.y);
    angle = angle.unit().multiply(10);
    bullet.xvelocity = angle.x;
    bullet.yvelocity = angle.y;
}

function createEnemy() {
    var enemy = createSprite(Math.random() * width, 0, 20, 30);
    enemy.fallspeed = random() * 5 + 5;
    enemies.push(enemy);
}

function setup() {
    createCanvas(700, 500);
    player = createSprite(width/2, height-25, 50, 50);
    player.yvelocity = 0;
    createEnemy();
    startTime = date.getTime();
}

function draw() {
    
    if (floor(random() * 50) == 1) {
        createEnemy()
    }
    
    if (isGameOver) {
        return;
    }
    
    background(0, 0, 0);
    
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
        if (e.position.y > height+50) {
            enemiesOffScreen.push(e);
            createEnemy();
        }
        for (var j = 0; j < bullets.length; j++) {
            if (bullets[j].overlap(e)) {
                enemiesOffScreen.push(e);
                createEnemy();
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
        bullets[i].position.x += bullets[i].xvelocity;
        bullets[i].position.y += bullets[i].yvelocity;
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
    date = new Date();
    var time = date.getTime() - startTime;
    score = time / 1000;
    text("Score: " + score, 10, 20);
    if (score > HIGHSCORE) {
        HIGHSCORE = score;
    }
    text("Highscore: " + HIGHSCORE, width - 200, 20);
    
}