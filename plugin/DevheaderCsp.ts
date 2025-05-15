import fs from 'fs';
import path from 'path';
import type { PluginOption } from 'vite';

type CspConfig = Record<string, string[]>;

export function cspPlugin(): PluginOption {
  return {
    name: 'vite:csp-header',
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        const cspPath = path.resolve(process.cwd(), 'csp.json');

        if (!fs.existsSync(cspPath)) {
          res.statusCode = 500;
          res.end('CSP configuration not found');
          return;
        }

        const cspJson = JSON.parse(
          fs.readFileSync(cspPath, 'utf-8')
        ) as CspConfig;

        const cspHeader = Object.entries(cspJson)
          .map(([key, values]) => `${key} ${values.join(' ')}`)
          .join('; ');

        res.setHeader('Content-Security-Policy', cspHeader);
        next();
      });
    },
  };
}
