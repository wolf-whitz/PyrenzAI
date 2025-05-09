import React, { useState, useEffect, Dispatch, SetStateAction } from 'react';
import { supabase } from '~/Utility/supabaseClient';
import { GetUserUUID } from '~/functions';
import * as Sentry from '@sentry/react';
import toast from 'react-hot-toast';
import { Button, Typography } from '@mui/material';
import { ProviderModals } from '@components/index';
import {
  CustomModelFields,
  ModelSelection,
  SliderComponent,
} from '@components/index';
import InfoIcon from '@mui/icons-material/Info';
import BuildIcon from '@mui/icons-material/Build';

interface Provider {
  provider_name: string;
  provider_website: string;
  provider_api_link: string;
  provider_description: string;
}

const sliderDescriptions = {
  maxTokens: 'Controls the maximum number of tokens in the response.',
  temperature:
    'Controls the randomness of the output. Higher values make the output more random.',
  topP: 'Controls the diversity of the output. Higher values make the output more diverse.',
  presencePenalty:
    'Penalizes new tokens based on their presence in the input. Higher values make the output more different from the input.',
  frequencyPenalty:
    'Penalizes new tokens based on their frequency in the input. Higher values make the output less repetitive.',
};

const modelOptions = [
  { value: 'Mango Ube', label: 'Mango Ube' },
  { value: 'Ube Deluxe', label: 'Ube Deluxe' },
  { value: 'Banana Munch', label: 'Banana Munch' },
  { value: 'Custom', label: 'Custom' },
];

export default function Customization() {
  const [maxTokens, setMaxTokens] = useState(100);
  const [temperature, setTemperature] = useState(1);
  const [topP, setTopP] = useState(1);
  const [presencePenalty, setPresencePenalty] = useState(0);
  const [frequencyPenalty, setFrequencyPenalty] = useState(0);
  const [preferredModel, setPreferredModel] = useState(modelOptions[0].value);
  const [apiKey, setApiKey] = useState('');
  const [customModelName, setCustomModelName] = useState('');
  const [provider, setProvider] = useState<Provider | null>(null);
  const [showPopover, setShowPopover] = useState<
    keyof typeof sliderDescriptions | null
  >(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [modelId, setModelId] = useState<string | null>(null);

  const stateSetters = {
    maxTokens: (value: number) => setMaxTokens(Math.min(value, 1000)),
    temperature: (value: number) =>
      setTemperature(Math.min(Math.max(value, 0), 2)),
    topP: (value: number) => setTopP(Math.min(Math.max(value, 0), 1)),
    presencePenalty: (value: number) =>
      setPresencePenalty(Math.min(Math.max(value, -2), 2)),
    frequencyPenalty: (value: number) =>
      setFrequencyPenalty(Math.min(Math.max(value, -2), 2)),
  };

  useEffect(() => {
    const fetchModelId = async () => {
      try {
        const { data, error } = await supabase
          .from('model_identifiers')
          .select('identifier')
          .eq('subscription_plan', preferredModel)
          .single();

        if (error) {
          throw error;
        }

        if (data) {
          setModelId(data.identifier);
        }
      } catch (error) {
        Sentry.captureException(error);
        toast.error('Error fetching model identifier. Please try again.');
      }
    };

    fetchModelId();
  }, [preferredModel]);

  const handleSubmit = async () => {
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
        provider,
      }),
    };

    const data = {
      inference_settings: JSON.stringify(inferenceSettings),
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

      toast.success('Customization data submitted successfully!');
    } catch (error) {
      Sentry.captureException(error);
      toast.error('Error submitting data. Please try again.');
    }
  };

  const handleProviderSelect = (selectedProvider: Provider) => {
    setProvider(selectedProvider);
    setModalOpen(false);
  };

  return (
    <div className="p-4 space-y-4">
      <ModelSelection
        preferredModel={preferredModel}
        setPreferredModel={setPreferredModel}
        modelOptions={modelOptions}
      />

      {preferredModel === 'Custom' && (
        <CustomModelFields
          apiKey={apiKey}
          setApiKey={setApiKey}
          customModelName={customModelName}
          setCustomModelName={setCustomModelName}
          provider={provider}
          setProvider={setProvider}
          setModalOpen={setModalOpen}
        />
      )}

      <div className="border p-4 rounded-lg shadow-sm">
        <div className="flex items-center mb-4">
          <BuildIcon className="mr-2" />
          <Typography variant="subtitle1" component="h2">
            Manual Parameters
          </Typography>
        </div>
        {Object.keys(sliderDescriptions).map((key) => {
          const sliderKey = key as keyof typeof sliderDescriptions;
          const stateValue = {
            maxTokens,
            temperature,
            topP,
            presencePenalty,
            frequencyPenalty,
          }[sliderKey] as number;
          const stateSetter = stateSetters[sliderKey];

          let maxValue;
          switch (sliderKey) {
            case 'maxTokens':
              maxValue = 1000;
              break;
            case 'temperature':
              maxValue = 2;
              break;
            case 'topP':
              maxValue = 1;
              break;
            case 'presencePenalty':
              maxValue = 2;
              break;
            case 'frequencyPenalty':
              maxValue = 2;
              break;
            default:
              maxValue = undefined;
          }

          return (
            <SliderComponent
              key={sliderKey}
              sliderKey={sliderKey}
              stateValue={stateValue}
              stateSetter={stateSetter}
              sliderDescriptions={sliderDescriptions}
              setShowPopover={
                setShowPopover as Dispatch<SetStateAction<string | null>>
              }
              maxValue={maxValue}
            />
          );
        })}
      </div>

      <Button
        variant="contained"
        color="primary"
        onClick={handleSubmit}
        className="w-full mt-4"
        startIcon={<InfoIcon />}
      >
        Submit
      </Button>

      <ProviderModals
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSelect={handleProviderSelect}
      />
    </div>
  );
}
