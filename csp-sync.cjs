/*
Csp parser for vercel.json
This script reads a CSP configuration from a JSON file (csp.json),
and updates the Vercel configuration file (vercel.json) to include the CSP header.
It ensures that the CSP header is added to the route that matches all paths ('/(.*)').
*/

const fs = require('fs');
const path = require('path');

function jsonToCspString(cspJson) {
  return Object.entries(cspJson)
    .map(([key, values]) => `${key} ${values.join(' ')}`)
    .join('; ');
}

function updateVercelJson(cspString) {
  const vercelPath = './vercel.json';
  if (!fs.existsSync(vercelPath)) return;

  const vercelRaw = fs.readFileSync(vercelPath, 'utf-8');
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
    vercelPath,
    JSON.stringify(vercelJson, null, 2),
    'utf-8'
  );

  console.log('✅ Updated CSP in vercel.json');
}

function updateHeadersFile(cspString) {
  const headersPath = path.join('public', '_headers');
  let lines = [];

  if (fs.existsSync(headersPath)) {
    lines = fs.readFileSync(headersPath, 'utf-8').split('\n');
  } else {
    lines.push('/*');
  }

  const cspLine = `  Content-Security-Policy: ${cspString}`;

  const cspIndex = lines.findIndex((line) =>
    line.trim().startsWith('Content-Security-Policy:')
  );

  if (cspIndex !== -1) {
    lines[cspIndex] = cspLine;
  } else {
    lines.push(cspLine);
  }

  fs.writeFileSync(headersPath, lines.join('\n'), 'utf-8');

  console.log('✅ Updated CSP in public/_headers');
}

function main() {
  const cspRaw = fs.readFileSync('./csp.json', 'utf-8');
  const cspJson = JSON.parse(cspRaw);

  const cspString = jsonToCspString(cspJson);

  updateVercelJson(cspString);
  updateHeadersFile(cspString);
}

main();
