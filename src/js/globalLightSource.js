import GameJamSprite from './gameJamSprite.js';
import {app} from "./main.js";
import LightSource from "./lightSource.js";

class GlobalLightSource extends LightSource {
    constructor(texture, tint=0xffffff, alpha=0.5, on=false) {
        super({gridX: 0, gridY: 0, gridZ: 0}, texture, 0, tint, alpha, on);   
    }

    applyLight() {
        let alpha = 0;
        if (this.onState) {
            alpha = this.alpha
        }
        const sprites = app.stage.children.filter(child => child instanceof GameJamSprite);
        this.updateTints(sprites, this.tint, alpha);
    }
}   

export default GlobalLightSource;