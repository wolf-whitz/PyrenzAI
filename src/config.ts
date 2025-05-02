import { PostHog } from 'posthog-js';

const SUPABASE_URL = 'https://cqtbishpefnfvaxheyqu.supabase.co';
const SUPABASE_ANON_KEY =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNxdGJpc2hwZWZuZnZheGhleXF1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDM4NDIwMDYsImV4cCI6MjA1OTQxODAwNn0.QXKAGYy2l21gwcfXlKLyCq8Te4yotrvgkLY4M1v0aCs';
//Generally safe to expose due to this being ANON / Public key

const VITE_PUBLIC_POSTHOG_KEY =
  'phc_VzYgf0QQbnP8w3cco1l9atGPzZcrBpYwCNIglwnI5iE'; //Also safe to expose as it doesn't reveal sensitive data
const POSTHOG_API_HOST = 'https://us.i.posthog.com';

// Check the environment variable for SERVER_API_URL
const SERVER_API_URL =
  import.meta.env.VITE_SERVER_API_URL || 'http://localhost:8080';

const posthogConfig = {
  apiKey: VITE_PUBLIC_POSTHOG_KEY,
  apiHost: POSTHOG_API_HOST,
  debug: import.meta.env.MODE === 'development',
  loaded: (posthog: PostHog) => {
    console.log('PostHog loaded!', posthog);
  },
}; // Posthog Configs

export {
  SUPABASE_URL,
  SUPABASE_ANON_KEY,
  VITE_PUBLIC_POSTHOG_KEY,
  posthogConfig,
  SERVER_API_URL,
};
