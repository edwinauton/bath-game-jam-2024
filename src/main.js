/* Setup PixiJS application */
const app = new PIXI.Application();
await app.init({background: '#FFFFFF', resizeTo: window});
document.body.appendChild(app.canvas);

/**
 *  Block class to calculate rendering coordinates and rendering order when created
 *  @param {Number} x               relative x-coordinate for the block
 *  @param {Number} y               relative y-coordinate for the block
 *  @param {Number} z               relative z-coordinate for the block
 *  @param {Texture} texture        image texture to be rendered for the block
 *  @param {Boolean} hasSkyAccess   whether or not the block has sky access (i.e. no blocks above it)
 *  */
class Block extends PIXI.Sprite {
    rendering_position;
    hasSkyAccess;
    zPos;

    constructor(x, y, z, texture, hasSkyAccess) {
        super({texture: texture});
        this.hasSkyAccess = hasSkyAccess;
        this.zPos = z;

        const xCentre = app.screen.width / 2 - super.width / 2;  // Centre horizontally on screen
        super.x = (0.50 * x * super.width) - (0.50 * y * super.height) + xCentre;
        const yAlign = app.screen.height / 4;  // Align vertically on screen
        const zOffset = this.zPos * super.height / 2;
        super.y = (0.25 * x * super.width) + (0.25 * y * super.height) + yAlign - zOffset;

        this.rendering_position = this.zPos * super.height;  // Calculate position of bottom of sprite
    }
}

/* Read blocks from JSON file and make list of Block objects */
async function createBlocks() {
    const jsonFile = await PIXI.Assets.load({src: './blocks.json', loader: 'loadJson'})
    const blocks = jsonFile.blocks;

    const blockObjects = [];
    for (const block of blocks) {
        const coords = {"x": block.x, "y": block.y, "z": block.z + 1};
        if (blocks.some(obj => Object.keys(coords).every(key => obj[key] === coords[key]))) {
            blockObjects.push(new Block(block.x, block.y, block.z, await PIXI.Assets.load('../assets/' + block.texture), false));
        } else {
            blockObjects.push(new Block(block.x, block.y, block.z, await PIXI.Assets.load('../assets/' + block.texture), true));
        }
    }
    return blockObjects;
}

const BLOCKS = await createBlocks(); // List of blocks

/* Sort blocks to be in correct rendering order */
function sortBlocks() {
    BLOCKS.sort((a, b) => a.rendering_position - b.rendering_position); // Sort blocks by decreasing rendering_position
}

/* Render each block in the list */
function drawBlocks() {
    for (let index = 0; index < BLOCKS.length; index++) {
        app.stage.addChild(BLOCKS[index]);
    }
}

/* Animate blocks on hover */
function animateBlocks() {
    BLOCKS.forEach(block => {
        if (block.hasSkyAccess) {
            block.eventMode = 'static';
            block.on('pointerenter', float);
            block.on('pointerleave', descend);

            function float() {
                createjs.Tween.get(block)
                    .to({y: block.y -= 3}, 1000, createjs.Ease.sineInOut);
            }

            function descend() {
                createjs.Tween.get(block)
                    .to({y: block.y += 3}, 1000, createjs.Ease.sineInOut);
            }
        }
    })
}

/* Main logic */
(async () => {
    sortBlocks();
    drawBlocks();
    animateBlocks();
})();