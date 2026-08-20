const socket = io();

const welcomeScreen = document.getElementById("welcomeScreen");
const chatScreen = document.getElementById("chatScreen");

const usernameInput = document.getElementById("username");
const startBtn = document.getElementById("startBtn");

const messageInput = document.getElementById("messageInput");
const sendBtn = document.getElementById("sendBtn");

const messages = document.getElementById("messages");
const onlineStatus = document.getElementById("onlineStatus");

let username = "";

// Socket connected
socket.on("connect", () => {
    console.log("Connected to server:", socket.id);
    onlineStatus.textContent = "🟢 Online";
});

// Get Started
startBtn.addEventListener("click", () => {

    const name = usernameInput.value.trim();

    if (!name) {
        alert("Please enter your name.");
        return;
    }

    username = name;

    welcomeScreen.style.display = "none";
    chatScreen.style.display = "flex";

    messageInput.focus();

    socket.emit("joinChat", username);
});

// Send message
function sendMessage() {

    const message = messageInput.value.trim();

    if (!message) {
        return;
    }

    socket.emit("sendMessage", {
        username: username,
        message: message
    });

    messageInput.value = "";
    messageInput.focus();
}

// Send button
sendBtn.addEventListener("click", sendMessage);

// Enter key
messageInput.addEventListener("keydown", (event) => {

    if (event.key === "Enter") {
        sendMessage();
    }

});

// Receive message
socket.on("receiveMessage", (data) => {

    const messageElement = document.createElement("div");

    messageElement.classList.add("message");

    messageElement.innerHTML = `
        <strong>${data.username}</strong>
        <p>${data.message}</p>
    `;

    messages.appendChild(messageElement);

    messages.scrollTop = messages.scrollHeight;
});

// User joined
socket.on("userJoined", (name) => {

    const messageElement = document.createElement("div");

    messageElement.classList.add("system-message");

    messageElement.textContent = `${name} joined the chat`;

    messages.appendChild(messageElement);

});