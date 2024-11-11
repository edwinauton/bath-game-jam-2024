import GameJamSprite from "./gameJamSprite.js";
import {eventEmitter} from "./main.js";

/**
 *  @param {Number} x               grid x-coordinate for the block
 *  @param {Number} y               grid y-coordinate for the block
 *  @param {Number} z               grid z-coordinate for the block
 *  @param {Texture} texture        texture asset to be rendered for the block
 *  */
class Block extends GameJamSprite {
    staticY;

    constructor(x, y, z, texture) {
        super(x, y, z, texture);
        this.staticY = this.y;
    }

    /* Add hover and click animations */
    animate() {
        this.eventMode = 'static'; // Allow blocks to be animated

        this.addEventListener('pointerenter', () => {
            if (!this.hasBlockAbove) {
                createjs.Tween.get(this)
                    .to({y: this.staticY - (this.height / 10)}, 150, createjs.Ease.sineInOut);
            }
        });
        this.addEventListener('pointerleave', () => {
            createjs.Tween.get(this)
                .to({y: this.staticY}, 150, createjs.Ease.sineInOut);
        });
        this.addEventListener('click', () => {
            createjs.Tween.get(this)
                .to({y: this.staticY}, 150, createjs.Ease.sineInOut);

            if (!this.hasBlockAbove) {
                eventEmitter.emit('movePlayer', this);
            }
        });
    }

    /* Check if there is something immediately above this block */
    checkAbove(spriteMap) {
        const aboveKey = `${this.gridX},${this.gridY},${this.gridZ + 1}`; // Create the key for the above block
        this.hasBlockAbove = spriteMap.has(aboveKey); // Check if the key is in the map
    }
}

export default Block;