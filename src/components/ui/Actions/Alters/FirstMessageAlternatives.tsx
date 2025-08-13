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
  setAlternativeMessages: React.Dispatch<React.SetStateAction<string[]>>;
}

export function FirstMessageAlternatives({
  alternativeMessages,
  currentIndex,
  maxAlternatives,
  placeholder,
  showTokenizer,
  maxLength,
  setCurrentIndex,
  setAlternativeMessages,
}: FirstMessageAlternativesProps) {
  const handleAlternativeMessageChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    const newMsgs = [...alternativeMessages];
    newMsgs[currentIndex] = e.target.value;
    setAlternativeMessages(newMsgs);
  };

  const addAlternativeMessage = () => {
    if (alternativeMessages.length < maxAlternatives) {
      setAlternativeMessages([...alternativeMessages, '']);
      setCurrentIndex(alternativeMessages.length);
    }
  };

  const removeAlternativeMessage = () => {
    if (alternativeMessages.length > 1) {
      const newMsgs = [...alternativeMessages];
      newMsgs.splice(currentIndex, 1);
      setAlternativeMessages(newMsgs);
      setCurrentIndex((prevIndex) => (prevIndex > 0 ? prevIndex - 1 : 0));
    }
  };

  const goPrev = () => {
    setCurrentIndex((i) => (i > 0 ? i - 1 : i));
  };

  const goNext = () => {
    setCurrentIndex((i) => (i < alternativeMessages.length - 1 ? i + 1 : i));
  };

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
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 0.5,
            ml: 1,
            color: 'text.secondary',
          }}
        >
          <IconButton
            onClick={goPrev}
            disabled={currentIndex === 0}
            aria-label="Previous message"
            size="small"
            sx={{
              color: currentIndex === 0 ? 'action.disabled' : 'text.secondary',
              padding: '2px',
              '&:hover': { backgroundColor: 'action.hover' },
            }}
          >
            <ChevronLeftIcon fontSize="small" />
          </IconButton>
          <Typography variant="body2" sx={{ minWidth: 30, textAlign: 'center' }}>
            {currentIndex + 1} / {alternativeMessages.length}
          </Typography>
          <IconButton
            onClick={goNext}
            disabled={currentIndex === alternativeMessages.length - 1}
            aria-label="Next message"
            size="small"
            sx={{
              color: currentIndex === alternativeMessages.length - 1 ? 'action.disabled' : 'text.secondary',
              padding: '2px',
              '&:hover': { backgroundColor: 'action.hover' },
            }}
          >
            <ChevronRightIcon fontSize="small" />
          </IconButton>
        </Box>
        <Box sx={{ display: 'flex', gap: 0.5 }}>
          <IconButton onClick={removeAlternativeMessage} disabled={alternativeMessages.length <= 1}>
            <RemoveIcon />
          </IconButton>
          <IconButton onClick={addAlternativeMessage} disabled={alternativeMessages.length >= maxAlternatives}>
            <AddIcon />
          </IconButton>
        </Box>
      </Box>
      <MemoizedTextarea
        name={`first_message_alternatives_${currentIndex}`}
        value={alternativeMessages[currentIndex]}
        onChange={handleAlternativeMessageChange}
        placeholder={placeholder}
        showTokenizer={showTokenizer}
        maxLength={maxLength}
        className="mb-2"
      />
    </Box>
  );
}
