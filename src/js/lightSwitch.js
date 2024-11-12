import Interactable from "./interactable.js";

class LightSwitch extends Interactable {
    constructor(x, y, z, texture, allBlocks, LightFilter=0xffffff, intensity=0.5) {
        super(x, y, z, texture, 'Light Switch');
        this.lightFilter = LightFilter;
        this.intensity = intensity;
        this.allBlocks = allBlocks;
        this.on = False
    }

    addInteractivity() {
        // super.addInteractivity();

        this.addEventListener('click', () => {
            console.log('click');
            if (this.hasAdjacentPlayer()) {
                this.toggleLight(this.allBlocks);
            }
        });
    }

    toggleLight(allBlocks) {
        for (const block of allBlocks) {
            let newFilter;
            let newIntensity;
            if (this.on) {
                newFilter = this.lightFilter;
                newIntensity = this.intensity;
            } else {
                newFilter = this.lightFilter;
                newIntensity = this.intensity;
            }
            block.updateOverlay(newFilter, newIntensity);
        }
    }
}

export default LightSwitch;

