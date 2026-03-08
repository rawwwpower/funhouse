import Anthropic from "@anthropic-ai/sdk";
import { z } from "zod/v4";
import {
  CLASSIFY_SYSTEM_PROMPT,
  buildClassificationPrompt,
} from "./prompts";
import { CONTENT_CATEGORIES } from "@/lib/constants";

const ClassificationSchema = z.object({
  title: z.string().max(80),
  description: z.string().max(300),
  tags: z.array(z.string()).min(1).max(5),
  content_category: z.enum(CONTENT_CATEGORIES),
  key_topics: z.array(z.string()).min(1).max(3),
  language: z.string().min(2).max(5),
  confidence: z.number().min(0).max(1),
});

export type Classification = z.infer<typeof ClassificationSchema>;

let anthropicClient: Anthropic | null = null;

function getClient(): Anthropic {
  if (!anthropicClient) {
    anthropicClient = new Anthropic({
      apiKey: process.env.ANTHROPIC_API_KEY,
    });
  }
  return anthropicClient;
}

export async function classifyContent(
  content: string,
  itemType: string,
  existingTags: string[] = [],
  imageBase64?: string
): Promise<Classification> {
  const client = getClient();
  const userMessage = buildClassificationPrompt(content, itemType, existingTags);

  const contentBlocks: Anthropic.MessageParam["content"] = imageBase64
    ? [
        {
          type: "image" as const,
          source: {
            type: "base64" as const,
            media_type: "image/webp" as const,
            data: imageBase64,
          },
        },
        { type: "text" as const, text: userMessage },
      ]
    : userMessage;

  const response = await client.messages.create({
    model: "claude-sonnet-4-5-20250514",
    max_tokens: 512,
    system: CLASSIFY_SYSTEM_PROMPT,
    messages: [{ role: "user", content: contentBlocks }],
  });

  const text =
    response.content[0].type === "text" ? response.content[0].text : "";

  // Strip markdown code blocks if present
  const cleanText = text.replace(/```json\n?|\n?```/g, "").trim();

  const parsed = JSON.parse(cleanText);
  return ClassificationSchema.parse(parsed);
}
