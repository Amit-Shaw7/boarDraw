// const { Socket } = require("engine.io");
// const { isObject } = require("util");

let canvas = document.querySelector("canvas");
canvas.height = window.innerHeight;
canvas.width = window.innerWidth;

let pencilColor = document.querySelectorAll(".pencil-color");
let penColor = "red";

let pencilWidth = document.querySelector(".pencil-width");
let penWidth = pencilWidth.value;

let eraserWidthInput = document.querySelector(".eraser-width");
let eraserColor = "white";
let eraserWidth = eraserWidthInput.value;

let download = document.querySelector(".download");

let undo = document.querySelector(".undo");
let redo = document.querySelector(".redo");
let undoRedoTracker = []; // Data
let track = 0; // Represent current action to be performed

let mouseDown = false;

// API 
let tool = canvas.getContext("2d");
tool.lineWidth = 3;
tool.strokeStyle = "red";

// Mouse clicked -> new path , draw 
canvas.addEventListener('mousedown', (e) => {
    mouseDown = true; // Clicked
    // beginPath({ // Parameter
    //     x: e.clientX,
    //     y: e.clientY,
    // })
    let data = {
        x: e.clientX,
        y: e.clientY,
    }

    //  Sending Data to server
    socket.emit("beginPath", data); // "data" -> data from frontend 
});

// tracking mouse movement
canvas.addEventListener("mousemove", (e) => {
    if (mouseDown) { // Clicked
        // drawStroke({ // Parameter
        //     x: e.clientX,
        //     y: e.clientY,
        //     color:eraseFlag?eraserColor:penColor,
        //     width:eraseFlag?eraserWidth:penWidth
        // })

        let data = {
            x: e.clientX,
            y: e.clientY,
            color: eraseFlag ? eraserColor : penColor,
            width: eraseFlag ? eraserWidth : penWidth
        }
        //  Sending Data to server
        socket.emit("drawStroke", data); // "data" -> data from frontend 
    }
});

//mouse unclicked
canvas.addEventListener("mouseup", (e) => {
    mouseDown = false; // Clicked = !clicked

    //MouseUp => 
    // one step done store it in array in form of url
    let url = canvas.toDataURL();
    undoRedoTracker.push(url);
    track = undoRedoTracker.length - 1; //Curr Position
});

undo.addEventListener('click', (e) => {
    if (track > 0) track--;
    // action
    // let trackObj = {
    //     trackValue: track,
    //     undoRedoTracker
    // }
    // undoRedoCanvas(trackObj)

    let data = {
        trackValue: track,
        undoRedoTracker
    }
    socket.emit("redoUndo" , data);
});
redo.addEventListener('click', (e) => {
    if (track < undoRedoTracker.length - 1) track++;
    // Actions
    // let trackObj = {
    //     trackValue: track,
    //     undoRedoTracker
    // }
    // undoRedoCanvas(trackObj);

    let data = {
        trackValue: track,
        undoRedoTracker
    }
    socket.emit("redoUndo" , data);
});

function undoRedoCanvas(trackObj) {
    track = trackObj.trackValue;
    undoRedoTracker = trackObj.undoRedoTracker;

    let url = undoRedoTracker[track];
    let img = new Image(); // new iamge refference element
    img.src = url;
    img.onload = () => {
        tool.drawImage(img, 0, 0, canvas.width, canvas.height);

    }


}


function beginPath(strokeObj) {
    tool.beginPath(); // New Path
    tool.moveTo(strokeObj.x, strokeObj.y); // Start Drawing From
}
function drawStroke(strokeObj) {
    tool.strokeStyle = strokeObj.color;
    tool.lineWidth = strokeObj.width;
    tool.lineTo(strokeObj.x, strokeObj.y); // Draw Upto (if mouseup this will not execute)
    tool.stroke(); // Makes line visibles
}

pencilColor.forEach((colorElem) => {
    colorElem.addEventListener('click', (e) => {
        let color = colorElem.classList[0];
        penColor = color;
        tool.strokeStyle = penColor;
    })
})

pencilWidth.addEventListener("change", (e) => {
    width = pencilWidth.value;
    penWidth = width;
    tool.lineWidth = penWidth;
})

eraserWidthInput.addEventListener("change", (e) => {
    eraserWidth = eraserWidthInput.value;
    tool.lineWidth = eraserWidth;
})

eraser.addEventListener('click', (e) => {
    if (eraseFlag) {
        tool.strokeStyle = eraserColor;
        tool.lineWidth = eraserWidth;
    } else {
        tool.strokeStyle = penColor;
        tool.lineWidth = penWidth;
    }
});

download.addEventListener('click', (e) => {
    let url = canvas.toDataURL();
    let a = document.createElement("a");
    a.href = url;
    a.download = "board.jpg";
    a.click();
})

// Recieeving data from server
socket.on("beginPath", (data) => {
    // "data" -> data from server 
    beginPath(data);
});

socket.on("drawStroke", (data) => {
    drawStroke(data);
})

socket.on("redoUndo" , (data) => {
    undoRedoCanvas(data)
})
