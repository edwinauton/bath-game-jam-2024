import {app} from "./main.js";
import Interactable from "./interactable.js";
import LightSource from "./lightSource.js";
import Player from "./player.js";

/**
 *  @param {Number} x               grid x-coordinate for the flashlight
 *  @param {Number} y               grid y-coordinate for the flashlight
 *  @param {Number} z               grid z-coordinate for the flashlight
 *  @param {Texture} texture        texture asset to be rendered for the flashlight
 *  */
class Flashlight extends Interactable {
    constructor(x, y, z, texture) {
        super(x, y, z, texture, 'Flashlight');

        this.animate()
        this.addInteractivity();
    }

    /* Add hover and click functionality */
    addInteractivity() {
        super.addInteractivity();

        this.addEventListener('click', () => {
            if (this.hasAdjacentPlayer()) {
                createjs.Tween.get(this.label)
                    .to({alpha: 0}, 100, createjs.Ease.sineInOut) // Fade out
                    .call(() => app.stage.removeChild(this.label)); // Remove item label

                createjs.Tween.get(this.scale)
                    .to({x: 0, y: 0}, 250, createjs.Ease.sineInOut) // Fade out
                    .call(() => this.hide()); // Remove item label

                const player = app.stage.children.find(child => child instanceof Player);
                app.stage.children.forEach(child => {
                    if (child instanceof LightSource && child.target === this) {
                        child.target = player; // Set light to follow player
                    }
                })
            }
        });
    }

    /* Looping hovering animation */
    animate() {
        createjs.Tween.get(this, {loop: true}) // Loop animation
            .to({y: this.y - (this.height / 10)}, 1000, createjs.Ease.sineInOut)
            .to({y: this.y}, 1000, createjs.Ease.sineInOut);
    }
}

export default Flashlight;