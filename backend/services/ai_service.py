import os

from dotenv import load_dotenv
from google import genai

load_dotenv()

client = genai.Client(
    api_key=os.getenv("GEMINI_API_KEY")
)


def read_file(path: str):
    with open(path, "r", encoding="utf-8") as file:
        return file.read()


system_prompt = read_file("prompts/system_prompt.txt")
about_me = read_file("knowledge/about_me.md")


def build_prompt(messages):
    conversation = ""

    for msg in messages:
        if msg.sender == "user":
            conversation += f"User: {msg.message}\n"
        else:
            conversation += f"Assistant: {msg.message}\n"

    prompt = f"""
{system_prompt}

PERSONAL KNOWLEDGE ABOUT RAGUL:
{about_me}

CONVERSATION HISTORY:
{conversation}

IMPORTANT INSTRUCTIONS:
- Answer general technical and knowledge questions using your general knowledge.
- Use the personal knowledge above when the user asks about Ragul.
- Do not restrict your answers only to the personal knowledge.
- Do not say "I don't have that information yet" merely because something is absent from the personal knowledge.
- Use conversation history when it is relevant.
- Give clear and useful answers.
- For programming questions, provide explanations and examples.

LATEST USER QUESTION:
{conversation.split("User:")[-1]}

ASSISTANT:
"""

    return prompt


def ask_ai(messages):
    prompt = build_prompt(messages)

    try:
        response = client.models.generate_content(
            model="gemini-2.5-flash",
            contents=prompt,
        )

        return response.text

    except Exception as e:
        print("Gemini Error:", e)

        return (
            "⚠️ Sorry, I'm temporarily unavailable. "
            "Please try again in a few moments."
        )


def stream_ai(messages):
    prompt = build_prompt(messages)

    try:
        response = client.models.generate_content_stream(
            model="gemini-2.5-flash",
            contents=prompt,
        )

        for chunk in response:
            if chunk.text:
                yield chunk.text

    except Exception as e:
        print("Gemini Streaming Error:", e)

        yield (
            "⚠️ Sorry, I'm temporarily unavailable. "
            "Please try again in a few moments."
        )