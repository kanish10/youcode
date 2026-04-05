import { generateText } from "ai";
import { getBloomModel, hasBloomModel } from "@/lib/ai";

type PantryRequest = {
  ingredients: string[];
  minutes: number;
  equipment: string[];
  diet: string[];
  servings: number;
  language?: string;
};

export async function POST(req: Request) {
  if (!hasBloomModel()) {
    return new Response(
      JSON.stringify({ error: "No AI provider configured." }),
      { status: 500, headers: { "Content-Type": "application/json" } },
    );
  }

  const body = (await req.json()) as PantryRequest;
  const {
    ingredients,
    minutes,
    equipment,
    diet,
    servings = 2,
    language = "English",
  } = body;

  if (!ingredients || ingredients.length === 0) {
    return new Response(
      JSON.stringify({ error: "Pick at least one ingredient." }),
      { status: 400, headers: { "Content-Type": "application/json" } },
    );
  }

  const systemPrompt = `You are a shelter kitchen helper. Write short, safe, budget-friendly recipes for women living in shelters.

HARD RULES:
- ONLY use the ingredients the resident has selected. You may assume salt, pepper, water, oil are available. Do NOT invent ingredients she did not list.
- Respect her time limit, equipment, and dietary needs EXACTLY.
- Recipes must be dignity-first, calm, and practical. No judgment, no "you should".
- Keep steps 4-6 short lines each, clear and literal.
- Write in the requested language.

Return ONLY valid JSON matching this schema (no markdown, no commentary):
{
  "recipes": [
    {
      "name": "short recipe name",
      "cultural_hint": "one short line like 'similar to quick dal' or 'like a simple congee'",
      "time_minutes": number,
      "servings": number,
      "why_this_one": "one gentle sentence why this fits her situation",
      "noise_level": "quiet" | "medium" | "loud",
      "ingredients_used": ["ingredient from her list", ...],
      "steps": ["step 1", "step 2", ...]
    }
  ]
}
Generate 2 or 3 distinct recipes.`;

  const userPrompt = `Ingredients she has right now: ${ingredients.join(", ")}
Time available: ${minutes} minutes
Equipment available: ${equipment.length ? equipment.join(", ") : "basic (knife, bowl)"}
Dietary needs: ${diet.length ? diet.join(", ") : "none specified"}
Serving: ${servings} ${servings === 1 ? "person" : "people"}
Language: ${language}

Return only the JSON object.`;

  try {
    const { text } = await generateText({
      model: getBloomModel(),
      system: systemPrompt,
      prompt: userPrompt,
      maxOutputTokens: 1500,
      temperature: 0.7,
    });

    // Strip any accidental markdown fences and parse
    const cleaned = text
      .replace(/^```json\s*/i, "")
      .replace(/^```\s*/i, "")
      .replace(/```\s*$/i, "")
      .trim();

    // Extract JSON object if there's extra text around it
    const firstBrace = cleaned.indexOf("{");
    const lastBrace = cleaned.lastIndexOf("}");
    const jsonSlice =
      firstBrace >= 0 && lastBrace >= 0
        ? cleaned.slice(firstBrace, lastBrace + 1)
        : cleaned;

    let parsed: unknown;
    try {
      parsed = JSON.parse(jsonSlice);
    } catch {
      return new Response(
        JSON.stringify({
          error: "The model returned an unreadable response. Please try again.",
        }),
        { status: 502, headers: { "Content-Type": "application/json" } },
      );
    }

    return new Response(JSON.stringify(parsed), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    // Log the real error server-side so staff/devs can diagnose.
    console.error("[pantry] recipe generation failed:", message);
    const isAuthError =
      /invalid api key|unauthori[sz]ed|401|authentication/i.test(message);
    const friendly = isAuthError
      ? "The recipe helper isn't available right now. Please let staff know so they can set up the AI connection."
      : "The recipe helper couldn't answer right now. Please try again in a moment.";
    return new Response(
      JSON.stringify({ error: friendly }),
      { status: 500, headers: { "Content-Type": "application/json" } },
    );
  }
}
