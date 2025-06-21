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
import { Customization, Cosmetic, CharacterDetails, Memory } from './MenuItem';
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
          backgroundColor: 'rgba(10, 15, 25, 0.3)',
          backdropFilter: 'blur(10px)',
          WebkitBackdropFilter: 'blur(10px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 50,
        }}
      >
        <Grow in={true} onClick={(e) => e.stopPropagation()}>
          <Box
            sx={{
              backgroundColor: 'rgba(40, 45, 55, 0.3)',
              backdropFilter: 'blur(20px)',
              WebkitBackdropFilter: 'blur(20px)',
              color: '#fff',
              padding: '24px',
              borderRadius: '12px',
              border: '1px solid rgba(255,255,255,0.08)',
              boxShadow: '0 8px 24px rgba(0, 0, 0, 0.3)',
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
                      backgroundColor: 'rgba(74, 85, 104, 0.7)',
                      '&:hover': { backgroundColor: 'rgba(113, 128, 150, 0.8)' },
                      justifyContent: 'space-between',
                    }}
                  >
                    <Typography>{selectedOption}</Typography>
                  </Button>

                  <Collapse in={isDropdownOpen}>
                    <Paper
                      elevation={3}
                      sx={{
                        mt: 2,
                        borderRadius: '8px',
                        overflow: 'hidden',
                        backgroundColor: 'rgba(255,255,255,0.05)',
                        backdropFilter: 'blur(10px)',
                      }}
                    >
                      <MenuList>
                        {['Cosmetic', 'AI Customization', 'Character Details', 'Memory'].map(option => (
                          <MenuItem
                            key={option}
                            onClick={() => {
                              setSelectedOption(option);
                              setIsDropdownOpen(false);
                            }}
                            sx={{
                              color: '#fff',
                              '&:hover': {
                                backgroundColor: 'rgba(255, 255, 255, 0.08)',
                              },
                            }}
                          >
                            {option}
                          </MenuItem>
                        ))}
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
                  <CharacterDetails
                    char={char}
                    onSubmit={handleCharacterDetailsSubmit}
                  />
                )}
                {selectedOption === 'Memory' && <Memory />}
              </>
            )}
          </Box>
        </Grow>
      </Box>
    </Fade>
  );
}
