import React, { useState } from 'react';
import { Box, Typography } from '@mui/material';
import { CustomModelFields, ModelSelection, SliderComponent } from '@components';
import InfoIcon from '@mui/icons-material/Info';
import BuildIcon from '@mui/icons-material/Build';
import { PyrenzBlueButton } from '~/theme';
import { useCustomizeAPI } from '@api';

interface ModelOption {
  label: string;
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

const sliderDescriptions = {
  maxTokens: 'Controls the maximum number of tokens in the response.',
  temperature: 'Controls the randomness of the output. Higher values make the output more random.',
  topP: 'Controls the diversity of the output. Higher values make the output more diverse.',
  presencePenalty: 'Penalizes new tokens based on their presence in the input. Higher values make the output more different from the input.',
  frequencyPenalty: 'Penalizes new tokens based on their frequency in the input. Higher values make the output less repetitive.',
};

export function Customization({ customization, subscriptionPlan, modelOptions }: CustomizationProps) {
  const [showPopover, setShowPopover] = useState<keyof typeof sliderDescriptions | null>(null);

  const {
    maxTokens,
    temperature,
    topP,
    presencePenalty,
    frequencyPenalty,
    preferredModel,
    setPreferredModel,
    apiKey,
    setApiKey,
    customModelName,
    setCustomModelName,
    providerUrl,
    setProviderUrl,
    maxTokenLimit,
    stateSetters,
    handleSubmit,
  } = useCustomizeAPI({ customization, subscriptionPlan, modelOptions });

  return (
    <Box>
      <ModelSelection
        preferredModel={preferredModel}
        setPreferredModel={setPreferredModel}
        modelOptions={modelOptions.map(option => ({ value: option.name, label: option.label }))}
      />

      {preferredModel === 'Custom' && (
        <Box>
          <CustomModelFields
            apiKey={apiKey}
            setApiKey={setApiKey}
            customModelName={customModelName}
            setCustomModelName={setCustomModelName}
            providerUrl={providerUrl}
            setProviderUrl={setProviderUrl}
          />
        </Box>
      )}

      <Box border={1} borderColor="grey.300" borderRadius={2} p={2} boxShadow={1}>
        <Box display="flex" alignItems="center" mb={2}>
          <BuildIcon color="action" />
          <Typography variant="subtitle1" component="h2" ml={1}>
            Manual Parameters
          </Typography>
        </Box>
        {Object.entries(sliderDescriptions).map(([key]) => {
          const sliderKey = key as keyof typeof sliderDescriptions;
          const stateValue = {
            maxTokens,
            temperature,
            topP,
            presencePenalty,
            frequencyPenalty,
          }[sliderKey];
          const stateSetter = stateSetters[sliderKey];

          let maxValue;
          switch (sliderKey) {
            case 'maxTokens':
              maxValue = maxTokenLimit;
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
              setShowPopover={setShowPopover as React.Dispatch<React.SetStateAction<string | null>>}
              maxValue={maxValue}
            />
          );
        })}
      </Box>

      <PyrenzBlueButton
        variant="contained"
        onClick={handleSubmit}
        fullWidth
        startIcon={<InfoIcon />}
        sx={{ mt: 2 }}
      >
        Submit
      </PyrenzBlueButton>
    </Box>
  );
}
