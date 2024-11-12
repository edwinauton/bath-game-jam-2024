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

    constructor(target, texture, radius, tint=0xffffff, alpha=0.5, on=false) {
        super(target.gridX, target.gridY, target.gridZ, texture);

        this.alpha = alpha;
        this.radius = radius;
        this.target = target;
        this.tint = tint;
        this.alpha = alpha;
        this.onState = on;
    }

    /* Update block tints to illuminate blocks */
    applyLight() {
        let alpha = 0;
        if (this.onState) {
            alpha = this.alpha
        } else {
            alpha = 0;
        }
        const sprites = this.getSpritesInEllipse();
        this.updateTints(sprites, this.tint, alpha);
    }

    setOnState(newState) {
        this.onState = newState;
    }

    getOnState() {
        return this.onState;
    }

    /* Return if `(x,y)` is in the calculated ellipse */
    isPointInEllipse(x, y, h, k, a, b) {
        return ((Math.pow(x - h, 2) / Math.pow(a, 2)) + (Math.pow(y - k, 2) / Math.pow(b, 2))) <= 1;
    }

    /* Return list of sprites within the ellipse */
    getSpritesInEllipse() {
        const sprites_in_radius = [];
        const pos = {x: this.x, y: this.y + this.height / 2};
        const sprites = app.stage.children.filter(child => child instanceof GameJamSprite);
        for (const sprite of sprites) {
            if (this.isPointInEllipse(sprite.x, sprite.y, pos.x, pos.y, this.radius, 0.5 * this.radius)) {
                sprites_in_radius.push(sprite);
            }
        }
        return sprites_in_radius;
    }

    /* For each given sprite, update the tint */
    updateTints(sprites, tint, alpha) {
        for (const sprite of sprites) {
            sprite.updateOverlay(tint, alpha);
        }
    }
}

export default LightSource;