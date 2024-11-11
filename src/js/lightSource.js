import GameJamSprite from './gameJamSprite.js';
import {app} from "./main.js";

/**
 *  @param {Number} x               grid x-coordinate for the block
 *  @param {Number} y               grid y-coordinate for the block
 *  @param {Number} z               grid z-coordinate for the block
 *  @param {Texture} texture        texture asset to be rendered for the block
 *  */
class LightSource extends GameJamSprite {
    radius
    target

    constructor(target, texture, radius) {
        super(target.gridX, target.gridY, target.gridZ, texture);
        this.alpha = 0;
        this.radius = radius
        this.target = target;

        this.applyLight(radius);
    }

    /* Update block tints to illuminate blocks */
    applyLight() {
        let pos = {x: this.x, y: this.y + this.height / 2};
        const blocks = this.getBlocksInEllipse(pos, this.radius);
        this.updateBlockTints(blocks, 0xffffff, 0.5);
    }

    /* Return if `(x,y)` is in the calculated ellipse */
    isPointInEllipse(x, y, h, k, a, b) {
        return ((Math.pow(x - h, 2) / Math.pow(a, 2)) + (Math.pow(y - k, 2) / Math.pow(b, 2))) <= 1;
    }

    /* Return list of blocks within the ellipse */
    getBlocksInEllipse(pos) {
        let blocks_in_radius = [];
        const blocks = app.stage.children.filter(child => child instanceof GameJamSprite);
        for (const block of blocks) {
            if (this.isPointInEllipse(block.x, block.y, pos.x, pos.y, this.radius, 0.5 * this.radius)) {
                blocks_in_radius.push(block)
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