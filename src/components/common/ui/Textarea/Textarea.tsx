import React, { useEffect, useState } from 'react';
import llamaTokenizer from 'llama-tokenizer-js';
import { useCharacterStore } from '~/store';
import { motion } from 'framer-motion';
import { TextField, Tooltip as MUITooltip, Typography } from '@mui/material';
import clsx from 'clsx';

interface TextareaProps {
  name?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  label: string;
  placeholder?: string;
  showTokenizer?: boolean;
  className?: string;
  maxLength?: number;
  require_link?: boolean;
  is_tag?: boolean;
  onTagPressed?: (event: React.MouseEvent<HTMLElement>) => void;
}

export default function Textarea({
  name,
  value,
  onChange,
  label,
  placeholder = '',
  showTokenizer = false,
  className = '',
  maxLength = 15000,
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

  const setCharacterData = useCharacterStore((state) => state.setCharacterData);

  useEffect(() => {
    if (showTokenizer) {
      const tokens = llamaTokenizer.encode(value);
      const tokenLength = tokens.length;
      setTokenCount(tokenLength);
      setCharacterData({
        textarea_token: {
          ...useCharacterStore.getState().textarea_token,
          [name || 'default']: tokenLength,
        },
      });
    } else {
      setTokenCount(0);
      setCharacterData({
        textarea_token: {
          ...useCharacterStore.getState().textarea_token,
          [name || 'default']: 0,
        },
      });
    }
  }, [value, showTokenizer, setCharacterData, name]);

  useEffect(() => {
    setCharacterCount(value.length);
    setIsMaxLengthExceeded(value.length > maxLength);
  }, [value, maxLength]);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value;
    if (require_link) {
      const urlPattern =
        /^(https?:\/\/)?([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}(\/[^\s]*)?$/;
      setIsLinkValid(urlPattern.test(newValue));
      if (!urlPattern.test(newValue)) {
        return;
      }
    }
    if (newValue.length <= maxLength) {
      onChange(e);
    }
  };

  const handleTagClick = (tag: string) => {
    const newValue = value
      ? `${value.trim()}${value.trim().endsWith(',') ? '' : ', '}${tag}`
      : tag;
    const event = {
      target: {
        value: newValue,
        name: name,
      },
    } as React.ChangeEvent<HTMLTextAreaElement>;
    onChange(event);
  };

  const textareaId =
    name || `textarea-${Math.random().toString(36).substr(2, 9)}`;

  return (
    <motion.div
      className={clsx('w-full mb-4 relative', className)}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex justify-between items-center mb-1">
        <Typography
          variant="body1"
          component="label"
          htmlFor={textareaId}
          className="text-white"
        >
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
        id={textareaId}
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
            'text-white bg-gray-800 border-none focus:outline-none focus:ring-2 shadow-md transition-all duration-300 ease-in-out rounded-md',
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
          className="absolute bottom-2 left-2 text-gray-500 cursor-pointer text-lg font-semibold p-2 bg-gray-800 rounded-md"
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
