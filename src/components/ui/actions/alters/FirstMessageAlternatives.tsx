import React, { ChangeEvent, useCallback } from 'react';
import { Box, Typography, IconButton } from '@mui/material';
import {
  ChevronLeft as ChevronLeftIcon,
  ChevronRight as ChevronRightIcon,
  Add as AddIcon,
  Remove as RemoveIcon,
} from '@mui/icons-material';
import { MemoizedTextarea } from '@components';

interface FirstMessageAlternativesProps {
  alternativeMessages: string[];
  currentIndex: number;
  maxAlternatives: number;
  placeholder?: string;
  showTokenizer?: boolean;
  maxLength?: number;
  setCurrentIndex: React.Dispatch<React.SetStateAction<number>>;
  updateAlternativeMessage: (newValue: string, index?: number) => void;
  removeAlternative: (index: number) => void;
}

export const FirstMessageAlternatives = React.memo(
  ({
    alternativeMessages,
    currentIndex,
    maxAlternatives,
    placeholder,
    showTokenizer,
    maxLength,
    setCurrentIndex,
    updateAlternativeMessage,
    removeAlternative,
  }: FirstMessageAlternativesProps) => {
    const handleChange = useCallback(
      (e: ChangeEvent<HTMLTextAreaElement>) => {
        updateAlternativeMessage(e.target.value, currentIndex);
      },
      [updateAlternativeMessage, currentIndex]
    );

    const addAlternative = useCallback(() => {
      if (alternativeMessages.length < maxAlternatives) {
        updateAlternativeMessage('', alternativeMessages.length);
        setCurrentIndex(alternativeMessages.length);
      }
    }, [
      alternativeMessages.length,
      maxAlternatives,
      updateAlternativeMessage,
      setCurrentIndex,
    ]);

    const handleRemove = useCallback(() => {
      if (alternativeMessages.length > 1) {
        removeAlternative(currentIndex);
        setCurrentIndex((prev) =>
          prev >= alternativeMessages.length - 1 ? prev - 1 : prev
        );
      }
    }, [
      alternativeMessages.length,
      currentIndex,
      removeAlternative,
      setCurrentIndex,
    ]);

    const prev = useCallback(
      () => setCurrentIndex((i) => (i > 0 ? i - 1 : i)),
      [setCurrentIndex]
    );
    const next = useCallback(
      () =>
        setCurrentIndex((i) =>
          i < alternativeMessages.length - 1 ? i + 1 : i
        ),
      [setCurrentIndex, alternativeMessages.length]
    );

    return (
      <Box sx={{ mb: 3 }}>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1,
            mb: 1,
            fontWeight: 500,
            fontSize: '1rem',
            color: 'text.secondary',
            userSelect: 'none',
          }}
        >
          <Typography component="label" sx={{ flexShrink: 0 }}>
            First Message
          </Typography>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, ml: 1 }}>
            <IconButton
              onClick={prev}
              disabled={currentIndex === 0}
              size="small"
            >
              <ChevronLeftIcon fontSize="small" />
            </IconButton>

            <Typography
              variant="body2"
              sx={{ minWidth: 30, textAlign: 'center' }}
            >
              {currentIndex + 1} / {alternativeMessages.length}
            </Typography>

            <IconButton
              onClick={next}
              disabled={currentIndex === alternativeMessages.length - 1}
              size="small"
            >
              <ChevronRightIcon fontSize="small" />
            </IconButton>
          </Box>

          <Box sx={{ display: 'flex', gap: 0.5 }}>
            <IconButton
              onClick={handleRemove}
              disabled={alternativeMessages.length <= 1}
            >
              <RemoveIcon />
            </IconButton>

            <IconButton
              onClick={addAlternative}
              disabled={alternativeMessages.length >= maxAlternatives}
            >
              <AddIcon />
            </IconButton>
          </Box>
        </Box>

        <MemoizedTextarea
          name={`first_message_alternatives_${currentIndex}`}
          value={alternativeMessages[currentIndex]}
          onChange={handleChange}
          placeholder={placeholder}
          showTokenizer={showTokenizer}
          maxLength={maxLength}
          className="mb-2"
        />
      </Box>
    );
  }
);
