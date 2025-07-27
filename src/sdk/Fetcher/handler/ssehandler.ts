import type { SSEOptions } from '../request';

export async function handleSSE<T>(
  url: string,
  method: string,
  data: Record<string, any>,
  headers: HeadersInit,
  options: SSEOptions
): Promise<void> {
  const res = await fetch(url, {
    method,
    headers: {
      ...headers,
      Accept: 'text/event-stream',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!res.ok || !res.body) {
    throw new Error(`SSE failed: ${res.status}`);
  }

  const reader = res.body.getReader();
  const decoder = new TextDecoder('utf-8');

  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      const chunk = decoder.decode(value, { stream: true });
      for (const line of chunk.split('\n')) {
        const trimmed = line.trim();
        if (!trimmed.startsWith('data:')) continue;

        const payload = trimmed.replace(/^data:\s*/, '');

        if (payload === '[DONE]') {
          options.onDone?.();
          return;
        }

        options.onMessage?.(payload);
      }
    }

    options.onDone?.();
  } catch (err) {
    options.onError?.(err);
  }
}
