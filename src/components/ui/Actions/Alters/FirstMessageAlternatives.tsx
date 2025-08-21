import React, { ChangeEvent } from 'react';
import { Box, Typography, IconButton } from '@mui/material';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
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
}

export function FirstMessageAlternatives({
  alternativeMessages,
  currentIndex,
  maxAlternatives,
  placeholder,
  showTokenizer,
  maxLength,
  setCurrentIndex,
  updateAlternativeMessage,
}: FirstMessageAlternativesProps) {
  const handleChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    updateAlternativeMessage(e.target.value, currentIndex);
  };

  const addAlternative = () => {
    if (alternativeMessages.length < maxAlternatives) {
      updateAlternativeMessage('', alternativeMessages.length);
      setCurrentIndex(alternativeMessages.length);
    }
  };

  const removeAlternative = () => {
    if (alternativeMessages.length <= 1) return;
    const newMsgs = alternativeMessages.filter((_, i) => i !== currentIndex);
    newMsgs.forEach((msg, i) => updateAlternativeMessage(msg, i));
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : 0));
  };

  const prev = () => setCurrentIndex((i) => (i > 0 ? i - 1 : i));
  const next = () => setCurrentIndex((i) => (i < alternativeMessages.length - 1 ? i + 1 : i));

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
          <IconButton onClick={prev} disabled={currentIndex === 0} size="small">
            <ChevronLeftIcon fontSize="small" />
          </IconButton>

          <Typography variant="body2" sx={{ minWidth: 30, textAlign: 'center' }}>
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
          <IconButton onClick={removeAlternative} disabled={alternativeMessages.length <= 1}>
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
