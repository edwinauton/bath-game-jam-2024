import {eventEmitter, tick} from './main.js';
import GameJamSprite from "./gameJamSprite.js";

/**
 *  @param {Number} x               grid x-coordinate spawn for the player
 *  @param {Number} y               grid y-coordinate spawn for the player
 *  @param {Number} z               grid z-coordinate spawn for the player
 *  @param {Texture} texture        texture asset to be rendered for the player
 *  */
export class Player extends GameJamSprite {
    constructor(x, y, z, texture) {
        super(x, y, z, texture);

        eventEmitter.on('movePlayer', this.moveTo.bind(this));  // Run 'moveTo' when 'movePlayer' event triggers
    }

    /* Moves the player from their current position to a new block in calculated steps */
    moveTo(block) { // TODO: Check for z-levels and collisions
        if (!block.hasBlockAbove && block.gridZ === this.gridZ - 1) { // Only run for accessible blocks on this level
            createjs.Tween.removeTweens(this); // Stops ongoing Tweens for the player

            const animateStep = () => {
                let moved = false;

                if (this.gridX !== block.gridX) {
                    this.gridX += (this.gridX < block.gridX) ? 1 : -1; // 1 if true, -1 if false
                    moved = true;
                } else if (this.gridY !== block.gridY) {
                    this.gridY += (this.gridY < block.gridY) ? 1 : -1; // 1 if true, -1 if false
                    moved = true;
                }

                if (moved) {  // Check if anything has been changed
                    this.updateRenderingOrder();

                    const absolute = this.gridToAbsolute(this.gridX, this.gridY);
                    createjs.Tween.get(this)
                        .to({x: absolute.x, y: absolute.y}, 150, createjs.Ease.sineInOut)
                        .call(animateStep);  // Continue loop

                    tick(); // Update all rendering orders and blocks
                }
            }
            animateStep(); // Start loop
        }
    }
}

export default Player;