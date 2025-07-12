import React, { useEffect, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
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
  const [replacedText, setReplacedText] = useState<string>(text);
  const { customization, username, personaName } = useUserStore();

  useEffect(() => {
    const replacePlaceholders = (content) =>
      content
        .replace(/{{char}}/g, char?.name || 'Anon')
        .replace(/{{user}}/g, personaName || username || 'Anon')
        .replace(/{{you}}:/g, '')
        .replace(/{{ai_message}}/g, ai_message);
    setReplacedText(replacePlaceholders(text));
  }, [text, char, username, personaName, ai_message]);

  const getColor = (
    type: 'text' | 'italic' | 'quote',
    state: 'user' | 'char' | undefined
  ) => {
    if (!customization || !state) return 'inherit';
    const colorMap = {
      user: {
        text: customization.userTextColor,
        italic: customization.userItalicColor,
        quote: customization.userQuotedColor,
      },
      char: {
        text: customization.charTextColor,
        italic: customization.charItalicColor,
        quote: customization.charQuotedColor,
      },
    };
    return colorMap[state][type] || 'inherit';
  };

  return (
    <Box className="text-styles">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          em: ({ children }) => (
            <Typography
              component="span"
              sx={{
                color: getColor('italic', dataState),
                fontStyle: 'italic',
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
              }}
            >
              {children}
            </Typography>
          ),
          p: ({ children }) => (
            <Typography
              component="p"
              data-state={dataState}
              sx={{
                whiteSpace: 'pre-wrap',
                color: getColor('text', dataState),
              }}
            >
              {children}
            </Typography>
          ),
          blockquote: ({ children }) => (
            <Typography
              component="blockquote"
              data-state={dataState}
              sx={{
                color: getColor('quote', dataState),
                borderLeft: '2px solid #ccc',
                paddingLeft: 2,
                marginLeft: 0,
                fontStyle: 'italic',
              }}
            >
              {children}
            </Typography>
          ),
          img: ({ src, alt }) => (
            <Box component="img" src={src} alt={alt || ''} sx={{ maxWidth: '100%', height: 'auto' }} />
          ),
          hr: () => null,
        }}
      >
        {replacedText}
      </ReactMarkdown>
    </Box>
  );
}
