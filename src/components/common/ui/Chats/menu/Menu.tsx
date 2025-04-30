import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { Customization, Cosmetic } from './MenuItem';
import { Box, Button, MenuItem, MenuList, Paper, Typography } from '@mui/material';

interface MenuProps {
  onClose: () => void;
}

export default function Menu({ onClose }: MenuProps) {
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
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
        onClick={onClose}
        style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 50,
        }}
      >
        <motion.div
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          exit={{ scale: 0.8 }}
          transition={{ duration: 0.2 }}
          onClick={(e) => e.stopPropagation()}
          style={{
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
              startIcon={isDropdownOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
              sx={{
                backgroundColor: '#4a5568',
                '&:hover': { backgroundColor: '#718096' },
                justifyContent: 'space-between',
              }}
            >
              <Typography>{selectedOption}</Typography>
            </Button>

            <AnimatePresence>
              {isDropdownOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -5 }}
                  transition={{ duration: 0.2 }}
                >
                  <Paper elevation={3} sx={{ mt: 2, borderRadius: '8px', overflow: 'hidden' }}>
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
                </motion.div>
              )}
            </AnimatePresence>
          </Box>

          {selectedOption === 'Cosmetic' && (
            <Cosmetic onBackgroundChange={applyBackground} />
          )}
          {selectedOption === 'AI Customization' && <Customization />}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
