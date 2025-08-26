import React from 'react';
import { motion } from 'framer-motion';
import {
  Checkbox,
  FormControlLabel,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { useCharacterStore } from '~/store';

export function VisibilityDropdown() {
  const setCharacter = useCharacterStore((state) => state.setCharacter);
  const isPublic = useCharacterStore((state) => state.is_public);
  const isNSFW = useCharacterStore((state) => state.is_nsfw);
  const isDetailsPrivate = useCharacterStore(
    (state) => state.is_details_private
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setCharacter({ [name]: checked });
  };

  return (
    <motion.div
      className="w-full"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <Accordion sx={{ backgroundColor: '#1e1e1e', color: '#fff' }}>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon sx={{ color: '#fff' }} />}
          aria-controls="visibility-content"
          id="visibility-header"
        >
          <Typography variant="body2" className="text-gray-400">
            Visibility Settings
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <div className="flex flex-col space-y-2">
            <FormControlLabel
              control={
                <Checkbox
                  name="is_public"
                  checked={!!isPublic}
                  onChange={handleChange}
                  inputProps={{ 'aria-label': 'Public' }}
                  sx={{
                    color: '#fff',
                    '&.Mui-checked': { color: '#fff' },
                  }}
                />
              }
              label="Public"
            />
            <FormControlLabel
              control={
                <Checkbox
                  name="is_nsfw"
                  checked={!!isNSFW}
                  onChange={handleChange}
                  inputProps={{ 'aria-label': 'NSFW' }}
                  sx={{
                    color: '#fff',
                    '&.Mui-checked': { color: '#fff' },
                  }}
                />
              }
              label="NSFW"
            />
            <FormControlLabel
              control={
                <Checkbox
                  name="is_details_private"
                  checked={!!isDetailsPrivate}
                  onChange={handleChange}
                  inputProps={{ 'aria-label': 'Hide Details' }}
                  sx={{
                    color: '#fff',
                    '&.Mui-checked': { color: '#fff' },
                  }}
                />
              }
              label="Hide Details"
            />
          </div>
        </AccordionDetails>
      </Accordion>
    </motion.div>
  );
}
