const SUPABASE_URL = 'https://cqtbishpefnfvaxheyqu.supabase.co';
const SUPABASE_ANON_KEY =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNxdGJpc2hwZWZuZnZheGhleXF1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDM4NDIwMDYsImV4cCI6MjA1OTQxODAwNn0.QXKAGYy2l21gwcfXlKLyCq8Te4yotrvgkLY4M1v0aCs';

const SERVER_API_URL =
  import.meta.env.VITE_SERVER_API_URL || 'http://localhost:3000';

/**
 * Requires a `.env` file that contains the `VITE_SERVER_API_URL` variable.
 * Without this variable, the application will not work properly.
 *
 * @example
 * VITE_SERVER_API_URL=http://api.pyrenzai.com
 */

export { SUPABASE_URL, SUPABASE_ANON_KEY, SERVER_API_URL };
