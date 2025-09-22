<script setup lang="ts">
import { ref } from 'vue';
import { useChatRealtime } from '../composables/useChatRealtime';

const username = ref('');
const avatar = ref('');
const messageInput = ref('');
const infoEntered = ref(false);


//call composable in setup
const { chatMessages, sendMessage } = useChatRealtime(username, avatar);

function handleInfoSubmit() {
  if (username.value.trim() && avatar.value.trim()) {
    infoEntered.value = true;
  }
}

function handleSend() {
  if (messageInput.value.trim() && infoEntered.value) {
    sendMessage({
    username: username.value,
      avatar: avatar.value,
      text: messageInput.value,
      time: new Date().toLocaleTimeString(),
    });
    messageInput.value = '';
  }
}
</script>

<template>
  <div class="chatbox">
    <div v-if="!infoEntered" class="mb-3">
      <h3 class="font-bold mb-2 text-purple-700">Enter Chat Info</h3>
      <input
        v-model="username"
        placeholder="Your name"
        class="rounded px-2 py-1 border w-full mb-2 text-purple-700 font-semibold"
      />
      <input
        v-model="avatar"
        placeholder="Avatar URL (paste image address or use a GitHub avatar)"
        class="rounded px-2 py-1 border w-full mb-2 text-purple-700 font-semibold"
      />
      <button
        @click="handleInfoSubmit"
        :disabled="!username || !avatar"
        class="bg-purple-700 text-white rounded px-4 py-2 w-full font-semibold"
      >
        Start Chat
      </button>
    </div>
    <div v-else>
      <div class="chat-messages">
        <div v-for="msg in chatMessages" :key="msg._id || msg.time + msg.text" class="chat-message flex items-center gap-3">
          <img :src="msg.avatar || 'https://avatar.iran.liara.run/public' " alt="avatar" class="w-8 h-8 rounded-full border border-purple-300" />
          <div>
            <span class="chat-username font-bold text-purple-700">{{ msg.username }}</span>
            <span class="chat-time ml-2 text-xs text-gray-500">{{ msg.time }}:</span>
            <div class="chat-text">{{ msg.text }}</div>
          </div>
        </div>
      </div>
      <div class="chat-input flex gap-2 mt-2">
        <input
          v-model="messageInput"
          placeholder="Type a message..."
          @keydown.enter="handleSend"
          class="chatbox-input"
        />
        <button @click="handleSend" class="chatbox-send">Send</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.chatbox {
  border: 2px solid #a855f7;
  border-radius: 10px;
  padding: 16px;
  max-width: 400px;
  margin: 0 auto;
  background: #f8f6ff;
}
.chat-messages {
  max-height: 250px;
  overflow-y: auto;
  margin-bottom: 12px;
  color: #6b7280;
}
.chat-message {
  margin-bottom: 8px;
  font-family: 'Segoe UI', Arial, sans-serif;
  color: #7c3aed;
}
.chat-username {
  color: #a855f7;
  margin-right: 4px;
}
.chat-time {
  color: #6b7280;
  font-weight: normal;
  margin-right: 6px;
}
.chat-input {
  display: flex;
  gap: 8px;
}
.chatbox-input {
  flex: 1;
  padding: 8px;
  border-radius: 6px;
  border: 1px solid #d1d5db;
  color: #7c3aed;
}
.chatbox-send {
  background: #a855f7;
  color: #fff;
  border: none;
  border-radius: 6px;
  padding: 8px 14px;
  cursor: pointer;
  font-weight: bold;
}
.chatbox-send:hover {
  background: #7c3aed;
}
</style>