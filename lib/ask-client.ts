export type AskMessage = { role: 'user' | 'assistant'; content: string };

export class AskError extends Error {
  constructor(public status: number, message: string) {
    super(message);
    this.name = 'AskError';
  }
}

/**
 * POSTs messages to /.netlify/functions/ask and yields text deltas as they
 * arrive. Consumer usage:
 *
 *   for await (const chunk of streamAsk(messages)) {
 *     appendToAssistant(chunk);
 *   }
 */
export async function* streamAsk(messages: AskMessage[]): AsyncGenerator<string> {
  const res = await fetch('/.netlify/functions/ask', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ messages }),
  });

  if (!res.ok) {
    let msg = `HTTP ${res.status}`;
    try {
      const j = await res.json();
      if (j && typeof j.error === 'string') msg = j.error;
    } catch {
      /* ignore */
    }
    throw new AskError(res.status, msg);
  }

  if (!res.body) {
    throw new AskError(500, 'No response body');
  }

  const reader = res.body.getReader();
  const decoder = new TextDecoder();
  let buffer = '';

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });

    // SSE events are separated by a blank line (\n\n).
    let sepIdx: number;
    while ((sepIdx = buffer.indexOf('\n\n')) !== -1) {
      const rawEvent = buffer.slice(0, sepIdx);
      buffer = buffer.slice(sepIdx + 2);

      const dataLine = rawEvent
        .split('\n')
        .find((line) => line.startsWith('data: '));
      if (!dataLine) continue;

      let parsed: unknown;
      try {
        parsed = JSON.parse(dataLine.slice(6));
      } catch {
        continue;
      }

      if (
        parsed &&
        typeof parsed === 'object' &&
        (parsed as { type?: unknown }).type === 'content_block_delta'
      ) {
        const delta = (parsed as { delta?: unknown }).delta;
        if (
          delta &&
          typeof delta === 'object' &&
          (delta as { type?: unknown }).type === 'text_delta' &&
          typeof (delta as { text?: unknown }).text === 'string'
        ) {
          yield (delta as { text: string }).text;
        }
      }
    }
  }
}
