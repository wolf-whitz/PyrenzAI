export default function headerDevPlugin() {
  return {
    name: 'vite-plugin-header-dev',
    configureServer(server) {
      const allowedSites = ['https://example.com', 'https://another-allowed-site.com'];

      server.middlewares.use((req, res, next) => {
        const origin = req.headers.origin;
        if (allowedSites.includes(origin || '')) {
          res.setHeader('Access-Control-Allow-Origin', origin);
        }

        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
        res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
        res.setHeader('Access-Control-Allow-Credentials', 'true');

        res.setHeader('X-Powered-By', 'PyrenzAI');
        res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
        res.setHeader('X-Content-Type-Options', 'nosniff');
        res.setHeader('X-Frame-Options', 'SAMEORIGIN');
        res.setHeader('X-XSS-Protection', '1; mode=block');

        next();
      });
    },
  };
}
