let selectedColor;
let gif;
function createColorList(numColors) {
    const colorPalette = document.getElementById('colorPalette');
    colorPalette.innerHTML = '';

    for (let i = 0; i < numColors; i++) {
        const colorBox = document.createElement('div');
        colorBox.classList.add('color-box');
        const randomColor = createRandomColor();
        colorBox.style.backgroundColor = randomColor;
        colorPalette.appendChild(colorBox);
        colorBox.addEventListener('click', function () {
            selectedColor = randomColor;
        });
    }
}
createColorList(10);
function createRandomColor() {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 14)];
    }
    return color;
}
function createPixelArt(dimension) {
    const container = document.getElementById('pixelContainer');
    container.style.gridTemplateColumns = `repeat(${dimension}, 1fr)`;
    container.style.gridTemplateRows = `repeat(${dimension}, 1fr)`;
    container.innerHTML = '';
    for (let i = 0; i < dimension * dimension; i++) {
        const pixel = document.createElement('div');
        pixel.classList.add('pixel');
        container.appendChild(pixel);
        pixel.addEventListener('click', function () {
            pixel.style.backgroundColor = selectedColor;
        });
    }
}
function updateGrid() {
    const dimension = parseInt(document.getElementById('dimension').value);
    createPixelArt(dimension);
}
// Initial setup
updateGrid();
const dimensionInput = document.getElementById('dimension');
dimensionInput.addEventListener('change', updateGrid);
function neighborColor(event) {
    if (!event.target.classList.contains("pixel")) {
        return;
    }

    const colorCheckbox = document.getElementById("fillNeighborsCheckbox");
    if (colorCheckbox && colorCheckbox.checked) {
        const selectedPixel = event.target;
        const container = document.getElementById("pixelContainer");
        const pixels = container.querySelectorAll(".pixel");
        const selectedPixelIndex = Array.from(pixels).indexOf(selectedPixel);

        const containerWidth = Math.sqrt(pixels.length);
        const neighborIndices = [selectedPixelIndex - containerWidth - 1,
            selectedPixelIndex - containerWidth,
            selectedPixelIndex - containerWidth + 1,
            selectedPixelIndex - 1,
            selectedPixelIndex + 1,
            selectedPixelIndex + containerWidth - 1,
            selectedPixelIndex + containerWidth,
            selectedPixelIndex + containerWidth + 1
        ];
        selectedPixel.style.backgroundColor = selectedColor;
        for (let i = 0; i < neighborIndices.length; i++) {
            const neighborIndex = neighborIndices[i];
            if (neighborIndex >= 0 && neighborIndex < pixels.length) {
                const neighborPixel = pixels[neighborIndex];
                neighborPixel.style.backgroundColor = selectedColor;
            }
        }
    }
}
const pixelContainer = document.getElementById("pixelContainer");
pixelContainer.addEventListener("click", neighborColor);
function resetPixels() {
    const pixels = document.querySelectorAll('.pixel');
    pixels.forEach((pixel) => {
        pixel.style.backgroundColor = '';
    });
}

const resetButton = document.getElementById('resetButton');
resetButton.addEventListener('click', resetPixels);
function downloadAsImage(format) {
    const pixelContainer = document.getElementById('pixelContainer');
    const canvas = document.createElement('canvas');
    canvas.width = pixelContainer.offsetWidth;
    canvas.height = pixelContainer.offsetHeight;
    const context = canvas.getContext('2d');
    html2canvas(pixelContainer).then(function (canvasImage) {
        context.drawImage(canvasImage, 0, 0);
        const downloadLink = document.createElement('a');
        downloadLink.href = canvas.toDataURL(`image/${format}`);
        downloadLink.download = `pixel_art.${format}`;
        downloadLink.click();
    });
}

const downloadPNGButton = document.getElementById('downloadPngButton');
downloadPNGButton.addEventListener('click', function () {
    downloadAsImage('png');
});

const downloadJPGButton = document.getElementById('downloadJpgButton');
downloadJPGButton.addEventListener('click', function () {
    downloadAsImage('jpg');
});
function createGIF(frames, frameDelay) {
    gif = new GIF({
        workers: 4, quality: 10, width: frames[0].canvas.width,
        height: frames[0].canvas.height
    });

    frames.forEach((frame) => {
        gif.addFrame(frame.canvas, {delay: frameDelay});
    });

    gif.on('finished', function (blob) {
        const downloadLink = document.createElement('a');
        downloadLink.href = URL.createObjectURL(blob);
        downloadLink.download = 'pixel_art.gif';
        downloadLink.click();
    });
    gif.render();
}

const downloadGIFButton = document.getElementById('downloadGifButton');
downloadGIFButton.addEventListener('click', function () {
    const pixelContainer = document.getElementById('pixelContainer');
    const frames = [];
    html2canvas(pixelContainer).then((canvas) => {
        frames.push({canvas: canvas});
        createGIF(frames, 100);
    });
});





