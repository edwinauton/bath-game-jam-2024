import GameJamSprite from './gameJamSprite.js';
import {app} from "./main.js";

/**
 *  @param {Number} x               grid x-coordinate for the block
 *  @param {Number} y               grid y-coordinate for the block
 *  @param {Number} z               grid z-coordinate for the block
 *  @param {Texture} texture        texture asset to be rendered for the block
 *  */
class LightSource extends GameJamSprite {
    radius;
    target;

    constructor(target, texture, radius, tint) {
        super(target.gridX, target.gridY, target.gridZ, texture);

        this.alpha = 0;
        this.radius = radius;
        this.target = target;
        this.tint = tint;

        this.applyLight();
    }


    /* Return if `(x,y)` is in the calculated ellipse */
    isPointInEllipse(x, y, h, k, a, b) {
        return ((Math.pow(x - h, 2) / Math.pow(a, 2)) + (Math.pow(y - k, 2) / Math.pow(b, 2))) <= 1;
    }

    /* Return list of sprites within the ellipse */
    applyLight() {
        const pos = {x: this.x, y: this.y + this.height / 2};
        const sprites = app.stage.children.filter(child => child instanceof GameJamSprite);
        for (const sprite of sprites) {
            if (this.isPointInEllipse(sprite.x, sprite.y, pos.x, pos.y, this.radius, 0.5 * this.radius)) {
                sprite.updateOverlay(this.tint, 0.5)
            }
        }
    }
}

export default LightSource;