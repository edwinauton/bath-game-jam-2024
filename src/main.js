const app = new PIXI.Application();
const imageSize = 32;

async function setup() {
    await app.init({background: '#FFFFFF', resizeTo: window});
    document.body.appendChild(app.canvas);
}

(async () => {
    await setup();
    await drawGrid();
    await drawGrid(1.5, 2);
})();

async function drawTile(x, y, zOffset) {
    const xCentre = app.screen.width / 2 - imageSize / 2;
    const xPos = (0.50 * x * imageSize) - (0.50 * y * imageSize) + xCentre;
    const yPos = (0.25 * x * imageSize) + (0.25 * y * imageSize);
    const texture = await PIXI.Assets.load(`../assets/gray_block_${imageSize}.png`);
    const block = PIXI.Sprite.from(texture);

    block.x = xPos;
    block.y = yPos + zOffset;
    return block;
}

async function drawGrid() {
    const gridSize = Math.floor(app.screen.height / imageSize);

    for (let i = 0; i < gridSize; i++) {
        for (let j = 0; j < gridSize; j++) {
            app.stage.addChild(await drawTile(i, j, Math.random()))
        }
    }
}