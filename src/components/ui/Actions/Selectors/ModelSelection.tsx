import { useState } from 'react';
import { MenuItem, Select, Box, Popover, IconButton } from '@mui/material';
import { HelpCircle } from 'lucide-react';
import {
  PyrenzFormControl,
  PyrenzOutlinedInput,
  PyrenzInputLabel,
} from '~/theme';

interface ModelSelectionProps {
  preferredModel: string;
  setPreferredModel: (value: string) => void;
  modelOptions: { value: string; label: string; description: string }[];
}

export function ModelSelection({
  preferredModel,
  setPreferredModel,
  modelOptions,
}: ModelSelectionProps) {
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const [popoverContent, setPopoverContent] = useState('');

  const handlePopoverOpen = (
    event: React.MouseEvent<HTMLElement>,
    description: string
  ) => {
    setAnchorEl(event.currentTarget);
    setPopoverContent(description);
  };

  const handlePopoverClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);

  return (
    <Box sx={{ mt: 4 }}>
      <PyrenzFormControl fullWidth variant="outlined">
        <PyrenzInputLabel id="preferred-model-label">
          Preferred Model
        </PyrenzInputLabel>
        <Select
          labelId="preferred-model-label"
          id="preferred-model"
          value={preferredModel}
          label="Preferred Model"
          onChange={(e) => setPreferredModel(e.target.value)}
          input={<PyrenzOutlinedInput label="Preferred Model" />}
          sx={{ mb: 4 }}
        >
          {modelOptions.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              <Box display="flex" alignItems="center" justifyContent="space-between" width="100%">
                {option.label}
                <IconButton
                  onMouseEnter={(e) => handlePopoverOpen(e, option.description)}
                  onMouseLeave={handlePopoverClose}
                  size="small"
                >
                  <HelpCircle size={16} />
                </IconButton>
              </Box>
            </MenuItem>
          ))}
        </Select>
      </PyrenzFormControl>
      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={handlePopoverClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
        sx={{
          pointerEvents: 'none',
        }}
      >
        <Box p={2}>
          {popoverContent}
        </Box>
      </Popover>
    </Box>
  );
}
