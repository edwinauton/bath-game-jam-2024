import {app} from "./main.js";

/**
 *  @param {Number} x               grid x-coordinate for the sprite
 *  @param {Number} y               grid y-coordinate for the sprite
 *  @param {Number} z               grid z-coordinate for the sprite
 *  @param {Texture} texture        texture asset to be rendered for the sprite
 *  */
class GameJamSprite extends PIXI.Sprite {
    gridX;
    gridY;
    gridZ;

    constructor(x, y, z, texture) {
        super({texture: texture});
        this.anchor.set(0.5);
        this.gridToAbsolute(x, y, z);

        this.gridX = x;
        this.gridY = y;
        this.gridZ = z;
        this.updateRenderingOrder();
    }

    /* Convert from grid coordinates to pixel coordinates and set `this.x` and `this.y` to the pixel coordinates */
    gridToAbsolute(x, y, z = 1) {
        const xCentre = app.screen.width / 2;  // Centre horizontally on-screen
        this.x = (0.50 * x * this.width) - (0.50 * y * this.height) + xCentre;

        const yAlign = app.screen.height / 3;  // Align vertically on-screen
        const zOffset = z * this.height / 2;
        this.y = (0.25 * x * this.width) + (0.25 * y * this.height) + yAlign - zOffset;

        return {x: this.x, y: this.y};
    }

    /* Update `this.zIndex` */
    updateRenderingOrder() {
        this.zIndex = this.gridX + this.gridY + this.gridZ;
    }

    /* Shortcut to `app.stage.addChild(this)` */
    render() {
        app.stage.addChild(this);
    }

    /* Shortcut to `app.stage.removeChild(this)` */
    hide() {
        app.stage.removeChild(this);
    }
}

export default GameJamSprite;