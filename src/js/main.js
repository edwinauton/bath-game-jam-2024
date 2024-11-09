/* Setup PixiJS application */
const app = new PIXI.Application();
await app.init({background: '#FFFFFF', resizeTo: window});
document.body.appendChild(app.canvas);

const eventEmitter = new PIXI.EventEmitter()

/**
 *  @param {Number} x               relative x-coordinate for the block
 *  @param {Number} y               relative y-coordinate for the block
 *  @param {Number} z               relative z-coordinate for the block
 *  @param {Texture} texture        image texture to be rendered for the block
 *  */
class Block extends PIXI.Sprite {
    renderingOrder;
    xRelative;
    yRelative;
    zRelative;
    staticY;

    constructor(x, y, z, texture) {
        super({texture: texture});
        this.xRelative = x;
        this.yRelative = y;
        this.zRelative = z;

        const absoluteCoords = relativeToAbsolute(x, y, z, this.width, this.height);
        this.x = absoluteCoords.x
        this.y = absoluteCoords.y
        this.staticY = this.y // Store y-coordinates when not animated

        this.renderingOrder = z * this.height;  // Calculate absolute position of bottom of sprite
    }

    animate() {
        super.eventMode = 'static'; // Allow blocks to be animated

        if (!this.hasBlockAbove) {
            this.addEventListener('pointerenter', () => {
                createjs.Tween.get(this).to({y: this.staticY - (this.height / 10)}, 150, createjs.Ease.sineInOut);
            });
            this.addEventListener('pointerleave', () => {
                createjs.Tween.get(this).to({y: this.staticY}, 150, createjs.Ease.sineInOut);
            });
            this.addEventListener('click', () => {
                createjs.Tween.get(this).to({y: this.staticY}, 150, createjs.Ease.sineInOut); // Reset block to original position
                eventEmitter.emit('movePlayer', this)
            });
        }
    }

    checkBlockAbove(blocks) {
        const blockMap = new Map();
        blocks.forEach(block => {
            const key = `${block.xRelative},${block.yRelative},${block.zRelative}`;
            blockMap.set(key, block);
        });
        const key = `${this.xRelative},${this.yRelative},${this.zRelative + 1}`;
        this.hasBlockAbove = blockMap.has(key);
    }

    render() {
        app.stage.addChild(this);
    }
}

/**
 *  @param {Number} x               relative x-coordinate spawn for the player
 *  @param {Number} y               relative y-coordinate spawn for the player
 *  @param {Number} z               relative z-coordinate spawn for the player
 *  @param {Texture} texture        image texture to be rendered for the player
 *  */
class Player extends PIXI.Sprite {
    renderingOrder;
    xRelative;
    yRelative;
    zRelative;

    constructor(x, y, z, texture) {
        super({texture: texture});
        this.xRelative = x;
        this.yRelative = y;
        this.zRelative = z;

        const absoluteCoords = relativeToAbsolute(x, y, z, this.width, this.height);
        this.x = absoluteCoords.x
        this.y = absoluteCoords.y

        this.renderingOrder = Infinity; // Always on top
        eventEmitter.on('movePlayer', this.moveTo.bind(this));
    }

    moveTo(block) {
        if (block.zRelative - this.zRelative <= 1) {
            const newY = block.staticY - block.height / 2
            createjs.Tween.get(this).to({x: block.x, y: newY}, 1000, createjs.Ease.sineInOut); // Basic movement

            this.xRelative = block.xRelative;
            this.yRelative = block.yRelative;
            this.zRelative = block.zRelative + 1;
        }
    }

    render() {
        app.stage.addChild(this);
    }
}

/* Convert relative cartesian coordinate to absolute isometric coordinates */
function relativeToAbsolute(x, y, z, width, height) {
    const xCentre = app.screen.width / 2 - width / 2;  // Centre horizontally on-screen
    const absoluteX = (0.50 * x * width) - (0.50 * y * height) + xCentre

    const yAlign = app.screen.height / 3;  // Align vertically on-screen
    const zOffset = z * height / 2;
    const absoluteY = (0.25 * x * width) + (0.25 * y * height) + yAlign - zOffset;

    return {x: absoluteX, y: absoluteY};
}

/* Read blocks from JSON file and make list of Block objects */
async function createBlocks() {
    const jsonFile = await PIXI.Assets.load({src: '../resources/blocks.json', loader: 'loadJson'});
    const blocks = jsonFile.blocks;

    const blockObjects = []
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

/* Run every time a new block is created */
function addNewBlocks(blocks) {
    blocks.forEach(block => {
        block.checkBlockAbove(blocks);
        block.animate();
        block.render()
        sortBlocks();
    })
}

/* Create player */
async function createPlayer() {
    const texture = await PIXI.Assets.load(`../resources/assets/blue_slab.png`);
    const player = new Player(15, 15, 1, texture)
    player.render();
}

/* Main logic */
(async () => {
    const blocks = await createBlocks();
    addNewBlocks(blocks);
    await createPlayer();
})();