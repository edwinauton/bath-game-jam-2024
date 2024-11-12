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

    /* Setup overlay for this block */
    createOverlay() {
        this.overlay = new PIXI.Sprite(this.texture);
        this.overlay.anchor.set(this.anchor.x, this.anchor.y);
        this.overlay.tint = 0x000000;
        this.addChild(this.overlay);
    }

    /* Update tint and alpha for the overlay */
    updateOverlay(alpha = 0.5, tint = 0x000000, lights=[]) {
        let lit = false;
        lights.forEach(child => {
            if (child.isPointInEllipse(this.x, this.y, child.x, child.y, child.radius, 0.5 * child.radius)) {
                lit = true;
            }
        })

        this.overlay.tint = lit ? this.mergeColor(tint) : tint; // Merge colours, or reset tint if not in radius of any light
        this.overlay.alpha = alpha;
    }

    /* Additive blend the current colour overlay colour with the given colour */
    mergeColor(tint) {
        const r1 = (this.overlay.tint >> 16) & 0xFF;
        const g1 = (this.overlay.tint >> 8) & 0xFF;
        const b1 = this.overlay.tint & 0xFF;

        const r2 = (tint >> 16) & 0xFF;
        const g2 = (tint >> 8) & 0xFF;
        const b2 = tint & 0xFF;

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