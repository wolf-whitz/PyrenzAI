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
  disableReplacement?: boolean;
}

export function CustomMarkdown({
  text = '',
  char,
  ai_message = '',
  dataState,
  disableReplacement = false,
}: CustomMarkdownProps) {
  const [replacedText, setReplacedText] = useState('');
  const { customization, username, personaName } = useUserStore();

  useEffect(() => {
    const replace = (content: string = '') => {
      if (disableReplacement) return content;

      return content
        .replace(/{{char}}/g, char?.name || 'Anon')
        .replace(/{{user}}/g, personaName || username || 'Anon')
        .replace(/{{you}}:/g, '')
        .replace(/{{ai_message}}/g, ai_message);
    };
    setReplacedText(replace(text));
  }, [text, char, username, personaName, ai_message, disableReplacement]);

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

  const preLikeStyles = {
    wrapper: {
      fontSize: '1.0rem',
      borderRadius: '8px',
      padding: '16px',
      whiteSpace: 'pre-wrap' as const,
      wordWrap: 'break-word' as const,
      overflowWrap: 'anywhere' as const,
    },
    inner: {
      display: 'block',
      lineHeight: 1.6,
      whiteSpace: 'pre-wrap' as const,
      wordWrap: 'break-word' as const,
    },
  };

  const ItalicLike = ({ children }: { children: React.ReactNode }) => {
    const content = String(children);
    const enlarged = /^".*"$/.test(content);
    return (
      <Typography
        component="span"
        sx={{
          ...preLikeStyles.wrapper,
          color: getColor('italic', dataState),
          fontStyle: 'italic',
          fontSize: enlarged ? '1rem' : preLikeStyles.wrapper.fontSize,
        }}
      >
        {children}
      </Typography>
    );
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
                fontSize: '1.1rem',
                lineHeight: 1.9,
              }}
            >
              {children}
            </Typography>
          ),
          em: ({ children }) => <ItalicLike>{children}</ItalicLike>,
          strong: ({ children }) => <ItalicLike>{children}</ItalicLike>,
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
              <Typography variant="body2" sx={{ fontSize: '0.9rem', lineHeight: 1.7 }}>
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
                fontSize: '0.8rem',
                borderRadius: '6px',
                padding: '2px 6px',
                whiteSpace: 'pre-wrap',
                wordWrap: 'break-word',
                overflowWrap: 'anywhere',
              }}
            >
              {children}
            </Typography>
          ),
          pre: ({ children }) => (
            <Box
              component="pre"
              sx={{ ...preLikeStyles.wrapper, color: getColor('code', dataState) }}
            >
              <Typography component="code" sx={preLikeStyles.inner}>
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
        {typeof replacedText === 'string' ? replacedText : ''}
      </ReactMarkdown>
    </Box>
  );
}
