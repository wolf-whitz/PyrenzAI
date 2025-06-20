import React, { useState } from 'react';
import { Box, Typography, Modal, Stack } from '@mui/material';
import { PyrenzBlueButton } from '~/theme';
import { useUserStore } from '~/store';
import { supabase } from '~/Utility/supabaseClient';
interface MessageCustomizationModalProps {
  open: boolean;
  onClose: () => void;
}

export function MessageCustomizationModal({ open, onClose }: MessageCustomizationModalProps) {
  const { customization, setCustomization } = useUserStore();

  const {
    userTextColor,
    charTextColor,
    userItalicColor,
    charItalicColor,
    userQuotedColor,
    charQuotedColor,
  } = customization || {};

  const [colors, setColors] = useState({
    userTextColor,
    charTextColor,
    userItalicColor,
    charItalicColor,
    userQuotedColor,
    charQuotedColor,
  });

  const handleColorChange = (colorType: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setColors({
      ...colors,
      [colorType]: e.target.value,
    });
  };

  const handleSave = () => {
    setCustomization(colors);
    onClose();
  };

  const handleReset = () => {
    setColors({
      userTextColor: '#FFFFFF',
      charTextColor: '#FFFFFF',
      userItalicColor: '#999999',
      charItalicColor: '#999999',
      userQuotedColor: '#AAAAAA',
      charQuotedColor: '#93BEE6',
    });
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: 400, bgcolor: 'background.paper', boxShadow: 24, p: 4, borderRadius: 2 }}>
        <Typography variant="h6" gutterBottom>
          Chat Appearance
        </Typography>

        <Stack direction="column" spacing={2}>
          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Typography variant="body1" color="text.secondary">
              User Text Color:
            </Typography>
            <input type="color" value={colors.userTextColor} onChange={handleColorChange('userTextColor')} />
          </Stack>

          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Typography variant="body1" color="text.secondary">
              Character Text Color:
            </Typography>
            <input type="color" value={colors.charTextColor} onChange={handleColorChange('charTextColor')} />
          </Stack>

          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Typography variant="body1" color="text.secondary">
              User Italic Color:
            </Typography>
            <input type="color" value={colors.userItalicColor} onChange={handleColorChange('userItalicColor')} />
          </Stack>

          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Typography variant="body1" color="text.secondary">
              Character Italic Color:
            </Typography>
            <input type="color" value={colors.charItalicColor} onChange={handleColorChange('charItalicColor')} />
          </Stack>

          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Typography variant="body1" color="text.secondary">
              User Quoted Color:
            </Typography>
            <input type="color" value={colors.userQuotedColor} onChange={handleColorChange('userQuotedColor')} />
          </Stack>

          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Typography variant="body1" color="text.secondary">
              Character Quoted Color:
            </Typography>
            <input type="color" value={colors.charQuotedColor} onChange={handleColorChange('charQuotedColor')} />
          </Stack>
        </Stack>

        <PyrenzBlueButton
          onClick={handleReset}
          variant="contained"
          color="primary"
          fullWidth
          sx={{ mt: 2 }}
        >
          Reset to Default
        </PyrenzBlueButton>

        <PyrenzBlueButton
          onClick={handleSave}
          variant="contained"
          color="primary"
          fullWidth
          sx={{ mt: 2 }}
        >
          Save Changes
        </PyrenzBlueButton>
      </Box>
    </Modal>
  );
}
