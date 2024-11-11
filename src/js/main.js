import Block from './block.js';
import GameJamSprite from "./gameJamSprite.js";
import Interactable from './interactable.js';
import Player from './player.js';
import LightSource from './lightSource.js';

/* Setup PixiJS application */
export const app = new PIXI.Application();
await app.init({background: '#FFFFFF', resizeTo: window});
document.body.appendChild(app.canvas);
export const eventEmitter = new PIXI.EventEmitter();

const allBlocks = [];
const allLightSources = [];

/* Read in blocks and instantiate them */
async function createBlocks(scene) {
    const blocks = await readJSON('blocks.json', scene);

    for (const block of blocks) {
        const texture = await PIXI.Assets.load(`../resources/assets/${block.texture}`);
        const blockObject = new Block(block.x, block.y, block.z, texture);
        blockObject.changeFilter();
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

/* Read in player and instantiate it */
async function createPlayer(playerIndex) { // TODO: Player selection?
    const player = (await readJSON('players.json', 'players'))[playerIndex];
    const texture = await PIXI.Assets.load(`../resources/assets/${player.texture}`);
    const playerObject = new Player(9, 9, 1, texture);
    playerObject.render();
}

async function createLightSource() {
    const texture = await PIXI.Assets.load('../resources/assets/blue_block.png');
    const lightSource = new LightSource(9, 9, 1, texture);
    lightSource.render();
    lightSource.applyLight(allBlocks);
    allLightSources.push(lightSource);
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
            child.changeFilter();
        }
    });
    for (const lightSource of allLightSources) {
        const players = app.stage.children.filter(child => child instanceof Player);
        let pos = {x: players[0].x, y: players[0].y};
        lightSource.updateLocation(pos.x, pos.y);
        lightSource.applyLight(allBlocks);
    }
}

/* ---------- Main Logic ---------- */
(async () => {
    await createBlocks('test_screen');
    await createInteractables('test_screen');
    await createPlayer(0);
    await createLightSource();
    tick();
})();
