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
    overlay;

    constructor(x, y, z, texture) {
        super(texture);
        this.anchor.set(0.5);
        this.gridToAbsolute(x, y, z);

        this.gridX = x;
        this.gridY = y;
        this.gridZ = z;

        this.updateRenderingOrder();
        this.createOverlay();
        this.updateOverlay();
        this.render();
    }

    /* Update tint and alpha for the overlay */
    updateOverlay(alpha = 0.5, tint = 0x000000, lights=[]) {
        let lit = false;
        for (const light of lights) {
            if (light.isPointInEllipse(this.x, this.y, light.x, light.y, light.radius, 0.5 * light.radius)){
                lit = true;
            }
        }
        if (lit) {
            this.overlay.tint = this.mergeColors(this.overlay.tint, tint)
        } else {
            this.overlay.tint = tint;
        }

        this.overlay.alpha = alpha;
    }

    mergeColors(color1, color2) {
        const r1 = (color1 >> 16) & 0xFF;
        const g1 = (color1 >> 8) & 0xFF;
        const b1 = color1 & 0xFF;

        const r2 = (color2 >> 16) & 0xFF;
        const g2 = (color2 >> 8) & 0xFF;
        const b2 = color2 & 0xFF;

        const mergedR = Math.min(0xFF, r1 + r2);
        const mergedG = Math.min(0xFF, g1 + g2);
        const mergedB = Math.min(0xFF, b1 + b2);

        return (mergedR << 16) | (mergedG << 8) | mergedB;
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

    /* Setup overlay for this block */
    createOverlay() {
        this.overlay = new PIXI.Sprite(this.texture);
        this.overlay.anchor.set(this.anchor.x, this.anchor.y);
        this.overlay.tint = 0x000000;
    }

    /* Update `this.zIndex` */
    updateRenderingOrder() {
        this.zIndex = this.gridX + this.gridY + this.gridZ;
    }

    /* Shortcut to `app.stage.addChild(this)` */
    render() {
        app.stage.addChild(this);
        this.addChild(this.overlay);
    }

    /* Shortcut to `app.stage.removeChild(this)` */
    hide() {
        app.stage.removeChild(this);
    }
}

export default GameJamSprite;