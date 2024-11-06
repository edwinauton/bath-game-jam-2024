const canvas = document.createElement("canvas");
const ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
document.body.appendChild(canvas);

const imageSize = 32;

function drawTile(x, y) {
    const xCentre = canvas.width / 2 - imageSize / 2;
    const xPos = (0.50 * x * imageSize) - (0.50 * y * imageSize) + xCentre;
    const yPos = (0.25 * x * imageSize) + (0.25 * y * imageSize);

    const image = new Image();
    image.onload = function () {
        ctx.drawImage(this, xPos, yPos);
    }
    image.src = `/assets/gray_block_32.png`;
}

function drawGrid() {
    const gridSize = Math.floor(canvas.height / imageSize);

    for (let i = 0; i < gridSize; i++) {
        for (let j = 0; j < gridSize; j++) {
            drawTile(i, j);
        }
    }
}

function main() {
    drawGrid();
    requestAnimationFrame(main);
}

main();