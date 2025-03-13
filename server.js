// Import Required Libraries
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

// Initialize Express App and Server
const app = express();
const server = http.createServer(app);
const io = new Server(server);

// Serve Static Files from 'public' Directory
app.use(express.static('public'));

// Store Connected Users
const users = {};

// Handle Socket Connections
io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);

  // Handle Username Setting
  socket.on('set username', (username) => {
    users[socket.id] = username || 'Anonymous'; // Save the username, default to "Anonymous"
    console.log(`User ${socket.id} set their username to ${username}`);
  });

  // Handle Chat Messages
  socket.on('chat message', (message) => {
    const username = users[socket.id] || 'Anonymous'; // Get username, fallback to "Anonymous"
    const timestamp = new Date().toLocaleTimeString(); // Generate timestamp
    const msgData = { username, message, timestamp }; // Prepare message data

    console.log(`[${timestamp}] ${username}: ${message}`); // Log the message
    io.emit('chat message', msgData); // Broadcast message to all connected clients
  });

  // Handle User Disconnect
  socket.on('disconnect', () => {
    console.log(`User disconnected: ${socket.id}`);
    delete users[socket.id]; // Remove user from the list
  });
});

// Start the Server
const PORT = 3000;
server.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
