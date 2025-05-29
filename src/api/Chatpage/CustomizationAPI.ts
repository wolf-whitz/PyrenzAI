import { useState, useEffect } from 'react';
import { supabase } from '~/Utility/supabaseClient';
import * as Sentry from '@sentry/react';
import { GetUserUUID, GetUserData } from '@components';
import { usePyrenzAlert } from '~/provider';

interface ModelOption {
  name: string;
}

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
  modelOptions: ModelOption[];
}

export const useCustomizeAPI = ({ customization, subscriptionPlan, modelOptions }: CustomizationProps) => {
  const [maxTokens, setMaxTokens] = useState(customization?.maxTokens || 100);
  const [temperature, setTemperature] = useState(customization?.temperature || 1);
  const [topP, setTopP] = useState(customization?.topP || 1);
  const [presencePenalty, setPresencePenalty] = useState(customization?.presencePenalty || 0);
  const [frequencyPenalty, setFrequencyPenalty] = useState(customization?.frequencyPenalty || 0);
  const [preferredModel, setPreferredModel] = useState(customization?.model || 'Mango Ube');
  const [apiKey, setApiKey] = useState('');
  const [customModelName, setCustomModelName] = useState('');
  const [providerUrl, setProviderUrl] = useState('');
  const [modelId, setModelId] = useState<string | null>(customization?.model || 'Mango Ube');
  const [maxTokenLimit, setMaxTokenLimit] = useState(customization?.maxTokens || 1000);
  const [subscriptionModels, setSubscriptionModels] = useState<{ [key: string]: string[] }>({});

  const showAlert = usePyrenzAlert();

  const stateSetters = {
    maxTokens: (value: number) => setMaxTokens(Math.min(value, maxTokenLimit)),
    temperature: (value: number) => setTemperature(Math.min(Math.max(value, 0), 2)),
    topP: (value: number) => setTopP(Math.min(Math.max(value, 0), 1)),
    presencePenalty: (value: number) => setPresencePenalty(Math.min(Math.max(value, -2), 2)),
    frequencyPenalty: (value: number) => setFrequencyPenalty(Math.min(Math.max(value, -2), 2)),
  };

  useEffect(() => {
    const fetchModelId = async () => {
      if (preferredModel === 'Custom') {
        return;
      }

      try {
        const modelOption = modelOptions.find((option) => option.name === preferredModel);
        if (modelOption) {
          setModelId(modelOption.name);
        }
      } catch (error) {
        Sentry.captureException(error);
        showAlert('Error fetching model name. Please try again.', 'Alert');
      }
    };

    fetchModelId();
  }, [preferredModel, modelOptions]);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userData = await GetUserData();
        if (userData && 'subscription_data' in userData) {
          setMaxTokenLimit(userData.subscription_data.max_token);
          const models = userData.subscription_data.model || [];
          setSubscriptionModels({ [userData.subscription_data.tier]: models.sort() });
        }
      } catch (error) {
        Sentry.captureException(error);
        showAlert('Error fetching user data. Please try again.', 'Alert');
      }
    };

    fetchUserData();
  }, []);

  const handleSubmit = async () => {
    if (preferredModel !== 'Custom' && subscriptionPlan && !subscriptionModels[subscriptionPlan]?.includes(preferredModel)) {
      showAlert(`This model is currently limited to users with Pyrenz+ ${preferredModel}, please use another model.`, 'Alert');
      return;
    }

    const inferenceSettings = {
      model: modelId || preferredModel,
      maxTokens,
      temperature,
      topP,
      presencePenalty,
      frequencyPenalty,
      ...(preferredModel === 'Custom' && {
        api_key: apiKey,
        custom_model_name: customModelName,
        provider_url: providerUrl,
      }),
    };

    const data = {
      inference_settings: inferenceSettings,
    };

    try {
      const userUUID = await GetUserUUID();
      const { error } = await supabase
        .from('user_data')
        .update(data)
        .eq('user_uuid', userUUID);

      if (error) {
        throw error;
      }

      showAlert('Customization data submitted successfully!', 'Success');
    } catch (error) {
      Sentry.captureException(error);
      showAlert('Error submitting data. Please try again.', 'Alert');
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
    apiKey,
    setApiKey,
    customModelName,
    setCustomModelName,
    providerUrl,
    setProviderUrl,
    modelId,
    setModelId,
    maxTokenLimit,
    setMaxTokenLimit,
    stateSetters,
    handleSubmit,
  };
};
