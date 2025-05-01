import React from 'react';
import { FormControl, InputLabel, Select, MenuItem, SelectChangeEvent } from '@mui/material';

interface AIOption {
  Website: string;
  Placeholder: string;
}

interface AISelectDropdownProps {
  options: AIOption[];
  selectedAI: string;
  placeholder: string;
  onAISelectionChange: (event: SelectChangeEvent<string>) => void;
}

export default function AISelectDropdown({ options, selectedAI, placeholder, onAISelectionChange }: AISelectDropdownProps) {
  return (
    <FormControl fullWidth className="mb-4">
      <InputLabel id="ai-select-label" sx={{ color: 'white' }}>Select AI</InputLabel>
      <Select
        labelId="ai-select-label"
        id="ai-select"
        value={selectedAI}
        label="Select AI"
        onChange={onAISelectionChange}
        sx={{ color: 'white' }}
      >
        {options.map((option, index) => (
          <MenuItem key={index} value={option.Website}>
            {option.Website}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}
