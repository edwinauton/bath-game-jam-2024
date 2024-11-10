/* Setup PixiJS application */
const app = new PIXI.Application();
await app.init({background: '#FFFFFF', resizeTo: window});
document.body.appendChild(app.canvas);

const eventEmitter = new PIXI.EventEmitter();

/* Parent class for Block and Player with shared fields and methods */
class GameJamSprite extends PIXI.Sprite {
    renderingOrder
    gridX;
    gridY;
    gridZ;

    constructor(x, y, z, texture) {
        super({texture: texture});
        this.gridX = x;
        this.gridY = y;
        this.gridZ = z;

        this.gridToAbsolute(x, y, z)
        this.updateRenderingOrder()
    }

    gridToAbsolute(x, y, z = 1) {
        const xCentre = app.screen.width / 2 - this.width / 2;  // Centre horizontally on-screen
        this.x = (0.50 * x * this.width) - (0.50 * y * this.height) + xCentre;

        const yAlign = app.screen.height / 3;  // Align vertically on-screen
        const zOffset = z * this.height / 2;
        this.y = (0.25 * x * this.width) + (0.25 * y * this.height) + yAlign - zOffset;

        return {x: this.x, y: this.y};
    }

    updateRenderingOrder() {
        this.renderingOrder = this.gridX + this.gridY + this.gridZ
    }

    render() {
        app.stage.addChild(this);
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

        if (!this.hasBlockAbove) {
            this.addEventListener('pointerenter', () => {
                createjs.Tween.get(this).to({y: this.staticY - (this.height / 10)}, 150, createjs.Ease.sineInOut);
            });
            this.addEventListener('pointerleave', () => {
                createjs.Tween.get(this).to({y: this.staticY}, 150, createjs.Ease.sineInOut);
            });
            this.addEventListener('click', () => {
                createjs.Tween.get(this).to({y: this.staticY}, 150, createjs.Ease.sineInOut); // Reset block to original position
                eventEmitter.emit('movePlayer', this);
            });
        }
    }

    /* Check if there is a block immediately above this one */
    checkBlockAbove(blocks) {
        const blockMap = new Map();
        blocks.forEach(block => {
            const key = `${block.gridX},${block.gridY},${block.gridZ}`;  // Create keys to add to map
            blockMap.set(key, block); // Create map of key (x,y,z) -> value (Block)
        });

        const key = `${this.gridX},${this.gridY},${this.gridZ + 1}`; // Create key to search in map
        this.hasBlockAbove = blockMap.has(key);
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

        this.renderingOrder = Infinity; // Always on top
        eventEmitter.on('movePlayer', this.moveTo.bind(this));  // Run 'moveTo' when 'movePlayer' event triggers
    }

    /* Moves the player from their current position to a new block in calculated steps */
    moveTo(block) { // TODO: Check for z-levels
        if (!block.hasBlockAbove && block.gridZ === this.gridZ - 1) { // Only run for accessible blocks on this level
            createjs.Tween.removeTweens(this); // Stops ongoing Tweens

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
                    this.updateRenderingOrder()
                    createjs.Tween.get(this)
                        .to({x: absolute.x, y: absolute.y}, 150, createjs.Ease.sineInOut)
                        .call(animateStep);  // Continue loop
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

        this.label = label
        this.addInteractivity()
    }

    /* Looping hovering animation */
    animate() {
        this.eventMode = 'static'; // Allow animation

        createjs.Tween.get(this, {loop: true}) // Loop animation
            .to({y: this.y - (this.height / 10)}, 1000, createjs.Ease.sineInOut)
            .to({y: this.y}, 1000, createjs.Ease.sineInOut);
    }

    /* Add hover and click functionality */
    addInteractivity() {
        const label = this.createLabel()

        this.addEventListener('pointerenter', () => {
            app.stage.addChild(label); // Display item label
        });
        this.addEventListener('pointerleave', () => {
            app.stage.removeChild(label); // Remove item label
        });
        this.addEventListener('click', () => {
            if (this.hasAdjacentPlayer()) {
                app.stage.removeChild(label); // Remove item label
                app.stage.removeChild(this); // Remove interactable
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
        rectangle.x = this.x - this.width;
        rectangle.y = this.y - 30;
        const text = new PIXI.Text({
            text: this.label, style: {
                fontFamily: "Verdana, Geneva, sans-serif", fontSize: 16, fill: 0xFFFFFF
            }
        });
        text.anchor.set(0.5);

        const padding = 7;
        const width = text.width + 2 * padding;
        const height = text.height + 2 * padding;
        rectangle.roundRect(0, 0, width, height, 10).fill('0x000000A8');

        text.x = width / 2;
        text.y = height / 2;
        rectangle.addChild(text);

        return rectangle;
    }
}

/* Read blocks from JSON file and make list of Block objects */
async function createBlocks(scene) {
    const jsonFile = await PIXI.Assets.load({src: '../resources/blocks.json', loader: 'loadJson'});
    const blocks = jsonFile[scene];

    const blockObjects = [];
    for (const block of blocks) {
        const texture = await PIXI.Assets.load(`../resources/assets/${block.texture}`);
        blockObjects.push(new Block(block.x, block.y, block.z, texture));
    }
    return blockObjects;
}

/* Add given new blocks to existing blocks and recalculate renderingOrder, hasBlockAbove etc. */
function addNewBlocks(newBlocks) { // TODO: Generalise to all sprites, and run every time a player moves, etc.
    let existingBlocks = app.stage.children.filter(child => child instanceof Block);
    const allBlocks = existingBlocks.concat(newBlocks);
    allBlocks.sort((a, b) => a.renderingOrder - b.renderingOrder); // Sort by descending rendering order
    app.stage.children.forEach(child => child.remove());

    allBlocks.forEach(block => {
        block.render();
        block.checkBlockAbove(allBlocks);
        block.animate();
    })
}

/* Read player from JSON file and instantiate it */
async function createPlayer(playerIndex) { // TODO: Player selection?
    const jsonFile = await PIXI.Assets.load({src: '../resources/players.json', loader: 'loadJson'});
    const player = jsonFile.players[playerIndex];

    const texture = await PIXI.Assets.load(`../resources/assets/${player.texture}`);
    const playerObject = new Player(9, 9, 1, texture);
    playerObject.render();
}

/* Read interactables from JSON file and instantiate them */
async function createInteractables(scene) {
    const jsonFile = await PIXI.Assets.load({src: '../resources/interactables.json', loader: 'loadJson'});
    const interactables = jsonFile[scene];

    for (const interactable of interactables) {
        const texture = await PIXI.Assets.load(`../resources/assets/${interactable.texture}`);
        const interactableObject = new Interactable(interactable.x, interactable.y, interactable.z, texture, interactable.label);
        interactableObject.render();
        interactableObject.animate();
    }
}

/* Main logic */
(async () => {
    const testLevel = await createBlocks('test_screen');
    addNewBlocks(testLevel);
    await createInteractables('test_screen');
    await createPlayer(0);
})();