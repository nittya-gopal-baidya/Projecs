import { Server } from "socket.io";
import express from "express";
import { createServer } from "http";
import env from "dotenv";
const app = express();
const server = createServer(app);
const io = new Server(server);
env.config();
const PORT = process.env.PORT_NO;

app.use(express.static("public"));

const users = new Map();

const chatHistory = new Map();

io.on("connection", (socket) => {
  let username = "";
  let currentGroup = "";
  let recipient = "";

  socket.on("login", (user) => {
    if (users.has(user)) {
      socket.emit("loginError", "Username exists , please provide another one");
    } else {
      username = user;
      users.set(username, socket.id);
      console.log(`${username} logged in`);
      io.emit("userCount", users.size);
    }
  });

  socket.on("joinGroup", (groupName) => {
    if (currentGroup) {
      socket.leave(currentGroup);
    }
    socket.join(groupName);
    currentGroup = groupName;
    console.log(`${username} joined group ${groupName}`);

    if (chatHistory.has(currentGroup)) {
      const messageHistory = chatHistory.get(currentGroup);
      socket.emit("messageHistory", messageHistory);
    }
  });
  socket.on("chatMessage", (message) => {
    console.log("currentGroup: ", currentGroup, "Recipient: ", recipient);

    if (currentGroup) {
      if (!chatHistory.has(currentGroup)) {
        chatHistory.set(currentGroup, []);
      }
      chatHistory.get(currentGroup).push({ user: username, message });
    }

    if (currentGroup && currentGroup !== username) {
      io.to(currentGroup).emit("chatMessage", `${username}: ${message}`);
    }
  });

  socket.on("disconnect", () => {
    console.log("A user disconnected");
    users.delete(username);
    console.log(`${username} logged out`);
    io.emit("userCount", users.size);
  });
});

server.listen(PORT, () => {
  console.log("Server running on port", PORT);
});
