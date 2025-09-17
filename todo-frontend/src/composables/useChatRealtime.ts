    import { ref, onMounted, onUnmounted } from 'vue';
import { io } from 'socket.io-client';
import type { Ref } from 'vue';

// Change to your Socket.io backend URL as needed
const SOCKET_URL = 'http://localhost:3000';
const socket = io(SOCKET_URL);

export type ChatMessage = {
  _id?: string;      // If using MongoDB
  text: string;
  time: string;
username: string;
  avatar: string;
};

export function useChatRealtime(username: Ref<string>, avatar: Ref<string>) {
  const chatMessages = ref<ChatMessage[]>([]);

  // Listen for chat updates from server
  onMounted(() => {
    socket.on('chatUpdate', (msgs: ChatMessage[]) => {
      chatMessages.value = msgs;
    });
  });

  onUnmounted(() => {
    socket.off('chatUpdate');
  });

  // Send a message to server
  const sendMessage = (msg: Omit<ChatMessage, '_id'>) => {
    socket.emit('sendMessage',{ ...msg, username:username.value, avatar:avatar.value });
  };

  return {
    chatMessages,
    sendMessage,
  };
}