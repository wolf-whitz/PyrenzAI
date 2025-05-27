import React, { useState } from 'react';
import { Modal, Box, Typography } from '@mui/material';
import { Textarea } from '@components';
import { supabase } from '~/Utility/supabaseClient';
import { GetUserUUID } from '~/components/functions';
import { PyrenzBlueButton } from '~/theme';
import { usePyrenzAlert } from '~/provider';

interface CreateProviderModalProps {
  open: boolean;
  onClose: () => void;
}

export function CreateProviderModal({
  open,
  onClose,
}: CreateProviderModalProps) {
  const [providerName, setProviderName] = useState('');
  const [providerApiLink, setProviderApiLink] = useState('');
  const [providerWebsite, setProviderWebsite] = useState('');
  const [providerDescription, setProviderDescription] = useState('');
  const showAlert = usePyrenzAlert();

  const handleSubmit = async () => {
    const userUUID = await GetUserUUID();

    try {
      const { data, error } = await supabase.from('providers').insert([
        {
          provider_name: providerName,
          provider_api_link: providerApiLink,
          provider_website: providerWebsite,
          provider_description: providerDescription,
          user_uuid: userUUID,
        },
      ]);

      if (error) {
        throw error;
      }

      console.log('Provider added:', data);
      showAlert('Provider added successfully!', 'success');
      onClose();
    } catch (error) {
      console.error('Error adding provider:', error);
      showAlert('Error adding provider.', 'alert');
    }
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="create-provider-modal-title"
      aria-describedby="create-provider-modal-description"
    >
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 400,
          maxHeight: '80vh',
          bgcolor: 'background.paper',
          boxShadow: 24,
          p: 4,
          overflowY: 'auto',
        }}
      >
        <Typography
          id="create-provider-modal-title"
          variant="h6"
          component="h2"
        >
          Create New Provider
        </Typography>
        <Box sx={{ mt: 2 }}>
          <Textarea
            label="Provider Name"
            value={providerName}
            onChange={(e) => setProviderName(e.target.value)}
          />
          <Textarea
            label="API Link"
            value={providerApiLink}
            onChange={(e) => setProviderApiLink(e.target.value)}
          />
          <Textarea
            label="Website"
            value={providerWebsite}
            onChange={(e) => setProviderWebsite(e.target.value)}
          />
          <Textarea
            label="Description"
            value={providerDescription}
            onChange={(e) => setProviderDescription(e.target.value)}
          />
        </Box>
        <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
          <PyrenzBlueButton onClick={onClose} sx={{ mr: 1 }}>
            Cancel
          </PyrenzBlueButton>
          <PyrenzBlueButton
            variant="contained"
            color="primary"
            onClick={handleSubmit}
          >
            Submit
          </PyrenzBlueButton>
        </Box>
      </Box>
    </Modal>
  );
}
