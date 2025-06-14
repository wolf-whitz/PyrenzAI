import React, { useEffect, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Typography, Box } from '@mui/material';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';

interface CustomMarkdownProps {
  text?: string;
  char?: { name: string };
  user?: { username: string };
  ai_message?: string;
}

export function CustomMarkdown({
  text = '',
  char,
  user,
  ai_message = '',
}: CustomMarkdownProps) {
  const [replacedText, setReplacedText] = useState<string>(text);

  useEffect(() => {
    const replacePlaceholders = (content: string) =>
      content
        .replace(/{{char}}/g, char?.name || '')
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
            <Typography component="p" sx={{ whiteSpace: 'pre-wrap' }}>
              {children}
            </Typography>
          ),
          code({ node, className, children, ...props }: any) {
            const match = /language-(\w+)/.exec(className || '');
            const isInline = !className;

            if (!isInline) {
              return (
                <SyntaxHighlighter
                  style={oneDark}
                  language={match?.[1] || 'plaintext'}
                  showLineNumbers
                  PreTag="div"
                  customStyle={{
                    borderRadius: '8px',
                    padding: '16px',
                    fontSize: '0.9rem',
                    overflowX: 'auto',
                  }}
                  {...props}
                >
                  {String(children).replace(/\n$/, '')}
                </SyntaxHighlighter>
              );
            }

            return (
              <Typography
                component="code"
                sx={{
                  bgcolor: 'rgba(255,255,255,0.1)',
                  color: 'lightgray',
                  fontFamily: 'monospace',
                  px: 1,
                  py: 0.5,
                  borderRadius: 1,
                }}
              >
                {children}
              </Typography>
            );
          },
          hr: () => null,
        }}
      >
        {replacedText}
      </ReactMarkdown>
    </Box>
  );
}
