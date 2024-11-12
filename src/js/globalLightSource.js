import {app} from "./main.js";
import GameJamSprite from './gameJamSprite.js';
import LightSource from "./lightSource.js";

/**
 * @param {Number} radius           alpha value of the light source
 *  @param {Number} tint            tint colour of light source
 *  */
class GlobalLightSource extends LightSource {
    isOn = false;

    constructor(tint) {
        super(PIXI.Texture.EMPTY);

        this.tint = tint;

        this.applyLight();
    }

    applyLight() {
        let alpha = this.isOn ? 0.4 : 0.8; // alpha = 0.5 if this.isOn else alpha = 0.9

        const lights = app.stage.children.filter(child => child instanceof LightSource);
        const sprites = app.stage.children.filter(child => child instanceof GameJamSprite);
        sprites.forEach(sprite => {
            sprite.updateOverlay(alpha, this.tint, lights);
        });
    }
}

export default GlobalLightSource;