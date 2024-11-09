/* Setup PixiJS application */
const app = new PIXI.Application();
await app.init({background: '#FFFFFF', resizeTo: window});
document.body.appendChild(app.canvas);

const eventEmitter = new PIXI.EventEmitter();

/* Parent class for Block and Player with shared fields and methods */
class GameJamSprite extends PIXI.Sprite {
    xRelative;
    yRelative;
    zRelative;

    constructor(x, y, z, texture) {
        super({texture: texture});
        this.xRelative = x;
        this.yRelative = y;
        this.zRelative = z;

        const xCentre = app.screen.width / 2 - this.width / 2;  // Centre horizontally on-screen
        this.x = (0.50 * x * this.width) - (0.50 * y * this.height) + xCentre;

        const yAlign = app.screen.height / 3;  // Align vertically on-screen
        const zOffset = z * this.height / 2;
        this.y = (0.25 * x * this.width) + (0.25 * y * this.height) + yAlign - zOffset;
    }

    render() {
        app.stage.addChild(this);
    }
}

/**
 *  @param {Number} x               relative x-coordinate for the block
 *  @param {Number} y               relative y-coordinate for the block
 *  @param {Number} z               relative z-coordinate for the block
 *  @param {Texture} texture        image texture to be rendered for the block
 *  */
class Block extends GameJamSprite {
    staticY;

    constructor(x, y, z, texture) {
        super(x, y, z, texture);

        this.renderingOrder = z * this.height;  // Calculate absolute position of bottom of sprite
        this.staticY = this.y;
    }

    /* Animations to be run on the block when hovered over, clicked, etc.*/
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

    /* Check if there is a block immediately above this one*/
    checkBlockAbove(blocks) {
        const blockMap = new Map();
        blocks.forEach(block => {
            const key = `${block.xRelative},${block.yRelative},${block.zRelative}`;  // Create keys to add to map
            blockMap.set(key, block); // Create map of key (x,y,z) -> value (Block)
        });

        const key = `${this.xRelative},${this.yRelative},${this.zRelative + 1}`; // Create key to search in map
        this.hasBlockAbove = blockMap.has(key);
    }
}

/**
 *  @param {Number} x               relative x-coordinate spawn for the player
 *  @param {Number} y               relative y-coordinate spawn for the player
 *  @param {Number} z               relative z-coordinate spawn for the player
 *  @param {Texture} texture        image texture to be rendered for the player
 *  */
class Player extends GameJamSprite {
    constructor(x, y, z, texture) {
        super(x, y, z, texture);

        this.renderingOrder = Infinity; // Always on top
        eventEmitter.on('movePlayer', this.moveTo.bind(this));  // Run 'moveTo' when 'movePlayer' event triggers
    }

    /* Smoothly move the player from their current position to a new block */ // TODO: Use pathfinding algorithm?
    moveTo(block) {
        if (Math.abs((block.zRelative + 1) - this.zRelative) <= 1) {
            const yAbsolute = block.staticY - block.height / 2; // Correct for block size
            createjs.Tween.get(this).to({x: block.x, y: yAbsolute}, 2000, createjs.Ease.sineInOut); // Basic movement

            this.xRelative = block.xRelative;
            this.yRelative = block.yRelative;
            this.zRelative = block.zRelative + 1;
        }
    }
}

/* Read blocks from JSON file and make list of Block objects */
async function createBlocks() {
    const jsonFile = await PIXI.Assets.load({src: '../resources/blocks.json', loader: 'loadJson'});
    const blocks = jsonFile.blocks;

    const blockObjects = [];
    for (const block of blocks) {
        const texture = await PIXI.Assets.load(`../resources/assets/${block.texture}`);
        blockObjects.push(new Block(block.x, block.y, block.z, texture));
    }
    return blockObjects;
}

/* Sort blocks to be in correct rendering order */
function sortBlocks() {
    app.stage.children.sort((a, b) => a.renderingOrder - b.renderingOrder); // Sort by rendering order, descending
}

/* */
function addNewBlocks(blocks) {
    blocks.forEach(block => {
        block.checkBlockAbove(blocks);
        block.animate();
        block.render()
        sortBlocks();
    });
}

/* Create player */
async function createPlayer() {
    const texture = await PIXI.Assets.load(`../resources/assets/blue_slab.png`);
    const player = new Player(9, 9, 2, texture)
    player.render();
}

/* Main logic */
(async () => {
    addNewBlocks(await createBlocks());
    await createPlayer();
})();