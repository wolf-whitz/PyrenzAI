import React, { useState } from 'react';
import { z } from 'zod';
import { useCharacterStore } from '~/store';
import { PyrenzModal, PyrenzModalContent, PyrenzBlueButton } from '~/theme';
import { Textarea } from '@components';
import { Box, Typography } from '@mui/material';

const characterSchema = z.object({
  name: z.string(),
  description: z.string().optional(),
  persona: z.string().optional(),
  model_instructions: z.string().optional(),
  scenario: z.string().optional(),
  gender: z.string().optional(),
  first_message: z.string(),
  creator: z.string().optional(),
  tags: z.array(z.string()).optional(),
  profile_image: z.string(),
  is_public: z.boolean().optional(),
  is_nsfw: z.boolean().optional(),
  is_details_private: z.boolean().optional(),
  lorebook: z.string().optional(),
});

interface ImportModalProps {
  open: boolean;
  onClose: () => void;
}

export function ImportModal({ open, onClose }: ImportModalProps) {
  const setCharacter = useCharacterStore((state) => state.setCharacter);
  const [error, setError] = useState<string | null>(null);
  const [rawInput, setRawInput] = useState<string>('');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const text = event.target?.result;
        if (typeof text !== 'string') throw new Error('File content invalid');
        const data = JSON.parse(text);
        const parsed = characterSchema.parse(data);
        setCharacter(parsed);
        setError(null);
        setRawInput('');
        onClose();
      } catch {
        setError('Invalid file format or missing required fields.');
      }
    };
    reader.readAsText(file);
  };

  const handleRawImport = () => {
    try {
      const data = JSON.parse(rawInput);
      const parsed = characterSchema.parse(data);
      setCharacter(parsed);
      setError(null);
      setRawInput('');
      onClose();
    } catch {
      setError('Invalid JSON or missing required fields.');
    }
  };

  return (
    <PyrenzModal open={open} onClose={onClose}>
      <PyrenzModalContent>
        <Typography variant="h6" gutterBottom>
          Import Data
        </Typography>
        <Typography variant="body2" color="text.secondary" mb={2}>
          Here you can import your saved data or configuration by uploading a JSON file or pasting the raw JSON below.
        </Typography>
        <Textarea
          placeholder="Paste your JSON data here..."
          value={rawInput}
          onChange={(e) => setRawInput(e.target.value)}
          className="w-full mb-3 font-mono"
        />
        <Box display="flex" gap={2}>
          <PyrenzBlueButton
            component="label"
            variant="contained"
            sx={{ flexShrink: 0 }}
          >
            Choose File
            <input
              type="file"
              hidden
              accept="application/json"
              onChange={handleFileChange}
            />
          </PyrenzBlueButton>
          <PyrenzBlueButton
            variant="contained"
            onClick={handleRawImport}
            disabled={!rawInput.trim()}
          >
            Import from Text
          </PyrenzBlueButton>
        </Box>
        {error && (
          <Typography color="error" mt={2}>
            {error}
          </Typography>
        )}
      </PyrenzModalContent>
    </PyrenzModal>
  );
}
