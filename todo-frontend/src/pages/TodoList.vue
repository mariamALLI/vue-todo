<script setup lang="ts">
import { ref, computed } from 'vue'
import AddTodoModal from '../components/AddTodoModal.vue'
import PaginationControls from '../components/PaginationControl.vue'
import { useTodos } from '../composables/useTodos' // You’ll need to migrate this hook to a composable!
import { Trash2 } from 'lucide-vue-next'

// Head meta (for Vue, use @vueuse/head or vue-meta if you want dynamic titles)
import { useHead } from '@vueuse/head'
useHead({
  title: 'Todo List | My Todo App',
  meta: [{ name: 'description', content: 'View and manage your todos.' }],
})

export type Todo = {
  id: number
  todo: string
  completed: boolean
}

import type { Ref } from 'vue'

type useTodosReturnType = {
  todos: Ref<Todo[]>
  isLoading: Ref<boolean>
  error: Ref<Error | null>
  addTodo: (todo: Todo) => void
  deleteTodo: (id: number) => void
  toggleTodo: (id: number) => void
}

const { todos, isLoading, error, addTodo, deleteTodo, toggleTodo } =
  useTodos() as useTodosReturnType

const searchTerm = ref('')
const currentPage = ref(1)
const isModalOpen = ref(false)
const completionFilter = ref('all')
const todosPerPage = 10

function handleAddTodo(newTodo: { todo: string; completed?: boolean }) {
  if (!newTodo.todo || newTodo.todo.trim() === '') return
  const newId = Date.now()
  addTodo({ id: newId, todo: newTodo.todo, completed: false })
  searchTerm.value = ''
}

function handleDelete(id: number) {
  deleteTodo(id)
}

function handleToggleComplete(id: number) {
  toggleTodo(id)
}

function handleFilterChange(newFilter: string) {
  completionFilter.value = newFilter
  currentPage.value = 1
}

const filteredTodos = computed(() => {
  return todos.value.filter((todo) => {
    const matchesSearch = todo.todo?.toLowerCase().includes(searchTerm.value.toLowerCase())
    const matchesFilter =
      completionFilter.value === 'all'
        ? true
        : completionFilter.value === 'complete'
          ? todo.completed
          : !todo.completed
    return matchesSearch && matchesFilter
  })
})

const indexOfLastTodo = computed(() => currentPage.value * todosPerPage)
const indexOfFirstTodo = computed(() => indexOfLastTodo.value - todosPerPage)
const currentTodos = computed(() =>
  filteredTodos.value.slice(indexOfFirstTodo.value, indexOfLastTodo.value),
)

function handlePageChange(page: number) {
  currentPage.value = page
}
</script>

<template>
  <main class="p-4">
    <h1 class="text-2xl font-bold mb-4 font-serif">Todo List</h1>
    <section aria-label="Todo controls">
      <div class="mb-4">
        <label for="search-todos" class="sr-only">Search todos</label>
        <input
          id="search-todos"
          type="search"
          placeholder="Search todos..."
          v-model="searchTerm"
          class="w-full p-2 border border-gray-300 rounded-md font-serif text-gray-900 outline-none transition
                 focus:border-purple-700 bg-transparent"
          aria-label="Search todos"
        />
      </div>
      <div class="mb-4 flex gap-2">
        <button
          :class="[
            'px-4 py-2 rounded font-serif',
            completionFilter === 'all' ? 'bg-purple-700 text-white' : 'bg-gray-500',
          ]"
          @click="handleFilterChange('all')"
        >
          All
        </button>
        <button
          :class="[
            'px-4 py-2 rounded font-serif',
            completionFilter === 'complete' ? 'bg-purple-700 text-white' : 'bg-gray-500',
          ]"
          @click="handleFilterChange('complete')"
        >
          Completed
        </button>
        <button
          :class="[
            'px-4 py-2 rounded font-serif',
            completionFilter === 'incomplete' ? 'bg-purple-700 text-white' : 'bg-gray-500',
          ]"
          @click="handleFilterChange('incomplete')"
        >
          Incomplete
        </button>
      </div>
      <button
        @click="isModalOpen = true"
        class="bg-[#7127b5] text-white px-4 py-2 rounded-md hover:bg-[#551c89] font-serif font-semibold cursor-pointer"
        aria-label="Add new todo"
      >
        Add Todo
      </button>
    </section>
    <AddTodoModal :isOpen="isModalOpen" @close="isModalOpen = false" :addTodo="handleAddTodo" />
    <section aria-label="Todo list">
      <ul class="flex flex-col gap-4 mt-4 font-serif">
        <li
          v-for="todo in currentTodos"
          :key="todo.id"
          class="flex justify-between items-center p-2 border-b border-gray-300"
        >
          <div class="flex items-center">
            <input
              type="checkbox"
              :checked="todo.completed"
              @change="handleToggleComplete(todo.id)"
              :aria-label="`Toggle completion for ${todo.todo}`"
              class="appearance-none w-5 h-5 border-2 border-purple-700 rounded mr-2 cursor-pointer bg-transparent checked:bg-purple-700 checked:border-purple-700 custom-purple-checkbox"
            />
            <router-link
              :to="`/todos/${todo.id}`"
              class="ml-2 flex-1"
              :class="todo.completed ? 'line-through text-gray-500' : ''"
              :aria-label="`View details for ${todo.todo}`"
              >{{ todo.todo }}</router-link
            >
          </div>
          <button
            @click="handleDelete(todo.id)"
            class="bg-transparent text-white px-4 py-2 rounded-md hover:bg-red-400 font-serif"
            :aria-label="`Delete todo ${todo.todo}`"
            :title="`Delete todo ${todo.todo}`"
          >
            <span class="sr-only">Delete</span>
            <Trash2 class="h-5 w-5 text-white" />
          </button>
        </li>
      </ul>
    </section>
    <nav aria-label="Todo list pagination">
      <PaginationControls
        :currentPage="currentPage"
        :totalPages="Math.ceil(filteredTodos.length / todosPerPage)"
        @page-change="handlePageChange"
      />
    </nav>
    <div v-if="isLoading" class="mt-4 text-gray-600">Loading...</div>
    <div v-if="error" class="mt-4 text-red-600">Error: {{ error.message }}</div>
  </main>
</template>

<style scoped>
.custom-purple-checkbox {
  position: relative;
}
.custom-purple-checkbox:checked::after {
  content: '';
  display: block;
  position: absolute;
  top: -0.001rem;
  left: 0.35rem;
  width: 0.4rem;
  height: .7rem;
  border: solid white;
  border-width: 0 0.2rem 0.2rem 0;
  transform: rotate(45deg);
}
</style>
