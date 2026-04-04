import { streamText, convertToModelMessages } from "ai";
import { createClient } from "@/lib/supabase";

export async function POST(req: Request) {
  const { messages, bloomId } = await req.json();

  // Fetch resident context if bloomId is available
  let residentContext = "";
  if (bloomId) {
    try {
      const supabase = createClient();
      const { data } = await supabase.rpc("get_resident_summary", {
        p_identifier: bloomId,
      });
      if (data) {
        const summary = data as {
          bloom_id?: string;
          preferred_language?: string;
          days_in_shelter?: number;
          total_activities?: number;
          recent_activities?: { name: string; type: string; date: string }[];
        };
        residentContext = `
Resident context:
- Bloom ID: ${summary.bloom_id ?? bloomId}
- Preferred language: ${summary.preferred_language ?? "en"}
- Days at the shelter: ${summary.days_in_shelter ?? "unknown"}
- Total wellness activities completed: ${summary.total_activities ?? 0}
- Recent activities: ${
          summary.recent_activities?.length
            ? summary.recent_activities
                .slice(0, 5)
                .map((a) => `${a.name} (${a.type})`)
                .join(", ")
            : "none recorded yet"
        }
`;
      }
    } catch {
      // continue without context
    }
  }

  const systemPrompt = `You are Bloom, a compassionate AI wellness companion at a women's shelter. You support residents with warmth, dignity, and trauma-informed care.

Your role:
- Listen with empathy and validate feelings without judgement
- Suggest gentle wellness activities from the app: yoga, stretching, breathing exercises, grounding, or creative expression
- Provide hope and practical emotional support
- Know when to gently recommend professional help or BC211 (211) for crisis support
- Keep responses concise — 2-4 sentences unless the resident clearly needs more
- Never use clinical or diagnostic language. Never minimise or dismiss feelings.
- Speak in the user's preferred language if possible

Safety: If a resident expresses thoughts of self-harm or is in immediate danger, always recommend calling 911 or going to the shelter staff immediately.

${residentContext || "The resident is using guest mode — no history available."}`;

  const coreMessages = await convertToModelMessages(messages);

  const result = streamText({
    model: "anthropic/claude-haiku-4.5",
    system: systemPrompt,
    messages: coreMessages,
    maxOutputTokens: 512,
  });

  return result.toUIMessageStreamResponse();
}
