import GameJamSprite from './gameJamSprite.js';
import {app} from "./main.js";

/**
 *  @param {Number} x               grid x-coordinate for the block
 *  @param {Number} y               grid y-coordinate for the block
 *  @param {Number} z               grid z-coordinate for the block
 *  @param {Texture} texture        texture asset to be rendered for the block
 *  */
class LightSource extends GameJamSprite {

    constructor(x, y, z, texture) {
        super(x, y, z, texture);
        this.alpha = 0;

        this.applyLight();
    }

    /* Update block tints to illuminate blocks */
    applyLight() {
        let pos = {x: this.x, y: this.y + this.height / 2};
        const blocks = this.getBlocksInEllipse(pos, 100);
        console.log(`Number of blocks retrieved: ${blocks.length}`);
        this.updateBlockTints(blocks, 0xffffff, 0.5);
    }

    /* Return if `(x,y)` is in the calculated ellipse */
    isPointInEllipse(x, y, h, k, a, b) {
        return ((Math.pow(x - h, 2) / Math.pow(a, 2)) + (Math.pow(y - k, 2) / Math.pow(b, 2))) <= 1;
    }

    /* Return list of blocks within the ellipse */
    getBlocksInEllipse(pos, radius) {
        let blocks_in_radius = [];
        const blocks = app.stage.children.filter(child => child instanceof GameJamSprite);
        for (const block of blocks) {
            if (this.isPointInEllipse(block.x, block.y, pos.x, pos.y, radius, radius * 0.5)) {
                blocks_in_radius.push(block)
                console.log(`Position: ${pos.x}, ${pos.y}`);
                console.log(`Block: ${block.x}, ${block.y}`);
            }
        }
        return blocks_in_radius
    }

    /* For each given block, update the tint */
    updateBlockTints(blocks, tint, alpha) {
        for (const block of blocks) {
            block.updateOverlay(tint, alpha)
        }
    }
}

export default LightSource;