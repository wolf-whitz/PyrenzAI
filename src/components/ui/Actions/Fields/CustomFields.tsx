import { useEffect, useState } from 'react';
import { Box, Button } from '@mui/material';
import {
  PyrenzFormControl,
  PyrenzOutlinedInput,
  PyrenzInputLabel,
} from '~/theme';
import { supabase } from '@utils';
import { GetUserUUID } from '@components';

export function CustomModelFields() {
  const [apiKey, setApiKey] = useState('');
  const [customModelName, setCustomModelName] = useState('');
  const [providerUrl, setProviderUrl] = useState('');

  useEffect(() => {
    const fetchCustomProvider = async () => {
      try {
        const userUUID = await GetUserUUID();
        const { data, error } = await supabase
          .from('user_data')
          .select('custom_provider')
          .eq('user_uuid', userUUID)
          .single();

        if (error) {
          throw error;
        }

        if (data) {
          const provider = data.custom_provider;
          setApiKey(provider.api_key || '');
          setCustomModelName(provider.custom_model_name || '');
          setProviderUrl(provider.provider_url || '');
        }
      } catch (err) {
        if (err instanceof Error) {
          console.error(
            'Error fetching custom provider settings:',
            err.message
          );
        } else {
          console.error('An unknown error occurred:', err);
        }
      }
    };

    fetchCustomProvider();
  }, []);

  const handleClear = () => {
    setApiKey('');
    setCustomModelName('');
    setProviderUrl('');
  };

  const handleSubmit = async () => {
    const updatedProvider = {
      api_key: apiKey,
      custom_model_name: customModelName,
      provider_url: providerUrl,
    };

    try {
      const userUUID = await GetUserUUID();
      const { error } = await supabase
        .from('user_data')
        .update({ custom_provider: updatedProvider })
        .eq('user_uuid', userUUID);

      if (error) {
        throw error;
      }

      console.log('Custom provider settings updated successfully');
    } catch (err) {
      if (err instanceof Error) {
        console.error('Error updating custom provider settings:', err.message);
      } else {
        console.error('An unknown error occurred:', err);
      }
    }
  };

  return (
    <Box>
      <Box mb={2}>
        <PyrenzFormControl fullWidth variant="outlined">
          <PyrenzInputLabel htmlFor="api-key">API Key</PyrenzInputLabel>
          <PyrenzOutlinedInput
            id="api-key"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            label="API Key"
            placeholder="Enter API Key"
          />
        </PyrenzFormControl>
      </Box>

      <Box mb={2}>
        <PyrenzFormControl fullWidth variant="outlined">
          <PyrenzInputLabel htmlFor="model-name">Model Name</PyrenzInputLabel>
          <PyrenzOutlinedInput
            id="model-name"
            value={customModelName}
            onChange={(e) => setCustomModelName(e.target.value)}
            label="Model Name"
            placeholder="Enter Model Name"
          />
        </PyrenzFormControl>
      </Box>

      <Box mb={2}>
        <PyrenzFormControl fullWidth variant="outlined">
          <PyrenzInputLabel htmlFor="provider-url">
            Provider URL
          </PyrenzInputLabel>
          <PyrenzOutlinedInput
            id="provider-url"
            value={providerUrl}
            onChange={(e) => setProviderUrl(e.target.value)}
            label="Provider URL"
            placeholder="Enter Provider URL"
          />
        </PyrenzFormControl>
      </Box>

      <Box display="flex" justifyContent="space-between" mb={4}>
        <Button variant="contained" color="primary" onClick={handleClear}>
          Clear
        </Button>
        <Button variant="contained" color="secondary" onClick={handleSubmit}>
          Submit
        </Button>
      </Box>
    </Box>
  );
}
