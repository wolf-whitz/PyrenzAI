import React, { useState, Dispatch, SetStateAction } from 'react';
import { supabase } from '~/Utility/supabaseClient';
import { GetUserUUID } from '~/functions';
import * as Sentry from '@sentry/react';
import toast from 'react-hot-toast';
import { Button } from '@mui/material';
import { ProviderModals } from '@components/index';
import {
  CustomModelFields,
  ModelSelection,
  SliderComponent,
} from '@components/index';

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
  const [temperature, setTemperature] = useState(100);
  const [topP, setTopP] = useState(100);
  const [presencePenalty, setPresencePenalty] = useState(100);
  const [frequencyPenalty, setFrequencyPenalty] = useState(100);
  const [preferredModel, setPreferredModel] = useState(modelOptions[0].value);
  const [apiKey, setApiKey] = useState('');
  const [customModelName, setCustomModelName] = useState('');
  const [provider, setProvider] = useState<Provider | null>(null);
  const [showPopover, setShowPopover] = useState<
    keyof typeof sliderDescriptions | null
  >(null);
  const [modalOpen, setModalOpen] = useState(false);

  const stateSetters = {
    maxTokens: setMaxTokens,
    temperature: setTemperature,
    topP: setTopP,
    presencePenalty: setPresencePenalty,
    frequencyPenalty: setFrequencyPenalty,
  };

  const handleSubmit = async () => {
    const data = {
      maxTokens,
      temperature,
      topP,
      presencePenalty,
      frequencyPenalty,
      preferred_model: preferredModel,
      ...(preferredModel === 'Custom' && {
        api_key: apiKey,
        custom_model_name: customModelName,
        provider,
      }),
    };

    try {
      const userUUID = GetUserUUID();
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
    <div className="p-4 space-y-4 relative">
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
          />
        );
      })}

      {showPopover && (
        <div
          className="absolute bg-gray-800 text-white text-sm rounded p-2 z-10"
          style={{ top: '20px', left: '50%', transform: 'translateX(-50%)' }}
        >
          {sliderDescriptions[showPopover]}
          <button
            onClick={() => setShowPopover(null)}
            className="absolute top-0 right-0 mt-1 mr-1 text-gray-400 hover:text-gray-300 focus:outline-none"
          >
            &times;
          </button>
        </div>
      )}

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

      <Button
        variant="contained"
        color="primary"
        onClick={handleSubmit}
        className="w-full mt-4"
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
