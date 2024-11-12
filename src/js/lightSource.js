import GameJamSprite from './gameJamSprite.js';
import {app} from "./main.js";

/**
 *  @param {Number} x               grid x-coordinate for the block
 *  @param {Number} y               grid y-coordinate for the block
 *  @param {Number} z               grid z-coordinate for the block
 *  @param {Texture} texture        texture asset to be rendered for the block
 *  */
class LightSource extends PIXI.Sprite {
    radius;
    target;

    constructor(target, texture, radius, tint) {
        super(texture);

        this.alpha = 0;
        this.target = target;
        this.radius = radius;
        this.tint = tint;

        this.updateLighting();
        app.stage.addChild(this);
    }


    /* Return if `(x,y)` is in the calculated ellipse */
    isPointInEllipse(x, y, h, k, a, b) {
        return ((Math.pow(x - h, 2) / Math.pow(a, 2)) + (Math.pow(y - k, 2) / Math.pow(b, 2))) <= 1;
    }

    /* Apply light to all blocks within an ellipse */
    applyLight() {
        const pos = {x: this.x, y: this.y + this.height / 2};
        const lights = app.stage.children.filter(child => child instanceof LightSource);
        app.stage.children.forEach(child => {
            if (child instanceof GameJamSprite) {
                if (this.isPointInEllipse(child.x, child.y, pos.x, pos.y, this.radius, 0.5 * this.radius)) {
                    child.updateOverlay(0.5, this.tint, lights);
                }
            }
        })
    }

    updateLighting() {
        this.x = this.target.x;
        this.y = this.target.y;
        this.applyLight();
    }
}

export default LightSource;