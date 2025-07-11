import React, { useEffect, useState } from 'react';
import { Box, Typography, Select, MenuItem, Tooltip, IconButton, Card, CardContent } from '@mui/material';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import { Textarea, GetUserUUID } from '@components';
import { supabase, encrypt } from '~/Utility';
import {
  PyrenzBlueButton,
  PyrenzFormControl,
  PyrenzOutlinedInput,
  PyrenzInputLabel,
} from '~/theme';
import { usePyrenzAlert } from '~/provider';

interface Provider {
  provider_name: string;
  provider_description: string;
  provider_link: string;
}

interface UserModel {
  model_name: string;
  model_description: string;
}

export const Api = () => {
  const [userUuid, setUserUuid] = useState<string | null>(null);
  const [apiKey, setApiKey] = useState<string>('');
  const [modelName, setModelName] = useState<string>('');
  const [modelDescription, setModelDescription] = useState<string>('');
  const [apiUrl, setApiUrl] = useState<string>('');
  const [providers, setProviders] = useState<Provider[]>([]);
  const [selectedProvider, setSelectedProvider] = useState<string>('');
  const [userModels, setUserModels] = useState<UserModel[]>([]);
  const showAlert = usePyrenzAlert();

  useEffect(() => {
    const fetchUserUuid = async () => {
      const uuid = await GetUserUUID();
      setUserUuid(uuid);
    };
    fetchUserUuid();
  }, []);

  useEffect(() => {
    const fetchProviders = async () => {
      const { data, error } = await supabase
        .from('providers')
        .select('provider_name, provider_description, provider_link');
      if (error) {
        console.error('Error fetching providers:', error);
      } else {
        setProviders(data || []);
      }
    };
    fetchProviders();
  }, []);

  useEffect(() => {
    const fetchUserModels = async () => {
      if (!userUuid) return;
      const { data, error } = await supabase
        .from('private_models')
        .select('model_name, model_description')
        .eq('user_uuid', userUuid);
      if (error) {
        console.error('Error fetching user models:', error);
      } else {
        setUserModels(data || []);
      }
    };
    fetchUserModels();
  }, [userUuid]);

  const handleProviderChange = (event: any) => {
    const providerName = event.target.value as string;
    setSelectedProvider(providerName);
    const provider = providers.find((p) => p.provider_name === providerName);
    if (provider) {
      setApiUrl(provider.provider_link);
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!userUuid) {
      showAlert('User not loaded yet, please try again 🤷‍♂️', 'Alert');
      return;
    }
    if (!apiUrl.trim()) {
      showAlert('API URL is required!', 'Error');
      return;
    }
    try {
      const encryptedApiKey = await encrypt(apiKey);
      const { data, error } = await supabase.from('private_models').insert([
        {
          user_uuid: userUuid,
          model_name: modelName,
          model_url: apiUrl,
          model_description: modelDescription,
          model_api_key: encryptedApiKey,
        },
      ]);
      if (error) {
        console.error('Error inserting model:', error);
        showAlert('Oops! Couldn’t save your model. Check the console.', 'Error');
      } else {
        showAlert('Model saved successfully! 🎉', 'Success');
        setModelName('');
        setModelDescription('');
        setApiKey('');
        setApiUrl('');
        setSelectedProvider('');
        const { data: updatedModels, error: fetchError } = await supabase
          .from('private_models')
          .select('model_name, model_description')
          .eq('user_uuid', userUuid);
        if (!fetchError) {
          setUserModels(updatedModels || []);
        }
      }
    } catch (encryptionError) {
      console.error('Error encrypting API key:', encryptionError);
      showAlert('Oops! Couldn’t encrypt your API key.', 'Error');
    }
  };

  return (
    <Box sx={{ p: 3, display: 'flex', flexDirection: 'column', height: '100%' }}>
      <Typography variant="h6" gutterBottom>
        API Settings
      </Typography>
      <Box component="form" onSubmit={handleSubmit} sx={{ flex: 1 }}>
        <Box mb={2}>
          <PyrenzFormControl fullWidth>
            <PyrenzInputLabel id="provider-select-label">Select Provider</PyrenzInputLabel>
            <Select
              labelId="provider-select-label"
              id="provider-select"
              value={selectedProvider}
              label="Select Provider"
              onChange={handleProviderChange}
              input={<PyrenzOutlinedInput label="Select Provider" />}
            >
              {providers.map((provider, index) => (
                <MenuItem key={index} value={provider.provider_name}>
                  <Box display="flex" justifyContent="space-between" alignItems="center" width="100%">
                    <Typography>{provider.provider_name}</Typography>
                    <Tooltip title={provider.provider_description} arrow>
                      <IconButton size="small" edge="end">
                        <InfoOutlinedIcon />
                      </IconButton>
                    </Tooltip>
                  </Box>
                </MenuItem>
              ))}
            </Select>
          </PyrenzFormControl>
        </Box>
        <Box mb={2}>
          <Typography variant="subtitle1">API URL</Typography>
          <Textarea
            value={apiUrl}
            onChange={(e) => setApiUrl(e.target.value)}
            placeholder="Enter the API URL"
            require_link={true}
          />
        </Box>
        <Box mb={2}>
          <Typography variant="subtitle1">API Key</Typography>
          <Textarea
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            placeholder="Enter your API Key"
          />
        </Box>
        <Box mb={2}>
          <Typography variant="subtitle1">Model Name</Typography>
          <Textarea
            value={modelName}
            onChange={(e) => setModelName(e.target.value)}
            placeholder="Enter the Model Name"
          />
        </Box>
        <Box mb={2}>
          <Typography variant="subtitle1">Model Description</Typography>
          <Textarea
            value={modelDescription}
            onChange={(e) => setModelDescription(e.target.value)}
            placeholder="Describe your model's vibes"
          />
        </Box>
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
          <PyrenzBlueButton type="submit">
            Save Settings
          </PyrenzBlueButton>
        </Box>
      </Box>
      <Box sx={{ mt: 4 }}>
        <Typography variant="h6" gutterBottom>
          Your Models
        </Typography>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
          {userModels.map((model, index) => (
            <Card key={index} sx={{ minWidth: 275 }}>
              <CardContent>
                <Typography variant="h5" component="div">
                  {model.model_name}
                </Typography>
                <Typography variant="body2">
                  {model.model_description}
                </Typography>
              </CardContent>
            </Card>
          ))}
        </Box>
      </Box>
    </Box>
  );
};