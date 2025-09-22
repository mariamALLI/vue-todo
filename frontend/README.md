# Vue Todo Frontend

This is the frontend for the Vue Todo application, built with **Vue 3**, **Vite**, and **Bun**.  
It features a todo list, real-time chat, and a modern UI.

---

## Features

- Add, edit, delete, and complete todos
- Real-time chat with username and avatar support
- Pagination for todos
- Modal for adding todos
- Error handling and not-found page
- Responsive design

---

## Project Structure

```text
todo-frontend/
├── public/                # Static assets
├── src/
│   ├── components/        # Reusable UI components (AddTodoModal, ChatBox, NavBar, etc.)
│   ├── composables/       # Custom Vue composables (useChatRealtime, useTodos, etc.)
│   ├── pages/             # Main app pages (TodoList, TodoDetails, NotFoundPage, etc.)
│   ├── router/            # Vue Router setup
│   ├── utils/             # Utility functions (localStorageUtils)
│   ├── App.vue            # Root component
│   ├── main.ts            # App entry point
│   └── index.css          # Global styles
├── index.html
├── package.json
├── bun.lock
├── tsconfig*.json
├── vite.config.ts
└── README.md
```

---

## Getting Started

### Prerequisites

- [Bun](https://bun.sh/) v1.2.21 or later
- [Node.js](https://nodejs.org/) (optional, for compatibility)

---

### Installation

Install dependencies with Bun:

```bash
bun install
```

---

### Development

Start the development server with hot reload:

```bash
bun dev
```

---

### Build for Production

Type-check, compile, and minify:

```bash
bun run build
```

---

### Linting

Check code style with ESLint:

```bash
bun lint
```

---

## Usage

- **Todos:**  
  - Add new todos using the modal.
  - Edit or delete existing todos.
  - Mark todos as complete/incomplete.
  - Filter and search todos.
  - Paginate through the todo list.

- **Chat:**  
  - Enter your username and avatar URL to join the chat.
  - Send and receive messages in real time.
  - Each message displays the sender’s name, avatar, and timestamp.

---

## Recommended IDE Setup

- [VSCode](https://code.visualstudio.com/) + [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar)
- Disable Vetur for best Vue 3 experience.

---

## Type Support for `.vue` Imports in TS

TypeScript cannot handle type information for `.vue` imports by default.  
Use [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) for editor support.

---

## Customize Configuration

See [Vite Configuration Reference](https://vite.dev/config/).

---

## License

MIT

---

## Credits

Created with [Vue 3](https://vuejs.org/), [Vite](https://vitejs.dev/), and [Bun](https://bun.sh/).
