import GameJamSprite from './gameJamSprite.js';

/**
 *  @param {Number} x               grid x-coordinate for the block
 *  @param {Number} y               grid y-coordinate for the block
 *  @param {Number} z               grid z-coordinate for the block
 *  @param {Texture} texture        texture asset to be rendered for the block
 *  */
class LightSource extends GameJamSprite {
    staticY;

    constructor(x, y, z, texture) {
        super(x, y, z, texture);
        this.staticY = this.y;
        this.alpha = 0.5;
    }

    updateLocation(x, y) { 
        this.x = x;
        this.y = y;   
    }

    applyLight(allBlocks) {
        let pos = {x: this.x, y: this.y + this.height / 2};
        const blocks = this.get_blocks_in_ellipse(allBlocks, pos, 100);
        console.log(`Number of blocks retrieved: ${blocks.length}`);
        this.set_tint_to_blocks(blocks, 0xffffff, 0.5);1000
    }

    /**
     * Checks if a point is within an ellipse.
     *
     * @param {Number} x - The x-coordinate of the point.
     * @param {Number} y - The y-coordinate of the point.
     * @param {Number} h - The x-coordinate of the ellipse's center.
     * @param {Number} k - The y-coordinate of the ellipse's center.
     * @param {Number} a - The horizontal radius of the ellipse.
     * @param {Number} b - The vertical radius of the ellipse.
     * @returns {Boolean} - Returns true if the point is within the ellipse, else false.
     */
    isPointInEllipse(x, y, h, k, a, b) {
        return ((Math.pow(x - h, 2) / Math.pow(a, 2)) +
                (Math.pow(y - k, 2) / Math.pow(b, 2))) <= 1;
    }
    
    get_blocks_in_ellipse(blocks, pos, radius) {
        let in_radius = [];
        for (const block of blocks) {
            if (this.isPointInEllipse(block.x, block.y, pos.x, pos.y, radius, radius * 0.5)) {
                in_radius.push(block)
                console.log(`Position: ${pos.x}, ${pos.y}`);
                console.log(`Block: ${block.x}, ${block.y}`);   
            }
        }
        return in_radius
    }
    
    set_tint_to_blocks(blocks, tint, alpha) {
        for (const block of blocks) {
            block.changeFilter(tint, alpha)
        }
    } 
}

export default LightSource;