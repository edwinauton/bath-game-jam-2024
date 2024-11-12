import {app, tick} from "./main.js";
import Player from "./player.js";
import GameJamSprite from "./gameJamSprite.js";
import LightSource from "./lightSource.js";

/**
 *  @param {Number} x               grid x-coordinate for the interactable
 *  @param {Number} y               grid y-coordinate for the interactable
 *  @param {Number} z               grid z-coordinate for the interactable
 *  @param {Texture} texture        texture asset to be rendered for the interactable
 *  @param {String} label           label to be displayed above the interactable when hovered over
 *  */
class Interactable extends GameJamSprite {
    label;

    constructor(x, y, z, texture, label) {
        super(x, y, z, texture);

        this.label = label;

        this.animate();
        this.addInteractivity();
    }

    /* Looping hovering animation */
    animate() {
        this.eventMode = 'static'; // Allow animation

        createjs.Tween.get(this, {loop: true}) // Loop animation
            .to({y: this.y - (this.height / 10)}, 1000, createjs.Ease.sineInOut)
            .to({y: this.y}, 1000, createjs.Ease.sineInOut);
    }

    /* Add hover and click functionality */
    addInteractivity() {
        const label = this.createLabel();

        this.addEventListener('pointerenter', () => {
            app.stage.addChild(label);
            createjs.Tween.get(label)
                .to({alpha: 1}, 100, createjs.Ease.sineInOut); // Fade in
        });

        this.addEventListener('pointerleave', () => {
            createjs.Tween.get(label)
                .to({alpha: 0}, 100, createjs.Ease.sineInOut) // Fade out
                .call(() => app.stage.removeChild(label)); // Remove item label
        });

        this.addEventListener('click', () => {
            if (this.hasAdjacentPlayer()) {
                createjs.Tween.get(label)
                    .to({alpha: 0}, 100, createjs.Ease.sineInOut) // Fade out
                    .call(() => app.stage.removeChild(label)); // Remove item label

                createjs.Tween.get(this.scale)
                    .to({x: 0, y: 0}, 250, createjs.Ease.sineInOut) // Fade out
                    .call(() => this.hide()); // Remove item label

                const player = app.stage.children.filter(child => child instanceof Player)[0];
                app.stage.children.forEach(child => {
                    if (child instanceof LightSource) {
                        if (child.target === this) {
                            child.target = player; // Set light to follow player
                        }
                    }
                })

                tick();
            }
        });
    }

    /* Check for a player in any adjacent tile */
    hasAdjacentPlayer() {
        const player = app.stage.children.filter(child => child instanceof Player)[0];
        const playerMap = new Map();
        const key = `${player.gridX},${player.gridY},${player.gridZ}`;  // Create key for current location
        playerMap.set(key, player); // Create map of key (x,y,z) -> value (Player)

        // Create keys for each of the adjacent tiles
        const key1 = `${this.gridX + 1},${this.gridY},${this.gridZ}`;
        const key2 = `${this.gridX - 1},${this.gridY},${this.gridZ}`;
        const key3 = `${this.gridX},${this.gridY + 1},${this.gridZ}`;
        const key4 = `${this.gridX},${this.gridY - 1},${this.gridZ}`;
        return (playerMap.has(key1) || playerMap.has(key2) || playerMap.has(key3) || playerMap.has(key4));
    }

    createLabel() {
        const rectangle = new PIXI.Graphics();
        const text = new PIXI.Text({
            text: this.label, style: {
                fontFamily: "Courier New", fontSize: 16, fill: 0xFFFFFF
            }
        });

        const padding = 7;
        const width = text.width + 2 * padding;
        const height = text.height + 2 * padding;

        text.anchor.set(0.5);
        text.x = width / 2;
        text.y = height / 2;

        rectangle.x = this.x - width / 2;
        rectangle.y = this.y - 45;
        rectangle.roundRect(0, 0, width, height, 7).fill('0x000000A8');
        rectangle.alpha = 0; // Start hidden
        rectangle.zIndex = Infinity; // Always on top
        rectangle.addChild(text);

        return rectangle;
    }
}

export default Interactable;