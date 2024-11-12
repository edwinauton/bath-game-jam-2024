import GameJamSprite from './gameJamSprite.js';
import {app} from "./main.js";
import LightSource from "./lightSource.js";

class GlobalLightSource extends LightSource {
    constructor(texture, tint = 0xffffff, alpha, on) {
        super(texture, 0, tint, alpha, on);
    }

    applyLight() {
        let alpha = 0;
        if (this.isOn) {
            alpha = this.alpha
        }
        const lights = app.stage.children.filter(child => child instanceof LightSource);
        const sprites = app.stage.children.filter(child => child instanceof GameJamSprite);
        sprites.forEach(sprite => {
            sprite.updateOverlay(alpha, this.tint, lights)
        })
    }
}

export default GlobalLightSource;