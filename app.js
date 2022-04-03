const express = require("express");
const socket = require("socket.io");
const port = process.env.PORT || 5000 ;

const app = express();

/*** -----------------------------  Creating Connection of localhost:3000 and our index.html file  ---------------------------- ***/

// To display the static file from given folder
app.use(express.static("public"));

// Server will start listening that is there any computer requesting to this port
let server = app.listen(port , () => {
    console.log("Listening to port" + port);
});

let io = socket(server);

io.on("connection" , (socket) => {
    console.log("Connection Established");
    

    // If any data comes with identifer "beginPath" this listener will be active
    socket.on("beginPath" , (data) => {
        // send it all computers
        io.sockets.emit("beginPath" , data); // This data can be modified accordingly if we modify "data" but here no need
    })

    socket.on("drawStroke" , (data) => {
        io.sockets.emit("drawStroke" , data); // This data can be modified accordingly if we modify "data" but here no need

    })

    socket.on("redoUndo" , (data) => {
        io.sockets.emit("redoUndo" , data);
    })
})
/*** -----------------------------  Connection estabished of localhost:3000 and our index.html file  ---------------------------- ***/
