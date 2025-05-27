import React, { useEffect, useState } from 'react';
import {
  Modal,
  Box,
  Button,
  Card,
  CardContent,
  Typography,
} from '@mui/material';
import { supabase } from '~/Utility/supabaseClient';
import { PyrenzBlueButton } from '~/theme';
import { CreateProviderModal } from '@components';

interface Provider {
  provider_name: string;
  provider_website: string;
  provider_api_link: string;
  provider_description: string;
}

interface ProviderModalsProps {
  open: boolean;
  onClose: () => void;
  onSelect: (provider: Provider) => void;
}

export function ProviderModals({
  open,
  onClose,
  onSelect,
}: ProviderModalsProps) {
  const [providers, setProviders] = useState<Provider[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [createModalOpen, setCreateModalOpen] = useState<boolean>(false);

  useEffect(() => {
    const fetchProviders = async () => {
      try {
        const { data, error } = await supabase
          .from('providers')
          .select(
            'provider_name, provider_website, provider_api_link, provider_description'
          );

        if (error) {
          throw error;
        }

        setProviders(data);
      } catch (error) {
        console.error('Error fetching providers:', error);
      } finally {
        setLoading(false);
      }
    };

    if (open) {
      fetchProviders();
    }
  }, [open]);

  const handleSelect = (provider: Provider) => {
    onSelect(provider);
    onClose();
  };

  const handleOpenCreateModal = () => {
    setCreateModalOpen(true);
  };

  const handleCloseCreateModal = () => {
    setCreateModalOpen(false);
  };

  if (!open) return null;

  return (
    <>
      <Modal
        open={open}
        onClose={onClose}
        aria-labelledby="modal-title"
        aria-describedby="modal-description"
      >
        <Box sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '80%',
          maxWidth: 'md',
          bgcolor: 'background.paper',
          boxShadow: 24,
          p: 4,
          display: 'flex',
          flexDirection: 'column',
         }}>
          <Typography id="modal-title" variant="h6" component="h2" className="text-2xl font-bold">
            Premade Providers
          </Typography>
          <Box id="modal-description" sx={{ mt: 2, flexGrow: 1, overflow: 'auto' }}>
            {loading ? (
              <Typography className="text-gray-600">
                Loading providers...
              </Typography>
            ) : (
              <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: '1fr 1fr 1fr' }, gap: 2 }}>
                {providers.map((provider) => (
                  <Card
                    key={provider.provider_name}
                    sx={{ boxShadow: 3, borderRadius: 2 }}
                  >
                    <CardContent sx={{ p: 2 }}>
                      <Typography
                        variant="h5"
                        component="div"
                        sx={{ fontSize: '1.25rem', fontWeight: 'bold' }}
                      >
                        {provider.provider_name}
                      </Typography>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ color: 'text.secondary' }}
                      >
                        {provider.provider_description}
                      </Typography>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ color: 'text.secondary' }}
                      >
                        Website:{' '}
                        <a
                          href={provider.provider_website}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{ color: '#3b82f6', textDecoration: 'underline' }}
                        >
                          {provider.provider_website}
                        </a>
                      </Typography>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ color: 'text.secondary' }}
                      >
                        API Link:{' '}
                        <a
                          href={provider.provider_api_link}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{ color: '#3b82f6', textDecoration: 'underline' }}
                        >
                          {provider.provider_api_link}
                        </a>
                      </Typography>
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={() => handleSelect(provider)}
                        fullWidth
                        sx={{ mt: 1, bgcolor: '#3b82f6', '&:hover': { bgcolor: '#2563eb' }, color: 'white', fontWeight: 'bold', py: 1, px: 2, borderRadius: 1 }}
                      >
                        Select
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </Box>
            )}
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
            <PyrenzBlueButton onClick={handleOpenCreateModal}>
              Create
            </PyrenzBlueButton>
          </Box>
        </Box>
      </Modal>
      <CreateProviderModal
        open={createModalOpen}
        onClose={handleCloseCreateModal}
      />
    </>
  );
}
