import Anthropic from '@anthropic-ai/sdk';
import type { Context } from '@netlify/functions';
import { buildSystem } from './_lib/system-prompt';

const MODEL = 'claude-sonnet-4-6';
const MAX_TOKENS = 1024;
const MAX_USER_CHARS = 300;    // spec §8 item 1
const MAX_TURNS = 12;           // spec §8 item 2

type InMsg = { role: 'user' | 'assistant'; content: string };

function jsonError(status: number, message: string): Response {
  return new Response(JSON.stringify({ error: message }), {
    status,
    headers: { 'content-type': 'application/json' },
  });
}

export default async (req: Request, _context: Context): Promise<Response> => {
  if (req.method !== 'POST') {
    return jsonError(405, 'Method not allowed');
  }

  // Same-origin guard (spec §13). In dev (netlify dev) origin may be absent.
  const origin = req.headers.get('origin');
  const host = req.headers.get('host');
  if (origin && host && !origin.endsWith(host)) {
    return jsonError(403, 'Forbidden');
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return jsonError(400, 'Invalid JSON');
  }

  if (!body || typeof body !== 'object' || !Array.isArray((body as { messages?: unknown }).messages)) {
    return jsonError(400, 'Missing messages[]');
  }
  const messages = (body as { messages: unknown[] }).messages;

  // Validate each message shape.
  const cleaned: InMsg[] = [];
  for (const m of messages) {
    if (!m || typeof m !== 'object') return jsonError(400, 'Malformed message');
    const role = (m as { role?: unknown }).role;
    const content = (m as { content?: unknown }).content;
    if ((role !== 'user' && role !== 'assistant') || typeof content !== 'string') {
      return jsonError(400, 'Malformed message');
    }
    cleaned.push({ role, content });
  }

  if (cleaned.length === 0 || cleaned[cleaned.length - 1].role !== 'user') {
    return jsonError(400, 'Last message must be from user');
  }
  if (cleaned.length > MAX_TURNS) {
    return jsonError(400, 'Long conversation — time to email Noah directly.');
  }
  const last = cleaned[cleaned.length - 1];
  if (last.content.length > MAX_USER_CHARS) {
    return jsonError(400, `Message too long (max ${MAX_USER_CHARS} chars).`);
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    console.error('[ask] ANTHROPIC_API_KEY not set');
    return jsonError(500, 'Server misconfigured');
  }

  const client = new Anthropic({ apiKey });

  const ac = new AbortController();

  let anthropicStream: AsyncIterable<Anthropic.Messages.RawMessageStreamEvent>;
  try {
    anthropicStream = await client.messages.create(
      {
        model: MODEL,
        max_tokens: MAX_TOKENS,
        system: buildSystem(),
        messages: cleaned,
        stream: true,
      },
      { signal: ac.signal },
    );
  } catch (err) {
    // Plan 3 will add retry/taxonomy. For Plan 1: single 502 to client.
    console.error('[ask] anthropic create failed:', err);
    return jsonError(502, 'Temporarily unavailable. Try again or email Noah.');
  }

  const encoder = new TextEncoder();
  const sseBody = new ReadableStream<Uint8Array>({
    async start(controller) {
      try {
        for await (const event of anthropicStream) {
          controller.enqueue(
            encoder.encode(`event: ${event.type}\ndata: ${JSON.stringify(event)}\n\n`),
          );
        }
      } catch (err) {
        if (ac.signal.aborted || (err instanceof Error && err.name === 'AbortError')) {
          // Client disconnected — no need to emit error back.
        } else {
          console.error('[ask] stream error:', err);
          controller.enqueue(
            encoder.encode(`event: error\ndata: ${JSON.stringify({ message: 'stream_error' })}\n\n`),
          );
        }
      } finally {
        controller.close();
      }
    },
    cancel() { ac.abort(); },
  });

  return new Response(sseBody, {
    status: 200,
    headers: {
      'content-type': 'text/event-stream; charset=utf-8',
      'cache-control': 'no-store',
      'x-accel-buffering': 'no',
    },
  });
};
