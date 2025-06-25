import { Helmet } from 'react-helmet-async';

export function GlobalMeta() {
  return (
    <Helmet>
      <title>PyrenzAI</title>

      <link rel="manifest" href="/manifest.json" />

      <meta name="theme-color" content="#14181f" media="(prefers-color-scheme: light)" />
      <meta name="theme-color" content="#0f1117" media="(prefers-color-scheme: dark)" />
      <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
      <meta name="mobile-web-app-capable" content="yes" />
      <meta name="format-detection" content="telephone=no" />
      <meta name="msapplication-TileColor" content="#14181f" />
      <meta name="msapplication-TileImage" content="/Favicons/favicon-192x192.png" />
      <link rel="apple-touch-icon" sizes="180x180" href="/Favicons/apple-touch-favicon-180x180.png" />
      <meta name="apple-mobile-web-app-title" content="PyrenzAI" />
      
      <meta name="robots" content="index, follow" />
      <meta name="googlebot" content="index, follow" />

      <meta name="description" content="PyrenzAI is a full-on AI chat app where you can talk to endless anime characters anytime you want and create fully immersive stories between you and the characters!" />

      <meta name="keywords" content="PyrenAI, AI, roleplay, anime, best, tags, artificial intelligence, chatbots, AI characters, roleplaying, online roleplay, anime roleplay, digital companions, interactive AI, virtual assistants, anime characters, AI-powered, storytelling, creative writing, virtual worlds" />

      <meta name="color-scheme" content="dark light" />
    </Helmet>
  );
}
