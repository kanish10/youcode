// Google News RSS proxy. No API key required — the feed is public.
// We fetch server-side, parse the top 2 items, and cache per query for 30 min.

export const revalidate = 1800;

type Headline = {
  title: string;
  link: string;
  source: string;
  publishedAt: string;
};

function decodeEntities(input: string): string {
  return input
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, "\"")
    .replace(/&#39;/g, "'")
    .replace(/&apos;/g, "'")
    .replace(/&#x27;/g, "'")
    .replace(/&nbsp;/g, " ");
}

function stripCdata(input: string): string {
  const match = input.match(/<!\[CDATA\[([\s\S]*?)\]\]>/);
  return (match ? match[1] : input).trim();
}

function stripSourceSuffix(title: string, source: string): string {
  if (!source) return title;
  const suffix = ` - ${source}`;
  if (title.endsWith(suffix)) return title.slice(0, -suffix.length).trim();
  return title;
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("q")?.trim();

  if (!query) {
    return new Response(JSON.stringify({ error: "Missing q parameter" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const rssUrl = `https://news.google.com/rss/search?q=${encodeURIComponent(query)}&hl=en-US&gl=US&ceid=US:en`;

  try {
    const response = await fetch(rssUrl, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (compatible; BloomShelterApp/1.0; +https://bloom.app)",
      },
      next: { revalidate: 1800 },
    });

    if (!response.ok) {
      return new Response(JSON.stringify({ headlines: [] }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    }

    const xml = await response.text();
    const itemMatches = Array.from(
      xml.matchAll(/<item>([\s\S]*?)<\/item>/g),
    ).slice(0, 2);

    const headlines: Headline[] = itemMatches
      .map(([, block]) => {
        const rawTitle = block.match(/<title>([\s\S]*?)<\/title>/)?.[1] ?? "";
        const rawLink = block.match(/<link>([\s\S]*?)<\/link>/)?.[1] ?? "";
        const rawSource =
          block.match(/<source[^>]*>([\s\S]*?)<\/source>/)?.[1] ?? "";
        const rawDate = block.match(/<pubDate>([\s\S]*?)<\/pubDate>/)?.[1] ?? "";

        const source = decodeEntities(stripCdata(rawSource));
        const title = stripSourceSuffix(
          decodeEntities(stripCdata(rawTitle)),
          source,
        );
        const link = decodeEntities(rawLink.trim());

        return { title, link, source, publishedAt: rawDate.trim() };
      })
      .filter((h) => h.title && h.link);

    return new Response(JSON.stringify({ headlines }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch {
    // Soft-fail: return empty so the UI shows "no headlines" rather than an error.
    return new Response(JSON.stringify({ headlines: [] }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  }
}
