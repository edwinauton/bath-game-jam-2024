import Block from './block.js';
import GameJamSprite from "./gameJamSprite.js";
import Interactable from './interactable.js';
import Player from './player.js';

/* Setup PixiJS application */
export const app = new PIXI.Application();
await app.init({background: '#FFFFFF', resizeTo: window});
document.body.appendChild(app.canvas);
export const eventEmitter = new PIXI.EventEmitter();

/* Read in blocks and instantiate them */
async function createBlocks(scene) {
    const blocks = await readJSON('blocks.json', scene);

    for (const block of blocks) {
        const texture = await PIXI.Assets.load(`../resources/assets/${block.texture}`);
        const blockObject = new Block(block.x, block.y, block.z, texture);
        blockObject.changeFilter(0x000000, 0.5)
        blockObject.render();
        blockObject.animate();
        allBlocks.push(blockObject);
    }
}

/* Read in interactables and instantiate them */
async function createInteractables(scene) {
    const interactables = await readJSON('interactables.json', scene);

    for (const interactable of interactables) {
        const texture = await PIXI.Assets.load(`../resources/assets/${interactable.texture}`);
        const interactableObject = new Interactable(interactable.x, interactable.y, interactable.z, texture, interactable.label);
        interactableObject.render();
        interactableObject.animate();
    }
}

/**
 * Checks if a point is within an ellipse.
 *
 * @param {Number} x - The x-coordinate of the point.
 * @param {Number} y - The y-coordinate of the point.
 * @param {Number} h - The x-coordinate of the ellipse's center.
 * @param {Number} k - The y-coordinate of the ellipse's center.
 * @param {Number} a - The horizontal radius of the ellipse.
 * @param {Number} b - The vertical radius of the ellipse.
 * @returns {Boolean} - Returns true if the point is within the ellipse, else false.
 */
function isPointInEllipse(x, y, h, k, a, b) {
    return ((Math.pow(x - h, 2) / Math.pow(a, 2)) +
            (Math.pow(y - k, 2) / Math.pow(b, 2))) <= 1;
}

function get_blocks_in_ellipse(blocks, pos, radius) {
    let in_radius = [];
    for (const block of blocks) {
        if (isPointInEllipse(block.x, block.y, pos.x, pos.y, radius, radius * 0.5)) {
            in_radius.push(block)
            console.log(`Position: ${pos.x}, ${pos.y}`);
            console.log(`Block: ${block.x}, ${block.y}`);   
        }
    }
    return in_radius
}

function set_tint_to_blocks(blocks, tint, alpha) {
    for (const block of blocks) {
        block.changeFilter(tint, alpha)
    }
} 

/* Read in player and instantiate it */
async function createPlayer(playerIndex) { // TODO: Player selection?
    const player = (await readJSON('players.json', 'players'))[playerIndex];
    const texture = await PIXI.Assets.load(`../resources/assets/${player.texture}`);
    const playerObject = new Player(9, 9, 1, texture);
    playerObject.render();
}

/* Read given JSON file and return data from given array */
async function readJSON(fileName, array) {
    const jsonFile = await PIXI.Assets.load({src: `../resources/${fileName}`, loader: 'loadJson'});
    return jsonFile[array];
}

/* Recalculate `zIndex` and run `checkAbove` for blocks */
export function tick() {
    const spriteMap = new Map();

    app.stage.children.forEach(child => {
        if (child instanceof GameJamSprite) {
            const key = `${child.gridX},${child.gridY},${child.gridZ}`; // Create key for the sprite
            spriteMap.set(key, child); // Add key to map
            child.updateRenderingOrder();
        }
    });
    app.stage.children.forEach(child => {
        if (child instanceof Block) {
            child.checkAbove(spriteMap);
        }
    });

    const players = app.stage.children.filter(child => child instanceof Player);
    console.log(`Number of players: ${players}`);    
    let pos = {x: players[0].x, y: players[0].y + players[0].height / 2};
    const blocks = get_blocks_in_ellipse(allBlocks, pos, 100);
    console.log(`Number of blocks retrieved: ${blocks.length}`);
    set_tint_to_blocks(blocks, 0xffffff, 0.5);1000
}

/* ---------- Main Logic ---------- */
(async () => {
    await createBlocks('test_screen');
    await createInteractables('test_screen');
    await createPlayer(0);
    tick();
})();
