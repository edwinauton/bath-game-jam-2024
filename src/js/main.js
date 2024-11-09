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
 *  @param {Boolean} hasSkyAccess   whether or not the block has sky access (i.e. no blocks above it)
 *  */
class Block extends PIXI.Sprite {
    rendering_order;
    hasSkyAccess;
    xRelative;
    yRelative;
    zRelative;
    staticY;

    constructor(x, y, z, texture, hasSkyAccess) {
        super({texture: texture});
        this.xRelative = x;
        this.yRelative = y;
        this.zRelative = z;

        const absoluteCoords = relativeToAbsolute(x, y, z, this.width, this.height);
        this.x = absoluteCoords.x
        this.y = absoluteCoords.y
        this.staticY = this.y // Store y-coordinates when not animated

        this.hasSkyAccess = hasSkyAccess;
        this.rendering_order = z * this.height;  // Calculate absolute position of bottom of sprite
    }

    animate() {
        super.eventMode = 'static'; // Allow blocks to be animated

        if (this.hasSkyAccess) { // Sky access means that no blocks are above the block
            this.addEventListener('pointerenter', () => {
                createjs.Tween.get(this).to({y: this.staticY - (this.height / 10)}, 150, createjs.Ease.sineInOut);
            });
            this.addEventListener('pointerleave', () => {
                createjs.Tween.get(this).to({y: this.staticY}, 150, createjs.Ease.sineInOut);
            });
            this.addEventListener('click', () => {
                createjs.Tween.get(this).to({y: this.staticY}, 150, createjs.Ease.sineInOut); // Reset block to original position
                eventEmitter.emit('movePlayer', this.x, (this.staticY - this.height / 2))
                console.log(this.getAbsolutePosition())
                console.log(this.getRelativePosition())
            });
        }
    }

    getAbsolutePosition() {
        return {x: this.x, y: this.staticY};
    }

    getRelativePosition() {
        return {x: this.xRelative, y: this.yRelative, z: this.zRelative};
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
    rendering_order;

    constructor(x, y, z, texture) {
        super({texture: texture});

        const absoluteCoords = relativeToAbsolute(x, y, z, this.width, this.height);
        this.x = absoluteCoords.x
        this.y = absoluteCoords.y

        this.rendering_order = Infinity; // Always on top
        eventEmitter.on('movePlayer', this.moveTo.bind(this));
    }

    moveTo(x, y) {
        createjs.Tween.get(this).to({x: x, y: y}, 1000, createjs.Ease.sineInOut); // Basic movement
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

    for (const block of blocks) {
        const texture = await PIXI.Assets.load(`../resources/assets/${block.texture}`);
        const coords = {'x': block.x, 'y': block.y, 'z': block.z + 1};
        const skyAccess = blocks.some(obj => Object.keys(coords).every(key => obj[key] === coords[key]));
        addNewBlock(new Block(block.x, block.y, block.z, texture, !skyAccess));
    }
}

/* Sort blocks to be in correct rendering order */
function sortBlocks() {
    app.stage.children.sort((a, b) => a.rendering_order - b.rendering_order); // Sort by rendering order, descending
}

/* Run every time a new block is created */
function addNewBlock(block) {
    block.animate();
    block.render()
    sortBlocks();
}

/* Create player */
async function createPlayer() {
    const texture = await PIXI.Assets.load(`../resources/assets/blue_slab.png`);
    const player = new Player(15, 15, 1, texture)
    player.render();
}

/* Main logic */
(async () => {
    await createBlocks();
    await createPlayer();
})();