import type { Message } from "../pages/ChatPage";

export type Chat = {
  id: string;
  title: string;
  messages: Message[];
};
