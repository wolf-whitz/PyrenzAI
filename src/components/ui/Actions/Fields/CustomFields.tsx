import { useEffect, useState } from 'react';
import { Box, Button } from '@mui/material';
import {
  PyrenzFormControl,
  PyrenzOutlinedInput,
  PyrenzInputLabel,
} from '~/theme';
import { Utils } from '~/Utility';
import { GetUserUUID } from '@components';

interface CustomProvider {
  api_key: string;
  custom_model_name: string;
  provider_url: string;
}

export function CustomModelFields() {
  const [apiKey, setApiKey] = useState('');
  const [customModelName, setCustomModelName] = useState('');
  const [providerUrl, setProviderUrl] = useState('');

  useEffect(() => {
    const fetchCustomProvider = async () => {
      try {
        const userUUID = await GetUserUUID();
        const { data } = await Utils.db.select<{
          custom_provider: CustomProvider;
        }>({
          tables: 'user_data',
          columns: 'custom_provider',
          match: { user_uuid: userUUID },
        });

        const firstRecord = data?.[0];
        if (firstRecord?.custom_provider) {
          const provider = firstRecord.custom_provider;
          setApiKey(provider.api_key || '');
          setCustomModelName(provider.custom_model_name || '');
          setProviderUrl(provider.provider_url || '');
        }
      } catch (err) {
        console.error('Error fetching custom provider settings:', err);
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
    try {
      const userUUID = await GetUserUUID();
      const updatedProvider: CustomProvider = {
        api_key: apiKey,
        custom_model_name: customModelName,
        provider_url: providerUrl,
      };

      await Utils.db.update({
        tables: 'user_data',
        values: { custom_provider: updatedProvider },
        match: { user_uuid: userUUID },
      });

      console.log('Custom provider settings updated successfully ✅');
    } catch (err) {
      console.error('Error updating custom provider settings:', err);
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
