# Vue Todo Application

A full-stack Todo app featuring a modern Vue 3 frontend and a Bun-powered backend with real-time chat.

---

## Overview

This project consists of two main parts:

- **Frontend:**  
  Built with Vue 3, Vite, and Bun.  
  Features todo management and a real-time chat interface.

- **Backend:**  
  Powered by Bun and Express (CommonJS).  
  Provides a WebSocket server for real-time chat messages.

---

## Folder Structure

```
vue-todo/
├── todo-frontend/   # Vue 3 + Vite frontend
├── todo-backend/    # Bun backend (Express, WebSocket chat)
└── README.md        # Project documentation
```

---

## Features

- Add, edit, delete, and complete todos
- Real-time chat with username and avatar support
- Pagination and filtering for todos
- Modal for adding todos
- Error handling and not-found page
- Responsive, modern UI

---

## Getting Started

### Prerequisites

- [Bun](https://bun.sh/) v1.2.21 or later
- [Node.js](https://nodejs.org/) (optional, for backend compatibility)
- [MongoDB](https://www.mongodb.com/) (if you expand backend to use a database)

---

### Setup

#### 1. Clone the repository

```bash
git clone <repo-url>
cd vue-todo
```

#### 2. Install dependencies

```bash
cd todo-frontend
bun install

cd ../todo-backend
bun install
```

---

### Running the Application

#### Start the backend (chat server):

```bash
cd todo-backend
bun run index.ts
# or, if using server.cjs:
node server.cjs
```

#### Start the frontend:

```bash
cd todo-frontend
bun dev
```

---

## Usage

- **Todos:**  
  Add, edit, delete, and mark todos as complete/incomplete.  
  Filter and paginate your todo list.

- **Chat:**  
  Enter your username and avatar URL to join the chat.  
  Send and receive messages in real time.

---

## Project Structure Details

- **todo-frontend/**  
  Vue components, composables, pages, router, and utility functions.

- **todo-backend/**  
  Express server (server.cjs), Bun entry (index.ts), and chat logic.

---

## License

MIT

---

## Credits

Created with [Vue 3](https://vuejs.org/), [Vite](https://vitejs.dev/), and [Bun](https://bun.sh/).