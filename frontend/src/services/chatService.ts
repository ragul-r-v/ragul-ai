import api from "./api";

export async function sendChatMessage(message: string) {
  const response = await api.post("/chat", {
    message,
  });

  return response.data.reply;
}
