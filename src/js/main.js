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

export async function readSettings(key) {
    return await readJSON('settings.json', key);
}

/* Read in blocks and instantiate them */
async function createBlocks(scene) {
    const blocks = await readJSON('blocks.json', scene);

    for (const block of blocks) {
        const texture = await PIXI.Assets.load(`../resources/assets/${block.texture}`);
        new Block(block.x, block.y, block.z, texture);
    }
}

/* Read in interactables and instantiate them */
async function createInteractables(scene) {
    const interactables = await readJSON('interactables.json', scene);

    for (const interactable of interactables) {
        const texture = await PIXI.Assets.load(`../resources/assets/${interactable.texture}`);
        new Interactable(interactable.x, interactable.y, interactable.z, texture, interactable.label);
    }
}

/* Read in player and instantiate it */
async function createPlayer(playerIndex) { // TODO: Player selection?
    const player = (await readJSON('players.json', 'players'))[playerIndex];

    const texture = await PIXI.Assets.load(`../resources/assets/${player.texture}`);
    const spawnLocation = await readSettings('player_spawn');
    new Player(spawnLocation.x, spawnLocation.y, spawnLocation.z, texture);
}

/* Setup light source */
async function createLightSource() {
    const texture = await PIXI.Assets.load('../resources/assets/red_block.png');
    const player = app.stage.children.filter(child => child instanceof Player)[0];
    new LightSource(player.gridX, player.gridY, player.gridZ, texture);
}

/* Read given JSON file and return data from given array */
async function readJSON(fileName, array) {
    const jsonFile = await PIXI.Assets.load({src: `../resources/${fileName}`, loader: 'loadJson'});
    return jsonFile[array];
}

/* Recalculate `zIndex` and run `checkAbove` for blocks */
export function tick(buildMode = false) {
    const spriteMap = new Map();

    app.stage.children.forEach(child => {
        if (child instanceof GameJamSprite) {
            const key = `${child.gridX},${child.gridY},${child.gridZ}`; // Create key for the sprite
            spriteMap.set(key, child); // Create map of key (x,y,z) -> value (GameJamSprite)
            child.updateRenderingOrder();
            if (buildMode) {
                child.updateOverlay(0, 0);
            } else {
                child.updateOverlay();
            }
        }
    });

    app.stage.children.forEach(child => {
        if (child instanceof Block) {
            child.checkAbove(spriteMap);
        }
    });

    const player = app.stage.children.filter(child => child instanceof Player)[0];
    app.stage.children.forEach(child => {
        if (child instanceof LightSource) {
            child.x = player.x;
            child.y = player.y;
            child.applyLight();
        }
    });
}

/* ---------- Main Logic ---------- */
(async () => {
    const scene = await readSettings('level')
    await createBlocks(scene);
    if (!await readSettings('build_mode')) {
        await createInteractables(scene);
        const player = await readSettings('player');
        await createPlayer(player);
        await createLightSource();
        tick();
    } else {
        tick(true);
    }
})();
