const SUPABASE_URL = 'https://cqtbishpefnfvaxheyqu.supabase.co';
const SUPABASE_ANON_KEY =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNxdGJpc2hwZWZuZnZheGhleXF1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDM4NDIwMDYsImV4cCI6MjA1OTQxODAwNn0.QXKAGYy2l21gwcfXlKLyCq8Te4yotrvgkLY4M1v0aCs';
  //Generally safe to expose due to this being ANON / Public ket

const VITE_PUBLIC_POSTHOG_KEY = "phc_VzYgf0QQbnP8w3cco1l9atGPzZcrBpYwCNIglwnI5iE" //Also safe to expose as it doesn't reveal sensitive data

export { SUPABASE_URL, SUPABASE_ANON_KEY, VITE_PUBLIC_POSTHOG_KEY };