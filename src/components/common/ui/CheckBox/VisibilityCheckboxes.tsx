import React from 'react';
import { motion } from 'framer-motion';
import { Checkbox, FormControlLabel, Typography } from '@mui/material';

interface VisibilityCheckboxesProps {
  isPublic: boolean;
  isNSFW: boolean;
  handleChange: (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => void;
}

export default function VisibilityCheckboxes({
  isPublic,
  isNSFW,
  handleChange,
}: VisibilityCheckboxesProps) {
  return (
    <motion.div
      className="flex flex-col space-y-2"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <Typography variant="body2" className="text-gray-400">
        Visibility
      </Typography>
      <div className="flex space-x-4">
        <FormControlLabel
          control={
            <Checkbox
              name="is_public"
              checked={isPublic}
              onChange={(e) =>
                handleChange({
                  target: { name: 'is_public', value: e.target.checked },
                } as any)
              }
              inputProps={{ 'aria-label': 'Public' }}
            />
          }
          label="Public"
        />
        <FormControlLabel
          control={
            <Checkbox
              name="is_nsfw"
              checked={isNSFW}
              onChange={(e) =>
                handleChange({
                  target: { name: 'is_nsfw', value: e.target.checked },
                } as any)
              }
              inputProps={{ 'aria-label': 'NSFW' }}
            />
          }
          label="NSFW"
        />
      </div>
    </motion.div>
  );
}
