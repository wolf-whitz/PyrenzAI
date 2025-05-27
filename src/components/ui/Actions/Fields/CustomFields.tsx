import { Box } from '@mui/material';
import {
  PyrenzFormControl,
  PyrenzOutlinedInput,
  PyrenzInputLabel,
  PyrenzBlueButton,
} from '~/theme';

interface Provider {
  provider_name: string;
  provider_website: string;
  provider_api_link: string;
  provider_description: string;
}

interface CustomModelFieldsProps {
  apiKey: string;
  setApiKey: (value: string) => void;
  customModelName: string;
  setCustomModelName: (value: string) => void;
  provider: Provider | null;
  setProvider: (value: Provider | null) => void;
  setModalOpen: (value: boolean) => void;
}

export function CustomModelFields({
  apiKey,
  setApiKey,
  customModelName,
  setCustomModelName,
  provider,
  setProvider,
  setModalOpen,
}: CustomModelFieldsProps) {
  return (
    <Box>
      <Box mb={2}>
        <PyrenzFormControl fullWidth variant="outlined">
          <PyrenzInputLabel htmlFor="api-key">API Key</PyrenzInputLabel>
          <PyrenzOutlinedInput
            id="api-key"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            label="API Key"
          />
        </PyrenzFormControl>
      </Box>

      <Box mb={2}>
        <PyrenzFormControl fullWidth variant="outlined">
          <PyrenzInputLabel htmlFor="model-name">Model Name</PyrenzInputLabel>
          <PyrenzOutlinedInput
            id="model-name"
            value={customModelName}
            onChange={(e) => setCustomModelName(e.target.value)}
            label="Model Name"
          />
        </PyrenzFormControl>
      </Box>

      <Box mb={2}>
        <PyrenzFormControl fullWidth variant="outlined">
          <PyrenzInputLabel htmlFor="provider">Provider</PyrenzInputLabel>
          <PyrenzOutlinedInput
            id="provider"
            value={provider?.provider_name || ''}
            onChange={(e) =>
              setProvider({
                ...provider,
                provider_name: e.target.value,
              } as Provider)
            }
            label="Provider"
          />
        </PyrenzFormControl>
      </Box>

      <PyrenzBlueButton
        variant="outlined"
        color="primary"
        onClick={() => setModalOpen(true)}
        sx={{ mb: 2 }}
      >
        Premade Providers
      </PyrenzBlueButton>
    </Box>
  );
}
