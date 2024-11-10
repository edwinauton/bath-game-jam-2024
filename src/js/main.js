/* Setup PixiJS application */
const app = new PIXI.Application();
await app.init({background: '#FFFFFF', resizeTo: window});
document.body.appendChild(app.canvas);
const eventEmitter = new PIXI.EventEmitter();

/**
 *  @param {Number} x               grid x-coordinate for the sprite
 *  @param {Number} y               grid y-coordinate for the sprite
 *  @param {Number} z               grid z-coordinate for the sprite
 *  @param {Texture} texture        texture asset to be rendered for the sprite
 *  */
class GameJamSprite extends PIXI.Sprite {
    gridX;
    gridY;
    gridZ;

    constructor(x, y, z, texture) {
        super({texture: texture});
        this.anchor.set(0.5);
        this.gridToAbsolute(x, y, z);

        this.gridX = x;
        this.gridY = y;
        this.gridZ = z;
        this.updateRenderingOrder();
    }

    /* Convert from grid coordinates to pixel coordinates */
    gridToAbsolute(x, y, z = 1) {
        const xCentre = app.screen.width / 2;  // Centre horizontally on-screen
        this.x = (0.50 * x * this.width) - (0.50 * y * this.height) + xCentre;

        const yAlign = app.screen.height / 3;  // Align vertically on-screen
        const zOffset = z * this.height / 2;
        this.y = (0.25 * x * this.width) + (0.25 * y * this.height) + yAlign - zOffset;

        return {x: this.x, y: this.y};
    }

    updateRenderingOrder() {
        this.zIndex = this.gridX + this.gridY + this.gridZ;
    }

    /* Shortcut to app.stage.addChild(this) */
    render() {
        app.stage.addChild(this);
    }

    /* Fade in to alpha = 1 */
    fadeIn(sprite = this) {
        app.stage.addChild(sprite);
        createjs.Tween.get(sprite)
            .to({alpha: 1}, 100, createjs.Ease.sineInOut); // Fade in
    }

    /* Fade out to alpha = 0 */
    fadeOut(sprite = this) {
        createjs.Tween.get(sprite)
            .to({alpha: 0}, 100, createjs.Ease.sineInOut) // Fade out
            .call(() => app.stage.removeChild(sprite)); // Remove item label
    }

    /* Shrink to size = 0 */
    shrinkOut(sprite = this) {
        createjs.Tween.get(sprite.scale)
            .to({x: 0, y: 0}, 250, createjs.Ease.sineInOut) // Fade out
            .call(() => app.stage.removeChild(sprite)); // Remove item label
    }

    /* Hovering animation */
    hover() {
        createjs.Tween.get(this)
            .to({y: this.staticY - (this.height / 10)}, 150, createjs.Ease.sineInOut);
    }

    /* Sinking animation */
    sink() {
        createjs.Tween.get(this)
            .to({y: this.staticY}, 150, createjs.Ease.sineInOut);
    }

    /* Looping bouncing animation */
    bounce() {
        createjs.Tween.get(this, {loop: true}) // Loop animation
            .to({y: this.y - (this.height / 10)}, 1000, createjs.Ease.sineInOut)
            .to({y: this.y}, 1000, createjs.Ease.sineInOut);
    }
}

/**
 *  @param {Number} x               grid x-coordinate for the block
 *  @param {Number} y               grid y-coordinate for the block
 *  @param {Number} z               grid z-coordinate for the block
 *  @param {Texture} texture        texture asset to be rendered for the block
 *  */
class Block extends GameJamSprite {
    staticY;

    constructor(x, y, z, texture) {
        super(x, y, z, texture);
        this.staticY = this.y;
    }

    /* Add hover and click animations */
    animate() {
        this.eventMode = 'static'; // Allow blocks to be animated

        this.addEventListener('pointerenter', () => {
            if (!this.hasBlockAbove) {
                this.hover();
            }
        });
        this.addEventListener('pointerleave', () => {
            this.sink();
        });
        this.addEventListener('click', () => {
            this.sink();
            if (!this.hasBlockAbove) {
                eventEmitter.emit('movePlayer', this);
            }
        });
    }

    /* Check if there is something immediately above this block */
    checkAbove(spriteMap) {
        const aboveKey = `${this.gridX},${this.gridY},${this.gridZ + 1}`; // Create the key for the above block
        this.hasBlockAbove = spriteMap.has(aboveKey); // Check if the key is in the map
    }
}

/**
 *  @param {Number} x               grid x-coordinate spawn for the player
 *  @param {Number} y               grid y-coordinate spawn for the player
 *  @param {Number} z               grid z-coordinate spawn for the player
 *  @param {Texture} texture        texture asset to be rendered for the player
 *  */
class Player extends GameJamSprite {
    constructor(x, y, z, texture) {
        super(x, y, z, texture);

        eventEmitter.on('movePlayer', this.moveTo.bind(this));  // Run 'moveTo' when 'movePlayer' event triggers
    }

    /* Moves the player from their current position to a new block in calculated steps */
    moveTo(block) { // TODO: Check for z-levels and collisions
        if (!block.hasBlockAbove && block.gridZ === this.gridZ - 1) { // Only run for accessible blocks on this level
            createjs.Tween.removeTweens(this); // Stops ongoing Tweens for the player

            const animateStep = () => {
                let moved = false;

                if (this.gridX !== block.gridX) {
                    this.gridX += (this.gridX < block.gridX) ? 1 : -1; // 1 if true, -1 if false
                    moved = true;
                } else if (this.gridY !== block.gridY) {
                    this.gridY += (this.gridY < block.gridY) ? 1 : -1; // 1 if true, -1 if false
                    moved = true;
                }

                if (moved) {  // Check if anything has been changed
                    const absolute = this.gridToAbsolute(this.gridX, this.gridY);
                    this.updateRenderingOrder();
                    createjs.Tween.get(this)
                        .to({x: absolute.x, y: absolute.y}, 150, createjs.Ease.sineInOut)
                        .call(animateStep);  // Continue loop
                    tick();
                }
            }
            animateStep(); // Start loop
        }
    }
}

