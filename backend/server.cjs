const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const mongoose = require('mongoose');

// Use environment variable for MongoDB (never hardcode in cloud)
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/vue-todo';
mongoose.connect(MONGO_URI);

const ChatSchema = new mongoose.Schema({ text: String, time: String, username: String, avatar: String });
const ChatMsg = mongoose.model('ChatMsg', ChatSchema);

const app = express();

// Only allow requests from your frontend domains
const allowedOrigins = [
  'http://localhost:5174',
  'https://todo-wit-chat.pipeops.net',
  // Add your deployed frontend domain here!
];

app.use(cors({
  origin: allowedOrigins,
  credentials: true,
}));

app.use(express.json());

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

io.on('connection', async (socket) => {
  socket.emit('chatUpdate', await ChatMsg.find().sort({ _id: 1 }));


  socket.on('sendMessage', async (msg) => {
    await new ChatMsg(msg).save();
    io.emit('chatUpdate', await ChatMsg.find().sort({ _id: 1 }));
  });
});

app.get('/api/chats', async (req, res) => {
  res.json(await ChatMsg.find().sort({ _id: 1 }));
});

// Health check endpoint for cloud platforms
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', timestamp: new Date().toISOString() });
});

app.get('/', (req, res) => {
  res.status(200).json({ message: 'Socket.io server is running' });
});

// Use Render's provided port
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`Socket.io backend running at http://localhost:${PORT}`));