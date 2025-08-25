import React, { useState } from 'react';
import { CharacterPayloadSchema, CharacterPayload } from '@components';
import { useCharacterStore } from '~/store';
import { PyrenzModal, PyrenzModalContent, PyrenzBlueButton } from '~/theme';
import { Textarea } from '@components';
import { Box, Typography } from '@mui/material';

interface ImportModalProps {
  open: boolean;
  onClose: () => void;
}

export function ImportModal({ open, onClose }: ImportModalProps) {
  const setCharacter = useCharacterStore((state) => state.setCharacter);
  const [error, setError] = useState<string | null>(null);
  const [rawInput, setRawInput] = useState<string>('');

  const parseAndSetCharacter = (data: any) => {
    if (typeof data.first_message === 'string') {
      data.first_message = [data.first_message];
    }

    const parsed: CharacterPayload = CharacterPayloadSchema.parse(data);
    setCharacter(parsed);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const text = event.target?.result;
        if (typeof text !== 'string') throw new Error('File content invalid');
        const data = JSON.parse(text);
        parseAndSetCharacter(data);
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
      parseAndSetCharacter(data);
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
          <PyrenzBlueButton component="label" variant="contained" sx={{ flexShrink: 0 }}>
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
