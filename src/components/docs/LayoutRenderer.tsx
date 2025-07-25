import React, { useState } from 'react';
import {
  Typography,
  Paper,
  List,
  ListItem,
  Box,
  IconButton,
  Tooltip,
  Link as MuiLink,
  Fade,
} from '@mui/material';
import ReactMarkdown, { Components } from 'react-markdown';
import remarkGfm from 'remark-gfm';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import { Light as SyntaxHighlighter } from 'react-syntax-highlighter';
import ts from 'react-syntax-highlighter/dist/esm/languages/hljs/typescript';
import js from 'react-syntax-highlighter/dist/esm/languages/hljs/javascript';
import { atomOneDark } from 'react-syntax-highlighter/dist/esm/styles/hljs';
import type { DocMeta } from '@shared-types';

SyntaxHighlighter.registerLanguage('typescript', ts);
SyntaxHighlighter.registerLanguage('javascript', js);

type CustomCodeProps = {
  inline?: boolean;
  children?: React.ReactNode;
  className?: string;
};

export function LayoutRenderer({
  meta,
  content,
}: {
  meta: DocMeta;
  content: string;
}): React.ReactElement {
  const [copied, setCopied] = useState<string | null>(null);

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard
      .writeText(text)
      .then(() => {
        setCopied(key);
        setTimeout(() => setCopied(null), 2000);
      })
      .catch((err) => {
        console.error('Failed to copy text: ', err);
      });
  };

  const components: Components = {
    h1: ({ children }) => (
      <Typography variant="h4" gutterBottom fontWeight={700} data-pyrenz-type="heading1">
        {children}
      </Typography>
    ),
    h2: ({ children }) => (
      <Typography variant="h5" gutterBottom fontWeight={600} data-pyrenz-type="heading2">
        {children}
      </Typography>
    ),
    h3: ({ children }) => (
      <Typography variant="h6" gutterBottom fontWeight={600} data-pyrenz-type="heading3">
        {children}
      </Typography>
    ),
    p: ({ children }) => (
      <Typography variant="body1" paragraph data-pyrenz-type="paragraph">
        {children}
      </Typography>
    ),
    strong: ({ children }) => (
      <Box component="strong" fontWeight="bold" data-pyrenz-type="bold">
        {children}
      </Box>
    ),
    em: ({ children }) => (
      <Box component="em" fontStyle="italic" data-pyrenz-type="italic">
        {children}
      </Box>
    ),
    code: ({ inline, children, className }: CustomCodeProps) => {
      const codeText = String(children).replace(/\n$/, '');
      const key = `${className}-${codeText.slice(0, 8)}`;

      if (inline) {
        return (
          <Box
            component="code"
            data-pyrenz-type="inline-code"
            sx={{
              bgcolor: 'rgba(0,0,0,0.05)',
              px: 0.6,
              py: 0.3,
              borderRadius: 1,
              fontFamily: 'monospace',
              fontSize: '0.875rem',
            }}
          >
            {children}
          </Box>
        );
      }

      const match = /language-(\w+)/.exec(className || '');
      const language = match?.[1] || 'text';

      return (
        <Box
          sx={{ position: 'relative', my: 3, borderRadius: 2, overflow: 'hidden' }}
          data-pyrenz-type="code-block"
        >
          <SyntaxHighlighter
            language={language}
            style={atomOneDark}
            showLineNumbers
            customStyle={{
              margin: 0,
              padding: '1rem',
              backgroundColor: '#0d1117',
              fontSize: '0.875rem',
              lineHeight: 1.6,
            }}
            lineNumberStyle={{
              color: '#555',
              fontSize: '0.75rem',
              marginRight: '16px',
            }}
          >
            {codeText}
          </SyntaxHighlighter>
          <Fade in timeout={300}>
            <Tooltip title={copied === key ? 'Copied!' : 'Copy'} arrow placement="top">
              <IconButton
                onClick={() => handleCopy(codeText, key)}
                sx={{
                  position: 'absolute',
                  top: 8,
                  right: 8,
                  color: copied === key ? '#4caf50' : '#fff',
                  backgroundColor: 'rgba(0,0,0,0.3)',
                  '&:hover': {
                    backgroundColor: 'rgba(255,255,255,0.1)',
                  },
                }}
              >
                <ContentCopyIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          </Fade>
        </Box>
      );
    },
    a: ({ href, children }) => (
      <MuiLink
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        underline="hover"
        sx={{ color: '#42a5f5' }}
      >
        {children}
      </MuiLink>
    ),
    img: ({ src = '', alt = '' }) => (
      <Box
        component="img"
        src={src}
        alt={alt}
        sx={{
          maxWidth: '100%',
          borderRadius: 2,
          my: 2,
          display: 'block',
          mx: 'auto',
          boxShadow: 2,
        }}
      />
    ),
    ul: ({ children }) => (
      <List sx={{ listStyle: 'disc inside', pl: 2 }} data-pyrenz-type="unordered-list">
        {children}
      </List>
    ),
    ol: ({ children }) => (
      <List sx={{ listStyle: 'decimal inside', pl: 2 }} data-pyrenz-type="ordered-list">
        {children}
      </List>
    ),
    li: ({ children }) => (
      <ListItem sx={{ display: 'list-item', py: 0.5 }} data-pyrenz-type="list-item">
        {children}
      </ListItem>
    ),
  };

  return (
    <Paper elevation={0} sx={{ p: { xs: 2, sm: 3, md: 4 }, bgcolor: 'background.default' }}>
      <ReactMarkdown components={components} remarkPlugins={[remarkGfm]}>
        {content}
      </ReactMarkdown>
    </Paper>
  );
}
