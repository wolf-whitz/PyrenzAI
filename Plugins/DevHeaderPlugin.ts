export default function headerDevPlugin() {
  return {
    name: 'vite-plugin-header-dev',
    configureServer(server) {
      const allowedSites = [
        'https://pyrenzai.com/',
        'https://cqtbishpefnfvaxheyqu.supabase.co/'
      ];

      server.middlewares.use((req, res, next) => {
        const origin = req.headers.origin;
        if (allowedSites.includes(origin || '')) {
          res.setHeader('Access-Control-Allow-Origin', origin);
        }

        res.setHeader(
          'Access-Control-Allow-Methods',
          'GET, POST, PUT, DELETE, OPTIONS'
        );
        res.setHeader(
          'Access-Control-Allow-Headers',
          'Content-Type, Authorization, X-Requested-With'
        );
        res.setHeader('Access-Control-Allow-Credentials', 'true');

        res.setHeader('X-Powered-By', 'PyrenzAI');
        res.setHeader(
          'Strict-Transport-Security',
          'max-age=31536000; includeSubDomains'
        );
        res.setHeader('X-Content-Type-Options', 'nosniff');
        res.setHeader('X-Frame-Options', 'SAMEORIGIN');
        res.setHeader('X-XSS-Protection', '1; mode=block');
        res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
        next();
      });
    },
  };
}
