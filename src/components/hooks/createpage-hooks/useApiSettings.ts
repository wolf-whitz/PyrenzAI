import { useEffect, useState, useCallback } from 'react';
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
  model_api_key: string;
  model_url: string;
}

type ExtendedMatch = Partial<{
  id: string;
  user_uuid: string;
  model_name: string;
  model_url: string;
  model_description: string;
  model_api_key: string;
}>;

export const useApiSettings = () => {
  const [userUuid, setUserUuid] = useState<string | null>(null);
  const [modelApiKey, setModelApiKey] = useState('');
  const [modelName, setModelName] = useState('');
  const [modelDescription, setModelDescription] = useState('');
  const [modelUrl, setModelUrl] = useState('');
  const [providers, setProviders] = useState<Provider[]>([]);
  const [selectedProvider, setSelectedProvider] = useState('');
  const [userModels, setUserModels] = useState<UserModel[]>([]);
  const showAlert = usePyrenzAlert();

  useEffect(() => {
    const fetchUserUuid = async () => {
      try {
        const uuid = await GetUserUUID();
        setUserUuid(uuid);
      } catch (err) {
        console.error('Error fetching UUID:', err);
      }
    };
    fetchUserUuid();
  }, []);

  useEffect(() => {
    const fetchProviders = async () => {
      try {
        const { data } = await Utils.db.select<Provider>({
          tables: 'providers',
          columns: 'provider_name, provider_description, provider_link',
        });
        setProviders(data || []);
      } catch (err) {
        console.error('Error fetching providers:', err);
      }
    };
    fetchProviders();
  }, []);

  const fetchUserModels = useCallback(async () => {
    if (!userUuid) return;
    try {
      const { data } = await Utils.db.select<UserModel>({
        tables: 'private_models',
        columns: 'id, model_name, model_description, model_api_key, model_url',
        match: { user_uuid: userUuid },
        nocache: true,
      });
      setUserModels(data || []);
    } catch (err) {
      console.error('Error fetching user models:', err);
    }
  }, [userUuid]);

  useEffect(() => {
    fetchUserModels();
  }, [fetchUserModels]);

  const handleProviderChange = (event: SelectChangeEvent<string>) => {
    const providerName = event.target.value;
    setSelectedProvider(providerName);
    const provider = providers.find((p) => p.provider_name === providerName);
    if (provider) setModelUrl(provider.provider_link);
  };

  const clearForm = () => {
    setModelApiKey('');
    setModelName('');
    setModelDescription('');
    setModelUrl('');
    setSelectedProvider('');
  };

  const handleSubmit = async (event: React.FormEvent, id?: string) => {
    event.preventDefault();
    if (!userUuid) {
      showAlert('User not loaded yet, please try again 🤷‍♂️', 'Alert');
      return;
    }
    if (!modelUrl.trim() || !modelApiKey.trim() || !modelName.trim() || !modelDescription.trim()) {
      showAlert(
        id
          ? 'All fields must be filled in to update the model 📝'
          : 'All fields (API URL, API Key, Model Name, and Description) are required! 🚫',
        'Error'
      );
      return;
    }
    try {
      const encryptedApiKey = await encrypt(modelApiKey);
      await Utils.db.upsertOrUpdate({
        tables: 'private_models',
        data: {
          user_uuid: userUuid,
          model_name: modelName,
          model_url: modelUrl,
          model_description: modelDescription,
          model_api_key: encryptedApiKey,
        },
        match: id ? { id } as ExtendedMatch : undefined,
      });
      showAlert(id ? 'Model updated successfully! 🎉' : 'Model saved successfully! 🎉', 'Success');
      if (!id) clearForm();
      await fetchUserModels();
    } catch (err) {
      console.error(id ? 'Error updating model:' : 'Error inserting model:', err);
      showAlert(
        id
          ? 'Oops! Couldn’t update your model. Check the console.'
          : 'Oops! Couldn’t save your model. Check the console.',
        'Error'
      );
    }
  };

  const handleDelete = async (id: string) => {
    if (!userUuid) {
      showAlert('User not loaded yet, please try again 🤷‍♂️', 'Alert');
      return;
    }
    try {
      await Utils.db.remove({
        tables: 'private_models',
        match: { id } as ExtendedMatch,
      });
      showAlert('Model deleted successfully! 🎉', 'Success');
      await fetchUserModels();
    } catch (err) {
      console.error('Error deleting model:', err);
      showAlert('Oops! Couldn’t delete your model. Check the console.', 'Error');
    }
  };

  return {
    userUuid,
    modelApiKey,
    modelName,
    modelDescription,
    modelUrl,
    providers,
    selectedProvider,
    userModels,
    setModelApiKey,
    setModelName,
    setModelDescription,
    setModelUrl,
    setSelectedProvider,
    handleProviderChange,
    handleSubmit,
    handleDelete,
    clearForm,
    fetchUserModels,
  };
};
