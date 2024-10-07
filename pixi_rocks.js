document.addEventListener('DOMContentLoaded', () => {
    // Create a Pixi Application
    const app = new PIXI.Application({
        width: window.innerWidth,
        height: window.innerHeight,
        backgroundColor: 0x1099bb,
        resizeTo: window
    });
    document.body.appendChild(app.view);

    // Create player sprite
    const player = PIXI.Sprite.from('assets/android_front_no_bg.png');
    player.anchor.set(0.5);
    player.x = app.screen.width / 2;
    player.y = app.screen.height - 50;
    player.width = 50;
    player.height = 50;
    app.stage.addChild(player);

    // Create an array to store rocks
    const rocks = [];
    const max_rock_width = 200;
    const max_rock_height = 200;
    const min_rock_width = 100;
    const min_rock_height = 100;


    // Create a function to spawn rocks
    function spawnRock() {
        const rock = PIXI.Sprite.from('assets/rock_no_bg.png');
        rock.anchor.set(0.5);
        rock.x = Math.random() * app.screen.width;
        rock.y = -50;
        rock.height = Math.max(Math.random() * max_rock_height, min_rock_height);
        rock.width = Math.max(Math.random() * max_rock_width, min_rock_width);
        rock.tint = 0x808080; // Gray color
        app.stage.addChild(rock);
        rocks.push(rock);
    }

    // Set up keyboard input
    const keys = {};
    window.addEventListener('keydown', (e) => keys[e.code] = true);
    window.addEventListener('keyup', (e) => keys[e.code] = false);

    // Resize function
    function resize() {
        player.x = app.screen.width / 2;
        player.y = app.screen.height - 50;
    }

    // Listen for window resize events
    window.addEventListener('resize', resize);

    // Collision detection function
    function checkCollision(a, b) {
        const boundA = a.getBounds();
        const boundB = b.getBounds();
        return boundA.x + boundA.width > boundB.x &&
               boundA.x < boundB.x + boundB.width &&
               boundA.y + boundA.height > boundB.y &&
               boundA.y < boundB.y + boundB.height;
    }

    // Game over function
    function gameOver() {
        // Stop the main game loop
        app.ticker.remove(gameLoop);

        // Create game over text
        const style = new PIXI.TextStyle({
            fontFamily: 'Arial',
            fontSize: 36,
            fill: ['#ffffff', '#ff0000'],
            stroke: '#4a1850',
            strokeThickness: 5,
            dropShadow: true,
            dropShadowColor: '#000000',
            dropShadowBlur: 4,
            dropShadowAngle: Math.PI / 6,
            dropShadowDistance: 6,
        });

        const gameOverText = new PIXI.Text('Game Over!', style);
        gameOverText.x = app.screen.width / 2;
        gameOverText.y = app.screen.height / 2;
        gameOverText.anchor.set(0.5);
        gameOverText.alpha = 0;
        app.stage.addChild(gameOverText);

        // Spin and fade out animation
        let spinSpeed = 0.1;
        let fadeSpeed = 0.02;
        app.ticker.add(() => {
            player.rotation += spinSpeed;
            player.alpha -= fadeSpeed;
            gameOverText.alpha += fadeSpeed;

            if (player.alpha <= 0) {
                player.alpha = 0;
                spinSpeed = 0;
            }

            if (gameOverText.alpha >= 1) {
                gameOverText.alpha = 1;
                fadeSpeed = 0;
            }
        });
    }

    // Game loop
    function gameLoop(delta) {
        // Move player
        if (keys['KeyA'] && player.x > 0){
            player.texture = PIXI.Texture.from('assets/android_left_no_bg.png');
            player.width = 35;
            player.x -= 5 * delta;
        }
        if (keys['KeyD'] && player.x < app.screen.width){
            player.texture = PIXI.Texture.from('assets/android_right_no_bg.png');
            player.width = 35;
            player.x += 5 * delta;
        }
        if (keys['KeyW'] && player.y > 0){
            player.texture = PIXI.Texture.from('assets/android_back_no_bg.png');
            player.width = 50
            player.y -= 5 * delta;
        }
        if (keys['KeyS'] && player.y < app.screen.height){
            player.texture = PIXI.Texture.from('assets/android_front_no_bg.png');
            player.width = 50
            player.y += 5 * delta;
        }

        let num_rocks = 4;
        for(let i = 0; i<num_rocks; i++){
        // Spawn rocks
            if (Math.random() < 0.02) spawnRock();
        }

        // Move rocks and check for collision
        for (let i = rocks.length - 1; i >= 0; i--) {
            rocks[i].y += 3 * delta;

            // Check for collision with player
            if (checkCollision(player, rocks[i])) {
                gameOver();
                return;
            }

            if (rocks[i].y > app.screen.height + 50) {
                app.stage.removeChild(rocks[i]);
                rocks.splice(i, 1);
            }
        }
    }

    // Start the game loop
    app.ticker.add(gameLoop);
});