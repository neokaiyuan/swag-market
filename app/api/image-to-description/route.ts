import { openai } from "@ai-sdk/openai";
import { streamText } from "ai";

const developerMessage = `
This is a product image. Describe what it is, and how it might be useful. 

Speak as if you are the owner of the product, and you know exactly what this product is.

Do not reference yourself.
`;

export async function POST(request: Request) {
  if (!process.env.OPENAI_API_KEY) {
    console.error("Missing OpenAI API key");
    return new Response(JSON.stringify({ message: "Missing OpenAI API key" }), {
      headers: {
        "Content-Type": "application/json",
      },
    });
  }

  const { base64Image } = await request.json();

  try {
    const result = await streamText({
      model: openai("gpt-4o-mini"),
      system: developerMessage,
      messages: [
        {
          role: "user",
          content: [
            {
              type: "image",
              image: base64Image,
            },
          ],
        },
      ],
    });

    return result.toDataStreamResponse();
  } catch (error) {
    console.error("Error occurred in route handler:", error);
    return new Response(JSON.stringify({ message: "Internal Server Error" }), {
      headers: {
        "Content-Type": "application/json",
      },
    });
  }
}
