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


def ask_ai(question: str):

    prompt = f"""
{system_prompt}

Knowledge:

{about_me}

User Question:

{question}
"""

    response = client.models.generate_content(
        model="gemini-2.5-flash",
        contents=prompt,
    )

    return response.text