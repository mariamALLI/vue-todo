import { ref } from 'vue';
import { useQuery, useMutation, useQueryClient } from '@tanstack/vue-query';
import axios from 'axios';
import {
  getTodosFromLocalStorage,
  saveTodosToLocalStorage,
  updateTodoInLocalStorage,
} from '../utils/localStorageUtils';
import type { Todo } from '../pages/TodoList.vue';

export type useTodosReturnType = {
  todos: typeof ref<Todo[]>;
  isLoading: typeof ref<boolean>;
  error: typeof ref<unknown>;
  addTodo: (newTodo: { todo: string }) => void;
  deleteTodo: (id: number) => void;
  toggleTodo: (id: number) => void;
};

const API_URL = 'https://dummyjson.com/todos';

export function useTodos() {
  const queryClient = useQueryClient();

  const { data: todos = ref([]), isLoading, error } = useQuery({
    queryKey: ['todos'],
    queryFn: async () => {
      const savedTodos = getTodosFromLocalStorage();
      if (savedTodos?.length > 0) {
        return savedTodos;
      }
      try {
        const response = await axios.get(API_URL);
        const apiTodos = response.data.todos;
        saveTodosToLocalStorage(apiTodos);
        return apiTodos;
      } catch (error) {
        console.error('Error fetching todos:', error);
        return [];
      }
    },
  });

  const addTodoMutation = useMutation({
    mutationFn: async (newTodo: { todo: string }) => {
      try {
        const response = await axios.post(
          API_URL + '/add',
          {
            todo: newTodo.todo,
            completed: false,
            userId: Math.floor(Math.random() * 10) + 1,
          },
          {
            headers: { 'Content-Type': 'application/json' },
          }
        );
        const currentTodos = getTodosFromLocalStorage() || [];
        const apiTodo = { ...response.data, id: Date.now() };
        const updatedTodos = [apiTodo, ...currentTodos];
        saveTodosToLocalStorage(updatedTodos);
        return apiTodo;
      } catch (error) {
        console.error('Error adding todo to API:', error);
        const localTodo = {
          id: Date.now(),
          todo: newTodo.todo,
          completed: false,
          userId: Math.floor(Math.random() * 10) + 1,
        };
        const currentTodos = getTodosFromLocalStorage() || [];
        const updatedTodos = [localTodo, ...currentTodos];
        saveTodosToLocalStorage(updatedTodos);
        return localTodo;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['todos'] });
    },
  });

  const deleteTodoMutation = useMutation({
    mutationFn: async (todoId: number) => {
      const isApiTodo = todoId < 100;
      if (isApiTodo) {
        try {
          await axios.delete(`${API_URL}/${todoId}`);
        } catch (error) {
          console.error('Error deleting todo from API:', error);
        }
      }
      const currentTodos = getTodosFromLocalStorage() || [];
      const updatedTodos = currentTodos.filter((todo) => todo.id !== todoId);
      saveTodosToLocalStorage(updatedTodos);
      return todoId;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['todos'] });
    },
  });

  const toggleTodoMutation = useMutation({
    mutationFn: async (todoId: number) => {
      const currentTodos = getTodosFromLocalStorage() || [];
      const todoToUpdate = currentTodos.find((todo) => todo.id === todoId);
      if (!todoToUpdate) throw new Error('Todo not found');
      const isApiTodo = todoId < 100;
      try {
        if (isApiTodo) {
          const response = await axios.put(
            `${API_URL}/${todoId}`,
            {
              ...todoToUpdate,
              completed: !todoToUpdate.completed,
            },
            {
              headers: { 'Content-Type': 'application/json' },
            }
          );
          updateTodoInLocalStorage(todoId, response.data);
          return response.data;
        } else {
          const updatedTodo = { ...todoToUpdate, completed: !todoToUpdate.completed };
          updateTodoInLocalStorage(todoId, updatedTodo);
          return updatedTodo;
        }
      } catch (error) {
        console.error('Error updating todo in API:', error);
        const updatedTodo = { ...todoToUpdate, completed: !todoToUpdate.completed };
        updateTodoInLocalStorage(todoId, updatedTodo);
        return updatedTodo;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['todos'] });
    },
  });

  return {
    todos,
    isLoading,
    error,
    addTodo: addTodoMutation.mutate,
    deleteTodo: deleteTodoMutation.mutate,
    toggleTodo: toggleTodoMutation.mutate,
  };
}
