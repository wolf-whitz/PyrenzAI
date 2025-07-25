import React, { useEffect, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import { Typography, Box } from '@mui/material';
import { useUserStore } from '~/store';

interface CustomMarkdownProps {
  text?: string;
  char: { name?: string };
  ai_message?: string;
  dataState?: 'user' | 'char';
}

export function CustomMarkdown({
  text = '',
  char,
  ai_message = '',
  dataState,
}: CustomMarkdownProps) {
  const [replacedText, setReplacedText] = useState(text);
  const { customization, username, personaName } = useUserStore();

  useEffect(() => {
    const replace = (content: string) =>
      content
        .replace(/{{char}}/g, char?.name || 'Anon')
        .replace(/{{user}}/g, personaName || username || 'Anon')
        .replace(/{{you}}:/g, '')
        .replace(/{{ai_message}}/g, ai_message);
    setReplacedText(replace(text));
  }, [text, char, username, personaName, ai_message]);

  const getColor = (
    type: 'text' | 'italic' | 'quote' | 'code',
    state: 'user' | 'char' | undefined
  ) => {
    if (!customization || !state) return 'inherit';
    const colorMap = {
      user: {
        text: customization.userTextColor,
        italic: customization.userItalicColor,
        quote: customization.userQuotedColor,
        code: customization.userTextColor,
      },
      char: {
        text: customization.charTextColor,
        italic: customization.charItalicColor,
        quote: customization.charQuotedColor,
        code: customization.charTextColor,
      },
    };
    return colorMap[state][type] || 'inherit';
  };

  return (
    <Box className="text-styles" sx={{ width: '100%' }}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeRaw]}
        components={{
          p: ({ children }) => (
            <Typography
              component="p"
              sx={{
                color: getColor('text', dataState),
                whiteSpace: 'pre-wrap',
                fontSize: '1.05rem',
                lineHeight: 1.75,
              }}
            >
              {children}
            </Typography>
          ),
          em: ({ children }) => (
            <Typography
              component="span"
              sx={{
                color: getColor('italic', dataState),
                fontStyle: 'italic',
                fontSize: '0.85rem',
                lineHeight: 1.6,
              }}
            >
              {children}
            </Typography>
          ),
          strong: ({ children }) => (
            <Typography
              component="span"
              sx={{
                color: getColor('text', dataState),
                fontWeight: 700,
                lineHeight: 1.6,
              }}
            >
              {children}
            </Typography>
          ),
          blockquote: ({ children }) => (
            <Box
              sx={{
                borderLeft: '4px solid #8884',
                backgroundColor: 'rgba(255,255,255,0.02)',
                padding: '10px 20px',
                fontStyle: 'italic',
                color: getColor('quote', dataState),
              }}
            >
              <Typography
                variant="body2"
                sx={{
                  fontSize: '0.9rem',
                  lineHeight: 1.7,
                }}
              >
                {children}
              </Typography>
            </Box>
          ),
          code: ({ children }) => (
            <Typography
              component="code"
              sx={{
                backgroundColor: '#2d2d2d',
                color: getColor('code', dataState),
                fontFamily: 'monospace',
                fontSize: '0.8rem',
                borderRadius: '6px',
                padding: '2px 6px',
                lineHeight: 1.5,
              }}
            >
              {children}
            </Typography>
          ),
          pre: ({ children }) => (
            <Box
              component="pre"
              sx={{
                backgroundColor: '#1e1e1e',
                color: getColor('code', dataState),
                fontFamily: 'monospace',
                fontSize: '0.8rem',
                borderRadius: '8px',
                padding: '16px',
                overflowX: 'auto',
              }}
            >
              <Typography
                component="code"
                sx={{
                  display: 'block',
                  whiteSpace: 'pre',
                  lineHeight: 1.6,
                }}
              >
                {children}
              </Typography>
            </Box>
          ),
          img: ({ src, alt }) => (
            <Box
              component="img"
              src={src}
              alt={alt || ''}
              sx={{
                maxWidth: '100%',
                height: 'auto',
                borderRadius: 2,
                boxShadow: '0 4px 14px rgba(0,0,0,0.4)',
              }}
            />
          ),
          hr: () => <Box sx={{ borderBottom: '1px solid #555' }} />,
        }}
      >
        {replacedText}
      </ReactMarkdown>
    </Box>
  );
}
