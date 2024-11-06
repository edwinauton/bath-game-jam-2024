// Setup PixiJS application
const app = new PIXI.Application();
await app.init({background: '#FFFFFF', resizeTo: window});
document.body.appendChild(app.canvas);

// Global Constants
const IMAGE_SIZE = 32;
const GRAY = await PIXI.Assets.load('../assets/gray_block_32.png');
const BLUE = await PIXI.Assets.load('../assets/blue_block_32.png');

// Block class to calculate rendering coordinates and rendering order when created
class Block extends PIXI.Sprite {
    rendering_position

    constructor(x, y, z, texture) {
        super()

        const xCentre = app.screen.width / 2 - IMAGE_SIZE / 2;  // Centre horizontally on screen
        this.x = (0.50 * x * IMAGE_SIZE) - (0.50 * y * IMAGE_SIZE) + xCentre;

        const zOffset = z * IMAGE_SIZE / 2
        this.y = (0.25 * x * IMAGE_SIZE) + (0.25 * y * IMAGE_SIZE) + zOffset;

        this.rendering_position = -z * IMAGE_SIZE;  // Calculate position of bottom of sprite
        this.texture = texture;
    }
}

// List of all blocks to be rendered
const blocks = [new Block(0, 0, 0, GRAY), new Block(0, 0, 1, BLUE)];

// Main logic
(async () => {
    sortBlocks();
    drawBlocks();
})();

// Sort blocks to be in suitable rendering order
function sortBlocks() {
    blocks.sort((a, b) => a.rendering_position + b.rendering_position);
}

// Render all blocks provided in list
function drawBlocks() {
    for (let index = 0; index < blocks.length; index++) {
        app.stage.addChild(blocks[index])
    }
}