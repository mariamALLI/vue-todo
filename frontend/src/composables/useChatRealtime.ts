import { ref, onMounted, onUnmounted } from "vue";
import { io } from "socket.io-client";
import type { Ref } from "vue";

// Socket.io backend URL (ensure this matches your backend server)
const SOCKET_URL = "https://todo-backend.pipeops.net/";
const socket = io(SOCKET_URL, {
  transports: ["websocket", "polling"],
  timeout: 20000,
  reconnection: true,
  reconnectionDelay: 1000,
  reconnectionAttempts: 5,
});

export type ChatMessage = {
  _id?: string; // If using MongoDB
  text: string;
  time: string;
  username: string;
  avatar: string;
};

export function useChatRealtime(username: Ref<string>, avatar: Ref<string>) {
  const chatMessages = ref<ChatMessage[]>([]);
  const connectionStatus = ref("disconnected");

  // Listen for chat updates from server
  onMounted(() => {
    // Connection event listeners
    socket.on("connect", () => {
      console.log("Socket connected:", socket.id);
      connectionStatus.value = "connected";
    });

    // Disconnection event listener
    socket.on("disconnect", (reason) => {
      console.log("Socket disconnected:", reason);
      connectionStatus.value = "disconnected";
    });

    // Handle connection errors
    socket.on("connect_error", (error) => {
      console.error("Socket connection error:", error);
      connectionStatus.value = "error";
    });

    // Listen for chat updates
    socket.on("chatUpdate", (msgs: ChatMessage[]) => {
      chatMessages.value = msgs;
    });
  });

  // Clean up listeners on unmount
  onUnmounted(() => {
    socket.off("connect");
    socket.off("disconnect");
    socket.off("connect_error");
    socket.off("chatUpdate");
  });

  // Send a message to server
  const sendMessage = (msg: Omit<ChatMessage, "_id">) => {
    if (socket.connected) {
      socket.emit("sendMessage", {
        ...msg,
        username: username.value,
        avatar: avatar.value,
      });
    } else {
      console.error("Socket not connected. Message not sent.");
    }
  };

  return {
    chatMessages,
    sendMessage,
    connectionStatus,
  };
}
