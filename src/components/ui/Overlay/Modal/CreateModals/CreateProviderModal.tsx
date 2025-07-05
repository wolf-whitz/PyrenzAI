import React, { useState } from 'react';
import { Textarea } from '@components';
import { supabase } from '~/Utility/supabaseClient';
import { GetUserUUID } from '~/components/functions';
import { PyrenzBlueButton, PyrenzModal, PyrenzModalContent } from '~/theme';
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
    <PyrenzModal
      open={open}
      onClose={onClose}
      aria-labelledby="create-provider-modal-title"
      aria-describedby="create-provider-modal-description"
    >
      <PyrenzModalContent>
        <h2 id="create-provider-modal-title">Create New Provider</h2>
        <div style={{ marginTop: '16px' }}>
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
        </div>
        <div
          style={{
            marginTop: '16px',
            display: 'flex',
            justifyContent: 'flex-end',
          }}
        >
          <PyrenzBlueButton onClick={onClose} style={{ marginRight: '8px' }}>
            Cancel
          </PyrenzBlueButton>
          <PyrenzBlueButton
            variant="contained"
            color="primary"
            onClick={handleSubmit}
          >
            Submit
          </PyrenzBlueButton>
        </div>
      </PyrenzModalContent>
    </PyrenzModal>
  );
}
