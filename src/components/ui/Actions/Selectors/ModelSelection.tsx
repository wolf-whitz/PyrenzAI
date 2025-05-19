import { MenuItem, Select, Box } from '@mui/material';
import { PyrenzFormControl, PyrenzOutlinedInput, PyrenzInputLabel } from '~/theme';

interface ModelSelectionProps {
  preferredModel: string;
  setPreferredModel: (value: string) => void;
  modelOptions: { value: string; label: string }[];
}

export function ModelSelection({
  preferredModel,
  setPreferredModel,
  modelOptions,
}: ModelSelectionProps) {
  return (
    <Box sx={{ mt: 4 }}>
      <PyrenzFormControl fullWidth variant="outlined">
        <PyrenzInputLabel id="preferred-model-label">
          Preferred Model
        </PyrenzInputLabel>
        <Select
          labelId="preferred-model-label"
          id="preferred-model"
          value={preferredModel}
          label="Preferred Model"
          onChange={(e) => setPreferredModel(e.target.value)}
          input={<PyrenzOutlinedInput label="Preferred Model" />}
          sx={{ mb: 4 }}
        >
          {modelOptions.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </Select>
      </PyrenzFormControl>
    </Box>
  );
}
