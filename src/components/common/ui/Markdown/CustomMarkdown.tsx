import React, { useEffect, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Typography, Box } from '@mui/material';

interface CustomMarkdownProps {
  text?: string;
  char?: { character_name: string };
  user?: { username: string };
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
        .replace(/{{char}}/g, char?.character_name || '')
        .replace(/{{user}}/g, user?.username || '')
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
            <Typography
              component="span"
              sx={{ color: 'gray', fontStyle: 'italic', fontWeight: 'bold' }}
            >
              {children}
            </Typography>
          ),
          strong: ({ children }) => (
            <Typography
              component="span"
              sx={{ color: 'gray', fontStyle: 'italic', fontWeight: 'bold' }}
            >
              {children}
            </Typography>
          ),
          p: ({ children }) => (
            <Typography component="p">{children}</Typography>
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
          )
        }}
      >
        {replacedText}
      </ReactMarkdown>
    </Box>
  );
}
