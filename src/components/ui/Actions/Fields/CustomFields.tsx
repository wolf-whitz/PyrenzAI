import { Box } from '@mui/material';
import {
  PyrenzFormControl,
  PyrenzOutlinedInput,
  PyrenzInputLabel,
} from '~/theme';

interface CustomModelFieldsProps {
  apiKey: string;
  setApiKey: (value: string) => void;
  customModelName: string;
  setCustomModelName: (value: string) => void;
  providerUrl: string;
  setProviderUrl: (value: string) => void;
}

export function CustomModelFields({
  apiKey,
  setApiKey,
  customModelName,
  setCustomModelName,
  providerUrl,
  setProviderUrl,
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
          <PyrenzInputLabel htmlFor="provider-url">Provider URL</PyrenzInputLabel>
          <PyrenzOutlinedInput
            id="provider-url"
            value={providerUrl}
            onChange={(e) => setProviderUrl(e.target.value)}
            label="Provider URL"
          />
        </PyrenzFormControl>
      </Box>
    </Box>
  );
}
