const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const mongoose = require('mongoose');

// MongoDB setup
mongoose.connect('mongodb://localhost:27017/vue-todo');

// MongoDB Models
const TodoSchema = new mongoose.Schema({ text: String, completed: Boolean });
const Todo = mongoose.model('Todo', TodoSchema);

const ChatSchema = new mongoose.Schema({ text: String, time: String, username: String, avatar: String });
const ChatMsg = mongoose.model('ChatMsg', ChatSchema);

const app = express();
app.use(cors());
app.use(express.json());

const server = http.createServer(app);
const io = socketIo(server, { cors: { origin: '*' } });

io.on('connection', async (socket) => {
  // Send current todos and chat messages
  socket.emit('todosUpdate', await Todo.find().sort({ _id: -1 }));
  socket.emit('chatUpdate', await ChatMsg.find().sort({ _id: 1 }));

  // Add Todo
  socket.on('addTodo', async (todo) => {
    await new Todo(todo).save();
    io.emit('todosUpdate', await Todo.find().sort({ _id: -1 }));
  });

  // Delete Todo
  socket.on('deleteTodo', async (id) => {
    await Todo.deleteOne({ _id: id });
    io.emit('todosUpdate', await Todo.find().sort({ _id: -1 }));
  });

  // Toggle Todo
  socket.on('toggleTodo', async (id) => {
    const todo = await Todo.findById(id);
    if (todo) {
      todo.completed = !todo.completed;
      await todo.save();
      io.emit('todosUpdate', await Todo.find().sort({ _id: -1 }));
    }
  });

  // Chatting
  socket.on('sendMessage', async (msg) => {
    await new ChatMsg(msg).save();
    io.emit('chatUpdate', await ChatMsg.find().sort({ _id: 1 }));
  });
});

// Optional: REST endpoints for external CRUD (not used by Socket.io clients)
app.get('/api/todos', async (req, res) => {
  res.json(await Todo.find().sort({ _id: -1 }));
});
app.get('/api/chats', async (req, res) => {
  res.json(await ChatMsg.find().sort({ _id: 1 }));
});
// Start server

const PORT = 3000;
server.listen(PORT, () => console.log(`Socket.io backend running at http://localhost:${PORT}`));