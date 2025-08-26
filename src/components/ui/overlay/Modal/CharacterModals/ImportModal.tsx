import React, { useState } from 'react';
import { CharacterSimpleSchema, CharacterSimple } from '@components';
import { useCharacterStore } from '~/store';
import { PyrenzModal, PyrenzModalContent, PyrenzBlueButton } from '~/theme';
import { Box, Typography } from '@mui/material';
import { usePyrenzAlert } from '~/provider';

interface ImportModalProps {
  open: boolean;
  onClose: () => void;
}

export function ImportModal({ open, onClose }: ImportModalProps) {
  const setCharacter = useCharacterStore((state) => state.setCharacter);
  const showAlert = usePyrenzAlert();
  const [rawInput, setRawInput] = useState<string>('');

  const normalizeData = (data: any) => {
    if (data.first_message && typeof data.first_message === 'string') {
      data.first_message = [data.first_message];
    }
    if (data.message_example && Array.isArray(data.message_example)) {
      data.message_example = data.message_example.join(' ');
    }
    return data;
  };

  const parseAndSetCharacter = (data: any) => {
    try {
      const normalized = normalizeData(data);
      const parsed: CharacterSimple = CharacterSimpleSchema.parse(normalized);
      setCharacter((prev) => ({
        ...prev,
        ...parsed,
        first_message: Array.isArray(normalized.first_message)
          ? normalized.first_message
          : prev.first_message,
        message_example:
          typeof normalized.message_example === 'string'
            ? normalized.message_example
            : prev.message_example,
      }));
      showAlert('Character imported successfully!', 'success');
      onClose();
    } catch (err) {
      console.error(err);
      showAlert('Invalid JSON or missing required fields.', 'error');
    }
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
        setRawInput('');
      } catch (err) {
        console.error(err);
        showAlert('Invalid file format or missing required fields.', 'error');
      }
    };
    reader.readAsText(file);
  };

  const handleRawImport = () => {
    try {
      const data = JSON.parse(rawInput);
      parseAndSetCharacter(data);
      setRawInput('');
    } catch (err) {
      console.error(err);
      showAlert('Invalid JSON or missing required fields.', 'error');
    }
  };

  return (
    <PyrenzModal open={open} onClose={onClose}>
      <PyrenzModalContent>
        <Typography variant="h6" gutterBottom>
          Import Character
        </Typography>
        <Typography variant="body2" color="text.secondary" mb={2}>
          Upload a JSON file or paste your character JSON below to import.
        </Typography>
        <Box className="w-full mb-3 font-mono">
          <textarea
            placeholder="Paste your JSON here..."
            value={rawInput}
            onChange={(e) => setRawInput(e.target.value)}
            style={{
              width: '100%',
              minHeight: 120,
              padding: 12,
              borderRadius: 8,
              border: '1px solid #555',
              background: '#222',
              color: '#fff',
              fontFamily: 'monospace',
            }}
          />
        </Box>
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
      </PyrenzModalContent>
    </PyrenzModal>
  );
}
