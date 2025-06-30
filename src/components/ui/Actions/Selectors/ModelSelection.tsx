import { useState } from 'react';
import {
  MenuItem,
  Select,
  Box,
  Popover,
  IconButton,
  Typography,
} from '@mui/material';
import { HelpOutlineOutlined as HelpIcon } from '@mui/icons-material';
import {
  PyrenzFormControl,
  PyrenzOutlinedInput,
  PyrenzInputLabel,
} from '~/theme';

interface ModelSelectionProps {
  preferredModel: string;
  setPreferredModel: (value: string) => void;
  modelOptions: {
    value: string;
    label: string;
    description: string;
    subscription_plan: string;
  }[];
}

export function ModelSelection({
  preferredModel,
  setPreferredModel,
  modelOptions,
}: ModelSelectionProps) {
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const [popoverContent, setPopoverContent] = useState('');

  const handlePopoverOpen = (
    event: React.MouseEvent<HTMLElement> | React.TouchEvent<HTMLElement>,
    description: string
  ) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget as HTMLElement);
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
              <Box
                display="flex"
                alignItems="center"
                justifyContent="space-between"
                width="100%"
              >
                <Box>
                  <Typography>{option.label}</Typography>
                  <Typography variant="caption" color="textSecondary">
                    Plan: {option.subscription_plan}
                  </Typography>
                </Box>
                <IconButton
                  onMouseEnter={(e) => {
                    e.stopPropagation();
                    handlePopoverOpen(e, option.description);
                  }}
                  onMouseLeave={(e) => {
                    e.stopPropagation();
                    handlePopoverClose();
                  }}
                  onClick={(e) => {
                    e.stopPropagation();
                    handlePopoverOpen(e, option.description);
                  }}
                  size="small"
                >
                  <HelpIcon fontSize="small" />
                </IconButton>
              </Box>
            </MenuItem>
          ))}
        </Select>
      </PyrenzFormControl>
      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={(_, __) => {
          handlePopoverClose();
        }}
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
        disableRestoreFocus
      >
        <Box p={2}>{popoverContent}</Box>
      </Popover>
    </Box>
  );
}
