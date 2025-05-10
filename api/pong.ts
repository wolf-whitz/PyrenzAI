export const config = {
    runtime: 'edge',
  };
  
  export default function handler(request) {
    return new Response('Pong', {
      status: 200,
      headers: {
        'Content-Type': 'text/plain',
      },
    });
  }
  