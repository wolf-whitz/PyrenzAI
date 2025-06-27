import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  CheckOutlined as CheckOutlinedIcon,
  CloseOutlined as CloseOutlinedIcon,
} from '@mui/icons-material';
import { TextField, Button, Box } from '@mui/material';

interface MessageEditorProps {
  initialText: string;
  onSave: (newText: string) => void;
  onCancel: () => void;
}

export function MessageEditor({
  initialText,
  onSave,
  onCancel,
}: MessageEditorProps) {
  const [editedText, setEditedText] = useState(initialText);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: 2,
          border: '1px solid rgba(255, 255, 255, 0.23)',
          borderRadius: '8px',
          p: 2,
          bgcolor: 'background.paper',
          color: 'text.primary',
        }}
      >
        <TextField
          value={editedText}
          onChange={(e) => setEditedText(e.target.value)}
          autoFocus
          multiline
          rows={3}
          variant="outlined"
          sx={{
            '& .MuiOutlinedInput-root': {
              '& fieldset': {
                borderColor: 'rgba(255, 255, 255, 0.23)',
              },
              '&:hover fieldset': {
                borderColor: 'rgba(255, 255, 255, 0.5)',
              },
              '&.Mui-focused fieldset': {
                borderColor: 'rgba(255, 255, 255, 0.5)',
              },
            },
            '& .MuiInputBase-input': {
              color: 'white',
            },
          }}
        />

        <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
          <Button
            onClick={onCancel}
            startIcon={<CloseOutlinedIcon />}
            sx={{
              color: 'rgba(255, 255, 255, 0.7)',
              '&:hover': { color: '#ef5350' },
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={() => onSave(editedText)}
            startIcon={<CheckOutlinedIcon />}
            sx={{
              color: 'rgba(255, 255, 255, 0.7)',
              '&:hover': { color: '#66bb6a' },
            }}
          >
            Save
          </Button>
        </Box>
      </Box>
    </motion.div>
  );
}
