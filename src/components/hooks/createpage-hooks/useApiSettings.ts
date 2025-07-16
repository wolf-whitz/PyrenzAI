import { useEffect, useState } from 'react';
import { SelectChangeEvent } from '@mui/material/Select';
import { GetUserUUID } from '@components';
import { supabase, encrypt } from '~/Utility';
import { usePyrenzAlert } from '~/provider';

interface Provider {
  provider_name: string;
  provider_description: string;
  provider_link: string;
}

interface UserModel {
  id: string;
  model_name: string;
  model_description: string;
}

export const useApiSettings = () => {
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
        .select('id, model_name, model_description')
        .eq('user_uuid', userUuid);
      if (error) {
        console.error('Error fetching user models:', error);
      } else {
        setUserModels(data || []);
      }
    };
    fetchUserModels();
  }, [userUuid]);

  const handleProviderChange = (event: SelectChangeEvent) => {
    const providerName = event.target.value;
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
      const { error } = await supabase.from('private_models').insert([{
        user_uuid: userUuid,
        model_name: modelName,
        model_url: apiUrl,
        model_description: modelDescription,
        model_api_key: encryptedApiKey,
      }]);
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
          .select('id, model_name, model_description')
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

  const handleEdit = async (id: string) => {
    if (!userUuid) {
      showAlert('User not loaded yet, please try again 🤷‍♂️', 'Alert');
      return;
    }
    try {
      const encryptedApiKey = await encrypt(apiKey);
      const { error } = await supabase
        .from('private_models')
        .update({
          model_name: modelName,
          model_url: apiUrl,
          model_description: modelDescription,
          model_api_key: encryptedApiKey,
        })
        .eq('id', id);
      if (error) {
        console.error('Error updating model:', error);
        showAlert('Oops! Couldn’t update your model. Check the console.', 'Error');
      } else {
        showAlert('Model updated successfully! 🎉', 'Success');
        const { data: updatedModels, error: fetchError } = await supabase
          .from('private_models')
          .select('id, model_name, model_description')
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

  const handleDelete = async (id: string) => {
    if (!userUuid) {
      showAlert('User not loaded yet, please try again 🤷‍♂️', 'Alert');
      return;
    }
    const { error } = await supabase
      .from('private_models')
      .delete()
      .eq('id', id);
    if (error) {
      console.error('Error deleting model:', error);
      showAlert('Oops! Couldn’t delete your model. Check the console.', 'Error');
    } else {
      showAlert('Model deleted successfully! 🎉', 'Success');
      const { data: updatedModels, error: fetchError } = await supabase
        .from('private_models')
        .select('id, model_name, model_description')
        .eq('user_uuid', userUuid);
      if (!fetchError) {
        setUserModels(updatedModels || []);
      }
    }
  };

  return {
    userUuid,
    apiKey,
    modelName,
    modelDescription,
    apiUrl,
    providers,
    selectedProvider,
    userModels,
    setApiKey,
    setModelName,
    setModelDescription,
    setApiUrl,
    setSelectedProvider,
    handleProviderChange,
    handleSubmit,
    handleEdit,
    handleDelete,
  };
};
