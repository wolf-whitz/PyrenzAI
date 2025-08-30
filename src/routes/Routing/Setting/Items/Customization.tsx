import React from 'react';
import { Box, Typography, MenuItem } from '@mui/material';
import { useDropzone } from 'react-dropzone';
import { useNavigate } from 'react-router-dom';
import {
  PyrenzBlueButton,
  PyrenzCard,
  PyrenzFormControl,
  PyrenzSelect,
  PyrenzMenuItem,
  PyrenzInputLabel,
} from '~/theme';
import { useCustomizationAPI } from '@components';

export function Customization() {
  const navigate = useNavigate();
  const {
    selectedTheme,
    themeInfo,
    themes,
    error,
    handleSelectChange,
    handleSubmit,
    onDrop,
    accept,
  } = useCustomizationAPI();

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept,
    multiple: false,
  });

  return (
    <Box
      display="flex"
      flexDirection="column"
      gap={3}
      width="100%"
      sx={{ mt: 2, ml: 2 }}
    >
      <Box
        {...getRootProps()}
        sx={{
          border: '2px dashed #66ccff',
          borderRadius: '12px',
          p: 4,
          textAlign: 'center',
          cursor: 'pointer',
          backdropFilter: 'blur(4px)',
          background: 'rgba(255,255,255,0.02)',
          transition: 'all 0.3s ease',
          '&:hover': {
            transform: 'scale(1.01)',
            background: 'rgba(255,255,255,0.04)',
          },
        }}
      >
        <input {...getInputProps()} />
        {selectedTheme ? (
          <Typography variant="h6" color="primary">
            {selectedTheme} selected
          </Typography>
        ) : (
          <Typography variant="body1" color="textSecondary">
            Drop your theme ZIP here
          </Typography>
        )}
      </Box>

      <PyrenzFormControl>
        <PyrenzInputLabel id="theme-select-label">
          Select Theme
        </PyrenzInputLabel>
        <PyrenzSelect
          labelId="theme-select-label"
          value={selectedTheme}
          onChange={handleSelectChange}
        >
          {themes.length > 0 ? (
            themes.map((t) => (
              <PyrenzMenuItem key={t.folder} value={t.folder}>
                {t.name} ({t.folder})
              </PyrenzMenuItem>
            ))
          ) : (
            <PyrenzMenuItem disabled>No themes found</PyrenzMenuItem>
          )}
        </PyrenzSelect>
      </PyrenzFormControl>

      {themeInfo && (
        <PyrenzCard selected sx={{ p: 3 }}>
          <Typography variant="h6" fontWeight={600}>
            {themeInfo.name}
          </Typography>
          <Typography variant="body2" color="textSecondary">
            {themeInfo.description || 'No description available'}
          </Typography>
          <Typography
            variant="caption"
            sx={{ display: 'block', mt: 1, fontStyle: 'italic' }}
          >
            by {themeInfo.creator || 'Unknown'}
          </Typography>
        </PyrenzCard>
      )}

      {error && (
        <Typography color="error" textAlign="center">
          {error}
        </Typography>
      )}

      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
        <PyrenzBlueButton onClick={handleSubmit} sx={{ minWidth: 200 }}>
          Apply Selected Theme
        </PyrenzBlueButton>
      </Box>

      <Typography
        variant="body2"
        color="textSecondary"
        textAlign="center"
        sx={{
          cursor: 'pointer',
          mt: 1,
          fontWeight: 600,
          color: '#66ccff',
          textShadow: '0 0 6px rgba(102, 204, 255, 0.8)',
          transition: 'all 0.3s ease',
          '&:hover': {
            textShadow: '0 0 12px rgba(102, 204, 255, 1)',
            color: '#aee4ff',
          },
        }}
        onClick={() => navigate('/themes')}
      >
        Check out PyrenzAI Official Theme Store
      </Typography>
    </Box>
  );
}
