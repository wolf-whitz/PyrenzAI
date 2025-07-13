import React, { useState } from 'react';
import { Box, Typography } from '@mui/material';
import { ModelSelection, SliderComponent, useCustomizeAPI } from '@components';
import InfoIcon from '@mui/icons-material/Info';
import BuildIcon from '@mui/icons-material/Build';
import { PyrenzBlueButton } from '~/theme';

interface CustomizationProps {
  customization: {
    model: string;
    maxTokens: number;
    temperature: number;
    topP: number;
    presencePenalty: number;
    frequencyPenalty: number;
    modelMemoryLimit?: number;
  } | null;
  subscriptionPlan: string | null;
}

const sliderDescriptions = {
  maxTokens: 'Controls the maximum number of tokens in the response.',
  temperature: 'Controls the randomness of the output. Higher values make the output more random.',
  topP: 'Controls the diversity of the output. Higher values make the output more diverse.',
  presencePenalty: 'Penalizes new tokens based on their presence in the input. Higher values make the output more different from the input.',
  frequencyPenalty: 'Penalizes new tokens based on their frequency in the input. Higher values make the output less repetitive.',
  modelMemoryLimit: 'Adjusts the memory limit for the model.',
};

export function Customization({ customization, subscriptionPlan }: CustomizationProps) {
  const [showPopover, setShowPopover] = useState<keyof typeof sliderDescriptions | null>(null);

  const {
    maxTokens,
    temperature,
    topP,
    presencePenalty,
    frequencyPenalty,
    modelMemoryLimit,
    preferredModel,
    setPreferredModel,
    maxTokenLimit,
    stateSetters,
    handleSubmit,
    modelOptions,
    privateModels,
  } = useCustomizeAPI({ customization, subscriptionPlan });

  return (
    <Box>
      <ModelSelection
        preferredModel={preferredModel}
        setPreferredModel={setPreferredModel}
        modelOptions={modelOptions}
        privateModels={privateModels}
      />
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
            modelMemoryLimit,
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
            case 'modelMemoryLimit':
              maxValue = 50;
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
              step={sliderKey === 'modelMemoryLimit' ? 5 : undefined}
              marks={sliderKey === 'modelMemoryLimit' ? [
                { value: 15, label: '15' },
                { value: 20, label: '20' },
                { value: 30, label: '30' },
                { value: 40, label: '40' },
                { value: 50, label: '50' },
              ] : undefined}
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
