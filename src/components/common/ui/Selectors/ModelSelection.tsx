import React from 'react';
import { MenuItem, Select } from '@mui/material';

interface ModelSelectionProps {
  preferredModel: string;
  setPreferredModel: (value: string) => void;
  modelOptions: { value: string; label: string }[];
}

export default function ModelSelection({
  preferredModel,
  setPreferredModel,
  modelOptions,
}: ModelSelectionProps) {
  return (
    <div className="mt-4">
      <label className="block text-sm font-medium text-gray-300 mb-2">
        Preferred Model
      </label>
      <Select
        value={preferredModel}
        onChange={(e) => setPreferredModel(e.target.value)}
        variant="outlined"
        fullWidth
        className="mb-4"
      >
        {modelOptions.map((option) => (
          <MenuItem key={option.value} value={option.value}>
            {option.label}
          </MenuItem>
        ))}
      </Select>
    </div>
  );
}
