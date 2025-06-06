import React, { useEffect, useState } from 'react';
import llamaTokenizer from 'llama-tokenizer-js';
import { useCharacterStore } from '~/store';
import { motion } from 'framer-motion';
import { TextField, Tooltip as MUITooltip, Typography } from '@mui/material';
import clsx from 'clsx';
import { z } from 'zod';

interface TextareaProps {
  name?: string;
  value: string;
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
  const [tokenCount, setTokenCount] = useState(0);
  const [isLinkValid, setIsLinkValid] = useState(true);
  const [characterCount, setCharacterCount] = useState(value.length);
  const [isMaxLengthExceeded, setIsMaxLengthExceeded] = useState(
    characterCount > maxLength
  );

  const setCharacter = useCharacterStore((state) => state.setCharacter);

  useEffect(() => {
    if (showTokenizer) {
      const tokens = llamaTokenizer.encode(value);
      const tokenLength = tokens.length;
      setTokenCount(tokenLength);
      setCharacter({
        textarea_token: {
          ...useCharacterStore.getState().textarea_token,
          [name || 'default']: tokenLength,
        },
      });
    } else {
      setTokenCount(0);
      setCharacter({
        textarea_token: {
          ...useCharacterStore.getState().textarea_token,
          [name || 'default']: 0,
        },
      });
    }
  }, [value, showTokenizer, setCharacter, name]);

  useEffect(() => {
    setCharacterCount(value.length);
    setIsMaxLengthExceeded(value.length > maxLength);
  }, [value, maxLength]);

  const urlSchema = z.string().url();

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value;
    if (require_link) {
      const validationResult = urlSchema.safeParse(newValue);
      setIsLinkValid(validationResult.success);
      if (!validationResult.success) {
        return;
      }
    }
    if (newValue.length <= maxLength) {
      onChange(e);
    }
  };

  return (
    <motion.div
      className={clsx('w-full mb-4 relative', className)}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex justify-between items-center mb-1">
        <Typography variant="body1" component="label" className="text-white">
          {label}
        </Typography>
        {showTokenizer && (
          <MUITooltip title={`Token Count: ${tokenCount}`} arrow>
            <Typography
              variant="body2"
              className="text-gray-500 cursor-pointer"
            >
              Tokens: {tokenCount}
            </Typography>
          </MUITooltip>
        )}
      </div>
      <TextField
        name={name}
        value={value}
        onChange={handleChange}
        placeholder={placeholder}
        multiline
        rows={4}
        variant="outlined"
        fullWidth
        error={!isLinkValid}
        helperText={!isLinkValid ? 'Please enter a valid link.' : ''}
        InputProps={{
          className: clsx(
            'text-white bg-gray-800 border-none focus:outline-none focus:ring-2 shadow-md transition-all duration-300 ease-in-out rounded-md focus:text-blue-500',
            {
              'ring-red-500': isMaxLengthExceeded,
              'focus:ring-gray-600 hover:ring-gray-700': !isMaxLengthExceeded,
            }
          ),
          style: { resize: 'none' },
        }}
        inputProps={{
          maxLength: maxLength,
        }}
      />
      {is_tag && (
        <Typography
          variant="body2"
          onClick={onTagPressed}
          className="absolute bottom-2 left-2 text-gray-500 cursor-pointer text-lg font-semibold p-2 rounded-md"
        >
          Tags
        </Typography>
      )}
      <Typography
        variant="caption"
        className={clsx('absolute right-2 bottom-2', {
          'text-red-500': isMaxLengthExceeded,
          'text-gray-500': !isMaxLengthExceeded,
        })}
      >
        {characterCount}/{maxLength}
      </Typography>
    </motion.div>
  );
}
