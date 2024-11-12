import {app} from "./main.js";
import GameJamSprite from "./gameJamSprite.js";
import Player from "./player.js";

/**
 *  @param {Number} x               grid x-coordinate for the interactable
 *  @param {Number} y               grid y-coordinate for the interactable
 *  @param {Number} z               grid z-coordinate for the interactable
 *  @param {Texture} texture        texture asset to be rendered for the interactable
 *  @param {String} label           label to be displayed above the interactable when hovered over
 *  */
class Interactable extends GameJamSprite {
    description;
    label;

    constructor(x, y, z, texture, description) {
        super(x, y, z, texture);

        this.description = description;
        this.createLabel();
        this.addInteractivity();
    }

    /* Actions when the interactable is interacted with */
    addInteractivity() {
        this.eventMode = 'static'; // Allow animation

        this.addEventListener('pointerenter', () => {
            app.stage.addChild(this.label);
            createjs.Tween.get(this.label)
                .to({alpha: 1}, 100, createjs.Ease.sineInOut); // Fade in
        });

        this.addEventListener('pointerleave', () => {
            createjs.Tween.get(this.label)
                .to({alpha: 0}, 100, createjs.Ease.sineInOut) // Fade out
                .call(() => app.stage.removeChild(this.label)); // Remove item label
        });
    }

    /* Check for a player in any adjacent tile */
    hasAdjacentPlayer() {
        const player = app.stage.children.find(child => child instanceof Player);
        const playerKey = `${player.gridX},${player.gridY},${player.gridZ}`;  // Create key for current location
        const adjacentKeys = [  // Create keys for each of the adjacent blocks
            `${this.gridX + 1},${this.gridY},${this.gridZ}`,
            `${this.gridX - 1},${this.gridY},${this.gridZ}`,
            `${this.gridX},${this.gridY + 1},${this.gridZ}`,
            `${this.gridX},${this.gridY - 1},${this.gridZ}`
        ];
        return adjacentKeys.includes(playerKey);
    }

    /* Return text label in a rectangle container */
    createLabel() {
        const container = new PIXI.Graphics();
        const labelStyle = new PIXI.TextStyle({
            fontFamily: "Courier New", fontSize: 16, fill: 0xFFFFFF
        })
        const text = new PIXI.Text(this.description, labelStyle)

        const padding = 7;
        const width = text.width + 2 * padding;
        const height = text.height + 2 * padding;

        text.anchor.set(0.5);
        text.position.set(width / 2, height / 2);

        container.roundRect(0, 0, width, height, 7).fill('0x000000A8');
        container.position.set(this.x - width / 2, this.y - 45)
        container.alpha = 0; // Start hidden
        container.zIndex = Infinity; // Always on top
        container.addChild(text);

        this.label = container;
    }
}

export default Interactable;