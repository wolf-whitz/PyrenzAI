import fs from 'fs';
import path from 'path';
import React from 'react';
import { renderToString } from 'react-dom/server';
import { ServerStyleSheet } from 'styled-components';
import App from '../src/App';

export const config = {
  runtime: 'edge',
};

export default async function handler(request) {
  try {
    const sheet = new ServerStyleSheet();
    const content = renderToString(sheet.collectStyles(React.createElement(App)));
    const styles = sheet.getStyleTags();

    const indexPath = path.join(process.cwd(), 'public', 'index.html');
    let html = fs.readFileSync(indexPath, 'utf8');

    html = html.replace(
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
