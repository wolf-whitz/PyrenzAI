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
  CircularProgress,
} from '@mui/material';
import { ExpandMore, ExpandLess } from '@mui/icons-material';
import { Customization, Cosmetic } from './MenuItem';
import { GetUserData } from '~/components/functions';
import { supabase } from '~/Utility/supabaseClient';

interface MenuProps {
  onClose: () => void;
}

interface ModelOption {
  label: string;
  name: string;
}

export function Menu({ onClose }: MenuProps) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState('Cosmetic');
  const [bgImage, setBgImage] = useState<string | null>(null);
  const [aiCustomization, setAiCustomization] = useState<any>(null);
  const [subscriptionPlan, setSubscriptionPlan] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [modelOptions, setModelOptions] = useState<ModelOption[]>([]);

  const fetchModelIdentifiers = async () => {
    try {
      const { data, error } = await supabase
        .from('model_identifiers')
        .select('name');

      if (error) throw error;

      return data.map(item => ({ label: item.name, name: item.name }));
    } catch (error) {
      console.error(error);
      return [];
    }
  };

  useEffect(() => {
    const savedBg = localStorage.getItem('bgImage');
    if (savedBg) {
      setBgImage(savedBg);
    }

    const fetchData = async () => {
      try {
        const userData = await GetUserData();
        if (userData && 'ai_customization' in userData) {
          setAiCustomization(userData.ai_customization);
          const plan = userData.subscription_data.tier;

          if (['MELON', 'PINEAPPLE', 'DURIAN'].includes(plan)) {
            setSubscriptionPlan(plan);
          } else {
            setSubscriptionPlan(null);
          }
        }

        const options = await fetchModelIdentifiers();
        options.push({ label: 'Custom', name: 'Custom' });
        setModelOptions(options);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

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
              <Box display="flex" justifyContent="center" alignItems="center" height="100%">
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
              </>
            )}
          </Box>
        </Grow>
      </Box>
    </Fade>
  );
}
