<script setup lang="ts">
import { ref, computed} from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useQuery, useMutation, useQueryClient } from '@tanstack/vue-query';
import { getTodosFromLocalStorage, updateTodoInLocalStorage } from '../utils/localStorageUtils';
import axios from 'axios';
import { useHead } from '@vueuse/head';
import { useToast } from 'vue-toastification';

const API_URL = 'https://dummyjson.com/todos';
const route = useRoute();
const router = useRouter();
const id = computed(() => parseInt(route.params.id as string));
const isEditing = ref(false);
const title = ref('');
const queryClient = useQueryClient();
const toast = useToast();

function isApiTodo(todoId: number) {
  return todoId < 100;
}

const { data: todo, isLoading, error } = useQuery({
  queryKey: ['todo', id.value],
  queryFn: async () => {
    const savedTodos = getTodosFromLocalStorage();
    // Ensure ID is valid
    if (!id.value) throw new Error('Todo ID is missing');
    const localTodo = savedTodos?.find((t: Todo) => t.id === id.value);
    // If found in local storage, return it
    if (localTodo) {
      title.value = localTodo.todo;
      return localTodo;
    }
    // If not found in local storage, fetch from API if ID indicates it's an API todo
    if (isApiTodo(id.value)) {
      const response = await axios.get(`${API_URL}/${id.value}`);
      title.value = response.data.todo;
      return response.data;
    }
    throw new Error('Todo not found');
  }
});

useHead({
  title: todo.value ? `${todo.value.todo} | Todo Details` : 'Todo Details',
  meta: [
    { name: 'description', content: todo.value ? `Details and status for "${todo.value.todo}".` : 'View details for your todo.' }
  ]
});

// Mutation for updating a todo
interface Todo {
      id: number;
      todo: string;
      completed: boolean;
      [key: string]: string | boolean | number;
    }

    interface UpdateTodoInput {
      todo: string;
    }

const updateTodoMutation = useMutation({
  mutationFn: async (updatedTodo: UpdateTodoInput) => {
    if (!id.value) throw new Error('Todo ID is missing');
    // Only call API if it's an API todo
    if (isApiTodo(id.value)) {
      try {
        const response = await axios.put(`${API_URL}/${id.value}`, {
          ...todo.value,
          todo: updatedTodo.todo
        });
        updateTodoInLocalStorage(id.value, response.data);
        return response.data;
      } catch (error) {
        // Log error but still update localStorage
        console.error('API error:', error);
        const updatedTodoData = { ...todo.value, todo: updatedTodo.todo };
        updateTodoInLocalStorage(id.value, updatedTodoData);
        return updatedTodoData;
      }
    } else {
      const updatedTodoData = { ...todo.value, todo: updatedTodo.todo };
      updateTodoInLocalStorage(id.value, updatedTodoData);
      return updatedTodoData;
    }
  },
  onSuccess: () => {
    queryClient.invalidateQueries({queryKey: ['todos']});
    queryClient.invalidateQueries({queryKey: ['todo', id.value]});
    isEditing.value = false;
    // You can use a Vue toast library for feedback
    toast.success('Todo updated successfully!');
  },
  onError: (error) => {
    // Only log error to console, do not block UI
    console.error('Mutation error:', error);
  }
});


// Handle edit submission
function handleEdit() {
  if (!title.value.trim()) return;
  updateTodoMutation.mutate({ todo: title.value });
}

// Start editing
function startEditing() {
  isEditing.value = true;
  title.value = todo.value?.todo || '';
}
</script>

<template>
  <section class="p-4">
    <div v-if="isLoading" class="text-gray-600">Loading...</div>
    <div v-else-if="error" class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mt-4 font-serif">
      <span class="mr-2">⚠️</span>
      {{ error.message }}
    </div>
    <div v-else-if="!todo" class="p-4 text-gray-700 font-serif">No todo found.</div>
    <div v-else>
      <div v-if="isEditing">
        <input
          type="text"
          v-model="title"
          aria-label="Edit todo title"
          class="w-full p-2 border border-gray-300 rounded-md mb-4 font-serif"
        />
        <button
          @click="handleEdit"
          aria-label="Save edited todo"
          :disabled="!title.trim()"
          :class="['px-4 py-2 rounded-md text-white font-serif', title.trim() ? 'bg-purple-700 hover:bg-purple-800 px-12 py-2 rounded-md' : 'bg-gray-300 cursor-not-allowed']"
        >
          Save
        </button>
      </div>
      <div v-else>
        <h1 class="text-2xl font-bold">{{ todo.todo}}</h1>
        <p class="mt-2 text-gray-700 font-serif">
          Status: {{ todo.completed ? "Completed" : "Pending" }}
        </p>
        <button
          @click="startEditing"
          class="mt-4 px-4 py-2 text-white bg-purple-700 hover:bg-purple-800 px-12 py-2 rounded-md font-serif cursor-pointer"
        >
          Edit Todo
        </button>
      </div>
      <button
        @click="router.push('/todos')"
        class="mt-4 px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gradient-to-r from-[#e0cbda] to-[#9f54d6] font-serif ml-2 cursor-pointer"
      >
        Back to Todo List
      </button>
      <!-- For toasts, use a Vue toast library like vue-toastification -->
    </div>
  </section>
</template>


<style>
  .custom-toast {
    background-color: rgb(81, 15, 125) !important;
    color: #fff;
    font-family: 'Helvetica Neue', Arial, sans-serif;
    border-radius: 8px;
    padding: 12px 16px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  }
</style>