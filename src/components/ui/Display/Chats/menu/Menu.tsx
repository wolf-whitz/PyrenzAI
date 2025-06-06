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
  CircularProgress,
} from '@mui/material';
import { ExpandMore, ExpandLess } from '@mui/icons-material';
import { Customization, Cosmetic, CharacterDetails } from './MenuItem';
import { useMenuAPI } from '@api';
import { Character } from '@shared-types';

interface MenuProps {
  onClose: () => void;
  char: Character;
}

export function Menu({ onClose, char }: MenuProps) {
  const {
    isDropdownOpen,
    setIsDropdownOpen,
    selectedOption,
    setSelectedOption,
    loading,
    handleCharacterDetailsSubmit,
    aiCustomization,
    subscriptionPlan,
    modelOptions,
  } = useMenuAPI({ char });

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
            {loading ? (
              <Box
                display="flex"
                justifyContent="center"
                alignItems="center"
                height="100%"
              >
                <CircularProgress />
              </Box>
            ) : (
              <>
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
                        <MenuItem
                          onClick={() => {
                            setSelectedOption('Character Details');
                            setIsDropdownOpen(false);
                          }}
                          sx={{ '&:hover': { backgroundColor: '#718096' } }}
                        >
                          Character Details
                        </MenuItem>
                      </MenuList>
                    </Paper>
                  </Collapse>
                </Box>

                {selectedOption === 'Cosmetic' && <Cosmetic />}
                {selectedOption === 'AI Customization' && (
                  <Customization
                    customization={aiCustomization}
                    subscriptionPlan={subscriptionPlan}
                    modelOptions={modelOptions}
                  />
                )}
                {selectedOption === 'Character Details' && (
                  <CharacterDetails char={char} onSubmit={handleCharacterDetailsSubmit} />
                )}
              </>
            )}
          </Box>
        </Grow>
      </Box>
    </Fade>
  );
}
