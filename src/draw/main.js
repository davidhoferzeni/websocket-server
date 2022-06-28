class Position {
    constructor(posX, posY) {
        this.posX = posX;
        this.posY = posY;
    }

    resetPosition() {
        this.posX = null;
        this.posY = null;
    }

    strokeToPosition(position) {
        if (!position.isValid() || !this.isValid()) {
            return;
        }
        ctx.beginPath()
        ctx.moveTo(this.posX, this.posY)
        ctx.lineTo(position.posX, position.posY);
        ctx.stroke()
    }

    setPosition(newPosition) {
        this.posX = newPosition.posX;
        this.posY = newPosition.posY;
    }

    isValid() {
        return (typeof this.posX === "number") && (typeof this.posY === "number"); 
    }
}

const lastPosition = new Position();

let canvas = document.getElementById("canvas")
canvas.height = window.innerHeight
canvas.width = window.innerWidth
let ctx = canvas.getContext("2d")
ctx.lineWidth = 5

let prevX = null
let prevY = null

let draw = false
let clrs = document.querySelectorAll(".clr")
clrs = Array.from(clrs)
clrs.forEach(clr => {
    clr.addEventListener("click", () => {
        ctx.strokeStyle = clr.dataset.clr
    })
})

let clearBtn = document.querySelector(".clear")
clearBtn.addEventListener("click", () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height)
})

let saveBtn = document.querySelector(".save")
saveBtn.addEventListener("click", () => {
    let data = canvas.toDataURL("imag/png")
    let a = document.createElement("a")
    a.href = data
    a.download = "sketch.png"
    a.click()
})


window.addEventListener("pointerdown", onPointerDown);
window.addEventListener("pointerup", onPointerUp);
window.addEventListener("pointermove", onPointerMoved);


function setDrawActive(active = true) {
    draw = active;
}

function onPointerDown(event) {
    setDrawActive();
    event.stopPropagation();
}

function onPointerUp(event) {
    setDrawActive(false);
    event.stopPropagation();
    lastPosition.resetPosition();
}

function onPointerMoved(event) {
    event.stopPropagation();
    if (!draw) {
        return
    }
    const currentPosition = new Position(event.clientX, event.clientY);
    lastPosition.strokeToPosition(currentPosition);
    lastPosition.setPosition(currentPosition);
}