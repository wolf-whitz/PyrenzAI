import React, { useEffect, useState } from 'react';
import llamaTokenizer from 'llama-tokenizer-js';
import { useCharacterStore } from '~/store';
import { motion } from 'framer-motion';
import { TextField, Tooltip as MUITooltip, Typography } from '@mui/material';
import classNames from 'classnames';

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
}: TextareaProps) {
  const [tokenCount, setTokenCount] = useState(0);
  const [isLinkValid, setIsLinkValid] = useState(true);
  const characterCount = value.length;
  const isMaxLengthExceeded = characterCount > maxLength;

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

  const textareaId =
    name || `textarea-${Math.random().toString(36).substr(2, 9)}`;

  return (
    <motion.div
      className={classNames('w-full mb-4 relative', className)}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex justify-between items-center mb-1">
        <Typography
          variant="body1"
          component="label"
          htmlFor={textareaId}
          sx={{ color: 'white' }}
        >
          {label}
        </Typography>
        {showTokenizer && (
          <MUITooltip title={`Token Count: ${tokenCount}`} arrow>
            <Typography
              variant="body2"
              sx={{ color: 'gray', cursor: 'pointer' }}
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
          className: classNames(
            'text-white bg-gray-800 border-none focus:outline-none focus:ring-2 shadow-md transition-all duration-300 ease-in-out',
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
      <Typography
        variant="caption"
        sx={{
          position: 'absolute',
          right: '8px',
          bottom: '8px',
          color: isMaxLengthExceeded ? 'red' : 'gray',
        }}
      >
        {characterCount}/{maxLength}
      </Typography>
    </motion.div>
  );
}
