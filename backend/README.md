# todo-backend

This backend powers the real-time chat feature for the Vue Todo application.

---

## Tech Stack

- [Node.js](https://nodejs.org/)
- [Express](https://expressjs.com/)
- [Socket.IO](https://socket.io/) (for real-time chat)
- TypeScript

---

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) v16 or later
- [npm](https://www.npmjs.com/) (comes with Node.js)

---

## Chat Messages

- Provides a WebSocket server for real-time chat.
- Users can connect, send messages, and receive messages instantly.
- Each chat message includes:
  - `username`: The sender's name
  - `avatar`: The sender's avatar image URL
  - `text`: The message content
  - `time`: Timestamp when the message was sent

---

## Usage

### Install dependencies

```bash
npm install
```

### Run the chat server

```bash
npm start
```

#### For development (with auto-restart)

```bash
npm run dev
```

---

## Project Structure

- `index.ts`: Entry point for the chat server.
- `server.cjs`: contain Express and Socket.IO logic for chat.
- `.gitignore`, `package-lock.json`, `package.json`, `tsconfig.json`: Standard project files.

---

## License

MIT

---

## Credits

Created with [Node.js](https://nodejs.org/), [Express](https://expressjs.com/), and [Socket.IO](https://socket.io/).
