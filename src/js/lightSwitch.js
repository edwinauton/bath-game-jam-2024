import Interactable from "./interactable.js";

/**
 *  @param {Number} x                   grid x-coordinate for the light switch
 *  @param {Number} y                   grid y-coordinate for the light switch
 *  @param {Number} z                   grid z-coordinate for the light switch
 *  @param {Texture} texture            texture asset to be rendered for the light switch
 *  @param {GlobalLightSource} light    light controlled by the light switch
 *  */
class LightSwitch extends Interactable {
    light;

    constructor(x, y, z, texture, light) {
        super(x, y, z, texture, 'Light Switch');

        this.light = light;
        this.toggle();
    }

    /* Toggle global light */
    toggle() {
        this.addEventListener('click', () => {
            if (this.hasAdjacentPlayer()) {
                this.light.isOn = !this.light.isOn;
                this.light.applyLight()
            }
        });
    }
}

export default LightSwitch;