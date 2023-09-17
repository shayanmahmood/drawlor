const canvas = document.querySelector('canvas'),
    toolBtns = document.querySelectorAll('.tool'),
    fillCheck = document.querySelector('#fill-color'),
    brushSize = document.querySelector('#size-slider'),
    color = document.querySelectorAll('.colors .option'),
    colorPicker = document.querySelector('#color-picker'),
    clearCanvas = document.querySelector('.clear-canvas'),
    saveImg = document.querySelector('.save-img'),
    ctx = canvas.getContext('2d');

let
    prevMouseX,
    prevMouseY,
    snapShot,
    isDrawing = false,
    brushWidth = 5,
    selectedTool = 'brush',
    selectedColor = '#000';


const setCanvasBackground = () => {
    ctx.fillStyle = "#fff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = selectedColor;
}
window.addEventListener("load", () => {
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight - 7;
    ctx.lineCap = "round";
    setCanvasBackground();
});

const drawRect = (e) => {
    if (!fillCheck.checked) {
        return ctx.strokeRect(e.offsetX, e.offsetY, prevMouseX - e.offsetX, prevMouseY - e.offsetY);
    }
    else {
        return ctx.fillRect(e.offsetX, e.offsetY, prevMouseX - e.offsetX, prevMouseY - e.offsetY);
    }
}
const drawCircle = (e) => {
    ctx.beginPath();
    let radius = Math.sqrt(Math.pow((prevMouseX - e.offsetX), 2) + Math.pow((prevMouseY - e.offsetY), 2));
    console.log(radius);
    ctx.arc(prevMouseX, prevMouseY, radius, 0, 2 * Math.PI);
    if (fillCheck.checked) {
        ctx.fill();
    }
    else {
        ctx.stroke();
    }
}

const drawCTriangle = (e) => {
    ctx.beginPath();
    ctx.moveTo(prevMouseX, prevMouseY);
    ctx.lineTo(e.offsetX, e.offsetY);
    ctx.lineTo(prevMouseX * 2 - e.offsetX, e.offsetY);
    ctx.closePath();
    if (fillCheck.checked) {
        ctx.fill();
    }
    else {
        ctx.stroke();
    }
}

const startdraw = (e) => {
    isDrawing = true;
    prevMouseX = e.offsetX;
    prevMouseY = e.offsetY;
    ctx.beginPath();
    ctx.lineWidth = brushWidth;
    ctx.strokeStyle = selectedColor;
    ctx.fillStyle = selectedColor;
    snapShot = ctx.getImageData(0, 0, canvas.width, canvas.height);
}

const drawing = (e) => {
    if (!isDrawing) return;
    ctx.putImageData(snapShot, 0, 0);
    if (selectedTool === 'brush' || selectedTool === 'eraser') {
        if (selectedTool === 'eraser') {
            ctx.strokeStyle = '#fff'
        }
        ctx.lineTo(e.offsetX, e.offsetY);
        ctx.stroke();
    } else if (selectedTool === 'rect') {
        drawRect(e)
    }
    else if (selectedTool === 'circle') {
        drawCircle(e)
    }
    else {
        drawCTriangle(e)
    }
}

toolBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelector('.options .active').classList.remove('active');
        btn.classList.add('active');
        selectedTool = btn.id;
    })
});

color.forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelector('.options .selected').classList.remove('selected');
        btn.classList.add('selected');
        selectedColor = window.getComputedStyle(btn).getPropertyValue('background-color');
    })
});

colorPicker.addEventListener('change', () => {
    colorPicker.parentElement.style.background = colorPicker.value;
    colorPicker.parentElement.click();
});

clearCanvas.addEventListener('click', () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
})

saveImg.addEventListener('click', () => {
    const link = document.createElement('a');
    link.download = `${Date.now()}.jpg`;
    link.href = canvas.toDataURL();
    link.click();
})
brushSize.addEventListener('change', () => brushWidth = brushSize.value);
canvas.addEventListener('mousemove', drawing)
canvas.addEventListener('mousedown', startdraw);
canvas.addEventListener('mouseup', () => isDrawing = false);

