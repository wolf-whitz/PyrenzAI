import React, { useEffect, useState } from 'react';
import llamaTokenizer from 'llama-tokenizer-js';
import { motion } from 'framer-motion';
import {
  TextField,
  Tooltip as MUITooltip,
  Typography,
  InputAdornment,
  Box,
} from '@mui/material';
import clsx from 'clsx';
import { z } from 'zod';

interface TextareaProps {
  name?: string;
  value: string | string[];
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  label?: string;
  placeholder?: string;
  showTokenizer?: boolean;
  className?: string;
  maxLength?: number;
  require_link?: boolean;
  is_tag?: boolean;
  onTagPressed?: (event: React.MouseEvent<HTMLElement>) => void;
}

export function Textarea({
  name,
  value,
  onChange,
  label,
  placeholder = '',
  showTokenizer = false,
  className = '',
  maxLength = 12000,
  require_link = false,
  is_tag = false,
  onTagPressed,
}: TextareaProps) {
  const [isLinkValid, setIsLinkValid] = useState(true);
  const [characterCount, setCharacterCount] = useState(
    Array.isArray(value) ? value.join(', ').length : value.length
  );
  const [localTokenTotal, setLocalTokenTotal] = useState(0);

  useEffect(() => {
    const currentValue = Array.isArray(value) ? value.join(', ') : value;
    setCharacterCount(currentValue.length);
    if (showTokenizer) {
      const tokens = llamaTokenizer.encode(currentValue);
      setLocalTokenTotal(tokens.length);
    }
  }, [value, showTokenizer]);

  const urlSchema = z.string().url();

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value;
    if (require_link) {
      const validationResult = urlSchema.safeParse(newValue);
      setIsLinkValid(validationResult.success);
      if (!validationResult.success) return;
    }
    onChange(e);
  };

  const displayValue = Array.isArray(value) ? value.join(', ') : value;

  return (
    <motion.div
      className={clsx('w-full mb-4', className)}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex justify-between items-center mb-1">
        <Typography variant="body1" component="label" className="text-white">
          {label}
        </Typography>
      </div>
      <Box className="relative w-full">
        <TextField
          name={name}
          value={displayValue}
          onChange={handleChange}
          placeholder={placeholder}
          multiline
          rows={4}
          variant="outlined"
          fullWidth
          error={!isLinkValid}
          helperText={!isLinkValid ? 'Please enter a valid link.' : ' '}
          inputProps={{
            maxLength: maxLength,
            style: {
              paddingBottom: '40px',
            },
          }}
          InputProps={{
            className:
              'text-white bg-gray-800 border-none outline-none shadow-md transition-all duration-300 ease-in-out rounded-md',
            style: { resize: 'none' },
            startAdornment: is_tag ? (
              <InputAdornment position="start">
                <Typography
                  variant="body2"
                  onClick={onTagPressed}
                  className="text-gray-500 cursor-pointer text-sm font-semibold"
                  sx={{
                    position: 'absolute',
                    bottom: 8,
                    left: 16,
                    pointerEvents: 'auto',
                  }}
                >
                  Tags
                </Typography>
              </InputAdornment>
            ) : null,
            endAdornment: (
              <InputAdornment position="end">
                <Box
                  sx={{
                    display: 'flex',
                    gap: '8px',
                    alignItems: 'center',
                    position: 'absolute',
                    bottom: 8,
                    right: 16,
                    pointerEvents: 'none',
                  }}
                >
                  <MUITooltip
                    title={`Character Count: ${characterCount}/${maxLength}`}
                    arrow
                  >
                    <Typography
                      variant="caption"
                      sx={{
                        fontSize: '0.75rem',
                        color: '#9ca3af',
                        pointerEvents: 'auto',
                        cursor: 'default',
                      }}
                    >
                      {characterCount}/{maxLength}
                    </Typography>
                  </MUITooltip>
                  {showTokenizer && (
                    <MUITooltip title={`Token Count: ${localTokenTotal}`} arrow>
                      <Typography
                        variant="caption"
                        sx={{
                          fontSize: '0.75rem',
                          color: '#9ca3af',
                          pointerEvents: 'auto',
                          cursor: 'pointer',
                        }}
                      >
                        Tokens: {localTokenTotal}
                      </Typography>
                    </MUITooltip>
                  )}
                </Box>
              </InputAdornment>
            ),
          }}
        />
      </Box>
    </motion.div>
  );
}
