const SUPABASE_URL = 'https://cqtbishpefnfvaxheyqu.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNxdGJpc2hwZWZuZnZheGhleXF1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDM4NDIwMDYsImV4cCI6MjA1OTQxODAwNn0.QXKAGYy2l21gwcfXlKLyCq8Te4yotrvgkLY4M1v0aCs';

const SERVER_API_URL_1 = import.meta.env.VITE_SERVER_API_URL_1 ?? 'http://localhost:3000';
const SERVER_API_URL_2 = import.meta.env.VITE_SERVER_API_URL_2 ?? 'http://localhost:3000';
/**
 * Always include in your .env a s1.pyrenzai.com and s2.pyrenzai.com example:
 * 
 * SERVER_API_URL_1 = 's1.pyrenzai.com'
 * SERVER_API_URL_2 = 's2.pyrenzai.com' 
 * 
 * s1.pyrenzai.com > Fast Server (Require Authentications)
 * 
 * s1.pyrenzai.com > Slow Server (Does not require authentication)
 */
export { SUPABASE_URL, SUPABASE_ANON_KEY, SERVER_API_URL_1, SERVER_API_URL_2 };
