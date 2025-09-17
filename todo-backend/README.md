# todo-backend

This backend powers the real-time chat feature for the Vue Todo application.

---

## Getting Started

### Prerequisites

- [Bun](https://bun.sh/) v1.2.21 or later
- [Node.js](https://nodejs.org/) (if you want to run server.cjs directly)

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

## Getting Started

### Install dependencies

```bash
bun install
```

### Run the chat server

```bash
bun run index.ts
```

#### Using Node.js (for server.cjs)

```bash
node server.cjs
```

> This project was created using `bun init` in bun v1.2.21.  
> [Bun](https://bun.com) is a fast all-in-one JavaScript runtime.

---

> **Note:**  
> The main backend logic is currently in `server.cjs`, which uses Express and CommonJS syntax.  
> The `index.ts` file is a placeholder for Bun entry (not yet implemented).

---

## Project Structure

- `index.ts`: Entry point for the Bun chat server.
- `server.cjs`: (If present) May contain Express or Socket.IO logic for chat.
- `.gitignore`, `bun.lock`, `package.json`, `tsconfig.json`: Standard project files.

---

## License

MIT

---

## Credits

Created with [Bun](https://bun.sh/) and [Express](https://expressjs.com/).
