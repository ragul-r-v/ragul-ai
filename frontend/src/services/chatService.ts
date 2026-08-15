import api from "./api";

// ==========================================
// CREATE CHAT
// ==========================================

export async function createChat() {
  const response = await api.post("/chat/new");

  return response.data;
}

// ==========================================
// NORMAL CHAT
// ==========================================

export async function sendMessage(chatId: number, message: string) {
  const response = await api.post("/chat", {
    chat_id: chatId,
    message,
  });

  return response.data.reply;
}

// ==========================================
// GET CHATS
// ==========================================

export async function getChats() {
  const response = await api.get("/chats");

  return response.data;
}

// ==========================================
// GET MESSAGES
// ==========================================

export async function getMessages(chatId: number) {
  const response = await api.get(`/chat/${chatId}/messages`);

  return response.data;
}

// ==========================================
// RENAME CHAT
// ==========================================

export async function renameChat(chatId: number, title: string) {
  const response = await api.put(`/chat/${chatId}`, {
    title,
  });

  return response.data;
}

// ==========================================
// DELETE CHAT
// ==========================================

export async function deleteChat(chatId: number) {
  const response = await api.delete(`/chat/${chatId}`);

  return response.data;
}

// ==========================================
// STREAM CHAT
// ==========================================

export async function streamChat(
  chatId: number,
  message: string,
  onChunk: (chunk: string) => void,
  signal?: AbortSignal,
) {
  const response = await fetch("http://127.0.0.1:8000/chat/stream", {
    method: "POST",

    headers: {
      "Content-Type": "application/json",
    },

    body: JSON.stringify({
      chat_id: chatId,
      message,
    }),

    signal,
  });

  if (!response.ok) {
    throw new Error(`Streaming request failed: ${response.status}`);
  }

  if (!response.body) {
    throw new Error("Streaming response body is empty");
  }

  const reader = response.body.getReader();

  const decoder = new TextDecoder();

  try {
    while (true) {
      const { done, value } = await reader.read();

      if (done) {
        break;
      }

      const chunk = decoder.decode(value, {
        stream: true,
      });

      if (chunk) {
        onChunk(chunk);
      }
    }

    const remaining = decoder.decode();

    if (remaining) {
      onChunk(remaining);
    }
  } finally {
    reader.releaseLock();
  }
}

// ==========================================
// REGENERATE CHAT
// ==========================================

export async function regenerateChat(
  chatId: number,
  onChunk: (chunk: string) => void,
) {
  const response = await fetch(
    `http://127.0.0.1:8000/chat/${chatId}/regenerate`,
    {
      method: "POST",

      headers: {
        "Content-Type": "application/json",
      },
    },
  );

  if (!response.ok) {
    throw new Error(`Regeneration failed: ${response.status}`);
  }

  if (!response.body) {
    throw new Error("Regeneration response is empty");
  }

  const reader = response.body.getReader();

  const decoder = new TextDecoder();

  try {
    while (true) {
      const { done, value } = await reader.read();

      if (done) {
        break;
      }

      const chunk = decoder.decode(value, {
        stream: true,
      });

      if (chunk) {
        onChunk(chunk);
      }
    }

    const remaining = decoder.decode();

    if (remaining) {
      onChunk(remaining);
    }
  } finally {
    reader.releaseLock();
  }
}
