export const config = {
  runtime: 'edge'
};

export default function handler(request) {
  const now = new Date().toISOString();

  const data = {
    status: 'ok',
    message: 'pong',
    timestamp: now,
    uptime: process.uptime?.() ?? 'N/A',
    runtime: 'edge'
  };

  return new Response(JSON.stringify(data), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'no-store'
    }
  });
}
