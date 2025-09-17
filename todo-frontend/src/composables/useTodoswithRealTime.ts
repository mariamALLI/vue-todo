import { ref, watch, onMounted, onUnmounted } from 'vue';
import { useQuery } from '@tanstack/vue-query';
import { io } from 'socket.io-client';
import axios from 'axios';

// Your dummyjson API for initial fetch
const API_URL = 'https://dummyjson.com/todos';
// Your Socket.io backend URL (change to your deployed server in production)
const SOCKET_URL = 'http://localhost:3000';

const socket = io(SOCKET_URL);

export type Todo = {
  id: number;
  todo: string;
  completed: boolean;
};

export function useTodosWithRealtime() {
  const todos = ref<Todo[]>([]);
  const isLoading = ref(true);
  const error = ref<Error | null>(null);

  // 1. Initial fetch with TanStack Query (dummyjson or your REST endpoint)
  const { data, isLoading: queryLoading, error: queryError } = useQuery({
    queryKey: ['todos'],
    queryFn: async () => {
      const response = await axios.get(API_URL);
      // dummyjson uses .todos field
      return response.data.todos as Todo[];
    },
    staleTime: 1000 * 60, // 1 minute
  });

  // Watch for API data changes and update todos value
  watch(data, (apiTodos) => {
    if (apiTodos && apiTodos.length > 0) {
      todos.value = apiTodos;
      isLoading.value = queryLoading.value;
      error.value = queryError.value as Error | null;
    }
  }, { immediate: true });

  // 2. Listen for Socket.io real-time updates
  onMounted(() => {
    socket.on('todosUpdate', (newTodos: Todo[]) => {
      todos.value = newTodos;
      isLoading.value = false;
    });
  });
  onUnmounted(() => {
    socket.off('todosUpdate');
  });

  // 3. Real-time CRUD actions (goes through Socket.io backend)
  const addTodo = (todo: { todo: string; completed?: boolean }) => {
    // id is optional; your backend should handle it, or set it here
    socket.emit('addTodo', {
      id: Date.now(),
      todo: todo.todo,
      completed: todo.completed ?? false,
    });
  };

  const deleteTodo = (id: number) => {
    socket.emit('deleteTodo', id);
  };

  const toggleTodo = (id: number) => {
    socket.emit('toggleTodo', id);
  };

  return {
    todos,
    isLoading,
    error,
    addTodo,
    deleteTodo,
    toggleTodo,
  };
}