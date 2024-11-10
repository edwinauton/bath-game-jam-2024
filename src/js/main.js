/* Setup PixiJS application */
const app = new PIXI.Application();
await app.init({background: '#FFFFFF', resizeTo: window});
document.body.appendChild(app.canvas);

const eventEmitter = new PIXI.EventEmitter();

/* Parent class for Block and Player with shared fields and methods */
class GameJamSprite extends PIXI.Sprite {
    renderingOrder
    gridX;
    gridY;
    gridZ;

    constructor(x, y, z, texture) {
        super({texture: texture});
        this.gridX = x;
        this.gridY = y;
        this.gridZ = z;

        this.gridToAbsolute(x, y, z)
        this.updateRenderingOrder()
    }

    gridToAbsolute(x, y, z = 1) {
        const xCentre = app.screen.width / 2 - this.width / 2;  // Centre horizontally on-screen
        this.x = (0.50 * x * this.width) - (0.50 * y * this.height) + xCentre;

        const yAlign = app.screen.height / 3;  // Align vertically on-screen
        const zOffset = z * this.height / 2;
        this.y = (0.25 * x * this.width) + (0.25 * y * this.height) + yAlign - zOffset;

        return {x: this.x, y: this.y};
    }

    updateRenderingOrder() {
        this.renderingOrder = this.gridX + this.gridY + this.gridZ
    }

    render() {
        app.stage.addChild(this);
    }
}

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

    /* Animations to be run on the block when hovered over, clicked, etc.*/
    animate() {
        this.eventMode = 'static'; // Allow blocks to be animated

        if (!this.hasBlockAbove) {
            this.addEventListener('pointerenter', () => {
                createjs.Tween.get(this).to({y: this.staticY - (this.height / 10)}, 150, createjs.Ease.sineInOut);
            });
            this.addEventListener('pointerleave', () => {
                createjs.Tween.get(this).to({y: this.staticY}, 150, createjs.Ease.sineInOut);
            });
            this.addEventListener('click', () => {
                createjs.Tween.get(this).to({y: this.staticY}, 150, createjs.Ease.sineInOut); // Reset block to original position
                eventEmitter.emit('movePlayer', this);
            });
        }
    }

    /* Check if there is a block immediately above this one */
    checkBlockAbove(blocks) {
        const blockMap = new Map();
        blocks.forEach(block => {
            const key = `${block.gridX},${block.gridY},${block.gridZ}`;  // Create keys to add to map
            blockMap.set(key, block); // Create map of key (x,y,z) -> value (Block)
        });

        const key = `${this.gridX},${this.gridY},${this.gridZ + 1}`; // Create key to search in map
        this.hasBlockAbove = blockMap.has(key);
    }
}

/**
 *  @param {Number} x               grid x-coordinate spawn for the player
 *  @param {Number} y               grid y-coordinate spawn for the player
 *  @param {Number} z               grid z-coordinate spawn for the player
 *  @param {Texture} texture        texture asset to be rendered for the player
 *  */
class Player extends GameJamSprite {
    constructor(x, y, z, texture) {
        super(x, y, z, texture);

        this.renderingOrder = Infinity; // Always on top
        eventEmitter.on('movePlayer', this.moveTo.bind(this));  // Run 'moveTo' when 'movePlayer' event triggers
    }

    /* Moves the player from their current position to a new block in calculated steps */ // TODO: Check for z-levels
    moveTo(block) {
        if (!block.hasBlockAbove && block.gridZ === this.gridZ - 1) { // Only run for accessible blocks on this level
            createjs.Tween.removeTweens(this); // Stops ongoing Tweens

            const animateStep = () => {
                if (this.checkAdjacentInteractables()) {
                    eventEmitter.emit('interact', this);
                }
                let moved = false;

                if (this.gridX !== block.gridX) {
                    this.gridX += (this.gridX < block.gridX) ? 1 : -1; // 1 if true, -1 if false
                    moved = true;
                } else if (this.gridY !== block.gridY) {
                    this.gridY += (this.gridY < block.gridY) ? 1 : -1; // 1 if true, -1 if false
                    moved = true;
                }

                if (moved) {  // Check if anything has been changed
                    const absolute = this.gridToAbsolute(this.gridX, this.gridY);
                    this.updateRenderingOrder()
                    createjs.Tween.get(this)
                        .to({x: absolute.x, y: absolute.y}, 150, createjs.Ease.sineInOut)
                        .call(animateStep);  // Loop animateStep
                }
            }
            animateStep();
        }
    }

