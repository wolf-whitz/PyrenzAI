import React, { useEffect, useState, useMemo } from 'react'
import llamaTokenizer from 'llama-tokenizer-js'
import { motion } from 'framer-motion'
import {
  TextField,
  Tooltip as MUITooltip,
  Typography,
  InputAdornment,
  Box,
} from '@mui/material'
import clsx from 'clsx'
import { z } from 'zod'
import debounce from 'lodash/debounce'

interface TextareaProps {
  name?: string
  value: string | string[]
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void
  label?: string
  placeholder?: string
  showTokenizer?: boolean
  className?: string
  maxLength?: number
  require_link?: boolean
  is_tag?: boolean
  onTagPressed?: (event: React.MouseEvent<HTMLElement>) => void
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
  const [isLinkValid, setIsLinkValid] = useState(true)
  const [characterCount, setCharacterCount] = useState(
    Array.isArray(value) ? value.join(', ').length : value.length
  )
  const [localTokenTotal, setLocalTokenTotal] = useState(0)

  const urlSchema = z.string().url()

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value

    if (require_link) {
      const validationResult = urlSchema.safeParse(newValue)
      setIsLinkValid(validationResult.success)
      if (!validationResult.success) return
    }

    onChange(e)
  }

  const displayValue = Array.isArray(value) ? value.join(', ') : value

  const tokenize = useMemo(
    () =>
      debounce((input: string) => {
        const tokens = llamaTokenizer.encode(input)
        setLocalTokenTotal(tokens.length)
      }, 250),
    []
  )

  useEffect(() => {
    const currentValue = Array.isArray(value) ? value.join(', ') : value
    setCharacterCount(currentValue.length)

    if (showTokenizer) {
      tokenize(currentValue)
    }

    return () => {
      tokenize.cancel()
    }
  }, [value, showTokenizer])

  return (
    <motion.div
      className={clsx('w-full mb-4', className)}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
        <Typography variant="body1" component="label" sx={{ color: '#fff' }}>
          {label}
        </Typography>
      </Box>

      <Box
        sx={{
          position: 'relative',
          width: '100%',
          borderRadius: '16px',
          background: 'rgba(255,255,255,0.03)',
          backdropFilter: 'blur(8px)',
          border: '1px solid rgba(255,255,255,0.08)',
          transition: 'all 0.3s ease',
          '&:hover': {
            background: 'rgba(255,255,255,0.04)',
            border: '1px solid rgba(255,255,255,0.15)',
          },
        }}
      >
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
              color: '#fff',
            },
          }}
          InputProps={{
            className: 'bg-transparent',
            sx: {
              '& fieldset': { border: 'none' },
              '& textarea': {
                fontSize: '0.95rem',
                lineHeight: 1.6,
              },
            },
            startAdornment: is_tag ? (
              <InputAdornment position="start">
                <Typography
                  variant="body2"
                  onClick={onTagPressed}
                  sx={{
                    position: 'absolute',
                    bottom: 8,
                    left: 16,
                    color: '#9ca3af',
                    fontSize: '0.8rem',
                    fontWeight: 500,
                    cursor: 'pointer',
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
  )
}
