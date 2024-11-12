import {eventEmitter, readSettings} from "./main.js";
import GameJamSprite from "./gameJamSprite.js";

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

        this.animate();
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

        this.addEventListener('click', async (event) => {
            createjs.Tween.get(this)
                .to({y: this.staticY}, 150, createjs.Ease.sineInOut);

            if (!this.hasBlockAbove) {
                eventEmitter.emit('movePlayer', this);
            }

            const buildMode = await readSettings('build_mode');
            if (buildMode) {
                const pointerPos = event.data.getLocalPosition(this);
                this.build(pointerPos);
            }
        });
    }

    /* Check if there is something immediately above this block */
    checkAbove(spriteMap) {
        const aboveKey = `${this.gridX},${this.gridY},${this.gridZ + 1}`; // Create the key for the above block
        this.hasBlockAbove = spriteMap.has(aboveKey); // Check if the key is in the map
    }

    /* Add a new block on clicked face */
    build(pointerPos) {
        const face = this.getClickedFace(pointerPos);
        let offset = {x: 0, y: 0, z: 0};

        switch (face) {
            case 'top':
                offset.z = 1;
                break;
            case 'left':
                offset.y = 1;
                break;
            case 'right':
                offset.x = 1;
                break;
        }

        const block = new Block(this.gridX + offset.x, this.gridY + offset.y, this.gridZ + offset.z, this.texture);
        console.log({x: block.gridX, y: block.gridY, z: block.gridZ, texture: "[color]_block.png"}); // Output can be manually copied to JSON
    }

    /* Return which face was clicked */
    getClickedFace(localPoint) {
        // Define vertices of  isometric cube
        const top = {x: 0, y: -this.height / 2};
        const topLeft = {x: -this.width / 2, y: -this.height / 4};
        const topRight = {x: this.width / 2, y: -this.height / 4};
        const bottomLeft = {x: -this.width / 2, y: this.height / 4};
        const bottomRight = {x: this.width / 2, y: this.height / 4};
        const centre = {x: 0, y: 0};
        const bottom = {x: 0, y: this.height / 2};

        // Define faces in terms of points
        const topFace = new PIXI.Polygon([new PIXI.Point(topLeft.x, topLeft.y), new PIXI.Point(top.x, top.y), new PIXI.Point(topRight.x, topRight.y), new PIXI.Point(centre.x, centre.y)]);
        const leftFace = new PIXI.Polygon([new PIXI.Point(bottomLeft.x, bottomLeft.y), new PIXI.Point(topLeft.x, topLeft.y), new PIXI.Point(centre.x, centre.y), new PIXI.Point(bottom.x, bottom.y)]);
        const rightFace = new PIXI.Polygon([new PIXI.Point(bottom.x, bottom.y), new PIXI.Point(centre.x, centre.y), new PIXI.Point(topRight.x, topRight.y), new PIXI.Point(bottomRight.x, bottomRight.y)]);

        // Check which face contains the pointer
        if (topFace.contains(localPoint.x, localPoint.y)) {
            return 'top';
        } else if (leftFace.contains(localPoint.x, localPoint.y)) {
            return 'left';
        } else if (rightFace.contains(localPoint.x, localPoint.y)) {
            return 'right';
        }
    }
}

export default Block;