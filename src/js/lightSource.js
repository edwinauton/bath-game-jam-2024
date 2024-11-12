import GameJamSprite from './gameJamSprite.js';
import {app} from "./main.js";

/**
 *  @param {Number} target          target for light source to follow
 *  @param {Number} radius          radius of light source
 *  @param {Number} tint            tint colour of light source
 *  */
class LightSource extends PIXI.Sprite {
    radius;
    target;

    constructor(target, radius, tint) {
        super(target.texture);

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

    /* Move light source and recalculate lighting */
    updateLighting() {
        this.x = this.target.x;
        this.y = this.target.y;
        this.applyLight();
    }
}

export default LightSource;