import api from "./api";

export async function createChat() {
  const response = await api.post("/chat/new");
  return response.data;
}

export async function sendMessage(chatId: number, message: string) {
  const response = await api.post("/chat", {
    chat_id: chatId,
    message,
  });

  return response.data.reply;
}

export async function getChats() {
  const response = await api.get("/chats");
  return response.data;
}

export async function getMessages(chatId: number) {
  const response = await api.get(`/chat/${chatId}/messages`);

  return response.data;
}
