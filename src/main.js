const app = new PIXI.Application();
const imageSize = 32;
const blocks = [[0, 0, 1], [0, 0, 0]];

async function setup() {
    await app.init({background: '#FFFFFF', resizeTo: window});
    document.body.appendChild(app.canvas);
}

(async () => {
    await setup();
    await drawGrid();
})();

async function drawTile(x, y, zOffset) {
    const xCentre = app.screen.width / 2 - imageSize / 2;
    const xPos = (0.50 * x * imageSize) - (0.50 * y * imageSize) + xCentre;
    const yPos = (0.25 * x * imageSize) + (0.25 * y * imageSize);
    const texture = await PIXI.Assets.load(`../assets/gray_block_${imageSize}.png`);
    const block = PIXI.Sprite.from(texture);

    block.x = xPos;
    block.y = yPos + (zOffset * imageSize / 2);
    return block;
}

async function drawGrid() {
    for (let i = 0; i < blocks.length; i++) {
        app.stage.addChild(await drawTile(blocks[i][0], blocks[i][1], blocks[i][2]))
    }
}