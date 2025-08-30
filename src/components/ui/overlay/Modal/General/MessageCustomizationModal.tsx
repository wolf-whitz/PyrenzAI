import React, { useState } from 'react';
import { Box, Typography, Stack } from '@mui/material';
import {
  PyrenzBlueButton,
  PyrenzMessageBox,
  PyrenzColorPicker,
  PyrenzModal,
  PyrenzModalContent,
  GlassSwitch
} from '~/theme';
import { useUserStore } from '~/store';

interface MessageCustomizationModalProps {
  open: boolean;
  onClose: () => void;
}

interface ColorCustomization {
  userTextColor: string;
  charTextColor: string;
  userItalicColor: string;
  charItalicColor: string;
  userQuotedColor: string;
  charQuotedColor: string;
  user_color: string;
  char_color: string;
}

const colorFields: { key: keyof ColorCustomization; label: string }[] = [
  { key: 'user_color', label: 'User Background Color' },
  { key: 'char_color', label: 'Character Background Color' },
  { key: 'userTextColor', label: 'User Text Color' },
  { key: 'charTextColor', label: 'Character Text Color' },
  { key: 'userItalicColor', label: 'User Italic Color' },
  { key: 'charItalicColor', label: 'Character Italic Color' },
  { key: 'userQuotedColor', label: 'User Quoted Color' },
  { key: 'charQuotedColor', label: 'Character Quoted Color' },
];

export function MessageCustomizationModal({ open, onClose }: MessageCustomizationModalProps) {
  const { customization, setCustomization, strip_incomplete_output, setStripIncompleteOutput } = useUserStore();

  const [colors, setColors] = useState<ColorCustomization>({
    user_color: customization?.user_color || '#555555',
    char_color: customization?.char_color || 'rgba(20,24,28,0.6)',
    userTextColor: customization?.userTextColor || '#FFFFFF',
    charTextColor: customization?.charTextColor || '#FFFFFF',
    userItalicColor: customization?.userItalicColor || '#999999',
    charItalicColor: customization?.charItalicColor || '#999999',
    userQuotedColor: customization?.userQuotedColor || '#AAAAAA',
    charQuotedColor: customization?.charQuotedColor || '#93BEE6',
  });

  const handleColorChange = (key: keyof ColorCustomization, value: string) => {
    const updated = { ...colors, [key]: value };
    setColors(updated);
    setCustomization(updated);
  };

  const handleReset = () => {
    const defaults: ColorCustomization = {
      user_color: '#555555',
      char_color: 'rgba(20,24,28,0.6)',
      userTextColor: '#FFFFFF',
      charTextColor: '#FFFFFF',
      userItalicColor: '#999999',
      charItalicColor: '#999999',
      userQuotedColor: '#AAAAAA',
      charQuotedColor: '#93BEE6',
    };
    setColors(defaults);
    setCustomization(defaults);
    setStripIncompleteOutput(true);
  };

  const userAvatarUrl = 'https://api.dicebear.com/8.x/thumbs/svg?seed=UserExample';
  const charAvatarUrl = 'https://api.dicebear.com/8.x/thumbs/svg?seed=CharExample';

  return (
    <PyrenzModal open={open} onClose={onClose}>
      <PyrenzModalContent>
        <Typography variant="h6" gutterBottom>
          Chat Appearance
        </Typography>

        <Stack direction="column" spacing={2}>
          {colorFields.map(({ key, label }) => (
            <Stack key={key} direction="row" justifyContent="space-between" alignItems="center">
              <Typography variant="body1" color="text.secondary">
                {label}:
              </Typography>
              <PyrenzColorPicker
                color={colors[key]}
                onChange={(color) => handleColorChange(key, color)}
              />
            </Stack>
          ))}

          <Stack direction="row" alignItems="center" justifyContent="space-between">
            <Typography variant="body1" color="text.secondary">
              Strip Incomplete Output:
            </Typography>
            <GlassSwitch
              checked={strip_incomplete_output}
              onChange={(e) => setStripIncompleteOutput(e.target.checked)}
            />
          </Stack>
        </Stack>

        <Box sx={{ mt: 2, p: 2, border: '1px solid #ccc', borderRadius: 1 }}>
          <PyrenzMessageBox
            role="char"
            charAvatar={charAvatarUrl}
            displayName="AI Character"
            content="Character: Hello!"
            sx={{ color: colors.charTextColor, backgroundColor: colors.char_color }}
          />
          <PyrenzMessageBox
            role="user"
            userAvatar={userAvatarUrl}
            displayName="You"
            content="User: Hi there!"
            sx={{ color: colors.userTextColor, backgroundColor: colors.user_color, mt: 1 }}
          />
        </Box>

        <PyrenzBlueButton onClick={handleReset} variant="contained" color="primary" fullWidth sx={{ mt: 2 }}>
          Reset to Default
        </PyrenzBlueButton>

        <PyrenzBlueButton onClick={onClose} variant="contained" color="primary" fullWidth sx={{ mt: 2 }}>
          Save Changes
        </PyrenzBlueButton>
      </PyrenzModalContent>
    </PyrenzModal>
  );
}
