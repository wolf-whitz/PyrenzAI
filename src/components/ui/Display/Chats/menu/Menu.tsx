import React, { useEffect, useState } from 'react';
import {
  Box,
  Button,
  MenuItem,
  MenuList,
  Paper,
  Typography,
  Fade,
  Grow,
  Collapse,
} from '@mui/material';
import { ExpandMore, ExpandLess } from '@mui/icons-material';
import { Customization, Cosmetic } from './MenuItem';

interface MenuProps {
  onClose: () => void;
}

export function Menu({ onClose }: MenuProps) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState('Cosmetic');
  const [bgImage, setBgImage] = useState<string | null>(null);

  useEffect(() => {
    const savedBg = localStorage.getItem('bgImage');
    if (savedBg) {
      setBgImage(savedBg);
      applyBackground(savedBg);
    }
  }, []);

  const applyBackground = (imageUrl: string | null) => {
    if (imageUrl) {
      document.body.style.backgroundImage = `url(${imageUrl})`;
      document.body.style.backgroundSize = 'cover';
      document.body.style.backgroundPosition = 'center';
      document.body.style.backgroundRepeat = 'no-repeat';
    } else {
      document.body.style.backgroundImage = 'none';
    }
  };

  return (
    <Fade in={true} onClick={onClose}>
      <Box
        sx={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 50,
        }}
      >
        <Grow in={true} onClick={(e) => e.stopPropagation()}>
          <Box
            sx={{
              background: '#2d3748',
              color: '#fff',
              padding: '24px',
              borderRadius: '8px',
              boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.25)',
              width: '100%',
              maxWidth: '400px',
              height: '80vh',
              overflowY: 'auto',
            }}
          >
            <Box display="flex" flexDirection="column">
              <Button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                variant="contained"
                color="primary"
                fullWidth
                endIcon={isDropdownOpen ? <ExpandLess /> : <ExpandMore />}
                sx={{
                  backgroundColor: '#4a5568',
                  '&:hover': { backgroundColor: '#718096' },
                  justifyContent: 'space-between',
                }}
              >
                <Typography>{selectedOption}</Typography>
              </Button>

              <Collapse in={isDropdownOpen}>
                <Paper
                  elevation={3}
                  sx={{ mt: 2, borderRadius: '8px', overflow: 'hidden' }}
                >
                  <MenuList>
                    <MenuItem
                      onClick={() => {
                        setSelectedOption('Cosmetic');
                        setIsDropdownOpen(false);
                      }}
                      sx={{ '&:hover': { backgroundColor: '#718096' } }}
                    >
                      Cosmetic
                    </MenuItem>
                    <MenuItem
                      onClick={() => {
                        setSelectedOption('AI Customization');
                        setIsDropdownOpen(false);
                      }}
                      sx={{ '&:hover': { backgroundColor: '#718096' } }}
                    >
                      AI Customization
                    </MenuItem>
                  </MenuList>
                </Paper>
              </Collapse>
            </Box>

            {selectedOption === 'Cosmetic' && (
              <Cosmetic onBackgroundChange={applyBackground} />
            )}
            {selectedOption === 'AI Customization' && <Customization />}
          </Box>
        </Grow>
      </Box>
    </Fade>
  );
}
