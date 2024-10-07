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
    const player = PIXI.Sprite.from('https://pixijs.io/examples/examples/assets/bunny.png');
    player.anchor.set(0.5);
    player.x = app.screen.width / 2;
    player.y = app.screen.height - 50;
    app.stage.addChild(player);

    // Create an array to store rocks
    const rocks = [];

    // Create a function to spawn rocks
    function spawnRock() {
        const rock = PIXI.Sprite.from('https://pixijs.io/examples/examples/assets/bunny.png');
        rock.anchor.set(0.5);
        rock.x = Math.random() * app.screen.width;
        rock.y = -50;
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
        // Stop the game loop
        app.ticker.stop();

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
        app.stage.addChild(gameOverText);
    }

    let isGameOver = false;

    // Game loop
    app.ticker.add((delta) => {
        if (isGameOver) return;

        // Move player
        if (keys['KeyA'] && player.x > 0) player.x -= 5 * delta;
        if (keys['KeyD'] && player.x < app.screen.width) player.x += 5 * delta;
        if (keys['KeyW'] && player.y > 0) player.y -= 5 * delta;
        if (keys['KeyS'] && player.y < app.screen.height) player.y += 5 * delta;

        // Spawn rocks
        if (Math.random() < 0.02) spawnRock();

        // Move rocks and check for collision
        for (let i = rocks.length - 1; i >= 0; i--) {
            rocks[i].y += 3 * delta;

            // Check for collision with player
            if (checkCollision(player, rocks[i])) {
                isGameOver = true;
                gameOver();
                return;
            }

            if (rocks[i].y > app.screen.height + 50) {
                app.stage.removeChild(rocks[i]);
                rocks.splice(i, 1);
            }
        }
    });
});