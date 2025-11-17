import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import { z } from "zod";
import { zodTextFormat } from "openai/helpers/zod";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Define the schema for a single word score
const WordScoreSchema = z.object({
  word: z.string().describe("The word being scored"),
  score: z
    .number()
    .int()
    .min(0)
    .max(5)
    .describe(
      "Difficulty score: 0=English word (not Filipino/Tagalog), 1=very common, 2=common, 3=moderately common, 4=regional/specialized, 5=very obscure"
    ),
  explanation: z
    .string()
    .max(100)
    .describe("Brief explanation for the score (max 10 words)"),
});

// Define the schema for the complete response
const WordScoresResponseSchema = z.object({
  scores: z
    .array(WordScoreSchema)
    .describe("Array of word scores for all evaluated words"),
});

export type WordScoresResponse = z.infer<typeof WordScoresResponseSchema>;

export async function POST(request: NextRequest) {
  try {
    const { words } = await request.json();

    if (!Array.isArray(words) || words.length === 0) {
      return NextResponse.json(
        { error: "Invalid request: words array is required" },
        { status: 400 }
      );
    }

    if (words.length > 30) {
      return NextResponse.json(
        { error: "Maximum 30 words per request" },
        { status: 400 }
      );
    }

    const prompt = `You are evaluating Filipino/Tagalog words for a word game. Score each word from 0-5 based on difficulty/obscurity:

IMPORTANT: Score 0 for English words or words that have Filipino/Tagalog equivalents (e.g., IDEA should be 0 because the Filipino word is IDEYA)

0: English word (not Filipino/Tagalog, or has a Filipino equivalent)
1: Very common Filipino words known by almost everyone
2: Common Filipino words used regularly
3: Moderately common Filipino words
4: Regional or specialized Filipino words with limited usage
5: Very obscure, rarely used Filipino words

For each word, provide a score (0-5) and a very brief explanation (max 10 words).

Words to evaluate:
${words.map((w: string, i: number) => `${i + 1}. ${w}`).join("\n")}`;

    const response = await openai.responses.parse({
      model: "gpt-5-nano",
      input: [
        {
          role: "system",
          content:
            "You are an expert in Filipino/Tagalog language and Philippine culture. Evaluate each word's difficulty/obscurity accurately. Give score 0 to English words or words with Filipino equivalents.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      text: {
        format: zodTextFormat(WordScoresResponseSchema, "word_scores"),
      },
    });

    const validated = response.output_parsed;

    if (!validated) {
      throw new Error("Failed to parse response");
    }

    // Validate we got scores for all words
    if (validated.scores.length !== words.length) {
      console.warn(
        `Expected ${words.length} scores but got ${validated.scores.length}`
      );
    }

    return NextResponse.json({ scores: validated.scores });
  } catch (error) {
    console.error("Error scoring words:", error);

    // Better error handling for Zod validation errors
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          error: "Invalid response format from OpenAI",
          details: error.errors,
        },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        error: "Failed to score words",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
