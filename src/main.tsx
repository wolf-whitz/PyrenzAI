import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './Global.css';
import { Analytics } from "@vercel/analytics/react"
import { datadogRum } from '@datadog/browser-rum';

datadogRum.init({
    applicationId: '651aae08-df38-44d6-8944-9b4208ad8ba2',
    clientToken: 'pub612e2a2baa742ee72147e1bbaf23de53',
    site: 'us5.datadoghq.com',
    service:'pyrenzai',
    env: 'development',
    sessionSampleRate:  100,
    sessionReplaySampleRate: 35,
    defaultPrivacyLevel: 'mask-user-input',
});

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
    <Analytics />
  </StrictMode>
);
