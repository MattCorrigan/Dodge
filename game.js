var player;
var enemies = [];
var enemiesOffScreen = [];
var isGameOver = false;
var jumping = false;

MOVE_SPEED = 6;
GRAVITY = 2;

function gameOver() {
    textAlign(CENTER);
    fill("white");
    text("Game Over!", width / 2, height / 2);
    text("Click anywhere to try again", width / 2, 3 * height / 4);
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
    }
}

function createEnemy() {
    var enemy = createSprite(Math.random() * width, 0, 10, 30);
    enemy.fallspeed = random() * 5 + 5;
    enemies.push(enemy);
}

function setup() {
    createCanvas(700, 500);
    player = createSprite(width/2, height-25, 50, 50);
    player.yvelocity = 0;
    createEnemy();
}

function draw() {
    
    if (floor(random() * 25) == 1) {
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
        player.yvelocity = -22;
        jumping = true;
    }
    
    // collision detection
    if (player.position.x < 0) {
        player.position.x = 0;
    } else if (player.position.x + 50 > width) {
        player.position.x = width-50;
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
    }
    
    for (var i = 0; i < enemiesOffScreen.length; i++) {
        var e = enemiesOffScreen[i];
        enemies.splice(enemies.indexOf(e), 1);
        e.remove();
    }
    enemiesOffScreen = [];
    
    drawSprites();
    
    // check for losing
    for (var i = 0; i < enemies.length; i++) {
        if (enemies[i].overlap(player)) {
            gameOver();
            isGameOver = true;
        }
    }
    
}