/**
 *  @param {Number} x               grid x-coordinate for the interactable
 *  @param {Number} y               grid y-coordinate for the interactable
 *  @param {Number} z               grid z-coordinate for the interactable
 *  @param {Texture} texture        texture asset to be rendered for the interactable
 *  @param {String} label           label to be displayed above the interactable when hovered over
 *  */
class Interactable extends GameJamSprite {
    label;

    constructor(x, y, z, texture, label) {
        super(x, y, z, texture);

        this.label = label;
        this.addInteractivity();
    }

    /* Looping hovering animation */
    animate() {
        this.eventMode = 'static'; // Allow animation
        this.bounce();
    }

    /* Add hover and click functionality */
    addInteractivity() {
        const label = this.createLabel();

        this.addEventListener('pointerenter', () => {
            this.fadeIn(label);
        });
        this.addEventListener('pointerleave', () => {
            this.fadeOut(label);
        });
        this.addEventListener('click', () => {
            if (this.hasAdjacentPlayer()) {
                this.fadeOut(label);
                this.shrinkOut();
                console.log(`You collected a ${this.label}!`); // TODO: Add functionality
            }
        });
    }

    /* Check for a player in any adjacent tile */
    hasAdjacentPlayer() {
        const players = app.stage.children.filter(child => child instanceof Player);
        const playerMap = new Map();
        players.forEach(player => {
            const key = `${player.gridX},${player.gridY},${player.gridZ}`;  // Create keys to add to map
            playerMap.set(key, player); // Create map of key (x,y,z) -> value (Player)
        });

        // Check all four adjacent tiles to this one
        const key1 = `${this.gridX + 1},${this.gridY},${this.gridZ}`; // Create key to search in map
        const key2 = `${this.gridX - 1},${this.gridY},${this.gridZ}`; // Create key to search in map
        const key3 = `${this.gridX},${this.gridY + 1},${this.gridZ}`; // Create key to search in map
        const key4 = `${this.gridX},${this.gridY - 1},${this.gridZ}`; // Create key to search in map
        return (playerMap.has(key1) || playerMap.has(key2) || playerMap.has(key3) || playerMap.has(key4));
    }

    createLabel() {
        const rectangle = new PIXI.Graphics();
        const text = new PIXI.Text({
            text: this.label, style: {
                fontFamily: "Verdana, Geneva, sans-serif", fontSize: 16, fill: 0xFFFFFF
            }
        });
        text.anchor.set(0.5);

        const padding = 7;
        const width = text.width + 2 * padding;
        const height = text.height + 2 * padding;

        text.x = width / 2;
        text.y = height / 2;

        rectangle.x = this.x - width / 2;
        rectangle.y = this.y - 45;
        rectangle.roundRect(0, 0, width, height, 10).fill('0x000000A8');
        rectangle.addChild(text);

        rectangle.alpha = 0; // Start hidden
        rectangle.zIndex = Infinity; // Always on top

        return rectangle;
    }
}

/* Read in blocks and instantiate them */
async function createBlocks(scene) {
    const blocks = await readJSON('blocks.json', scene);

    for (const block of blocks) {
        const texture = await PIXI.Assets.load(`../resources/assets/${block.texture}`);
        const blockObject = new Block(block.x, block.y, block.z, texture);
        blockObject.render();
        blockObject.animate();
    }
}

/* Read in player and instantiate it */
async function createPlayer(playerIndex) { // TODO: Player selection?
    const player = (await readJSON('players.json', 'players'))[playerIndex];
    const texture = await PIXI.Assets.load(`../resources/assets/${player.texture}`);
    const playerObject = new Player(9, 9, 1, texture);
    playerObject.render();
}

/* Read in interactables and instantiate them */
async function createInteractables(scene) {
    const interactables = await readJSON('interactables.json', scene);

    for (const interactable of interactables) {
        const texture = await PIXI.Assets.load(`../resources/assets/${interactable.texture}`);
        const interactableObject = new Interactable(interactable.x, interactable.y, interactable.z, texture, interactable.label);
        interactableObject.render();
        interactableObject.animate();
    }
}

/* Read given JSON file and return data from given array */
async function readJSON(fileName, array) {
    const jsonFile = await PIXI.Assets.load({src: `../resources/${fileName}`, loader: 'loadJson'});
    return jsonFile[array];
}

/* ---------- Main Logic ---------- */
(async () => {
    await createBlocks('test_screen');
    await createInteractables('test_screen');
    await createPlayer(0);
    tick();
})();

/* Recalculate rendering order and run checkAbove for blocks */
function tick() {
    const spriteMap = new Map();

    app.stage.children.forEach(child => {
        if (child instanceof GameJamSprite) {
            const key = `${child.gridX},${child.gridY},${child.gridZ}`; // Create key for the sprite
            spriteMap.set(key, child); // Add key to map
            child.updateRenderingOrder();
        }
    });
    app.stage.children.forEach(child => {
        if (child instanceof Block) {
            child.checkAbove(spriteMap);
        }
    });
}