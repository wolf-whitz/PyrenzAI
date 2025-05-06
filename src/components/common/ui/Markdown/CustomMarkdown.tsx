import React, { useEffect, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Typography, Link, Box } from '@mui/material';

interface CustomMarkdownProps {
  text?: string;
  char?: string;
  user?: string;
  ai_message?: string;
}

export default function CustomMarkdown({
  text = '',
  char,
  user,
  ai_message = '',
}: CustomMarkdownProps) {
  const [replacedText, setReplacedText] = useState<string>(text);
  const [userColor, setUserColor] = useState<string | undefined>('');

  useEffect(() => {
    const savedUserColor = localStorage.getItem('userColor');
    if (savedUserColor) setUserColor(savedUserColor);

    const replacePlaceholders = (content: string) =>
      content
        .replace(/{{char}}/g, char || 'Anon')
        .replace(/{{user}}/g, user || 'User')
        .replace(/{{you}}:/g, '')
        .replace(/{{ai_message}}/g, ai_message);

    setReplacedText(replacePlaceholders(text));
  }, [text, char, user, ai_message]);

  return (
    <Box className="text-styles">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          em: ({ children }) => (
            <Typography component="span" sx={{ color: 'gray', fontStyle: 'italic', fontWeight: 'bold' }}>
              {children}
            </Typography>
          ),
          strong: ({ children }) => (
            <Typography component="span" sx={{ color: 'white', fontWeight: 'bold', ...(char ? { color: char } : {}) }}>
              {children}
            </Typography>
          ),
          p: ({ children }) => <Typography component="p">{children}</Typography>,
          a: ({ children, href }) => (
            <Link href={href} sx={{ color: 'blue', textDecoration: 'none', '&:hover': { textDecoration: 'underline' } }}>
              {children}
            </Link>
          ),
          code: ({ children }) => (
            <Typography
              component="code"
              sx={{
                bgcolor: 'gray',
                color: 'lightgray',
                fontFamily: 'monospace',
                px: 1,
                py: 0.5,
                borderRadius: 1,
              }}
            >
              {children}
            </Typography>
          ),
          blockquote: ({ children }) => (
            <Typography
              component="blockquote"
              sx={{ borderLeft: 4, borderColor: 'gray', pl: 2, color: 'gray', fontStyle: 'italic' }}
            >
              {children}
            </Typography>
          ),
          ul: ({ children }) => <Typography component="ul" sx={{ listStyleType: 'disc', pl: 4 }}>{children}</Typography>,
          li: ({ children }) => <Typography component="li" sx={{ mb: 1 }}>{children}</Typography>,
        }}
      >
        {replacedText}
      </ReactMarkdown>
    </Box>
  );
}
