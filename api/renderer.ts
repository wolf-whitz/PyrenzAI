import React from 'react';
import { renderToString } from 'react-dom/server';
import { ServerStyleSheet } from 'styled-components';
import App from '../src/App';

// This should be the raw HTML template, not relying on the file system
const indexHtml = `
  <!DOCTYPE html>
  <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>PyrenzAI</title>
    </head>
    <body>
      <div id="root" aria-label="PyrenzAI" role="main"></div>
    </body>
  </html>
`;

export const config = {
  runtime: 'edge',
};

export default async function handler(request) {
  try {
    const sheet = new ServerStyleSheet();
    const content = renderToString(sheet.collectStyles(React.createElement(App)));
    const styles = sheet.getStyleTags();

    // Replace the root div and inject styles into the template
    let html = indexHtml.replace(
      '<div id="root" aria-label="PyrenzAI" role="main"></div>',
      `<div id="root" aria-label="PyrenzAI" role="main">${content}</div>`
    );
    html = html.replace('</head>', `${styles}</head>`);

    return new Response(html, {
      status: 200,
      headers: {
        'Content-Type': 'text/html',
        'Cache-Control': 'no-store',
      },
    });
  } catch (error) {
    console.error('Error:', error);
    return new Response('Internal Server Error', {
      status: 500,
      headers: {
        'Content-Type': 'text/plain',
      },
    });
  }
}
