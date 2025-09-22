const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const mongoose = require('mongoose');

// Use environment variable for MongoDB (never hardcode in cloud)
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/vue-todo';
mongoose.connect(MONGO_URI);
mongoose.connect('mongodb+srv://mariamalli_db_user:foLXx8TF82djgXOk@todo-backend.hucsc9o.mongodb.net/vue-todo?retryWrites=true&w=majority&appName=todo-backend')

// MongoDB Models
// const TodoSchema = new mongoose.Schema({ text: String, completed: Boolean });
// const Todo = mongoose.model('Todo', TodoSchema);

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
  }
});

io.on('connection', async (socket) => {
  // socket.emit('todosUpdate', await Todo.find().sort({ _id: -1 }));
  socket.emit('chatUpdate', await ChatMsg.find().sort({ _id: 1 }));

  // socket.on('addTodo', async (todo) => {
  //   await new Todo(todo).save();
  //   io.emit('todosUpdate', await Todo.find().sort({ _id: -1 }));
  // });

  // socket.on('deleteTodo', async (id) => {
  //   await Todo.deleteOne({ _id: id });
  //   io.emit('todosUpdate', await Todo.find().sort({ _id: -1 }));
  // });

  // socket.on('toggleTodo', async (id) => {
  //   const todo = await Todo.findById(id);
  //   if (todo) {
  //     todo.completed = !todo.completed;
  //     await todo.save();
  //     io.emit('todosUpdate', await Todo.find().sort({ _id: -1 }));
  //   }
  // });

  socket.on('sendMessage', async (msg) => {
    await new ChatMsg(msg).save();
    io.emit('chatUpdate', await ChatMsg.find().sort({ _id: 1 }));
  });
});

// Optional REST endpoints
// app.get('/api/todos', async (req, res) => {
//   res.json(await Todo.find().sort({ _id: -1 }));
// });

app.get('/api/chats', async (req, res) => {
  res.json(await ChatMsg.find().sort({ _id: 1 }));
});

// Use Render's provided port
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`Socket.io backend running at http://localhost:${PORT}`));