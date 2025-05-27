/*
Csp parser for vercel.json
This script reads a CSP configuration from a JSON file (csp.json),
and updates the Vercel configuration file (vercel.json) to include the CSP header.
It ensures that the CSP header is added to the route that matches all paths ('/(.*)').
*/

const fs = require('fs');

function jsonToCspString(cspJson) {
  return Object.entries(cspJson)
    .map(([key, values]) => `${key} ${values.join(' ')}`)
    .join('; ');
}

function main() {
  const cspRaw = fs.readFileSync('./csp.json', 'utf-8');
  const cspJson = JSON.parse(cspRaw);

  const cspString = jsonToCspString(cspJson);

  const vercelRaw = fs.readFileSync('./vercel.json', 'utf-8');
  const vercelJson = JSON.parse(vercelRaw);

  const route = vercelJson.headers?.find((entry) => entry.source === '/(.*)');

  if (!route) {
    vercelJson.headers = vercelJson.headers || [];
    vercelJson.headers.push({
      source: '/(.*)',
      headers: [
        {
          key: 'Content-Security-Policy',
          value: cspString,
        },
      ],
    });
  } else {
    if (!Array.isArray(route.headers)) {
      route.headers = [];
    }
    const cspHeader = route.headers.find(
      (header) => header.key === 'Content-Security-Policy'
    );

    if (cspHeader) {
      cspHeader.value = cspString;
    } else {
      route.headers.push({
        key: 'Content-Security-Policy',
        value: cspString,
      });
    }
  }

  fs.writeFileSync(
    './vercel.json',
    JSON.stringify(vercelJson, null, 2),
    'utf-8'
  );

  console.log('✅ Updated CSP header inside vercel.json with proper schema');
}

main();
