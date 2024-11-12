import Block from './block.js';
import Flashlight from "./flashlight.js";
import GameJamSprite from "./gameJamSprite.js";
import GlobalLightSource from "./globalLightSource.js";
import LightSource from './lightSource.js';
import LightSwitch from './lightSwitch.js';
import Player from './player.js';

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
        const texture = await PIXI.Assets.load(`src/resources/assets/${block.texture}`);
        new Block(block.x, block.y, block.z, texture);
    }
}

/* Read in player and instantiate it */
async function createPlayer() {
    const playerIndex = await readSettings('player_index');
    const spawnLocation = await readSettings('player_spawn');
    const players = await readJSON('players.json', 'players');
    const texture = await PIXI.Assets.load(`src/resources/assets/${players[playerIndex].texture}`);

    const player = new Player(spawnLocation.x, spawnLocation.y, spawnLocation.z, texture);
    player.tint = players[playerIndex].tint;
}

/* Setup light sources for flashlight and player */ // TODO: Generalise instantiating light sources
async function createLightSources() {
    const player = app.stage.children.find(child => child instanceof Player);
    new LightSource(player, 40, player.tint); // Set player light colour to player colour

    const flashlight = app.stage.children.find(child => child instanceof Flashlight);
    new LightSource(flashlight, 100, (Math.random() * 0xFFFFFF)); // Randomise flashlight colour
}

/* Read in interactables and instantiate them */  // TODO: Generalise instantiating interactables
async function createFlashlight() {
    const texture = await PIXI.Assets.load('src/resources/assets/torch_white.png');
    new Flashlight(18, 18, 1, texture);
}

/* Instantiate Light Switch */
async function createLightSwitch() {
    const texture = await PIXI.Assets.load('src/resources/assets/blue_block.png');
    const light = new GlobalLightSource(0x333333);
    new LightSwitch(10, 10, 1, texture, light);
}

/* Read given JSON file and return data from given array */
async function readJSON(fileName, array) {
    const jsonFile = await PIXI.Assets.load({src: `src/resources/${fileName}`, loader: 'loadJson'});
    return jsonFile[array];
}

/* Recalculate `zIndex` and run `checkAbove` for blocks */
function tick(buildMode = false) {
    const spriteMap = new Map();

    app.stage.children.forEach(child => {
        if (child instanceof GameJamSprite) { // Initial actions
            const key = `${child.gridX},${child.gridY},${child.gridZ}`; // Create key for the sprite
            spriteMap.set(key, child); // Create map of key (x,y,z) -> value (GameJamSprite)
            child.updateRenderingOrder();
            if (buildMode) {
                child.updateOverlay(0); // Hide overlays
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
        await createPlayer(playerIndex);
        await createFlashlight();
        await createLightSwitch();
        await createLightSources();
    }

    app.ticker.add(() => tick(buildMode));
})();