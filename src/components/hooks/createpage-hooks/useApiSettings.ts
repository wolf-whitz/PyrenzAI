import { useEffect, useState } from 'react';
import { SelectChangeEvent } from '@mui/material/Select';
import { GetUserUUID } from '@components';
import { encrypt, Utils } from '~/Utility';
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
      try {
        const { data } = await Utils.db.select<Provider>(
          'providers',
          'provider_name, provider_description, provider_link'
        );
        setProviders(data || []);
      } catch (error) {
        console.error('Error fetching providers:', error);
      }
    };
    fetchProviders();
  }, []);

  useEffect(() => {
    const fetchUserModels = async () => {
      if (!userUuid) return;
      try {
        const { data } = await Utils.db.select<UserModel>(
          'private_models',
          'id, model_name, model_description',
          null,
          { user_uuid: userUuid }
        );
        setUserModels(data || []);
      } catch (error) {
        console.error('Error fetching user models:', error);
      }
    };
    fetchUserModels();
  }, [userUuid]);

  const refreshUserModels = async () => {
    if (!userUuid) return;
    const { data } = await Utils.db.select<UserModel>(
      'private_models',
      'id, model_name, model_description',
      null,
      { user_uuid: userUuid }
    );
    setUserModels(data || []);
  };

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

    if (!apiUrl.trim() || !apiKey.trim() || !modelName.trim() || !modelDescription.trim()) {
      showAlert('All fields (API URL, API Key, Model Name, and Description) are required! 🚫', 'Error');
      return;
    }

    try {
      const encryptedApiKey = await encrypt(apiKey);
      await Utils.db.insert('private_models', {
        user_uuid: userUuid,
        model_name: modelName,
        model_url: apiUrl,
        model_description: modelDescription,
        model_api_key: encryptedApiKey,
      });
      showAlert('Model saved successfully! 🎉', 'Success');
      setModelName('');
      setModelDescription('');
      setApiKey('');
      setApiUrl('');
      setSelectedProvider('');
      await refreshUserModels();
    } catch (error) {
      console.error('Error inserting model:', error);
      showAlert('Oops! Couldn’t save your model. Check the console.', 'Error');
    }
  };

  const handleEdit = async (id: string) => {
    if (!userUuid) {
      showAlert('User not loaded yet, please try again 🤷‍♂️', 'Alert');
      return;
    }

    if (!apiUrl.trim() || !apiKey.trim() || !modelName.trim() || !modelDescription.trim()) {
      showAlert('All fields must be filled in to update the model 📝', 'Error');
      return;
    }

    try {
      const encryptedApiKey = await encrypt(apiKey);
      await Utils.db.update(
        'private_models',
        {
          model_name: modelName,
          model_url: apiUrl,
          model_description: modelDescription,
          model_api_key: encryptedApiKey,
        },
        { id }
      );
      showAlert('Model updated successfully! 🎉', 'Success');
      await refreshUserModels();
    } catch (error) {
      console.error('Error updating model:', error);
      showAlert('Oops! Couldn’t update your model. Check the console.', 'Error');
    }
  };

  const handleDelete = async (id: string) => {
    if (!userUuid) {
      showAlert('User not loaded yet, please try again 🤷‍♂️', 'Alert');
      return;
    }
    try {
      await Utils.db.delete('private_models', { id });
      showAlert('Model deleted successfully! 🎉', 'Success');
      await refreshUserModels();
    } catch (error) {
      console.error('Error deleting model:', error);
      showAlert('Oops! Couldn’t delete your model. Check the console.', 'Error');
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
