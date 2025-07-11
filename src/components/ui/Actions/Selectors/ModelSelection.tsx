import { useState } from 'react';
import {
  MenuItem,
  Select,
  Box,
  Popover,
  IconButton,
  Typography,
  CircularProgress,
} from '@mui/material';
import { HelpOutlineOutlined as HelpIcon, Lock as LockIcon } from '@mui/icons-material';
import {
  PyrenzFormControl,
  PyrenzOutlinedInput,
  PyrenzInputLabel,
} from '~/theme';

interface PrivateModel {
  model_name: string;
  model_description: string;
}

interface ModelOption {
  value: string;
  label: string;
  description: string;
  subscription_plan: string;
  isPrivate?: boolean;
}

interface ModelSelectionProps {
  preferredModel: string;
  setPreferredModel: (value: string) => void;
  modelOptions: {
    value: string;
    label: string;
    description: string;
    subscription_plan: string;
  }[] | null;
  privateModels: { [key: string]: PrivateModel };
}

export function ModelSelection({
  preferredModel,
  setPreferredModel,
  modelOptions,
  privateModels,
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

  const mergedModels: ModelOption[] = [
    ...(modelOptions ?? []),
    ...Object.entries(privateModels)
      .filter(([key]) => !(modelOptions ?? []).some((opt) => opt.value === key))
      .map(([key, value]) => ({
        value: key,
        label: value.model_name,
        description: value.model_description,
        subscription_plan: 'Private',
        isPrivate: true,
      })),
  ];

  return (
    <Box sx={{ mt: 4 }}>
      <PyrenzFormControl fullWidth variant="outlined">
        <PyrenzInputLabel id="preferred-model-label">Preferred Model</PyrenzInputLabel>
        <Select
          labelId="preferred-model-label"
          id="preferred-model"
          value={preferredModel}
          label="Preferred Model"
          onChange={(e) => setPreferredModel(e.target.value)}
          input={<PyrenzOutlinedInput label="Preferred Model" />}
          sx={{ mb: 4 }}
          disabled={mergedModels.length === 0}
        >
          {mergedModels.length > 0 ? (
            mergedModels.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                <Box
                  display="flex"
                  alignItems="center"
                  justifyContent="space-between"
                  width="100%"
                >
                  <Box display="flex" alignItems="center">
                    <Typography>{option.label}</Typography>
                    {option.isPrivate && <LockIcon fontSize="small" sx={{ ml: 1 }} />}
                    <Typography variant="caption" color="textSecondary" sx={{ ml: 1 }}>
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
            ))
          ) : (
            <Box display="flex" justifyContent="center" p={2}>
              <CircularProgress />
            </Box>
          )}
        </Select>
      </PyrenzFormControl>
      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={(_, reason) => {
          if (reason !== 'backdropClick') {
            handlePopoverClose();
          }
        }}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
        sx={{ pointerEvents: 'none' }}
        disableRestoreFocus
      >
        <Box p={2}>{popoverContent}</Box>
      </Popover>
    </Box>
  );
}
