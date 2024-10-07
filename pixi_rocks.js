document.addEventListener('DOMContentLoaded', () => {

    // Create a Pixi Application
    const app = new PIXI.Application({
        width: window.innerWidth,
        height: window.innerHeight,
        backgroundColor: 0x1099bb
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

    // Game loop
    app.ticker.add((delta) => {
        // Move player
        if (keys['KeyA'] && player.x > 0) player.x -= 5 * delta;
        if (keys['KeyD'] && player.x < app.screen.width) player.x += 5 * delta;
        if (keys['KeyW'] && player.y > 0) player.y -= 5 * delta;
        if (keys['KeyS'] && player.y < app.screen.height) player.y += 5 * delta;

        // Spawn rocks
        if (Math.random() < 0.02) spawnRock();

        // Move rocks
        for (let i = rocks.length - 1; i >= 0; i--) {
            rocks[i].y += 3 * delta;
            if (rocks[i].y > app.screen.height + 50) {
                app.stage.removeChild(rocks[i]);
                rocks.splice(i, 1);
            }
        }
    });
})