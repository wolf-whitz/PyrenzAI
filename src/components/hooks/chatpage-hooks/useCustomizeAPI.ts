import { useState, useEffect } from 'react';
import { useUserStore } from '~/store';
import { Utils } from '~/Utility';
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
  } | null;
  subscriptionPlan: string | null;
}

interface ModelOption {
  value: string;
  label: string;
  name: string;
  description: string;
  subscription_plan: string;
}

interface PrivateModel {
  model_description: string;
  model_name: string;
}

interface PrivateModels {
  [key: string]: PrivateModel;
}

interface ApiResponse {
  error?: {
    message: string;
  };
}

export const useCustomizeAPI = ({
  customization,
  subscriptionPlan,
}: CustomizationProps) => {
  const userStore = useUserStore();
  const [maxTokens, setMaxTokens] = useState(
    customization?.maxTokens || userStore.inferenceSettings.maxTokens || 100
  );
  const [temperature, setTemperature] = useState(
    customization?.temperature || userStore.inferenceSettings.temperature || 1
  );
  const [topP, setTopP] = useState(
    customization?.topP || userStore.inferenceSettings.topP || 1
  );
  const [presencePenalty, setPresencePenalty] = useState(
    customization?.presencePenalty ||
      userStore.inferenceSettings.presencePenalty ||
      0
  );
  const [frequencyPenalty, setFrequencyPenalty] = useState(
    customization?.frequencyPenalty ||
      userStore.inferenceSettings.frequencyPenalty ||
      0
  );
  const [preferredModel, setPreferredModel] = useState(
    customization?.model || userStore.preferredModel || 'Mango Ube'
  );
  const [modelId, setModelId] = useState(
    customization?.model || userStore.preferredModel || 'Mango Ube'
  );
  const [maxTokenLimit, setMaxTokenLimit] = useState(
    customization?.maxTokens || userStore.maxTokenLimit || 1000
  );
  const [modelOptions, setModelOptions] = useState<ModelOption[]>([]);
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
  };

  const isModelPrivate = (modelName: string) => {
    return privateModels && privateModels[modelName];
  };

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userData = await GetUserData();
        if (userData && 'subscription_data' in userData) {
          setMaxTokenLimit(userData.subscription_data.max_token);
          const models = userData.subscription_data.model || {};
          const options = Object.entries(models).map(
            ([modelName, modelInfo]) => ({
              value: modelName,
              label: modelName,
              name: modelName,
              description: modelInfo.description,
              subscription_plan: modelInfo.plan,
            })
          );
          setModelOptions(options);
          if (userData.subscription_data.private_models) {
            setPrivateModels(userData.subscription_data.private_models);
          }
          if (userData.preferred_model) {
            const preferredModelFromData = userData.preferred_model;
            setPreferredModel(preferredModelFromData);
            setModelId(preferredModelFromData);
          }
        }
      } catch (error) {
        Sentry.captureException(error);
        showAlert('Error fetching user data. Please try again.', 'Alert');
      }
    };
    fetchUserData();
  }, []);

  const handleSubmit = async () => {
    if (
      subscriptionPlan &&
      modelOptions.some(
        (option) => option.subscription_plan === subscriptionPlan
      )
    ) {
      if (!modelOptions.find((option) => option.name === preferredModel)) {
        showAlert(
          `This model is currently limited to users with Pyrenz+ ${preferredModel}, please use another model.`,
          'Alert'
        );
        return;
      }
    }

    const inferenceSettings = {
      maxTokens,
      temperature,
      topP,
      presencePenalty,
      frequencyPenalty,
    };

    try {
      const userUUID = await GetUserUUID();
      const data = {
        user_uuid: userUUID,
        inference_settings: inferenceSettings,
        preferred_model: preferredModel,
        is_public: !isModelPrivate(preferredModel),
      };

      const response = (await Utils.post(
        '/api/ModelSwitch',
        data
      )) as ApiResponse;
      if (response.error) {
        throw new Error(response.error.message);
      }
      showAlert('Customization data submitted successfully!', 'Success');
    } catch (error) {
      Sentry.captureException(error);
      const errorMessage =
        error instanceof Error ? error.message : 'An unknown error occurred.';
      showAlert(errorMessage, 'Alert');
    }
  };

  return {
    maxTokens,
    setMaxTokens,
    temperature,
    setTemperature,
    topP,
    setTopP,
    presencePenalty,
    setPresencePenalty,
    frequencyPenalty,
    setFrequencyPenalty,
    preferredModel,
    setPreferredModel,
    modelId,
    setModelId,
    maxTokenLimit,
    setMaxTokenLimit,
    stateSetters,
    handleSubmit,
    modelOptions,
    privateModels,
  };
};
