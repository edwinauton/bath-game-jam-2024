/* Setup PixiJS application */
const app = new PIXI.Application();
await app.init({background: '#FFFFFF', resizeTo: window});
document.body.appendChild(app.canvas);

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
    xPos;
    yPos;
    zPos;

    constructor(x, y, z, texture, hasSkyAccess) {
        super({texture: texture});
        this.xPos = x;
        this.yPos = y;
        this.zPos = z;

        const xCentre = app.screen.width / 2 - super.width / 2;  // Centre horizontally on-screen
        super.x = (0.50 * x * super.width) - (0.50 * y * super.height) + xCentre;
        const yAlign = app.screen.height / 3;  // Align vertically on-screen
        const zOffset = z * super.height / 2;
        super.y = (0.25 * x * super.width) + (0.25 * y * super.height) + yAlign - zOffset;

        this.hasSkyAccess = hasSkyAccess;
        this.rendering_order = z * super.height;  // Calculate absolute position of bottom of sprite
    }
}

/* Read blocks from JSON file and make list of Block objects */
async function readBlocks() {
    const jsonFile = await PIXI.Assets.load({src: '../resources/blocks.json', loader: 'loadJson'});
    const blocks = jsonFile.blocks;
    const blockObjects = [];

    for (const block of blocks) {
        const coords = {'x': block.x, 'y': block.y, 'z': block.z + 1};
        const texture = await PIXI.Assets.load(`../resources/assets/${block.texture}`);
        if (block.hasOwnProperty('hasSkyAccess ')) {
            blockObjects.push(new Block(block.x, block.y, block.z, texture, block.hasSkyAccess ));
        } else {
            if (blocks.some(obj => Object.keys(coords).every(key => obj[key] === coords[key]))) {  // Use 2d array to tore boolean of whether spot is taken?
                blockObjects.push(new Block(block.x, block.y, block.z, texture, false));
            } else {
                blockObjects.push(new Block(block.x, block.y, block.z, texture, true));
            }
        }
    }
    return blockObjects;
}

/* Sort blocks to be in correct rendering order */
function sortBlocks(blocks) {
    blocks.sort((a, b) => a.rendering_order - b.rendering_order); // Sort by rendering order, descending
}

/* Render each block in the list */
function drawBlocks(blocks) {
    blocks.forEach(block => app.stage.addChild(block));
}

/* Animate blocks on hover */
function animateBlock(block) {
    const yPos = block.y; // Store original y-coordinate of block
    block.eventMode = 'static'; // Allow blocks to be animated

    if (block.hasSkyAccess) { // Sky access means that no blocks are above the block
        block.addEventListener('pointerenter', () => {
            createjs.Tween.get(block).to({y: yPos - (block.height / 10)}, 150, createjs.Ease.sineInOut);
        });
        block.addEventListener('pointerleave', () => {
            createjs.Tween.get(block).to({y: yPos}, 150, createjs.Ease.sineInOut);
        });
        block.addEventListener('click', () => {
            createjs.Tween.get(block).to({y: yPos}, 150, createjs.Ease.sineInOut); // Reset block to original position
            block.eventMode = 'none' // Stop animations
            block.hasSkyAccess = false;
            const newBlock = new Block(block.xPos, block.yPos, block.zPos + 1, block.texture, true)
            addNewBlock(newBlock);
        });
    }
}

function addNewBlock(newBlock) {
    app.stage.addChild(newBlock);
    animateBlock(newBlock);
}

/* Main logic */
(async () => {
    const blocks = await readBlocks(); // List of blocks
    sortBlocks(blocks);
    drawBlocks(blocks)
    blocks.forEach(block => animateBlock(block));

    app.ticker.add(() => {
    });
})();