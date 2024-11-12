import Interactable from "./interactable.js";
import GlobalLightSource from "./globalLightSource.js";

class LightSwitch extends Interactable {
    constructor(x, y, z, texture, tint=0xffffff, alpha=0.5, on=false) {
        super(x, y, z, texture, 'Light Switch');
        this.lightSource = new GlobalLightSource(texture, tint, alpha, on);    
    }

    addInteractivity() {
        // super.addInteractivity();

        this.addEventListener('click', () => {
            console.log('click');
            if (this.hasAdjacentPlayer()) {
                this.toggleLight();
            }
        });
    }

    toggleLight() {
        this.lightSource.setOnState(!this.lightSource.getOnState());
        console.log('Light Switch toggled to ' + this.lightSource.getOnState());
        this.applyLight();
    }

    applyLight() {
        this.lightSource.applyLight();
    }
}
export default LightSwitch;

