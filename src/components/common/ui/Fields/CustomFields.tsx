import { Button, TextField } from '@mui/material';

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
    <div className="mt-4">
      <TextField
        label="API Key"
        variant="outlined"
        fullWidth
        value={apiKey}
        onChange={(e) => setApiKey(e.target.value)}
        className="mb-4"
      />
      <TextField
        label="Model Name"
        variant="outlined"
        fullWidth
        value={customModelName}
        onChange={(e) => setCustomModelName(e.target.value)}
        className="mb-4"
      />
      <TextField
        label="Provider"
        variant="outlined"
        fullWidth
        value={provider?.provider_name || ''}
        onChange={(e) =>
          setProvider({
            ...provider,
            provider_name: e.target.value,
          } as Provider)
        }
        className="mb-4"
      />
      <Button
        variant="outlined"
        color="primary"
        onClick={() => setModalOpen(true)}
        className="mt-2"
      >
        Premade Providers
      </Button>
    </div>
  );
}
