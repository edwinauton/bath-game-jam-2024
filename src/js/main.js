import Block from './block.js';
import GameJamSprite from "./gameJamSprite.js";
import Interactable from './interactable.js';
import Player from './player.js';
import LightSource from './lightSource.js';

/* Setup PixiJS application */
export const app = new PIXI.Application();
await app.init({background: '#FFFFFF', resizeTo: window});
document.body.appendChild(app.canvas);

export const eventEmitter = new PIXI.EventEmitter(); // Global event system

/* Return value for given key from `settings.json` */
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
async function createPlayer() {
    const playerIndex = await readSettings('player_index');
    const spawnLocation = await readSettings('player_spawn');
    const players = await readJSON('players.json', 'players');
    const texture = await PIXI.Assets.load(`../resources/assets/${players[playerIndex].texture}`);

    const player = new Player(spawnLocation.x, spawnLocation.y, spawnLocation.z, texture);
    player.tint = players[playerIndex].tint;
}

/* Setup light source */
async function createLightSources() {
    const player = app.stage.children.find(child => child instanceof Player);
    new LightSource(player, 40, player.tint);

    const interactable = app.stage.children.find(child => child instanceof Interactable && child.label === 'Flashlight');
    new LightSource(interactable, 100, Math.random() * 0xFFFFFF);
}

/* Read given JSON file and return data from given array */
async function readJSON(fileName, array) {
    const jsonFile = await PIXI.Assets.load({src: `../resources/${fileName}`, loader: 'loadJson'});
    return jsonFile[array];
}

/* Recalculate `zIndex` and run `checkAbove` for blocks */
function tick(buildMode = false) {
    const spriteMap = new Map();

    app.stage.children.forEach(child => {
        if (child instanceof GameJamSprite) {
            const key = `${child.gridX},${child.gridY},${child.gridZ}`; // Create key for the sprite
            spriteMap.set(key, child); // Create map of key (x,y,z) -> value (GameJamSprite)
            child.updateRenderingOrder();
            if (buildMode) {
                child.updateOverlay(0);
            } else {
                child.updateOverlay();
            }
        }
    });

    app.stage.children.forEach(child => {  // Delayed actions
        if (child instanceof Block) {
            child.checkAbove(spriteMap);
        } else if (child instanceof LightSource) {
            child.updateLighting();
        }
    });
}

/* ---------- Main Logic ---------- */
(async () => {
    const levelName = await readSettings('level_name');
    const buildMode = await readSettings('build_mode');
    const playerIndex = await readSettings('player_index');

    await createBlocks(levelName);

    if (!buildMode) {
        await createInteractables(levelName);
        await createPlayer(playerIndex);
        await createLightSources();
    }

    app.ticker.add(() => tick(buildMode));
})();