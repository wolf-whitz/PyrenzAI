import React from 'react';
import {
  Typography,
  Paper,
  List,
  ListItem,
  Box,
  IconButton,
  Link as MuiLink,
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
  const [copied, setCopied] = React.useState<{ [key: string]: boolean }>({});

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard
      .writeText(text)
      .then(() => {
        setCopied((prev) => ({ ...prev, [key]: true }));
        setTimeout(
          () => setCopied((prev) => ({ ...prev, [key]: false })),
          2000
        );
      })
      .catch((err) => {
        console.error('Failed to copy text: ', err);
      });
  };

  const components: Components = {
    h1: ({ children }) => (
      <Typography variant="h4" gutterBottom data-pyrenz-type="heading1">
        {children}
      </Typography>
    ),
    h2: ({ children }) => (
      <Typography variant="h5" gutterBottom data-pyrenz-type="heading2">
        {children}
      </Typography>
    ),
    h3: ({ children }) => (
      <Typography variant="h6" gutterBottom data-pyrenz-type="heading3">
        {children}
      </Typography>
    ),
    p: ({ children }) => (
      <Typography variant="body1" paragraph data-pyrenz-type="paragraph">
        {children}
      </Typography>
    ),
    code: ({ inline, children, className }: CustomCodeProps) => {
      const key = React.useId();
      const codeText = String(children).replace(/\n$/, '');

      if (inline) {
        return (
          <Box
            component="code"
            data-pyrenz-type="inline-code"
            sx={{
              bgcolor: 'rgba(0,0,0,0.05)',
              px: 0.5,
              py: 0.2,
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
        <Box sx={{ position: 'relative', my: 2 }} data-pyrenz-type="code-block">
          <SyntaxHighlighter
            language={language}
            style={atomOneDark}
            showLineNumbers
            customStyle={{
              margin: 0,
              borderRadius: 4,
              fontSize: '0.875rem',
              backgroundColor: '#000000',
              padding: '1rem',
            }}
            lineNumberStyle={{
              color: '#888',
              marginRight: '16px',
              fontSize: '0.75rem',
            }}
          >
            {codeText}
          </SyntaxHighlighter>
          <IconButton
            onClick={() => handleCopy(codeText, key)}
            sx={{
              position: 'absolute',
              top: 8,
              right: 8,
              color: copied[key] ? '#4caf50' : '#ffffff',
              zIndex: 1,
            }}
          >
            <ContentCopyIcon fontSize="small" />
          </IconButton>
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
          boxShadow: 1,
        }}
      />
    ),
    ul: ({ children }) => (
      <List sx={{ listStyle: 'disc inside' }} data-pyrenz-type="unordered-list">
        {children}
      </List>
    ),
    ol: ({ children }) => (
      <List
        sx={{ listStyle: 'decimal inside' }}
        data-pyrenz-type="ordered-list"
      >
        {children}
      </List>
    ),
    li: ({ children }) => (
      <ListItem sx={{ display: 'list-item' }} data-pyrenz-type="list-item">
        {children}
      </ListItem>
    ),
  };

  return (
    <ReactMarkdown components={components} remarkPlugins={[remarkGfm]}>
      {content}
    </ReactMarkdown>
  );
}
