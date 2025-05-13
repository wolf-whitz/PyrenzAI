import express from 'express';
import fs from 'fs';
import path from 'path';
import React from 'react';
import { renderToString } from 'react-dom/server';
import { ServerStyleSheet } from 'styled-components';
import App from '../src/App';

const app = express();

app.get('/', (req, res) => {
  const sheet = new ServerStyleSheet();
  const content = renderToString(sheet.collectStyles(React.createElement(App)));
  const styles = sheet.getStyleTags();

  const indexPath = path.join(__dirname, '../../public/index.html');
  let html = fs.readFileSync(indexPath, 'utf8');

  html = html.replace(
    '<div id="root" aria-label="PyrenzAI" role="main"></div>',
    `<div id="root" aria-label="PyrenzAI" role="main">${content}</div>`
  );
  html = html.replace('</head>', `${styles}</head>`);

  res.send(html);
});

export default app;