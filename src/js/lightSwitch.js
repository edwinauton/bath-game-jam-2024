import Interactable from "./interactable.js";
import GlobalLightSource from "./globalLightSource.js";
import {app} from "./main.js";

class LightSwitch extends Interactable {
    lightSource;

    constructor(x, y, z, texture, tint = 0xffffff, alpha = 0.5, on = false) {
        super(x, y, z, texture, 'Light Switch');
        this.lightSource = new GlobalLightSource(texture, tint, alpha, on);
        app.stage.addChild(this)
        this.addEventListener('click', () => {
            console.log('click');
            if (this.hasAdjacentPlayer()) {
                this.toggleLight();
            }
        });
    }

    toggleLight() {
        this.lightSource.isOn = !this.lightSource.isOn;
        console.log('Light Switch toggled to ' + this.lightSource.isOn);
        this.applyLight();
    }

    applyLight() {
        this.lightSource.applyLight();
    }
}

export default LightSwitch;