<script setup lang="ts">
import { ref, watch } from 'vue';

const props = defineProps<{
  isOpen: boolean;
  addTodo: (todo: { todo: string; completed: boolean }) => void;
}>();
const emit = defineEmits(['close']);

const todoInput = ref("");
const error = ref("");

const validateInput = (value: string) => {
  if (!value.trim()) {
    error.value = "Todo title is required";
    return false;
  }
  if (value.trim().length < 3) {
    error.value = "Todo title must be at least 3 characters long";
    return false;
  }
  error.value = "";
  return true;
};

watch(todoInput, (value) => {
  if (error.value) validateInput(value);
});

const handleAddTodo = () => {
  if (validateInput(todoInput.value)) {
    props.addTodo({ todo: todoInput.value, completed: false });
    todoInput.value = "";
    error.value = "";
    emit('close');
  }
};

const handleClose = () => {
  todoInput.value = "";
  error.value = "";
  emit('close');
};
</script>

<template>
   <div
    v-if="props.isOpen"
    class="fixed inset-0 z-50 flex items-center justify-center"
    @keydown.esc="handleClose"
    tabindex="0"
    role="dialog"
    style="
      background: linear-gradient(135deg, rgba(224,203,218,0.7) 0%, rgba(159,84,214,0.7) 100%);
      backdrop-filter: blur(1px);
      transition: background 0.2s;
    "
  >
    <div
      class="w-full max-w-xl bg-[#e0cbda] rounded-xl shadow-lg p-8"
      role="dialog"
      aria-modal="true"
      aria-labelledby="add-todo-dialog-title"
      aria-describedby="add-todo-dialog-description"
    >
      <h2
        id="add-todo-dialog-title"
        class="mb-6 text-2xl font-bold font-serif text-gray-900"
      >
        Add New Todo
      </h2>
      <div id="add-todo-dialog-description" class="sr-only">
        Enter the title for your new todo item
      </div>
      <input
        v-model="todoInput"
        @blur="validateInput(todoInput)"
        placeholder="Enter todo title"
        class="w-full p-3 mb-2 border-2 rounded-lg font-serif text-gray-900 outline-none transition
               border-[#7127b5] focus:border-[#551c89] bg-white"
        :aria-invalid="!!error"
        aria-label="Todo title"
        aria-required="true"
        :aria-describedby="error ? 'todo-error-text' : undefined"
        autofocus
      />
      <div v-if="error" id="todo-error-text" class="text-sm text-red-600 font-serif mb-4 mt-1">
        {{ error }}
      </div>
      <div class="flex justify-end gap-4 mt-6">
        <button
          @click="handleClose"
          class="px-6 py-2 rounded bg-gray-400 text-white font-serif font-bold hover:bg-gray-600 focus:outline-none focus:ring focus:ring-gray-300 transition"
          aria-label="Cancel adding todo"
        >
          CANCEL
        </button>
        <button
          @click="handleAddTodo"
          :disabled="!todoInput.trim() || !!error"
          class="px-6 py-2 rounded bg-[#7127b5] text-white font-serif font-bold hover:bg-[#551c89] focus:outline-none focus:ring focus:ring-purple-300 transition"
          aria-label="Add new todo"
        >
          ADD TODO
        </button>
      </div>
    </div>
  </div>
</template>
