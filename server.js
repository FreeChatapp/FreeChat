const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const app = express();

const server = http.createServer(app);

const io = new Server(server);

const PORT = process.env.PORT || 3000;

// Public folder
app.use(express.static("public"));


// Socket connection
io.on("connection", (socket) => {

    console.log("User connected:", socket.id);


    // User joins chat
    socket.on("joinChat", (username) => {

        console.log(`${username} joined the chat`);

        socket.username = username;

        io.emit("userJoined", username);

    });


    // Receive and broadcast message
    socket.on("sendMessage", (data) => {

        console.log(`${data.username}: ${data.message}`);

        io.emit("receiveMessage", {
            username: data.username,
            message: data.message
        });

    });


    // User disconnects
    socket.on("disconnect", () => {

        console.log("User disconnected:", socket.id);

    });

});


server.listen(PORT, () => {

    console.log(`Server running on port ${PORT}`);

});