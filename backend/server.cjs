const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const mongoose = require('mongoose');

// Use environment variable for MongoDB (never hardcode in cloud)
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/vue-todo';
mongoose.connect(MONGO_URI);

// Define a schema and model for chat messages
const ChatSchema = new mongoose.Schema({ text: String, time: String, username: String, avatar: String });
const ChatMsg = mongoose.model('ChatMsg', ChatSchema);

// Initialize Express app
const app = express();

// Only allow requests from your frontend domains
const allowedOrigins = [
  'http://localhost:5174',

  // Add your deployed frontend domain here!
  'https://todo-wit-chat.pipeops.net',
];

// CORS configuration for Express and Socket.io to allow credentials like cookies and auth headers from allowed origins only
// The CORS means Cross-Origin Resource Sharing which is a security feature implemented by web browsers to restrict web pages from making requests to a different domain than the one that served the web page. 
// This is important for security, especially when dealing with user authentication and sensitive data.
app.use(cors({
  origin: allowedOrigins,
  credentials: true,
}));


// Middleware to parse JSON bodies in requests (for POST requests) 
// This allows the server to handle incoming JSON data in the request body, which is common in APIs.
app.use(express.json());


// Create HTTP server and integrate with Socket.io for real-time communication 
const server = http.createServer(app);

// Socket.io CORS config
const io = socketIo(server, {
  cors: {
    origin: allowedOrigins,
    methods: ['GET', 'POST'],
    credentials: true,
  },
  // Add these configurations for better cloud compatibility
  transports: ['websocket', 'polling'],
  allowEIO3: true,
  pingTimeout: 60000,
  pingInterval: 25000,
});

// Handle Socket.io connections and events 
io.on('connection', async (socket) => {
  socket.emit('chatUpdate', await ChatMsg.find().sort({ _id: 1 }));

// Listen for new chat messages from clients and broadcast updates to all connected clients 
  socket.on('sendMessage', async (msg) => {
    await new ChatMsg(msg).save();
    io.emit('chatUpdate', await ChatMsg.find().sort({ _id: 1 }));
  });
});


// REST endpoint to fetch all chat messages (for initial load)
app.get('/api/chats', async (req, res) => {
  res.json(await ChatMsg.find().sort({ _id: 1 }));
});

// Health check endpoint for cloud platforms
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Basic root endpoint to verify server is running
app.get('/', (req, res) => {
  res.status(200).json({ message: 'Socket.io server is running' });
});

// Start the server on specified PORT (default to 3000) and log the URL
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`Socket.io backend running at http://localhost:${PORT}`));