    checkAdjacentInteractables() {
        const blocks = app.stage.children.filter(child => child instanceof GameJamSprite);
        const spriteMap = new Map();
        blocks.filter(sprite => sprite instanceof Interactable).forEach(sprite => {
            const key = `${sprite.gridX},${sprite.gridY},${sprite.gridZ}`;  // Create keys to add to map
            spriteMap.set(key, sprite); // Create map of key (x,y,z) -> value (Block)
        });

        const key1 = `${this.gridX + 1},${this.gridY},${this.gridZ}`; // Create key to search in map
        const key2 = `${this.gridX - 1},${this.gridY},${this.gridZ}`; // Create key to search in map
        const key3 = `${this.gridX},${this.gridY + 1},${this.gridZ}`; // Create key to search in map
        const key4 = `${this.gridX},${this.gridY - 1},${this.gridZ}`; // Create key to search in map
        return spriteMap.has(key1) || spriteMap.has(key2) || spriteMap.has(key3) || spriteMap.has(key4);
    }
}

class Interactable extends GameJamSprite {
    constructor(x, y, z, texture) {
        super(x, y, z, texture);

        eventEmitter.on('interact', this.interact.bind(this));
    }

    animate() {
        this.eventMode = 'static'; // Allow animation

        createjs.Tween.get(this, {loop: true}) // Loop animation
            .to({y: this.y - (this.height / 10)}, 1000, createjs.Ease.sineInOut)
            .to({y: this.y}, 1000, createjs.Ease.sineInOut);
    }

    interact() {
        console.log("Interacted!"); // TODO: Add functionality
    }
}

/* Read blocks from JSON file and make list of Block objects */
async function createBlocks(scene) {
    const jsonFile = await PIXI.Assets.load({src: '../resources/blocks.json', loader: 'loadJson'});
    const blocks = jsonFile[scene]

    const blockObjects = [];
    for (const block of blocks) {
        const texture = await PIXI.Assets.load(`../resources/assets/${block.texture}`);
        blockObjects.push(new Block(block.x, block.y, block.z, texture));
    }
    return blockObjects;
}

/* Add given new blocks to existing blocks and recalculate renderingOrder, hasBlockAbove etc. */
function addNewBlocks(newBlocks) {
    let existingBlocks = app.stage.children.filter(child => child instanceof Block);
    const allBlocks = existingBlocks.concat(newBlocks)
    allBlocks.sort((a, b) => a.renderingOrder - b.renderingOrder); // Sort by descending rendering order
    clearStage();

    allBlocks.forEach(block => {
        block.render();
        block.checkBlockAbove(allBlocks);
        block.animate();
    })
}

/* Remove all children from the stage */
function clearStage() {
    app.stage.children.forEach(child => child.remove());
}

/* Create player */ // TODO: Player selection?
async function createPlayer() {
    const texture = await PIXI.Assets.load(`../resources/assets/blue_slab.png`);
    const player = new Player(9, 9, 1, texture)
    player.render();
}

/* Create interactable */
async function createInteractable() {
    const texture = await PIXI.Assets.load(`../resources/assets/blue_slab.png`);
    const interactable = new Interactable(19, 19, 1, texture)
    interactable.render();
    interactable.animate();
}

/* Main logic */
(async () => {
    const testLevel = await createBlocks('test_screen')
    addNewBlocks(testLevel);
    await createPlayer();
    await createInteractable();
})();