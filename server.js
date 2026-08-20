const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const { createClient } = require("@supabase/supabase-js");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

const PORT = process.env.PORT || 3000;

// Supabase
const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_ANON_KEY
);

// Public folder
app.use(express.static("public"));

// Test Supabase connection
app.get("/api/status", async (req, res) => {
    const { error } = await supabase
        .from("users")
        .select("id")
        .limit(1);

    if (error) {
        return res.status(500).json({
            success: false,
            error: error.message
        });
    }

    res.json({
        success: true,
        message: "FreeChat server and database connected!"
    });
});


// Socket.IO
io.on("connection", (socket) => {

    console.log("User connected:", socket.id);

    socket.on("disconnect", () => {
        console.log("User disconnected:", socket.id);
    });

});


server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});