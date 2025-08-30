import { useState, useEffect } from 'react';
import { useUserStore } from '~/store';
import { Utils } from '~/utility';
import * as Sentry from '@sentry/react';
import { GetUserUUID, GetUserData } from '@function';
import { usePyrenzAlert } from '~/provider';

interface CustomizationProps {
  customization: {
    model: string;
    maxTokens: number;
    temperature: number;
    topP: number;
    presencePenalty: number;
    frequencyPenalty: number;
    modelMemoryLimit: number;
  } | null;
  subscriptionPlan: string | null;
}

interface PrivateModel {
  model_description: string;
  model_name: string;
}

interface PrivateModels {
  [key: string]: PrivateModel;
}

interface UserData {
  subscription_data: {
    max_token: number;
    model?: Record<string, { description: string; plan: string; slug: string }>;
    private_models?: PrivateModels;
  };
  preferred_model?: { name: string; slug: string };
}

type GetUserDataResponse = UserData | { error: string };

export const useCustomizeAPI = ({
  customization,
  subscriptionPlan,
}: CustomizationProps) => {
  const userStore = useUserStore();
  const [maxTokens, setMaxTokens] = useState<number>(
    customization?.maxTokens || userStore.inferenceSettings.maxTokens || 100
  );
  const [temperature, setTemperature] = useState<number>(
    customization?.temperature || userStore.inferenceSettings.temperature || 1
  );
  const [topP, setTopP] = useState<number>(
    customization?.topP || userStore.inferenceSettings.topP || 1
  );
  const [presencePenalty, setPresencePenalty] = useState<number>(
    customization?.presencePenalty ||
      userStore.inferenceSettings.presencePenalty ||
      0
  );
  const [frequencyPenalty, setFrequencyPenalty] = useState<number>(
    customization?.frequencyPenalty ||
      userStore.inferenceSettings.frequencyPenalty ||
      0
  );
  const [modelMemoryLimit, setModelMemoryLimit] = useState<number>(
    customization?.modelMemoryLimit || 15
  );
  const [preferredModel, setPreferredModel] = useState<string>(
    customization?.model || 'Mango Ube'
  );
  const [modelId, setModelId] = useState<string>(
    customization?.model || 'Mango Ube'
  );
  const [maxTokenLimit, setMaxTokenLimit] = useState<number>(
    customization?.maxTokens || userStore.maxTokenLimit || 1000
  );
  const [privateModels, setPrivateModels] = useState<PrivateModels>({});
  const showAlert = usePyrenzAlert();

  const stateSetters = {
    maxTokens: (value: number) => setMaxTokens(Math.min(value, maxTokenLimit)),
    temperature: (value: number) =>
      setTemperature(Math.min(Math.max(value, 0), 2)),
    topP: (value: number) => setTopP(Math.min(Math.max(value, 0), 1)),
    presencePenalty: (value: number) =>
      setPresencePenalty(Math.min(Math.max(value, -2), 2)),
    frequencyPenalty: (value: number) =>
      setFrequencyPenalty(Math.min(Math.max(value, -2), 2)),
    modelMemoryLimit: (value: number) => setModelMemoryLimit(value),
  };

  const isModelPrivate = (modelSlug: string): boolean => {
    return (
      privateModels &&
      Object.values(privateModels).some((pm) => pm.model_name === modelSlug)
    );
  };

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userData: GetUserDataResponse = await GetUserData();
        if ('error' in userData) throw new Error(userData.error);

        setMaxTokenLimit(userData.subscription_data.max_token);

        if (userData.subscription_data.private_models) {
          setPrivateModels(userData.subscription_data.private_models);
        }

        if (userData.preferred_model && userData.preferred_model.slug) {
          setPreferredModel(userData.preferred_model.slug);
          setModelId(userData.preferred_model.slug);
        }
      } catch (error) {
        Sentry.captureException(error);
        showAlert('Error fetching user data. Please try again.', 'Alert');
      }
    };
    fetchUserData();
  }, []);

  const handleSubmit = async () => {
    const inferenceSettings = {
      maxTokens,
      temperature,
      topP,
      presencePenalty,
      frequencyPenalty,
    };

    try {
      const userUUID: string = await GetUserUUID();
      const data = {
        user_uuid: userUUID,
        inference_settings: inferenceSettings,
        slug: preferredModel,
        is_public: !isModelPrivate(preferredModel),
        modelMemoryLimit,
      };

      const response = await Utils.post<any>('/api/ModelSwitch', data);

      if (response?.error) {
        console.error('API Error:', response.error);
        showAlert(response.error, 'Alert');
        return;
      }

      showAlert('Customization data submitted successfully!', 'Success');
    } catch (error) {
      Sentry.captureException(error);
      const errorMessage =
        error instanceof Error ? error.message : 'An unknown error occurred';
      showAlert(errorMessage, 'Alert');
    }
  };

  return {
    maxTokens,
    temperature,
    topP,
    presencePenalty,
    frequencyPenalty,
    modelMemoryLimit,
    preferredModel,
    modelId,
    maxTokenLimit,
    stateSetters,
    handleSubmit,
    setMaxTokens,
    setTemperature,
    setTopP,
    setPresencePenalty,
    setFrequencyPenalty,
    setModelMemoryLimit,
    setPreferredModel,
    setModelId,
    setMaxTokenLimit,
  };
};
