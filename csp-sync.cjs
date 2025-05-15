/*
Helper to automatically sync csp.json to vercel.json by updating
the Content-Security-Policy header's value directly inside vercel.json.
Reads csp.json, converts it to a CSP string, finds the CSP header in vercel.json,
and updates or adds it accordingly, then writes back the updated vercel.json.
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

  if (Array.isArray(vercelJson.headers)) {
    const cspHeader = vercelJson.headers.find(
      (header) => header.key === 'Content-Security-Policy'
    );

    if (cspHeader) {
      cspHeader.value = cspString;
    } else {
      vercelJson.headers.push({
        key: 'Content-Security-Policy',
        value: cspString,
      });
    }
  } else {
    vercelJson.headers = [
      {
        key: 'Content-Security-Policy',
        value: cspString,
      },
    ];
  }

  fs.writeFileSync(
    './vercel.json',
    JSON.stringify(vercelJson, null, 2),
    'utf-8'
  );

  console.log('✅ Updated CSP header in vercel.json');
}

main();
