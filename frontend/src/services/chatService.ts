import axios from "axios";

const API = "http://localhost:8000";

export const createChat = async () => {
  const res = await axios.post(`${API}/chat/new`);
  return res.data;
};

export const sendMessage = async (chatId: number, message: string) => {
  const res = await axios.post(`${API}/chat`, {
    chat_id: chatId,
    message,
  });

  return res.data;
};

export const getChats = async () => {
  const res = await axios.get(`${API}/chats`);
  return res.data;
};

export const getMessages = async (chatId: number) => {
  const res = await axios.get(`${API}/chat/${chatId}/messages`);

  return res.data;
};

export const renameChat = async (chatId: number, title: string) => {
  const res = await axios.put(`${API}/chat/${chatId}`, {
    title,
  });

  return res.data;
};

export const deleteChat = async (chatId: number) => {
  const res = await axios.delete(`${API}/chat/${chatId}`);

  return res.data;
};
