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
        const blocks = this.getSpritesInEllipse(pos, this.radius);
        this.updateBlockTints(blocks, 0xffffff, 0.5);
    }

    /* Return if `(x,y)` is in the calculated ellipse */
    isPointInEllipse(x, y, h, k, a, b) {
        return ((Math.pow(x - h, 2) / Math.pow(a, 2)) + (Math.pow(y - k, 2) / Math.pow(b, 2))) <= 1;
    }

    /* Return list of sprites within the ellipse */
    getSpritesInEllipse(pos) {
        let sprites_in_radius = [];
        const sprites = app.stage.children.filter(child => child instanceof GameJamSprite);
        for (const sprite of sprites) {
            if (this.isPointInEllipse(sprite.x, sprite.y, pos.x, pos.y, this.radius, 0.5 * this.radius)) {
                sprites_in_radius.push(sprite)
            }
        }
        return sprites_in_radius
    }

    /* For each given block, update the tint */
    updateBlockTints(blocks, tint, alpha) {
        for (const block of blocks) {
            block.updateOverlay(tint, alpha)
        }
    }
}

export default LightSource;