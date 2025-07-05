import React, { useMemo } from 'react';
import {
  Box,
  Button,
  MenuItem,
  MenuList,
  Paper,
  Typography,
  Collapse,
  CircularProgress,
  Fade,
} from '@mui/material';
import { ExpandMore, ExpandLess } from '@mui/icons-material';
import { PyrenzModal, PyrenzModalContent } from '~/theme';
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

  const renderContent = useMemo(() => {
    switch (selectedOption) {
      case 'Cosmetic':
        return <Cosmetic />;
      case 'AI Customization':
        return (
          <Customization
            customization={aiCustomization}
            subscriptionPlan={subscriptionPlan}
            modelOptions={modelOptions}
          />
        );
      case 'Character Details':
        return (
          <CharacterDetails
            char={char}
            onSubmit={handleCharacterDetailsSubmit}
          />
        );
      case 'Memory':
        return <Memory />;
      default:
        return null;
    }
  }, [
    selectedOption,
    aiCustomization,
    subscriptionPlan,
    modelOptions,
    char,
    handleCharacterDetailsSubmit,
  ]);

  return (
    <PyrenzModal open={true} onClose={onClose}>
      <PyrenzModalContent>
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
            <Box display="flex" flexDirection="column" mb={2}>
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
                  }}
                >
                  <MenuList>
                    {[
                      'Cosmetic',
                      'AI Customization',
                      'Character Details',
                      'Memory',
                    ].map((option) => (
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

            <Box>{renderContent}</Box>
          </>
        )}
      </PyrenzModalContent>
    </PyrenzModal>
  );
}
