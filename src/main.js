// Setup PixiJS application
const app = new PIXI.Application();
await app.init({background: '#FFFFFF', resizeTo: window});
document.body.appendChild(app.canvas);

/**
 *  Block class to calculate rendering coordinates and rendering order when created
 *  @param {Number} x           relative x-coordinate for the block
 *  @param {Number} y           relative y-coordinate for the block
 *  @param {Number} z           relative z-coordinate for the block
 *  @param {Texture} texture    image texture to be rendered for the block
 *  */
class Block extends PIXI.Sprite {
    rendering_position

    constructor(x, y, z, texture) {
        super({texture: texture})

        const xCentre = app.screen.width / 2 - super.width / 2;  // Centre horizontally on screen
        super.x = (0.50 * x * super.width) - (0.50 * y * super.height) + xCentre;
        const yAlign = app.screen.height / 4;  // Align vertically on screen
        const zOffset = z * super.height / 2;
        super.y = (0.25 * x * super.width) + (0.25 * y * super.height) + yAlign - zOffset;

        this.rendering_position = z * super.height;  // Calculate position of bottom of sprite
    }
}

const GRAY = await PIXI.Assets.load('../assets/gray_block_32.png');
const BLUE = await PIXI.Assets.load('../assets/blue_block_32.png');
const BLOCKS = [new Block(0, 0, 0, GRAY), new Block(0, 1, 0, GRAY), new Block(0, 2, 0, GRAY), new Block(0, 3, 0, GRAY), new Block(0, 4, 0, GRAY), new Block(0, 5, 0, GRAY), new Block(0, 6, 0, GRAY), new Block(0, 7, 0, GRAY), new Block(0, 8, 0, GRAY), new Block(0, 9, 0, GRAY), new Block(0, 10, 0, GRAY), new Block(0, 11, 0, GRAY), new Block(0, 12, 0, GRAY), new Block(0, 13, 0, GRAY), new Block(0, 14, 0, GRAY), new Block(0, 15, 0, GRAY), new Block(0, 16, 0, GRAY), new Block(0, 17, 0, GRAY), new Block(0, 18, 0, GRAY), new Block(0, 19, 0, GRAY), new Block(1, 0, 0, GRAY), new Block(1, 1, 0, GRAY), new Block(1, 2, 0, GRAY), new Block(1, 3, 0, GRAY), new Block(1, 4, 0, GRAY), new Block(1, 5, 0, GRAY), new Block(1, 6, 0, GRAY), new Block(1, 7, 0, GRAY), new Block(1, 8, 0, GRAY), new Block(1, 9, 0, GRAY), new Block(1, 10, 0, GRAY), new Block(1, 11, 0, GRAY), new Block(1, 12, 0, GRAY), new Block(1, 13, 0, GRAY), new Block(1, 14, 0, GRAY), new Block(1, 15, 0, GRAY), new Block(1, 16, 0, GRAY), new Block(1, 17, 0, GRAY), new Block(1, 18, 0, GRAY), new Block(1, 19, 0, GRAY), new Block(2, 0, 0, GRAY), new Block(2, 1, 0, GRAY), new Block(2, 2, 0, GRAY), new Block(2, 3, 0, GRAY), new Block(2, 4, 0, GRAY), new Block(2, 5, 0, GRAY), new Block(2, 6, 0, GRAY), new Block(2, 7, 0, GRAY), new Block(2, 8, 0, GRAY), new Block(2, 9, 0, GRAY), new Block(2, 10, 0, GRAY), new Block(2, 11, 0, GRAY), new Block(2, 12, 0, GRAY), new Block(2, 13, 0, GRAY), new Block(2, 14, 0, GRAY), new Block(2, 15, 0, GRAY), new Block(2, 16, 0, GRAY), new Block(2, 17, 0, GRAY), new Block(2, 18, 0, GRAY), new Block(2, 19, 0, GRAY), new Block(3, 0, 0, GRAY), new Block(3, 1, 0, GRAY), new Block(3, 2, 0, GRAY), new Block(3, 3, 0, GRAY), new Block(3, 4, 0, GRAY), new Block(3, 5, 0, GRAY), new Block(3, 6, 0, GRAY), new Block(3, 7, 0, GRAY), new Block(3, 8, 0, GRAY), new Block(3, 9, 0, GRAY), new Block(3, 10, 0, GRAY), new Block(3, 11, 0, GRAY), new Block(3, 12, 0, GRAY), new Block(3, 13, 0, GRAY), new Block(3, 14, 0, GRAY), new Block(3, 15, 0, GRAY), new Block(3, 16, 0, GRAY), new Block(3, 17, 0, GRAY), new Block(3, 18, 0, GRAY), new Block(3, 19, 0, GRAY), new Block(4, 0, 0, GRAY), new Block(4, 1, 0, GRAY), new Block(4, 2, 0, GRAY), new Block(4, 3, 0, GRAY), new Block(4, 4, 0, GRAY), new Block(4, 5, 0, GRAY), new Block(4, 6, 0, GRAY), new Block(4, 7, 0, GRAY), new Block(4, 8, 0, GRAY), new Block(4, 9, 0, GRAY), new Block(4, 10, 0, GRAY), new Block(4, 11, 0, GRAY), new Block(4, 12, 0, GRAY), new Block(4, 13, 0, GRAY), new Block(4, 14, 0, GRAY), new Block(4, 15, 0, GRAY), new Block(4, 16, 0, GRAY), new Block(4, 17, 0, GRAY), new Block(4, 18, 0, GRAY), new Block(4, 19, 0, GRAY), new Block(5, 0, 0, GRAY), new Block(5, 1, 0, GRAY), new Block(5, 2, 0, GRAY), new Block(5, 3, 0, GRAY), new Block(5, 4, 0, GRAY), new Block(5, 5, 0, GRAY), new Block(5, 6, 0, GRAY), new Block(5, 7, 0, GRAY), new Block(5, 8, 0, GRAY), new Block(5, 9, 0, GRAY), new Block(5, 10, 0, GRAY), new Block(5, 11, 0, GRAY), new Block(5, 12, 0, GRAY), new Block(5, 13, 0, GRAY), new Block(5, 14, 0, GRAY), new Block(5, 15, 0, GRAY), new Block(5, 16, 0, GRAY), new Block(5, 17, 0, GRAY), new Block(5, 18, 0, GRAY), new Block(5, 19, 0, GRAY), new Block(6, 0, 0, GRAY), new Block(6, 1, 0, GRAY), new Block(6, 2, 0, GRAY), new Block(6, 3, 0, GRAY), new Block(6, 4, 0, GRAY), new Block(6, 5, 0, GRAY), new Block(6, 6, 0, GRAY), new Block(6, 7, 0, GRAY), new Block(6, 8, 0, GRAY), new Block(6, 9, 0, GRAY), new Block(6, 10, 0, GRAY), new Block(6, 11, 0, GRAY), new Block(6, 12, 0, GRAY), new Block(6, 13, 0, GRAY), new Block(6, 14, 0, GRAY), new Block(6, 15, 0, GRAY), new Block(6, 16, 0, GRAY), new Block(6, 17, 0, GRAY), new Block(6, 18, 0, GRAY), new Block(6, 19, 0, GRAY), new Block(7, 0, 0, GRAY), new Block(7, 1, 0, GRAY), new Block(7, 2, 0, GRAY), new Block(7, 3, 0, GRAY), new Block(7, 4, 0, GRAY), new Block(7, 5, 0, GRAY), new Block(7, 6, 0, GRAY), new Block(7, 7, 0, GRAY), new Block(7, 8, 0, GRAY), new Block(7, 9, 0, GRAY), new Block(7, 10, 0, GRAY), new Block(7, 11, 0, GRAY), new Block(7, 12, 0, GRAY), new Block(7, 13, 0, GRAY), new Block(7, 14, 0, GRAY), new Block(7, 15, 0, GRAY), new Block(7, 16, 0, GRAY), new Block(7, 17, 0, GRAY), new Block(7, 18, 0, GRAY), new Block(7, 19, 0, GRAY), new Block(8, 0, 0, GRAY), new Block(8, 1, 0, GRAY), new Block(8, 2, 0, GRAY), new Block(8, 3, 0, GRAY), new Block(8, 4, 0, GRAY), new Block(8, 5, 0, GRAY), new Block(8, 6, 0, GRAY), new Block(8, 7, 0, GRAY), new Block(8, 8, 0, GRAY), new Block(8, 9, 0, GRAY), new Block(8, 10, 0, GRAY), new Block(8, 11, 0, GRAY), new Block(8, 12, 0, GRAY), new Block(8, 13, 0, GRAY), new Block(8, 14, 0, GRAY), new Block(8, 15, 0, GRAY), new Block(8, 16, 0, GRAY), new Block(8, 17, 0, GRAY), new Block(8, 18, 0, GRAY), new Block(8, 19, 0, GRAY), new Block(9, 0, 0, GRAY), new Block(9, 1, 0, GRAY), new Block(9, 2, 0, GRAY), new Block(9, 3, 0, GRAY), new Block(9, 4, 0, GRAY), new Block(9, 5, 0, GRAY), new Block(9, 6, 0, GRAY), new Block(9, 7, 0, GRAY), new Block(9, 8, 0, GRAY), new Block(9, 9, 0, GRAY), new Block(9, 10, 0, GRAY), new Block(9, 11, 0, GRAY), new Block(9, 12, 0, GRAY), new Block(9, 13, 0, GRAY), new Block(9, 14, 0, GRAY), new Block(9, 15, 0, GRAY), new Block(9, 16, 0, GRAY), new Block(9, 17, 0, GRAY), new Block(9, 18, 0, GRAY), new Block(9, 19, 0, GRAY), new Block(10, 0, 0, GRAY), new Block(10, 1, 0, GRAY), new Block(10, 2, 0, GRAY), new Block(10, 3, 0, GRAY), new Block(10, 4, 0, GRAY), new Block(10, 5, 0, GRAY), new Block(10, 6, 0, GRAY), new Block(10, 7, 0, GRAY), new Block(10, 8, 0, GRAY), new Block(10, 9, 0, GRAY), new Block(10, 10, 0, GRAY), new Block(10, 11, 0, GRAY), new Block(10, 12, 0, GRAY), new Block(10, 13, 0, GRAY), new Block(10, 14, 0, GRAY), new Block(10, 15, 0, GRAY), new Block(10, 16, 0, GRAY), new Block(10, 17, 0, GRAY), new Block(10, 18, 0, GRAY), new Block(10, 19, 0, GRAY), new Block(11, 0, 0, GRAY), new Block(11, 1, 0, GRAY), new Block(11, 2, 0, GRAY), new Block(11, 3, 0, GRAY), new Block(11, 4, 0, GRAY), new Block(11, 5, 0, GRAY), new Block(11, 6, 0, GRAY), new Block(11, 7, 0, GRAY), new Block(11, 8, 0, GRAY), new Block(11, 9, 0, GRAY), new Block(11, 10, 0, GRAY), new Block(11, 11, 0, GRAY), new Block(11, 12, 0, GRAY), new Block(11, 13, 0, GRAY), new Block(11, 14, 0, GRAY), new Block(11, 15, 0, GRAY), new Block(11, 16, 0, GRAY), new Block(11, 17, 0, GRAY), new Block(11, 18, 0, GRAY), new Block(11, 19, 0, GRAY), new Block(12, 0, 0, GRAY), new Block(12, 1, 0, GRAY), new Block(12, 2, 0, GRAY), new Block(12, 3, 0, GRAY), new Block(12, 4, 0, GRAY), new Block(12, 5, 0, GRAY), new Block(12, 6, 0, GRAY), new Block(12, 7, 0, GRAY), new Block(12, 8, 0, GRAY), new Block(12, 9, 0, GRAY), new Block(12, 10, 0, GRAY), new Block(12, 11, 0, GRAY), new Block(12, 12, 0, GRAY), new Block(12, 13, 0, GRAY), new Block(12, 14, 0, GRAY), new Block(12, 15, 0, GRAY), new Block(12, 16, 0, GRAY), new Block(12, 17, 0, GRAY), new Block(12, 18, 0, GRAY), new Block(12, 19, 0, GRAY), new Block(13, 0, 0, GRAY), new Block(13, 1, 0, GRAY), new Block(13, 2, 0, GRAY), new Block(13, 3, 0, GRAY), new Block(13, 4, 0, GRAY), new Block(13, 5, 0, GRAY), new Block(13, 6, 0, GRAY), new Block(13, 7, 0, GRAY), new Block(13, 8, 0, GRAY), new Block(13, 9, 0, GRAY), new Block(13, 10, 0, GRAY), new Block(13, 11, 0, GRAY), new Block(13, 12, 0, GRAY), new Block(13, 13, 0, GRAY), new Block(13, 14, 0, GRAY), new Block(13, 15, 0, GRAY), new Block(13, 16, 0, GRAY), new Block(13, 17, 0, GRAY), new Block(13, 18, 0, GRAY), new Block(13, 19, 0, GRAY), new Block(14, 0, 0, GRAY), new Block(14, 1, 0, GRAY), new Block(14, 2, 0, GRAY), new Block(14, 3, 0, GRAY), new Block(14, 4, 0, GRAY), new Block(14, 5, 0, GRAY), new Block(14, 6, 0, GRAY), new Block(14, 7, 0, GRAY), new Block(14, 8, 0, GRAY), new Block(14, 9, 0, GRAY), new Block(14, 10, 0, GRAY), new Block(14, 11, 0, GRAY), new Block(14, 12, 0, GRAY), new Block(14, 13, 0, GRAY), new Block(14, 14, 0, GRAY), new Block(14, 15, 0, GRAY), new Block(14, 16, 0, GRAY), new Block(14, 17, 0, GRAY), new Block(14, 18, 0, GRAY), new Block(14, 19, 0, GRAY), new Block(15, 0, 0, GRAY), new Block(15, 1, 0, GRAY), new Block(15, 2, 0, GRAY), new Block(15, 3, 0, GRAY), new Block(15, 4, 0, GRAY), new Block(15, 5, 0, GRAY), new Block(15, 6, 0, GRAY), new Block(15, 7, 0, GRAY), new Block(15, 8, 0, GRAY), new Block(15, 9, 0, GRAY), new Block(15, 10, 0, GRAY), new Block(15, 11, 0, GRAY), new Block(15, 12, 0, GRAY), new Block(15, 13, 0, GRAY), new Block(15, 14, 0, GRAY), new Block(15, 15, 0, GRAY), new Block(15, 16, 0, GRAY), new Block(15, 17, 0, GRAY), new Block(15, 18, 0, GRAY), new Block(15, 19, 0, GRAY), new Block(16, 0, 0, GRAY), new Block(16, 1, 0, GRAY), new Block(16, 2, 0, GRAY), new Block(16, 3, 0, GRAY), new Block(16, 4, 0, GRAY), new Block(16, 5, 0, GRAY), new Block(16, 6, 0, GRAY), new Block(16, 7, 0, GRAY), new Block(16, 8, 0, GRAY), new Block(16, 9, 0, GRAY), new Block(16, 10, 0, GRAY), new Block(16, 11, 0, GRAY), new Block(16, 12, 0, GRAY), new Block(16, 13, 0, GRAY), new Block(16, 14, 0, GRAY), new Block(16, 15, 0, GRAY), new Block(16, 16, 0, GRAY), new Block(16, 17, 0, GRAY), new Block(16, 18, 0, GRAY), new Block(16, 19, 0, GRAY), new Block(17, 0, 0, GRAY), new Block(17, 1, 0, GRAY), new Block(17, 2, 0, GRAY), new Block(17, 3, 0, GRAY), new Block(17, 4, 0, GRAY), new Block(17, 5, 0, GRAY), new Block(17, 6, 0, GRAY), new Block(17, 7, 0, GRAY), new Block(17, 8, 0, GRAY), new Block(17, 9, 0, GRAY), new Block(17, 10, 0, GRAY), new Block(17, 11, 0, GRAY), new Block(17, 12, 0, GRAY), new Block(17, 13, 0, GRAY), new Block(17, 14, 0, GRAY), new Block(17, 15, 0, GRAY), new Block(17, 16, 0, GRAY), new Block(17, 17, 0, GRAY), new Block(17, 18, 0, GRAY), new Block(17, 19, 0, GRAY), new Block(18, 0, 0, GRAY), new Block(18, 1, 0, GRAY), new Block(18, 2, 0, GRAY), new Block(18, 3, 0, GRAY), new Block(18, 4, 0, GRAY), new Block(18, 5, 0, GRAY), new Block(18, 6, 0, GRAY), new Block(18, 7, 0, GRAY), new Block(18, 8, 0, GRAY), new Block(18, 9, 0, GRAY), new Block(18, 10, 0, GRAY), new Block(18, 11, 0, GRAY), new Block(18, 12, 0, GRAY), new Block(18, 13, 0, GRAY), new Block(18, 14, 0, GRAY), new Block(18, 15, 0, GRAY), new Block(18, 16, 0, GRAY), new Block(18, 17, 0, GRAY), new Block(18, 18, 0, GRAY), new Block(18, 19, 0, GRAY), new Block(19, 0, 0, GRAY), new Block(19, 1, 0, GRAY), new Block(19, 2, 0, GRAY), new Block(19, 3, 0, GRAY), new Block(19, 4, 0, GRAY), new Block(19, 5, 0, GRAY), new Block(19, 6, 0, GRAY), new Block(19, 7, 0, GRAY), new Block(19, 8, 0, GRAY), new Block(19, 9, 0, GRAY), new Block(19, 10, 0, GRAY), new Block(19, 11, 0, GRAY), new Block(19, 12, 0, GRAY), new Block(19, 13, 0, GRAY), new Block(19, 14, 0, GRAY), new Block(19, 15, 0, GRAY), new Block(19, 16, 0, GRAY), new Block(19, 17, 0, GRAY), new Block(19, 18, 0, GRAY), new Block(19, 19, 0, GRAY), new Block(0, 0, 1, BLUE), new Block(0, 1, 1, BLUE), new Block(0, 2, 1, BLUE), new Block(0, 3, 1, BLUE), new Block(0, 4, 1, BLUE), new Block(0, 5, 1, BLUE), new Block(0, 6, 1, BLUE), new Block(0, 7, 1, BLUE), new Block(0, 8, 1, BLUE), new Block(0, 9, 1, BLUE), new Block(0, 10, 1, BLUE), new Block(0, 11, 1, BLUE), new Block(0, 12, 1, BLUE), new Block(0, 13, 1, BLUE), new Block(0, 14, 1, BLUE), new Block(0, 15, 1, BLUE), new Block(0, 16, 1, BLUE), new Block(0, 17, 1, BLUE), new Block(0, 18, 1, BLUE), new Block(0, 19, 1, BLUE), new Block(0, 0, 2, BLUE), new Block(0, 1, 2, BLUE), new Block(0, 2, 2, BLUE), new Block(0, 3, 2, BLUE), new Block(0, 4, 2, BLUE), new Block(0, 5, 2, BLUE), new Block(0, 6, 2, BLUE), new Block(0, 7, 2, BLUE), new Block(0, 8, 2, BLUE), new Block(0, 9, 2, BLUE), new Block(0, 10, 2, BLUE), new Block(0, 11, 2, BLUE), new Block(0, 12, 2, BLUE), new Block(0, 13, 2, BLUE), new Block(0, 14, 2, BLUE), new Block(0, 15, 2, BLUE), new Block(0, 16, 2, BLUE), new Block(0, 17, 2, BLUE), new Block(0, 18, 2, BLUE), new Block(0, 19, 2, BLUE), new Block(0, 0, 3, BLUE), new Block(0, 1, 3, BLUE), new Block(0, 2, 3, BLUE), new Block(0, 3, 3, BLUE), new Block(0, 4, 3, BLUE), new Block(0, 5, 3, BLUE), new Block(0, 6, 3, BLUE), new Block(0, 7, 3, BLUE), new Block(0, 8, 3, BLUE), new Block(0, 9, 3, BLUE), new Block(0, 10, 3, BLUE), new Block(0, 11, 3, BLUE), new Block(0, 12, 3, BLUE), new Block(0, 13, 3, BLUE), new Block(0, 14, 3, BLUE), new Block(0, 15, 3, BLUE), new Block(0, 16, 3, BLUE), new Block(0, 17, 3, BLUE), new Block(0, 18, 3, BLUE), new Block(0, 19, 3, BLUE), new Block(0, 0, 4, BLUE), new Block(0, 1, 4, BLUE), new Block(0, 2, 4, BLUE), new Block(0, 3, 4, BLUE), new Block(0, 4, 4, BLUE), new Block(0, 5, 4, BLUE), new Block(0, 6, 4, BLUE), new Block(0, 7, 4, BLUE), new Block(0, 8, 4, BLUE), new Block(0, 9, 4, BLUE), new Block(0, 10, 4, BLUE), new Block(0, 11, 4, BLUE), new Block(0, 12, 4, BLUE), new Block(0, 13, 4, BLUE), new Block(0, 14, 4, BLUE), new Block(0, 15, 4, BLUE), new Block(0, 16, 4, BLUE), new Block(0, 17, 4, BLUE), new Block(0, 18, 4, BLUE), new Block(0, 19, 4, BLUE), new Block(0, 0, 5, BLUE), new Block(0, 1, 5, BLUE), new Block(0, 2, 5, BLUE), new Block(0, 3, 5, BLUE), new Block(0, 4, 5, BLUE), new Block(0, 5, 5, BLUE), new Block(0, 6, 5, BLUE), new Block(0, 7, 5, BLUE), new Block(0, 8, 5, BLUE), new Block(0, 9, 5, BLUE), new Block(0, 10, 5, BLUE), new Block(0, 11, 5, BLUE), new Block(0, 12, 5, BLUE), new Block(0, 13, 5, BLUE), new Block(0, 14, 5, BLUE), new Block(0, 15, 5, BLUE), new Block(0, 16, 5, BLUE), new Block(0, 17, 5, BLUE), new Block(0, 18, 5, BLUE), new Block(0, 19, 5, BLUE), new Block(0, 0, 6, BLUE), new Block(0, 1, 6, BLUE), new Block(0, 2, 6, BLUE), new Block(0, 3, 6, BLUE), new Block(0, 4, 6, BLUE), new Block(0, 5, 6, BLUE), new Block(0, 6, 6, BLUE), new Block(0, 7, 6, BLUE), new Block(0, 8, 6, BLUE), new Block(0, 9, 6, BLUE), new Block(0, 10, 6, BLUE), new Block(0, 11, 6, BLUE), new Block(0, 12, 6, BLUE), new Block(0, 13, 6, BLUE), new Block(0, 14, 6, BLUE), new Block(0, 15, 6, BLUE), new Block(0, 16, 6, BLUE), new Block(0, 17, 6, BLUE), new Block(0, 18, 6, BLUE), new Block(0, 19, 6, BLUE), new Block(0, 0, 7, BLUE), new Block(0, 1, 7, BLUE), new Block(0, 2, 7, BLUE), new Block(0, 3, 7, BLUE), new Block(0, 4, 7, BLUE), new Block(0, 5, 7, BLUE), new Block(0, 6, 7, BLUE), new Block(0, 7, 7, BLUE), new Block(0, 8, 7, BLUE), new Block(0, 9, 7, BLUE), new Block(0, 10, 7, BLUE), new Block(0, 11, 7, BLUE), new Block(0, 12, 7, BLUE), new Block(0, 13, 7, BLUE), new Block(0, 14, 7, BLUE), new Block(0, 15, 7, BLUE), new Block(0, 16, 7, BLUE), new Block(0, 17, 7, BLUE), new Block(0, 18, 7, BLUE), new Block(0, 19, 7, BLUE), new Block(0, 0, 8, BLUE), new Block(0, 1, 8, BLUE), new Block(0, 2, 8, BLUE), new Block(0, 3, 8, BLUE), new Block(0, 4, 8, BLUE), new Block(0, 5, 8, BLUE), new Block(0, 6, 8, BLUE), new Block(0, 7, 8, BLUE), new Block(0, 8, 8, BLUE), new Block(0, 9, 8, BLUE), new Block(0, 10, 8, BLUE), new Block(0, 11, 8, BLUE), new Block(0, 12, 8, BLUE), new Block(0, 13, 8, BLUE), new Block(0, 14, 8, BLUE), new Block(0, 15, 8, BLUE), new Block(0, 16, 8, BLUE), new Block(0, 17, 8, BLUE), new Block(0, 18, 8, BLUE), new Block(0, 19, 8, BLUE), new Block(0, 0, 9, BLUE), new Block(0, 1, 9, BLUE), new Block(0, 2, 9, BLUE), new Block(0, 3, 9, BLUE), new Block(0, 4, 9, BLUE), new Block(0, 5, 9, BLUE), new Block(0, 6, 9, BLUE), new Block(0, 7, 9, BLUE), new Block(0, 8, 9, BLUE), new Block(0, 9, 9, BLUE), new Block(0, 10, 9, BLUE), new Block(0, 11, 9, BLUE), new Block(0, 12, 9, BLUE), new Block(0, 13, 9, BLUE), new Block(0, 14, 9, BLUE), new Block(0, 15, 9, BLUE), new Block(0, 16, 9, BLUE), new Block(0, 17, 9, BLUE), new Block(0, 18, 9, BLUE), new Block(0, 19, 9, BLUE), new Block(1, 0, 1, BLUE), new Block(2, 0, 1, BLUE), new Block(3, 0, 1, BLUE), new Block(4, 0, 1, BLUE), new Block(5, 0, 1, BLUE), new Block(6, 0, 1, BLUE), new Block(7, 0, 1, BLUE), new Block(8, 0, 1, BLUE), new Block(9, 0, 1, BLUE), new Block(10, 0, 1, BLUE), new Block(11, 0, 1, BLUE), new Block(12, 0, 1, BLUE), new Block(13, 0, 1, BLUE), new Block(14, 0, 1, BLUE), new Block(15, 0, 1, BLUE), new Block(16, 0, 1, BLUE), new Block(17, 0, 1, BLUE), new Block(18, 0, 1, BLUE), new Block(19, 0, 1, BLUE), new Block(1, 0, 2, BLUE), new Block(2, 0, 2, BLUE), new Block(3, 0, 2, BLUE), new Block(4, 0, 2, BLUE), new Block(5, 0, 2, BLUE), new Block(6, 0, 2, BLUE), new Block(7, 0, 2, BLUE), new Block(8, 0, 2, BLUE), new Block(9, 0, 2, BLUE), new Block(10, 0, 2, BLUE), new Block(11, 0, 2, BLUE), new Block(12, 0, 2, BLUE), new Block(13, 0, 2, BLUE), new Block(14, 0, 2, BLUE), new Block(15, 0, 2, BLUE), new Block(16, 0, 2, BLUE), new Block(17, 0, 2, BLUE), new Block(18, 0, 2, BLUE), new Block(19, 0, 2, BLUE), new Block(1, 0, 3, BLUE), new Block(2, 0, 3, BLUE), new Block(3, 0, 3, BLUE), new Block(4, 0, 3, BLUE), new Block(5, 0, 3, BLUE), new Block(6, 0, 3, BLUE), new Block(7, 0, 3, BLUE), new Block(8, 0, 3, BLUE), new Block(9, 0, 3, BLUE), new Block(10, 0, 3, BLUE), new Block(11, 0, 3, BLUE), new Block(12, 0, 3, BLUE), new Block(13, 0, 3, BLUE), new Block(14, 0, 3, BLUE), new Block(15, 0, 3, BLUE), new Block(16, 0, 3, BLUE), new Block(17, 0, 3, BLUE), new Block(18, 0, 3, BLUE), new Block(19, 0, 3, BLUE), new Block(1, 0, 4, BLUE), new Block(2, 0, 4, BLUE), new Block(3, 0, 4, BLUE), new Block(4, 0, 4, BLUE), new Block(5, 0, 4, BLUE), new Block(6, 0, 4, BLUE), new Block(7, 0, 4, BLUE), new Block(8, 0, 4, BLUE), new Block(9, 0, 4, BLUE), new Block(10, 0, 4, BLUE), new Block(11, 0, 4, BLUE), new Block(12, 0, 4, BLUE), new Block(13, 0, 4, BLUE), new Block(14, 0, 4, BLUE), new Block(15, 0, 4, BLUE), new Block(16, 0, 4, BLUE), new Block(17, 0, 4, BLUE), new Block(18, 0, 4, BLUE), new Block(19, 0, 4, BLUE), new Block(1, 0, 5, BLUE), new Block(2, 0, 5, BLUE), new Block(3, 0, 5, BLUE), new Block(4, 0, 5, BLUE), new Block(5, 0, 5, BLUE), new Block(6, 0, 5, BLUE), new Block(7, 0, 5, BLUE), new Block(8, 0, 5, BLUE), new Block(9, 0, 5, BLUE), new Block(10, 0, 5, BLUE), new Block(11, 0, 5, BLUE), new Block(12, 0, 5, BLUE), new Block(13, 0, 5, BLUE), new Block(14, 0, 5, BLUE), new Block(15, 0, 5, BLUE), new Block(16, 0, 5, BLUE), new Block(17, 0, 5, BLUE), new Block(18, 0, 5, BLUE), new Block(19, 0, 5, BLUE), new Block(1, 0, 6, BLUE), new Block(2, 0, 6, BLUE), new Block(3, 0, 6, BLUE), new Block(4, 0, 6, BLUE), new Block(5, 0, 6, BLUE), new Block(6, 0, 6, BLUE), new Block(7, 0, 6, BLUE), new Block(8, 0, 6, BLUE), new Block(9, 0, 6, BLUE), new Block(10, 0, 6, BLUE), new Block(11, 0, 6, BLUE), new Block(12, 0, 6, BLUE), new Block(13, 0, 6, BLUE), new Block(14, 0, 6, BLUE), new Block(15, 0, 6, BLUE), new Block(16, 0, 6, BLUE), new Block(17, 0, 6, BLUE), new Block(18, 0, 6, BLUE), new Block(19, 0, 6, BLUE), new Block(1, 0, 7, BLUE), new Block(2, 0, 7, BLUE), new Block(3, 0, 7, BLUE), new Block(4, 0, 7, BLUE), new Block(5, 0, 7, BLUE), new Block(6, 0, 7, BLUE), new Block(7, 0, 7, BLUE), new Block(8, 0, 7, BLUE), new Block(9, 0, 7, BLUE), new Block(10, 0, 7, BLUE), new Block(11, 0, 7, BLUE), new Block(12, 0, 7, BLUE), new Block(13, 0, 7, BLUE), new Block(14, 0, 7, BLUE), new Block(15, 0, 7, BLUE), new Block(16, 0, 7, BLUE), new Block(17, 0, 7, BLUE), new Block(18, 0, 7, BLUE), new Block(19, 0, 7, BLUE), new Block(1, 0, 8, BLUE), new Block(2, 0, 8, BLUE), new Block(3, 0, 8, BLUE), new Block(4, 0, 8, BLUE), new Block(5, 0, 8, BLUE), new Block(6, 0, 8, BLUE), new Block(7, 0, 8, BLUE), new Block(8, 0, 8, BLUE), new Block(9, 0, 8, BLUE), new Block(10, 0, 8, BLUE), new Block(11, 0, 8, BLUE), new Block(12, 0, 8, BLUE), new Block(13, 0, 8, BLUE), new Block(14, 0, 8, BLUE), new Block(15, 0, 8, BLUE), new Block(16, 0, 8, BLUE), new Block(17, 0, 8, BLUE), new Block(18, 0, 8, BLUE), new Block(19, 0, 8, BLUE), new Block(1, 0, 9, BLUE), new Block(2, 0, 9, BLUE), new Block(3, 0, 9, BLUE), new Block(4, 0, 9, BLUE), new Block(5, 0, 9, BLUE), new Block(6, 0, 9, BLUE), new Block(7, 0, 9, BLUE), new Block(8, 0, 9, BLUE), new Block(9, 0, 9, BLUE), new Block(10, 0, 9, BLUE), new Block(11, 0, 9, BLUE), new Block(12, 0, 9, BLUE), new Block(13, 0, 9, BLUE), new Block(14, 0, 9, BLUE), new Block(15, 0, 9, BLUE), new Block(16, 0, 9, BLUE), new Block(17, 0, 9, BLUE), new Block(18, 0, 9, BLUE), new Block(19, 0, 9, BLUE)];

/* Main logic */
(async () => {
    sortBlocksByRenderingPosition();
    drawBlocks();
})();

/* Sort blocks to be in correct rendering order */
function sortBlocksByRenderingPosition() {
    BLOCKS.sort((a, b) => a.rendering_position - b.rendering_position);
}

/* Render each block in the list */
function drawBlocks() {
    for (let index = 0; index < BLOCKS.length; index++) {
        app.stage.addChild(BLOCKS[index]);
    }
}