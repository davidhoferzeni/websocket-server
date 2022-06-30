// classes 

class Canvas {
    constructor(canvas) {
        this.canvasObject = typeof canvas === "string" ? document.getElementById(canvas) : canvas;
        this.expandCanvas();
        this.context = this.canvasObject.getContext("2d");
    }
    expandCanvas() {
        this.canvasObject.height = window.innerHeight
        this.canvasObject.width = window.innerWidth
    }

    saveCanvas() {
        let data = pageCanvas.canvasObject.toDataURL("imag/png")
        let a = document.createElement("a");
        a.href = data;
        a.download = "sketch.png";
        a.click();
    }

    clearCanvas() {
        this.context.clearRect(0, 0, this.canvasObject.width, this.canvasObject.height);
    }
}

class Brush {
    constructor(canvas, colour = null, lineWidth = null) {
        this.setCanvas(canvas);
        this.setLineWidth(lineWidth);
        this.colour = colour;
        this.currentPosition = new Position();
        this.isDrawing = false;
    }

    strokeToPosition(position) {
        if (!position.isValid() || !this.currentPosition.isValid()) {
            return;
        }
        this.setCanvasColour();
        this.canvasContext.beginPath()
        this.canvasContext.moveTo(this.currentPosition.posX, this.currentPosition.posY)
        this.canvasContext.lineTo(position.posX, position.posY);
        this.canvasContext.stroke()
    }

    setCanvas(canvas) {
        this.canvasContext = canvas.context;
    }

    setLineWidth(lineWidth) {
        this.canvasContext.lineWidth = lineWidth || 5;
    }

    setCanvasColour() {
        this.canvasContext.strokeStyle = this.colour;
    }

    changeColour(colour) {
        this.colour = colour;
    }

    setIsDrawing(newState = null) {
        this.isDrawing = newState === null ? !this.isDrawing : newState;
    }

    setPosition(newPosition) {
        this.currentPosition = newPosition;
    }

    resetPosition() {
        this.currentPosition.resetPosition();
    }

}

class Position {
    constructor(posX, posY) {
        this.posX = posX;
        this.posY = posY;
    }

    resetPosition() {
        this.posX = null;
        this.posY = null;
    }

    isValid() {
        return (typeof this.posX === "number") && (typeof this.posY === "number");
    }
}


// global

const pageCanvas = new Canvas("canvas");
const pageBrush = new Brush(pageCanvas, "#000");

// event hooks

let clrs = document.querySelectorAll(".clr")
clrs = Array.from(clrs)
clrs.forEach(clr => {
    clr.addEventListener("click", () => {
        pageBrush.changeColour(clr.dataset.clr);
    })
})

let clearBtn = document.querySelector(".clear")
clearBtn.addEventListener("click", () => {
   pageCanvas.clearCanvas();
})

let saveBtn = document.querySelector(".save")
saveBtn.addEventListener("click", () => {
    pageCanvas.saveCanvas();
})


window.addEventListener("pointerdown", onPointerDown);
window.addEventListener("pointerup", onPointerUp);
window.addEventListener("pointermove", onPointerMoved);


function setDrawActive(active = true) {
   pageBrush.setIsDrawing(active);
}

function getPositionFromEvent(event) {
    return new Position(event.clientX, event.clientY);
}

function onPointerDown(event) {
    event.stopPropagation();
    setDrawActive();
    pageBrush.setPosition(getPositionFromEvent(event));
}

function onPointerUp(event) {
    event.stopPropagation();
    setDrawActive(false);
    pageBrush.resetPosition();
}

function onPointerMoved(event) {
    event.stopPropagation();
    if (!pageBrush.isDrawing) {
        return
    }
    const currentPosition = getPositionFromEvent(event);
    sendStrokeToSocket(pageBrush, currentPosition);
    pageBrush.strokeToPosition(currentPosition);
    pageBrush.setPosition(currentPosition);
}


// region: set sockets

var socket = io();

function sendStrokeToSocket(brush, newPosition) {
    socket.emit('chatMessage', JSON.stringify({ from: brush.currentPosition, to: newPosition, colour: brush.colour }));
}

socket.on('chatMessage', function (brushInfoJson) {
    const brushInfo = JSON.parse(brushInfoJson);
    const fromPosition = new Position(brushInfo.from.posX, brushInfo.from.posY);
    const toPosition = new Position(brushInfo.to.posX, brushInfo.to.posY);
    const foreignBrush = new Brush(pageCanvas, brushInfo.colour);
    foreignBrush.setPosition(fromPosition);
    foreignBrush.strokeToPosition(toPosition);
});
